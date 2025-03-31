# SnapCal

A mobile app for managing group photo galleries with calendar integration, built with React Native (Expo) and Firebase.

## Features

- **Authentication**: Login and register with email/password, Google, or Facebook
- **Group Management**: Create private groups and invite members
- **Calendar View**: Add photos to specific dates in a group calendar
- **Photo Sharing**: Take and share photos with group members
- **Reactions**: Like photos and add them to favorites
- **Permissions**: Admin controls for managing groups and members
- **Dark/Light Mode**: Support for system theme preference

## Technologies

- React Native (Expo)
- Firebase (Authentication, Firestore, Storage)
- React Navigation
- Styled Components
- Expo Camera and Image Picker

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- Firebase account (optional for demo mode)

### Installation

1. Clone the repository
```
git clone <repository-url>
cd SnapCal
```

2. Install dependencies
```
npm install
# or
yarn install
```

### Demo Mode (No Firebase Setup Required)

The app includes a demo mode that uses mock data instead of a real Firebase backend:

1. Make sure demo mode is enabled in `src/services/firebaseConfig.js` (set `USE_MOCK_FIREBASE = true`)
2. Start the development server: `expo start`
3. Run the app on a device or emulator

For more information about demo mode, see [DEMO_MODE.md](DEMO_MODE.md).

### Production Setup

3. Set up Firebase
   - Create a Firebase project at [https://console.firebase.google.com/](https://console.firebase.google.com/)
   - Enable Authentication (Email/Password, Google, Facebook)
   - Create a Firestore database
   - Enable Storage
   - Get your Firebase configuration and update it in `src/services/firebaseConfig.js`
   - Set `USE_MOCK_FIREBASE = false` in `src/services/firebaseConfig.js`

4. Set up Social Auth
   - For Google auth, obtain a client ID and update it in `src/contexts/AuthContext.js`
   - For Facebook auth, create a Facebook app and update the app ID in `src/contexts/AuthContext.js`

5. Start the development server
```
expo start
# or
npm start
```

## Project Structure

```
SnapCal/
├── assets/               # Images and static assets
├── src/
│   ├── components/       # Reusable UI components
│   ├── contexts/         # React contexts (Auth, Theme)
│   ├── hooks/            # Custom React hooks
│   ├── navigation/       # Navigation configuration
│   ├── screens/          # App screens
│   │   ├── auth/         # Authentication screens
│   │   ├── groups/       # Group management screens
│   │   ├── main/         # Main app screens
│   │   └── photos/       # Photo-related screens
│   ├── services/         # API and service integrations
│   └── utils/            # Utility functions
├── App.js                # App entry point
├── app.json              # Expo configuration
└── package.json          # Dependencies
```

## Firebase Data Structure

### Collections

- **users**: User profiles
- **groups**: Group information
- **group_members**: Mapping between users and groups with roles
- **photos**: Photos with metadata (user, group, date, etc.)

## License

This project is licensed under the MIT License. 