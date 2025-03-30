import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  View, 
  ScrollView, 
  TouchableOpacity, 
  Modal,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard
} from 'react-native';
import { 
  Text, 
  Surface, 
  Title, 
  Button, 
  TextInput,
  Switch,
  Avatar,
  IconButton,
  Divider,
  useTheme
} from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import DateTimePicker from '@react-native-community/datetimepicker';
import { StatusBar } from 'expo-status-bar';

const GradientButton = ({ onPress, title, style }) => {
  const theme = useTheme();
  
  return (
    <TouchableWithoutFeedback onPress={onPress}>
      <LinearGradient
        colors={[theme.colors.gradient1, theme.colors.gradient2]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={[styles.gradientButton, style]}
      >
        <Text style={styles.buttonText}>{title}</Text>
      </LinearGradient>
    </TouchableWithoutFeedback>
  );
};

// Sample event data
const sampleEvents = [
  {
    id: '1',
    title: 'Spotkanie projektowe',
    date: '2023-06-15',
    time: '14:00',
    location: 'Biuro główne, sala konferencyjna A',
    description: 'Omówienie postępów w projekcie i planowanie kolejnych kroków.',
    organizer: {
      id: '1',
      name: 'Jan Kowalski',
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg'
    },
    participants: [
      { id: '1', name: 'Jan Kowalski', avatar: 'https://randomuser.me/api/portraits/men/32.jpg', status: 'confirmed' },
      { id: '2', name: 'Anna Nowak', avatar: 'https://randomuser.me/api/portraits/women/44.jpg', status: 'pending' },
      { id: '3', name: 'Piotr Wiśniewski', avatar: 'https://randomuser.me/api/portraits/men/67.jpg', status: 'declined' },
      { id: '4', name: 'Ewa Dąbrowska', avatar: 'https://randomuser.me/api/portraits/women/17.jpg', status: 'confirmed' },
      { id: '5', name: 'Tomasz Lewandowski', avatar: 'https://randomuser.me/api/portraits/men/91.jpg', status: 'pending' }
    ]
  },
  {
    id: '2',
    title: 'Urodziny Marka',
    date: '2023-06-20',
    time: '18:00',
    location: 'Restauracja "Pod Lipami", ul. Długa 15',
    description: 'Świętowanie urodzin Marka. Prezenty mile widziane!',
    organizer: {
      id: '2',
      name: 'Anna Nowak',
      avatar: 'https://randomuser.me/api/portraits/women/44.jpg'
    },
    participants: [
      { id: '1', name: 'Jan Kowalski', avatar: 'https://randomuser.me/api/portraits/men/32.jpg', status: 'confirmed' },
      { id: '2', name: 'Anna Nowak', avatar: 'https://randomuser.me/api/portraits/women/44.jpg', status: 'confirmed' },
      { id: '4', name: 'Ewa Dąbrowska', avatar: 'https://randomuser.me/api/portraits/women/17.jpg', status: 'pending' },
      { id: '6', name: 'Marek Kowalczyk', avatar: 'https://randomuser.me/api/portraits/men/22.jpg', status: 'confirmed' }
    ]
  }
];

const EventDetailsScreen = ({ route, navigation }) => {
  const { eventId } = route.params || { eventId: '1' };
  const [event, setEvent] = useState(null);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editData, setEditData] = useState({
    title: '',
    date: new Date(),
    time: new Date(),
    location: '',
    description: ''
  });
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [errors, setErrors] = useState({});
  const [userStatus, setUserStatus] = useState('pending');
  
  const theme = useTheme();

  useEffect(() => {
    // In a real app, you would fetch the event details from an API
    const fetchedEvent = sampleEvents.find(e => e.id === eventId);
    if (fetchedEvent) {
      setEvent(fetchedEvent);
      
      // Set the current user status - in a real app this would be based on the logged-in user
      const currentUser = fetchedEvent.participants.find(p => p.id === '1'); // Assuming Jan Kowalski is the logged-in user
      if (currentUser) {
        setUserStatus(currentUser.status);
      }
      
      // Parse the date and time for the edit form
      const [year, month, day] = fetchedEvent.date.split('-').map(Number);
      const [hours, minutes] = fetchedEvent.time.split(':').map(Number);
      const eventDate = new Date(year, month - 1, day);
      const eventTime = new Date();
      eventTime.setHours(hours, minutes);
      
      setEditData({
        title: fetchedEvent.title,
        date: eventDate,
        time: eventTime,
        location: fetchedEvent.location,
        description: fetchedEvent.description
      });
    }
  }, [eventId]);

  const validateTitle = (title) => {
    if (!title) {
      return 'Tytuł jest wymagany';
    }
    return '';
  };

  const validateLocation = (location) => {
    if (!location) {
      return 'Lokalizacja jest wymagana';
    }
    return '';
  };

  const updateEditData = (field, value) => {
    setEditData({
      ...editData,
      [field]: value
    });

    // Clear error when typing
    if (errors[field]) {
      setErrors({
        ...errors,
        [field]: ''
      });
    }
  };

  const onDateChange = (_, selectedDate) => {
    const currentDate = selectedDate || editData.date;
    setShowDatePicker(false);
    setEditData({ ...editData, date: currentDate });
  };

  const onTimeChange = (_, selectedTime) => {
    const currentTime = selectedTime || editData.time;
    setShowTimePicker(false);
    setEditData({ ...editData, time: currentTime });
  };

  const handleUpdateEvent = () => {
    const titleError = validateTitle(editData.title);
    const locationError = validateLocation(editData.location);
    
    const newErrors = {
      title: titleError,
      location: locationError
    };
    
    setErrors(newErrors);
    
    if (titleError || locationError) {
      return;
    }
    
    // Format the date and time
    const formattedDate = editData.date.toISOString().split('T')[0];
    const hours = editData.time.getHours().toString().padStart(2, '0');
    const minutes = editData.time.getMinutes().toString().padStart(2, '0');
    
    // In a real app, you would make an API call to update the event
    const updatedEvent = {
      ...event,
      title: editData.title,
      date: formattedDate,
      time: `${hours}:${minutes}`,
      location: editData.location,
      description: editData.description
    };
    
    setEvent(updatedEvent);
    setEditModalVisible(false);
  };

  const handleToggleStatus = (newStatus) => {
    // In a real app, you would make an API call to update the participant status
    
    // Update the local state
    setUserStatus(newStatus);
    
    // Update the event participants array
    if (event) {
      const updatedParticipants = event.participants.map(p =>
        p.id === '1' ? { ...p, status: newStatus } : p
      );
      
      setEvent({
        ...event,
        participants: updatedParticipants
      });
    }
  };

  if (!event) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Ładowanie szczegółów wydarzenia...</Text>
      </View>
    );
  }

  // Group participants by status for display
  const confirmedParticipants = event.participants.filter(p => p.status === 'confirmed');
  const pendingParticipants = event.participants.filter(p => p.status === 'pending');
  const declinedParticipants = event.participants.filter(p => p.status === 'declined');

  const isOrganizer = event.organizer.id === '1'; // Assuming Jan Kowalski is the logged-in user

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Surface style={styles.surface}>
          <View style={styles.header}>
            <Title style={styles.title}>{event.title}</Title>
            
            <View style={styles.dateTimeContainer}>
              <View style={styles.dateTimeItem}>
                <IconButton
                  icon="calendar"
                  size={24}
                  color={theme.colors.gradient1}
                  style={styles.icon}
                />
                <Text style={styles.dateTimeText}>{event.date}</Text>
              </View>
              
              <View style={styles.dateTimeItem}>
                <IconButton
                  icon="clock-outline"
                  size={24}
                  color={theme.colors.gradient1}
                  style={styles.icon}
                />
                <Text style={styles.dateTimeText}>{event.time}</Text>
              </View>
            </View>
            
            <View style={styles.locationContainer}>
              <IconButton
                icon="map-marker"
                size={24}
                color={theme.colors.gradient1}
                style={styles.icon}
              />
              <Text style={styles.locationText}>{event.location}</Text>
            </View>
            
            <Text style={styles.descriptionLabel}>Opis:</Text>
            <Text style={styles.descriptionText}>{event.description}</Text>
            
            <View style={styles.organizerContainer}>
              <Text style={styles.organizerLabel}>Organizator:</Text>
              <View style={styles.organizerInfo}>
                <Avatar.Image
                  size={40}
                  source={{ uri: event.organizer.avatar }}
                  style={styles.organizerAvatar}
                />
                <Text style={styles.organizerName}>{event.organizer.name}</Text>
              </View>
            </View>
          </View>
          
          <Divider style={styles.divider} />
          
          <View style={styles.participantsContainer}>
            <Text style={styles.sectionTitle}>
              Uczestnicy ({confirmedParticipants.length}/{event.participants.length})
            </Text>
            
            {/* Confirmed Participants */}
            {confirmedParticipants.length > 0 && (
              <View style={styles.participantSection}>
                <Text style={styles.participantSectionTitle}>Potwierdzeni</Text>
                {confirmedParticipants.map(participant => (
                  <View key={participant.id} style={styles.participantItem}>
                    <View style={styles.participantInfo}>
                      <Avatar.Image
                        size={40}
                        source={{ uri: participant.avatar }}
                        style={styles.participantAvatar}
                      />
                      <Text style={styles.participantName}>{participant.name}</Text>
                    </View>
                    <View style={[styles.statusIndicator, styles.statusConfirmed]} />
                  </View>
                ))}
              </View>
            )}
            
            {/* Pending Participants */}
            {pendingParticipants.length > 0 && (
              <View style={styles.participantSection}>
                <Text style={styles.participantSectionTitle}>Oczekujący</Text>
                {pendingParticipants.map(participant => (
                  <View key={participant.id} style={styles.participantItem}>
                    <View style={styles.participantInfo}>
                      <Avatar.Image
                        size={40}
                        source={{ uri: participant.avatar }}
                        style={styles.participantAvatar}
                      />
                      <Text style={styles.participantName}>{participant.name}</Text>
                    </View>
                    <View style={[styles.statusIndicator, styles.statusPending]} />
                  </View>
                ))}
              </View>
            )}
            
            {/* Declined Participants */}
            {declinedParticipants.length > 0 && (
              <View style={styles.participantSection}>
                <Text style={styles.participantSectionTitle}>Odrzuceni</Text>
                {declinedParticipants.map(participant => (
                  <View key={participant.id} style={styles.participantItem}>
                    <View style={styles.participantInfo}>
                      <Avatar.Image
                        size={40}
                        source={{ uri: participant.avatar }}
                        style={styles.participantAvatar}
                      />
                      <Text style={styles.participantName}>{participant.name}</Text>
                    </View>
                    <View style={[styles.statusIndicator, styles.statusDeclined]} />
                  </View>
                ))}
              </View>
            )}
          </View>
          
          <Divider style={styles.divider} />
          
          <View style={styles.yourStatusContainer}>
            <Text style={styles.sectionTitle}>Twój status</Text>
            
            <View style={styles.statusOptions}>
              <TouchableOpacity
                style={[
                  styles.statusOption,
                  userStatus === 'confirmed' && styles.statusOptionSelected
                ]}
                onPress={() => handleToggleStatus('confirmed')}
              >
                <Text style={[
                  styles.statusOptionText,
                  userStatus === 'confirmed' && styles.statusOptionTextSelected
                ]}>Potwierdzam</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[
                  styles.statusOption,
                  userStatus === 'pending' && styles.statusOptionSelected
                ]}
                onPress={() => handleToggleStatus('pending')}
              >
                <Text style={[
                  styles.statusOptionText,
                  userStatus === 'pending' && styles.statusOptionTextSelected
                ]}>Zastanawiam się</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[
                  styles.statusOption,
                  userStatus === 'declined' && styles.statusOptionSelected
                ]}
                onPress={() => handleToggleStatus('declined')}
              >
                <Text style={[
                  styles.statusOptionText,
                  userStatus === 'declined' && styles.statusOptionTextSelected
                ]}>Odrzucam</Text>
              </TouchableOpacity>
            </View>
          </View>
          
          {isOrganizer && (
            <View style={styles.buttonContainer}>
              <GradientButton
                title="EDYTUJ WYDARZENIE"
                onPress={() => setEditModalVisible(true)}
                style={styles.editButton}
              />
            </View>
          )}
        </Surface>
      </ScrollView>
      
      {/* Edit Event Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={editModalVisible}
        onRequestClose={() => setEditModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.modalContainer}
          >
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Edytuj wydarzenie</Text>
              
              <TextInput
                label="Tytuł"
                value={editData.title}
                onChangeText={(text) => updateEditData('title', text)}
                mode="outlined"
                style={styles.input}
                error={!!errors.title}
              />
              {errors.title ? <Text style={styles.errorText}>{errors.title}</Text> : null}
              
              <TouchableOpacity 
                onPress={() => setShowDatePicker(true)}
                style={styles.datePickerButton}
              >
                <Text style={styles.datePickerLabel}>Data:</Text>
                <Text style={styles.datePickerValue}>
                  {editData.date.toLocaleDateString()}
                </Text>
              </TouchableOpacity>
              
              {showDatePicker && (
                <DateTimePicker
                  value={editData.date}
                  mode="date"
                  display="default"
                  onChange={onDateChange}
                />
              )}
              
              <TouchableOpacity 
                onPress={() => setShowTimePicker(true)}
                style={styles.datePickerButton}
              >
                <Text style={styles.datePickerLabel}>Czas:</Text>
                <Text style={styles.datePickerValue}>
                  {editData.time.getHours().toString().padStart(2, '0')}:
                  {editData.time.getMinutes().toString().padStart(2, '0')}
                </Text>
              </TouchableOpacity>
              
              {showTimePicker && (
                <DateTimePicker
                  value={editData.time}
                  mode="time"
                  display="default"
                  onChange={onTimeChange}
                />
              )}
              
              <TextInput
                label="Lokalizacja"
                value={editData.location}
                onChangeText={(text) => updateEditData('location', text)}
                mode="outlined"
                style={styles.input}
                error={!!errors.location}
              />
              {errors.location ? <Text style={styles.errorText}>{errors.location}</Text> : null}
              
              <TextInput
                label="Opis (opcjonalnie)"
                value={editData.description}
                onChangeText={(text) => updateEditData('description', text)}
                mode="outlined"
                style={styles.inputMultiline}
                multiline
                numberOfLines={4}
              />
              
              <View style={styles.modalButtons}>
                <Button 
                  mode="outlined"
                  onPress={() => setEditModalVisible(false)}
                  style={styles.cancelButton}
                >
                  Anuluj
                </Button>
                <GradientButton
                  title="ZAPISZ"
                  onPress={handleUpdateEvent}
                  style={styles.saveButton}
                />
              </View>
            </View>
          </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  loadingText: {
    color: '#FFFFFF',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 50,
  },
  scrollContainer: {
    flexGrow: 1,
  },
  surface: {
    flex: 1,
    padding: 20,
    backgroundColor: '#121212',
    elevation: 0,
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 20,
  },
  dateTimeContainer: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  dateTimeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  icon: {
    margin: 0,
    padding: 0,
  },
  dateTimeText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  locationText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  descriptionLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  descriptionText: {
    color: '#CCCCCC',
    fontSize: 16,
    marginBottom: 16,
  },
  organizerContainer: {
    marginTop: 10,
  },
  organizerLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  organizerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  organizerAvatar: {
    marginRight: 10,
    backgroundColor: '#2C2C2C',
  },
  organizerName: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  divider: {
    backgroundColor: '#2C2C2C',
    height: 1,
    marginVertical: 20,
  },
  participantsContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  participantSection: {
    marginBottom: 16,
  },
  participantSectionTitle: {
    fontSize: 16,
    color: '#AAAAAA',
    marginBottom: 8,
  },
  participantItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#2C2C2C',
  },
  participantInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  participantAvatar: {
    marginRight: 10,
    backgroundColor: '#2C2C2C',
  },
  participantName: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  statusConfirmed: {
    backgroundColor: '#4CAF50',
  },
  statusPending: {
    backgroundColor: '#FFC107',
  },
  statusDeclined: {
    backgroundColor: '#F44336',
  },
  yourStatusContainer: {
    marginBottom: 20,
  },
  statusOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  statusOption: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 5,
    backgroundColor: '#2C2C2C',
  },
  statusOptionSelected: {
    backgroundColor: 'rgba(157, 78, 221, 0.3)',
  },
  statusOptionText: {
    color: '#AAAAAA',
    fontSize: 14,
  },
  statusOptionTextSelected: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  buttonContainer: {
    marginTop: 10,
  },
  editButton: {
    marginTop: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  modalContent: {
    margin: 20,
    backgroundColor: '#1E1E1E',
    borderRadius: 20,
    padding: 24,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    marginBottom: 16,
    backgroundColor: '#2C2C2C',
  },
  inputMultiline: {
    marginBottom: 16,
    backgroundColor: '#2C2C2C',
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
    backgroundColor: '#2C2C2C',
    borderRadius: 4,
    marginBottom: 16,
  },
  datePickerLabel: {
    color: '#AAAAAA',
    width: 50,
  },
  datePickerValue: {
    color: '#FFFFFF',
    fontWeight: '500',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  cancelButton: {
    borderColor: '#9D4EDD',
    borderWidth: 1,
    flex: 1,
    marginRight: 10,
  },
  saveButton: {
    flex: 1,
    marginLeft: 10,
  },
  gradientButton: {
    borderRadius: 30,
    paddingVertical: 12,
    paddingHorizontal: 32,
    elevation: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default EventDetailsScreen; 