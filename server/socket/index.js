import { handleRoomEvents } from "./roomHander.js";

export default function setupSocketHandlers(io) {
  io.on("connection", (socket) => {
    console.log("New socket:", socket.id);
    handleRoomEvents(socket, io);

    // ...
  });
}
