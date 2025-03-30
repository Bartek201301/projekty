import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  KeyboardAvoidingView, 
  Platform, 
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView
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

const RegisterScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  
  const theme = useTheme();

  const validateName = (name) => {
    if (!name) {
      setNameError('Imię jest wymagane');
      return false;
    }
    setNameError('');
    return true;
  };

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

  const validateConfirmPassword = (confirmPassword) => {
    if (!confirmPassword) {
      setConfirmPasswordError('Potwierdź hasło');
      return false;
    } else if (confirmPassword !== password) {
      setConfirmPasswordError('Hasła nie są identyczne');
      return false;
    }
    setConfirmPasswordError('');
    return true;
  };

  const handleRegister = () => {
    const isNameValid = validateName(name);
    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);
    const isConfirmPasswordValid = validateConfirmPassword(confirmPassword);

    if (isNameValid && isEmailValid && isPasswordValid && isConfirmPasswordValid) {
      // In a real app, we would register with Firebase here
      // For now, just simulate a successful registration
      console.log('Register with:', name, email, password);
      navigation.navigate('Login');
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <StatusBar style="light" />
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <Surface style={styles.surface}>
            <View style={styles.header}>
              <Text style={styles.title}>Utwórz konto</Text>
              <Text style={styles.subtitle}>Dołącz do naszej społeczności</Text>
            </View>
            
            <View style={styles.inputContainer}>
              <TextInput
                label="Imię i nazwisko"
                value={name}
                onChangeText={text => {
                  setName(text);
                  if (nameError) validateName(text);
                }}
                mode="outlined"
                style={styles.input}
                error={!!nameError}
                theme={{ roundness: theme.roundness }}
              />
              {nameError ? <Text style={styles.errorText}>{nameError}</Text> : null}
              
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
                  if (confirmPassword && confirmPasswordError) {
                    validateConfirmPassword(confirmPassword);
                  }
                }}
                mode="outlined"
                style={styles.input}
                secureTextEntry
                error={!!passwordError}
                theme={{ roundness: theme.roundness }}
              />
              {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}
              
              <TextInput
                label="Potwierdź hasło"
                value={confirmPassword}
                onChangeText={text => {
                  setConfirmPassword(text);
                  if (confirmPasswordError) validateConfirmPassword(text);
                }}
                mode="outlined"
                style={styles.input}
                secureTextEntry
                error={!!confirmPasswordError}
                theme={{ roundness: theme.roundness }}
              />
              {confirmPasswordError ? <Text style={styles.errorText}>{confirmPasswordError}</Text> : null}
            </View>
            
            <View style={styles.buttonContainer}>
              <GradientButton
                title="ZAREJESTRUJ SIĘ"
                onPress={handleRegister}
                style={styles.registerButton}
              />
              
              <View style={styles.loginContainer}>
                <Text style={styles.loginText}>Masz już konto?</Text>
                <Button
                  mode="text"
                  onPress={() => navigation.navigate('Login')}
                  style={styles.loginButton}
                  labelStyle={styles.loginButtonText}
                >
                  Zaloguj się
                </Button>
              </View>
            </View>
          </Surface>
        </ScrollView>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  scrollContainer: {
    flexGrow: 1,
  },
  surface: {
    flex: 1,
    padding: 20,
    backgroundColor: '#121212',
    elevation: 0,
  },
  header: {
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 30,
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
  registerButton: {
    width: '100%',
    marginTop: 10,
    marginBottom: 20,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  loginContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  loginText: {
    color: '#AAAAAA',
  },
  loginButton: {
    marginLeft: 5,
  },
  loginButtonText: {
    color: '#C77DFF',
  },
});

export default RegisterScreen; 