import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  Image, 
  TouchableOpacity, 
  StyleSheet, 
  RefreshControl,
  ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { collection, query, where, orderBy, limit, getDocs } from 'firebase/firestore';
import { firestore } from '../../services/firebase';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import PhotoCard from '../../components/PhotoCard';

const HomeScreen = () => {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { user } = useAuth();
  const { theme } = useTheme();
  const navigation = useNavigation();

  const fetchRecentPhotos = async () => {
    try {
      setLoading(true);
      
      // First get user's groups
      const groupsQuery = query(
        collection(firestore, 'group_members'),
        where('userId', '==', user.uid)
      );
      
      const groupsSnapshot = await getDocs(groupsQuery);
      const userGroups = groupsSnapshot.docs.map(doc => doc.data().groupId);
      
      if (userGroups.length === 0) {
        setPhotos([]);
        setLoading(false);
        return;
      }
      
      // Then get recent photos from those groups
      const photosQuery = query(
        collection(firestore, 'photos'),
        where('groupId', 'in', userGroups),
        orderBy('createdAt', 'desc'),
        limit(20)
      );
      
      const photosSnapshot = await getDocs(photosQuery);
      
      const photosList = await Promise.all(photosSnapshot.docs.map(async (doc) => {
        const photoData = doc.data();
        
        // Get user info
        const userDoc = await getDocs(query(
          collection(firestore, 'users'),
          where('uid', '==', photoData.userId)
        ));
        
        const userData = userDoc.docs[0]?.data() || {};
        
        // Get group info
        const groupDoc = await getDocs(query(
          collection(firestore, 'groups'),
          where('id', '==', photoData.groupId)
        ));
        
        const groupData = groupDoc.docs[0]?.data() || {};
        
        return {
          id: doc.id,
          ...photoData,
          user: {
            id: photoData.userId,
            name: userData.displayName || 'Unknown User',
            photoURL: userData.photoURL
          },
          group: {
            id: photoData.groupId,
            name: groupData.name || 'Unknown Group'
          }
        };
      }));
      
      setPhotos(photosList);
    } catch (error) {
      console.error('Error fetching photos:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchRecentPhotos();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchRecentPhotos();
  };

  const renderItem = ({ item }) => (
    <PhotoCard 
      photo={item} 
      onPress={() => navigation.navigate('PhotoDetail', { photo: item })}
    />
  );

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 16,
      paddingVertical: 12,
    },
    headerTitle: {
      fontSize: 22,
      fontWeight: 'bold',
      color: theme.text,
    },
    cameraButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: theme.primary,
      alignItems: 'center',
      justifyContent: 'center',
    },
    emptyContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      padding: 20,
    },
    emptyText: {
      fontSize: 16,
      color: theme.inactive,
      textAlign: 'center',
      marginTop: 10,
    },
    createGroupButton: {
      backgroundColor: theme.primary,
      paddingVertical: 12,
      paddingHorizontal: 20,
      borderRadius: 8,
      marginTop: 20,
    },
    createGroupButtonText: {
      color: 'white',
      fontWeight: 'bold',
    },
    loader: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    }
  });

  if (loading && !refreshing) {
    return (
      <View style={[styles.container, styles.loader]}>
        <ActivityIndicator size="large" color={theme.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Home</Text>
        <TouchableOpacity 
          style={styles.cameraButton}
          onPress={() => navigation.navigate('Camera')}
        >
          <Ionicons name="camera" size={22} color="white" />
        </TouchableOpacity>
      </View>
      
      {photos.length > 0 ? (
        <FlatList
          data={photos}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 20 }}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[theme.primary]}
              tintColor={theme.primary}
            />
          }
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Ionicons name="images-outline" size={60} color={theme.inactive} />
          <Text style={styles.emptyText}>
            No photos yet. Join or create a group to start sharing photos!
          </Text>
          <TouchableOpacity 
            style={styles.createGroupButton}
            onPress={() => navigation.navigate('CreateGroup')}
          >
            <Text style={styles.createGroupButtonText}>Create New Group</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default HomeScreen; 