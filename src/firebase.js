import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

// Firebase configuration
// For local development, replace these with your actual Firebase config
// For production, use environment variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || ""
};

// Check if Firebase config is valid (not empty and not placeholder)
const isValidConfig = firebaseConfig.apiKey && 
                     firebaseConfig.apiKey !== "YOUR_API_KEY" &&
                     firebaseConfig.projectId && 
                     firebaseConfig.projectId !== "YOUR_PROJECT_ID";

let app = null;
let db = null;
let auth = null;
let storage = null;

if (isValidConfig) {
  try {
    app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    auth = getAuth(app);
    storage = getStorage(app);
  } catch (error) {
    console.warn("Firebase initialization failed:", error);
  }
} else {
  console.log("Firebase not configured - using demo mode");
}

// Export with fallback to prevent crashes
export { db, auth, storage };
export default app;
