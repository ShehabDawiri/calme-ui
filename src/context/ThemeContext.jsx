import React, { createContext, useState, useEffect, useContext } from "react";

// Create the context
const ThemeContext = createContext({
  isDarkMode: false,
  toggleTheme: () => {},
});

// Custom hook for using the theme context
export const useThemeContext = () => useContext(ThemeContext);

// Theme Provider Component
export const ThemeProviderContext = ({ children }) => {
  // Load theme from localStorage or default to light mode
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return JSON.parse(localStorage.getItem("isDarkMode") || "false");
  });

  // Toggle the theme
  const toggleTheme = () => {
    setIsDarkMode((prev) => !prev);
  };

  // Apply dark mode class and persist the theme
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("isDarkMode", JSON.stringify(isDarkMode));
  }, [isDarkMode]);

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
