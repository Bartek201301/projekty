import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  ActivityIndicator,
  Dimensions,
  RefreshControl,
  Alert,
  Image,
  ScrollView
} from 'react-native';
import { Calendar } from 'react-native-calendars';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { firestore } from '../../services/firebase';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import PhotoCard from '../../components/PhotoCard';

const { width } = Dimensions.get('window');

const CalendarScreen = () => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [markedDates, setMarkedDates] = useState({});
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [groups, setGroups] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  
  const { user } = useAuth();
  const { theme } = useTheme();
  const navigation = useNavigation();
  const route = useRoute();
  const initialGroupId = route.params?.initialGroupId;

  useEffect(() => {
    fetchUserGroups();
  }, []);

  useEffect(() => {
    if (groups.length > 0) {
      // If initialGroupId is provided, set it as the selected group
      if (initialGroupId) {
        const initialGroup = groups.find(g => g.id === initialGroupId);
        if (initialGroup) {
          setSelectedGroup(initialGroup);
        } else {
          setSelectedGroup(groups[0]);
        }
      } else {
        setSelectedGroup(groups[0]);
      }
    }
  }, [groups, initialGroupId]);

  useEffect(() => {
    if (selectedGroup) {
      fetchPhotos();
    }
  }, [selectedGroup, selectedDate]);

  const fetchUserGroups = async () => {
    try {
      setLoading(true);
      
      // Fetch user's groups
      const groupMembersQuery = query(
        collection(firestore, 'group_members'),
        where('userId', '==', user.uid)
      );
      
      const groupMembersSnapshot = await getDocs(groupMembersQuery);
      const userGroupIds = groupMembersSnapshot.docs.map(doc => doc.data().groupId);
      
      if (userGroupIds.length === 0) {
        setGroups([]);
        setLoading(false);
        return;
      }
      
      // Build batches of groupIds for 'in' query (Firestore limit is 10)
      const groupBatches = [];
      for (let i = 0; i < userGroupIds.length; i += 10) {
        groupBatches.push(userGroupIds.slice(i, i + 10));
      }
      
      let allGroups = [];
      
      for (const batch of groupBatches) {
        const groupsQuery = query(
          collection(firestore, 'groups'),
          where('id', 'in', batch)
        );
        
        const groupsSnapshot = await getDocs(groupsQuery);
        const groupsList = groupsSnapshot.docs.map(doc => {
          const groupData = doc.data();
          const userRole = groupMembersSnapshot.docs.find(
            memberDoc => memberDoc.data().groupId === groupData.id
          )?.data().role;
          
          return {
            ...groupData,
            isAdmin: userRole === 'admin'
          };
        });
        
        allGroups = [...allGroups, ...groupsList];
      }
      
      setGroups(allGroups);
    } catch (error) {
      console.error('Error fetching user groups:', error);
      Alert.alert('Error', 'Failed to load groups. Please try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const fetchPhotos = async () => {
    try {
      setLoading(true);
      
      // Fetch photos for the selected group
      const photosQuery = query(
        collection(firestore, 'photos'),
        where('groupId', '==', selectedGroup.id),
        orderBy('date', 'desc')
      );
      
      const photosSnapshot = await getDocs(photosQuery);
      
      const photosList = await Promise.all(photosSnapshot.docs.map(async (doc) => {
        const photoData = doc.data();
        
        // Get user info
        const userQuery = query(
          collection(firestore, 'users'),
          where('uid', '==', photoData.userId)
        );
        
        const userSnapshot = await getDocs(userQuery);
        const userData = userSnapshot.docs[0]?.data() || {};
        
        return {
          id: doc.id,
          ...photoData,
          user: {
            id: photoData.userId,
            name: userData.displayName || 'Unknown User',
            photoURL: userData.photoURL
          },
          group: {
            id: selectedGroup.id,
            name: selectedGroup.name
          }
        };
      }));
      
      setPhotos(photosList);
      
      // Create marked dates for calendar
      const dates = {};
      photosList.forEach(photo => {
        const dateStr = new Date(photo.date).toISOString().split('T')[0];
        if (dates[dateStr]) {
          dates[dateStr].dots.push({ color: theme.primary });
        } else {
          dates[dateStr] = {
            dots: [{ color: theme.primary }],
            selected: dateStr === selectedDate,
            selectedColor: theme.primary + '40'
          };
        }
      });
      
      dates[selectedDate] = {
        ...(dates[selectedDate] || {}),
        selected: true,
        selectedColor: theme.primary + '40'
      };
      
      setMarkedDates(dates);
    } catch (error) {
      console.error('Error fetching photos:', error);
      Alert.alert('Error', 'Failed to load photos. Please try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    if (selectedGroup) {
      fetchPhotos();
    } else {
      fetchUserGroups();
    }
  };

  const handleDateSelect = (day) => {
    const dateStr = day.dateString;
    setSelectedDate(dateStr);
    
    // Update marked dates to show the selected date
    setMarkedDates(prevMarked => ({
      ...prevMarked,
      [dateStr]: {
        ...(prevMarked[dateStr] || {}),
        selected: true,
        selectedColor: theme.primary + '40'
      }
    }));
  };

  const getPhotosForSelectedDate = () => {
    return photos.filter(photo => {
      const photoDate = new Date(photo.date).toISOString().split('T')[0];
      return photoDate === selectedDate;
    });
  };

  const renderPhotoItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.photoItem}
      onPress={() => navigation.navigate('PhotoDetail', { photo: item })}
    >
      <Image 
        source={{ uri: item.imageUrl }} 
        style={styles.photoImage}
      />
    </TouchableOpacity>
  );

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
    cameraButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: theme.primary,
      alignItems: 'center',
      justifyContent: 'center',
    },
    groupsContainer: {
      paddingHorizontal: 10,
      paddingVertical: 8,
      borderBottomWidth: 1,
      borderBottomColor: theme.border,
    },
    groupList: {
      paddingVertical: 8,
    },
    groupItem: {
      backgroundColor: theme.card,
      borderRadius: 20,
      paddingHorizontal: 14,
      paddingVertical: 8,
      marginHorizontal: 6,
      borderWidth: 1,
      borderColor: theme.border,
    },
    groupItemSelected: {
      backgroundColor: theme.primary + '20',
      borderColor: theme.primary,
    },
    groupText: {
      color: theme.text,
      fontWeight: '500',
    },
    groupTextSelected: {
      color: theme.primary,
      fontWeight: 'bold',
    },
    calendarContainer: {
      marginHorizontal: 16,
      marginBottom: 16,
      borderRadius: 12,
      overflow: 'hidden',
      backgroundColor: theme.card,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 2,
    },
    photosContainer: {
      flex: 1,
      paddingHorizontal: 16,
    },
    dateHeader: {
      fontSize: 18,
      fontWeight: 'bold',
      color: theme.text,
      marginBottom: 12,
    },
    noPhotosContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      padding: 20,
    },
    noPhotosText: {
      fontSize: 16,
      color: theme.inactive,
      textAlign: 'center',
      marginTop: 10,
    },
    addPhotoButton: {
      backgroundColor: theme.primary,
      paddingVertical: 12,
      paddingHorizontal: 20,
      borderRadius: 8,
      marginTop: 20,
      flexDirection: 'row',
      alignItems: 'center',
    },
    addPhotoButtonText: {
      color: 'white',
      fontWeight: 'bold',
      marginLeft: 8,
    },
    loader: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    scrollViewContent: {
      paddingBottom: 20,
    },
    noGroupsContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      padding: 20,
    },
    noGroupsText: {
      fontSize: 16,
      color: theme.inactive,
      textAlign: 'center',
      marginTop: 10,
    },
    createGroupButton: {
      backgroundColor: theme.primary,
      paddingVertical: 12,
      paddingHorizontal: 20,
      borderRadius: 8,
      marginTop: 20,
    },
    createGroupButtonText: {
      color: 'white',
      fontWeight: 'bold',
    },
    photoItem: {
      borderRadius: 12,
      margin: 4,
      overflow: 'hidden',
      backgroundColor: theme.border,
    },
    photoImage: {
      width: (width - 48) / 2, // 2 columns with padding
      height: (width - 48) / 2,
      resizeMode: 'cover',
    },
  });

  // Theme for calendar
  const calendarTheme = {
    backgroundColor: theme.card,
    calendarBackground: theme.card,
    textSectionTitleColor: theme.text,
    selectedDayBackgroundColor: theme.primary,
    selectedDayTextColor: '#ffffff',
    todayTextColor: theme.primary,
    dayTextColor: theme.text,
    textDisabledColor: theme.inactive,
    dotColor: theme.primary,
    selectedDotColor: '#ffffff',
    arrowColor: theme.primary,
    monthTextColor: theme.text,
    indicatorColor: theme.primary,
    textDayFontWeight: '300',
    textMonthFontWeight: 'bold',
    textDayHeaderFontWeight: '500',
    textDayFontSize: 14,
    textMonthFontSize: 16,
    textDayHeaderFontSize: 14
  };

  // Format date as readable string
  const formattedDate = new Date(selectedDate).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  if (loading && !refreshing) {
    return (
      <View style={[styles.container, styles.loader]}>
        <ActivityIndicator size="large" color={theme.primary} />
      </View>
    );
  }

  if (groups.length === 0) {
    return (
      <View style={[styles.container, styles.noGroupsContainer]}>
        <Ionicons name="calendar" size={60} color={theme.inactive} />
        <Text style={styles.noGroupsText}>
          You haven't joined any groups yet. Create or join a group to see photos in the calendar.
        </Text>
        <TouchableOpacity 
          style={styles.createGroupButton}
          onPress={() => navigation.navigate('CreateGroup')}
        >
          <Text style={styles.createGroupButtonText}>Create Group</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const photosForDate = getPhotosForSelectedDate();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Calendar</Text>
        <TouchableOpacity 
          style={styles.cameraButton}
          onPress={() => navigation.navigate('Camera', { groupId: selectedGroup?.id })}
        >
          <Ionicons name="camera" size={22} color="white" />
        </TouchableOpacity>
      </View>

      {/* Group selector */}
      <View style={styles.groupsContainer}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.groupList}
        >
          {groups.map(group => (
            <TouchableOpacity
              key={group.id}
              style={[
                styles.groupItem,
                selectedGroup?.id === group.id && styles.groupItemSelected
              ]}
              onPress={() => setSelectedGroup(group)}
            >
              <Text
                style={[
                  styles.groupText,
                  selectedGroup?.id === group.id && styles.groupTextSelected
                ]}
              >
                {group.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Calendar */}
      <View style={styles.calendarContainer}>
        <Calendar
          current={selectedDate}
          onDayPress={handleDateSelect}
          markingType='multi-dot'
          markedDates={markedDates}
          theme={calendarTheme}
          enableSwipeMonths={true}
        />
      </View>

      {/* Selected date info */}
      <View style={styles.dateInfoContainer}>
        <Text style={styles.dateInfoText}>{formattedDate}</Text>
      </View>
      
      {/* Photos for selected date */}
      <View style={styles.photosContainer}>
        {photosForDate.length > 0 ? (
          <FlatList
            data={photosForDate}
            renderItem={renderPhotoItem}
            keyExtractor={item => item.id}
            numColumns={2}
            contentContainerStyle={styles.scrollViewContent}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={[theme.primary]}
                tintColor={theme.primary}
              />
            }
          />
        ) : (
          <View style={styles.noPhotosContainer}>
            <Ionicons name="images-outline" size={60} color={theme.inactive} />
            <Text style={styles.noPhotosText}>
              No photos for this date. Take a photo to add to this day!
            </Text>
            <TouchableOpacity 
              style={styles.addPhotoButton}
              onPress={() => navigation.navigate('Camera', { groupId: selectedGroup.id })}
            >
              <Ionicons name="camera" size={20} color="white" />
              <Text style={styles.addPhotoButtonText}>Take Photo</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
};

export default CalendarScreen; 