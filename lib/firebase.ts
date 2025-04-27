'use client';

import { initializeApp, getApps } from 'firebase/app';
import { Analytics, getAnalytics } from 'firebase/analytics';
import { Firestore, getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBVad0qcojBUpwySAek4ihN1kcTP0_qEN4",
  authDomain: "nothingbuttrivia-68640.firebaseapp.com",
  databaseURL: "https://nothingbuttrivia-68640-default-rtdb.firebaseio.com",
  projectId: "nothingbuttrivia-68640",
  storageBucket: "nothingbuttrivia-68640.firebasestorage.app",
  messagingSenderId: "648467137933",
  appId: "1:648467137933:web:936a64647cdf31b3d2a9c4",
  measurementId: "G-X6PR0VSKTE"
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
    analytics = getAnalytics(app);
  }
} else {
  db = getFirestore(app);
}

export { app, analytics, db }; 