import { useState, useEffect } from "react";
import { getUsername } from "../../../utils/getUsername";
import useMultiplayerSocket from "../../../socket/useMultiplayerSocket";
import { useNavigate } from "react-router-dom";

const CreateRoom = () => {
  const [username, setUsername] = useState({});
  const [maxPlayer, setMaxPlayer] = useState(2);
  const [count, setCount] = useState(50);
  const { createRoom } = useMultiplayerSocket();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 1. Define an async function inside the effect
    const fetchUsername = async () => {
      try {
        const usernameData = await getUsername();
        //console.log(usernameData);
        setUsername(usernameData.username);
      } catch (error) {
        console.log(error);
        setUsername(null);
      } finally {
        setIsLoading(false);
      }
    };

    // 2. Call the async function
    fetchUsername();
  }, []); // The empty dependency array is correct to run this once on mount

  const handleSubmit = (e) => {
    e.preventDefault();
    // logic to emit socket event will go here later

    const roomData = {
      username,
      maxPlayer,
      count,
    };
    createRoom(roomdData);
  };

  const renderUserStatus = () => {
    if (isLoading) {
      return "Loading..."; // Or a spinner component
    }

    if (username) {
      return `Join as ${username}`;
    }

    return "Join as a Guest";
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded p-8 w-full max-w-md space-y-6"
      >
        <h2 className="text-2xl font-bold text-center">Create a New Room</h2>

        <div>
          <label className="block text-sm font-medium mb-1">
            {renderUserStatus()}{" "}
          </label>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Max Players</label>
          <select
            value={maxPlayer}
            onChange={(e) => setMaxPlayer(parseInt(e.target.value))}
            className="w-full border border-gray-300 rounded px-3 py-2"
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
            className="w-full border border-gray-300 rounded px-3 py-2"
          >
            {[50, 100, 150, 200].map((num) => (
              <option key={num} value={num}>
                {num}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          className="w-full border hover:bg-gray-200 rounded py-2 transition"
        >
          Create Room
        </button>
      </form>
    </div>
  );
};

export default CreateRoom;
