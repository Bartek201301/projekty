import React, { createContext, useState, useContext, useEffect } from 'react';
import { useColorScheme } from 'react-native';

// Define color themes
const lightTheme = {
  background: '#FFFFFF',
  card: '#F9F9F9',
  text: '#000000',
  border: '#E0E0E0',
  primary: '#4A90E2',
  accent: '#FF9500',
  error: '#FF3B30',
  success: '#34C759',
  inactive: '#8E8E93',
};

const darkTheme = {
  background: '#121212',
  card: '#1E1E1E',
  text: '#FFFFFF',
  border: '#2C2C2C',
  primary: '#5E9CEA',
  accent: '#FF9F0A',
  error: '#FF453A',
  success: '#30D158',
  inactive: '#636366',
};

// Create context
const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
  const deviceTheme = useColorScheme();
  const [isDark, setIsDark] = useState(deviceTheme === 'dark');
  const [theme, setTheme] = useState(isDark ? darkTheme : lightTheme);

  // Update theme when device theme changes
  useEffect(() => {
    setIsDark(deviceTheme === 'dark');
    setTheme(deviceTheme === 'dark' ? darkTheme : lightTheme);
  }, [deviceTheme]);

  // Manual theme toggle function
  const toggleTheme = () => {
    setIsDark(!isDark);
    setTheme(!isDark ? darkTheme : lightTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}; 