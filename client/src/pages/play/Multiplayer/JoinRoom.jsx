import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { socket, joinRoom } from "../../../socket/socket";

const JoinRoom = () => {
  const [roomId, setRoomId] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    if (!socket.connected) socket.connect();

    const onPlayerJoined = (data) => {
      navigate(`/play/multiplayer/room/${data.roomId}`);
    };
    const onJoinError = (msg) => {
      setError(msg?.message || "Unable to join room.");
    };

    socket.on("player_joined", onPlayerJoined);
    socket.on("join_error", onJoinError);

    return () => {
      socket.off("player_joined", onPlayerJoined);
      socket.off("join_error", onJoinError);
    };
  }, [navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!roomId) {
      setError("Please enter a room code.");
      return;
    }
    setError("");
    const nameToSend = user ? user.username : username || "Guest";
    joinRoom({ roomId: roomId.trim().toUpperCase(), username: nameToSend });
  };

  return (
    <div className="flex items-center justify-center h-screen bg-[#1d2021] text-[#ebdbb2]">
      <form
        onSubmit={handleSubmit}
        className="bg-[#282828] border border-[#504945] shadow-md rounded-lg p-8 w-full max-w-md space-y-6"
      >
        <h2 className="text-2xl font-bold text-center">Join a Room</h2>
        <div>
          <label className="block text-sm font-medium mb-1">Room Code</label>
          <input
            type="text"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
            className="w-full bg-[#1d2021] border border-[#504945] rounded px-3 py-2 text-[#ebdbb2] uppercase"
            placeholder="Enter Room Code"
          />
        </div>
        {!user && (
          <div>
            <label className="block text-sm font-medium mb-1">
              Username (optional)
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-[#1d2021] border border-[#504945] rounded px-3 py-2 text-[#ebdbb2]"
              placeholder="Enter Username"
            />
          </div>
        )}
        {error && <div className="text-[#fb4934] text-sm font-bold">{error}</div>}
        <button
          type="submit"
          className="w-full bg-[#b8bb26] text-[#1d2021] font-bold hover:bg-[#a9b126] rounded py-2 transition"
        >
          Join Room
        </button>
      </form>
    </div>
  );
};

export default JoinRoom;
