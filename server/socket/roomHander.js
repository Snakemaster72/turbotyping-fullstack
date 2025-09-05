import { nanoid } from "nanoid";
import { generatePrompt } from "../utils/promptGenMultiplayer.js";
import { rooms } from "./store/roomStore.js";
import { createRoomObject } from "./utils/createRoomObject.js";

// The data parameter is not needed here
export const handleRoomEvents = (socket, io) => {
  // Pass data directly to the createRoom function
  const createRoom = (data) => {
    const { username, maxPlayer, count } = data;
    const roomId = nanoid(6).toUpperCase();

    const prompt = generatePrompt(count);
    const room = createRoomObject({
      roomId,
      username,
      socketId: socket.id,
      maxPlayer,
      prompt,
    });

    rooms.set(roomId, room);
    socket.join(roomId);

    // Emit the updated room state to everyone in the room
    io.to(roomId).emit("player_joined", {
      players: [...room.players],
      roomId,
      maxPlayer: room.maxPlayer,
      status: room.status,
      prompt: room.prompt,
    });

    // Check if room is full and start countdown
    if (room.players.length === room.maxPlayer) {
      io.to(roomId).emit("start_countdown", { seconds: 5 });
      setTimeout(() => {
        io.to(roomId).emit("game_start", { roomId });
      }, 5000);
    }
  };


  // Set up the listener for creating a room
  socket.on("create_room", (data) => {
    console.log("Debug: create_room event received");
    // if correct data is received, log it and create
    console.log("Creating room with data:", data);
    createRoom(data);
  });

  // Listener for joining a room
  socket.on("join_room", (data) => {
    const { roomId, username } = data;
    const room = rooms.get(roomId);
    if (!room) {
      socket.emit("join_error", { message: "Room not found" });
      return;
    }
    // Don't allow join if game has started
    if (room.status === "started") {
      socket.emit("join_error", { message: "Game already started" });
      return;
    }
    // Prevent duplicate join
    if (!room.players.find((p) => p.socketId === socket.id)) {
      room.players.push({ username, socketId: socket.id });
      socket.join(roomId);
    }
    // Emit updated room state
    console.log(`Room ${roomId} players:`, room.players.map(p => p.username));
    io.to(roomId).emit("player_joined", {
      players: [...room.players],
      roomId,
      maxPlayer: room.maxPlayer,
      status: room.status,
      prompt: room.prompt,
    });

    // If room is now full, start countdown
    if (room.players.length === room.maxPlayer) {
      io.to(roomId).emit("start_countdown", { seconds: 5 });
      // Mark room as started after countdown
      setTimeout(() => {
        room.status = "started";
        io.to(roomId).emit("game_start", { roomId });
      }, 5000);
    }
  });

  // Listener for getting current room state
  socket.on("get_room_state", (roomId) => {
    const room = rooms.get(roomId);
    if (room) {
      socket.emit("room_state", {
        players: [...room.players],
        roomId,
        maxPlayer: room.maxPlayer,
        status: room.status,
        prompt: room.prompt,
      });
    }
  });

  // This listener is now correctly set up only once per connection
  socket.on("player_joined_debug", (data) => {
    console.log("Debug: A player has joined", data);
  });
};
