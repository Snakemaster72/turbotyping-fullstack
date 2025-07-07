// src/pages/PlayingPage.jsx
import { Link } from "react-router-dom";

const PlayingPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="flex flex-wrap gap-8">
        <Link
          to="/play/singleplayer"
          className="border rounded p-6 w-64 text-center"
        >
          <h2 className="text-xl font-bold mb-2">Singleplayer</h2>
          <p>Practice at your own pace with custom tests.</p>
        </Link>

        <Link
          to="/play/multiplayer"
          className="border rounded p-6 w-64 text-center"
        >
          <h2 className="text-xl font-bold mb-2">Multiplayer</h2>
          <p>Join live rooms and compete in real-time.</p>
        </Link>
      </div>
    </div>
  );
};

export default PlayingPage;
