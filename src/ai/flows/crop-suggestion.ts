'use server';

/**
 * @fileOverview Crop suggestion AI agent.
 *
 * - suggestCrops - A function that handles the crop suggestion process.
 * - CropSuggestionInput - The input type for the suggestCrops function.
 * - CropSuggestionOutput - The return type for the suggestCrops function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';

const CropSuggestionInputSchema = z.object({
  location: z.string().describe('The geographical location (e.g., village, district, state) of the farm.'),
  crop: z.string().optional().describe('A specific crop the user is interested in growing.'),
});

export type CropSuggestionInput = z.infer<typeof CropSuggestionInputSchema>;

const CropSuggestionOutputSchema = z.object({
  suggestions: z.array(
    z.string()
  ).describe('A list of smart suggestions for the user.'),
});

export type CropSuggestionOutput = z.infer<typeof CropSuggestionOutputSchema>;

export async function suggestCrops(input: CropSuggestionInput): Promise<CropSuggestionOutput> {
  return cropSuggestionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'cropSuggestionPrompt',
  input: {schema: CropSuggestionInputSchema},
  output: {schema: CropSuggestionOutputSchema},
  prompt: `You are an expert agronomist providing smart crop suggestions for an Indian farmer.

The user is in: {{{location}}}.
They are considering growing: {{{crop}}}.

Based on this, provide 3-4 concise, actionable suggestions as a list of strings. Consider factors like market trends, regional suitability, profitability, and crop diversification. If they mentioned a specific crop, provide advice related to it. If not, give general recommendations for their area.

Example suggestions:
- "Rice is trending in your region with good prices."
- "Consider Sugarcane for higher profit this season."
- "Diversify with Maize for stable returns."

Keep the suggestions short and practical. Make sure the output is valid JSON, and the schema descriptions should inform the contents of the JSON.
`,
});

const cropSuggestionFlow = ai.defineFlow(
  {
    name: 'cropSuggestionFlow',
    inputSchema: CropSuggestionInputSchema,
    outputSchema: CropSuggestionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
