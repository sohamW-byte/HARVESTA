'use server';
import { config } from 'dotenv';
config();

import '@/ai/flows/crop-recommendation.ts';
import '@/ai/flows/report-generation.ts';
import '@/ai/flows/chat-flow.ts';
