import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  TouchableOpacity, 
  StyleSheet, 
  Image, 
  ActivityIndicator 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { firestore } from '../../services/firebase';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';

const GroupsScreen = () => {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { theme } = useTheme();
  const navigation = useNavigation();

  useEffect(() => {
    const fetchUserGroups = async () => {
      try {
        setLoading(true);
        
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
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserGroups();
  }, [user.uid]);

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
                <Ionicons name="people" size={32} color={theme.primary} />
              </View>
            )}
          </View>
          <View style={styles.groupInfo}>
            <Text style={styles.groupName}>{item.name}</Text>
            <Text style={styles.groupMembers}>
              {item.memberCount} {item.memberCount === 1 ? 'member' : 'members'}
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
          {item.description || 'No description'}
        </Text>
        
        <View style={styles.statsContainer}>
          <View style={styles.stat}>
            <Ionicons name="image-outline" size={18} color={theme.primary} />
            <Text style={styles.statText}>
              {item.photoCount} {item.photoCount === 1 ? 'photo' : 'photos'}
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
    addButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: theme.primary,
      alignItems: 'center',
      justifyContent: 'center',
    },
    groupCard: {
      backgroundColor: theme.card,
      borderRadius: 12,
      marginBottom: 16,
      padding: 16,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
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
      color: theme.inactive,
    },
    adminBadge: {
      backgroundColor: theme.primary,
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
      color: theme.text,
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
      color: theme.inactive,
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
      color: theme.inactive,
      textAlign: 'center',
      marginBottom: 20,
    },
    createButton: {
      backgroundColor: theme.primary,
      paddingVertical: 12,
      paddingHorizontal: 20,
      borderRadius: 8,
    },
    createButtonText: {
      color: 'white',
      fontWeight: 'bold',
      fontSize: 16,
    },
    loader: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    }
  });

  if (loading) {
    return (
      <View style={[styles.container, styles.loader]}>
        <ActivityIndicator size="large" color={theme.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Groups</Text>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => navigation.navigate('CreateGroup')}
        >
          <Ionicons name="add" size={24} color="white" />
        </TouchableOpacity>
      </View>
      
      {groups.length > 0 ? (
        <FlatList
          data={groups}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          contentContainerStyle={{ padding: 16 }}
          showsVerticalScrollIndicator={false}
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
            You haven't joined any groups yet. Create your first group to start sharing photos!
          </Text>
          <TouchableOpacity 
            style={styles.createButton}
            onPress={() => navigation.navigate('CreateGroup')}
          >
            <Text style={styles.createButtonText}>Create New Group</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default GroupsScreen; 