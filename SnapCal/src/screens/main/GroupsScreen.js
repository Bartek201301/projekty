import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  TouchableOpacity, 
  StyleSheet, 
  Image, 
  ActivityIndicator,
  RefreshControl,
  StatusBar,
  Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { firestore } from '../../services/firebase';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';

const GroupsScreen = () => {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useAuth();
  const { theme } = useTheme();
  const navigation = useNavigation();
  const route = useRoute();

  const fetchUserGroups = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // First get user's group memberships
      const membershipQuery = query(
        collection(firestore, 'group_members'),
        where('userId', '==', user.uid)
      );
      
      const membershipSnapshot = await getDocs(membershipQuery);
      const userGroupMemberships = membershipSnapshot.docs.map(doc => ({
        groupId: doc.data().groupId,
        role: doc.data().role
      }));
      
      const groupIds = userGroupMemberships.map(membership => membership.groupId);
      
      if (groupIds.length === 0) {
        setGroups([]);
        setLoading(false);
        return;
      }
      
      // For each group ID, get the group details
      const groupsData = [];
      
      for (const groupId of groupIds) {
        const groupQuery = query(
          collection(firestore, 'groups'),
          where('id', '==', groupId)
        );
        
        const groupSnapshot = await getDocs(groupQuery);
        
        if (!groupSnapshot.empty) {
          const groupDoc = groupSnapshot.docs[0];
          const groupData = groupDoc.data();
          
          // Get member count
          const membersQuery = query(
            collection(firestore, 'group_members'),
            where('groupId', '==', groupId)
          );
          
          const membersSnapshot = await getDocs(membersQuery);
          
          // Get the most recent photos
          const photosQuery = query(
            collection(firestore, 'photos'),
            where('groupId', '==', groupId)
          );
          
          const photosSnapshot = await getDocs(photosQuery);
          
          // Find user role for this group
          const membership = userGroupMemberships.find(m => m.groupId === groupId);
          
          groupsData.push({
            id: groupId,
            name: groupData.name,
            description: groupData.description,
            photoURL: groupData.photoURL,
            createdAt: groupData.createdAt,
            createdBy: groupData.createdBy,
            memberCount: membersSnapshot.size,
            photoCount: photosSnapshot.size,
            isAdmin: membership.role === 'admin',
            role: membership.role
          });
        }
      }
      
      // Sort groups by creation date (most recent first)
      groupsData.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      
      setGroups(groupsData);
    } catch (error) {
      console.error('Error fetching groups:', error);
      setError('Nie można załadować grup. Spróbuj ponownie później.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Handle new group addition from CreateGroupScreen in demo mode
  useEffect(() => {
    if (route.params?.newGroupCreated && route.params?.groupInfo) {
      const newGroup = route.params.groupInfo;
      
      // Check if group already exists in the list
      if (!groups.some(group => group.id === newGroup.id)) {
        setGroups(prevGroups => [newGroup, ...prevGroups]);
      }
      
      // Clear params to prevent duplicates
      navigation.setParams({ newGroupCreated: undefined, groupInfo: undefined });
    }
  }, [route.params]);
  
  // Initial fetch and refetch on focus
  useFocusEffect(
    React.useCallback(() => {
      fetchUserGroups();
    }, [user.uid])
  );

  const onRefresh = () => {
    setRefreshing(true);
    fetchUserGroups();
  };

  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity 
        style={styles.groupCard}
        onPress={() => navigation.navigate('GroupDetail', { group: item })}
      >
        <View style={styles.groupHeader}>
          <View style={styles.groupImageContainer}>
            {item.photoURL ? (
              <Image 
                source={{ uri: item.photoURL }} 
                style={styles.groupImage} 
              />
            ) : (
              <View style={[styles.groupImage, styles.placeholderImage]}>
                <Ionicons name="people" size={32} color={theme.accent} />
              </View>
            )}
          </View>
          <View style={styles.groupInfo}>
            <Text style={styles.groupName}>{item.name}</Text>
            <Text style={styles.groupMembers}>
              {item.memberCount} {item.memberCount === 1 ? 'członek' : 'członków'}
            </Text>
            {item.isAdmin && (
              <View style={styles.adminBadge}>
                <Text style={styles.adminText}>Admin</Text>
              </View>
            )}
          </View>
          <Ionicons name="chevron-forward" size={24} color={theme.inactive} />
        </View>
        
        <Text style={styles.groupDescription} numberOfLines={2}>
          {item.description || 'Brak opisu'}
        </Text>
        
        <View style={styles.statsContainer}>
          <View style={styles.stat}>
            <Ionicons name="image-outline" size={18} color={theme.accent} />
            <Text style={styles.statText}>
              {item.photoCount} {item.photoCount === 1 ? 'zdjęcie' : 'zdjęć'}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

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
    addButton: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: theme.accent,
      alignItems: 'center',
      justifyContent: 'center',
    },
    groupCard: {
      backgroundColor: theme.card,
      borderRadius: 12,
      marginBottom: 16,
      padding: 16,
      shadowColor: theme.cardShadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 4,
      elevation: 3,
    },
    groupHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 10,
    },
    groupImageContainer: {
      marginRight: 12,
    },
    groupImage: {
      width: 56,
      height: 56,
      borderRadius: 28,
    },
    placeholderImage: {
      backgroundColor: theme.border,
      alignItems: 'center',
      justifyContent: 'center',
    },
    groupInfo: {
      flex: 1,
    },
    groupName: {
      fontSize: 18,
      fontWeight: 'bold',
      color: theme.text,
      marginBottom: 2,
    },
    groupMembers: {
      fontSize: 14,
      color: theme.secondaryText,
    },
    adminBadge: {
      backgroundColor: theme.accent,
      paddingHorizontal: 8,
      paddingVertical: 2,
      borderRadius: 4,
      alignSelf: 'flex-start',
      marginTop: 4,
    },
    adminText: {
      color: 'white',
      fontSize: 12,
      fontWeight: 'bold',
    },
    groupDescription: {
      fontSize: 14,
      color: theme.secondaryText,
      marginBottom: 10,
    },
    statsContainer: {
      flexDirection: 'row',
      borderTopWidth: 1,
      borderTopColor: theme.border,
      paddingTop: 10,
    },
    stat: {
      flexDirection: 'row',
      alignItems: 'center',
      marginRight: 16,
    },
    statText: {
      fontSize: 14,
      color: theme.secondaryText,
      marginLeft: 4,
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
    createButton: {
      backgroundColor: theme.accent,
      paddingVertical: 12,
      paddingHorizontal: 20,
      borderRadius: 8,
    },
    createButtonText: {
      color: 'white',
      fontWeight: 'bold',
      fontSize: 16,
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
        <Text style={styles.headerTitle}>Moje Grupy</Text>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => navigation.navigate('CreateGroup')}
        >
          <Ionicons name="add" size={24} color="white" />
        </TouchableOpacity>
      </View>
      
      {error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity 
            style={styles.retryButton}
            onPress={fetchUserGroups}
          >
            <Text style={styles.retryButtonText}>Spróbuj ponownie</Text>
          </TouchableOpacity>
        </View>
      ) : groups.length > 0 ? (
        <FlatList
          data={groups}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          contentContainerStyle={{ padding: 16 }}
          showsVerticalScrollIndicator={false}
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
            name="people-outline" 
            size={70} 
            color={theme.inactive} 
            style={styles.emptyIcon} 
          />
          <Text style={styles.emptyText}>
            Nie należysz jeszcze do żadnej grupy. Utwórz swoją pierwszą grupę, aby zacząć dzielić się zdjęciami!
          </Text>
          <TouchableOpacity 
            style={styles.createButton}
            onPress={() => navigation.navigate('CreateGroup')}
          >
            <Text style={styles.createButtonText}>Utwórz nową grupę</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default GroupsScreen; 