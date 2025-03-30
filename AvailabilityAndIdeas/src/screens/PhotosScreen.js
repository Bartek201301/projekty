import React, { useState, useCallback } from 'react';
import { 
  StyleSheet, 
  View, 
  FlatList, 
  Image, 
  TouchableOpacity,
  Modal,
  Dimensions,
  Alert
} from 'react-native';
import { 
  Text, 
  FAB, 
  Card, 
  Button, 
  TextInput, 
  useTheme,
  IconButton,
  Chip
} from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';

// Sample photos for demonstration
const SAMPLE_PHOTOS = [
  {
    id: '1',
    title: 'Wycieczka w góry',
    date: '2025-03-15',
    imageUri: 'https://images.unsplash.com/photo-1454496522488-7a8e488e8606',
    likes: 12,
    createdBy: 'Anna K.',
    backgroundColor: '#7B2CBF',
  },
  {
    id: '2',
    title: 'Kolacja w restauracji',
    date: '2025-03-20',
    imageUri: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0',
    likes: 8,
    createdBy: 'Tomasz W.',
    backgroundColor: '#5A189A',
  },
  {
    id: '3',
    title: 'Koncert zespołu',
    date: '2025-03-25',
    imageUri: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3',
    likes: 15,
    createdBy: 'Martyna S.',
    backgroundColor: '#3C096C',
  },
  {
    id: '4',
    title: 'Piknik w parku',
    date: '2025-03-27',
    imageUri: 'https://images.unsplash.com/photo-1529333166437-7750a6dd5a70',
    likes: 10,
    createdBy: 'Jakub N.',
    backgroundColor: '#240046',
  },
];

const BACKGROUND_COLORS = [
  { name: 'Fioletowy', value: '#7B2CBF' },
  { name: 'Indygo', value: '#5A189A' },
  { name: 'Ciemny fiolet', value: '#3C096C' },
  { name: 'Bakłażan', value: '#240046' },
  { name: 'Granatowy', value: '#10002B' },
];

const windowWidth = Dimensions.get('window').width;

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

const PhotosScreen = () => {
  const theme = useTheme();
  const [photos, setPhotos] = useState(SAMPLE_PHOTOS);
  const [modalVisible, setModalVisible] = useState(false);
  const [photoDetailVisible, setPhotoDetailVisible] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [newPhotoTitle, setNewPhotoTitle] = useState('');
  const [newPhotoDate, setNewPhotoDate] = useState(new Date().toISOString().split('T')[0]);
  const [image, setImage] = useState(null);
  const [bgColor, setBgColor] = useState(BACKGROUND_COLORS[0].value);
  const [titleError, setTitleError] = useState('');
  const [dateError, setDateError] = useState('');
  
  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert(
        'Potrzebne uprawnienia',
        'Potrzebujemy dostępu do twojej galerii, aby wybrać zdjęcie',
        [{ text: 'OK' }]
      );
      return;
    }
    
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    
    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };
  
  const takePicture = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert(
        'Potrzebne uprawnienia',
        'Potrzebujemy dostępu do twojego aparatu, aby zrobić zdjęcie',
        [{ text: 'OK' }]
      );
      return;
    }
    
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    
    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };
  
  const validateForm = () => {
    let isValid = true;
    
    if (!newPhotoTitle.trim()) {
      setTitleError('Tytuł jest wymagany');
      isValid = false;
    } else {
      setTitleError('');
    }
    
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!newPhotoDate.trim()) {
      setDateError('Data jest wymagana');
      isValid = false;
    } else if (!dateRegex.test(newPhotoDate)) {
      setDateError('Niepoprawny format daty (RRRR-MM-DD)');
      isValid = false;
    } else {
      setDateError('');
    }
    
    if (!image) {
      Alert.alert('Brak zdjęcia', 'Wybierz lub zrób zdjęcie, aby kontynuować');
      isValid = false;
    }
    
    return isValid;
  };
  
  const handleAddPhoto = () => {
    if (!validateForm()) {
      return;
    }
    
    const newPhoto = {
      id: Date.now().toString(),
      title: newPhotoTitle,
      date: newPhotoDate,
      imageUri: image,
      likes: 0,
      createdBy: 'Bartosz M.', // This would come from authentication in a real app
      backgroundColor: bgColor,
    };
    
    setPhotos([newPhoto, ...photos]);
    setModalVisible(false);
    
    // Reset form
    setNewPhotoTitle('');
    setNewPhotoDate(new Date().toISOString().split('T')[0]);
    setImage(null);
    setBgColor(BACKGROUND_COLORS[0].value);
    setTitleError('');
    setDateError('');
  };
  
  const handlePhotoPress = (photo) => {
    setSelectedPhoto(photo);
    setPhotoDetailVisible(true);
  };
  
  const toggleLike = (photoId) => {
    setPhotos(
      photos.map(photo => {
        if (photo.id === photoId) {
          return {
            ...photo,
            likes: photo.likes + 1,
          };
        }
        return photo;
      })
    );
  };
  
  const handleAddButton = () => {
    setNewPhotoTitle('');
    setNewPhotoDate(new Date().toISOString().split('T')[0]);
    setImage(null);
    setBgColor(BACKGROUND_COLORS[0].value);
    setTitleError('');
    setDateError('');
    setModalVisible(true);
  };
  
  const renderPhoto = ({ item }) => {
    return (
      <Card
        style={[styles.photoCard, { backgroundColor: item.backgroundColor }]}
        onPress={() => handlePhotoPress(item)}
      >
        <View style={styles.photoContainer}>
          <Image
            source={{ uri: item.imageUri }}
            style={styles.photo}
            resizeMode="cover"
          />
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.8)']}
            style={styles.photoGradient}
          >
            <Text style={styles.photoTitle}>{item.title}</Text>
            <View style={styles.photoMeta}>
              <Text style={styles.photoDate}>
                {item.date.split('-').reverse().join('.')}
              </Text>
              <View style={styles.likeContainer}>
                <Text style={styles.likeCount}>{item.likes}</Text>
                <MaterialCommunityIcons name="heart" size={16} color="#FF4D94" />
              </View>
            </View>
          </LinearGradient>
        </View>
      </Card>
    );
  };
  
  return (
    <View style={styles.container}>
      <FlatList
        data={photos}
        renderItem={renderPhoto}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.photoList}
        numColumns={2}
      />
      
      <FAB
        style={styles.fab}
        icon="plus"
        color="#FFFFFF"
        onPress={handleAddButton}
      />
      
      {/* Add Photo Modal */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Dodaj nowe zdjęcie</Text>
            
            <TextInput
              label="Tytuł zdjęcia"
              value={newPhotoTitle}
              onChangeText={text => {
                setNewPhotoTitle(text);
                if (titleError) setTitleError('');
              }}
              mode="outlined"
              style={styles.input}
              error={!!titleError}
              theme={{ roundness: theme.roundness }}
            />
            {titleError ? <Text style={styles.errorText}>{titleError}</Text> : null}
            
            <TextInput
              label="Data (RRRR-MM-DD)"
              value={newPhotoDate}
              onChangeText={text => {
                setNewPhotoDate(text);
                if (dateError) setDateError('');
              }}
              mode="outlined"
              style={styles.input}
              error={!!dateError}
              theme={{ roundness: theme.roundness }}
            />
            {dateError ? <Text style={styles.errorText}>{dateError}</Text> : null}
            
            <Text style={styles.sectionTitle}>Tło zdjęcia</Text>
            <View style={styles.colorSelector}>
              {BACKGROUND_COLORS.map((color) => (
                <TouchableOpacity
                  key={color.value}
                  style={[
                    styles.colorOption,
                    { backgroundColor: color.value },
                    bgColor === color.value && styles.selectedColor,
                  ]}
                  onPress={() => setBgColor(color.value)}
                />
              ))}
            </View>
            
            <Text style={styles.sectionTitle}>Zdjęcie</Text>
            <View style={styles.imageSelector}>
              {image ? (
                <View style={styles.imagePreviewContainer}>
                  <Image source={{ uri: image }} style={styles.imagePreview} />
                  <IconButton
                    icon="close-circle"
                    size={28}
                    color="#FF4D4D"
                    style={styles.removeImageButton}
                    onPress={() => setImage(null)}
                  />
                </View>
              ) : (
                <View style={styles.imageActions}>
                  <Button
                    mode="outlined"
                    icon="camera"
                    onPress={takePicture}
                    style={styles.imageButton}
                  >
                    Zrób zdjęcie
                  </Button>
                  <Button
                    mode="outlined"
                    icon="image"
                    onPress={pickImage}
                    style={styles.imageButton}
                  >
                    Wybierz zdjęcie
                  </Button>
                </View>
              )}
            </View>
            
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
                onPress={handleAddPhoto}
                style={styles.saveButton}
              />
            </View>
          </View>
        </View>
      </Modal>
      
      {/* Photo Detail Modal */}
      <Modal
        visible={photoDetailVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setPhotoDetailVisible(false)}
      >
        {selectedPhoto && (
          <View style={styles.photoDetailOverlay}>
            <View style={styles.photoDetailHeader}>
              <IconButton
                icon="arrow-left"
                size={28}
                color="#FFFFFF"
                onPress={() => setPhotoDetailVisible(false)}
              />
              <Text style={styles.photoDetailTitle}>{selectedPhoto.title}</Text>
              <View style={{ width: 40 }} />
            </View>
            
            <Image
              source={{ uri: selectedPhoto.imageUri }}
              style={styles.photoDetailImage}
              resizeMode="contain"
            />
            
            <View style={styles.photoDetailFooter}>
              <View style={styles.photoDetailInfo}>
                <Chip icon="calendar" style={styles.chip}>
                  {selectedPhoto.date.split('-').reverse().join('.')}
                </Chip>
                <Chip icon="account" style={styles.chip}>
                  {selectedPhoto.createdBy}
                </Chip>
              </View>
              
              <TouchableOpacity
                style={styles.likeButton}
                onPress={() => {
                  toggleLike(selectedPhoto.id);
                  // Update selected photo likes count for UI
                  setSelectedPhoto({
                    ...selectedPhoto,
                    likes: selectedPhoto.likes + 1,
                  });
                }}
              >
                <MaterialCommunityIcons name="heart" size={24} color="#FF4D94" />
                <Text style={styles.likeButtonText}>{selectedPhoto.likes}</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  photoList: {
    padding: 10,
    paddingBottom: 80, // Space for FAB
  },
  photoCard: {
    flex: 1,
    margin: 5,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 4,
    height: 200,
  },
  photoContainer: {
    flex: 1,
    position: 'relative',
  },
  photo: {
    width: '100%',
    height: '100%',
  },
  photoGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
    padding: 12,
    justifyContent: 'flex-end',
  },
  photoTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  photoMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  photoDate: {
    color: '#DDDDDD',
    fontSize: 12,
  },
  likeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  likeCount: {
    color: '#FFFFFF',
    marginRight: 4,
    fontSize: 12,
  },
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    backgroundColor: '#9D4EDD',
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
    marginBottom: 5,
    backgroundColor: '#2E2E2E',
  },
  errorText: {
    color: '#FF4D4D',
    marginBottom: 15,
    marginLeft: 10,
    fontSize: 12,
  },
  sectionTitle: {
    color: '#FFFFFF',
    marginTop: 15,
    marginBottom: 10,
    fontSize: 16,
  },
  colorSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  colorOption: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  selectedColor: {
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  imageSelector: {
    marginBottom: 20,
  },
  imageActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  imageButton: {
    flex: 1,
    marginHorizontal: 5,
    borderColor: '#444444',
  },
  imagePreviewContainer: {
    position: 'relative',
    alignItems: 'center',
  },
  imagePreview: {
    width: '100%',
    height: 200,
    borderRadius: 8,
  },
  removeImageButton: {
    position: 'absolute',
    top: -10,
    right: -10,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
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
  photoDetailOverlay: {
    flex: 1,
    backgroundColor: '#121212',
  },
  photoDetailHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    paddingTop: 40,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  photoDetailTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    flex: 1,
  },
  photoDetailImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  photoDetailFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  photoDetailInfo: {
    flexDirection: 'row',
  },
  chip: {
    marginRight: 8,
    backgroundColor: '#2E2E2E',
  },
  likeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 77, 148, 0.2)',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  likeButtonText: {
    color: '#FFFFFF',
    marginLeft: 8,
    fontWeight: 'bold',
  },
});

export default PhotosScreen; 