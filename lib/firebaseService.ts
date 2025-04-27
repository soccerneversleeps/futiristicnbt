'use client';

import { db } from './firebase';
import type { 
  CollectionReference,
  DocumentData,
  Query,
  QuerySnapshot,
  Timestamp
} from 'firebase/firestore';

export interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswer: string;
  difficulty: number;
  explanation: string;
  category: string;
  createdAt: Timestamp;
  lastUsed: Timestamp | null;
  usageCount: number;
}

export const getQuestionsByCategory = async (category: string): Promise<Question[]> => {
  try {
    // Dynamically import Firestore functions
    const { collection, getDocs, query, where } = await import('firebase/firestore');
    
    const questionsRef = collection(db, 'preloaded_questions') as CollectionReference<DocumentData>;
    const q = query(questionsRef, where('category', '==', category)) as Query<DocumentData>;
    const querySnapshot = await getDocs(q) as QuerySnapshot<DocumentData>;
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Question[];
  } catch (error) {
    console.error('Error fetching questions:', error);
    return [];
  }
};

export const saveScore = async (playerName: string, score: number, sport: string) => {
  try {
    // Dynamically import Firestore functions
    const { collection, addDoc } = await import('firebase/firestore');
    
    const scoresRef = collection(db, 'scores');
    await addDoc(scoresRef, {
      playerName,
      score,
      sport,
      timestamp: new Date()
    });
  } catch (error) {
    console.error('Error saving score:', error);
  }
}; 