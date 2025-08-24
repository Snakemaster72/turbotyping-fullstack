import { io } from "socket.io-client";
import { SOCKET_EVENTS } from "./events";

// connecting to backend
const SOCKET_URL = "http://localhost:5000"; // developer

export const socket = io(SOCKET_URL, {
  autoConnect: false,
});

// --- Emitter Functions ---
export const joinRoom = (data) => {
  socket.emit(SOCKET_EVENTS.JOIN_ROOM, data); // { roomId, username }
};

export const createRoom = (data) => {
  socket.emit(SOCKET_EVENTS.CREATE_ROOM, data);
};

export const startGame = (roomId) => {
  socket.emit(SOCKET_EVENTS.START_GAME, roomId);
};
export const sendProgress = (data) => {
  socket.emit(SOCKET_EVENTS.SEND_PROGRESS, data); // { roomId, progress }
};

// Return the functions so components can use them
