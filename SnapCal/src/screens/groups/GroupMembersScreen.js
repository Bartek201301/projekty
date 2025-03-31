import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Image
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useTheme } from '../../contexts/ThemeContext';
import { USE_MOCK_FIREBASE } from '../../services/firebaseConfig';

// Importujemy mockowe dane jeśli jesteśmy w trybie demo
import * as firebaseMock from '../../services/firebaseMock';

const GroupMembersScreen = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const route = useRoute();
  const { groupId, members: initialMembers } = route.params || {};
  const { theme } = useTheme();
  const navigation = useNavigation();

  useEffect(() => {
    setMembers(initialMembers || []);
    setLoading(false);
    
    navigation.setOptions({
      title: 'Group Members',
      headerRight: () => (
        <TouchableOpacity 
          style={styles.headerButton}
          onPress={() => navigation.navigate('InviteMembers', { groupId })}
        >
          <Ionicons name="person-add" size={24} color={theme.text} />
        </TouchableOpacity>
      )
    });
  }, [navigation, initialMembers, groupId, theme]);

  // Funkcja do zmiany roli użytkownika
  const changeUserRole = (userId, newRole) => {
    if (USE_MOCK_FIREBASE) {
      // W trybie demo tylko aktualizujemy stan
      setMembers(members.map(member => 
        member.id === userId ? { ...member, role: newRole } : member
      ));
      Alert.alert('Success', `User role updated to ${newRole}`);
    } else {
      // W prawdziwym Firebase trzeba by zaktualizować dane w bazie
      Alert.alert('Demo Mode', 'This feature would update the user role in Firebase');
    }
  };

  // Funkcja do usuwania użytkownika z grupy
  const removeUser = (userId) => {
    Alert.alert(
      'Remove User',
      'Are you sure you want to remove this user from the group?',
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => {
            if (USE_MOCK_FIREBASE) {
              // W trybie demo tylko aktualizujemy stan
              setMembers(members.filter(member => member.id !== userId));
              Alert.alert('Success', 'User removed from group');
            } else {
              // W prawdziwym Firebase trzeba by zaktualizować dane w bazie
              Alert.alert('Demo Mode', 'This feature would remove the user in Firebase');
            }
          }
        }
      ]
    );
  };

  // Renderowanie opcji dla każdego użytkownika
  const showUserOptions = (user) => {
    Alert.alert(
      `${user.name}`,
      `Current role: ${user.role}`,
      [
        {
          text: 'Make Admin',
          onPress: () => changeUserRole(user.id, 'admin'),
          disabled: user.role === 'admin'
        },
        {
          text: 'Make Member',
          onPress: () => changeUserRole(user.id, 'member'),
          disabled: user.role === 'member'
        },
        {
          text: 'Remove from Group',
          onPress: () => removeUser(user.id),
          style: 'destructive'
        },
        {
          text: 'Cancel',
          style: 'cancel'
        }
      ]
    );
  };

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <ActivityIndicator size="large" color={theme.primary} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <FlatList
        data={members}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.memberItem, { backgroundColor: theme.card }]}
            onPress={() => showUserOptions(item)}
          >
            <View style={styles.memberInfo}>
              <View style={styles.avatarContainer}>
                {item.photoURL ? (
                  <Image source={{ uri: item.photoURL }} style={styles.avatar} />
                ) : (
                  <View style={[styles.avatarPlaceholder, { backgroundColor: theme.primary }]}>
                    <Text style={styles.avatarText}>{item.name.charAt(0)}</Text>
                  </View>
                )}
              </View>
              <View>
                <Text style={[styles.memberName, { color: theme.text }]}>{item.name}</Text>
                <Text style={[styles.memberRole, { color: theme.textLight }]}>
                  {item.role === 'admin' ? 'Admin' : 'Member'}
                </Text>
              </View>
            </View>
            <Ionicons name="ellipsis-vertical" size={24} color={theme.text} />
          </TouchableOpacity>
        )}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Text style={[styles.emptyText, { color: theme.textLight }]}>
              No members found.
            </Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerButton: {
    marginRight: 10,
  },
  memberItem: {
    flexDirection: 'row',
    padding: 15,
    marginHorizontal: 15,
    marginVertical: 8,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },
  memberInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    marginRight: 15,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  avatarPlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  memberName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  memberRole: {
    fontSize: 14,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
  },
});

export default GroupMembersScreen; 