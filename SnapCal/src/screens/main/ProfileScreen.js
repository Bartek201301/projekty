import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  Dimensions,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { collection, query, where, getDocs, orderBy, limit } from 'firebase/firestore';
import { firestore } from '../../services/firebase';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';

const { width } = Dimensions.get('window');
const imageSize = (width - 48) / 3; // 3 columns with margins

const ProfileScreen = () => {
  const [userPhotos, setUserPhotos] = useState([]);
  const [favoritePhotos, setFavoritePhotos] = useState([]);
  const [selectedTab, setSelectedTab] = useState('photos');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  
  const { user, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigation = useNavigation();

  useEffect(() => {
    fetchUserContent();
  }, []);

  const fetchUserContent = async () => {
    try {
      setLoading(true);
      
      // Fetch user's photos
      const userPhotosQuery = query(
        collection(firestore, 'photos'),
        where('userId', '==', user.uid),
        orderBy('createdAt', 'desc'),
        limit(30)
      );
      
      const userPhotosSnapshot = await getDocs(userPhotosQuery);
      
      const photosData = await Promise.all(userPhotosSnapshot.docs.map(async (doc) => {
        const photoData = doc.data();
        
        // Get group info
        const groupQuery = query(
          collection(firestore, 'groups'),
          where('id', '==', photoData.groupId)
        );
        
        const groupSnapshot = await getDocs(groupQuery);
        const groupData = groupSnapshot.docs[0]?.data() || {};
        
        return {
          id: doc.id,
          ...photoData,
          user: {
            id: user.uid,
            name: user.displayName,
            photoURL: user.photoURL
          },
          group: {
            id: photoData.groupId,
            name: groupData.name || 'Unknown Group'
          }
        };
      }));
      
      setUserPhotos(photosData);
      
      // Fetch user's favorite photos
      const favoritePhotosQuery = query(
        collection(firestore, 'photos'),
        where('favorites', 'array-contains', user.uid),
        orderBy('createdAt', 'desc'),
        limit(30)
      );
      
      const favoritePhotosSnapshot = await getDocs(favoritePhotosQuery);
      
      const favoritesData = await Promise.all(favoritePhotosSnapshot.docs.map(async (doc) => {
        const photoData = doc.data();
        
        // Get user info
        const photoUserQuery = query(
          collection(firestore, 'users'),
          where('uid', '==', photoData.userId)
        );
        
        const photoUserSnapshot = await getDocs(photoUserQuery);
        const photoUserData = photoUserSnapshot.docs[0]?.data() || {};
        
        // Get group info
        const groupQuery = query(
          collection(firestore, 'groups'),
          where('id', '==', photoData.groupId)
        );
        
        const groupSnapshot = await getDocs(groupQuery);
        const groupData = groupSnapshot.docs[0]?.data() || {};
        
        return {
          id: doc.id,
          ...photoData,
          user: {
            id: photoData.userId,
            name: photoUserData.displayName || 'Unknown User',
            photoURL: photoUserData.photoURL
          },
          group: {
            id: photoData.groupId,
            name: groupData.name || 'Unknown Group'
          }
        };
      }));
      
      setFavoritePhotos(favoritesData);
    } catch (error) {
      console.error('Error fetching profile data:', error);
      Alert.alert('Error', 'Failed to load profile data. Please try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchUserContent();
  };

  const confirmSignOut = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Sign Out',
          onPress: signOut,
          style: 'destructive'
        }
      ]
    );
  };

  const renderGridItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.gridItem}
      onPress={() => navigation.navigate('PhotoDetail', { photo: item })}
    >
      <Image source={{ uri: item.imageUrl }} style={styles.gridImage} />
    </TouchableOpacity>
  );

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    scrollContent: {
      paddingBottom: 20,
    },
    header: {
      padding: 16,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    userInfoContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    avatar: {
      width: 60,
      height: 60,
      borderRadius: 30,
      marginRight: 16,
      backgroundColor: theme.border,
    },
    userInfo: {
      flex: 1,
    },
    username: {
      fontSize: 20,
      fontWeight: 'bold',
      color: theme.text,
      marginBottom: 2,
    },
    email: {
      fontSize: 14,
      color: theme.inactive,
    },
    optionsButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.card,
    },
    statsContainer: {
      flexDirection: 'row',
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderTopWidth: 1,
      borderBottomWidth: 1,
      borderColor: theme.border,
      marginBottom: 16,
    },
    statItem: {
      flex: 1,
      alignItems: 'center',
    },
    statNumber: {
      fontSize: 18,
      fontWeight: 'bold',
      color: theme.text,
      marginBottom: 4,
    },
    statLabel: {
      fontSize: 14,
      color: theme.inactive,
    },
    tabsContainer: {
      flexDirection: 'row',
      marginBottom: 16,
      paddingHorizontal: 16,
    },
    tab: {
      flex: 1,
      paddingVertical: 12,
      alignItems: 'center',
      borderBottomWidth: 2,
      borderBottomColor: 'transparent',
    },
    activeTab: {
      borderBottomColor: theme.primary,
    },
    tabText: {
      color: theme.inactive,
      fontWeight: '500',
    },
    activeTabText: {
      color: theme.primary,
      fontWeight: 'bold',
    },
    gridContainer: {
      paddingHorizontal: 12,
    },
    gridItem: {
      margin: 4,
      borderRadius: 8,
      overflow: 'hidden',
      backgroundColor: theme.border,
    },
    gridImage: {
      width: imageSize,
      height: imageSize,
      resizeMode: 'cover',
    },
    emptyContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      padding: 20,
      marginTop: 20,
    },
    emptyText: {
      fontSize: 16,
      color: theme.inactive,
      textAlign: 'center',
      marginTop: 12,
    },
    actionButton: {
      backgroundColor: theme.primary,
      paddingVertical: 12,
      paddingHorizontal: 20,
      borderRadius: 8,
      marginTop: 20,
      flexDirection: 'row',
      alignItems: 'center',
    },
    actionButtonText: {
      color: 'white',
      fontWeight: 'bold',
      marginLeft: 8,
    },
    loader: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    optionsMenu: {
      backgroundColor: theme.card,
      borderRadius: 12,
      padding: 8,
      elevation: 5,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
    },
    menuItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 12,
      paddingHorizontal: 16,
    },
    menuText: {
      marginLeft: 12,
      fontSize: 16,
      color: theme.text,
    },
    divider: {
      height: 1,
      backgroundColor: theme.border,
      marginVertical: 4,
    }
  });

  const showOptions = () => {
    Alert.alert(
      'Options',
      '',
      [
        {
          text: 'Toggle Theme',
          onPress: toggleTheme,
        },
        {
          text: 'Sign Out',
          onPress: confirmSignOut,
          style: 'destructive'
        },
        {
          text: 'Cancel',
          style: 'cancel'
        }
      ]
    );
  };

  if (loading && !refreshing) {
    return (
      <View style={[styles.container, styles.loader]}>
        <ActivityIndicator size="large" color={theme.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[theme.primary]}
            tintColor={theme.primary}
          />
        }
      >
        {/* Header with user info */}
        <View style={styles.header}>
          <View style={styles.userInfoContainer}>
            <Image 
              source={{ uri: user.photoURL || 'https://via.placeholder.com/60' }} 
              style={styles.avatar} 
            />
            <View style={styles.userInfo}>
              <Text style={styles.username}>{user.displayName}</Text>
              <Text style={styles.email}>{user.email}</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.optionsButton} onPress={showOptions}>
            <Ionicons name="ellipsis-vertical" size={22} color={theme.text} />
          </TouchableOpacity>
        </View>
        
        {/* Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{userPhotos.length}</Text>
            <Text style={styles.statLabel}>Photos</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{favoritePhotos.length}</Text>
            <Text style={styles.statLabel}>Favorites</Text>
          </View>
        </View>
        
        {/* Tabs */}
        <View style={styles.tabsContainer}>
          <TouchableOpacity 
            style={[styles.tab, selectedTab === 'photos' && styles.activeTab]}
            onPress={() => setSelectedTab('photos')}
          >
            <Text style={[styles.tabText, selectedTab === 'photos' && styles.activeTabText]}>
              My Photos
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tab, selectedTab === 'favorites' && styles.activeTab]}
            onPress={() => setSelectedTab('favorites')}
          >
            <Text style={[styles.tabText, selectedTab === 'favorites' && styles.activeTabText]}>
              Favorites
            </Text>
          </TouchableOpacity>
        </View>
        
        {/* Content based on selected tab */}
        {selectedTab === 'photos' ? (
          userPhotos.length > 0 ? (
            <FlatList
              data={userPhotos}
              renderItem={renderGridItem}
              keyExtractor={item => item.id}
              numColumns={3}
              scrollEnabled={false}
              contentContainerStyle={styles.gridContainer}
            />
          ) : (
            <View style={styles.emptyContainer}>
              <Ionicons name="images-outline" size={60} color={theme.inactive} />
              <Text style={styles.emptyText}>
                You haven't added any photos yet. Take and share your first photo!
              </Text>
              <TouchableOpacity 
                style={styles.actionButton}
                onPress={() => navigation.navigate('Camera')}
              >
                <Ionicons name="camera" size={20} color="white" />
                <Text style={styles.actionButtonText}>Take Photo</Text>
              </TouchableOpacity>
            </View>
          )
        ) : (
          favoritePhotos.length > 0 ? (
            <FlatList
              data={favoritePhotos}
              renderItem={renderGridItem}
              keyExtractor={item => item.id}
              numColumns={3}
              scrollEnabled={false}
              contentContainerStyle={styles.gridContainer}
            />
          ) : (
            <View style={styles.emptyContainer}>
              <Ionicons name="heart-outline" size={60} color={theme.inactive} />
              <Text style={styles.emptyText}>
                You haven't favorited any photos yet. Find photos you like and save them!
              </Text>
              <TouchableOpacity 
                style={styles.actionButton}
                onPress={() => navigation.navigate('Home')}
              >
                <Ionicons name="home" size={20} color="white" />
                <Text style={styles.actionButtonText}>Explore Photos</Text>
              </TouchableOpacity>
            </View>
          )
        )}
      </ScrollView>
    </View>
  );
};

export default ProfileScreen; 