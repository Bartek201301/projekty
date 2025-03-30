import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer, DarkTheme } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Provider as PaperProvider, MD3DarkTheme } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

// Firebase configuration would go here in a real app
// import { initializeApp } from 'firebase/app';
// import { getAuth, onAuthStateChanged } from 'firebase/auth';

// Import screens
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import CalendarScreen from './src/screens/CalendarScreen';
import PhotosScreen from './src/screens/PhotosScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import EventDetailsScreen from './src/screens/EventDetailsScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Custom dark theme with neon and purple accents
const theme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: '#9D4EDD',
    secondary: '#7B2CBF',
    accent: '#C77DFF',
    background: '#121212',
    card: '#1E1E1E',
    text: '#FFFFFF',
    border: '#2E2E2E',
    notification: '#FF0080',
    gradient1: '#9D4EDD',
    gradient2: '#5A189A',
  },
  roundness: 16,
};

// Custom navigation theme to match paper theme
const navigationTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: theme.colors.primary,
    background: theme.colors.background,
    card: theme.colors.card,
    text: theme.colors.text,
    border: theme.colors.border,
    notification: theme.colors.notification,
  },
};

// Main tab navigation after authentication
function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Kalendarz') {
            iconName = focused ? 'calendar' : 'calendar-outline';
          } else if (route.name === 'Zdjęcia') {
            iconName = focused ? 'images' : 'images-outline';
          } else if (route.name === 'Profil') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: theme.colors.accent,
        tabBarInactiveTintColor: '#888888',
        tabBarStyle: {
          backgroundColor: theme.colors.card,
          borderTopColor: theme.colors.border,
          borderTopWidth: 1,
          paddingBottom: 5,
          paddingTop: 5,
          height: 60,
        },
        headerStyle: {
          backgroundColor: theme.colors.card,
          elevation: 0,
          shadowOpacity: 0,
          borderBottomWidth: 1,
          borderBottomColor: theme.colors.border,
        },
        headerTintColor: theme.colors.text,
      })}
    >
      <Tab.Screen name="Kalendarz" component={CalendarScreen} />
      <Tab.Screen name="Zdjęcia" component={PhotosScreen} />
      <Tab.Screen name="Profil" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  // In a real app, we would check authentication state here
  // useEffect(() => {
  //   const auth = getAuth();
  //   const unsubscribe = onAuthStateChanged(auth, (user) => {
  //     setIsLoggedIn(!!user);
  //   });
  //   return unsubscribe;
  // }, []);

  return (
    <PaperProvider theme={theme}>
      <NavigationContainer theme={navigationTheme}>
        <StatusBar style="light" />
        <Stack.Navigator
          screenOptions={{
            headerStyle: {
              backgroundColor: theme.colors.card,
              elevation: 0,
              shadowOpacity: 0,
              borderBottomWidth: 1,
              borderBottomColor: theme.colors.border,
            },
            headerTintColor: theme.colors.text,
          }}
        >
          {!isLoggedIn ? (
            // Authentication screens
            <>
              <Stack.Screen 
                name="Login" 
                component={LoginScreen} 
                options={{ 
                  title: 'Dostępność i Pomysły',
                }}
              />
              <Stack.Screen 
                name="Register" 
                component={RegisterScreen}
                options={{ 
                  title: 'Rejestracja',
                }}
              />
            </>
          ) : (
            // Main app screens
            <>
              <Stack.Screen 
                name="MainTabs" 
                component={MainTabs} 
                options={{ headerShown: false }} 
              />
              <Stack.Screen 
                name="EventDetails" 
                component={EventDetailsScreen}
                options={{ 
                  title: 'Szczegóły wydarzenia',
                }}
              />
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
} 