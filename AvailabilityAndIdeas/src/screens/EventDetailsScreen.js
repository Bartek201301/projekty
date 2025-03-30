import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  ScrollView, 
  Modal, 
  TouchableOpacity,
  FlatList
} from 'react-native';
import { 
  Text, 
  Surface, 
  IconButton, 
  Button, 
  Divider, 
  TextInput, 
  useTheme,
  List,
  Avatar,
  FAB,
  Chip
} from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';

// Sample event data
const SAMPLE_EVENT = {
  id: '1',
  title: 'Wycieczka w góry',
  date: '2025-04-15',
  time: '09:00',
  location: 'Zakopane, Krupówki 1',
  description: 'Wspólna wycieczka w góry. Weźcie ze sobą odpowiednie buty i ciepłe ubrania. Spotykamy się na parkingu przy supermarkecie.',
  organizerId: '10',
  organizerName: 'Bartosz M.',
};

// Sample participants
const SAMPLE_PARTICIPANTS = [
  {
    id: '1',
    name: 'Anna K.',
    avatar: 'https://randomuser.me/api/portraits/women/32.jpg',
    status: 'confirmed' // confirmed, declined, pending
  },
  {
    id: '2',
    name: 'Tomasz W.',
    avatar: 'https://randomuser.me/api/portraits/men/36.jpg',
    status: 'confirmed'
  },
  {
    id: '3',
    name: 'Martyna S.',
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    status: 'declined'
  },
  {
    id: '4',
    name: 'Jakub N.',
    avatar: 'https://randomuser.me/api/portraits/men/22.jpg',
    status: 'pending'
  },
  {
    id: '5',
    name: 'Oliwia R.',
    avatar: 'https://randomuser.me/api/portraits/women/17.jpg',
    status: 'confirmed'
  },
  {
    id: '10',
    name: 'Bartosz M.',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    status: 'confirmed'
  }
];

const GradientButton = ({ onPress, title, style }) => {
  const theme = useTheme();
  
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
      <LinearGradient
        colors={[theme.colors.gradient1, theme.colors.gradient2]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={[styles.gradientButton, style]}
      >
        <Text style={styles.buttonText}>{title}</Text>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const ParticipantItem = ({ participant, onChangeStatus, currentUserId }) => {
  const isCurrentUser = participant.id === currentUserId;
  let statusColor = '#555555';
  let statusText = 'Oczekujące';
  let statusIcon = 'help-circle-outline';
  
  if (participant.status === 'confirmed') {
    statusColor = '#4CAF50';
    statusText = 'Potwierdzono';
    statusIcon = 'check-circle';
  } else if (participant.status === 'declined') {
    statusColor = '#F44336';
    statusText = 'Odrzucono';
    statusIcon = 'close-circle';
  }
  
  return (
    <Surface style={styles.participantItem}>
      <View style={styles.participantInfo}>
        <Avatar.Image source={{ uri: participant.avatar }} size={40} />
        <Text style={styles.participantName}>
          {participant.name} {isCurrentUser && '(Ty)'}
        </Text>
      </View>
      
      <View style={styles.participantStatus}>
        <MaterialCommunityIcons name={statusIcon} size={18} color={statusColor} />
        <Text style={[styles.statusText, { color: statusColor }]}>{statusText}</Text>
        
        {isCurrentUser && participant.status !== 'confirmed' && (
          <Button
            mode="text"
            onPress={() => onChangeStatus(participant.id, 'confirmed')}
            compact
            style={styles.statusButton}
            labelStyle={{ color: '#4CAF50' }}
          >
            Potwierdź
          </Button>
        )}
        
        {isCurrentUser && participant.status !== 'declined' && (
          <Button
            mode="text"
            onPress={() => onChangeStatus(participant.id, 'declined')}
            compact
            style={styles.statusButton}
            labelStyle={{ color: '#F44336' }}
          >
            Odrzuć
          </Button>
        )}
      </View>
    </Surface>
  );
};

const EventDetailsScreen = ({ route, navigation }) => {
  // In a real app, we would get the event ID from route params and fetch event data
  // const { eventId } = route.params;
  const theme = useTheme();
  const [event, setEvent] = useState(SAMPLE_EVENT);
  const [participants, setParticipants] = useState(SAMPLE_PARTICIPANTS);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(event.title);
  const [editDate, setEditDate] = useState(new Date(event.date));
  const [editTime, setEditTime] = useState(() => {
    const [hours, minutes] = event.time.split(':').map(Number);
    const date = new Date();
    date.setHours(hours, minutes, 0);
    return date;
  });
  const [editLocation, setEditLocation] = useState(event.location);
  const [editDescription, setEditDescription] = useState(event.description);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [titleError, setTitleError] = useState('');
  const [locationError, setLocationError] = useState('');
  const currentUserId = '10'; // This would come from authentication in a real app
  const isOrganizer = event.organizerId === currentUserId;
  
  const handleChangeParticipantStatus = (participantId, newStatus) => {
    setParticipants(
      participants.map(participant => {
        if (participant.id === participantId) {
          return { ...participant, status: newStatus };
        }
        return participant;
      })
    );
  };
  
  const handleEditEvent = () => {
    setEditTitle(event.title);
    setEditDate(new Date(event.date));
    const [hours, minutes] = event.time.split(':').map(Number);
    const timeDate = new Date();
    timeDate.setHours(hours, minutes, 0);
    setEditTime(timeDate);
    setEditLocation(event.location);
    setEditDescription(event.description);
    setTitleError('');
    setLocationError('');
    setIsEditing(true);
  };
  
  const formatDate = (date) => {
    return date.toISOString().split('T')[0];
  };
  
  const formatTime = (date) => {
    return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
  };
  
  const validateForm = () => {
    let isValid = true;
    
    if (!editTitle.trim()) {
      setTitleError('Tytuł jest wymagany');
      isValid = false;
    } else {
      setTitleError('');
    }
    
    if (!editLocation.trim()) {
      setLocationError('Lokalizacja jest wymagana');
      isValid = false;
    } else {
      setLocationError('');
    }
    
    return isValid;
  };
  
  const handleSaveEvent = () => {
    if (!validateForm()) {
      return;
    }
    
    setEvent({
      ...event,
      title: editTitle,
      date: formatDate(editDate),
      time: formatTime(editTime),
      location: editLocation,
      description: editDescription,
    });
    
    setIsEditing(false);
  };
  
  const confirmedCount = participants.filter(p => p.status === 'confirmed').length;
  const pendingCount = participants.filter(p => p.status === 'pending').length;
  const declinedCount = participants.filter(p => p.status === 'declined').length;
  
  return (
    <View style={styles.container}>
      <ScrollView>
        {/* Event Header */}
        <Surface style={styles.eventHeader}>
          <View style={styles.eventHeaderContent}>
            <Text style={styles.eventTitle}>{event.title}</Text>
            <View style={styles.eventInfoRow}>
              <MaterialCommunityIcons name="calendar" size={18} color={theme.colors.accent} />
              <Text style={styles.eventInfoText}>
                {event.date.split('-').reverse().join('.')} o {event.time}
              </Text>
            </View>
            <View style={styles.eventInfoRow}>
              <MaterialCommunityIcons name="map-marker" size={18} color={theme.colors.accent} />
              <Text style={styles.eventInfoText}>{event.location}</Text>
            </View>
            <View style={styles.eventInfoRow}>
              <MaterialCommunityIcons name="account" size={18} color={theme.colors.accent} />
              <Text style={styles.eventInfoText}>Organizator: {event.organizerName}</Text>
            </View>
          </View>
          
          {isOrganizer && (
            <IconButton
              icon="pencil"
              size={20}
              onPress={handleEditEvent}
              style={styles.editButton}
            />
          )}
        </Surface>
        
        {/* Event Description */}
        <Surface style={styles.section}>
          <Text style={styles.sectionTitle}>Opis</Text>
          <Text style={styles.eventDescription}>{event.description}</Text>
        </Surface>
        
        {/* Participants Section */}
        <Surface style={styles.section}>
          <View style={styles.participantsHeader}>
            <Text style={styles.sectionTitle}>Uczestnicy</Text>
            <View style={styles.participantsStats}>
              <Chip 
                icon="check-circle" 
                style={[styles.statsChip, styles.confirmedChip]}
                textStyle={styles.chipText}
              >
                {confirmedCount}
              </Chip>
              <Chip 
                icon="help-circle" 
                style={[styles.statsChip, styles.pendingChip]}
                textStyle={styles.chipText}
              >
                {pendingCount}
              </Chip>
              <Chip 
                icon="close-circle" 
                style={[styles.statsChip, styles.declinedChip]}
                textStyle={styles.chipText}
              >
                {declinedCount}
              </Chip>
            </View>
          </View>
          
          <Divider style={styles.divider} />
          
          <FlatList
            data={participants}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <ParticipantItem
                participant={item}
                onChangeStatus={handleChangeParticipantStatus}
                currentUserId={currentUserId}
              />
            )}
            scrollEnabled={false}
          />
        </Surface>
      </ScrollView>
      
      {/* Edit Event Modal */}
      <Modal
        visible={isEditing}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsEditing(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edytuj wydarzenie</Text>
            
            <TextInput
              label="Tytuł wydarzenia"
              value={editTitle}
              onChangeText={text => {
                setEditTitle(text);
                if (titleError) setTitleError('');
              }}
              mode="outlined"
              style={styles.input}
              error={!!titleError}
              theme={{ roundness: theme.roundness }}
            />
            {titleError ? <Text style={styles.errorText}>{titleError}</Text> : null}
            
            <TouchableOpacity 
              style={styles.datePickerButton} 
              onPress={() => setShowDatePicker(true)}
            >
              <Text style={styles.pickerLabel}>Data:</Text>
              <Text style={styles.pickerValue}>
                {editDate.toISOString().split('T')[0].split('-').reverse().join('.')}
              </Text>
              <MaterialCommunityIcons name="calendar" size={24} color={theme.colors.primary} />
            </TouchableOpacity>
            
            {showDatePicker && (
              <DateTimePicker
                value={editDate}
                mode="date"
                display="default"
                onChange={(event, selectedDate) => {
                  setShowDatePicker(false);
                  if (selectedDate) {
                    setEditDate(selectedDate);
                  }
                }}
              />
            )}
            
            <TouchableOpacity 
              style={styles.datePickerButton} 
              onPress={() => setShowTimePicker(true)}
            >
              <Text style={styles.pickerLabel}>Czas:</Text>
              <Text style={styles.pickerValue}>{formatTime(editTime)}</Text>
              <MaterialCommunityIcons name="clock-outline" size={24} color={theme.colors.primary} />
            </TouchableOpacity>
            
            {showTimePicker && (
              <DateTimePicker
                value={editTime}
                mode="time"
                is24Hour={true}
                display="default"
                onChange={(event, selectedTime) => {
                  setShowTimePicker(false);
                  if (selectedTime) {
                    setEditTime(selectedTime);
                  }
                }}
              />
            )}
            
            <TextInput
              label="Lokalizacja"
              value={editLocation}
              onChangeText={text => {
                setEditLocation(text);
                if (locationError) setLocationError('');
              }}
              mode="outlined"
              style={styles.input}
              error={!!locationError}
              theme={{ roundness: theme.roundness }}
            />
            {locationError ? <Text style={styles.errorText}>{locationError}</Text> : null}
            
            <TextInput
              label="Opis"
              value={editDescription}
              onChangeText={setEditDescription}
              mode="outlined"
              multiline
              numberOfLines={4}
              style={[styles.input, styles.textArea]}
              theme={{ roundness: theme.roundness }}
            />
            
            <View style={styles.modalButtons}>
              <Button
                mode="outlined"
                onPress={() => setIsEditing(false)}
                style={styles.cancelButton}
              >
                Anuluj
              </Button>
              <GradientButton
                title="ZAPISZ"
                onPress={handleSaveEvent}
                style={styles.saveButton}
              />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  eventHeader: {
    padding: 16,
    backgroundColor: '#1E1E1E',
    marginBottom: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  eventHeaderContent: {
    flex: 1,
  },
  eventTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  eventInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  eventInfoText: {
    fontSize: 14,
    color: '#DDDDDD',
    marginLeft: 8,
  },
  editButton: {
    alignSelf: 'flex-start',
    margin: 0,
  },
  section: {
    margin: 16,
    marginTop: 0,
    padding: 16,
    backgroundColor: '#1E1E1E',
    borderRadius: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  eventDescription: {
    fontSize: 14,
    color: '#DDDDDD',
    lineHeight: 22,
  },
  participantsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  participantsStats: {
    flexDirection: 'row',
  },
  statsChip: {
    marginLeft: 8,
    height: 26,
  },
  confirmedChip: {
    backgroundColor: 'rgba(76, 175, 80, 0.2)',
  },
  pendingChip: {
    backgroundColor: 'rgba(85, 85, 85, 0.3)',
  },
  declinedChip: {
    backgroundColor: 'rgba(244, 67, 54, 0.2)',
  },
  chipText: {
    fontSize: 12,
    marginVertical: 0,
    paddingVertical: 0,
  },
  divider: {
    backgroundColor: '#333333',
    marginVertical: 16,
  },
  participantItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    marginBottom: 8,
    borderRadius: 12,
    backgroundColor: '#2A2A2A',
  },
  participantInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  participantName: {
    marginLeft: 12,
    fontSize: 14,
    color: '#FFFFFF',
  },
  participantStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusText: {
    marginLeft: 4,
    fontSize: 12,
  },
  statusButton: {
    marginLeft: 8,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#1E1E1E',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    marginBottom: 12,
    backgroundColor: '#2E2E2E',
  },
  textArea: {
    height: 100,
  },
  errorText: {
    color: '#FF4D4D',
    marginBottom: 10,
    marginLeft: 10,
    fontSize: 12,
  },
  datePickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderWidth: 1,
    borderColor: '#444444',
    borderRadius: 5,
    marginBottom: 12,
    backgroundColor: '#2E2E2E',
  },
  pickerLabel: {
    color: '#AAAAAA',
    marginRight: 10,
  },
  pickerValue: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 16,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  cancelButton: {
    flex: 1,
    marginRight: 10,
    borderColor: '#444444',
  },
  saveButton: {
    flex: 1,
    marginLeft: 10,
  },
  gradientButton: {
    borderRadius: 30,
    paddingVertical: 10,
    paddingHorizontal: 24,
    elevation: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
});

export default EventDetailsScreen; 