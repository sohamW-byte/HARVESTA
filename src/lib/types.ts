import type { Timestamp } from 'firebase/firestore';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  region: string;
  cropsGrown: string[];
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
  userId: string;
}

export interface GrowthData {
  id: string;
  fieldId: string;
  date: Timestamp;
  height: number;
  biomass: number;
  leafArea: number;
}
