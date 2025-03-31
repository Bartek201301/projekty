import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  StatusBar
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from '@react-navigation/native';
import { collection, addDoc, doc, setDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { firestore, storage } from '../../services/firebase';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { USE_MOCK_FIREBASE } from '../../services/firebaseConfig';

const CreateGroupScreen = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [groupPhoto, setGroupPhoto] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const { user } = useAuth();
  const { theme } = useTheme();
  const navigation = useNavigation();

  const pickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (status !== 'granted') {
        setError('Potrzebujemy dostępu do Twoich zdjęć. Sprawdź ustawienia aplikacji.');
        return;
      }
      
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });
      
      if (!result.canceled) {
        setGroupPhoto(result.assets[0].uri);
        setError(null);
      }
    } catch (err) {
      console.error('Error picking image:', err);
      setError('Nie można wybrać zdjęcia. Spróbuj ponownie później.');
    }
  };

  const uploadGroupPhoto = async () => {
    if (!groupPhoto) return null;
    
    try {
      if (USE_MOCK_FIREBASE) {
        // In demo mode, just return a placeholder URL
        return 'https://via.placeholder.com/400x400';
      }
      
      const response = await fetch(groupPhoto);
      const blob = await response.blob();
      
      const fileRef = ref(storage, `group_photos/${Date.now()}`);
      await uploadBytes(fileRef, blob);
      
      return await getDownloadURL(fileRef);
    } catch (error) {
      console.error('Error uploading group photo:', error);
      throw new Error('Nie można przesłać zdjęcia grupy.');
    }
  };

  const createGroup = async () => {
    if (!name.trim()) {
      setError('Nazwa grupy jest wymagana.');
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      // Generate a new group ID
      const groupId = USE_MOCK_FIREBASE 
        ? `group-${Date.now()}` 
        : doc(collection(firestore, 'groups')).id;
      
      // Upload group photo if selected
      let photoURL;
      try {
        photoURL = await uploadGroupPhoto();
      } catch (err) {
        // If photo upload fails but we have a name, we can still create the group
        console.warn('Photo upload failed but continuing with group creation');
      }
      
      if (USE_MOCK_FIREBASE) {
        // In demo mode, simply navigate to the groups list after simulating creation
        setTimeout(() => {
          navigation.navigate('Groups', {
            newGroupCreated: true,
            groupInfo: {
              id: groupId,
              name: name.trim(),
              description: description.trim(),
              photoURL: photoURL || null,
              memberCount: 1,
              isAdmin: true
            }
          });
          setLoading(false);
        }, 1000);
        return;
      }
      
      // Create the group document in Firestore
      await setDoc(doc(firestore, 'groups', groupId), {
        id: groupId,
        name: name.trim(),
        description: description.trim(),
        photoURL,
        createdAt: new Date().toISOString(),
        createdBy: user.uid,
        memberCount: 1
      });
      
      // Add current user as admin
      await setDoc(doc(firestore, 'group_members', `${groupId}_${user.uid}`), {
        groupId,
        userId: user.uid,
        role: 'admin',
        joinedAt: new Date().toISOString()
      });
      
      // Navigate to the group detail screen
      navigation.navigate('GroupDetail', { 
        group: {
          id: groupId,
          name: name.trim(),
          description: description.trim(),
          photoURL,
          isAdmin: true
        }
      });
    } catch (error) {
      console.error('Error creating group:', error);
      setError(error.message || 'Nie można utworzyć grupy. Spróbuj ponownie później.');
    } finally {
      setLoading(false);
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
      paddingTop: Platform.OS === 'ios' ? 50 : StatusBar.currentHeight,
    },
    content: {
      flex: 1,
      padding: 20,
    },
    header: {
      marginBottom: 24,
    },
    title: {
      fontSize: 28,
      fontWeight: 'bold',
      color: theme.text,
      marginBottom: 12,
    },
    subtitle: {
      fontSize: 16,
      color: theme.secondaryText,
      lineHeight: 22,
    },
    photoContainer: {
      alignItems: 'center',
      marginVertical: 24,
    },
    photoPlaceholder: {
      width: 120,
      height: 120,
      borderRadius: 60,
      backgroundColor: theme.card,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: theme.border,
      marginBottom: 12,
    },
    groupPhoto: {
      width: 120,
      height: 120,
      borderRadius: 60,
    },
    photoButtonText: {
      color: theme.accent,
      fontWeight: '500',
      marginTop: 8,
    },
    inputContainer: {
      marginBottom: 20,
    },
    label: {
      fontSize: 16,
      marginBottom: 8,
      color: theme.text,
      fontWeight: '500',
    },
    input: {
      backgroundColor: theme.card,
      borderRadius: 8,
      padding: 15,
      fontSize: 16,
      color: theme.text,
      borderWidth: 1,
      borderColor: theme.border,
    },
    descriptionInput: {
      height: 120,
      textAlignVertical: 'top',
    },
    createButton: {
      backgroundColor: theme.accent,
      paddingVertical: 15,
      borderRadius: 8,
      alignItems: 'center',
      marginTop: 20,
    },
    createButtonText: {
      color: 'white',
      fontSize: 16,
      fontWeight: 'bold',
    },
    disabledButton: {
      backgroundColor: theme.inactive,
    },
    errorContainer: {
      marginTop: 20,
      padding: 10,
      backgroundColor: 'rgba(255, 69, 58, 0.1)',
      borderRadius: 8,
      marginHorizontal: 0,
    },
    errorText: {
      color: theme.error,
      fontSize: 14,
      textAlign: 'center',
    }
  });

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar barStyle="light-content" />
      <ScrollView style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Nowa grupa</Text>
          <Text style={styles.subtitle}>Utwórz prywatną grupę, aby dzielić się zdjęciami ze znajomymi</Text>
        </View>
        
        <View style={styles.photoContainer}>
          <TouchableOpacity onPress={pickImage}>
            {groupPhoto ? (
              <Image source={{ uri: groupPhoto }} style={styles.groupPhoto} />
            ) : (
              <View style={styles.photoPlaceholder}>
                <Ionicons name="camera" size={40} color={theme.inactive} />
              </View>
            )}
          </TouchableOpacity>
          <TouchableOpacity onPress={pickImage}>
            <Text style={styles.photoButtonText}>
              {groupPhoto ? 'Zmień zdjęcie' : 'Dodaj zdjęcie grupy'}
            </Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Nazwa grupy*</Text>
          <TextInput
            style={styles.input}
            placeholder="Wpisz nazwę grupy"
            placeholderTextColor={theme.inactive}
            value={name}
            onChangeText={(text) => {
              setName(text);
              if (error && text.trim()) setError(null);
            }}
          />
        </View>
        
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Opis (opcjonalnie)</Text>
          <TextInput
            style={[styles.input, styles.descriptionInput]}
            placeholder="Wpisz opis grupy"
            placeholderTextColor={theme.inactive}
            value={description}
            onChangeText={setDescription}
            multiline
          />
        </View>
        
        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}
        
        <TouchableOpacity
          style={[
            styles.createButton,
            (loading || !name.trim()) && styles.disabledButton
          ]}
          onPress={createGroup}
          disabled={loading || !name.trim()}
        >
          {loading ? (
            <ActivityIndicator color="white" size="small" />
          ) : (
            <Text style={styles.createButtonText}>Utwórz grupę</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default CreateGroupScreen; 