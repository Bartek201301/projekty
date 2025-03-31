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
  Image,
  StatusBar,
  Platform,
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
  const [error, setError] = useState(null);
  
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
      setError(null);
      
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
      setError('Nie można załadować grup. Spróbuj ponownie później.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const fetchPhotos = async () => {
    try {
      setLoading(true);
      setError(null);
      
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
            name: userData.displayName || 'Nieznany użytkownik',
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
          // If we already have a photo for this date, increase count
          dates[dateStr].dots = [{ color: theme.primary }];
          if (!dates[dateStr].imageUrl) {
            dates[dateStr].imageUrl = photo.imageUrl;
          }
        } else {
          dates[dateStr] = {
            dots: [{ color: theme.primary }],
            selected: dateStr === selectedDate,
            selectedColor: theme.accent + '30',
            imageUrl: photo.imageUrl
          };
        }
      });
      
      dates[selectedDate] = {
        ...(dates[selectedDate] || {}),
        selected: true,
        selectedColor: theme.accent + '30'
      };
      
      setMarkedDates(dates);
    } catch (error) {
      console.error('Error fetching photos:', error);
      setError('Nie można załadować zdjęć. Spróbuj ponownie później.');
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
        selectedColor: theme.accent + '30'
      }
    }));
  };

  const getPhotosForSelectedDate = () => {
    return photos.filter(photo => {
      const photoDate = new Date(photo.date).toISOString().split('T')[0];
      return photoDate === selectedDate;
    });
  };

  // Custom day component to display photo thumbnails on calendar
  const renderDay = (day, item) => {
    if (!item || !day.dateString) {
      return (<View style={styles.emptyDay}></View>);
    }

    const isPastDate = new Date(day.dateString) <= new Date();
    const hasImage = item.imageUrl ? true : false;

    return (
      <View style={styles.dayContainer}>
        <Text style={styles.dayText}>{day.day}</Text>
        {hasImage && isPastDate && (
          <Image
            source={{ uri: item.imageUrl }}
            style={styles.dayImage}
          />
        )}
      </View>
    );
  };

  const renderPhotoItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.photoItem}
      onPress={() => navigation.navigate('PhotoDetail', { photo: item })}
    >
      <Image 
        source={{ uri: item.imageUrl }} 
        style={styles.photoImage}
        resizeMode="cover"
      />
    </TouchableOpacity>
  );

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
      paddingTop: Platform.OS === 'ios' ? 50 : StatusBar.currentHeight,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 16,
      paddingVertical: 16,
    },
    headerTitle: {
      fontSize: 28,
      fontWeight: 'bold',
      color: theme.text,
    },
    addButton: {
      width: 32,
      height: 32,
      borderRadius: 16,
      alignItems: 'center',
      justifyContent: 'center',
    },
    calendarContainer: {
      backgroundColor: theme.background,
      borderBottomWidth: 1,
      borderBottomColor: theme.border,
      paddingBottom: 10,
    },
    error: {
      textAlign: 'center',
      padding: 20,
      color: theme.error,
    },
    groupSelector: {
      marginBottom: 15,
    },
    groupSelectorText: {
      fontSize: 16,
      color: theme.secondaryText,
      marginLeft: 16,
      marginBottom: 8,
    },
    groupsContainer: {
      paddingHorizontal: 12,
    },
    groupList: {
      flexDirection: 'row',
    },
    groupItem: {
      marginHorizontal: 4,
      paddingVertical: 8,
      paddingHorizontal: 16,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: theme.border,
      backgroundColor: theme.card,
    },
    groupItemSelected: {
      backgroundColor: theme.accent,
      borderColor: theme.accent,
    },
    groupText: {
      color: theme.text,
      fontWeight: '500',
    },
    groupTextSelected: {
      color: '#FFFFFF',
      fontWeight: 'bold',
    },
    photosContainer: {
      flex: 1,
      padding: 8,
    },
    photoListContainer: {
      padding: 2,
    },
    photoItem: {
      width: (width - 32) / 2,
      height: (width - 32) / 2,
      margin: 4,
      borderRadius: 8,
      overflow: 'hidden',
    },
    photoImage: {
      width: '100%',
      height: '100%',
    },
    emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
    },
    emptyText: {
      fontSize: 16,
      color: theme.secondaryText,
      textAlign: 'center',
      marginBottom: 20,
    },
    loader: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    dayContainer: {
      width: 46,
      height: 46,
      justifyContent: 'center',
      alignItems: 'center',
    },
    dayText: {
      color: theme.text,
      fontSize: 16,
      position: 'absolute',
      zIndex: 10,
    },
    dayImage: {
      width: 40,
      height: 40,
      borderRadius: 20,
      opacity: 0.7,
    },
    emptyDay: {
      width: 46,
      height: 46,
    },
    dateTextContainer: {
      alignItems: 'center',
      marginVertical: 15,
    },
    dateText: {
      fontSize: 16,
      color: theme.text,
      fontWeight: '500',
    },
    largePhotoContainer: {
      marginBottom: 15,
    },
    largePhoto: {
      width: width - 32,
      height: (width - 32) * 1.2,
      borderRadius: 12,
      marginHorizontal: 16,
    },
  });

  // Function to format the date for display
  const formatDate = (dateString) => {
    const options = { month: 'long', year: 'numeric' };
    const date = new Date(dateString);
    return date.toLocaleDateString('pl-PL', options);
  };

  if (loading && !refreshing) {
    return (
      <View style={[styles.container, styles.loader]}>
        <ActivityIndicator size="large" color={theme.primary} />
      </View>
    );
  }

  const selectedPhotos = getPhotosForSelectedDate();

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Header with Group Name */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>
          {selectedGroup?.name || 'Kalendarz'}
        </Text>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => navigation.navigate('CreateGroup')}
        >
          <Ionicons name="add" size={28} color={theme.text} />
        </TouchableOpacity>
      </View>
      
      {error ? (
        <Text style={styles.error}>{error}</Text>
      ) : (
        <FlatList
          data={selectedPhotos}
          renderItem={renderPhotoItem}
          keyExtractor={item => item.id}
          numColumns={2}
          contentContainerStyle={styles.photoListContainer}
          columnWrapperStyle={{ justifyContent: 'flex-start' }}
          ListHeaderComponent={
            <>
              {/* Calendar */}
              <View style={styles.calendarContainer}>
                <Calendar
                  current={selectedDate}
                  onDayPress={handleDateSelect}
                  markedDates={markedDates}
                  markingType={'custom'}
                  dayComponent={({date, state, marking}) => 
                    renderDay(date, marking)
                  }
                  theme={{
                    calendarBackground: theme.background,
                    textSectionTitleColor: theme.secondaryText,
                    monthTextColor: theme.text,
                    textMonthFontWeight: 'bold',
                    textMonthFontSize: 18,
                    textDayHeaderFontSize: 13,
                    textDayHeaderFontWeight: '600',
                    arrowColor: theme.text,
                  }}
                />
              </View>
              
              {/* Group Selector */}
              <View style={styles.groupSelector}>
                <Text style={styles.groupSelectorText}>Moje grupy:</Text>
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
              </View>
              
              {/* Selected Date Display */}
              <View style={styles.dateTextContainer}>
                <Text style={styles.dateText}>
                  {formatDate(selectedDate)}
                </Text>
              </View>
              
              {/* Large Photos Display */}
              {selectedPhotos.length === 0 ? (
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyText}>
                    Brak zdjęć dla wybranej daty.
                  </Text>
                </View>
              ) : null}
            </>
          }
          ListEmptyComponent={
            !loading && (
              <View style={styles.emptyContainer}>
                <Ionicons 
                  name="images-outline" 
                  size={60} 
                  color={theme.inactive} 
                />
                <Text style={styles.emptyText}>
                  Brak zdjęć dla wybranej daty.
                </Text>
              </View>
            )
          }
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={theme.text}
            />
          }
        />
      )}
    </View>
  );
};

export default CalendarScreen; 