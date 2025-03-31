import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';

const Logo = ({ size = 'medium', showText = true }) => {
  const { theme } = useTheme();
  
  // Define sizes
  const sizes = {
    small: {
      container: 40,
      icon: 24,
      fontSize: 16
    },
    medium: {
      container: 60,
      icon: 36,
      fontSize: 20
    },
    large: {
      container: 120,
      icon: 60,
      fontSize: 28
    }
  };
  
  const selectedSize = sizes[size] || sizes.medium;
  
  const styles = StyleSheet.create({
    container: {
      alignItems: 'center',
    },
    logoContainer: {
      width: selectedSize.container,
      height: selectedSize.container,
      borderRadius: selectedSize.container / 2,
      backgroundColor: theme.primary,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: showText ? 8 : 0,
    },
    logoText: {
      color: theme.text,
      fontSize: selectedSize.fontSize,
      fontWeight: 'bold',
    }
  });
  
  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Ionicons name="calendar" size={selectedSize.icon} color="white" />
      </View>
      {showText && <Text style={styles.logoText}>SnapCal</Text>}
    </View>
  );
};

export default Logo; 