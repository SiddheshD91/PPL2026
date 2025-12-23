import {
  collection,
  addDoc,
  getDocs,
  getDoc,
  updateDoc,
  doc,
  Timestamp,
} from 'firebase/firestore';
import { db } from '../config/firebase';
import type { Player } from '../types';

const checkFirebase = () => {
  if (!db) {
    throw new Error('Firebase is not configured. Please set up your .env file.');
  }
};

// Convert file to base64 string
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};

const calculateAge = (dob: string): number => {
  const birthDate = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
};

export const createPlayer = async (
  name: string,
  photoFile: File,
  tshirtSize: number,
  dob: string
): Promise<string> => {
  checkFirebase();
  try {
    const age = calculateAge(dob);
    const photoBase64 = await fileToBase64(photoFile);

    const playerData = {
      name,
      photoUrl: photoBase64,
      tshirtSize,
      dob,
      age,
      createdAt: Timestamp.now(),
    };

    const docRef = await addDoc(collection(db, 'players'), playerData);
    return docRef.id;
  } catch (error: any) {
    console.error('Player creation error:', error);
    if (error.code === 'permission-denied') {
      throw new Error('Permission denied. Please check Firestore security rules are published.');
    }
    throw new Error(error.message || 'Failed to create player. Please check your Firebase configuration.');
  }
};

export const updatePlayer = async (
  playerId: string,
  data: {
    name?: string;
    tshirtSize?: number;
    dob?: string;
    photoFile?: File | null;
  }
): Promise<void> => {
  checkFirebase();
  try {
    const playerRef = doc(db, 'players', playerId);
    const updatePayload: Record<string, unknown> = {};

    if (data.name !== undefined) updatePayload.name = data.name;
    if (data.tshirtSize !== undefined) updatePayload.tshirtSize = data.tshirtSize;
    if (data.dob !== undefined) {
      updatePayload.dob = data.dob;
      updatePayload.age = calculateAge(data.dob);
    }

    if (data.photoFile) {
      updatePayload.photoUrl = await fileToBase64(data.photoFile);
    }

    if (Object.keys(updatePayload).length === 0) {
      return;
    }

    await updateDoc(playerRef, updatePayload);
  } catch (error: any) {
    console.error('Player update error:', error);
    throw new Error(error.message || 'Failed to update player');
  }
};

export const getAllPlayers = async (): Promise<Player[]> => {
  checkFirebase();
  try {
    const querySnapshot = await getDocs(collection(db, 'players'));
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date(),
    })) as Player[];
  } catch (error: any) {
    throw new Error(error.message || 'Failed to fetch players');
  }
};

export const searchPlayersByName = async (searchTerm: string): Promise<Player[]> => {
  try {
    const players = await getAllPlayers();
    if (!searchTerm.trim()) {
      return players;
    }
    const lowerSearchTerm = searchTerm.toLowerCase();
    return players.filter((player) =>
      player.name.toLowerCase().includes(lowerSearchTerm)
    );
  } catch (error: any) {
    throw new Error(error.message || 'Failed to search players');
  }
};

export const getPlayerById = async (playerId: string): Promise<Player | null> => {
  checkFirebase();
  try {
    const docRef = doc(db, 'players', playerId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data(),
        createdAt: docSnap.data().createdAt?.toDate() || new Date(),
      } as Player;
    }
    return null;
  } catch (error: any) {
    throw new Error(error.message || 'Failed to fetch player');
  }
};

