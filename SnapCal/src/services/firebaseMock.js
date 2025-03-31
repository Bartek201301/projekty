// Mock data
const mockUsers = [
  {
    uid: 'user1',
    email: 'test@example.com',
    displayName: 'Test User',
    photoURL: 'https://via.placeholder.com/150'
  },
  {
    uid: 'user2',
    email: 'alice@example.com',
    displayName: 'Alice Johnson',
    photoURL: 'https://via.placeholder.com/150'
  },
  {
    uid: 'user3',
    email: 'bob@example.com',
    displayName: 'Bob Smith',
    photoURL: 'https://via.placeholder.com/150'
  }
];

const mockGroups = [
  {
    id: 'group1',
    name: 'Family Photos',
    description: 'Our family photos collection',
    createdAt: new Date(2023, 0, 15).getTime(),
    createdBy: 'user1',
    coverPhotoURL: 'https://via.placeholder.com/400x300',
    memberCount: 3
  },
  {
    id: 'group2',
    name: 'Vacation 2023',
    description: 'Summer vacation memories',
    createdAt: new Date(2023, 5, 10).getTime(),
    createdBy: 'user1',
    coverPhotoURL: 'https://via.placeholder.com/400x300',
    memberCount: 2
  }
];

const mockGroupMembers = [
  { groupId: 'group1', userId: 'user1', role: 'admin' },
  { groupId: 'group1', userId: 'user2', role: 'member' },
  { groupId: 'group1', userId: 'user3', role: 'member' },
  { groupId: 'group2', userId: 'user1', role: 'admin' },
  { groupId: 'group2', userId: 'user2', role: 'member' }
];

const mockPhotos = [
  {
    id: 'photo1',
    url: 'https://via.placeholder.com/800x600',
    caption: 'Beautiful sunset',
    createdAt: new Date(2023, 1, 15).getTime(),
    userId: 'user1',
    groupId: 'group1',
    date: new Date(2023, 1, 15).toISOString().split('T')[0],
    likes: 5,
    comments: [
      { id: 'comment1', text: 'Amazing view!', userId: 'user2', createdAt: new Date(2023, 1, 16).getTime() }
    ]
  },
  {
    id: 'photo2',
    url: 'https://via.placeholder.com/800x600',
    caption: 'Family dinner',
    createdAt: new Date(2023, 1, 20).getTime(),
    userId: 'user2',
    groupId: 'group1',
    date: new Date(2023, 1, 20).toISOString().split('T')[0],
    likes: 3,
    comments: []
  },
  {
    id: 'photo3',
    url: 'https://via.placeholder.com/800x600',
    caption: 'Beach day',
    createdAt: new Date(2023, 6, 12).getTime(),
    userId: 'user1',
    groupId: 'group2',
    date: new Date(2023, 6, 12).toISOString().split('T')[0],
    likes: 7,
    comments: [
      { id: 'comment2', text: 'Great weather!', userId: 'user2', createdAt: new Date(2023, 6, 13).getTime() }
    ]
  }
];

// Mock Firebase Auth
export const auth = {
  currentUser: mockUsers[0],
  
  createUserWithEmailAndPassword: async (email, password) => {
    return { user: mockUsers[0] };
  },
  
  signInWithEmailAndPassword: async (email, password) => {
    return { user: mockUsers[0] };
  },
  
  signOut: async () => {},
  
  onAuthStateChanged: (callback) => {
    callback(mockUsers[0]);
    return () => {};
  }
};

// Helper function to simulate query handling
const handleQuery = (collectionName, filters = [], sorts = [], limitCount = null) => {
  let data;
  
  // Determine which mock data to use
  switch (collectionName) {
    case 'users':
      data = [...mockUsers];
      break;
    case 'groups':
      data = [...mockGroups];
      break;
    case 'group_members':
      data = [...mockGroupMembers];
      break;
    case 'photos':
      data = [...mockPhotos];
      break;
    default:
      data = [];
  }
  
  // Apply filters
  filters.forEach(filter => {
    if (filter.operation === '==') {
      data = data.filter(item => item[filter.field] === filter.value);
    }
  });
  
  // Apply sorts
  if (sorts.length > 0) {
    sorts.forEach(sort => {
      data.sort((a, b) => {
        if (sort.direction === 'asc') {
          return a[sort.field] > b[sort.field] ? 1 : -1;
        } else {
          return a[sort.field] < b[sort.field] ? 1 : -1;
        }
      });
    });
  }
  
  // Apply limit
  if (limitCount) {
    data = data.slice(0, limitCount);
  }
  
  return data;
};

// Mock Firestore
export const firestore = {
  collection: (collectionName) => {
    const queryFilters = [];
    const querySorts = [];
    let queryLimit = null;
    
    return {
      doc: (docId) => {
        return {
          get: async () => {
            const collection = handleQuery(collectionName);
            const doc = collection.find(item => item.id === docId);
            
            return {
              exists: !!doc,
              data: () => doc || null,
              id: docId
            };
          },
          set: async (data) => {},
          update: async (data) => {},
          delete: async () => {}
        };
      },
      add: async (data) => {
        return { id: `new-${Date.now()}` };
      },
      where: (field, operation, value) => {
        queryFilters.push({ field, operation, value });
        return this;
      },
      orderBy: (field, direction = 'asc') => {
        querySorts.push({ field, direction });
        return this;
      },
      limit: (limitCount) => {
        queryLimit = limitCount;
        return this;
      }
    };
  }
};

// Functions to mock Firebase methods
export const collection = (db, name) => name;
export const query = (collectionRef, ...queryConstraints) => {
  const result = { collectionName: collectionRef, filters: [], sorts: [], limit: null };
  
  queryConstraints.forEach(constraint => {
    if (constraint.type === 'where') {
      result.filters.push(constraint);
    } else if (constraint.type === 'orderBy') {
      result.sorts.push(constraint);
    } else if (constraint.type === 'limit') {
      result.limit = constraint.value;
    }
  });
  
  return result;
};

export const where = (field, operation, value) => ({ type: 'where', field, operation, value });
export const orderBy = (field, direction) => ({ type: 'orderBy', field, direction });
export const limit = (value) => ({ type: 'limit', value });

export const getDocs = async (q) => {
  const data = handleQuery(q.collectionName, q.filters, q.sorts, q.limit);
  
  return {
    docs: data.map(item => ({
      id: item.id,
      data: () => item,
      exists: true
    })),
    empty: data.length === 0
  };
};

export const doc = (db, collectionName, docId) => ({ path: `${collectionName}/${docId}` });
export const deleteDoc = async () => {};
export const setDoc = async () => {};
export const updateDoc = async () => {};

// Mock Storage
export const storage = {
  ref: (path) => ({
    put: async (file) => ({
      ref: {
        getDownloadURL: async () => `https://via.placeholder.com/800x600?text=${encodeURIComponent(path)}`
      }
    }),
    delete: async () => {}
  })
};

export const ref = (storage, path) => ({
  put: async (file) => ({
    ref: {
      getDownloadURL: async () => `https://via.placeholder.com/800x600?text=${encodeURIComponent(path)}`
    }
  }),
  delete: async () => {}
});

export const uploadBytes = async () => {};
export const getDownloadURL = async () => 'https://via.placeholder.com/800x600';
export const deleteObject = async () => {};

// Initialize Firebase
const app = "MOCK_FIREBASE_APP";
export const getAuth = () => auth;
export const getFirestore = () => firestore;
export const getStorage = () => storage;

export default app; 