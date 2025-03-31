import React, { createContext, useState, useContext, useEffect } from 'react';
import { Alert } from 'react-native';
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithCredential,
  FacebookAuthProvider
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, firestore } from '../services/firebase';
import { USE_MOCK_FIREBASE } from '../services/firebaseConfig';

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // In mock mode, we just use the user object as is
        if (USE_MOCK_FIREBASE) {
          setUser(user);
        } else {
          // In real Firebase mode, we fetch the user doc
          const userDoc = await getDoc(doc(firestore, 'users', user.uid));
          if (userDoc.exists()) {
            setUser({ ...user, ...userDoc.data() });
          } else {
            setUser(user);
          }
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // Standard email/password registration
  const register = async (email, password, displayName) => {
    try {
      setLoading(true);
      const { user } = await createUserWithEmailAndPassword(auth, email, password);
      
      if (!USE_MOCK_FIREBASE) {
        // Create user profile in real Firebase
        await setDoc(doc(firestore, 'users', user.uid), {
          displayName,
          email,
          photoURL: null,
          createdAt: new Date().toISOString(),
        });
      }
      
      return user;
    } catch (error) {
      Alert.alert('Registration Error', error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Standard email/password login
  const login = async (email, password) => {
    try {
      setLoading(true);
      const { user } = await signInWithEmailAndPassword(auth, email, password);
      return user;
    } catch (error) {
      Alert.alert('Login Error', error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Google login - simplified for demo mode
  const loginWithGoogle = async () => {
    try {
      setLoading(true);
      if (USE_MOCK_FIREBASE) {
        // In mock mode, just use the current mock user
        // A real implementation would call promptGoogleAsync()
        // No need to do anything as onAuthStateChanged will handle it
        setTimeout(() => setLoading(false), 500); // Simulate delay
      } else {
        Alert.alert('Login Error', 'Google login not configured in this version.');
        setLoading(false);
      }
    } catch (error) {
      Alert.alert('Google Login Error', error.message);
      setLoading(false);
    }
  };

  // Facebook login - simplified for demo mode
  const loginWithFacebook = async () => {
    try {
      setLoading(true);
      if (USE_MOCK_FIREBASE) {
        // In mock mode, just use the current mock user
        // A real implementation would call promptFacebookAsync()
        // No need to do anything as onAuthStateChanged will handle it
        setTimeout(() => setLoading(false), 500); // Simulate delay
      } else {
        Alert.alert('Login Error', 'Facebook login not configured in this version.');
        setLoading(false);
      }
    } catch (error) {
      Alert.alert('Facebook Login Error', error.message);
      setLoading(false);
    }
  };

  // Logout
  const logout = async () => {
    try {
      setLoading(true);
      await signOut(auth);
    } catch (error) {
      Alert.alert('Logout Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        loginWithGoogle,
        loginWithFacebook
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}; 