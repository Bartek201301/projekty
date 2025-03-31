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
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from '@react-navigation/native';
import { collection, addDoc, doc, setDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { firestore, storage } from '../../services/firebase';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';

const CreateGroupScreen = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [groupPhoto, setGroupPhoto] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const { user } = useAuth();
  const { theme } = useTheme();
  const navigation = useNavigation();

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Please grant permission to access your photos.');
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
    }
  };

  const uploadGroupPhoto = async () => {
    if (!groupPhoto) return null;
    
    try {
      const response = await fetch(groupPhoto);
      const blob = await response.blob();
      
      const fileRef = ref(storage, `group_photos/${Date.now()}`);
      await uploadBytes(fileRef, blob);
      
      return await getDownloadURL(fileRef);
    } catch (error) {
      console.error('Error uploading group photo:', error);
      return null;
    }
  };

  const createGroup = async () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Please enter a group name.');
      return;
    }
    
    try {
      setLoading(true);
      
      // Upload group photo if selected
      const photoURL = await uploadGroupPhoto();
      
      // Generate a new group ID
      const groupId = doc(collection(firestore, 'groups')).id;
      
      // Create the group document
      await setDoc(doc(firestore, 'groups', groupId), {
        id: groupId,
        name: name.trim(),
        description: description.trim(),
        photoURL,
        createdAt: new Date().toISOString(),
        createdBy: user.uid
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
      Alert.alert('Error', 'Failed to create group. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    content: {
      flex: 1,
      padding: 20,
    },
    header: {
      marginBottom: 24,
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      color: theme.text,
      marginBottom: 8,
    },
    subtitle: {
      fontSize: 16,
      color: theme.inactive,
    },
    photoContainer: {
      alignItems: 'center',
      marginVertical: 20,
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
      color: theme.primary,
      fontWeight: '500',
    },
    inputContainer: {
      marginBottom: 20,
    },
    label: {
      fontSize: 16,
      marginBottom: 8,
      color: theme.text,
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
      backgroundColor: theme.primary,
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
    }
  });

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Create New Group</Text>
          <Text style={styles.subtitle}>Create a private group to share photos with friends</Text>
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
              {groupPhoto ? 'Change Photo' : 'Add Group Photo'}
            </Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Group Name*</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter group name"
            placeholderTextColor={theme.inactive}
            value={name}
            onChangeText={setName}
          />
        </View>
        
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Description (Optional)</Text>
          <TextInput
            style={[styles.input, styles.descriptionInput]}
            placeholder="Enter group description"
            placeholderTextColor={theme.inactive}
            value={description}
            onChangeText={setDescription}
            multiline
          />
        </View>
        
        <TouchableOpacity 
          style={[
            styles.createButton,
            !name.trim() || loading ? styles.disabledButton : null
          ]}
          onPress={createGroup}
          disabled={!name.trim() || loading}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.createButtonText}>Create Group</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default CreateGroupScreen; 