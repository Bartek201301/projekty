import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Alert,
  RefreshControl
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { collection, query, where, getDocs, orderBy, limit, deleteDoc, doc } from 'firebase/firestore';
import { ref, deleteObject } from 'firebase/storage';
import { firestore, storage } from '../../services/firebase';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import PhotoCard from '../../components/PhotoCard';

const GroupDetailScreen = () => {
  const [photos, setPhotos] = useState([]);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [groupDetails, setGroupDetails] = useState(null);
  
  const route = useRoute();
  const { group } = route.params;
  const { user } = useAuth();
  const { theme } = useTheme();
  const navigation = useNavigation();

  useEffect(() => {
    // Set up the header options
    navigation.setOptions({
      title: group.name,
      headerRight: () => (
        group.isAdmin ? (
          <TouchableOpacity 
            style={styles.headerButton}
            onPress={showGroupOptions}
          >
            <Ionicons name="ellipsis-vertical" size={24} color={theme.text} />
          </TouchableOpacity>
        ) : null
      )
    });

    fetchGroupDetails();
  }, [navigation, group]);

  const fetchGroupDetails = async () => {
    try {
      setLoading(true);
      
      // Fetch the latest group details
      const groupQuery = query(
        collection(firestore, 'groups'),
        where('id', '==', group.id)
      );
      
      const groupSnapshot = await getDocs(groupQuery);
      
      if (!groupSnapshot.empty) {
        const groupData = groupSnapshot.docs[0].data();
        setGroupDetails({
          ...groupData,
          isAdmin: group.isAdmin
        });
      }
      
      // Fetch group members
      const membersQuery = query(
        collection(firestore, 'group_members'),
        where('groupId', '==', group.id)
      );
      
      const membersSnapshot = await getDocs(membersQuery);
      
      const membersIds = membersSnapshot.docs.map(doc => doc.data().userId);
      
      const membersData = [];
      
      for (const memberId of membersIds) {
        const userQuery = query(
          collection(firestore, 'users'),
          where('uid', '==', memberId)
        );
        
        const userSnapshot = await getDocs(userQuery);
        
        if (!userSnapshot.empty) {
          const userData = userSnapshot.docs[0].data();
          const memberRole = membersSnapshot.docs.find(doc => doc.data().userId === memberId)?.data().role;
          
          membersData.push({
            id: memberId,
            name: userData.displayName,
            photoURL: userData.photoURL,
            role: memberRole
          });
        }
      }
      
      setMembers(membersData);
      
      // Fetch group photos
      const photosQuery = query(
        collection(firestore, 'photos'),
        where('groupId', '==', group.id),
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
        
        return {
          id: doc.id,
          ...photoData,
          user: {
            id: photoData.userId,
            name: userData.displayName || 'Unknown User',
            photoURL: userData.photoURL
          },
          group: {
            id: group.id,
            name: group.name
          }
        };
      }));
      
      setPhotos(photosList);
    } catch (error) {
      console.error('Error fetching group details:', error);
      Alert.alert('Error', 'Failed to load group details. Please try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchGroupDetails();
  };

  const showGroupOptions = () => {
    Alert.alert(
      'Group Options',
      'What would you like to do?',
      [
        {
          text: 'Invite Members',
          onPress: () => navigation.navigate('InviteMembers', { groupId: group.id })
        },
        {
          text: 'Manage Members',
          onPress: () => navigation.navigate('GroupMembers', { 
            groupId: group.id,
            members
          })
        },
        {
          text: 'Delete Group',
          onPress: confirmDeleteGroup,
          style: 'destructive'
        },
        {
          text: 'Cancel',
          style: 'cancel'
        }
      ]
    );
  };

  const confirmDeleteGroup = () => {
    Alert.alert(
      'Delete Group',
      'Are you sure you want to delete this group? This action cannot be undone and all photos will be permanently deleted.',
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Delete',
          onPress: deleteGroup,
          style: 'destructive'
        }
      ]
    );
  };

  const deleteGroup = async () => {
    try {
      setLoading(true);
      
      // Delete all photos in the group
      const photosQuery = query(
        collection(firestore, 'photos'),
        where('groupId', '==', group.id)
      );
      
      const photosSnapshot = await getDocs(photosQuery);
      
      for (const photoDoc of photosSnapshot.docs) {
        const photoData = photoDoc.data();
        
        // Delete the photo file from storage if it exists
        if (photoData.imageUrl) {
          try {
            const photoRef = ref(storage, photoData.imageUrl);
            await deleteObject(photoRef);
          } catch (error) {
            console.error('Error deleting photo from storage:', error);
          }
        }
        
        // Delete the photo document
        await deleteDoc(doc(firestore, 'photos', photoDoc.id));
      }
      
      // Delete all group members
      const membersQuery = query(
        collection(firestore, 'group_members'),
        where('groupId', '==', group.id)
      );
      
      const membersSnapshot = await getDocs(membersQuery);
      
      for (const memberDoc of membersSnapshot.docs) {
        await deleteDoc(doc(firestore, 'group_members', memberDoc.id));
      }
      
      // Delete the group itself
      await deleteDoc(doc(firestore, 'groups', group.id));
      
      // Navigate back to the groups screen
      navigation.goBack();
      
      Alert.alert('Success', 'Group has been deleted successfully.');
    } catch (error) {
      console.error('Error deleting group:', error);
      Alert.alert('Error', 'Failed to delete group. Please try again.');
    } finally {
      setLoading(false);
    }
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
    headerButton: {
      marginRight: 10,
    },
    groupInfoContainer: {
      padding: 16,
    },
    groupHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 16,
    },
    groupImageContainer: {
      marginRight: 16,
    },
    groupImage: {
      width: 70,
      height: 70,
      borderRadius: 35,
      backgroundColor: theme.border,
    },
    groupImagePlaceholder: {
      width: 70,
      height: 70,
      borderRadius: 35,
      backgroundColor: theme.border,
      alignItems: 'center',
      justifyContent: 'center',
    },
    groupDetails: {
      flex: 1,
    },
    groupName: {
      fontSize: 20,
      fontWeight: 'bold',
      color: theme.text,
      marginBottom: 4,
    },
    groupMembersCount: {
      fontSize: 14,
      color: theme.inactive,
      marginBottom: 4,
    },
    groupDescription: {
      fontSize: 14,
      color: theme.text,
      marginTop: 8,
    },
    actionsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      paddingVertical: 16,
      borderTopWidth: 1,
      borderBottomWidth: 1,
      borderColor: theme.border,
      marginBottom: 16,
    },
    actionButton: {
      alignItems: 'center',
    },
    actionIcon: {
      backgroundColor: theme.primary,
      width: 48,
      height: 48,
      borderRadius: 24,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 8,
    },
    actionText: {
      fontSize: 12,
      color: theme.text,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: theme.text,
      marginBottom: 12,
      marginHorizontal: 16,
    },
    membersContainer: {
      marginBottom: 16,
    },
    membersList: {
      paddingHorizontal: 16,
    },
    memberItem: {
      flexDirection: 'row',
      alignItems: 'center',
      marginRight: 16,
    },
    memberAvatar: {
      width: 50,
      height: 50,
      borderRadius: 25,
      backgroundColor: theme.border,
    },
    memberAvatarPlaceholder: {
      width: 50,
      height: 50,
      borderRadius: 25,
      backgroundColor: theme.border,
      alignItems: 'center',
      justifyContent: 'center',
    },
    memberName: {
      fontSize: 12,
      color: theme.text,
      textAlign: 'center',
      marginTop: 4,
      maxWidth: 60,
    },
    adminBadge: {
      position: 'absolute',
      bottom: 18,
      right: -5,
      backgroundColor: theme.primary,
      borderRadius: 10,
      width: 20,
      height: 20,
      alignItems: 'center',
      justifyContent: 'center',
    },
    divider: {
      height: 1,
      backgroundColor: theme.border,
      marginVertical: 16,
    },
    photosContainer: {
      flex: 1,
      paddingHorizontal: 16,
    },
    viewAllButton: {
      flexDirection: 'row',
      alignItems: 'center',
      alignSelf: 'flex-end',
      marginRight: 16,
      marginBottom: 12,
    },
    viewAllText: {
      color: theme.primary,
      marginRight: 4,
    },
    emptyPhotosContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      padding: 20,
      marginTop: 20,
    },
    emptyPhotosText: {
      fontSize: 16,
      color: theme.inactive,
      textAlign: 'center',
      marginTop: 10,
    },
    addPhotoButton: {
      backgroundColor: theme.primary,
      paddingVertical: 12,
      paddingHorizontal: 20,
      borderRadius: 8,
      marginTop: 20,
      flexDirection: 'row',
      alignItems: 'center',
    },
    addPhotoButtonText: {
      color: 'white',
      fontWeight: 'bold',
      marginLeft: 8,
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
      <FlatList
        data={photos}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[theme.primary]}
            tintColor={theme.primary}
          />
        }
        ListHeaderComponent={
          <>
            {/* Group info */}
            <View style={styles.groupInfoContainer}>
              <View style={styles.groupHeader}>
                <View style={styles.groupImageContainer}>
                  {groupDetails?.photoURL ? (
                    <Image 
                      source={{ uri: groupDetails.photoURL }} 
                      style={styles.groupImage} 
                    />
                  ) : (
                    <View style={styles.groupImagePlaceholder}>
                      <Ionicons name="people" size={30} color={theme.primary} />
                    </View>
                  )}
                </View>
                <View style={styles.groupDetails}>
                  <Text style={styles.groupName}>{groupDetails?.name || group.name}</Text>
                  <Text style={styles.groupMembersCount}>
                    {members.length} {members.length === 1 ? 'member' : 'members'}
                  </Text>
                  {groupDetails?.description && (
                    <Text style={styles.groupDescription}>{groupDetails.description}</Text>
                  )}
                </View>
              </View>
            </View>
            
            {/* Actions */}
            <View style={styles.actionsContainer}>
              <TouchableOpacity 
                style={styles.actionButton}
                onPress={() => navigation.navigate('Calendar', { initialGroupId: group.id })}
              >
                <View style={styles.actionIcon}>
                  <Ionicons name="calendar" size={24} color="white" />
                </View>
                <Text style={styles.actionText}>Calendar</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.actionButton}
                onPress={() => navigation.navigate('Camera', { groupId: group.id })}
              >
                <View style={styles.actionIcon}>
                  <Ionicons name="camera" size={24} color="white" />
                </View>
                <Text style={styles.actionText}>Add Photo</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.actionButton}
                onPress={() => navigation.navigate('GroupMembers', { 
                  groupId: group.id,
                  members
                })}
              >
                <View style={styles.actionIcon}>
                  <Ionicons name="people" size={24} color="white" />
                </View>
                <Text style={styles.actionText}>Members</Text>
              </TouchableOpacity>
            </View>
            
            {/* Members */}
            <Text style={styles.sectionTitle}>Members</Text>
            <View style={styles.membersContainer}>
              <FlatList
                data={members.slice(0, 5)} // Show first 5 members
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.membersList}
                renderItem={({ item }) => (
                  <View style={styles.memberItem}>
                    {item.photoURL ? (
                      <Image 
                        source={{ uri: item.photoURL }} 
                        style={styles.memberAvatar} 
                      />
                    ) : (
                      <View style={styles.memberAvatarPlaceholder}>
                        <Ionicons name="person" size={22} color={theme.inactive} />
                      </View>
                    )}
                    {item.role === 'admin' && (
                      <View style={styles.adminBadge}>
                        <Ionicons name="star" size={14} color="white" />
                      </View>
                    )}
                    <Text style={styles.memberName} numberOfLines={1}>
                      {item.name}
                    </Text>
                  </View>
                )}
                keyExtractor={item => item.id}
                ListFooterComponent={() => 
                  members.length > 5 ? (
                    <TouchableOpacity 
                      style={[styles.memberItem, { justifyContent: 'center' }]}
                      onPress={() => navigation.navigate('GroupMembers', { 
                        groupId: group.id,
                        members
                      })}
                    >
                      <View style={[styles.memberAvatarPlaceholder, { backgroundColor: theme.card }]}>
                        <Text style={{ color: theme.text, fontWeight: 'bold' }}>
                          +{members.length - 5}
                        </Text>
                      </View>
                      <Text style={styles.memberName}>View All</Text>
                    </TouchableOpacity>
                  ) : null
                }
              />
            </View>
            
            <View style={styles.divider} />
            
            {/* Photos */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text style={styles.sectionTitle}>Photos</Text>
              {photos.length > 0 && (
                <TouchableOpacity 
                  style={styles.viewAllButton}
                  onPress={() => navigation.navigate('Calendar', { initialGroupId: group.id })}
                >
                  <Text style={styles.viewAllText}>View in Calendar</Text>
                  <Ionicons name="arrow-forward" size={16} color={theme.primary} />
                </TouchableOpacity>
              )}
            </View>
            
            {photos.length === 0 && (
              <View style={styles.emptyPhotosContainer}>
                <Ionicons name="images-outline" size={60} color={theme.inactive} />
                <Text style={styles.emptyPhotosText}>
                  No photos yet. Be the first to add a photo!
                </Text>
                <TouchableOpacity 
                  style={styles.addPhotoButton}
                  onPress={() => navigation.navigate('Camera', { groupId: group.id })}
                >
                  <Ionicons name="camera" size={20} color="white" />
                  <Text style={styles.addPhotoButtonText}>Add Photo</Text>
                </TouchableOpacity>
              </View>
            )}
          </>
        }
      />
    </View>
  );
};

export default GroupDetailScreen; 