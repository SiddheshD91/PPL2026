import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
  getDoc,
  Timestamp,
} from 'firebase/firestore';
import { db } from '../config/firebase';
import type { Category } from '../types';

const checkFirebase = () => {
  if (!db) {
    throw new Error('Firebase is not configured. Please set up your .env file.');
  }
};

export const createCategory = async (name: string): Promise<string> => {
  checkFirebase();
  try {
    const categoryData = {
      name,
      players: [],
      createdAt: Timestamp.now(),
    };
    const docRef = await addDoc(collection(db, 'categories'), categoryData);
    return docRef.id;
  } catch (error: any) {
    throw new Error(error.message || 'Failed to create category');
  }
};

export const getAllCategories = async (): Promise<Category[]> => {
  checkFirebase();
  try {
    const querySnapshot = await getDocs(collection(db, 'categories'));
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date(),
    })) as Category[];
  } catch (error: any) {
    throw new Error(error.message || 'Failed to fetch categories');
  }
};

export const getCategoryById = async (categoryId: string): Promise<Category | null> => {
  checkFirebase();
  try {
    const categoryRef = doc(db, 'categories', categoryId);
    const snap = await getDoc(categoryRef);
    if (!snap.exists()) return null;
    return {
      id: snap.id,
      ...snap.data(),
      createdAt: snap.data().createdAt?.toDate() || new Date(),
    } as Category;
  } catch (error: any) {
    throw new Error(error.message || 'Failed to fetch category');
  }
};

export const addPlayerToCategory = async (
  categoryId: string,
  playerId: string
): Promise<void> => {
  checkFirebase();
  try {
    const categoryRef = doc(db, 'categories', categoryId);
    const categorySnap = await getDoc(categoryRef);
    
    if (!categorySnap.exists()) {
      throw new Error('Category not found');
    }

    const categoryData = categorySnap.data() as Category;
    
    if (categoryData.players.length >= 8) {
      throw new Error('Category already has maximum 8 players');
    }

    if (categoryData.players.includes(playerId)) {
      throw new Error('Player already in category');
    }

    await updateDoc(categoryRef, {
      players: [...categoryData.players, playerId],
    });
  } catch (error: any) {
    throw new Error(error.message || 'Failed to add player to category');
  }
};

export const removePlayerFromCategory = async (
  categoryId: string,
  playerId: string
): Promise<void> => {
  checkFirebase();
  try {
    const categoryRef = doc(db, 'categories', categoryId);
    const categorySnap = await getDoc(categoryRef);
    
    if (!categorySnap.exists()) {
      throw new Error('Category not found');
    }

    const categoryData = categorySnap.data() as Category;
    const updatedPlayers = categoryData.players.filter((id) => id !== playerId);

    await updateDoc(categoryRef, {
      players: updatedPlayers,
    });
  } catch (error: any) {
    throw new Error(error.message || 'Failed to remove player from category');
  }
};

export const deleteCategory = async (categoryId: string): Promise<void> => {
  checkFirebase();
  try {
    await deleteDoc(doc(db, 'categories', categoryId));
  } catch (error: any) {
    throw new Error(error.message || 'Failed to delete category');
  }
};

