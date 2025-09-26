# Food Week Planner

A modern, responsive web application for planning weekly meals with ingredient management and cloud synchronization.

## Features

- **Weekly Meal Planning**: Interactive calendar view for planning meals by day
- **Rich Text Editor**: TinyMCE integration for detailed meal descriptions with image support
- **Ingredient Management**: Add and manage ingredients for each meal
- **Shopping List**: Automatically aggregated weekly shopping list from all meals
- **Week Navigation**: Browse any week throughout the year with quick "current week" access
- **Cloud Sync**: Firebase integration for real-time synchronization across devices
- **User Authentication**: Secure user accounts with Firebase Auth
- **Responsive Design**: Beautiful modern interface that works on all devices

## Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS with responsive design
- **Rich Text**: TinyMCE for meal descriptions
- **Backend**: Firebase (Firestore + Auth + Storage)
- **Date Management**: date-fns for week navigation
- **Icons**: Lucide React

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Firebase Setup

1. Create a new Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Enable Firestore Database and Authentication (Email/Password)
3. Get your Firebase configuration from Project Settings
4. Update `src/firebase/config.ts` with your Firebase credentials:

```typescript
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project-id.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "your-messaging-sender-id",
  appId: "your-app-id"
};
```

### 3. TinyMCE Setup

1. Get a free API key from [TinyMCE](https://www.tiny.cloud/)
2. Update the API key in `src/components/MealEditor/MealModal.tsx`:

```typescript
<Editor
  apiKey="your-tinymce-api-key"
  // ... rest of configuration
/>
```

### 4. Firebase Security Rules

Set up Firestore security rules to ensure users can only access their own data:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /meals/{document} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
    }
  }
}
```

### 5. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) to view the app.

## Usage

1. **Sign Up/Sign In**: Create an account or sign in with existing credentials
2. **Navigate Weeks**: Use the header navigation to browse different weeks
3. **Add Meals**: Click "Add Meal" on any day to create a new meal
4. **Edit Meals**: Click on existing meals to edit them
5. **Rich Text**: Use the TinyMCE editor to add detailed descriptions and images
6. **Manage Ingredients**: Add ingredients with quantities and units
7. **Shopping List**: Click the shopping list button to see aggregated ingredients

## Project Structure

```
src/
├── components/
│   ├── Auth/              # Authentication components
│   ├── Layout/            # Header and layout components
│   ├── MealEditor/        # Meal creation/editing with TinyMCE
│   ├── ShoppingList/      # Shopping list aggregation
│   └── WeekPlanner/       # Main calendar and day components
├── firebase/              # Firebase configuration and services
├── hooks/                 # Custom React hooks
├── types/                 # TypeScript type definitions
└── utils/                 # Utility functions (date handling, etc.)
```

## Production Deployment

### Build for Production

```bash
npm run build
```

### Deploy to Firebase Hosting (Optional)

1. Install Firebase CLI: `npm install -g firebase-tools`
2. Login to Firebase: `firebase login`
3. Initialize hosting: `firebase init hosting`
4. Build and deploy: `npm run build && firebase deploy`
