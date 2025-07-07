// src/pages/LandingPage.jsx
import { Link } from "react-router-dom"; //for linking to other routes

const LandingPage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
      <h1 className="text-4xl font-bold mb-4">Welcome to Turbotyping</h1>
      <p className="text-lg mb-2">
        Test your typing speed, track your stats, and compete with others.
      </p>
      <p className="text-lg mb-8">
        Choose between solo and multiplayer modes. Improve your speed every day.
      </p>
      <div className="flex gap-6">
        <Link to="/play/singlePlayer" className="border px-4 py-2 rounded">
          Singleplayer
        </Link>
        <Link to="/play/multiPlayer" className="border px-4 py-2 rounded">
          Multiplayer
        </Link>
      </div>
    </div>
  );
};

export default LandingPage;
