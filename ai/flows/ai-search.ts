'use server';
/**
 * @fileOverview A Genkit flow for an AI-powered medical search engine.
 *
 * - aiSearch - A function that handles the AI search process.
 * - AiSearchInput - The input type for the aiSearch function.
 * - AiSearchOutput - The return type for the aiSearch function.
 */
import { ai } from '@/ai/genkit';
import { z } from 'zod';

// 1. Define Input Schema
const AiSearchInputSchema = z.object({
  query: z.string().describe("The user's search query."),
});
export type AiSearchInput = z.infer<typeof AiSearchInputSchema>;

// 2. Define Output Schema
const AiSearchOutputSchema = z.object({
  summary: z
    .string()
    .describe(
      "A comprehensive summary answering the user's query, written in a helpful and informative tone."
    ),
  suggestedLinks: z
    .array(
      z.object({
        title: z.string().describe('The title of the suggested page.'),
        href: z
          .string()
          .describe(
            'The URL of the suggested page (e.g., /medicines, /symptoms).'
          ),
        relevance: z
          .string()
          .describe(
            'A brief explanation of why this page is relevant to the query.'
          ),
      })
    )
    .describe(
      'A list of suggested pages within the app that are relevant to the query.'
    ),
  disclaimer: z
    .string()
    .describe('A mandatory disclaimer that this is not medical advice.'),
});
export type AiSearchOutput = z.infer<typeof AiSearchOutputSchema>;

// 3. Define Prompt
const aiSearchPrompt = ai.definePrompt({
  name: 'aiSearchPrompt',
  input: { schema: AiSearchInputSchema },
  output: { schema: AiSearchOutputSchema },
  system: `You are an intelligent medical search engine called MediSearch Pro. Your goal is to provide helpful, accurate, and safe information in response to user queries. You have knowledge about medicines, medical conditions, and symptoms.

You are part of a web application with the following pages:
- \`/medicines\`: For detailed information about specific drugs.
- \`/symptoms\`: A symptom checker to find potential conditions.
- \`/doctors\`: A directory to find doctors.
- \`/hospitals\`: A directory to find hospitals.
- \`/summarizer\`: An AI tool to analyze blood reports.

Based on the user's query, you must:
1. Provide a comprehensive summary that directly answers their question.
2. Suggest up to 3 relevant pages from the list above. For each suggestion, explain why it's relevant.
3. CRITICAL: Always include the following exact disclaimer in the 'disclaimer' field: "This is for informational purposes only and not a substitute for professional medical advice, diagnosis, or treatment. ALWAYS consult with a qualified healthcare provider for any health concerns or before making any decisions related to your health."

If the query seems to be about a medical emergency, your summary should strongly advise the user to contact emergency services immediately. Do not provide information that is dangerously inaccurate or goes against medical safety.`,
  prompt: `User query: {{{query}}}`,
  config: {
    safetySettings: [
      { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_NONE' },
    ],
  },
});

// 4. Define Flow
const aiSearchFlow = ai.defineFlow(
  {
    name: 'aiSearchFlow',
    inputSchema: AiSearchInputSchema,
    outputSchema: AiSearchOutputSchema,
  },
  async (input) => {
    const { output } = await aiSearchPrompt(input);
    if (!output) {
      throw new Error('The AI could not generate a response. The query may be unclear or violate safety policies.');
    }
    // Ensure disclaimer is always present and correct
    output.disclaimer = "This is for informational purposes only and not a substitute for professional medical advice, diagnosis, or treatment. ALWAYS consult with a qualified healthcare provider for any health concerns or before making any decisions related to your health.";
    return output;
  }
);

// 5. Wrapper Function
export async function aiSearch(
  input: AiSearchInput
): Promise<AiSearchOutput> {
  return aiSearchFlow(input);
}
