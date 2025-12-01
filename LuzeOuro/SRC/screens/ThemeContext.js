import React, { createContext, useState, useContext } from "react";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(false);

  const toggleTheme = () => setIsDark(!isDark);

  const theme = {
    colors: {
      background: isDark ? "#1a1a1a" : "#fff",
      text: isDark ? "#e0e0e0" : "#333",
      card: isDark ? "#2a2a2a" : "#f5f5f5",
      primary: "#7a4f9e", // roxo fixo
    },
    isDark,
    toggleTheme,
  };

  return (
    <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
