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
    });
  };

  // Set up the listener for creating a room
  socket.on("create_room", (data) => {
    console.log("Debug: create_room event received");
    // if correct data is received, log it and create
    console.log("Creating room with data:", data);
    createRoom(data);
});

  // This listener is now correctly set up only once per connection
  socket.on("player_joined_debug", (data) => {
    console.log("Debug: A player has joined", data);
  });
};
