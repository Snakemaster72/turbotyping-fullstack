export function createRoomObject({
  roomId,
  socketId,
  username,
  prompt,
  maxPlayers,
}) {
  return {
    roomId,
    players: [
      {
        socketId,
        username,
        wpm: 0,
        isFinished: false,
      },
    ],
    prompt,
    maxPlayers,
    status: "waiting",
    createdAt: Date.now(),
  };
}
