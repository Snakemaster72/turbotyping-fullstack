import { io } from "socket.io-client";
import { SOCKET_EVENTS } from "./events";

// In dev, always connect to the local backend directly.
// In production, use VITE_SOCKET_URL if set, otherwise fall back to VITE_API_URL.
const SOCKET_URL = import.meta.env.DEV
  ? "http://localhost:5000"
  : (import.meta.env.VITE_SOCKET_URL || import.meta.env.VITE_API_URL || "http://localhost:5000").replace(/\/+$/, "");

export const socket = io(SOCKET_URL, {
  autoConnect: false,
});

// --- Emitter Functions ---
export const joinRoom = (data) => {
  socket.emit(SOCKET_EVENTS.JOIN_ROOM, data); // { roomId, username }
};

export const createRoom = (data) => {
  socket.emit(SOCKET_EVENTS.CREATE_ROOM, data); // { username, maxPlayer, count }
};

export const startGame = (roomId) => {
  socket.emit(SOCKET_EVENTS.START_GAME, roomId);
};

export const sendProgress = (data) => {
  socket.emit(SOCKET_EVENTS.SEND_PROGRESS, data); // { roomId, username, progress, wpm }
};

export const getRoomState = (roomId) => {
  socket.emit(SOCKET_EVENTS.GET_ROOM_STATE, roomId);
};
