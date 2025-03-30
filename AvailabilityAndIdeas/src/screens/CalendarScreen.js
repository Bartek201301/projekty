import React, { useState, useCallback } from 'react';
import { 
  StyleSheet, 
  View, 
  ScrollView, 
  TouchableOpacity,
  Modal,
  FlatList
} from 'react-native';
import { 
  Text, 
  TextInput, 
  Button, 
  Card, 
  IconButton, 
  useTheme,
  Surface,
  Divider,
  Switch
} from 'react-native-paper';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';

// Configure calendar to use Polish language
LocaleConfig.locales['pl'] = {
  monthNames: [
    'Styczeń', 'Luty', 'Marzec', 'Kwiecień', 'Maj', 'Czerwiec', 
    'Lipiec', 'Sierpień', 'Wrzesień', 'Październik', 'Listopad', 'Grudzień'
  ],
  monthNamesShort: ['Sty.', 'Lut.', 'Mar.', 'Kwi.', 'Maj', 'Cze.', 'Lip.', 'Sie.', 'Wrz.', 'Paź.', 'Lis.', 'Gru.'],
  dayNames: ['Niedziela', 'Poniedziałek', 'Wtorek', 'Środa', 'Czwartek', 'Piątek', 'Sobota'],
  dayNamesShort: ['Nd.', 'Pn.', 'Wt.', 'Śr.', 'Czw.', 'Pt.', 'Sb.'],
  today: 'Dziś'
};
LocaleConfig.defaultLocale = 'pl';

// Sample user data
const USERS = [
  { id: '1', name: 'Anna K.' },
  { id: '2', name: 'Tomasz W.' },
  { id: '3', name: 'Martyna S.' },
  { id: '4', name: 'Jakub N.' },
  { id: '5', name: 'Oliwia R.' },
  { id: '6', name: 'Michał P.' },
  { id: '7', name: 'Maja D.' },
  { id: '8', name: 'Kacper Z.' },
  { id: '9', name: 'Zofia G.' },
  { id: '10', name: 'Bartosz M.' },
];

// Sample events data for demo
const INITIAL_EVENTS = {
  '2025-03-30': [
    { id: '1', userId: '1', name: 'Anna K.', title: 'Spotkanie na mieście', time: '18:00', attending: true },
    { id: '2', userId: '3', name: 'Martyna S.', title: 'Obiad u rodziny', time: '14:00', attending: false },
    { id: '3', userId: '5', name: 'Oliwia R.', title: 'Kino - nowy film', time: '20:30', attending: true },
  ],
  '2025-03-31': [
    { id: '4', userId: '2', name: 'Tomasz W.', title: 'Mecz piłki nożnej', time: '17:00', attending: null },
    { id: '5', userId: '7', name: 'Maja D.', title: 'Koncert w parku', time: '19:00', attending: true },
  ],
  '2025-04-02': [
    { id: '6', userId: '10', name: 'Bartosz M.', title: 'Urodziny', time: '20:00', attending: true },
  ],
};

// Mark dates that have events with dots
const getMarkedDates = (events, selectedDate) => {
  const markedDates = {};
  
  Object.keys(events).forEach(date => {
    markedDates[date] = { marked: true, dotColor: '#C77DFF' };
  });
  
  if (selectedDate) {
    markedDates[selectedDate] = {
      ...markedDates[selectedDate],
      selected: true,
      selectedColor: '#9D4EDD',
    };
  }
  
  return markedDates;
};

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

const EventItem = ({ event, onToggleAttendance, onEdit, isCurrentUser }) => {
  const theme = useTheme();
  const [attending, setAttending] = useState(event.attending);
  
  const handleToggle = useCallback(() => {
    const newStatus = attending === null ? true : attending ? false : null;
    setAttending(newStatus);
    onToggleAttendance(event.id, newStatus);
  }, [attending, event.id, onToggleAttendance]);
  
  let attendanceColor = '#888888'; // neutral
  let attendanceText = 'Nie wiem';
  if (attending === true) {
    attendanceColor = '#4CAF50'; // green
    attendanceText = 'Uczestniczę';
  } else if (attending === false) {
    attendanceColor = '#F44336'; // red
    attendanceText = 'Nie uczestniczę';
  }
  
  return (
    <Card style={styles.eventCard} mode="outlined">
      <Card.Content>
        <View style={styles.eventHeader}>
          <View>
            <Text style={styles.eventTime}>{event.time}</Text>
            <Text style={styles.eventTitle}>{event.title}</Text>
            <Text style={styles.eventOwner}>Dodane przez: {event.name}</Text>
          </View>
          {isCurrentUser && (
            <IconButton
              icon="pencil"
              size={20}
              onPress={() => onEdit(event)}
              style={styles.editButton}
            />
          )}
        </View>
        
        <Divider style={styles.divider} />
        
        <View style={styles.attendanceContainer}>
          <Text>Twoja obecność: </Text>
          <View style={styles.attendanceStatus}>
            <Text style={{ color: attendanceColor }}>{attendanceText}</Text>
            <Switch
              value={attending === true}
              onValueChange={handleToggle}
              color={theme.colors.primary}
            />
          </View>
        </View>
      </Card.Content>
    </Card>
  );
};

const CalendarScreen = ({ navigation }) => {
  const theme = useTheme();
  const [events, setEvents] = useState(INITIAL_EVENTS);
  const [selectedDate, setSelectedDate] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [newEventTitle, setNewEventTitle] = useState('');
  const [newEventTime, setNewEventTime] = useState(new Date());
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [newEventTitleError, setNewEventTitleError] = useState('');
  const currentUserId = '10'; // Just for demo, this would come from authentication
  
  const handleDateSelect = (day) => {
    setSelectedDate(day.dateString);
  };
  
  const handleAddEvent = () => {
    setEditingEvent(null);
    setNewEventTitle('');
    setNewEventTime(new Date());
    setNewEventTitleError('');
    setModalVisible(true);
  };
  
  const handleEditEvent = (event) => {
    setEditingEvent(event);
    setNewEventTitle(event.title);
    
    // Parse event.time (HH:MM) to create a Date object
    const [hours, minutes] = event.time.split(':').map(Number);
    const eventTime = new Date();
    eventTime.setHours(hours, minutes, 0);
    
    setNewEventTime(eventTime);
    setNewEventTitleError('');
    setModalVisible(true);
  };
  
  const formatTime = (date) => {
    return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
  };
  
  const handleToggleAttendance = (eventId, status) => {
    setEvents(prevEvents => {
      const newEvents = { ...prevEvents };
      
      for (const date in newEvents) {
        newEvents[date] = newEvents[date].map(event => {
          if (event.id === eventId) {
            return { ...event, attending: status };
          }
          return event;
        });
      }
      
      return newEvents;
    });
  };
  
  const validateEventForm = () => {
    let isValid = true;
    
    if (!newEventTitle.trim()) {
      setNewEventTitleError('Tytuł jest wymagany');
      isValid = false;
    } else {
      setNewEventTitleError('');
    }
    
    return isValid;
  };
  
  const handleSaveEvent = () => {
    if (!validateEventForm()) {
      return;
    }
    
    setEvents(prevEvents => {
      const newEvents = { ...prevEvents };
      const currentDate = selectedDate;
      
      if (!newEvents[currentDate]) {
        newEvents[currentDate] = [];
      }
      
      const currentUserInfo = USERS.find(user => user.id === currentUserId);
      
      if (editingEvent) {
        // Update existing event
        newEvents[currentDate] = newEvents[currentDate].map(event => {
          if (event.id === editingEvent.id) {
            return {
              ...event,
              title: newEventTitle,
              time: formatTime(newEventTime),
            };
          }
          return event;
        });
      } else {
        // Add new event
        const newEvent = {
          id: Date.now().toString(),
          userId: currentUserId,
          name: currentUserInfo.name,
          title: newEventTitle,
          time: formatTime(newEventTime),
          attending: true, // Default to attending your own event
        };
        
        newEvents[currentDate] = [...newEvents[currentDate], newEvent];
      }
      
      return newEvents;
    });
    
    setModalVisible(false);
  };
  
  const eventsForSelectedDate = selectedDate && events[selectedDate] ? events[selectedDate] : [];
  
  return (
    <View style={styles.container}>
      <Surface style={styles.calendarContainer}>
        <Calendar
          onDayPress={handleDateSelect}
          markedDates={getMarkedDates(events, selectedDate)}
          theme={{
            calendarBackground: theme.colors.card,
            textSectionTitleColor: '#b6c1cd',
            selectedDayBackgroundColor: theme.colors.primary,
            selectedDayTextColor: '#ffffff',
            todayTextColor: theme.colors.accent,
            dayTextColor: '#d9e1e8',
            textDisabledColor: '#444444',
            dotColor: theme.colors.accent,
            selectedDotColor: '#ffffff',
            arrowColor: theme.colors.primary,
            monthTextColor: '#d9e1e8',
            indicatorColor: theme.colors.primary,
            textDayFontWeight: '300',
            textMonthFontWeight: 'bold',
            textDayHeaderFontWeight: '300',
          }}
        />
      </Surface>
      
      {selectedDate && (
        <View style={styles.eventsContainer}>
          <View style={styles.eventsHeader}>
            <Text style={styles.eventsTitle}>
              Plany na {selectedDate.split('-').reverse().join('.')}
            </Text>
            <GradientButton
              title="+ DODAJ"
              onPress={handleAddEvent}
              style={styles.addButton}
            />
          </View>
          
          {eventsForSelectedDate.length > 0 ? (
            <FlatList
              data={eventsForSelectedDate.sort((a, b) => a.time.localeCompare(b.time))}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <EventItem
                  event={item}
                  onToggleAttendance={handleToggleAttendance}
                  onEdit={handleEditEvent}
                  isCurrentUser={item.userId === currentUserId}
                />
              )}
              contentContainerStyle={styles.eventsList}
            />
          ) : (
            <View style={styles.noEventsContainer}>
              <MaterialCommunityIcons name="calendar-blank" size={64} color="#444444" />
              <Text style={styles.noEventsText}>Brak planów na ten dzień</Text>
              <Text style={styles.noEventsSubtext}>Dodaj nowy plan lub sprawdź inny dzień</Text>
            </View>
          )}
        </View>
      )}
      
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {editingEvent ? 'Edytuj plan' : 'Dodaj nowy plan'}
            </Text>
            
            <TextInput
              label="Tytuł wydarzenia"
              value={newEventTitle}
              onChangeText={text => {
                setNewEventTitle(text);
                if (newEventTitleError) setNewEventTitleError('');
              }}
              mode="outlined"
              style={styles.modalInput}
              error={!!newEventTitleError}
              theme={{ roundness: theme.roundness }}
            />
            {newEventTitleError ? <Text style={styles.errorText}>{newEventTitleError}</Text> : null}
            
            <TouchableOpacity 
              style={styles.timePickerButton} 
              onPress={() => setShowTimePicker(true)}
            >
              <Text style={styles.timePickerLabel}>Czas:</Text>
              <Text style={styles.timePickerValue}>{formatTime(newEventTime)}</Text>
              <MaterialCommunityIcons name="clock-outline" size={24} color={theme.colors.primary} />
            </TouchableOpacity>
            
            {showTimePicker && (
              <DateTimePicker
                value={newEventTime}
                mode="time"
                is24Hour={true}
                display="default"
                onChange={(event, selectedTime) => {
                  setShowTimePicker(false);
                  if (selectedTime) {
                    setNewEventTime(selectedTime);
                  }
                }}
              />
            )}
            
            <View style={styles.modalButtons}>
              <Button 
                mode="outlined" 
                onPress={() => setModalVisible(false)}
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
  calendarContainer: {
    marginHorizontal: 10,
    marginTop: 10,
    marginBottom: 10,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#1E1E1E',
  },
  eventsContainer: {
    flex: 1,
    paddingHorizontal: 10,
  },
  eventsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 10,
  },
  eventsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  addButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 30,
  },
  eventsList: {
    paddingBottom: 20,
  },
  eventCard: {
    marginBottom: 10,
    borderRadius: 12,
    backgroundColor: '#1E1E1E',
    borderColor: '#333333',
  },
  eventHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  eventTime: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#C77DFF',
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 4,
  },
  eventOwner: {
    fontSize: 12,
    color: '#AAAAAA',
    marginTop: 4,
  },
  editButton: {
    margin: 0,
  },
  divider: {
    backgroundColor: '#333333',
    marginVertical: 10,
  },
  attendanceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  attendanceStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  noEventsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 50,
  },
  noEventsText: {
    fontSize: 18,
    color: '#AAAAAA',
    marginTop: 16,
  },
  noEventsSubtext: {
    fontSize: 14,
    color: '#666666',
    marginTop: 8,
  },
  gradientButton: {
    borderRadius: 30,
    paddingVertical: 8,
    paddingHorizontal: 16,
    elevation: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
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
  modalInput: {
    marginBottom: 5,
    backgroundColor: '#2E2E2E',
  },
  errorText: {
    color: '#FF4D4D',
    marginBottom: 15,
    marginLeft: 10,
    fontSize: 12,
  },
  timePickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderWidth: 1,
    borderColor: '#444444',
    borderRadius: 5,
    marginBottom: 20,
    marginTop: 10,
    backgroundColor: '#2E2E2E',
  },
  timePickerLabel: {
    color: '#AAAAAA',
    marginRight: 10,
  },
  timePickerValue: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 16,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
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
});

export default CalendarScreen; 