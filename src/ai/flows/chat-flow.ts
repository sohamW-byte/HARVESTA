
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

const UserSearchResultSchema = z.object({
  id: z.string(),
  name: z.string(),
  role: z.string(),
  email: z.string(),
});

const searchUsers = ai.defineTool(
  {
    name: 'searchUsers',
    description: 'Search for users in the platform by their name.',
    inputSchema: z.object({
      name: z.string().describe('The name of the user to search for.'),
    }),
    outputSchema: z.array(UserSearchResultSchema),
  },
  async (input) => {
    console.log(`Searching for users with name: ${input.name}`);
    // This is a placeholder. In a real app, you'd query a database.
    // The previous implementation was causing a server crash.
    return [];
  }
);

export const ChatInputSchema = z.object({
    message: z.string(),
});
export type ChatInput = z.infer<typeof ChatInputSchema>;

export const ChatOutputSchema = z.object({
    reply: z.string(),
    users: z.array(UserSearchResultSchema).optional(),
});
export type ChatOutput = z.infer<typeof ChatOutputSchema>;


const chatPrompt = ai.definePrompt({
    name: 'chatPrompt',
    system: `You are Harvesta Assistant, a helpful AI assistant for farmers and buyers on the Harvesta platform.
Your role is to assist users within the application.
You can help users find other users on the platform by name.
If a user asks to find someone, use the searchUsers tool.
When you find users, present them clearly to the user. Do not make it a list.
For example: "I found these users: Ramesh Kumar (Farmer) and Ramesh Gupta (Buyer)."
If you don't find anyone, say "I couldn't find any users with that name."
Be friendly and concise.`,
    tools: [searchUsers],
    input: { schema: ChatInputSchema },
    output: { schema: ChatOutputSchema },
});


const chatFlow = ai.defineFlow(
  {
    name: 'chatFlow',
    inputSchema: ChatInputSchema,
    outputSchema: ChatOutputSchema,
  },
  async (input) => {
    const llmResponse = await chatPrompt(input);
    const toolCalls = llmResponse.toolCalls();

    if (toolCalls.length > 0) {
        const toolResults = await Promise.all(
            toolCalls.map(async (toolCall) => {
                const searchResult = await searchUsers(toolCall.input);
                return {
                    call: toolCall,
                    result: searchResult,
                };
            })
        );
        
        const finalResponse = await llmResponse.send(toolResults);
        const output = finalResponse.output();
        if (!output) {
            return { reply: "I'm sorry, I had trouble with that request." };
        }
        return {
            reply: output.reply,
            users: toolResults.flatMap(tr => tr.result)
        };
    }
    
    const output = llmResponse.output();
    if (!output) {
        return { reply: "I'm sorry, I don't have a response for that." };
    }
    return {
        reply: output.reply,
    };
  }
);

export async function chat(input: ChatInput): Promise<ChatOutput> {
    return chatFlow(input);
}
