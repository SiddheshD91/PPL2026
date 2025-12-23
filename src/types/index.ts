export interface Player {
  id: string;
  name: string;
  photoUrl: string;
  tshirtSize: number; // Number between 10 and 50
  dob: string;
  age: number;
  createdAt: Date;
}

export interface Category {
  id: string;
  name: string;
  players: string[]; // Array of player IDs
  createdAt: Date;
}

export interface PlayerWithDetails extends Player {
  // Extended player data for admin view
}

