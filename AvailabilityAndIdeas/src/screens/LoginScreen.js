import React, { useState } from 'react';
import { View, StyleSheet, Image, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { TextInput, Button, Text, Title, Surface } from 'react-native-paper';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    setLoading(true);
    setError('');
    
    // In a real app, we would authenticate with Firebase here
    try {
      // Simulate login
      setTimeout(() => {
        // For demo purposes only
        if (email === 'test@example.com' && password === 'password') {
          // navigation.navigate('MainTabs');
          console.log('Logged in successfully');
        } else {
          setError('Nieprawidłowy email lub hasło');
        }
        setLoading(false);
      }, 1500);
    } catch (error) {
      setError('Wystąpił problem podczas logowania');
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Surface style={styles.surfaceContainer}>
          <View style={styles.logoContainer}>
            <Image
              source={{ 
                uri: 'https://reactnative.dev/img/tiny_logo.png' 
              }}
              style={styles.logo}
            />
            <Title style={styles.title}>Dostępność i Pomysły</Title>
            <Text style={styles.subtitle}>Zaplanuj czas z przyjaciółmi</Text>
          </View>

          <View style={styles.formContainer}>
            <TextInput
              label="Email"
              value={email}
              onChangeText={setEmail}
              mode="outlined"
              autoCapitalize="none"
              keyboardType="email-address"
              style={styles.input}
            />
            
            <TextInput
              label="Hasło"
              value={password}
              onChangeText={setPassword}
              mode="outlined"
              secureTextEntry
              style={styles.input}
            />
            
            {error ? <Text style={styles.errorText}>{error}</Text> : null}
            
            <Button 
              mode="contained" 
              onPress={handleLogin}
              loading={loading}
              disabled={loading || !email || !password}
              style={styles.button}
            >
              Zaloguj się
            </Button>
            
            <View style={styles.registerContainer}>
              <Text>Nie masz jeszcze konta? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                <Text style={styles.registerText}>Zarejestruj się</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Surface>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f6f6f6',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  surfaceContainer: {
    padding: 20,
    borderRadius: 10,
    elevation: 4,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  logo: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 10,
  },
  formContainer: {
    width: '100%',
  },
  input: {
    marginBottom: 16,
  },
  button: {
    marginTop: 10,
    paddingVertical: 8,
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
    textAlign: 'center',
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  registerText: {
    color: '#6200ee',
    fontWeight: 'bold',
  },
});

export default LoginScreen; 