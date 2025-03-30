import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  FlatList,
  Image,
  TouchableOpacity,
} from 'react-native';
import {
  Surface,
  Text,
  Title,
  Button,
  Avatar,
  Chip,
  Divider,
  TextInput,
  Card,
  IconButton,
  FAB,
} from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';

// Sample data for the event
const DEMO_EVENT = {
  date: '2025-05-15',
  dayName: 'Czwartek',
  availableUsers: [
    { id: '1', name: 'Anna', avatar: 'https://randomuser.me/api/portraits/women/1.jpg', status: 'Weekend fun!', idea: 'Wspólne gotowanie' },
    { id: '2', name: 'Michał', avatar: 'https://randomuser.me/api/portraits/men/1.jpg', status: 'Up for hiking!', idea: null },
    { id: '3', name: 'Kasia', avatar: 'https://randomuser.me/api/portraits/women/2.jpg', status: 'Let\'s chill', idea: 'Planszówki' },
    { id: '4', name: 'Tomek', avatar: 'https://randomuser.me/api/portraits/men/2.jpg', status: 'Game night?', idea: 'Gry wideo' },
  ],
  photos: [
    {
      id: '1',
      title: 'Wspólne gotowanie',
      description: 'Przygotowywanie obiadu',
      images: [
        'https://images.unsplash.com/photo-1556911220-bda9f33vvba1',
        'https://images.unsplash.com/photo-1507048331197-7d4ac70811cf'
      ],
      userId: '1',
      userName: 'Anna',
      userAvatar: 'https://randomuser.me/api/portraits/women/1.jpg',
    },
    {
      id: '2',
      title: 'Planszówki',
      description: 'Wieczór z grami',
      images: [
        'https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09',
      ],
      userId: '3',
      userName: 'Kasia',
      userAvatar: 'https://randomuser.me/api/portraits/women/2.jpg',
    }
  ],
  comments: [
    { id: '1', userId: '2', userName: 'Michał', text: 'Super dzień!', avatar: 'https://randomuser.me/api/portraits/men/1.jpg', timestamp: '2025-05-15T19:23:00Z' },
    { id: '2', userId: '4', userName: 'Tomek', text: 'Musimy to powtórzyć!', avatar: 'https://randomuser.me/api/portraits/men/2.jpg', timestamp: '2025-05-15T20:15:30Z' },
  ]
};

const EventDetailsScreen = ({ route }) => {
  // In a real app, we would use route.params to get the event date
  // const { date } = route.params;
  
  const [event, setEvent] = useState(DEMO_EVENT);
  const [comment, setComment] = useState('');
  const [isUserAvailable, setIsUserAvailable] = useState(true); // Simulate current user's availability
  const [userIdea, setUserIdea] = useState('Wspólne gotowanie'); // Simulate current user's idea
  
  const addComment = () => {
    if (!comment.trim()) return;
    
    const newComment = {
      id: Date.now().toString(),
      userId: '1', // Current user ID
      userName: 'Anna', // Current user name
      text: comment,
      avatar: 'https://randomuser.me/api/portraits/women/1.jpg',
      timestamp: new Date().toISOString(),
    };
    
    setEvent({
      ...event,
      comments: [...event.comments, newComment]
    });
    
    setComment('');
  };
  
  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' });
  };
  
  const renderPhotoItem = ({ item }) => (
    <Card style={styles.photoCard}>
      <Card.Title
        title={item.title}
        subtitle={item.userName}
        left={(props) => <Avatar.Image {...props} source={{ uri: item.userAvatar }} />}
      />
      
      {item.description ? (
        <Card.Content>
          <Text style={styles.photoDescription}>{item.description}</Text>
        </Card.Content>
      ) : null}
      
      <View style={styles.photoGrid}>
        {item.images.map((image, index) => (
          <Image
            key={index}
            source={{ uri: image }}
            style={styles.photo}
            resizeMode="cover"
          />
        ))}
      </View>
    </Card>
  );
  
  return (
    <View style={styles.container}>
      <ScrollView>
        <Surface style={styles.dateHeader}>
          <Title style={styles.dateTitle}>
            {new Date(event.date).toLocaleDateString('pl-PL', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </Title>
        </Surface>
        
        <Surface style={styles.section}>
          <View style={styles.sectionHeader}>
            <Title style={styles.sectionTitle}>
              Dostępne osoby ({event.availableUsers.length})
            </Title>
            <View style={styles.availabilityToggle}>
              <Chip
                selected={isUserAvailable}
                onPress={() => setIsUserAvailable(!isUserAvailable)}
                style={[styles.chip, isUserAvailable && styles.activeChip]}
              >
                {isUserAvailable ? 'Jesteś dostępny/a' : 'Oznacz dostępność'}
              </Chip>
            </View>
          </View>
          
          {isUserAvailable && (
            <View style={styles.ideaInput}>
              <TextInput
                label="Twój pomysł na ten dzień"
                value={userIdea}
                onChangeText={setUserIdea}
                mode="outlined"
                right={<TextInput.Icon icon="check" onPress={() => console.log('Idea updated')} />}
              />
            </View>
          )}
          
          <View style={styles.userList}>
            {event.availableUsers.map(user => (
              <View key={user.id} style={styles.userCard}>
                <Avatar.Image source={{ uri: user.avatar }} size={50} />
                <View style={styles.userData}>
                  <Text style={styles.userName}>{user.name}</Text>
                  <Text style={styles.userStatus}>{user.status}</Text>
                  {user.idea && (
                    <View style={styles.ideaChip}>
                      <Ionicons name="bulb" size={14} color="#6200ee" style={styles.ideaIcon} />
                      <Text style={styles.ideaText}>{user.idea}</Text>
                    </View>
                  )}
                </View>
              </View>
            ))}
          </View>
        </Surface>
        
        {event.photos.length > 0 && (
          <Surface style={styles.section}>
            <Title style={styles.sectionTitle}>
              Zdjęcia z wydarzenia ({event.photos.length})
            </Title>
            <FlatList
              data={event.photos}
              renderItem={renderPhotoItem}
              keyExtractor={item => item.id}
              scrollEnabled={false}
            />
          </Surface>
        )}
        
        <Surface style={styles.section}>
          <Title style={styles.sectionTitle}>
            Komentarze ({event.comments.length})
          </Title>
          
          <View style={styles.commentsList}>
            {event.comments.map(item => (
              <View key={item.id} style={styles.commentItem}>
                <Avatar.Image
                  source={{ uri: item.avatar }}
                  size={40}
                  style={styles.commentAvatar}
                />
                <View style={styles.commentContent}>
                  <View style={styles.commentHeader}>
                    <Text style={styles.commentUserName}>{item.userName}</Text>
                    <Text style={styles.commentTime}>{formatTimestamp(item.timestamp)}</Text>
                  </View>
                  <Text>{item.text}</Text>
                </View>
              </View>
            ))}
          </View>
          
          <View style={styles.addCommentContainer}>
            <Avatar.Image
              source={{ uri: 'https://randomuser.me/api/portraits/women/1.jpg' }}
              size={40}
              style={styles.commentAvatar}
            />
            <TextInput
              placeholder="Dodaj komentarz..."
              value={comment}
              onChangeText={setComment}
              style={styles.commentInput}
              right={<TextInput.Icon icon="send" onPress={addComment} disabled={!comment.trim()} />}
            />
          </View>
        </Surface>
      </ScrollView>
      
      <FAB
        style={styles.fab}
        icon="camera"
        label="Dodaj zdjęcia"
        onPress={() => console.log('Add photos')}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f6f6f6',
  },
  dateHeader: {
    padding: 20,
    backgroundColor: '#fff',
  },
  dateTitle: {
    fontSize: 22,
    textAlign: 'center',
    textTransform: 'capitalize',
  },
  section: {
    margin: 10,
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 10,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
  },
  availabilityToggle: {
    flexDirection: 'row',
  },
  chip: {
    backgroundColor: '#f0f0f0',
  },
  activeChip: {
    backgroundColor: '#e0f7fa',
  },
  ideaInput: {
    marginBottom: 20,
  },
  userList: {
    marginTop: 10,
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  userData: {
    marginLeft: 15,
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  userStatus: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  ideaChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0e6ff',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 3,
    marginTop: 5,
    alignSelf: 'flex-start',
  },
  ideaIcon: {
    marginRight: 5,
  },
  ideaText: {
    fontSize: 12,
  },
  photoCard: {
    marginBottom: 15,
    overflow: 'hidden',
  },
  photoDescription: {
    marginBottom: 10,
  },
  photoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  photo: {
    width: '50%',
    aspectRatio: 1,
    padding: 1,
  },
  commentsList: {
    marginVertical: 10,
  },
  commentItem: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  commentAvatar: {
    marginRight: 10,
  },
  commentContent: {
    flex: 1,
    backgroundColor: '#f7f7f7',
    padding: 10,
    borderRadius: 10,
  },
  commentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  commentUserName: {
    fontWeight: 'bold',
  },
  commentTime: {
    fontSize: 12,
    color: '#666',
  },
  addCommentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  commentInput: {
    flex: 1,
    backgroundColor: '#f7f7f7',
    borderRadius: 20,
    height: 40,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: '#6200ee',
  },
});

export default EventDetailsScreen; 