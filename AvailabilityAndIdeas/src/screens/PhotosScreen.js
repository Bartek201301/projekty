import React, { useState } from 'react';
import { 
  View, 
  StyleSheet, 
  ScrollView, 
  FlatList, 
  Image, 
  TouchableOpacity, 
  Modal,
  Dimensions
} from 'react-native';
import { 
  Surface, 
  Text, 
  Title, 
  Button, 
  Card, 
  Avatar, 
  TextInput, 
  FAB,
  IconButton,
  Chip
} from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';

// Sample data
const DEMO_PHOTOS = [
  {
    id: '1',
    date: '2025-04-15',
    title: 'Piknik w parku',
    description: 'Wspólne biesiadowanie w Parku Łazienkowskim',
    images: [
      'https://images.unsplash.com/photo-1526139334526-f591a54b477c',
      'https://images.unsplash.com/photo-1506784926709-22f1ec395907'
    ],
    userId: '1',
    userName: 'Anna',
    userAvatar: 'https://randomuser.me/api/portraits/women/1.jpg',
    likes: 4,
    comments: [
      { id: '1', userId: '2', userName: 'Michał', text: 'Super zabawa!', avatar: 'https://randomuser.me/api/portraits/men/1.jpg' },
      { id: '2', userId: '3', userName: 'Kasia', text: 'Musimy to powtórzyć!', avatar: 'https://randomuser.me/api/portraits/women/2.jpg' }
    ]
  },
  {
    id: '2',
    date: '2025-04-20',
    title: 'Turniej planszówek',
    description: 'Wieczór z planszówkami u Tomka',
    images: [
      'https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09',
      'https://images.unsplash.com/photo-1606503153255-59d8b2e4739e',
      'https://images.unsplash.com/photo-1611371805429-12b67e257b78'
    ],
    userId: '4',
    userName: 'Tomek',
    userAvatar: 'https://randomuser.me/api/portraits/men/2.jpg',
    likes: 5,
    comments: [
      { id: '3', userId: '5', userName: 'Ola', text: 'Monopoly najlepsze!', avatar: 'https://randomuser.me/api/portraits/women/3.jpg' }
    ]
  },
  {
    id: '3',
    date: '2025-05-01',
    title: 'Majówka na działce',
    description: 'Grillowanie i relaks',
    images: [
      'https://images.unsplash.com/photo-1555066931-4365d14bab8c',
      'https://images.unsplash.com/photo-1602192509154-0b900ee1f851'
    ],
    userId: '2',
    userName: 'Michał',
    userAvatar: 'https://randomuser.me/api/portraits/men/1.jpg',
    likes: 3,
    comments: []
  }
];

const PhotosScreen = () => {
  const [photos, setPhotos] = useState(DEMO_PHOTOS);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [fullImageModal, setFullImageModal] = useState(false);
  const [fullImageUrl, setFullImageUrl] = useState('');
  const [comment, setComment] = useState('');
  const [addPhotoModalVisible, setAddPhotoModalVisible] = useState(false);
  const [newEventTitle, setNewEventTitle] = useState('');
  const [newEventDescription, setNewEventDescription] = useState('');
  const [newEventDate, setNewEventDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedImages, setSelectedImages] = useState([]);

  const currentUserId = '1'; // This would come from authentication in a real app

  const openPhotoDetails = (photo) => {
    setSelectedPhoto(photo);
    setModalVisible(true);
  };

  const closePhotoDetails = () => {
    setModalVisible(false);
    setSelectedPhoto(null);
  };

  const viewFullImage = (url) => {
    setFullImageUrl(url);
    setFullImageModal(true);
  };

  const closeFullImage = () => {
    setFullImageModal(false);
    setFullImageUrl('');
  };

  const addComment = () => {
    if (!comment.trim()) return;
    
    const newComment = {
      id: Date.now().toString(),
      userId: currentUserId,
      userName: 'Anna', // This would be the current user's name in a real app
      text: comment,
      avatar: 'https://randomuser.me/api/portraits/women/1.jpg', // Current user's avatar
    };
    
    const updatedPhoto = {
      ...selectedPhoto,
      comments: [...selectedPhoto.comments, newComment]
    };
    
    const updatedPhotos = photos.map(p => 
      p.id === selectedPhoto.id ? updatedPhoto : p
    );
    
    setPhotos(updatedPhotos);
    setSelectedPhoto(updatedPhoto);
    setComment('');
  };

  const toggleLike = (photo) => {
    const updatedPhoto = {
      ...photo,
      likes: photo.likes + 1,
      // In a real app, we would track which users have liked the photo
    };
    
    const updatedPhotos = photos.map(p => 
      p.id === photo.id ? updatedPhoto : p
    );
    
    setPhotos(updatedPhotos);
    if (selectedPhoto && selectedPhoto.id === photo.id) {
      setSelectedPhoto(updatedPhoto);
    }
  };

  const pickImages = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (permissionResult.granted === false) {
      alert("Wymagane jest pozwolenie na dostęp do galerii zdjęć!");
      return;
    }
    
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      selectionLimit: 5,
      quality: 0.5,
    });
    
    if (!result.canceled) {
      setSelectedImages(result.assets.map(asset => asset.uri));
    }
  };

  const addNewPhotoEvent = () => {
    if (!newEventTitle.trim() || selectedImages.length === 0) {
      alert("Tytuł i przynajmniej jedno zdjęcie są wymagane!");
      return;
    }
    
    const newPhoto = {
      id: Date.now().toString(),
      date: newEventDate,
      title: newEventTitle,
      description: newEventDescription,
      images: selectedImages,
      userId: currentUserId,
      userName: 'Anna', // This would be the current user's name in a real app
      userAvatar: 'https://randomuser.me/api/portraits/women/1.jpg', // Current user's avatar
      likes: 0,
      comments: []
    };
    
    setPhotos([newPhoto, ...photos]);
    setAddPhotoModalVisible(false);
    resetNewPhotoForm();
  };

  const resetNewPhotoForm = () => {
    setNewEventTitle('');
    setNewEventDescription('');
    setNewEventDate(new Date().toISOString().split('T')[0]);
    setSelectedImages([]);
  };

  const removeSelectedImage = (index) => {
    setSelectedImages(selectedImages.filter((_, i) => i !== index));
  };

  const renderPhotoItem = ({ item }) => (
    <Card style={styles.photoCard}>
      <Card.Title
        title={item.title}
        subtitle={`${new Date(item.date).toLocaleDateString('pl-PL')} • ${item.userName}`}
        left={(props) => <Avatar.Image {...props} source={{ uri: item.userAvatar }} />}
      />
      
      <Card.Content>
        {item.description ? <Text style={styles.description}>{item.description}</Text> : null}
      </Card.Content>
      
      <View style={styles.imageGrid}>
        {item.images.slice(0, 3).map((image, index) => (
          <TouchableOpacity 
            key={`${item.id}-image-${index}`} 
            style={[
              styles.imageContainer, 
              item.images.length === 1 && styles.singleImageContainer
            ]}
            onPress={() => viewFullImage(image)}
          >
            <Image 
              source={{ uri: image }} 
              style={styles.image} 
              resizeMode="cover"
            />
            {index === 2 && item.images.length > 3 && (
              <View style={styles.moreImagesOverlay}>
                <Text style={styles.moreImagesText}>+{item.images.length - 3}</Text>
              </View>
            )}
          </TouchableOpacity>
        ))}
      </View>
      
      <Card.Actions style={styles.cardActions}>
        <Button 
          icon="thumb-up" 
          onPress={() => toggleLike(item)}
          style={styles.actionButton}
        >
          {item.likes}
        </Button>
        <Button 
          icon="comment" 
          onPress={() => openPhotoDetails(item)}
          style={styles.actionButton}
        >
          {item.comments.length}
        </Button>
        <View style={styles.spacer} />
        <Button 
          icon="dots-horizontal" 
          onPress={() => openPhotoDetails(item)}
        />
      </Card.Actions>
    </Card>
  );

  // Photo details modal
  const renderPhotoDetailsModal = () => (
    <Modal
      animationType="slide"
      transparent={false}
      visible={modalVisible}
      onRequestClose={closePhotoDetails}
    >
      {selectedPhoto && (
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <IconButton 
              icon="arrow-left" 
              size={24} 
              onPress={closePhotoDetails} 
            />
            <Title style={styles.modalTitle}>{selectedPhoto.title}</Title>
            <View style={styles.modalSpacer} />
          </View>
          
          <ScrollView>
            <View style={styles.modalContent}>
              <View style={styles.modalUserInfo}>
                <Avatar.Image 
                  source={{ uri: selectedPhoto.userAvatar }} 
                  size={40} 
                />
                <View style={styles.userTextContainer}>
                  <Text style={styles.userName}>{selectedPhoto.userName}</Text>
                  <Text style={styles.dateText}>
                    {new Date(selectedPhoto.date).toLocaleDateString('pl-PL')}
                  </Text>
                </View>
              </View>
              
              {selectedPhoto.description ? (
                <Text style={styles.modalDescription}>{selectedPhoto.description}</Text>
              ) : null}
              
              <View style={styles.modalImageContainer}>
                {selectedPhoto.images.map((image, index) => (
                  <TouchableOpacity 
                    key={`detail-image-${index}`} 
                    style={styles.modalImage}
                    onPress={() => viewFullImage(image)}
                  >
                    <Image 
                      source={{ uri: image }} 
                      style={styles.fullWidthImage} 
                      resizeMode="cover"
                    />
                  </TouchableOpacity>
                ))}
              </View>
              
              <View style={styles.actionsContainer}>
                <Button 
                  icon="thumb-up" 
                  mode="outlined" 
                  onPress={() => toggleLike(selectedPhoto)}
                  style={styles.likeButton}
                >
                  {selectedPhoto.likes} Polubień
                </Button>
              </View>
              
              <View style={styles.commentsContainer}>
                <Title style={styles.commentsTitle}>Komentarze ({selectedPhoto.comments.length})</Title>
                
                {selectedPhoto.comments.map(comment => (
                  <View key={comment.id} style={styles.commentItem}>
                    <Avatar.Image 
                      source={{ uri: comment.avatar }} 
                      size={36} 
                      style={styles.commentAvatar}
                    />
                    <View style={styles.commentContent}>
                      <Text style={styles.commentUserName}>{comment.userName}</Text>
                      <Text>{comment.text}</Text>
                    </View>
                  </View>
                ))}
                
                {selectedPhoto.comments.length === 0 && (
                  <Text style={styles.noCommentsText}>
                    Bądź pierwszy, który skomentuje to zdjęcie
                  </Text>
                )}
                
                <View style={styles.addCommentContainer}>
                  <Avatar.Image 
                    source={{ uri: 'https://randomuser.me/api/portraits/women/1.jpg' }} 
                    size={36} 
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
              </View>
            </View>
          </ScrollView>
        </View>
      )}
    </Modal>
  );

  // Full image modal
  const renderFullImageModal = () => (
    <Modal
      animationType="fade"
      transparent={true}
      visible={fullImageModal}
      onRequestClose={closeFullImage}
    >
      <TouchableOpacity 
        style={styles.fullImageContainer} 
        activeOpacity={1} 
        onPress={closeFullImage}
      >
        <Image 
          source={{ uri: fullImageUrl }} 
          style={styles.fullScreenImage} 
          resizeMode="contain"
        />
        <IconButton 
          icon="close" 
          color="#fff" 
          size={30} 
          style={styles.closeButton} 
          onPress={closeFullImage} 
        />
      </TouchableOpacity>
    </Modal>
  );

  // Add new photo modal
  const renderAddPhotoModal = () => (
    <Modal
      animationType="slide"
      transparent={false}
      visible={addPhotoModalVisible}
      onRequestClose={() => setAddPhotoModalVisible(false)}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <IconButton 
            icon="close" 
            size={24} 
            onPress={() => {
              setAddPhotoModalVisible(false);
              resetNewPhotoForm();
            }} 
          />
          <Title style={styles.modalTitle}>Dodaj nowe zdjęcia</Title>
          <IconButton 
            icon="check" 
            size={24} 
            onPress={addNewPhotoEvent}
            disabled={!newEventTitle.trim() || selectedImages.length === 0} 
          />
        </View>
        
        <ScrollView style={styles.addPhotoContent}>
          <TextInput
            label="Tytuł wydarzenia *"
            value={newEventTitle}
            onChangeText={setNewEventTitle}
            mode="outlined"
            style={styles.input}
          />
          
          <TextInput
            label="Opis (opcjonalnie)"
            value={newEventDescription}
            onChangeText={setNewEventDescription}
            mode="outlined"
            multiline
            numberOfLines={3}
            style={styles.input}
          />
          
          <TextInput
            label="Data"
            value={newEventDate}
            onChangeText={setNewEventDate}
            mode="outlined"
            style={styles.input}
            right={<TextInput.Icon icon="calendar" />}
          />
          
          <Button 
            mode="contained" 
            icon="image-multiple" 
            onPress={pickImages}
            style={styles.uploadButton}
          >
            Wybierz zdjęcia
          </Button>
          
          {selectedImages.length > 0 && (
            <View style={styles.selectedImagesContainer}>
              <Title style={styles.selectedImagesTitle}>
                Wybrane zdjęcia ({selectedImages.length})
              </Title>
              <View style={styles.selectedImagesGrid}>
                {selectedImages.map((uri, index) => (
                  <View key={index} style={styles.selectedImageContainer}>
                    <Image source={{ uri }} style={styles.selectedImage} />
                    <IconButton
                      icon="close-circle"
                      color="#fff"
                      size={20}
                      style={styles.removeImageButton}
                      onPress={() => removeSelectedImage(index)}
                    />
                  </View>
                ))}
              </View>
            </View>
          )}
        </ScrollView>
      </View>
    </Modal>
  );

  return (
    <View style={styles.container}>
      <Surface style={styles.header}>
        <Title style={styles.headerTitle}>Zdjęcia z wydarzeń</Title>
        <Text style={styles.headerSubtitle}>
          Przeglądaj zdjęcia z wspólnych spotkań i dodaj własne
        </Text>
      </Surface>
      
      <FlatList
        data={photos}
        renderItem={renderPhotoItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
      />
      
      <FAB
        style={styles.fab}
        icon="camera"
        onPress={() => setAddPhotoModalVisible(true)}
        label="Dodaj zdjęcia"
      />
      
      {renderPhotoDetailsModal()}
      {renderFullImageModal()}
      {renderAddPhotoModal()}
    </View>
  );
};

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f6f6f6',
  },
  header: {
    padding: 15,
    paddingTop: 0,
    backgroundColor: 'transparent',
    elevation: 0,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  headerSubtitle: {
    color: '#666',
  },
  listContainer: {
    padding: 10,
    paddingTop: 0,
  },
  photoCard: {
    marginBottom: 16,
    borderRadius: 10,
    overflow: 'hidden',
    elevation: 2,
  },
  description: {
    marginBottom: 12,
  },
  imageGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
  },
  imageContainer: {
    width: '33.33%',
    aspectRatio: 1,
    padding: 1,
  },
  singleImageContainer: {
    width: '100%',
    aspectRatio: 2,
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 2,
  },
  moreImagesOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  moreImagesText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  cardActions: {
    justifyContent: 'flex-start',
    paddingHorizontal: 8,
  },
  actionButton: {
    marginRight: 5,
  },
  spacer: {
    flex: 1,
  },
  // Modal styles
  modalContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  modalTitle: {
    flex: 1,
    marginLeft: 10,
    fontSize: 18,
  },
  modalSpacer: {
    width: 40,
  },
  modalContent: {
    padding: 15,
  },
  modalUserInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  userTextContainer: {
    marginLeft: 10,
  },
  userName: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  dateText: {
    color: '#666',
    fontSize: 12,
  },
  modalDescription: {
    marginBottom: 15,
    fontSize: 16,
  },
  modalImageContainer: {
    marginBottom: 15,
  },
  modalImage: {
    width: '100%',
    marginBottom: 5,
  },
  fullWidthImage: {
    width: '100%',
    aspectRatio: 16/9,
    borderRadius: 5,
  },
  actionsContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  likeButton: {
    flex: 1,
  },
  commentsContainer: {
    marginTop: 10,
  },
  commentsTitle: {
    fontSize: 18,
    marginBottom: 15,
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
  commentUserName: {
    fontWeight: 'bold',
    marginBottom: 3,
  },
  noCommentsText: {
    color: '#666',
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  addCommentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 15,
  },
  commentInput: {
    flex: 1,
    backgroundColor: '#f7f7f7',
    borderRadius: 20,
    height: 40,
  },
  // Full image modal styles
  fullImageContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullScreenImage: {
    width: '100%',
    height: '80%',
  },
  closeButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  // Add photo modal styles
  addPhotoContent: {
    padding: 15,
  },
  input: {
    marginBottom: 15,
  },
  uploadButton: {
    marginVertical: 20,
  },
  selectedImagesContainer: {
    marginTop: 10,
    marginBottom: 30,
  },
  selectedImagesTitle: {
    fontSize: 16,
    marginBottom: 10,
  },
  selectedImagesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  selectedImageContainer: {
    width: width / 3 - 14,
    height: width / 3 - 14,
    margin: 4,
    borderRadius: 5,
    overflow: 'hidden',
  },
  selectedImage: {
    width: '100%',
    height: '100%',
  },
  removeImageButton: {
    position: 'absolute',
    top: -5,
    right: -5,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: '#6200ee',
  },
});

export default PhotosScreen; 