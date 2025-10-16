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
  cropsGrown: z.array(z.string()).optional().describe('A list of crops the user is currently growing.'),
  weather: z.string().optional().describe('A brief summary of the current weather conditions.'),
});

export type CropSuggestionInput = z.infer<typeof CropSuggestionInputSchema>;

const CropSuggestionOutputSchema = z.object({
  suggestions: z.array(
    z.string()
  ).describe('A list of smart, actionable suggestions for the user.'),
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

The user's farm is located in: {{{location}}}.
The user is currently growing the following crops: {{#if cropsGrown}}{{#each cropsGrown}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}{{else}}none specified{{/if}}.
{{#if weather}}The current weather is: {{{weather}}}.{{/if}}

Based on all this information, provide 3-4 concise, actionable suggestions as a list of strings. Your advice should be highly practical and consider factors like:
- Profitability and current market trends for the given location.
- Suitability for the local climate and soil (inferred from the location).
- The immediate weather conditions. For example, if it's hot, suggest heat-tolerant crops or irrigation techniques.
- Crop diversification to reduce risk.
- Potential for intercropping or succession planting with their existing crops.
- Water requirements and sustainability.

Example Suggestions:
- "Given you're growing Onions in Nashik, consider intercropping with Coriander for a quick cash crop between onion cycles."
- "Market prices for soybeans in Maharashtra are high. It could be a profitable alternative to one of your current crops."
- "With the current heatwave, ensure consistent irrigation for your tomato plants to prevent blossom-end rot."

Keep the suggestions short, direct, and practical. Ensure the output is a valid JSON object adhering to the schema.
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
