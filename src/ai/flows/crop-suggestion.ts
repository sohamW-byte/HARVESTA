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
  shortTerm: z.array(z.string()).describe("A list of 2-3 short-term, actionable suggestions based on the immediate weather and current crops."),
  longTerm: z.array(z.string()).describe("A list of 2-3 long-term, strategic suggestions for the next 2-4 months (e.g., planning for the next season, soil preparation)."),
  monthlyTrends: z.array(z.object({
    month: z.string().describe("The name of the month (e.g., 'November')."),
    crop: z.string().describe("The crop that is trending or best to plant in that month."),
    reason: z.string().describe("A brief reason why this crop is recommended for this month."),
  })).describe("An analysis of 3-4 upcoming months, identifying a key trending crop for each month based on historical data for the region."),
  summary: z.string().describe("A concluding summary of the overall recommendations."),
});


export type CropSuggestionOutput = z.infer<typeof CropSuggestionOutputSchema>;

export async function suggestCrops(input: CropSuggestionInput): Promise<CropSuggestionOutput> {
  return cropSuggestionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'cropSuggestionPrompt',
  input: {schema: CropSuggestionInputSchema},
  output: {schema: CropSuggestionOutputSchema},
  prompt: `You are an expert agronomist and data analyst for Indian agriculture, providing smart farming advice.

The user's farm is located in: {{{location}}}.
The user is currently growing the following crops: {{#if cropsGrown}}{{#each cropsGrown}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}{{else}}none specified{{/if}}.
{{#if weather}}The current weather is: {{{weather}}}.{{/if}}

Based on all this information, generate a structured report with the following distinct sections:

1.  **shortTerm (Short-Term Suggestions)**: Provide 2-3 immediate, actionable suggestions. These should be tactical and relate directly to the current weather and the crops already being grown. For example, "With the current heat, ensure extra irrigation for your tomatoes," or "Consider applying a top-dressing of nitrogen to your standing wheat crop."

2.  **longTerm (Long-Term Outlook)**: Provide 2-3 strategic suggestions for the next 2-4 months. Focus on planning, soil management, and upcoming seasonal changes. For example, "Begin soil preparation for the Kharif season by incorporating green manure," or "Book your seeds for the upcoming soybean season now to ensure availability."

3.  **monthlyTrends (Monthly Crop Trend Analysis)**: Analyze historical data for the user's region. For each of the next 3-4 months, identify one crop that is typically profitable or timely to plant. For each month, provide the month name, the crop, and a brief reason. Example: { month: "December", crop: "Chickpea (Gram)", reason: "Ideal sowing time for Rabi season; strong market demand post-harvest." }.

4.  **summary (Overall Summary)**: Write a brief, encouraging summary of the key takeaways from your analysis.

Your entire output must be a single, valid JSON object that strictly adheres to the provided output schema. Do not add any extra commentary outside the JSON structure.
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
