import React, { useState } from 'react';
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
  Card, 
  Title, 
  Paragraph, 
  Button, 
  TextInput,
  Switch,
  useTheme
} from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { Calendar } from 'react-native-calendars';
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

// Sample events data - in a real app, this would come from a backend
const sampleEvents = [
  {
    id: '1',
    title: 'Spotkanie projektowe',
    date: '2023-06-15',
    time: '14:00',
    description: 'Omówienie postępów w projekcie i planowanie kolejnych kroków.',
    participants: [
      { id: '1', name: 'Jan Kowalski', status: 'confirmed' },
      { id: '2', name: 'Anna Nowak', status: 'pending' },
      { id: '3', name: 'Piotr Wiśniewski', status: 'declined' }
    ]
  },
  {
    id: '2',
    title: 'Urodziny Marka',
    date: '2023-06-20',
    time: '18:00',
    description: 'Świętowanie urodzin Marka w restauracji "Pod Lipami".',
    participants: [
      { id: '1', name: 'Jan Kowalski', status: 'confirmed' },
      { id: '2', name: 'Anna Nowak', status: 'confirmed' },
      { id: '4', name: 'Ewa Dąbrowska', status: 'pending' }
    ]
  }
];

const CalendarScreen = ({ navigation }) => {
  const [events, setEvents] = useState(sampleEvents);
  const [selectedDate, setSelectedDate] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: '',
    date: new Date(),
    time: new Date(),
    description: ''
  });
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [titleError, setTitleError] = useState('');
  const [dateError, setDateError] = useState('');
  
  const theme = useTheme();

  // Format dates for display in calendar
  const markedDates = {};
  events.forEach(event => {
    markedDates[event.date] = { 
      marked: true, 
      dotColor: theme.colors.gradient2,
      selected: event.date === selectedDate,
      selectedColor: 'rgba(157, 78, 221, 0.2)'
    };
  });

  if (selectedDate && !markedDates[selectedDate]) {
    markedDates[selectedDate] = { 
      selected: true, 
      selectedColor: 'rgba(157, 78, 221, 0.2)'
    };
  }

  const filteredEvents = selectedDate 
    ? events.filter(event => event.date === selectedDate)
    : events;

  const validateTitle = (title) => {
    if (!title) {
      setTitleError('Tytuł jest wymagany');
      return false;
    }
    setTitleError('');
    return true;
  };

  const validateDate = (date) => {
    if (!date) {
      setDateError('Data jest wymagana');
      return false;
    }
    setDateError('');
    return true;
  };

  const handleAddEvent = () => {
    const isValidTitle = validateTitle(newEvent.title);
    const isValidDate = validateDate(newEvent.date);
    
    if (isValidTitle && isValidDate) {
      const formattedDate = newEvent.date.toISOString().split('T')[0];
      const hours = newEvent.time.getHours().toString().padStart(2, '0');
      const minutes = newEvent.time.getMinutes().toString().padStart(2, '0');
      
      const newEventObj = {
        id: (events.length + 1).toString(),
        title: newEvent.title,
        date: formattedDate,
        time: `${hours}:${minutes}`,
        description: newEvent.description,
        participants: []
      };
      
      setEvents([...events, newEventObj]);
      setSelectedDate(formattedDate);
      setModalVisible(false);
      setNewEvent({
        title: '',
        date: new Date(),
        time: new Date(),
        description: ''
      });
    }
  };

  const onDateChange = (_, selectedDate) => {
    const currentDate = selectedDate || newEvent.date;
    setShowDatePicker(false);
    setNewEvent({ ...newEvent, date: currentDate });
    validateDate(currentDate);
  };

  const onTimeChange = (_, selectedTime) => {
    const currentTime = selectedTime || newEvent.time;
    setShowTimePicker(false);
    setNewEvent({ ...newEvent, time: currentTime });
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      <Calendar
        theme={{
          backgroundColor: '#121212',
          calendarBackground: '#1E1E1E',
          textSectionTitleColor: '#AAAAAA',
          selectedDayBackgroundColor: theme.colors.gradient2,
          selectedDayTextColor: '#FFFFFF',
          todayTextColor: theme.colors.gradient1,
          dayTextColor: '#FFFFFF',
          textDisabledColor: '#444444',
          dotColor: theme.colors.gradient2,
          selectedDotColor: '#FFFFFF',
          arrowColor: theme.colors.gradient1,
          monthTextColor: '#FFFFFF',
          indicatorColor: theme.colors.gradient1,
          textDayFontWeight: '300',
          textMonthFontWeight: 'bold',
          textDayHeaderFontWeight: '300',
          textDayFontSize: 16,
          textMonthFontSize: 16,
          textDayHeaderFontSize: 14
        }}
        markedDates={markedDates}
        onDayPress={(day) => setSelectedDate(day.dateString)}
      />
      
      <View style={styles.eventsHeader}>
        <Text style={styles.eventsTitle}>
          {selectedDate ? `Wydarzenia (${selectedDate})` : 'Wszystkie wydarzenia'}
        </Text>
        <Button
          icon="plus"
          mode="contained"
          style={styles.addButton}
          onPress={() => setModalVisible(true)}
        >
          Dodaj
        </Button>
      </View>
      
      <ScrollView style={styles.eventsContainer}>
        {filteredEvents.length > 0 ? (
          filteredEvents.map(event => (
            <Card 
              key={event.id} 
              style={styles.eventCard}
              onPress={() => navigation.navigate('EventDetails', { eventId: event.id })}
            >
              <Card.Content>
                <Title style={styles.eventTitle}>{event.title}</Title>
                <View style={styles.eventDetails}>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Data:</Text>
                    <Text style={styles.detailValue}>{event.date}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Czas:</Text>
                    <Text style={styles.detailValue}>{event.time}</Text>
                  </View>
                </View>
                <Paragraph style={styles.eventDescription}>
                  {event.description}
                </Paragraph>
                
                <View style={styles.participantsContainer}>
                  <Text style={styles.participantsTitle}>
                    Uczestnicy ({event.participants.filter(p => p.status === 'confirmed').length}/{event.participants.length})
                  </Text>
                  {event.participants.slice(0, 2).map(participant => (
                    <View key={participant.id} style={styles.participant}>
                      <Text style={styles.participantName}>{participant.name}</Text>
                      <View style={[
                        styles.statusIndicator, 
                        participant.status === 'confirmed' ? styles.statusConfirmed : 
                        participant.status === 'pending' ? styles.statusPending : 
                        styles.statusDeclined
                      ]} />
                    </View>
                  ))}
                  {event.participants.length > 2 && (
                    <Text style={styles.moreParticipants}>
                      + {event.participants.length - 2} więcej
                    </Text>
                  )}
                </View>
              </Card.Content>
            </Card>
          ))
        ) : (
          <View style={styles.noEventsContainer}>
            <Text style={styles.noEventsText}>
              {selectedDate ? 'Brak wydarzeń dla wybranej daty' : 'Brak zaplanowanych wydarzeń'}
            </Text>
          </View>
        )}
      </ScrollView>
      
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.modalContainer}
          >
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Dodaj nowe wydarzenie</Text>
              
              <TextInput
                label="Tytuł wydarzenia"
                value={newEvent.title}
                onChangeText={text => {
                  setNewEvent({ ...newEvent, title: text });
                  if (titleError) validateTitle(text);
                }}
                mode="outlined"
                style={styles.input}
                error={!!titleError}
              />
              {titleError ? <Text style={styles.errorText}>{titleError}</Text> : null}
              
              <TouchableOpacity 
                onPress={() => setShowDatePicker(true)}
                style={styles.datePickerButton}
              >
                <Text style={styles.datePickerLabel}>Data:</Text>
                <Text style={styles.datePickerValue}>
                  {newEvent.date.toLocaleDateString()}
                </Text>
              </TouchableOpacity>
              {dateError ? <Text style={styles.errorText}>{dateError}</Text> : null}
              
              {showDatePicker && (
                <DateTimePicker
                  value={newEvent.date}
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
                  {newEvent.time.getHours().toString().padStart(2, '0')}:
                  {newEvent.time.getMinutes().toString().padStart(2, '0')}
                </Text>
              </TouchableOpacity>
              
              {showTimePicker && (
                <DateTimePicker
                  value={newEvent.time}
                  mode="time"
                  display="default"
                  onChange={onTimeChange}
                />
              )}
              
              <TextInput
                label="Opis (opcjonalnie)"
                value={newEvent.description}
                onChangeText={text => setNewEvent({ ...newEvent, description: text })}
                mode="outlined"
                style={styles.inputMultiline}
                multiline
                numberOfLines={3}
              />
              
              <View style={styles.modalButtons}>
                <Button 
                  mode="outlined"
                  onPress={() => setModalVisible(false)}
                  style={styles.cancelButton}
                >
                  Anuluj
                </Button>
                <GradientButton
                  title="DODAJ"
                  onPress={handleAddEvent}
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
  eventsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#2C2C2C',
  },
  eventsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  addButton: {
    backgroundColor: '#9D4EDD',
  },
  eventsContainer: {
    flex: 1,
    padding: 16,
  },
  eventCard: {
    marginBottom: 16,
    backgroundColor: '#1E1E1E',
    borderRadius: 12,
    elevation: 4,
  },
  eventTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    marginBottom: 8,
  },
  eventDetails: {
    marginBottom: 10,
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  detailLabel: {
    color: '#AAAAAA',
    width: 50,
  },
  detailValue: {
    color: '#FFFFFF',
    fontWeight: '500',
  },
  eventDescription: {
    color: '#CCCCCC',
    marginBottom: 12,
  },
  participantsContainer: {
    borderTopWidth: 1,
    borderTopColor: '#2C2C2C',
    paddingTop: 10,
  },
  participantsTitle: {
    color: '#AAAAAA',
    fontSize: 14,
    marginBottom: 8,
  },
  participant: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  participantName: {
    color: '#FFFFFF',
  },
  statusIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
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
  moreParticipants: {
    color: '#AAAAAA',
    fontSize: 12,
    marginTop: 4,
  },
  noEventsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: 200,
  },
  noEventsText: {
    color: '#AAAAAA',
    fontSize: 16,
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
    height: 80,
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
  errorText: {
    color: '#FF4D4D',
    marginBottom: 10,
    marginLeft: 10,
    fontSize: 12,
  },
});

export default CalendarScreen; 