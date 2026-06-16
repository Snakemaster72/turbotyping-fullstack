//for ease of handling of socket names to prevent typos

export const SOCKET_EVENTS = {
  // Client → Server
  CREATE_ROOM: "create_room",
  JOIN_ROOM: "join_room",
  GET_ROOM_STATE: "get_room_state",
  START_GAME: "start_game",
  SEND_PROGRESS: "send_progress",

  // Server → Client
  ROOM_CREATED: "room_created",
  PLAYER_JOINED: "player_joined",
  UPDATE_PLAYERS: "update_players",
  RECEIVE_PROMPT: "receive_prompt",
  GAME_STATUS: "game_status",
  ROOM_STATE: "room_state",
  START_COUNTDOWN: "start_countdown",
  GAME_START: "game_start",
  JOIN_ERROR: "join_error",
  GAME_OVER: "game_over",
};
