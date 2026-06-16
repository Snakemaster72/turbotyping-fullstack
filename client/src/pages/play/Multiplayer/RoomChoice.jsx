import { Link } from "react-router-dom";
import { useTheme } from "../../../context/ThemeContext";

const RoomChoice = () => {
  const { theme } = useTheme();

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4 gap-8"
      style={{ backgroundColor: theme.bg, color: theme.text }}
    >
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-2" style={{ color: theme.primary }}>
          Multiplayer
        </h1>
        <p style={{ color: theme.textSoft }}>
          Race against others in real-time.
        </p>
      </div>

      <div className="flex flex-wrap gap-6 justify-center">
        <Link
          to="/play/multiplayer/create"
          className="rounded-lg p-8 w-72 text-center transition-all duration-300 hover:scale-105 hover:shadow-xl"
          style={{
            backgroundColor: theme.bgSoft,
            border: `2px solid ${theme.border}`,
            color: theme.text,
          }}
        >
          <div className="text-4xl mb-4">🏁</div>
          <h2 className="text-xl font-bold mb-2" style={{ color: theme.correct }}>
            Create Room
          </h2>
          <p className="text-sm" style={{ color: theme.textSoft }}>
            Start a new race and invite friends with a link.
          </p>
        </Link>

        <Link
          to="/play/multiplayer/join"
          className="rounded-lg p-8 w-72 text-center transition-all duration-300 hover:scale-105 hover:shadow-xl"
          style={{
            backgroundColor: theme.bgSoft,
            border: `2px solid ${theme.border}`,
            color: theme.text,
          }}
        >
          <div className="text-4xl mb-4">🔗</div>
          <h2 className="text-xl font-bold mb-2" style={{ color: theme.accent3 }}>
            Join Room
          </h2>
          <p className="text-sm" style={{ color: theme.textSoft }}>
            Enter a room code to join an existing race.
          </p>
        </Link>
      </div>
    </div>
  );
};

export default RoomChoice;
