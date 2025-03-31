import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
  Dimensions
} from 'react-native';
import { Camera } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { collection, addDoc, getDocs, query, where } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { firestore, storage } from '../../services/firebase';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';

const { width, height } = Dimensions.get('window');

const CameraScreen = () => {
  const [hasPermission, setHasPermission] = useState(null);
  const [cameraType, setCameraType] = useState(Camera.Constants.Type.back);
  const [flash, setFlash] = useState(Camera.Constants.FlashMode.off);
  const [capturedImage, setCapturedImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [userGroups, setUserGroups] = useState([]);
  
  const cameraRef = useRef(null);
  const route = useRoute();
  const { groupId, date } = route.params || {};
  const { user } = useAuth();
  const { theme, isDark } = useTheme();
  const navigation = useNavigation();

  useEffect(() => {
    (async () => {
      // Request camera permissions
      const { status: cameraStatus } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(cameraStatus === 'granted');
      
      // Request media library permissions
      await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      // Fetch user's groups
      await fetchUserGroups();
      
      // Set selected group from params if available
      if (groupId) {
        const group = userGroups.find(g => g.id === groupId) || null;
        setSelectedGroup(group);
      }
    })();
  }, [groupId]);

  const fetchUserGroups = async () => {
    try {
      const membershipQuery = query(
        collection(firestore, 'group_members'),
        where('userId', '==', user.uid)
      );
      
      const membershipSnapshot = await getDocs(membershipQuery);
      const groupIds = membershipSnapshot.docs.map(doc => doc.data().groupId);
      
      const groups = [];
      
      for (const id of groupIds) {
        const groupQuery = query(
          collection(firestore, 'groups'),
          where('id', '==', id)
        );
        
        const groupSnapshot = await getDocs(groupQuery);
        
        if (!groupSnapshot.empty) {
          const groupData = groupSnapshot.docs[0].data();
          groups.push({
            id: groupData.id,
            name: groupData.name,
            photoURL: groupData.photoURL
          });
        }
      }
      
      setUserGroups(groups);
      
      // Set first group as default if none selected and we have groups
      if (!selectedGroup && groups.length > 0) {
        if (groupId) {
          const targetGroup = groups.find(g => g.id === groupId);
          if (targetGroup) {
            setSelectedGroup(targetGroup);
          } else {
            setSelectedGroup(groups[0]);
          }
        } else {
          setSelectedGroup(groups[0]);
        }
      }
    } catch (error) {
      console.error('Error fetching user groups:', error);
      Alert.alert('Error', 'Failed to load your groups.');
    }
  };

  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync({
          quality: 0.8,
          base64: false,
          skipProcessing: false,
        });
        setCapturedImage(photo.uri);
      } catch (error) {
        console.error('Error taking picture:', error);
        Alert.alert('Error', 'Failed to take picture. Please try again.');
      }
    }
  };

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });
      
      if (!result.canceled) {
        setCapturedImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image. Please try again.');
    }
  };

  const uploadPhoto = async () => {
    if (!capturedImage || !selectedGroup) {
      Alert.alert('Error', 'Please capture an image and select a group first.');
      return;
    }
    
    try {
      setLoading(true);
      
      // Upload image to Firebase Storage
      const response = await fetch(capturedImage);
      const blob = await response.blob();
      
      const photoFileName = `${Date.now()}_${user.uid}`;
      const storageRef = ref(storage, `photos/${photoFileName}`);
      
      await uploadBytes(storageRef, blob);
      
      const downloadURL = await getDownloadURL(storageRef);
      
      // Add photo document to Firestore
      const photoDate = date ? new Date(date) : new Date();
      
      const photoDoc = await addDoc(collection(firestore, 'photos'), {
        userId: user.uid,
        groupId: selectedGroup.id,
        imageUrl: downloadURL,
        createdAt: new Date().toISOString(),
        date: photoDate.toISOString(),
        likes: [],
        favorites: [],
        comments: []
      });
      
      // Navigate back or to photo detail
      navigation.goBack();
      
    } catch (error) {
      console.error('Error uploading photo:', error);
      Alert.alert('Error', 'Failed to upload photo. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const toggleCameraType = () => {
    setCameraType(current => 
      current === Camera.Constants.Type.back
        ? Camera.Constants.Type.front
        : Camera.Constants.Type.back
    );
  };

  const toggleFlash = () => {
    setFlash(current => 
      current === Camera.Constants.FlashMode.off
        ? Camera.Constants.FlashMode.on
        : Camera.Constants.FlashMode.off
    );
  };

  const handleCancel = () => {
    setCapturedImage(null);
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: 'black',
    },
    camera: {
      flex: 1,
    },
    header: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      flexDirection: 'row',
      justifyContent: 'space-between',
      padding: 20,
      paddingTop: 50,
      zIndex: 1,
    },
    backButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: 'rgba(0,0,0,0.3)',
      alignItems: 'center',
      justifyContent: 'center',
    },
    controlsContainer: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      flexDirection: 'row',
      justifyContent: 'space-around',
      alignItems: 'center',
      padding: 20,
      paddingBottom: 40,
    },
    captureButton: {
      width: 70,
      height: 70,
      borderRadius: 35,
      backgroundColor: 'white',
      borderWidth: 5,
      borderColor: 'rgba(255,255,255,0.3)',
    },
    iconButton: {
      width: 50,
      height: 50,
      borderRadius: 25,
      backgroundColor: 'rgba(0,0,0,0.3)',
      alignItems: 'center',
      justifyContent: 'center',
    },
    previewContainer: {
      flex: 1,
      backgroundColor: 'black',
    },
    preview: {
      flex: 1,
      width: width,
      height: height,
    },
    previewControls: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      flexDirection: 'row',
      justifyContent: 'space-around',
      alignItems: 'center',
      padding: 20,
      paddingBottom: 40,
      backgroundColor: 'rgba(0,0,0,0.3)',
    },
    previewButton: {
      paddingVertical: 10,
      paddingHorizontal: 30,
      borderRadius: 25,
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'row',
    },
    useButton: {
      backgroundColor: theme.primary,
    },
    cancelButton: {
      backgroundColor: 'rgba(255,255,255,0.2)',
    },
    buttonText: {
      color: 'white',
      fontSize: 16,
      marginLeft: 5,
    },
    groupSelector: {
      position: 'absolute',
      top: 50,
      left: 0,
      right: 0,
      alignItems: 'center',
      zIndex: 1,
    },
    groupButton: {
      backgroundColor: 'rgba(0,0,0,0.5)',
      paddingVertical: 8,
      paddingHorizontal: 16,
      borderRadius: 20,
      flexDirection: 'row',
      alignItems: 'center',
    },
    groupButtonText: {
      color: 'white',
      marginLeft: 8,
    },
    noPermission: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'black',
    },
    noPermissionText: {
      color: 'white',
      textAlign: 'center',
      margin: 10,
    },
    permissionButton: {
      backgroundColor: theme.primary,
      paddingVertical: 12,
      paddingHorizontal: 20,
      borderRadius: 8,
      marginTop: 20,
    },
    loadingContainer: {
      ...StyleSheet.absoluteFill,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0,0,0,0.7)',
      zIndex: 2,
    },
    loaderText: {
      color: 'white',
      marginTop: 10,
    }
  });

  // Show loading indicator
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="white" />
        <Text style={styles.loaderText}>Uploading photo...</Text>
      </View>
    );
  }

  // Camera permission not granted
  if (hasPermission === false) {
    return (
      <View style={styles.noPermission}>
        <Ionicons name="camera-off" size={60} color="white" />
        <Text style={styles.noPermissionText}>
          Camera permission is required to take photos.
        </Text>
        <TouchableOpacity 
          style={styles.permissionButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={{ color: 'white' }}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Permission still loading
  if (hasPermission === null) {
    return (
      <View style={styles.noPermission}>
        <ActivityIndicator size="large" color="white" />
        <Text style={styles.noPermissionText}>Requesting camera permission...</Text>
      </View>
    );
  }

  // No groups
  if (userGroups.length === 0) {
    return (
      <View style={styles.noPermission}>
        <Ionicons name="people" size={60} color="white" />
        <Text style={styles.noPermissionText}>
          You need to be a member of at least one group to share photos.
        </Text>
        <TouchableOpacity 
          style={styles.permissionButton}
          onPress={() => navigation.navigate('CreateGroup')}
        >
          <Text style={{ color: 'white' }}>Create a Group</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Showing captured image preview
  if (capturedImage) {
    return (
      <View style={styles.previewContainer}>
        <Image source={{ uri: capturedImage }} style={styles.preview} />
        
        {/* Group selector */}
        <View style={styles.groupSelector}>
          <TouchableOpacity 
            style={styles.groupButton}
            onPress={() => {
              Alert.alert(
                'Select Group',
                'Choose a group to share this photo with:',
                userGroups.map(group => ({
                  text: group.name,
                  onPress: () => setSelectedGroup(group)
                })).concat([
                  {
                    text: 'Cancel',
                    style: 'cancel'
                  }
                ])
              );
            }}
          >
            <Ionicons name="people" size={18} color="white" />
            <Text style={styles.groupButtonText}>
              {selectedGroup ? selectedGroup.name : 'Select Group'}
            </Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={handleCancel}
          >
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
        </View>
        
        <View style={styles.previewControls}>
          <TouchableOpacity 
            style={[styles.previewButton, styles.cancelButton]}
            onPress={handleCancel}
          >
            <Ionicons name="close" size={24} color="white" />
            <Text style={styles.buttonText}>Retake</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.previewButton, styles.useButton]}
            onPress={uploadPhoto}
            disabled={!selectedGroup}
          >
            <Ionicons name="cloud-upload" size={24} color="white" />
            <Text style={styles.buttonText}>Share</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // Camera view
  return (
    <View style={styles.container}>
      <Camera
        ref={cameraRef}
        style={styles.camera}
        type={cameraType}
        flashMode={flash}
      >
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.iconButton}
            onPress={toggleFlash}
          >
            <Ionicons 
              name={flash === Camera.Constants.FlashMode.on ? "flash" : "flash-off"} 
              size={24} 
              color="white" 
            />
          </TouchableOpacity>
        </View>
        
        <View style={styles.controlsContainer}>
          <TouchableOpacity 
            style={styles.iconButton}
            onPress={pickImage}
          >
            <Ionicons name="images" size={24} color="white" />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.captureButton}
            onPress={takePicture}
          />
          
          <TouchableOpacity 
            style={styles.iconButton}
            onPress={toggleCameraType}
          >
            <Ionicons name="camera-reverse" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </Camera>
    </View>
  );
};

export default CameraScreen; 