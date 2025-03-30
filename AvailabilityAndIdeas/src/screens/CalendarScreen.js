import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { Surface, Text, Title, Button, TextInput, Avatar, Chip, Card, IconButton, Divider } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';

// Demo data
const DEMO_USERS = [
  { id: '1', name: 'Anna', avatar: 'https://randomuser.me/api/portraits/women/1.jpg', status: 'Weekend fun!' },
  { id: '2', name: 'Michał', avatar: 'https://randomuser.me/api/portraits/men/1.jpg', status: 'Up for hiking!' },
  { id: '3', name: 'Kasia', avatar: 'https://randomuser.me/api/portraits/women/2.jpg', status: 'Let\'s chill' },
  { id: '4', name: 'Tomek', avatar: 'https://randomuser.me/api/portraits/men/2.jpg', status: 'Game night?' },
  { id: '5', name: 'Ola', avatar: 'https://randomuser.me/api/portraits/women/3.jpg', status: 'Ready for adventure' },
];

const DEMO_AVAILABILITY = {
  '2025-05-01': [
    { userId: '1', idea: 'Majówka na działce' },
    { userId: '2', idea: null },
    { userId: '4', idea: 'Grill z przyjaciółmi' },
  ],
  '2025-05-02': [
    { userId: '1', idea: null },
    { userId: '3', idea: 'Wyjazd nad jezioro' },
    { userId: '5', idea: 'Piknik w parku' },
  ],
  '2025-05-03': [
    { userId: '2', idea: 'Turniej planszówek' },
    { userId: '4', idea: null },
    { userId: '5', idea: null },
  ],
  '2025-05-04': [
    { userId: '1', idea: 'Spacer po lesie' },
    { userId: '3', idea: null },
  ],
};

const CalendarScreen = ({ navigation }) => {
  const [selectedDate, setSelectedDate] = useState('');
  const [availableDates, setAvailableDates] = useState({});
  const [userAvailability, setUserAvailability] = useState(DEMO_AVAILABILITY);
  const [idea, setIdea] = useState('');
  const [isAvailable, setIsAvailable] = useState(false);
  const currentUserId = '1'; // In a real app, this would come from authentication
  
  // Prepare calendar marked dates
  useEffect(() => {
    const markedDates = {};
    
    // Process user availability data
    Object.keys(userAvailability).forEach(date => {
      const users = userAvailability[date];
      const isCurrentUserAvailable = users.some(user => user.userId === currentUserId);
      
      markedDates[date] = {
        marked: true,
        dotColor: '#6200ee',
        selected: date === selectedDate,
        selectedColor: date === selectedDate ? '#6200ee' : undefined,
        selectedTextColor: date === selectedDate ? 'white' : undefined,
      };
      
      // Add additional marking if current user is available
      if (isCurrentUserAvailable) {
        markedDates[date].dotColor = '#03dac4';
      }
    });
    
    // If selectedDate not in userAvailability, still mark it as selected
    if (selectedDate && !markedDates[selectedDate]) {
      markedDates[selectedDate] = {
        selected: true,
        selectedColor: '#6200ee',
        selectedTextColor: 'white',
      };
    }
    
    setAvailableDates(markedDates);
  }, [selectedDate, userAvailability]);
  
  // When a date is selected, check if current user is available
  useEffect(() => {
    if (selectedDate) {
      const dateAvailability = userAvailability[selectedDate] || [];
      const currentUserAvailability = dateAvailability.find(a => a.userId === currentUserId);
      
      setIsAvailable(!!currentUserAvailability);
      setIdea(currentUserAvailability?.idea || '');
    } else {
      setIsAvailable(false);
      setIdea('');
    }
  }, [selectedDate, userAvailability]);
  
  const handleDateSelect = (day) => {
    setSelectedDate(day.dateString);
  };
  
  const toggleAvailability = () => {
    if (isAvailable) {
      // Remove availability
      const newAvailability = { ...userAvailability };
      if (newAvailability[selectedDate]) {
        newAvailability[selectedDate] = newAvailability[selectedDate].filter(
          a => a.userId !== currentUserId
        );
        
        // Remove the date key if no users are available
        if (newAvailability[selectedDate].length === 0) {
          delete newAvailability[selectedDate];
        }
      }
      
      setUserAvailability(newAvailability);
      setIsAvailable(false);
      setIdea('');
    } else {
      // Add availability
      const newAvailability = { ...userAvailability };
      if (!newAvailability[selectedDate]) {
        newAvailability[selectedDate] = [];
      }
      
      newAvailability[selectedDate].push({
        userId: currentUserId,
        idea: idea.trim() === '' ? null : idea,
      });
      
      setUserAvailability(newAvailability);
      setIsAvailable(true);
    }
  };
  
  const updateIdea = () => {
    if (selectedDate && isAvailable) {
      const newAvailability = { ...userAvailability };
      const dateAvailability = newAvailability[selectedDate];
      
      if (dateAvailability) {
        const userIndex = dateAvailability.findIndex(a => a.userId === currentUserId);
        
        if (userIndex !== -1) {
          dateAvailability[userIndex].idea = idea.trim() === '' ? null : idea;
          setUserAvailability(newAvailability);
        }
      }
    }
  };
  
  // Get users available on selected date
  const getAvailableUsers = () => {
    if (!selectedDate || !userAvailability[selectedDate]) {
      return [];
    }
    
    return userAvailability[selectedDate].map(availability => {
      const user = DEMO_USERS.find(u => u.id === availability.userId);
      return {
        ...user,
        idea: availability.idea,
      };
    });
  };
  
  const availableUsers = getAvailableUsers();
  
  // Calculate next weekend dates
  const getNextWeekend = () => {
    const today = new Date();
    const dayOfWeek = today.getDay(); // 0 is Sunday, 6 is Saturday
    
    // Calculate days until next Saturday
    const daysUntilSaturday = dayOfWeek === 6 ? 7 : 6 - dayOfWeek;
    const nextSaturday = new Date(today);
    nextSaturday.setDate(today.getDate() + daysUntilSaturday);
    
    const nextSunday = new Date(nextSaturday);
    nextSunday.setDate(nextSaturday.getDate() + 1);
    
    return {
      saturday: nextSaturday.toISOString().split('T')[0],
      sunday: nextSunday.toISOString().split('T')[0],
    };
  };
  
  const nextWeekend = getNextWeekend();

  return (
    <ScrollView style={styles.container}>
      <Surface style={styles.calendarContainer}>
        <Calendar
          onDayPress={handleDateSelect}
          markedDates={availableDates}
          theme={{
            calendarBackground: '#ffffff',
            textSectionTitleColor: '#6200ee',
            selectedDayBackgroundColor: '#6200ee',
            selectedDayTextColor: '#ffffff',
            todayTextColor: '#6200ee',
            dayTextColor: '#2d4150',
            arrowColor: '#6200ee',
          }}
        />
      </Surface>
      
      <View style={styles.quickAccessContainer}>
        <Title style={styles.sectionTitle}>Szybki dostęp</Title>
        <View style={styles.quickAccessButtons}>
          <Chip 
            icon="calendar-weekend" 
            mode="outlined" 
            onPress={() => setSelectedDate(nextWeekend.saturday)}
            style={styles.chip}
          >
            Najbliższa sobota
          </Chip>
          <Chip 
            icon="calendar-weekend" 
            mode="outlined"
            onPress={() => setSelectedDate(nextWeekend.sunday)}
            style={styles.chip}
          >
            Najbliższa niedziela
          </Chip>
        </View>
      </View>
      
      {selectedDate ? (
        <Surface style={styles.selectedDateContainer}>
          <Title style={styles.dateTitle}>
            {new Date(selectedDate).toLocaleDateString('pl-PL', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </Title>
          
          <View style={styles.availabilityToggleContainer}>
            <Button 
              mode={isAvailable ? "contained" : "outlined"} 
              icon={isAvailable ? "check" : "plus"} 
              onPress={toggleAvailability}
              style={[styles.availabilityButton, isAvailable && styles.availableButton]}
            >
              {isAvailable ? 'Jestem dostępny/a' : 'Zaznacz dostępność'}
            </Button>
          </View>
          
          {isAvailable && (
            <View style={styles.ideaContainer}>
              <TextInput
                label="Twój pomysł na ten dzień (opcjonalnie)"
                value={idea}
                onChangeText={setIdea}
                mode="outlined"
                multiline
                style={styles.ideaInput}
              />
              <Button 
                mode="text" 
                onPress={updateIdea}
                style={styles.updateIdeaButton}
              >
                Aktualizuj pomysł
              </Button>
            </View>
          )}
          
          <Divider style={styles.divider} />
          
          <View style={styles.availableUsersContainer}>
            <Title style={styles.sectionTitle}>
              Dostępne osoby ({availableUsers.length})
            </Title>
            
            {availableUsers.length > 0 ? (
              <FlatList
                data={availableUsers}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <Card style={styles.userCard}>
                    <Card.Title
                      title={item.name}
                      subtitle={item.status}
                      left={(props) => (
                        <Avatar.Image {...props} source={{ uri: item.avatar }} />
                      )}
                    />
                    {item.idea && (
                      <Card.Content>
                        <View style={styles.ideaChip}>
                          <Ionicons name="bulb-outline" size={16} color="#6200ee" style={styles.ideaIcon} />
                          <Text>{item.idea}</Text>
                        </View>
                      </Card.Content>
                    )}
                  </Card>
                )}
                scrollEnabled={false}
              />
            ) : (
              <Text style={styles.noUsersText}>
                Nikt jeszcze nie zaznaczył dostępności na ten dzień
              </Text>
            )}
          </View>
        </Surface>
      ) : (
        <Surface style={styles.noSelectionContainer}>
          <Text style={styles.noSelectionText}>
            Wybierz datę, aby zobaczyć dostępność i dodać swoją
          </Text>
        </Surface>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f6f6f6',
  },
  calendarContainer: {
    margin: 10,
    borderRadius: 10,
    overflow: 'hidden',
    elevation: 2,
  },
  quickAccessContainer: {
    margin: 10,
    marginTop: 5,
  },
  sectionTitle: {
    fontSize: 18,
    marginBottom: 10,
  },
  quickAccessButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  chip: {
    margin: 4,
  },
  selectedDateContainer: {
    margin: 10,
    padding: 15,
    borderRadius: 10,
    elevation: 2,
  },
  dateTitle: {
    fontSize: 20,
    marginBottom: 15,
    textAlign: 'center',
    textTransform: 'capitalize',
  },
  availabilityToggleContainer: {
    alignItems: 'center',
    marginBottom: 15,
  },
  availabilityButton: {
    width: '80%',
  },
  availableButton: {
    backgroundColor: '#4CAF50',
  },
  ideaContainer: {
    marginBottom: 10,
  },
  ideaInput: {
    marginBottom: 5,
  },
  updateIdeaButton: {
    alignSelf: 'flex-end',
  },
  divider: {
    marginVertical: 15,
  },
  availableUsersContainer: {
    marginTop: 5,
  },
  userCard: {
    marginBottom: 10,
  },
  ideaChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0e6ff',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginTop: 8,
  },
  ideaIcon: {
    marginRight: 6,
  },
  noUsersText: {
    textAlign: 'center',
    color: '#666',
    marginTop: 10,
    marginBottom: 10,
  },
  noSelectionContainer: {
    margin: 10,
    padding: 30,
    borderRadius: 10,
    elevation: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noSelectionText: {
    textAlign: 'center',
    color: '#666',
  },
});

export default CalendarScreen; 