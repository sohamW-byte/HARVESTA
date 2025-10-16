
'use server';

/**
 * @fileOverview Voice assistant flow for Harvesta.
 *
 * - processVoiceCommand - A function that handles understanding and routing voice commands.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const NAVIGABLE_PAGES = [
  'dashboard',
  'recommendations',
  'marketplace',
  'my-fields',
  'reports',
  'messages',
  'community',
  'profile',
  'feedback',
];

const VoiceCommandInputSchema = z.object({
  command: z.string().describe('The transcribed text from the user\'s voice command.'),
});

const VoiceCommandOutputSchema = z.object({
  intent: z
    .enum(['navigate', 'help', 'unknown'])
    .describe('The recognized intent of the user command.'),
  target: z
    .string()
    .optional()
    .describe('For navigation, the lowercase page name (e.g., "marketplace"). For help, this is a summary of the question.'),
  response: z.string().describe('A spoken response to the user, confirming the action or providing help.'),
});

export type VoiceCommandInput = z.infer<typeof VoiceCommandInputSchema>;
export type VoiceCommandOutput = z.infer<typeof VoiceCommandOutputSchema>;

export async function processVoiceCommand(input: VoiceCommandInput): Promise<VoiceCommandOutput> {
  const prompt = ai.definePrompt({
    name: 'voiceCommandPrompt',
    input: { schema: VoiceCommandInputSchema },
    output: { schema: VoiceCommandOutputSchema },
    prompt: `You are a voice assistant for the Harvesta farming app. Your job is to understand user commands and determine the correct action.

The user said: "{{{command}}}"

Possible intents are:
- "navigate": If the user wants to go to a specific page.
- "help": If the user is asking a question about how to use the app.
- "unknown": If the command is unclear or unrelated to the app.

Valid page targets for navigation are: ${NAVIGABLE_PAGES.join(', ')}.
Match the user's command to one of these pages if their intent is "navigate". The target should be just the page name (e.g., "marketplace").

If the intent is "help", the target should be a short summary of their question, and the response should be a helpful, concise answer. For example, if they ask "How do I sell my crops?", the response could be "To sell crops, go to the marketplace page and click the 'Add Produce' button."

If the intent is "unknown", the response should be "Sorry, I didn't understand that."

Analyze the command and provide the output in the required JSON format.`,
  });

  const voiceFlow = ai.defineFlow(
    {
      name: 'voiceAssistantFlow',
      inputSchema: VoiceCommandInputSchema,
      outputSchema: VoiceCommandOutputSchema,
    },
    async (input) => {
      const llmResponse = await prompt(input);
      const output = llmResponse.output();
      if (!output) {
        return {
          intent: 'unknown',
          response: "Sorry, I couldn't process that command.",
        };
      }
      return output;
    }
  );

  return voiceFlow(input);
}
