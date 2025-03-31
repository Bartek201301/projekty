import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useTheme } from '../../contexts/ThemeContext';
import { USE_MOCK_FIREBASE } from '../../services/firebaseConfig';

const PhotoEditorScreen = () => {
  const [photo, setPhoto] = useState(null);
  const [caption, setCaption] = useState('');
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const route = useRoute();
  const { uri, groupId } = route.params || {};
  const { theme } = useTheme();
  const navigation = useNavigation();

  useEffect(() => {
    if (uri) {
      setPhoto(uri);
    }
  }, [uri]);

  // Funkcja do zapisywania zdjęcia
  const savePhoto = () => {
    if (!photo) {
      Alert.alert('Error', 'No photo available to save');
      return;
    }

    setLoading(true);

    // Symulujemy upload w trybie demo
    if (USE_MOCK_FIREBASE) {
      const interval = setInterval(() => {
        setUploadProgress(prev => {
          const newProgress = prev + 0.1;
          if (newProgress >= 1) {
            clearInterval(interval);
            setTimeout(() => {
              Alert.alert(
                'Success',
                'Photo uploaded successfully!',
                [
                  {
                    text: 'OK',
                    onPress: () => navigation.navigate('GroupDetail', { group: { id: groupId } })
                  }
                ]
              );
              setLoading(false);
            }, 500);
            return 1;
          }
          return newProgress;
        });
      }, 200);
    } else {
      // W prawdziwym Firebase trzeba by zapisać zdjęcie do Storage i dodać wpis w Firestore
      setTimeout(() => {
        Alert.alert('Demo Mode', 'This would upload the photo to Firebase');
        setLoading(false);
      }, 2000);
    }
  };

  const cancel = () => {
    Alert.alert(
      'Cancel Editing',
      'Are you sure you want to discard this photo?',
      [
        {
          text: 'No',
          style: 'cancel'
        },
        {
          text: 'Yes',
          style: 'destructive',
          onPress: () => navigation.goBack()
        }
      ]
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {photo ? (
          <Image source={{ uri: photo }} style={styles.preview} />
        ) : (
          <View style={[styles.noPhotoContainer, { backgroundColor: theme.card }]}>
            <Ionicons name="image-outline" size={80} color={theme.textLight} />
            <Text style={[styles.noPhotoText, { color: theme.textLight }]}>No photo selected</Text>
          </View>
        )}

        <View style={[styles.editorContainer, { backgroundColor: theme.card }]}>
          <Text style={[styles.label, { color: theme.text }]}>Caption</Text>
          <TextInput
            style={[styles.input, { color: theme.text, backgroundColor: theme.inputBackground }]}
            placeholder="Add a caption..."
            placeholderTextColor={theme.textLight}
            value={caption}
            onChangeText={setCaption}
            multiline
          />

          <Text style={[styles.label, { color: theme.text }]}>Group</Text>
          <View style={[styles.groupSelector, { backgroundColor: theme.inputBackground }]}>
            <Text style={[styles.groupText, { color: theme.text }]}>
              {groupId ? 'Selected Group' : 'No group selected'}
            </Text>
          </View>
        </View>

        {loading ? (
          <View style={styles.progressContainer}>
            <Text style={[styles.progressText, { color: theme.text }]}>
              Uploading... {Math.round(uploadProgress * 100)}%
            </Text>
            <View style={styles.progressBarContainer}>
              <View 
                style={[
                  styles.progressBar, 
                  { backgroundColor: theme.primary, width: `${uploadProgress * 100}%` }
                ]} 
              />
            </View>
          </View>
        ) : (
          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={[styles.button, styles.cancelButton, { borderColor: theme.border }]}
              onPress={cancel}
            >
              <Text style={[styles.buttonText, { color: theme.text }]}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.button, styles.saveButton, { backgroundColor: theme.primary }]}
              onPress={savePhoto}
            >
              <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 15,
  },
  preview: {
    width: '100%',
    height: 300,
    borderRadius: 10,
    marginBottom: 20,
  },
  noPhotoContainer: {
    width: '100%',
    height: 300,
    borderRadius: 10,
    marginBottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noPhotoText: {
    marginTop: 10,
    fontSize: 16,
  },
  editorContainer: {
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  input: {
    borderRadius: 5,
    padding: 12,
    fontSize: 16,
    minHeight: 100,
    marginBottom: 15,
    textAlignVertical: 'top',
  },
  groupSelector: {
    borderRadius: 5,
    padding: 12,
    marginBottom: 10,
  },
  groupText: {
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  button: {
    flex: 1,
    padding: 15,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelButton: {
    marginRight: 10,
    borderWidth: 1,
  },
  saveButton: {
    marginLeft: 10,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  progressContainer: {
    marginTop: 20,
  },
  progressText: {
    fontSize: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  progressBarContainer: {
    height: 10,
    backgroundColor: '#e0e0e0',
    borderRadius: 5,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
  },
});

export default PhotoEditorScreen; 