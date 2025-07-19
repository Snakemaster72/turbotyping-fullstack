import { Link } from "react-router-dom";

const RoomChoice = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen space-y-6">
      <h1 className="text-4xl font-bold">Multiplayer Mode</h1>
      <p className="text-lg text-gray-600">
        Would you like to join an existing room or create a new one?
      </p>
      <div className="flex space-x-6 mt-4">
        <button className="px-6 py-3 border rounded hover:bg-gray-200 transition">
          <Link to="/play/multiplayer/join">Join Room</Link>
        </button>
        <button className="px-6 py-3 border rounded hover:bg-gray-200 transition">
          <Link to="/play/multiplayer/create">Create Room</Link>
        </button>
      </div>
    </div>
  );
};

export default RoomChoice;
