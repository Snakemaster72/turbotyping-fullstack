import { useTheme } from '../context/ThemeContext';
import { FiMoon, FiSun } from 'react-icons/fi';

const ThemeToggle = () => {
  const { isDark, setIsDark, theme } = useTheme();

  return (
    <button
      onClick={() => setIsDark(!isDark)}
      className={`p-2 rounded-lg transition-colors`}
      style={{
        backgroundColor: theme.bgSoft,
        color: theme.textSoft,
      }}
    >
      {isDark ? <FiSun size={20} /> : <FiMoon size={20} />}
    </button>
  );
};

export default ThemeToggle;
