import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  ImageBackground, 
  KeyboardAvoidingView, 
  Platform,
  TouchableWithoutFeedback,
  Keyboard
} from 'react-native';
import { 
  Text, 
  TextInput, 
  Button, 
  Surface, 
  useTheme 
} from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';

const GradientButton = ({ onPress, title, style }) => {
  const theme = useTheme();
  
  return (
    <TouchableWithoutFeedback onPress={onPress}>
      <LinearGradient
        colors={[theme.colors.gradient1, theme.colors.gradient2]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={[styles.gradientButton, style]}
      >
        <Text style={styles.buttonText}>{title}</Text>
      </LinearGradient>
    </TouchableWithoutFeedback>
  );
};

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const theme = useTheme();

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      setEmailError('Email jest wymagany');
      return false;
    } else if (!emailRegex.test(email)) {
      setEmailError('Niepoprawny format email');
      return false;
    }
    setEmailError('');
    return true;
  };

  const validatePassword = (password) => {
    if (!password) {
      setPasswordError('Hasło jest wymagane');
      return false;
    } else if (password.length < 6) {
      setPasswordError('Hasło musi mieć co najmniej 6 znaków');
      return false;
    }
    setPasswordError('');
    return true;
  };

  const handleLogin = () => {
    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);

    if (isEmailValid && isPasswordValid) {
      // In a real app, we would authenticate with Firebase here
      // For now, just simulate a successful login
      console.log('Login with:', email, password);
      navigation.navigate('MainTabs');
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <StatusBar style="light" />
        <Surface style={styles.surface}>
          <View style={styles.header}>
            <Text style={styles.title}>Dostępność i Pomysły</Text>
            <Text style={styles.subtitle}>Zaloguj się, aby kontynuować</Text>
          </View>
          
          <View style={styles.inputContainer}>
            <TextInput
              label="Email"
              value={email}
              onChangeText={text => {
                setEmail(text);
                if (emailError) validateEmail(text);
              }}
              mode="outlined"
              style={styles.input}
              keyboardType="email-address"
              autoCapitalize="none"
              error={!!emailError}
              theme={{ roundness: theme.roundness }}
            />
            {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}
            
            <TextInput
              label="Hasło"
              value={password}
              onChangeText={text => {
                setPassword(text);
                if (passwordError) validatePassword(text);
              }}
              mode="outlined"
              style={styles.input}
              secureTextEntry
              error={!!passwordError}
              theme={{ roundness: theme.roundness }}
            />
            {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}
          </View>
          
          <View style={styles.buttonContainer}>
            <GradientButton
              title="ZALOGUJ SIĘ"
              onPress={handleLogin}
              style={styles.loginButton}
            />
            
            <View style={styles.registerContainer}>
              <Text style={styles.registerText}>Nie masz jeszcze konta?</Text>
              <Button
                mode="text"
                onPress={() => navigation.navigate('Register')}
                style={styles.registerButton}
                labelStyle={styles.registerButtonText}
              >
                Zarejestruj się
              </Button>
            </View>
          </View>
        </Surface>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  surface: {
    flex: 1,
    padding: 20,
    backgroundColor: '#121212',
    elevation: 0,
  },
  header: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#AAAAAA',
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 20,
  },
  input: {
    marginBottom: 8,
    backgroundColor: '#1E1E1E',
  },
  errorText: {
    color: '#FF4D4D',
    marginBottom: 10,
    marginLeft: 10,
    fontSize: 12,
  },
  buttonContainer: {
    alignItems: 'center',
  },
  gradientButton: {
    borderRadius: 30,
    paddingVertical: 12,
    paddingHorizontal: 32,
    elevation: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginButton: {
    width: '100%',
    marginTop: 20,
    marginBottom: 20,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  registerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  registerText: {
    color: '#AAAAAA',
  },
  registerButton: {
    marginLeft: 5,
  },
  registerButtonText: {
    color: '#C77DFF',
  },
});

export default LoginScreen; 