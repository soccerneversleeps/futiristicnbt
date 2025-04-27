import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import type { ServiceAccount } from 'firebase-admin';

// Ensure all required fields are present
const serviceAccountConfig: ServiceAccount = {
  projectId: process.env.FIREBASE_ADMIN_PROJECT_ID || '',
  privateKey: (process.env.FIREBASE_ADMIN_PRIVATE_KEY || '').replace(/\\n/g, '\n'),
  clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL || ''
};

// Initialize Firebase Admin if it hasn't been initialized
if (!getApps().length) {
  try {
    initializeApp({
      credential: cert(serviceAccountConfig)
    });
  } catch (error) {
    console.error('Error initializing Firebase Admin:', error);
  }
}

const adminDb = getFirestore();

export { adminDb }; 