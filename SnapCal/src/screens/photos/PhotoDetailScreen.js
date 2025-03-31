import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
  Dimensions
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { 
  doc, 
  updateDoc, 
  arrayUnion, 
  arrayRemove,
  deleteDoc,
  getDoc
} from 'firebase/firestore';
import { ref, deleteObject } from 'firebase/storage';
import { firestore, storage } from '../../services/firebase';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';

const { width } = Dimensions.get('window');

const PhotoDetailScreen = () => {
  const [photo, setPhoto] = useState(null);
  const [comment, setComment] = useState('');
  const [liked, setLiked] = useState(false);
  const [favorited, setFavorited] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [commentsCount, setCommentsCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  
  const route = useRoute();
  const initialPhoto = route.params?.photo;
  const { user } = useAuth();
  const { theme } = useTheme();
  const navigation = useNavigation();

  useEffect(() => {
    if (initialPhoto) {
      setPhoto(initialPhoto);
      setLiked((initialPhoto.likes || []).includes(user.uid));
      setFavorited((initialPhoto.favorites || []).includes(user.uid));
      setLikesCount((initialPhoto.likes || []).length);
      setCommentsCount((initialPhoto.comments || []).length);
    }
    
    fetchPhotoDetails();
  }, [initialPhoto, user.uid]);

  const fetchPhotoDetails = async () => {
    if (!initialPhoto?.id) return;
    
    try {
      setRefreshing(true);
      const photoDoc = await getDoc(doc(firestore, 'photos', initialPhoto.id));
      
      if (photoDoc.exists()) {
        const photoData = photoDoc.data();
        
        setPhoto({
          ...initialPhoto,
          ...photoData,
          id: initialPhoto.id
        });
        
        setLiked((photoData.likes || []).includes(user.uid));
        setFavorited((photoData.favorites || []).includes(user.uid));
        setLikesCount((photoData.likes || []).length);
        setCommentsCount((photoData.comments || []).length);
      }
    } catch (error) {
      console.error('Error fetching photo details:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const toggleLike = async () => {
    if (!photo) return;
    
    try {
      const photoRef = doc(firestore, 'photos', photo.id);
      
      if (liked) {
        await updateDoc(photoRef, {
          likes: arrayRemove(user.uid)
        });
        setLikesCount(prev => Math.max(0, prev - 1));
      } else {
        await updateDoc(photoRef, {
          likes: arrayUnion(user.uid)
        });
        setLikesCount(prev => prev + 1);
      }
      
      setLiked(!liked);
    } catch (error) {
      console.error('Error toggling like:', error);
      Alert.alert('Error', 'Failed to update like status.');
    }
  };

  const toggleFavorite = async () => {
    if (!photo) return;
    
    try {
      const photoRef = doc(firestore, 'photos', photo.id);
      
      if (favorited) {
        await updateDoc(photoRef, {
          favorites: arrayRemove(user.uid)
        });
      } else {
        await updateDoc(photoRef, {
          favorites: arrayUnion(user.uid)
        });
      }
      
      setFavorited(!favorited);
    } catch (error) {
      console.error('Error toggling favorite:', error);
      Alert.alert('Error', 'Failed to update favorite status.');
    }
  };

  const addComment = async () => {
    if (!photo || !comment.trim()) return;
    
    try {
      const photoRef = doc(firestore, 'photos', photo.id);
      
      const newComment = {
        id: Date.now().toString(),
        userId: user.uid,
        userName: user.displayName || 'User',
        userPhotoURL: user.photoURL,
        text: comment.trim(),
        createdAt: new Date().toISOString()
      };
      
      await updateDoc(photoRef, {
        comments: arrayUnion(newComment)
      });
      
      // Update local state
      const updatedPhoto = {
        ...photo,
        comments: [...(photo.comments || []), newComment]
      };
      
      setPhoto(updatedPhoto);
      setCommentsCount(prev => prev + 1);
      setComment('');
    } catch (error) {
      console.error('Error adding comment:', error);
      Alert.alert('Error', 'Failed to add comment.');
    }
  };

  const deletePhoto = async () => {
    if (!photo) return;
    
    try {
      setLoading(true);
      
      // Check if user has permission (owner or admin)
      if (photo.userId !== user.uid && !photo.group?.isAdmin) {
        Alert.alert('Error', 'You do not have permission to delete this photo.');
        setLoading(false);
        return;
      }
      
      // Delete photo from storage
      if (photo.imageUrl) {
        try {
          const storageRef = ref(storage, photo.imageUrl);
          await deleteObject(storageRef);
        } catch (storageError) {
          console.error('Error deleting photo from storage:', storageError);
          // Continue with deletion even if storage delete fails
        }
      }
      
      // Delete document from Firestore
      await deleteDoc(doc(firestore, 'photos', photo.id));
      
      // Navigate back
      navigation.goBack();
      
      // Show success message
      Alert.alert('Success', 'Photo has been deleted successfully.');
    } catch (error) {
      console.error('Error deleting photo:', error);
      Alert.alert('Error', 'Failed to delete photo.');
    } finally {
      setLoading(false);
    }
  };

  const confirmDeletePhoto = () => {
    Alert.alert(
      'Delete Photo',
      'Are you sure you want to delete this photo? This action cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Delete',
          onPress: deletePhoto,
          style: 'destructive'
        }
      ]
    );
  };

  const showOptions = () => {
    const options = [];
    
    // Add delete option if user is photo owner or group admin
    if (photo.userId === user.uid || photo.group?.isAdmin) {
      options.push({
        text: 'Delete Photo',
        onPress: confirmDeletePhoto,
        style: 'destructive'
      });
    }
    
    // Add cancel option
    options.push({
      text: 'Cancel',
      style: 'cancel'
    });
    
    Alert.alert('Photo Options', '', options);
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    imageContainer: {
      width: width,
      height: width,
      backgroundColor: theme.border,
    },
    image: {
      width: '100%',
      height: '100%',
      resizeMode: 'contain',
    },
    contentContainer: {
      padding: 16,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 16,
    },
    userContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    avatar: {
      width: 40,
      height: 40,
      borderRadius: 20,
      marginRight: 12,
      backgroundColor: theme.border,
    },
    userInfo: {
      flex: 1,
    },
    username: {
      fontSize: 16,
      fontWeight: 'bold',
      color: theme.text,
    },
    groupName: {
      fontSize: 14,
      color: theme.inactive,
    },
    dateText: {
      fontSize: 14,
      color: theme.inactive,
    },
    actionsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      borderTopWidth: 1,
      borderTopColor: theme.border,
      paddingTop: 16,
      marginTop: 16,
    },
    actionButton: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    actionText: {
      marginLeft: 6,
      fontSize: 14,
      color: theme.text,
    },
    commentsContainer: {
      marginTop: 24,
    },
    commentsHeader: {
      fontSize: 18,
      fontWeight: 'bold',
      color: theme.text,
      marginBottom: 16,
    },
    commentInputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      borderTopWidth: 1,
      borderTopColor: theme.border,
      paddingTop: 16,
      marginTop: 16,
    },
    commentInput: {
      flex: 1,
      backgroundColor: theme.card,
      borderRadius: 20,
      paddingHorizontal: 16,
      paddingVertical: 10,
      color: theme.text,
      borderWidth: 1,
      borderColor: theme.border,
    },
    sendButton: {
      marginLeft: 10,
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: theme.primary,
      alignItems: 'center',
      justifyContent: 'center',
    },
    disabledSendButton: {
      backgroundColor: theme.inactive,
    },
    commentItem: {
      flexDirection: 'row',
      marginBottom: 16,
    },
    commentAvatar: {
      width: 32,
      height: 32,
      borderRadius: 16,
      marginRight: 10,
      backgroundColor: theme.border,
    },
    commentContent: {
      flex: 1,
      backgroundColor: theme.card,
      borderRadius: 12,
      padding: 12,
    },
    commentUsername: {
      fontSize: 14,
      fontWeight: 'bold',
      color: theme.text,
      marginBottom: 4,
    },
    commentText: {
      fontSize: 14,
      color: theme.text,
    },
    commentTime: {
      fontSize: 12,
      color: theme.inactive,
      marginTop: 4,
    },
    noCommentsText: {
      color: theme.inactive,
      fontStyle: 'italic',
      textAlign: 'center',
      marginTop: 10,
    }
  });

  // Header option
  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity 
          style={{ marginRight: 10 }}
          onPress={showOptions}
        >
          <Ionicons name="ellipsis-vertical" size={24} color={theme.text} />
        </TouchableOpacity>
      )
    });
  }, [navigation, photo, user.uid, theme.text]);

  if (loading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color={theme.primary} />
      </View>
    );
  }

  if (!photo) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <Text style={{ color: theme.text }}>Photo not found</Text>
      </View>
    );
  }

  // Format date
  const formattedDate = new Date(photo.date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : null}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
    >
      <ScrollView>
        <View style={styles.imageContainer}>
          <Image 
            source={{ uri: photo.imageUrl }} 
            style={styles.image}
          />
        </View>
        
        <View style={styles.contentContainer}>
          <View style={styles.header}>
            <View style={styles.userContainer}>
              <Image 
                source={{ uri: photo.user?.photoURL || 'https://via.placeholder.com/40' }} 
                style={styles.avatar} 
              />
              <View style={styles.userInfo}>
                <Text style={styles.username}>{photo.user?.name || 'Unknown User'}</Text>
                <Text style={styles.groupName}>{photo.group?.name || 'Unknown Group'}</Text>
              </View>
            </View>
            <Text style={styles.dateText}>{formattedDate}</Text>
          </View>
          
          <View style={styles.actionsContainer}>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={toggleLike}
            >
              <Ionicons 
                name={liked ? 'heart' : 'heart-outline'} 
                size={24} 
                color={liked ? '#FF3B30' : theme.inactive} 
              />
              <Text style={styles.actionText}>
                {likesCount > 0 ? `${likesCount} ${likesCount === 1 ? 'Like' : 'Likes'}` : 'Like'}
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={toggleFavorite}
            >
              <Ionicons 
                name={favorited ? 'bookmark' : 'bookmark-outline'} 
                size={24} 
                color={favorited ? theme.primary : theme.inactive} 
              />
              <Text style={styles.actionText}>
                {favorited ? 'Saved' : 'Save'}
              </Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.commentsContainer}>
            <Text style={styles.commentsHeader}>
              Comments {commentsCount > 0 ? `(${commentsCount})` : ''}
            </Text>
            
            {photo.comments && photo.comments.length > 0 ? (
              photo.comments.map((commentItem) => (
                <View key={commentItem.id} style={styles.commentItem}>
                  <Image 
                    source={{ uri: commentItem.userPhotoURL || 'https://via.placeholder.com/32' }} 
                    style={styles.commentAvatar} 
                  />
                  <View style={styles.commentContent}>
                    <Text style={styles.commentUsername}>{commentItem.userName}</Text>
                    <Text style={styles.commentText}>{commentItem.text}</Text>
                    <Text style={styles.commentTime}>
                      {new Date(commentItem.createdAt).toLocaleTimeString([], { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </Text>
                  </View>
                </View>
              ))
            ) : (
              <Text style={styles.noCommentsText}>No comments yet. Be the first to comment!</Text>
            )}
          </View>
        </View>
      </ScrollView>
      
      <View style={styles.commentInputContainer}>
        <TextInput
          style={styles.commentInput}
          placeholder="Add a comment..."
          placeholderTextColor={theme.inactive}
          value={comment}
          onChangeText={setComment}
          multiline
        />
        <TouchableOpacity 
          style={[
            styles.sendButton,
            !comment.trim() && styles.disabledSendButton
          ]}
          onPress={addComment}
          disabled={!comment.trim()}
        >
          <Ionicons name="send" size={20} color="white" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default PhotoDetailScreen; 