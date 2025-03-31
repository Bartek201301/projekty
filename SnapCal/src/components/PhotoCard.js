import React, { useState } from 'react';
import { 
  View, 
  Image, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  Dimensions,
  Pressable
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { doc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { firestore } from '../services/firebase';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width - 32; // 16px padding on each side

const PhotoCard = ({ photo, onPress }) => {
  const { theme } = useTheme();
  const { user } = useAuth();
  const [liked, setLiked] = useState(photo.likes?.includes(user.uid) || false);
  const [favorites, setFavorites] = useState(photo.favorites?.includes(user.uid) || false);
  const [likesCount, setLikesCount] = useState(photo.likes?.length || 0);

  const formattedDate = new Date(photo.date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });

  const toggleLike = async () => {
    const photoRef = doc(firestore, 'photos', photo.id);
    try {
      if (liked) {
        await updateDoc(photoRef, {
          likes: arrayRemove(user.uid)
        });
        setLikesCount(prev => prev - 1);
      } else {
        await updateDoc(photoRef, {
          likes: arrayUnion(user.uid)
        });
        setLikesCount(prev => prev + 1);
      }
      setLiked(!liked);
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  const toggleFavorite = async () => {
    const photoRef = doc(firestore, 'photos', photo.id);
    try {
      if (favorites) {
        await updateDoc(photoRef, {
          favorites: arrayRemove(user.uid)
        });
      } else {
        await updateDoc(photoRef, {
          favorites: arrayUnion(user.uid)
        });
      }
      setFavorites(!favorites);
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  const styles = StyleSheet.create({
    container: {
      backgroundColor: theme.card,
      borderRadius: 12,
      marginBottom: 16,
      overflow: 'hidden',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 5,
    },
    imageContainer: {
      width: CARD_WIDTH,
      height: CARD_WIDTH,
      backgroundColor: '#f0f0f0',
    },
    image: {
      width: '100%',
      height: '100%',
      resizeMode: 'cover',
    },
    infoContainer: {
      padding: 12,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 8,
    },
    userContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    avatar: {
      width: 36,
      height: 36,
      borderRadius: 18,
      marginRight: 10,
      backgroundColor: theme.border,
    },
    textContainer: {
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
      paddingTop: 8,
      borderTopWidth: 1,
      borderTopColor: theme.border,
      marginTop: 8,
    },
    actionButton: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 6,
    },
    actionText: {
      marginLeft: 4,
      fontSize: 14,
      color: theme.text,
    },
    likesText: {
      fontSize: 14,
      fontWeight: 'bold',
      color: theme.text,
      marginLeft: 4,
    }
  });

  return (
    <View style={styles.container}>
      <Pressable onPress={onPress}>
        <View style={styles.imageContainer}>
          <Image source={{ uri: photo.imageUrl }} style={styles.image} />
        </View>
      </Pressable>
      
      <View style={styles.infoContainer}>
        <View style={styles.header}>
          <View style={styles.userContainer}>
            <Image 
              source={{ uri: photo.user.photoURL || 'https://via.placeholder.com/36' }} 
              style={styles.avatar} 
            />
            <View style={styles.textContainer}>
              <Text style={styles.username}>{photo.user.name}</Text>
              <Text style={styles.groupName}>{photo.group.name}</Text>
            </View>
          </View>
          <Text style={styles.dateText}>{formattedDate}</Text>
        </View>
        
        <View style={styles.actionsContainer}>
          <TouchableOpacity style={styles.actionButton} onPress={toggleLike}>
            <Ionicons 
              name={liked ? 'heart' : 'heart-outline'} 
              size={22} 
              color={liked ? '#FF3B30' : theme.inactive} 
            />
            {likesCount > 0 && <Text style={styles.likesText}>{likesCount}</Text>}
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton} onPress={toggleFavorite}>
            <Ionicons 
              name={favorites ? 'bookmark' : 'bookmark-outline'} 
              size={22} 
              color={favorites ? theme.primary : theme.inactive} 
            />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton} onPress={onPress}>
            <Ionicons name="chatbubble-outline" size={22} color={theme.inactive} />
            <Text style={styles.actionText}>
              {photo.comments?.length > 0 ? photo.comments.length : ''}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default PhotoCard; 