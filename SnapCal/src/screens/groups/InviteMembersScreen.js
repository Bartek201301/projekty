import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  Alert,
  ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useTheme } from '../../contexts/ThemeContext';
import { USE_MOCK_FIREBASE } from '../../services/firebaseConfig';

const InviteMembersScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const route = useRoute();
  const { groupId } = route.params || {};
  const { theme } = useTheme();
  const navigation = useNavigation();

  // Funkcja do wyszukiwania użytkowników
  const searchUsers = () => {
    if (!searchQuery.trim()) {
      Alert.alert('Error', 'Please enter a search term');
      return;
    }

    setLoading(true);

    // W trybie demo generujemy przykładowe wyniki
    if (USE_MOCK_FIREBASE) {
      setTimeout(() => {
        const mockResults = [
          {
            id: 'user4',
            displayName: 'Jane Doe',
            email: 'jane@example.com',
            photoURL: null
          },
          {
            id: 'user5',
            displayName: 'John Smith',
            email: 'john@example.com',
            photoURL: null
          },
          {
            id: 'user6',
            displayName: 'Emma Wilson',
            email: 'emma@example.com',
            photoURL: null
          }
        ];

        setSearchResults(mockResults);
        setLoading(false);
      }, 1000);
    } else {
      // W prawdziwym Firebase trzeba by wyszukać użytkowników
      setTimeout(() => {
        Alert.alert('Demo Mode', 'This would search users in Firebase');
        setLoading(false);
      }, 1000);
    }
  };

  // Funkcja do zapraszania użytkownika
  const inviteUser = (user) => {
    setLoading(true);

    // W trybie demo tylko symulujemy zaproszenie
    if (USE_MOCK_FIREBASE) {
      setTimeout(() => {
        Alert.alert(
          'Success',
          `Invitation sent to ${user.displayName}`,
          [
            {
              text: 'OK',
              onPress: () => navigation.goBack()
            }
          ]
        );
        setLoading(false);
      }, 500);
    } else {
      // W prawdziwym Firebase trzeba by dodać użytkownika do grupy
      setTimeout(() => {
        Alert.alert('Demo Mode', 'This would invite the user in Firebase');
        setLoading(false);
      }, 500);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.searchContainer, { backgroundColor: theme.card }]}>
        <TextInput
          style={[styles.searchInput, { color: theme.text, backgroundColor: theme.inputBackground }]}
          placeholder="Search by name or email"
          placeholderTextColor={theme.textLight}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <TouchableOpacity 
          style={[styles.searchButton, { backgroundColor: theme.primary }]}
          onPress={searchUsers}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <Text style={styles.searchButtonText}>Search</Text>
          )}
        </TouchableOpacity>
      </View>

      <FlatList
        data={searchResults}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={[styles.userItem, { backgroundColor: theme.card }]}>
            <View style={styles.userInfo}>
              <View style={[styles.avatarPlaceholder, { backgroundColor: theme.primary }]}>
                <Text style={styles.avatarText}>{item.displayName.charAt(0)}</Text>
              </View>
              <View>
                <Text style={[styles.userName, { color: theme.text }]}>{item.displayName}</Text>
                <Text style={[styles.userEmail, { color: theme.textLight }]}>{item.email}</Text>
              </View>
            </View>
            <TouchableOpacity
              style={[styles.inviteButton, { backgroundColor: theme.primary }]}
              onPress={() => inviteUser(item)}
            >
              <Text style={styles.inviteButtonText}>Invite</Text>
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Text style={[styles.emptyText, { color: theme.textLight }]}>
              {searchQuery.trim() ? 'No users found. Try a different search term.' : 'Search for users to invite.'}
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
    padding: 15,
  },
  searchContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    borderRadius: 10,
    overflow: 'hidden',
  },
  searchInput: {
    flex: 1,
    padding: 12,
    fontSize: 16,
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
  },
  searchButton: {
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
    width: 100,
  },
  searchButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  userItem: {
    flexDirection: 'row',
    padding: 15,
    marginBottom: 10,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarPlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  avatarText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  userEmail: {
    fontSize: 14,
  },
  inviteButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  inviteButtonText: {
    color: 'white',
    fontWeight: 'bold',
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

export default InviteMembersScreen; 