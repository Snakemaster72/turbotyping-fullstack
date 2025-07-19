import { configureStore } from "@reduxjs/toolkit";

import authReducer from "../features/auth/authSlice.js";
import multiplayerReducer from "../features/multiplayer/multiplayer.js";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    multiplayer: multiplayerReducer,
  },
});
