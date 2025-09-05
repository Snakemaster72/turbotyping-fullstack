export function createRoomObject({
  roomId,
  socketId,
  username,
  prompt,
  maxPlayer,
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
    maxPlayer,
    status: "waiting",
    createdAt: Date.now(),
  };
}
