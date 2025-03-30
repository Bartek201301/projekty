import React, { useState } from 'react';
import { View, StyleSheet, Image, TouchableOpacity, ScrollView, Switch } from 'react-native';
import { Surface, Text, Title, Button, Avatar, TextInput, Divider, List, IconButton, Chip } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';

// Sample data
const CURRENT_USER = {
  id: '1',
  name: 'Anna Kowalska',
  email: 'anna@example.com',
  avatar: 'https://randomuser.me/api/portraits/women/1.jpg',
  status: 'Weekend fun!',
  notifications: {
    newAvailability: true,
    newIdeas: true,
    newPhotos: true,
    comments: true
  },
  recentActivity: [
    { id: '1', type: 'availability', date: '2025-05-02', description: 'Zaznaczyłaś dostępność na piątek' },
    { id: '2', type: 'idea', date: '2025-05-02', description: 'Dodałaś pomysł "Wyjazd nad jezioro"' },
    { id: '3', type: 'photo', date: '2025-04-15', description: 'Dodałaś 2 zdjęcia do "Piknik w parku"' },
    { id: '4', type: 'comment', date: '2025-04-20', description: 'Skomentowałaś zdjęcie Tomka' }
  ],
  stats: {
    availability: 5,
    ideas: 3,
    photos: 8,
    comments: 4
  }
};

const ProfileScreen = () => {
  const [user, setUser] = useState(CURRENT_USER);
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user.name);
  const [status, setStatus] = useState(user.status);
  const [notifications, setNotifications] = useState(user.notifications);
  
  const handlePickAvatar = async () => {
    if (!isEditing) return;
    
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (permissionResult.granted === false) {
      alert("Wymagane jest pozwolenie na dostęp do galerii zdjęć!");
      return;
    }
    
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });
    
    if (!result.canceled) {
      setUser({
        ...user,
        avatar: result.assets[0].uri
      });
    }
  };
  
  const handleSaveProfile = () => {
    setUser({
      ...user,
      name,
      status,
      notifications
    });
    
    setIsEditing(false);
  };
  
  const toggleNotification = (type) => {
    setNotifications({
      ...notifications,
      [type]: !notifications[type]
    });
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case 'availability':
        return 'calendar-check-outline';
      case 'idea':
        return 'bulb-outline';
      case 'photo':
        return 'images-outline';
      case 'comment':
        return 'chatbubble-outline';
      default:
        return 'alert-circle-outline';
    }
  };
  
  const handleLogout = () => {
    // In a real app, this would sign the user out
    console.log('User logged out');
  };
  
  return (
    <ScrollView style={styles.container}>
      <Surface style={styles.header}>
        <View style={styles.profileHeader}>
          <TouchableOpacity onPress={handlePickAvatar} disabled={!isEditing}>
            <Avatar.Image 
              source={{ uri: user.avatar }} 
              size={100} 
              style={styles.avatar}
            />
            {isEditing && (
              <View style={styles.editAvatarButton}>
                <Ionicons name="camera" size={20} color="white" />
              </View>
            )}
          </TouchableOpacity>
          
          <View style={styles.profileInfo}>
            {isEditing ? (
              <TextInput
                label="Imię"
                value={name}
                onChangeText={setName}
                mode="flat"
                style={styles.editNameInput}
                dense
              />
            ) : (
              <Title style={styles.userName}>{user.name}</Title>
            )}
            
            {isEditing ? (
              <TextInput
                label="Status"
                value={status}
                onChangeText={setStatus}
                mode="flat"
                style={styles.editStatusInput}
                dense
              />
            ) : (
              <Text style={styles.userStatus}>{user.status}</Text>
            )}
          </View>
          
          <IconButton
            icon={isEditing ? "check" : "pencil"}
            size={24}
            onPress={isEditing ? handleSaveProfile : () => setIsEditing(true)}
            style={styles.editButton}
          />
        </View>
      </Surface>
      
      <Surface style={styles.statsCard}>
        <Title style={styles.sectionTitle}>Twoje statystyki</Title>
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Ionicons name="calendar" size={24} color="#6200ee" />
            <Text style={styles.statNumber}>{user.stats.availability}</Text>
            <Text style={styles.statLabel}>Dostępności</Text>
          </View>
          
          <View style={styles.statItem}>
            <Ionicons name="bulb" size={24} color="#6200ee" />
            <Text style={styles.statNumber}>{user.stats.ideas}</Text>
            <Text style={styles.statLabel}>Pomysły</Text>
          </View>
          
          <View style={styles.statItem}>
            <Ionicons name="images" size={24} color="#6200ee" />
            <Text style={styles.statNumber}>{user.stats.photos}</Text>
            <Text style={styles.statLabel}>Zdjęcia</Text>
          </View>
          
          <View style={styles.statItem}>
            <Ionicons name="chatbubble" size={24} color="#6200ee" />
            <Text style={styles.statNumber}>{user.stats.comments}</Text>
            <Text style={styles.statLabel}>Komentarze</Text>
          </View>
        </View>
      </Surface>
      
      <Surface style={styles.sectionCard}>
        <Title style={styles.sectionTitle}>Ostatnia aktywność</Title>
        <List.Section>
          {user.recentActivity.map(activity => (
            <List.Item
              key={activity.id}
              title={activity.description}
              description={new Date(activity.date).toLocaleDateString('pl-PL')}
              left={props => (
                <List.Icon 
                  {...props} 
                  icon={({ size, color }) => (
                    <Ionicons name={getActivityIcon(activity.type)} size={size} color={color} />
                  )} 
                />
              )}
              style={styles.activityItem}
            />
          ))}
        </List.Section>
      </Surface>
      
      <Surface style={styles.sectionCard}>
        <Title style={styles.sectionTitle}>Powiadomienia</Title>
        <List.Section>
          <List.Item
            title="Nowe dostępności"
            description="Powiadomienia, gdy ktoś zaznaczy dostępność"
            left={props => <List.Icon {...props} icon="calendar-check" />}
            right={() => (
              <Switch
                value={notifications.newAvailability}
                onValueChange={() => toggleNotification('newAvailability')}
                disabled={!isEditing}
                color="#6200ee"
              />
            )}
          />
          
          <Divider />
          
          <List.Item
            title="Nowe pomysły"
            description="Powiadomienia o nowych pomysłach"
            left={props => <List.Icon {...props} icon="lightbulb-on" />}
            right={() => (
              <Switch
                value={notifications.newIdeas}
                onValueChange={() => toggleNotification('newIdeas')}
                disabled={!isEditing}
                color="#6200ee"
              />
            )}
          />
          
          <Divider />
          
          <List.Item
            title="Nowe zdjęcia"
            description="Powiadomienia o dodanych zdjęciach"
            left={props => <List.Icon {...props} icon="image-multiple" />}
            right={() => (
              <Switch
                value={notifications.newPhotos}
                onValueChange={() => toggleNotification('newPhotos')}
                disabled={!isEditing}
                color="#6200ee"
              />
            )}
          />
          
          <Divider />
          
          <List.Item
            title="Komentarze"
            description="Powiadomienia o nowych komentarzach"
            left={props => <List.Icon {...props} icon="comment" />}
            right={() => (
              <Switch
                value={notifications.comments}
                onValueChange={() => toggleNotification('comments')}
                disabled={!isEditing}
                color="#6200ee"
              />
            )}
          />
        </List.Section>
      </Surface>
      
      <View style={styles.buttonContainer}>
        <Button 
          mode="outlined" 
          icon="logout" 
          onPress={handleLogout}
          style={styles.logoutButton}
        >
          Wyloguj się
        </Button>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f6f6f6',
  },
  header: {
    padding: 20,
    marginBottom: 10,
    backgroundColor: '#fff',
    elevation: 2,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    marginRight: 15,
    backgroundColor: '#e1e1e1',
  },
  editAvatarButton: {
    position: 'absolute',
    bottom: 0,
    right: 15,
    backgroundColor: '#6200ee',
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  userStatus: {
    fontSize: 16,
    color: '#666',
    marginTop: 4,
  },
  editNameInput: {
    backgroundColor: 'transparent',
    height: 40,
    padding: 0,
  },
  editStatusInput: {
    backgroundColor: 'transparent',
    height: 40,
    padding: 0,
  },
  editButton: {
    backgroundColor: '#f0f0f0',
    margin: 0,
  },
  statsCard: {
    padding: 15,
    marginHorizontal: 10,
    marginBottom: 10,
    borderRadius: 10,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    marginBottom: 10,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 5,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
  },
  sectionCard: {
    padding: 15,
    marginHorizontal: 10,
    marginBottom: 10,
    borderRadius: 10,
    elevation: 2,
  },
  activityItem: {
    padding: 0,
  },
  buttonContainer: {
    padding: 20,
    alignItems: 'center',
  },
  logoutButton: {
    width: '80%',
    marginBottom: 20,
  },
});

export default ProfileScreen; 