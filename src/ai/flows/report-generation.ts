'use server';

/**
 * @fileOverview Report generation AI agent.
 *
 * - generateReport - A function that handles the report generation process.
 * - ReportGenerationInput - The input type for the generateReport function.
 * - ReportGenerationOutput - The return type for the generateReport function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const ReportGenerationInputSchema = z.object({
  location: z.string().describe('The geographical location (e.g., village, district, state) of the farm.'),
});

export type ReportGenerationInput = z.infer<typeof ReportGenerationInputSchema>;

const ReportGenerationOutputSchema = z.object({
  soilQuality: z.string().describe('A detailed analysis of the soil quality in the given location.'),
  trendingCrops: z.array(z.string()).describe('A list of crops that are currently trending in the market for the given location.'),
  bestCrop: z.string().describe('The single best crop to grow in the area based on all factors.'),
  recommendation: z.string().describe('A summary recommendation for the user.'),
  otherFeatures: z.array(z.string()).describe('A list of other relevant agricultural tips or features for the location.'),
});

export type ReportGenerationOutput = z.infer<typeof ReportGenerationOutputSchema>;

export async function generateReport(input: ReportGenerationInput): Promise<ReportGenerationOutput> {
  return reportGenerationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'reportGenerationPrompt',
  input: { schema: ReportGenerationInputSchema },
  output: { schema: ReportGenerationOutputSchema },
  prompt: `You are an expert agricultural analyst for Indian farmers. The user has requested a detailed report for their location: {{{location}}}.

Generate a comprehensive report with the following sections:

1.  **Soil Quality**: Based on the provided location (e.g., Nashik, Maharashtra), infer the likely soil type (e.g., black soil, alluvial) and its general characteristics. Provide a brief analysis of its suitability for various crops.

2.  **Trending Crops**: Identify 3-4 crops that have high market demand or are known to be profitable in this region.

3.  **Best Crop**: From the trending crops, select and recommend the single "best crop" to grow, justifying your choice based on a combination of profitability, suitability to the soil, and market trends.

4.  **Recommendation**: Provide a concise, actionable summary of your findings and recommendations.

5.  **Other Features**: Include 2-3 additional tips relevant to the location, such as water management techniques, potential government schemes, or pest control advice for common crops in the area.

Your entire output must be a single, valid JSON object that strictly adheres to the provided output schema.`,
});

const reportGenerationFlow = ai.defineFlow(
  {
    name: 'reportGenerationFlow',
    inputSchema: ReportGenerationInputSchema,
    outputSchema: ReportGenerationOutputSchema,
  },
  async input => {
    const { output } = await prompt(input);
    return output!;
  }
);
