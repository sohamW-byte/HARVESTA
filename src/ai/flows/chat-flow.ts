
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
export type UserSearchResult = z.infer<typeof UserSearchResultSchema>;

const mockUsers: UserSearchResult[] = [
    { id: '1', name: 'Ramesh Kumar', role: 'Farmer', email: 'ramesh.k@example.com' },
    { id: '2', name: 'Sunita Patil', role: 'Farmer', email: 'sunita.p@example.com' },
    { id: '3', name: 'Anjali Traders', role: 'Buyer', email: 'anjali.t@example.com' },
    { id: '4', name: 'Ramesh Gupta', role: 'Buyer', email: 'ramesh.g@example.com' },
    { id: '5', name: 'Vijay Farms', role: 'Farmer', email: 'vijay.f@example.com' },
];

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
    const searchName = input.name.toLowerCase();
    const results = mockUsers.filter(user => user.name.toLowerCase().includes(searchName));
    return results;
  }
);

export type ChatInput = {
    message: string;
};

export type ChatOutput = {
    reply: string;
    users?: UserSearchResult[];
};


const chatFlow = ai.defineFlow(
  {
    name: 'chatFlow',
    inputSchema: z.object({
        message: z.string(),
    }),
    outputSchema: z.object({
        reply: z.string(),
        users: z.array(UserSearchResultSchema).optional(),
    }),
  },
  async (input) => {
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
        input: { schema: z.object({ message: z.string() }) },
        // No output schema here, as we handle tool logic manually
    });

    const llmResponse = await chatPrompt(input);
    const toolCalls = llmResponse.toolCalls();

    if (toolCalls.length > 0 && toolCalls[0].name === 'searchUsers') {
        const toolCall = toolCalls[0];
        const searchResult = await searchUsers(toolCall.input);
        
        const followUpPrompt = ai.definePrompt({
            name: 'chatFollowUpPrompt',
            system: `You are Harvesta Assistant. You just performed a user search.
Based on the results, formulate a friendly reply.
If users were found, list them clearly. For example: "I found these users: Ramesh Kumar (Farmer) and Ramesh Gupta (Buyer)."
If no users were found, state that clearly: "I couldn't find any users with that name."`,
            input: { schema: z.object({ searchResult: z.array(UserSearchResultSchema) }) },
            output: { schema: z.object({ reply: z.string() }) },
        });

        const finalResponse = await followUpPrompt({ searchResult });
        const output = finalResponse.output();

        if (!output) {
            return { reply: "I'm sorry, I had trouble with that request." };
        }
        return {
            reply: output.reply,
            users: searchResult,
        };
    }
    
    const textOutput = llmResponse.text();
    if (!textOutput) {
        return { reply: "I'm sorry, I don't have a response for that." };
    }
    return {
        reply: textOutput,
    };
  }
);

export async function chat(input: ChatInput): Promise<ChatOutput> {
    return chatFlow(input);
}
