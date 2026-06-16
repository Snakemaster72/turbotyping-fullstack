import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  roomId: null,
  host: "",
  players: [],
  maxPlayer: 0,
  status: "waiting",
  prompt: "",
  myProgress: 0,
};

const multiplayerSlice = createSlice({
  name: "multiplayer",
  initialState,

  reducers: {
    reset: () => initialState,
    setRoomState: (state, action) => {
      const { roomId, players, maxPlayer, status } = action.payload;
      state.roomId = roomId;
      state.players = players;
      state.maxPlayer = maxPlayer;
      state.status = status;
    },
    setPlayers: (state, action) => {
      state.players = action.payload;
    },
    addPlayer: (state, action) => {
      state.players.push(action.payload); // Assumes payload is a player
    },
    removePlayer: (state, action) => {
      // Assumes payload is the id of the player to remove

      state.players = state.players.filter(
        (player) => player.id !== action.payload,
      );
    },
    setHost: (state, action) => {
      state.host = action.payload;
    },
    setPrompt: (state, action) => {
      state.prompt = action.payload;
    },
    setStatus: (state, action) => {
      state.status = action.payload;
    },
    setMyProgress: (state, action) => {
      state.myProgress = action.payload;
    },
  },
});

export const {
  reset,
  setRoomState,
  setPlayers,
  addPlayer,
  removePlayer,
  setHost,
  setPrompt,
  setStatus,
  setMyProgress,
} = multiplayerSlice.actions;
export default multiplayerSlice.reducer;
