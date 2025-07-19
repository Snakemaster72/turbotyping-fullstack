import { io } from "socket.io-client";

// connecting to backend
const SOCKET_URL = "http://localhost:5000"; // developer

export const socket = io(SOCKET_URL, {
  autoConnect: false,
});
