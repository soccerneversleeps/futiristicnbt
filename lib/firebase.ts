'use client';

import { getApps, initializeApp } from 'firebase/app';
import { Analytics, getAnalytics } from 'firebase/analytics';
import { Firestore, getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
let app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
let analytics: Analytics | null = null;
let db: Firestore;

// Only initialize Firestore and Analytics on the client side
if (typeof window !== 'undefined') {
  db = getFirestore(app);
  // Initialize Analytics only in production and on the client side
  if (process.env.NODE_ENV === 'production') {
    import('firebase/analytics').then(() => {
      analytics = getAnalytics(app);
    }).catch((error) => {
      console.error('Error loading analytics:', error);
    });
  }
} else {
  db = getFirestore(app);
}

export { db, analytics }; 