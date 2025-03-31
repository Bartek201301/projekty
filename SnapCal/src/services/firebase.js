import { USE_MOCK_FIREBASE, firebaseConfig } from './firebaseConfig';
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Import mock implementations
import * as firebaseMock from './firebaseMock';

let auth, firestore, storage, app;

// Use mock or real Firebase based on the config flag
if (USE_MOCK_FIREBASE) {
  // Use mock implementations
  auth = firebaseMock.auth;
  firestore = firebaseMock.firestore;
  storage = firebaseMock.storage;
  app = firebaseMock.default;
} else {
  // Initialize real Firebase with config
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  firestore = getFirestore(app);
  storage = getStorage(app);
}

// Export common Firebase objects
export { auth, firestore, storage };

// Export Firebase functions if using mocks
export const collection = USE_MOCK_FIREBASE ? firebaseMock.collection : null;
export const query = USE_MOCK_FIREBASE ? firebaseMock.query : null;
export const where = USE_MOCK_FIREBASE ? firebaseMock.where : null;
export const orderBy = USE_MOCK_FIREBASE ? firebaseMock.orderBy : null;
export const limit = USE_MOCK_FIREBASE ? firebaseMock.limit : null;
export const getDocs = USE_MOCK_FIREBASE ? firebaseMock.getDocs : null;
export const doc = USE_MOCK_FIREBASE ? firebaseMock.doc : null;
export const deleteDoc = USE_MOCK_FIREBASE ? firebaseMock.deleteDoc : null;
export const setDoc = USE_MOCK_FIREBASE ? firebaseMock.setDoc : null;
export const updateDoc = USE_MOCK_FIREBASE ? firebaseMock.updateDoc : null;
export const ref = USE_MOCK_FIREBASE ? firebaseMock.ref : null;
export const uploadBytes = USE_MOCK_FIREBASE ? firebaseMock.uploadBytes : null;
export const getDownloadURL = USE_MOCK_FIREBASE ? firebaseMock.getDownloadURL : null;
export const deleteObject = USE_MOCK_FIREBASE ? firebaseMock.deleteObject : null;

export default app; 