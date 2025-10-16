import type { Timestamp } from 'firebase/firestore';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: 'farmer' | 'buyer' | 'admin';
  farmerId?: string;
  gstNumber?: string;
  region: string;
  cropsGrown: string[];
  updateHistory?: {
    date: Timestamp;
    region: string;
    cropsGrown: string[];
    produceAvailability: string;
  }[];
}

export interface Field {
  id: string;
  name: string;
  cropType: string;
  healthStatus: 'Excellent' | 'Good' | 'Fair' | 'Poor';
  plantingDate: Timestamp;
  harvestDate: Timestamp;
  userId: string;
}

export interface Expense {
  id: string;
  amount: number;
  type: 'Seeds' | 'Fertilizer' | 'Labor' | 'Equipment' | 'Other';
  date: Timestamp;
  userId: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'To Do' | 'In Progress' | 'Done';
  date: Timestamp;
  userId:string;
}

export interface GrowthData {
  id: string;
  fieldId: string;
  date: Timestamp;
  height: number;
  biomass: number;
  leafArea: number;
}

export interface Chat {
  id: string;
  participants: string[]; // array of user IDs
  lastMessage: {
    text: string;
    timestamp: Timestamp;
    senderId: string;
  };
}

export interface Message {
  id: string;
  chatId: string;
  senderId: string;
  text: string;
  timestamp: Timestamp;
}

export interface CommunityPost {
    id: string;
    author: {
        id: string;
        name: string;
        avatarUrl: string;
    };
    content: string;
    timestamp: Timestamp;
    likes: number;
    comments: CommunityComment[];
}

export interface CommunityComment {
    id:string;
    author: {
        id: string;
        name: string;
        avatarUrl: string;
    };
    content: string;
    timestamp: Timestamp;
}
