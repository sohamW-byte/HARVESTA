
'use server';

/**
 * @fileOverview A chatbot flow for Harvesta.
 *
 * - chat - A function that handles the chat process.
 * - ChatInput - The input type for the chat function.
 * - ChatOutput - The return type for the chat function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';


export type ChatInput = {
    message: string;
};

export type ChatOutput = {
    reply: string;
};


const chatFlow = ai.defineFlow(
  {
    name: 'chatFlow',
    inputSchema: z.object({
        message: z.string(),
    }),
    outputSchema: z.object({
        reply: z.string(),
    }),
  },
  async (input) => {
    const chatPrompt = ai.definePrompt({
        name: 'chatPrompt',
        system: `You are Harvesta Assistant, an expert agronomist and helpful AI assistant for farmers and buyers on the Harvesta platform.
Your role is to assist users with their questions about farming.
You can answer questions about:
- Crop diseases and treatments
- Best farming practices
- Market prices and trends
- Soil health and management
- Any other farming-related problems.
Be friendly, knowledgeable, and provide clear, actionable advice. If you don't know the answer, say so honestly.`,
        input: { schema: z.object({ message: z.string() }) },
        output: { schema: z.object({ reply: z.string() }) },
    });

    const llmResponse = await chatPrompt(input);
    const output = llmResponse.output();
    
    if (!output) {
        return { reply: "I'm sorry, I couldn't generate a response for that." };
    }
    return { reply: output.reply };
  }
);

export async function chat(input: ChatInput): Promise<ChatOutput> {
    return chatFlow(input);
}
