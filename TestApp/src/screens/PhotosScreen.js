import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  ScrollView, 
  TouchableOpacity, 
  Image, 
  Modal,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  FlatList
} from 'react-native';
import { 
  Text, 
  Card, 
  Title, 
  Button, 
  TextInput,
  IconButton,
  useTheme
} from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as ImagePicker from 'expo-image-picker';
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

// Sample photos data
const samplePhotos = [
  {
    id: '1',
    title: 'Spotkanie integracyjne',
    date: '2023-05-10',
    imageUrl: 'https://picsum.photos/seed/picsum1/800/600',
    color: '#7209B7',
    likes: 12
  },
  {
    id: '2',
    title: 'Warsztaty projektowe',
    date: '2023-05-15',
    imageUrl: 'https://picsum.photos/seed/picsum2/800/600',
    color: '#4361EE',
    likes: 8
  },
  {
    id: '3',
    title: 'Urodziny Marka',
    date: '2023-05-20',
    imageUrl: 'https://picsum.photos/seed/picsum3/800/600',
    color: '#F72585',
    likes: 15
  },
  {
    id: '4',
    title: 'Wycieczka firmowa',
    date: '2023-05-25',
    imageUrl: 'https://picsum.photos/seed/picsum4/800/600',
    color: '#4CC9F0',
    likes: 10
  }
];

// Available gradient colors for new photos
const gradientColors = [
  '#7209B7',
  '#4361EE',
  '#F72585',
  '#4CC9F0',
  '#560BAD',
  '#3A0CA3',
  '#B5179E'
];

const PhotosScreen = () => {
  const [photos, setPhotos] = useState(samplePhotos);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [newPhoto, setNewPhoto] = useState({
    title: '',
    date: new Date(),
    imageUrl: null,
    color: gradientColors[0],
    likes: 0
  });
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [titleError, setTitleError] = useState('');
  const [dateError, setDateError] = useState('');
  const [imageError, setImageError] = useState('');
  
  const theme = useTheme();

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

  const validateImage = (image) => {
    if (!image) {
      setImageError('Zdjęcie jest wymagane');
      return false;
    }
    setImageError('');
    return true;
  };

  const onDateChange = (_, selectedDate) => {
    const currentDate = selectedDate || newPhoto.date;
    setShowDatePicker(false);
    setNewPhoto({ ...newPhoto, date: currentDate });
    validateDate(currentDate);
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setNewPhoto({ ...newPhoto, imageUrl: result.uri });
      setImageError('');
    }
  };

  const handleAddPhoto = () => {
    const isValidTitle = validateTitle(newPhoto.title);
    const isValidDate = validateDate(newPhoto.date);
    const isValidImage = validateImage(newPhoto.imageUrl);
    
    if (isValidTitle && isValidDate && isValidImage) {
      const formattedDate = newPhoto.date.toISOString().split('T')[0];
      
      const newPhotoObj = {
        id: (photos.length + 1).toString(),
        title: newPhoto.title,
        date: formattedDate,
        imageUrl: newPhoto.imageUrl,
        color: newPhoto.color,
        likes: 0
      };
      
      setPhotos([newPhotoObj, ...photos]);
      setAddModalVisible(false);
      setNewPhoto({
        title: '',
        date: new Date(),
        imageUrl: null,
        color: gradientColors[0],
        likes: 0
      });
    }
  };

  const handleLike = (id) => {
    setPhotos(photos.map(photo => 
      photo.id === id ? { ...photo, likes: photo.likes + 1 } : photo
    ));
    
    if (selectedPhoto && selectedPhoto.id === id) {
      setSelectedPhoto({ ...selectedPhoto, likes: selectedPhoto.likes + 1 });
    }
  };

  const renderPhotoItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => {
        setSelectedPhoto(item);
        setModalVisible(true);
      }}
      style={styles.photoItem}
    >
      <Card style={styles.photoCard}>
        <LinearGradient
          colors={[item.color, 'rgba(0,0,0,0.8)']}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={styles.photoGradient}
        >
          <Image
            source={{ uri: item.imageUrl }}
            style={styles.photoImage}
          />
          <View style={styles.photoInfo}>
            <Title style={styles.photoTitle}>{item.title}</Title>
            <Text style={styles.photoDate}>{item.date}</Text>
            <View style={styles.photoLikes}>
              <IconButton
                icon="heart"
                size={20}
                color="#FFFFFF"
                onPress={() => handleLike(item.id)}
                style={styles.likeButton}
              />
              <Text style={styles.likesCount}>{item.likes}</Text>
            </View>
          </View>
        </LinearGradient>
      </Card>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Zdjęcia</Text>
        <Button
          icon="plus"
          mode="contained"
          style={styles.addButton}
          onPress={() => setAddModalVisible(true)}
        >
          Dodaj
        </Button>
      </View>
      
      <FlatList
        data={photos}
        renderItem={renderPhotoItem}
        keyExtractor={item => item.id}
        numColumns={2}
        columnWrapperStyle={styles.photoList}
        contentContainerStyle={styles.photoListContainer}
      />
      
      {/* Photo Detail Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <ScrollView style={styles.modalContent}>
            {selectedPhoto && (
              <>
                <Image
                  source={{ uri: selectedPhoto.imageUrl }}
                  style={styles.modalImage}
                />
                <View style={styles.modalInfo}>
                  <Title style={styles.modalTitle}>{selectedPhoto.title}</Title>
                  <Text style={styles.modalDate}>{selectedPhoto.date}</Text>
                  
                  <View style={styles.likeContainer}>
                    <TouchableOpacity 
                      style={styles.modalLikeButton}
                      onPress={() => handleLike(selectedPhoto.id)}
                    >
                      <IconButton
                        icon="heart"
                        size={24}
                        color="#F72585"
                      />
                      <Text style={styles.modalLikesCount}>{selectedPhoto.likes} polubień</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </>
            )}
            
            <Button
              mode="outlined"
              onPress={() => setModalVisible(false)}
              style={styles.closeButton}
            >
              Zamknij
            </Button>
          </ScrollView>
        </View>
      </Modal>
      
      {/* Add Photo Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={addModalVisible}
        onRequestClose={() => setAddModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.modalContainer}
          >
            <View style={styles.addModalContent}>
              <Text style={styles.modalTitle}>Dodaj nowe zdjęcie</Text>
              
              <TextInput
                label="Tytuł"
                value={newPhoto.title}
                onChangeText={text => {
                  setNewPhoto({ ...newPhoto, title: text });
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
                  {newPhoto.date.toLocaleDateString()}
                </Text>
              </TouchableOpacity>
              {dateError ? <Text style={styles.errorText}>{dateError}</Text> : null}
              
              {showDatePicker && (
                <DateTimePicker
                  value={newPhoto.date}
                  mode="date"
                  display="default"
                  onChange={onDateChange}
                />
              )}
              
              <View style={styles.imageSection}>
                <Text style={styles.sectionTitle}>Wybierz zdjęcie:</Text>
                <TouchableOpacity
                  style={styles.imagePicker}
                  onPress={pickImage}
                >
                  {newPhoto.imageUrl ? (
                    <Image 
                      source={{ uri: newPhoto.imageUrl }} 
                      style={styles.previewImage} 
                    />
                  ) : (
                    <View style={styles.imagePickerPlaceholder}>
                      <IconButton
                        icon="camera"
                        size={30}
                        color="#AAAAAA"
                      />
                      <Text style={styles.imagePickerText}>Wybierz zdjęcie</Text>
                    </View>
                  )}
                </TouchableOpacity>
                {imageError ? <Text style={styles.errorText}>{imageError}</Text> : null}
              </View>
              
              <View style={styles.colorSection}>
                <Text style={styles.sectionTitle}>Kolor tła:</Text>
                <View style={styles.colorOptions}>
                  {gradientColors.map((color, index) => (
                    <TouchableOpacity
                      key={index}
                      style={[
                        styles.colorOption,
                        { backgroundColor: color },
                        newPhoto.color === color && styles.selectedColorOption
                      ]}
                      onPress={() => setNewPhoto({ ...newPhoto, color: color })}
                    />
                  ))}
                </View>
              </View>
              
              <View style={styles.modalButtons}>
                <Button 
                  mode="outlined"
                  onPress={() => setAddModalVisible(false)}
                  style={styles.cancelButton}
                >
                  Anuluj
                </Button>
                <GradientButton
                  title="DODAJ"
                  onPress={handleAddPhoto}
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#2C2C2C',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  addButton: {
    backgroundColor: '#9D4EDD',
  },
  photoListContainer: {
    padding: 8,
  },
  photoList: {
    justifyContent: 'space-between',
    paddingHorizontal: 8,
  },
  photoItem: {
    width: '48%',
    marginVertical: 8,
  },
  photoCard: {
    height: 200,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: 'transparent',
    elevation: 4,
  },
  photoGradient: {
    height: '100%',
    justifyContent: 'flex-end',
  },
  photoImage: {
    ...StyleSheet.absoluteFillObject,
    resizeMode: 'cover',
  },
  photoInfo: {
    padding: 12,
  },
  photoTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    marginBottom: 4,
  },
  photoDate: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 12,
    marginBottom: 8,
  },
  photoLikes: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  likeButton: {
    margin: 0,
    padding: 0,
  },
  likesCount: {
    color: '#FFFFFF',
    fontSize: 14,
    marginLeft: 4,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  modalImage: {
    width: '100%',
    height: 300,
    borderRadius: 12,
    marginBottom: 20,
  },
  modalInfo: {
    padding: 20,
    backgroundColor: '#1E1E1E',
    borderRadius: 12,
    marginBottom: 20,
  },
  modalTitle: {
    color: '#FFFFFF',
    fontSize: 24,
    marginBottom: 10,
  },
  modalDate: {
    color: '#AAAAAA',
    fontSize: 16,
    marginBottom: 20,
  },
  likeContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
  },
  modalLikeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: 'rgba(247, 37, 133, 0.1)',
    borderRadius: 30,
  },
  modalLikesCount: {
    color: '#FFFFFF',
    fontSize: 16,
    marginRight: 10,
  },
  closeButton: {
    marginTop: 20,
    borderColor: '#9D4EDD',
  },
  addModalContent: {
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
  imageSection: {
    marginBottom: 16,
  },
  sectionTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    marginBottom: 8,
  },
  imagePicker: {
    height: 150,
    borderWidth: 1,
    borderColor: '#2C2C2C',
    borderRadius: 8,
    marginBottom: 8,
    overflow: 'hidden',
  },
  imagePickerPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#2C2C2C',
  },
  imagePickerText: {
    color: '#AAAAAA',
    marginTop: 8,
  },
  previewImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  colorSection: {
    marginBottom: 20,
  },
  colorOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 10,
  },
  colorOption: {
    width: 40,
    height: 40,
    borderRadius: 20,
    margin: 5,
  },
  selectedColorOption: {
    borderWidth: 3,
    borderColor: '#FFFFFF',
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

export default PhotosScreen; 