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
    socket.on("player_joined", (data) => {
      // Only redirect if the joined room matches the entered roomId
      if (data.roomId === roomId) {
        navigate(`/play/multiplayer/room/${data.roomId}`);
      }
    });
    return () => socket.off("player_joined");
  }, [roomId, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!roomId) {
      setError("Please enter a room ID.");
      return;
    }
    setError("");
    // If user is logged in, use their username from auth state
    const joinData = user ? { roomId, username: user.username } : { roomId, username };
    joinRoom(joinData);
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded p-8 w-full max-w-md space-y-6"
      >
        <h2 className="text-2xl font-bold text-center">Join a Room</h2>
        <div>
          <label className="block text-sm font-medium mb-1">Room ID</label>
          <input
            type="text"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2"
            placeholder="Enter Room ID"
          />
        </div>
        {!user && (
          <div>
            <label className="block text-sm font-medium mb-1">Username (optional)</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2"
              placeholder="Enter Username"
            />
          </div>
        )}
        {error && <div className="text-red-500 text-sm">{error}</div>}
        <button
          type="submit"
          className="w-full border hover:bg-gray-200 rounded py-2 transition"
        >
          Join Room
        </button>
      </form>
    </div>
  );
};

export default JoinRoom;
