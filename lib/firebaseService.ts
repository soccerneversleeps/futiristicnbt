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
  category: string;
  question: string;
  options: string[];
  correctAnswer: string;
  difficulty: number; // This will always be 1 now
  explanation: string;
  createdAt: Timestamp;
  lastUsed: Timestamp | null;
  usageCount: number;
}

export interface SportDifficulty {
  label: string;
  value: number;
}

export const SPORT_DIFFICULTIES: Record<string, SportDifficulty[]> = {
  basketball: [
    { label: '2-Point Shot', value: 1 },
    { label: '3-Point Shot', value: 1 }
  ],
  football: [
    { label: 'Field Goal', value: 1 },
    { label: 'Touchdown', value: 1 }
  ],
  soccer: [
    { label: 'Goal', value: 1 }
  ],
  baseball: [
    { label: 'Single', value: 1 },
    { label: 'Double', value: 1 },
    { label: 'Triple', value: 1 },
    { label: 'Home Run', value: 1 }
  ]
};

// Shuffle array using Fisher-Yates algorithm
const shuffleArray = <T>(array: T[]): T[] => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

// Keep track of used questions per category and difficulty
const usedQuestions: Record<string, Set<string>> = {};

// Get a key for the usedQuestions map
const getQuestionKey = (category: string, difficulty: number) => `${category}-${difficulty}`;

export const getQuestionsByCategory = async (category: string, difficulty: number): Promise<Question[]> => {
  try {
    console.log('Fetching questions for category:', category, 'difficulty:', difficulty);
    const { collection, getDocs, query, where } = await import('firebase/firestore');
    
    const questionsRef = collection(db, 'preloaded_questions') as CollectionReference<DocumentData>;
    
    // Create query based on category and difficulty
    const q = query(
      questionsRef, 
      where('category', '==', category),
      where('difficulty', '==', difficulty)
    ) as Query<DocumentData>;
    
    const querySnapshot = await getDocs(q);
    console.log('Query executed, found', querySnapshot.size, 'questions');
    
    const questions = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Question[];

    // Initialize used questions set if it doesn't exist
    const key = getQuestionKey(category, difficulty);
    if (!usedQuestions[key]) {
      usedQuestions[key] = new Set();
    }

    // Filter out used questions
    let availableQuestions = questions.filter(q => !usedQuestions[key].has(q.id));

    // If all questions have been used, reset the used questions set
    if (availableQuestions.length === 0) {
      console.log('All questions used, resetting tracking for', key);
      usedQuestions[key].clear();
      availableQuestions = questions;
    }
    
    // Shuffle the available questions
    const shuffledQuestions = shuffleArray(availableQuestions);
    
    // Mark the first question as used
    if (shuffledQuestions.length > 0) {
      usedQuestions[key].add(shuffledQuestions[0].id);
    }
    
    console.log('Processed and shuffled questions:', shuffledQuestions);
    console.log('Used questions for', key, ':', Array.from(usedQuestions[key]));
    
    return shuffledQuestions;
  } catch (error) {
    console.error('Error fetching questions:', error);
    return [];
  }
};

export const saveScore = async (playerName: string, score: number, sport: string) => {
  try {
    const { collection, addDoc } = await import('firebase/firestore');
    
    const scoresRef = collection(db, 'scores');
    await addDoc(scoresRef, {
      playerName,
      score,
      sport,
      timestamp: new Date()
    });
    console.log('Score saved successfully');
  } catch (error) {
    console.error('Error saving score:', error);
  }
}; 