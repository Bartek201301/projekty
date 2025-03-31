import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';

// Screens
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import HomeScreen from '../screens/main/HomeScreen';
import CalendarScreen from '../screens/main/CalendarScreen';
import GroupsScreen from '../screens/groups/GroupsScreen';
import CreateGroupScreen from '../screens/groups/CreateGroupScreen';
import GroupDetailScreen from '../screens/groups/GroupDetailScreen';
import ProfileScreen from '../screens/main/ProfileScreen';
import CameraScreen from '../screens/photos/CameraScreen';
import PhotoDetailScreen from '../screens/photos/PhotoDetailScreen';

// Contexts
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();
const AuthStack = createStackNavigator();

// Auth navigator
const AuthNavigator = () => (
  <AuthStack.Navigator>
    <AuthStack.Screen 
      name="Login" 
      component={LoginScreen} 
      options={{ headerShown: false }} 
    />
    <AuthStack.Screen 
      name="Register" 
      component={RegisterScreen} 
      options={{ headerShown: false }} 
    />
  </AuthStack.Navigator>
);

// Stack navigators
const HomeStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="HomeScreen" component={HomeScreen} options={{ title: 'Home' }} />
    <Stack.Screen name="PhotoDetail" component={PhotoDetailScreen} options={{ title: 'Photo' }} />
  </Stack.Navigator>
);

const CalendarStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="CalendarScreen" component={CalendarScreen} options={{ title: 'Calendar' }} />
    <Stack.Screen name="PhotoDetail" component={PhotoDetailScreen} options={{ title: 'Photo' }} />
  </Stack.Navigator>
);

const GroupsStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="GroupsScreen" component={GroupsScreen} options={{ title: 'Groups' }} />
    <Stack.Screen name="CreateGroup" component={CreateGroupScreen} options={{ title: 'Create Group' }} />
    <Stack.Screen name="GroupDetail" component={GroupDetailScreen} options={{ title: 'Group' }} />
    <Stack.Screen name="PhotoDetail" component={PhotoDetailScreen} options={{ title: 'Photo' }} />
  </Stack.Navigator>
);

const ProfileStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="ProfileScreen" component={ProfileScreen} options={{ title: 'Profile' }} />
    <Stack.Screen name="PhotoDetail" component={PhotoDetailScreen} options={{ title: 'Photo' }} />
  </Stack.Navigator>
);

// Main tab navigator
const TabNavigator = () => {
  const { theme } = useTheme();
  
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Calendar') {
            iconName = focused ? 'calendar' : 'calendar-outline';
          } else if (route.name === 'Camera') {
            iconName = focused ? 'camera' : 'camera-outline';
          } else if (route.name === 'Groups') {
            iconName = focused ? 'people' : 'people-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: theme.primary,
        tabBarInactiveTintColor: theme.inactive,
        tabBarStyle: {
          backgroundColor: theme.background,
          borderTopColor: theme.border,
        },
        headerStyle: {
          backgroundColor: theme.background,
          borderBottomColor: theme.border,
          borderBottomWidth: 1,
        },
        headerTintColor: theme.text,
      })}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeStack} 
        options={{ headerShown: false }}
      />
      <Tab.Screen 
        name="Calendar" 
        component={CalendarStack} 
        options={{ headerShown: false }}
      />
      <Tab.Screen 
        name="Camera" 
        component={CameraScreen} 
        options={{ headerShown: true }}
      />
      <Tab.Screen 
        name="Groups" 
        component={GroupsStack} 
        options={{ headerShown: false }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileStack} 
        options={{ headerShown: false }}
      />
    </Tab.Navigator>
  );
};

// Root navigator
export default function Navigation() {
  const { user, loading } = useAuth();
  const { theme } = useTheme();

  if (loading) {
    // You could add a loading screen here
    return null;
  }

  return (
    <NavigationContainer
      theme={{
        dark: theme.mode === 'dark',
        colors: {
          primary: theme.primary,
          background: theme.background,
          card: theme.card,
          text: theme.text,
          border: theme.border,
          notification: theme.primary,
        },
      }}
    >
      {user ? <TabNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
} 