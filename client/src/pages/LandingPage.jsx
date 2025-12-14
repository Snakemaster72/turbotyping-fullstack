// src/pages/LandingPage.jsx
import { Link } from "react-router-dom";
import { Typewriter } from "react-simple-typewriter";
import { useTheme } from "../context/ThemeContext";

const LandingPage = () => {
  const { theme } = useTheme();

  return (
    <div 
      className="min-h-screen flex flex-col items-center justify-center text-center px-4 font-jetbrains" 
      style={{ 
        fontFamily: 'JetBrains Mono, monospace',
        backgroundColor: theme.bg,
        color: theme.text
      }}
    >
      <h1 className="font-bold mb-4" style={{ fontSize: '64px', color: theme.primary }}>
        <Typewriter
          words={["Turbo Typing"]}
          loop={0}
          cursor
          cursorStyle="|"
          typeSpeed={120}
          deleteSpeed={80}
          delaySpeed={1500}
        />
      </h1>
      <p className="text-lg mb-2" style={{ color: theme.textSoft }}>
        Test your typing speed, track your stats, and compete with others.
      </p>
      <div className="flex flex-col items-center justify-center mt-8">
        <div className="flex gap-8">
            <Link 
              to="/play/singleplayer" 
              className="border-2 px-8 py-4 rounded-lg text-2xl font-bold shadow-lg transition-colors duration-200"
              style={{ 
                borderColor: theme.border,
                backgroundColor: theme.bgSoft,
                color: theme.text,
              }}
            >
              Singleplayer
            </Link>
            <Link 
              to="/play/multiPlayer" 
              className="border-2 px-8 py-4 rounded-lg text-2xl font-bold shadow-lg transition-colors duration-200"
              style={{ 
                borderColor: theme.primary,
                backgroundColor: theme.bgSoft,
                color: theme.text,
              }}
            >
              Multiplayer
            </Link>
          </div>
      </div>
    </div>
  );
};

export default LandingPage;
