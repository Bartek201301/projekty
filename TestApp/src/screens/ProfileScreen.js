import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
  Image,
  Modal,
  Alert
} from 'react-native';
import {
  Text,
  TextInput,
  Button,
  Surface,
  Title,
  Switch,
  Avatar,
  IconButton,
  useTheme
} from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import * as ImagePicker from 'expo-image-picker';

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

// Sample user data - in a real app, this would come from a backend
const sampleUser = {
  id: '1',
  name: 'Jan Kowalski',
  email: 'jan.kowalski@example.com',
  phone: '+48 123 456 789',
  avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
  eventsCreated: 5,
  eventsAttended: 12,
  settings: {
    notificationsEnabled: true,
    emailNotifications: false,
    darkMode: true,
    privateProfile: false
  }
};

const ProfileScreen = () => {
  const [user, setUser] = useState(sampleUser);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [changePasswordModalVisible, setChangePasswordModalVisible] = useState(false);
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    phone: user.phone
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [passwordErrors, setPasswordErrors] = useState({});
  
  const theme = useTheme();

  const validateName = (name) => {
    if (!name) {
      return 'Imię jest wymagane';
    }
    return '';
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      return 'Email jest wymagany';
    } else if (!emailRegex.test(email)) {
      return 'Niepoprawny format email';
    }
    return '';
  };

  const validatePhone = (phone) => {
    // Basic validation, in a real app you might want something more sophisticated
    if (phone && phone.length < 9) {
      return 'Numer telefonu jest za krótki';
    }
    return '';
  };

  const validateCurrentPassword = (password) => {
    if (!password) {
      return 'Bieżące hasło jest wymagane';
    }
    return '';
  };

  const validateNewPassword = (password) => {
    if (!password) {
      return 'Nowe hasło jest wymagane';
    } else if (password.length < 6) {
      return 'Hasło musi mieć co najmniej 6 znaków';
    }
    return '';
  };

  const validateConfirmPassword = (password, newPassword) => {
    if (!password) {
      return 'Potwierdź nowe hasło';
    } else if (password !== newPassword) {
      return 'Hasła nie są identyczne';
    }
    return '';
  };

  const updateFormData = (field, value) => {
    setFormData({
      ...formData,
      [field]: value
    });

    // Clear error when typing
    if (errors[field]) {
      setErrors({
        ...errors,
        [field]: ''
      });
    }
  };

  const updatePasswordData = (field, value) => {
    setPasswordData({
      ...passwordData,
      [field]: value
    });

    // Clear error when typing
    if (passwordErrors[field]) {
      setPasswordErrors({
        ...passwordErrors,
        [field]: ''
      });
    }
  };

  const handleSaveProfile = () => {
    const nameError = validateName(formData.name);
    const emailError = validateEmail(formData.email);
    const phoneError = validatePhone(formData.phone);
    
    const newErrors = {
      name: nameError,
      email: emailError,
      phone: phoneError
    };
    
    setErrors(newErrors);
    
    if (nameError || emailError || phoneError) {
      return;
    }
    
    // In a real app, you would make an API call to update the user's profile
    setUser({
      ...user,
      name: formData.name,
      email: formData.email,
      phone: formData.phone
    });
    
    setEditModalVisible(false);
    Alert.alert('Sukces', 'Twój profil został zaktualizowany.');
  };

  const handleChangePassword = () => {
    const currentPasswordError = validateCurrentPassword(passwordData.currentPassword);
    const newPasswordError = validateNewPassword(passwordData.newPassword);
    const confirmPasswordError = validateConfirmPassword(
      passwordData.confirmPassword, 
      passwordData.newPassword
    );
    
    const newErrors = {
      currentPassword: currentPasswordError,
      newPassword: newPasswordError,
      confirmPassword: confirmPasswordError
    };
    
    setPasswordErrors(newErrors);
    
    if (currentPasswordError || newPasswordError || confirmPasswordError) {
      return;
    }
    
    // In a real app, you would make an API call to change the password
    setChangePasswordModalVisible(false);
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
    
    Alert.alert('Sukces', 'Twoje hasło zostało zmienione.');
  };

  const handleToggleSetting = (setting) => {
    setUser({
      ...user,
      settings: {
        ...user.settings,
        [setting]: !user.settings[setting]
      }
    });
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setUser({
        ...user,
        avatar: result.uri
      });
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Surface style={styles.surface}>
          <View style={styles.header}>
            <View style={styles.avatarContainer}>
              <Avatar.Image
                size={100}
                source={{ uri: user.avatar }}
                style={styles.avatar}
              />
              <IconButton
                icon="camera"
                size={24}
                color="#FFFFFF"
                style={styles.changeAvatarButton}
                onPress={pickImage}
              />
            </View>
            <Title style={styles.userName}>{user.name}</Title>
            <Text style={styles.userEmail}>{user.email}</Text>
            
            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{user.eventsCreated}</Text>
                <Text style={styles.statLabel}>Utworzone</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{user.eventsAttended}</Text>
                <Text style={styles.statLabel}>Uczestniczył</Text>
              </View>
            </View>
          </View>
          
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Ustawienia konta</Text>
            
            <View style={styles.settingItem}>
              <Text style={styles.settingLabel}>Powiadomienia push</Text>
              <Switch
                value={user.settings.notificationsEnabled}
                onValueChange={() => handleToggleSetting('notificationsEnabled')}
                color={theme.colors.gradient1}
              />
            </View>
            
            <View style={styles.settingItem}>
              <Text style={styles.settingLabel}>Powiadomienia email</Text>
              <Switch
                value={user.settings.emailNotifications}
                onValueChange={() => handleToggleSetting('emailNotifications')}
                color={theme.colors.gradient1}
              />
            </View>
            
            <View style={styles.settingItem}>
              <Text style={styles.settingLabel}>Tryb ciemny</Text>
              <Switch
                value={user.settings.darkMode}
                onValueChange={() => handleToggleSetting('darkMode')}
                color={theme.colors.gradient1}
              />
            </View>
            
            <View style={styles.settingItem}>
              <Text style={styles.settingLabel}>Profil prywatny</Text>
              <Switch
                value={user.settings.privateProfile}
                onValueChange={() => handleToggleSetting('privateProfile')}
                color={theme.colors.gradient1}
              />
            </View>
          </View>
          
          <View style={styles.buttonContainer}>
            <GradientButton
              title="EDYTUJ PROFIL"
              onPress={() => setEditModalVisible(true)}
              style={styles.editButton}
            />
            <Button
              mode="outlined"
              onPress={() => setChangePasswordModalVisible(true)}
              style={styles.changePasswordButton}
              labelStyle={styles.changePasswordButtonText}
            >
              Zmień hasło
            </Button>
          </View>
        </Surface>
      </ScrollView>
      
      {/* Edit Profile Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={editModalVisible}
        onRequestClose={() => setEditModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.modalContainer}
          >
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Edytuj profil</Text>
              
              <TextInput
                label="Imię i nazwisko"
                value={formData.name}
                onChangeText={(text) => updateFormData('name', text)}
                mode="outlined"
                style={styles.input}
                error={!!errors.name}
              />
              {errors.name ? <Text style={styles.errorText}>{errors.name}</Text> : null}
              
              <TextInput
                label="Email"
                value={formData.email}
                onChangeText={(text) => updateFormData('email', text)}
                mode="outlined"
                style={styles.input}
                keyboardType="email-address"
                autoCapitalize="none"
                error={!!errors.email}
              />
              {errors.email ? <Text style={styles.errorText}>{errors.email}</Text> : null}
              
              <TextInput
                label="Telefon"
                value={formData.phone}
                onChangeText={(text) => updateFormData('phone', text)}
                mode="outlined"
                style={styles.input}
                keyboardType="phone-pad"
                error={!!errors.phone}
              />
              {errors.phone ? <Text style={styles.errorText}>{errors.phone}</Text> : null}
              
              <View style={styles.modalButtons}>
                <Button 
                  mode="outlined"
                  onPress={() => setEditModalVisible(false)}
                  style={styles.cancelButton}
                >
                  Anuluj
                </Button>
                <GradientButton
                  title="ZAPISZ"
                  onPress={handleSaveProfile}
                  style={styles.saveButton}
                />
              </View>
            </View>
          </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
      </Modal>
      
      {/* Change Password Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={changePasswordModalVisible}
        onRequestClose={() => setChangePasswordModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.modalContainer}
          >
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Zmień hasło</Text>
              
              <TextInput
                label="Bieżące hasło"
                value={passwordData.currentPassword}
                onChangeText={(text) => updatePasswordData('currentPassword', text)}
                mode="outlined"
                style={styles.input}
                secureTextEntry
                error={!!passwordErrors.currentPassword}
              />
              {passwordErrors.currentPassword ? 
                <Text style={styles.errorText}>{passwordErrors.currentPassword}</Text> : null}
              
              <TextInput
                label="Nowe hasło"
                value={passwordData.newPassword}
                onChangeText={(text) => updatePasswordData('newPassword', text)}
                mode="outlined"
                style={styles.input}
                secureTextEntry
                error={!!passwordErrors.newPassword}
              />
              {passwordErrors.newPassword ? 
                <Text style={styles.errorText}>{passwordErrors.newPassword}</Text> : null}
              
              <TextInput
                label="Potwierdź nowe hasło"
                value={passwordData.confirmPassword}
                onChangeText={(text) => updatePasswordData('confirmPassword', text)}
                mode="outlined"
                style={styles.input}
                secureTextEntry
                error={!!passwordErrors.confirmPassword}
              />
              {passwordErrors.confirmPassword ? 
                <Text style={styles.errorText}>{passwordErrors.confirmPassword}</Text> : null}
              
              <View style={styles.modalButtons}>
                <Button 
                  mode="outlined"
                  onPress={() => setChangePasswordModalVisible(false)}
                  style={styles.cancelButton}
                >
                  Anuluj
                </Button>
                <GradientButton
                  title="ZMIEŃ"
                  onPress={handleChangePassword}
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
    marginVertical: 20,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatar: {
    backgroundColor: '#2C2C2C',
  },
  changeAvatarButton: {
    position: 'absolute',
    right: -8,
    bottom: -8,
    backgroundColor: 'rgba(157, 78, 221, 0.8)',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 16,
    color: '#AAAAAA',
    marginBottom: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: '#1E1E1E',
    borderRadius: 12,
    padding: 16,
    width: '100%',
    justifyContent: 'space-around',
    marginTop: 10,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: '#AAAAAA',
  },
  statDivider: {
    width: 1,
    backgroundColor: '#2C2C2C',
  },
  sectionContainer: {
    marginTop: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#2C2C2C',
  },
  settingLabel: {
    fontSize: 16,
    color: '#FFFFFF',
  },
  buttonContainer: {
    marginTop: 30,
  },
  editButton: {
    marginBottom: 16,
  },
  changePasswordButton: {
    borderColor: '#9D4EDD',
    borderWidth: 1,
  },
  changePasswordButtonText: {
    color: '#9D4EDD',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  modalContent: {
    margin: 20,
    backgroundColor: '#1E1E1E',
    borderRadius: 20,
    padding: 24,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    marginBottom: 16,
    backgroundColor: '#2C2C2C',
  },
  errorText: {
    color: '#FF4D4D',
    marginBottom: 10,
    marginLeft: 10,
    fontSize: 12,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  cancelButton: {
    borderColor: '#9D4EDD',
    borderWidth: 1,
    flex: 1,
    marginRight: 10,
  },
  saveButton: {
    flex: 1,
    marginLeft: 10,
  },
  gradientButton: {
    borderRadius: 30,
    paddingVertical: 12,
    paddingHorizontal: 32,
    elevation: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default ProfileScreen; 