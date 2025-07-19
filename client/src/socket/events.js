//for ease of handling of socket names to prevent typos

export const SOCKET_EVENTS = {
  //Events from server
  PLAYER_JOINED: "player_joined",
  UPDATE_PLAYERS: "update_players",
  RECEIVE_PROMPT: "receive_prompt",
  GAME_STATUS: "game_status",

  //EVENTS from client
  JOIN_ROOM: "join_room",
  START_GAME: "start_game",
  SEND_PROGRESS: "send_progress",
  CREATE_ROOM: "create_room",
};
