// src/pages/PlayingPage.jsx
import { Link } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

const PlayingPage = () => {
  const { theme } = useTheme();
  
  return (
    <div 
      className="min-h-screen flex items-center justify-center px-4"
      style={{ 
        backgroundColor: theme.bg,
        color: theme.text
      }}
    >
      <div className="flex flex-wrap gap-8 justify-center">
        <Link
          to="/play/singleplayer"
          className="rounded-lg p-8 w-80 text-center transition-all duration-300 hover:scale-105 hover:shadow-xl"
          style={{ 
            backgroundColor: theme.bgSoft,
            border: `2px solid ${theme.border}`,
            color: theme.text
          }}
        >
          <h2 
            className="text-2xl font-bold mb-4" 
            style={{ color: theme.primary }}
          >
            Singleplayer
          </h2>
          <p style={{ color: theme.textSoft }}>
            Practice at your own pace with custom tests.
          </p>
        </Link>

        <Link
          to="/play/multiplayer"
          className="rounded-lg p-8 w-80 text-center transition-all duration-300 hover:scale-105 hover:shadow-xl"
          style={{ 
            backgroundColor: theme.bgSoft,
            border: `2px solid ${theme.border}`,
            color: theme.text
          }}
        >
          <h2 
            className="text-2xl font-bold mb-4" 
            style={{ color: theme.primary }}
          >
            Multiplayer
          </h2>
          <p style={{ color: theme.textSoft }}>
            Join live rooms and compete in real-time.
          </p>
        </Link>
      </div>
    </div>
  );
};

export default PlayingPage;
