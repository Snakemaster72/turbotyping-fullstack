import { useState, useEffect } from "react";
import { getUsername } from "../../../utils/getUsername";
import { useNavigate } from "react-router-dom";
import { socket, createRoom } from "../../../socket/socket";

const CreateRoom = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState(null);
  const [maxPlayer, setMaxPlayer] = useState(2);
  const [count, setCount] = useState(30);
  const [isLoading, setIsLoading] = useState(true);
  const [isPending, setIsPending] = useState(false);

  useEffect(() => {
    if (!socket.connected) socket.connect();

    const fetchUsername = async () => {
      try {
        const usernameData = await getUsername();
        setUsername(usernameData?.username ?? null);
      } catch (error) {
        setUsername(null);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUsername();

    const onRoomCreated = (data) => {
      navigate(`/play/multiplayer/room/${data.roomId}`);
    };
    const onConnectError = () => setIsPending(false);

    socket.on("room_created", onRoomCreated);
    socket.on("connect_error", onConnectError);

    return () => {
      socket.off("room_created", onRoomCreated);
      socket.off("connect_error", onConnectError);
    };
  }, [navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isPending) return;
    setIsPending(true);
    const guestName =
      sessionStorage.getItem("mp_guest_name") ||
      (() => {
        const name = `Guest_${Math.random().toString(36).slice(2, 6)}`;
        sessionStorage.setItem("mp_guest_name", name);
        return name;
      })();
    createRoom({
      username: username || guestName,
      maxPlayer,
      count,
    });
  };

  const renderUserStatus = () => {
    if (isLoading) return "Loading...";
    if (username) return `Join as ${username}`;
    return "Join as a Guest";
  };

  return (
    <div className="flex items-center justify-center h-screen bg-[#1d2021] text-[#ebdbb2]">
      <form
        onSubmit={handleSubmit}
        className="bg-[#282828] border border-[#504945] shadow-md rounded-lg p-8 w-full max-w-md space-y-6"
      >
        <h2 className="text-2xl font-bold text-center">Create a New Room</h2>

        <div>
          <label className="block text-sm font-medium mb-1 text-[#a89984]">
            {renderUserStatus()}
          </label>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Max Players</label>
          <select
            value={maxPlayer}
            onChange={(e) => setMaxPlayer(parseInt(e.target.value))}
            className="w-full bg-[#1d2021] border border-[#504945] rounded px-3 py-2 text-[#ebdbb2]"
          >
            {[2, 3, 4, 5].map((num) => (
              <option key={num} value={num}>
                {num}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Prompt Word Count
          </label>
          <select
            value={count}
            onChange={(e) => setCount(parseInt(e.target.value))}
            className="w-full bg-[#1d2021] border border-[#504945] rounded px-3 py-2 text-[#ebdbb2]"
          >
            {[15, 30, 60].map((num) => (
              <option key={num} value={num}>
                {num}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="w-full bg-[#b8bb26] text-[#1d2021] font-bold rounded py-2 transition hover:bg-[#a9b126] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPending ? "Creating..." : "Create Room"}
        </button>
      </form>
    </div>
  );
};

export default CreateRoom;
