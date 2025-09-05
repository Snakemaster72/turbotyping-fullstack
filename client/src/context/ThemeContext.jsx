

// this context provides theme colors and a toggle function for dark/light mode
// also this is completely ai generated and i have no idea how it works

import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved ? saved === 'dark' : true; // Default to dark theme
  });

  useEffect(() => {
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  const colors = {
    dark: {
      bg: '#282828',
      bgSoft: '#1d2021',
      bgHover: '#3c3836',
      border: '#504945',
      borderHover: '#665c54',
      text: '#ebdbb2',
      textSoft: '#928374',
      primary: '#fe8019',
      correct: '#b8bb26',
      incorrect: '#fb4934',
      accent1: '#8ec07c',
      accent2: '#fabd2f',
      accent3: '#83a598',
      accent4: '#d3869b',
    },
    light: {
      bg: '#fbf1c7',
      bgSoft: '#f2e5bc',
      bgHover: '#ebdbb2',
      border: '#d5c4a1',
      borderHover: '#bdae93',
      text: '#3c3836',
      textSoft: '#665c54',
      primary: '#af3a03',
      correct: '#79740e',
      incorrect: '#9d0006',
      accent1: '#427b58',
      accent2: '#b57614',
      accent3: '#076678',
      accent4: '#8f3f71',
    }
  };

  const theme = isDark ? colors.dark : colors.light;

  return (
    <ThemeContext.Provider value={{ isDark, setIsDark, theme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
