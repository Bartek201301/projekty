import React, { createContext, useState, useContext, useEffect } from 'react';
import { useColorScheme } from 'react-native';

// Define color themes
const lightTheme = {
  mode: 'light',
  background: '#F2F2F7',
  card: '#FFFFFF',
  text: '#000000',
  secondaryText: '#6E6E6E',
  border: '#E0E0E0',
  primary: '#000000',
  accent: '#0A84FF',
  error: '#FF3B30',
  success: '#34C759',
  inactive: '#8E8E93',
  headerBackground: '#FFFFFF',
  cardShadow: 'rgba(0, 0, 0, 0.05)',
};

const darkTheme = {
  mode: 'dark',
  background: '#000000',
  card: '#121212',
  text: '#FFFFFF',
  secondaryText: '#A0A0A0',
  border: '#2C2C2C',
  primary: '#FFFFFF',
  accent: '#0A84FF',
  error: '#FF453A',
  success: '#30D158',
  inactive: '#636366',
  headerBackground: '#121212',
  cardShadow: 'rgba(255, 255, 255, 0.05)',
};

// Force dark theme as default to match BeReal
const berealTheme = {
  mode: 'dark',
  background: '#000000',
  card: '#1C1C1E',
  text: '#FFFFFF',
  secondaryText: '#A0A0A0',
  border: '#2C2C2C',
  primary: '#FFFFFF',
  accent: '#0A84FF',
  error: '#FF453A',
  success: '#30D158',
  inactive: '#636366',
  headerBackground: '#000000',
  cardShadow: 'rgba(255, 255, 255, 0.05)',
};

// Create context
const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
  // Force dark theme like BeReal by default
  const [isDark, setIsDark] = useState(true);
  const [theme, setTheme] = useState(berealTheme);

  // Toggle function remains but we'll default to dark theme for BeReal look
  const toggleTheme = () => {
    setIsDark(!isDark);
    setTheme(!isDark ? berealTheme : lightTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}; 