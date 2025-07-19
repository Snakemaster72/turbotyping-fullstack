//Connect socket on mount(when multiplayer page loads)
//set up listeners ? what
//dispatch redux actions when events are received

import { useEffect, useCallback } from "react";
import { socket } from "./socket";
import { useDispatch } from "react-redux";
import { SOCKET_EVENTS } from "./events"; // <-- Import constants

import {
  setRoomState,
  setPlayers, // <-- Renamed for clarity in previous steps
  setPrompt,
  setStatus,
} from "../features/multiplayer/multiplayer"; // <-- Assuming file is named multiplayerSlice.js

const useMultiplayerSocket = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    if (!socket.connected) {
      socket.connect();
    }

    const onPlayerJoined = (data) => dispatch(setRoomState(data));
    const onUpdatePlayers = (players) => dispatch(setPlayers(players));
    const onReceivePrompt = (prompt) => dispatch(setPrompt(prompt));
    const onGameStatus = (status) => dispatch(setStatus(status));

    // Listeners
    socket.on(SOCKET_EVENTS.PLAYER_JOINED, onPlayerJoined);
    socket.on(SOCKET_EVENTS.UPDATE_PLAYERS, onUpdatePlayers);
    socket.on(SOCKET_EVENTS.RECEIVE_PROMPT, onReceivePrompt);
    socket.on(SOCKET_EVENTS.GAME_STATUS, onGameStatus);

    return () => {
      // Cleanup
      socket.off(SOCKET_EVENTS.PLAYER_JOINED, onPlayerJoined);
      socket.off(SOCKET_EVENTS.UPDATE_PLAYERS, onUpdatePlayers);
      socket.off(SOCKET_EVENTS.RECEIVE_PROMPT, onReceivePrompt);
      socket.off(SOCKET_EVENTS.GAME_STATUS, onGameStatus);
    };
  }, [dispatch]);

  // --- Emitter Functions ---
  const joinRoom = useCallback((data) => {
    socket.emit(SOCKET_EVENTS.JOIN_ROOM, data); // { roomId, username }
  }, []);

  const createRoom = useCallback(() => {
    socket.emit(SOCKET_EVENTS.CREATE_ROOM);
  }, []);

  const startGame = useCallback((roomId) => {
    socket.emit(SOCKET_EVENTS.START_GAME, roomId);
  }, []);

  const sendProgress = useCallback((data) => {
    socket.emit(SOCKET_EVENTS.SEND_PROGRESS, data); // { roomId, progress }
  }, []);

  // Return the functions so components can use them
  return { joinRoom, startGame, sendProgress };
};

export default useMultiplayerSocket;
