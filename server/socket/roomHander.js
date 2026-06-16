import { generatePrompt } from "../utils/promptGenMultiplayer.js";

// In-memory room store. NOTE: not persisted; multiplayer results are
// intentionally never written to the GameResult / leaderboard collections.
const rooms = new Map();

const ROOM_ID_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

function generateRoomId() {
  let id;
  do {
    id = "";
    for (let i = 0; i < 6; i++) {
      id += ROOM_ID_CHARS[Math.floor(Math.random() * ROOM_ID_CHARS.length)];
    }
  } while (rooms.has(id));
  return id;
}

function buildLeaderboard(room) {
  return [...room.players]
    .sort((a, b) => {
      // Finished players first, ordered by finishTime; unfinished by progress.
      if (a.finished && b.finished) return a.finishTime - b.finishTime;
      if (a.finished) return -1;
      if (b.finished) return 1;
      return (b.progress || 0) - (a.progress || 0);
    })
    .map((p) => ({
      username: p.username,
      wpm: p.wpm || 0,
      time: p.finishTime,
    }));
}

export default function setupSocketHandlers(io) {
  io.on("connection", (socket) => {
    socket.on("create_room", ({ username, maxPlayer, count }) => {
      const roomId = generateRoomId();
      const prompt = generatePrompt({ type: "classic", count });
      const safeUsername = username || "Guest";

      const room = {
        roomId,
        hostSocketId: socket.id,
        hostUsername: safeUsername,
        players: [
          {
            socketId: socket.id,
            username: safeUsername,
            progress: 0,
            wpm: 0,
            finished: false,
            finishTime: null,
          },
        ],
        maxPlayers: parseInt(maxPlayer, 10) || 2,
        wordCount: parseInt(count, 10) || 0,
        prompt,
        status: "waiting",
        gameStartTime: null,
      };

      rooms.set(roomId, room);
      socket.join(roomId);

      socket.emit("room_created", {
        roomId,
        players: room.players,
        maxPlayers: room.maxPlayers,
        prompt: room.prompt,
      });
    });

    socket.on("join_room", ({ roomId, username }) => {
      const room = rooms.get(roomId);
      if (!room) {
        socket.emit("join_error", { message: "Room not found." });
        return;
      }
      if (room.status !== "waiting") {
        socket.emit("join_error", { message: "Game already started." });
        return;
      }

      const safeUsername = username || "Guest";
      const existing = room.players.find((p) => p.username === safeUsername);

      if (existing) {
        // Reconnect case: update socket id and rejoin the socket room.
        existing.socketId = socket.id;
        if (room.hostUsername === safeUsername) {
          room.hostSocketId = socket.id;
        }
      } else {
        if (room.players.length >= room.maxPlayers) {
          socket.emit("join_error", { message: "Room is full." });
          return;
        }
        room.players.push({
          socketId: socket.id,
          username: safeUsername,
          progress: 0,
          wpm: 0,
          finished: false,
          finishTime: null,
        });
      }

      socket.join(roomId);
      io.to(roomId).emit("player_joined", {
        roomId,
        players: room.players,
        maxPlayers: room.maxPlayers,
      });
    });

    socket.on("get_room_state", (roomId) => {
      const room = rooms.get(roomId);
      if (!room) {
        socket.emit("join_error", { message: "Room not found." });
        return;
      }
      socket.emit("room_state", {
        roomId: room.roomId,
        players: room.players,
        prompt: room.prompt,
        status: room.status,
        maxPlayers: room.maxPlayers,
        isHost: room.hostSocketId === socket.id,
      });
    });

    socket.on("start_game", (roomId) => {
      const room = rooms.get(roomId);
      if (!room) {
        socket.emit("join_error", { message: "Room not found." });
        return;
      }
      if (socket.id !== room.hostSocketId) return;
      if (room.status !== "waiting") return;
      if (room.players.length < 2) {
        socket.emit("join_error", {
          message: "Need at least 2 players to start.",
        });
        return;
      }

      room.status = "countdown";

      let seconds = 3;
      io.to(roomId).emit("start_countdown", { seconds });

      const interval = setInterval(() => {
        seconds -= 1;
        if (seconds > 0) {
          io.to(roomId).emit("start_countdown", { seconds });
        } else {
          clearInterval(interval);
          room.status = "playing";
          room.gameStartTime = Date.now();
          io.to(roomId).emit("game_start");
        }
      }, 1000);
    });

    socket.on("send_progress", ({ roomId, username, progress, wpm }) => {
      const room = rooms.get(roomId);
      if (!room) return;

      const player = room.players.find((p) => p.username === username);
      if (!player) return;

      player.progress = progress;
      player.wpm = wpm;

      if (progress >= 100 && !player.finished) {
        player.finished = true;
        player.finishTime = room.gameStartTime
          ? (Date.now() - room.gameStartTime) / 1000
          : 0;
      }

      io.to(roomId).emit("update_players", room.players);

      if (room.players.length > 0 && room.players.every((p) => p.finished)) {
        room.status = "finished";
        io.to(roomId).emit("game_over", buildLeaderboard(room));
      }
    });

    socket.on("disconnect", () => {
      for (const [roomId, room] of rooms.entries()) {
        const idx = room.players.findIndex((p) => p.socketId === socket.id);
        if (idx === -1) continue;

        const wasHost = room.players[idx].socketId === room.hostSocketId;
        room.players.splice(idx, 1);

        if (room.players.length === 0) {
          rooms.delete(roomId);
          continue;
        }

        if (wasHost) {
          room.hostSocketId = room.players[0].socketId;
          room.hostUsername = room.players[0].username;
        }

        io.to(roomId).emit("player_joined", {
          roomId,
          players: room.players,
          maxPlayers: room.maxPlayers,
        });
      }
    });
  });
}
