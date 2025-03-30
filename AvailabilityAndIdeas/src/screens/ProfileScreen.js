import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  ScrollView, 
  TouchableOpacity,
  Modal,
  Alert,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard
} from 'react-native';
import { 
  Text, 
  Avatar, 
  Button, 
  TextInput, 
  Divider, 
  useTheme,
  IconButton,
  Surface,
  List,
  Switch
} from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';
import { MaterialCommunityIcons } from '@expo/vector-icons';

// Sample user data
const INITIAL_USER = {
  id: '10',
  nick: 'Bartosz M.',
  email: 'bartosz@example.com',
  phone: '+48 123 456 789',
  avatarUri: 'https://randomuser.me/api/portraits/men/32.jpg',
  notificationEvents: true,
  notificationPhotos: true,
  notificationComments: true,
};

const GradientButton = ({ onPress, title, style }) => {
  const theme = useTheme();
  
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
      <LinearGradient
        colors={[theme.colors.gradient1, theme.colors.gradient2]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={[styles.gradientButton, style]}
      >
        <Text style={styles.buttonText}>{title}</Text>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const ProfileScreen = ({ navigation }) => {
  const theme = useTheme();
  const [user, setUser] = useState(INITIAL_USER);
  const [isEditing, setIsEditing] = useState(false);
  const [editNick, setEditNick] = useState(user.nick);
  const [editEmail, setEditEmail] = useState(user.email);
  const [editPhone, setEditPhone] = useState(user.phone);
  const [avatarUri, setAvatarUri] = useState(user.avatarUri);
  const [nickError, setNickError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [currentPasswordError, setCurrentPasswordError] = useState('');
  const [newPasswordError, setNewPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  
  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert(
        'Potrzebne uprawnienia',
        'Potrzebujemy dostępu do twojej galerii, aby wybrać zdjęcie',
        [{ text: 'OK' }]
      );
      return;
    }
    
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
    
    if (!result.canceled) {
      setAvatarUri(result.assets[0].uri);
    }
  };
  
  const handleEditProfile = () => {
    setEditNick(user.nick);
    setEditEmail(user.email);
    setEditPhone(user.phone);
    setNickError('');
    setEmailError('');
    setIsEditing(true);
  };
  
  const handleChangePassword = () => {
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setCurrentPasswordError('');
    setNewPasswordError('');
    setConfirmPasswordError('');
    setIsChangingPassword(true);
  };
  
  const validateEditForm = () => {
    let isValid = true;
    
    if (!editNick.trim()) {
      setNickError('Nazwa użytkownika jest wymagana');
      isValid = false;
    } else if (editNick.length < 3) {
      setNickError('Nazwa użytkownika musi mieć co najmniej 3 znaki');
      isValid = false;
    } else {
      setNickError('');
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!editEmail.trim()) {
      setEmailError('Email jest wymagany');
      isValid = false;
    } else if (!emailRegex.test(editEmail)) {
      setEmailError('Niepoprawny format email');
      isValid = false;
    } else {
      setEmailError('');
    }
    
    return isValid;
  };
  
  const validatePasswordForm = () => {
    let isValid = true;
    
    if (!currentPassword) {
      setCurrentPasswordError('Aktualne hasło jest wymagane');
      isValid = false;
    } else {
      setCurrentPasswordError('');
    }
    
    if (!newPassword) {
      setNewPasswordError('Nowe hasło jest wymagane');
      isValid = false;
    } else if (newPassword.length < 6) {
      setNewPasswordError('Nowe hasło musi mieć co najmniej 6 znaków');
      isValid = false;
    } else {
      setNewPasswordError('');
    }
    
    if (newPassword !== confirmPassword) {
      setConfirmPasswordError('Hasła nie są identyczne');
      isValid = false;
    } else {
      setConfirmPasswordError('');
    }
    
    return isValid;
  };
  
  const handleUpdateProfile = () => {
    if (!validateEditForm()) {
      return;
    }
    
    setUser(prevUser => ({
      ...prevUser,
      nick: editNick,
      email: editEmail,
      phone: editPhone,
      avatarUri: avatarUri,
    }));
    
    setIsEditing(false);
    Alert.alert('Sukces', 'Twój profil został zaktualizowany.');
  };
  
  const handleUpdatePassword = () => {
    if (!validatePasswordForm()) {
      return;
    }
    
    // In a real app, this would call an API to update the password
    setIsChangingPassword(false);
    Alert.alert('Sukces', 'Twoje hasło zostało zmienione.');
  };
  
  const toggleNotification = (type) => {
    setUser(prevUser => ({
      ...prevUser,
      [type]: !prevUser[type],
    }));
  };
  
  const handleLogout = () => {
    Alert.alert(
      'Wylogowanie',
      'Czy na pewno chcesz się wylogować?',
      [
        {
          text: 'Anuluj',
          style: 'cancel',
        },
        {
          text: 'Wyloguj',
          onPress: () => {
            // In a real app, this would call an authentication service to log out
            navigation.navigate('Login');
          },
        },
      ]
    );
  };
  
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Surface style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <Avatar.Image 
              source={{ uri: user.avatarUri }} 
              size={100} 
              style={styles.avatar} 
            />
            <TouchableOpacity 
              style={styles.editAvatarButton}
              onPress={pickImage}
            >
              <MaterialCommunityIcons name="camera" size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
          
          <Text style={styles.userName}>{user.nick}</Text>
          <Text style={styles.userEmail}>{user.email}</Text>
          
          <GradientButton 
            title="EDYTUJ PROFIL" 
            onPress={handleEditProfile}
            style={styles.editButton}
          />
        </Surface>
        
        <Surface style={styles.section}>
          <Text style={styles.sectionTitle}>Ustawienia konta</Text>
          
          <List.Item
            title="Zmień hasło"
            left={props => <List.Icon {...props} icon="lock" color={theme.colors.primary} />}
            right={props => <List.Icon {...props} icon="chevron-right" />}
            onPress={handleChangePassword}
            style={styles.listItem}
            titleStyle={styles.listItemTitle}
          />
          
          <Divider style={styles.divider} />
          
          <List.Item
            title="Powiadomienia o wydarzeniach"
            left={props => <List.Icon {...props} icon="calendar-check" color={theme.colors.primary} />}
            right={() => (
              <Switch
                value={user.notificationEvents}
                onValueChange={() => toggleNotification('notificationEvents')}
                color={theme.colors.primary}
              />
            )}
            style={styles.listItem}
            titleStyle={styles.listItemTitle}
          />
          
          <Divider style={styles.divider} />
          
          <List.Item
            title="Powiadomienia o nowych zdjęciach"
            left={props => <List.Icon {...props} icon="image" color={theme.colors.primary} />}
            right={() => (
              <Switch
                value={user.notificationPhotos}
                onValueChange={() => toggleNotification('notificationPhotos')}
                color={theme.colors.primary}
              />
            )}
            style={styles.listItem}
            titleStyle={styles.listItemTitle}
          />
          
          <Divider style={styles.divider} />
          
          <List.Item
            title="Powiadomienia o komentarzach"
            left={props => <List.Icon {...props} icon="comment" color={theme.colors.primary} />}
            right={() => (
              <Switch
                value={user.notificationComments}
                onValueChange={() => toggleNotification('notificationComments')}
                color={theme.colors.primary}
              />
            )}
            style={styles.listItem}
            titleStyle={styles.listItemTitle}
          />
        </Surface>
        
        <Surface style={styles.section}>
          <Text style={styles.sectionTitle}>O aplikacji</Text>
          
          <List.Item
            title="Wersja aplikacji"
            description="1.0.0"
            left={props => <List.Icon {...props} icon="information" color={theme.colors.primary} />}
            style={styles.listItem}
            titleStyle={styles.listItemTitle}
            descriptionStyle={styles.listItemDescription}
          />
          
          <Divider style={styles.divider} />
          
          <List.Item
            title="Polityka prywatności"
            left={props => <List.Icon {...props} icon="shield-account" color={theme.colors.primary} />}
            right={props => <List.Icon {...props} icon="chevron-right" />}
            style={styles.listItem}
            titleStyle={styles.listItemTitle}
          />
        </Surface>
        
        <Button 
          mode="outlined" 
          onPress={handleLogout}
          style={styles.logoutButton}
          contentStyle={styles.logoutButtonContent}
          labelStyle={styles.logoutButtonLabel}
        >
          Wyloguj się
        </Button>
      </ScrollView>
      
      {/* Edit Profile Modal */}
      <Modal
        visible={isEditing}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsEditing(false)}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <KeyboardAvoidingView 
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.modalOverlay}
          >
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Edytuj profil</Text>
              
              <TextInput
                label="Nazwa użytkownika (nick)"
                value={editNick}
                onChangeText={text => {
                  setEditNick(text);
                  if (nickError) setNickError('');
                }}
                mode="outlined"
                style={styles.input}
                error={!!nickError}
                theme={{ roundness: theme.roundness }}
              />
              {nickError ? <Text style={styles.errorText}>{nickError}</Text> : null}
              
              <TextInput
                label="Email"
                value={editEmail}
                onChangeText={text => {
                  setEditEmail(text);
                  if (emailError) setEmailError('');
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
                label="Telefon"
                value={editPhone}
                onChangeText={setEditPhone}
                mode="outlined"
                style={styles.input}
                keyboardType="phone-pad"
                theme={{ roundness: theme.roundness }}
              />
              
              <View style={styles.modalButtons}>
                <Button
                  mode="outlined"
                  onPress={() => setIsEditing(false)}
                  style={styles.cancelButton}
                >
                  Anuluj
                </Button>
                <GradientButton
                  title="ZAPISZ"
                  onPress={handleUpdateProfile}
                  style={styles.saveButton}
                />
              </View>
            </View>
          </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
      </Modal>
      
      {/* Change Password Modal */}
      <Modal
        visible={isChangingPassword}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsChangingPassword(false)}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <KeyboardAvoidingView 
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.modalOverlay}
          >
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Zmień hasło</Text>
              
              <TextInput
                label="Aktualne hasło"
                value={currentPassword}
                onChangeText={text => {
                  setCurrentPassword(text);
                  if (currentPasswordError) setCurrentPasswordError('');
                }}
                mode="outlined"
                style={styles.input}
                secureTextEntry
                error={!!currentPasswordError}
                theme={{ roundness: theme.roundness }}
              />
              {currentPasswordError ? <Text style={styles.errorText}>{currentPasswordError}</Text> : null}
              
              <TextInput
                label="Nowe hasło"
                value={newPassword}
                onChangeText={text => {
                  setNewPassword(text);
                  if (newPasswordError) setNewPasswordError('');
                  if (confirmPassword && text !== confirmPassword) {
                    setConfirmPasswordError('Hasła nie są identyczne');
                  } else if (confirmPassword) {
                    setConfirmPasswordError('');
                  }
                }}
                mode="outlined"
                style={styles.input}
                secureTextEntry
                error={!!newPasswordError}
                theme={{ roundness: theme.roundness }}
              />
              {newPasswordError ? <Text style={styles.errorText}>{newPasswordError}</Text> : null}
              
              <TextInput
                label="Potwierdź nowe hasło"
                value={confirmPassword}
                onChangeText={text => {
                  setConfirmPassword(text);
                  if (newPassword !== text) {
                    setConfirmPasswordError('Hasła nie są identyczne');
                  } else {
                    setConfirmPasswordError('');
                  }
                }}
                mode="outlined"
                style={styles.input}
                secureTextEntry
                error={!!confirmPasswordError}
                theme={{ roundness: theme.roundness }}
              />
              {confirmPasswordError ? <Text style={styles.errorText}>{confirmPasswordError}</Text> : null}
              
              <View style={styles.modalButtons}>
                <Button
                  mode="outlined"
                  onPress={() => setIsChangingPassword(false)}
                  style={styles.cancelButton}
                >
                  Anuluj
                </Button>
                <GradientButton
                  title="ZMIEŃ HASŁO"
                  onPress={handleUpdatePassword}
                  style={styles.saveButton}
                />
              </View>
            </View>
          </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  scrollContainer: {
    paddingBottom: 30,
  },
  profileHeader: {
    padding: 20,
    alignItems: 'center',
    marginBottom: 16,
    backgroundColor: '#1E1E1E',
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatar: {
    backgroundColor: '#2E2E2E',
  },
  editAvatarButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#9D4EDD',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#1E1E1E',
  },
  userName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: '#AAAAAA',
    marginBottom: 20,
  },
  editButton: {
    paddingVertical: 8,
    paddingHorizontal: 24,
    borderRadius: 30,
  },
  section: {
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#1E1E1E',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    padding: 16,
  },
  listItem: {
    paddingVertical: 8,
  },
  listItemTitle: {
    color: '#FFFFFF',
  },
  listItemDescription: {
    color: '#AAAAAA',
  },
  divider: {
    backgroundColor: '#333333',
  },
  logoutButton: {
    marginHorizontal: 16,
    marginTop: 16,
    borderColor: '#FF4D4D',
    borderRadius: 30,
  },
  logoutButtonContent: {
    height: 48,
  },
  logoutButtonLabel: {
    color: '#FF4D4D',
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#1E1E1E',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    marginBottom: 5,
    backgroundColor: '#2E2E2E',
  },
  errorText: {
    color: '#FF4D4D',
    marginBottom: 15,
    marginLeft: 10,
    fontSize: 12,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  cancelButton: {
    flex: 1,
    marginRight: 10,
    borderColor: '#444444',
  },
  saveButton: {
    flex: 1,
    marginLeft: 10,
  },
  gradientButton: {
    borderRadius: 30,
    paddingVertical: 10,
    paddingHorizontal: 24,
    elevation: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
});

export default ProfileScreen; 