'use server';

/**
 * @fileOverview Crop recommendation AI agent.
 *
 * - recommendCrops - A function that handles the crop recommendation process.
 * - CropRecommendationInput - The input type for the recommendCrops function.
 * - CropRecommendationOutput - The return type for the recommendCrops function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CropRecommendationInputSchema = z.object({
  soilData: z
    .string()
    .describe('The soil data for the field, including pH, nitrogen, phosphorus, and potassium levels.'),
  weatherConditions: z
    .string()
    .describe('The current weather conditions for the field, including temperature, rainfall, and humidity.'),
  region: z.string().describe('The geographical region of the field.'),
});

export type CropRecommendationInput = z.infer<typeof CropRecommendationInputSchema>;

const CropRecommendationOutputSchema = z.object({
  recommendedCrops: z.array(
    z.string().describe('A list of recommended crops for the field.')
  ),
  reasoning: z.string().describe('The reasoning behind the crop recommendations.'),
});

export type CropRecommendationOutput = z.infer<typeof CropRecommendationOutputSchema>;

export async function recommendCrops(input: CropRecommendationInput): Promise<CropRecommendationOutput> {
  return recommendCropsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'cropRecommendationPrompt',
  input: {schema: CropRecommendationInputSchema},
  output: {schema: CropRecommendationOutputSchema},
  prompt: `You are an expert agronomist specializing in crop recommendations.

You will use the soil data, weather conditions, and region to recommend the best crops to plant in the field.

Soil Data: {{{soilData}}}
Weather Conditions: {{{weatherConditions}}}
Region: {{{region}}}

Consider the following factors when making your recommendations:
- Soil type and fertility
- Climate and weather patterns
- Water availability
- Pest and disease resistance
- Market demand

Output the recommended crops and the reasoning behind your recommendations.  Make sure the output is valid JSON, and the schema descriptions should inform the contents of the JSON.
`,
});

const recommendCropsFlow = ai.defineFlow(
  {
    name: 'recommendCropsFlow',
    inputSchema: CropRecommendationInputSchema,
    outputSchema: CropRecommendationOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
