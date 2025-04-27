import { db } from './firebase';
import { collection, getDocs, query, where, Timestamp, addDoc } from 'firebase/firestore';

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
    const questionsRef = collection(db, 'preloaded_questions');
    const q = query(questionsRef, where('category', '==', category));
    const querySnapshot = await getDocs(q);
    
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