import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  Image, 
  TouchableOpacity, 
  StyleSheet, 
  RefreshControl,
  ActivityIndicator,
  StatusBar,
  Platform
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
  const [error, setError] = useState(null);
  const { user } = useAuth();
  const { theme } = useTheme();
  const navigation = useNavigation();

  const fetchRecentPhotos = async () => {
    try {
      setLoading(true);
      setError(null);
      
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
      // Due to Firestore limitations, we can only query 'in' with max 10 values
      // So we need to batch our queries if we have more than 10 groups
      let allPhotos = [];
      
      // Split groups into batches of 10
      for (let i = 0; i < userGroups.length; i += 10) {
        const groupBatch = userGroups.slice(i, i + 10);
        
        const photosQuery = query(
          collection(firestore, 'photos'),
          where('groupId', 'in', groupBatch),
          orderBy('createdAt', 'desc'),
          limit(20)
        );
        
        const photosSnapshot = await getDocs(photosQuery);
        
        const photosBatch = await Promise.all(photosSnapshot.docs.map(async (doc) => {
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
              name: userData.displayName || 'Nieznany użytkownik',
              photoURL: userData.photoURL
            },
            group: {
              id: photoData.groupId,
              name: groupData.name || 'Nieznana grupa'
            }
          };
        }));
        
        allPhotos = [...allPhotos, ...photosBatch];
      }
      
      // Sort all photos by date
      allPhotos.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      
      // Take only top 20
      setPhotos(allPhotos.slice(0, 20));
    } catch (error) {
      console.error('Error fetching photos:', error);
      setError('Nie można załadować zdjęć. Spróbuj ponownie później.');
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
      paddingTop: Platform.OS === 'ios' ? 50 : StatusBar.currentHeight,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 16,
      paddingVertical: 16,
    },
    headerTitle: {
      fontSize: 28,
      fontWeight: 'bold',
      color: theme.text,
    },
    actionButton: {
      width: 32,
      height: 32,
      borderRadius: 16,
      alignItems: 'center',
      justifyContent: 'center',
    },
    emptyContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      padding: 20,
    },
    emptyIcon: {
      marginBottom: 16,
    },
    emptyText: {
      fontSize: 16,
      color: theme.secondaryText,
      textAlign: 'center',
      marginBottom: 20,
    },
    createGroupButton: {
      backgroundColor: theme.accent,
      paddingVertical: 12,
      paddingHorizontal: 20,
      borderRadius: 8,
      marginTop: 10,
    },
    createGroupButtonText: {
      color: 'white',
      fontWeight: 'bold',
    },
    errorContainer: {
      padding: 20,
      alignItems: 'center',
    },
    errorText: {
      color: theme.error,
      textAlign: 'center',
      marginBottom: 15,
    },
    retryButton: {
      paddingVertical: 8,
      paddingHorizontal: 16,
      backgroundColor: theme.accent,
      borderRadius: 6,
    },
    retryButtonText: {
      color: 'white',
      fontWeight: '600',
    },
    loader: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    photoList: {
      paddingHorizontal: 16,
      paddingBottom: 20
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
      <StatusBar barStyle="light-content" />
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>SnapCal</Text>
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => navigation.navigate('Camera')}
        >
          <Ionicons name="camera" size={24} color={theme.text} />
        </TouchableOpacity>
      </View>
      
      {error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity 
            style={styles.retryButton}
            onPress={fetchRecentPhotos}
          >
            <Text style={styles.retryButtonText}>Spróbuj ponownie</Text>
          </TouchableOpacity>
        </View>
      ) : photos.length > 0 ? (
        <FlatList
          data={photos}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.photoList}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={theme.text}
            />
          }
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Ionicons 
            name="images-outline" 
            size={60} 
            color={theme.inactive}
            style={styles.emptyIcon}
          />
          <Text style={styles.emptyText}>
            Nie masz jeszcze zdjęć. Dołącz do grupy lub utwórz nową, aby zacząć dzielić się zdjęciami!
          </Text>
          <TouchableOpacity 
            style={styles.createGroupButton}
            onPress={() => navigation.navigate('CreateGroup')}
          >
            <Text style={styles.createGroupButtonText}>Utwórz nową grupę</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default HomeScreen; 