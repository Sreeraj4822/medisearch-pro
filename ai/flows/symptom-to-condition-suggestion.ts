'use server';
/**
 * @fileOverview This file implements a Genkit flow for suggesting potential medical conditions
 * based on user-provided symptoms, with an important disclaimer that it is not
 * a substitute for professional medical advice.
 *
 * - symptomToConditionSuggestion - A function that handles the symptom-to-condition suggestion process.
 * - SymptomToConditionSuggestionInput - The input type for the symptomToConditionSuggestion function.
 * - SymptomToConditionSuggestionOutput - The return type for the symptomToConditionSuggestion function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const SymptomToConditionSuggestionInputSchema = z.object({
  symptoms: z.string().describe("A detailed description of the user's symptoms."),
});
export type SymptomToConditionSuggestionInput = z.infer<typeof SymptomToConditionSuggestionInputSchema>;

const SymptomToConditionSuggestionOutputSchema = z.object({
  conditions: z.array(
    z.object({
      name: z.string().describe('The name of a possible medical condition.'),
      description: z.string().describe('A brief description of the condition and its relevance to the symptoms.'),
    })
  ).describe('A list of potential medical conditions based on the symptoms provided. ALWAYS include a disclaimer that this is NOT medical advice and users should consult a healthcare professional.'),
});
export type SymptomToConditionSuggestionOutput = z.infer<typeof SymptomToConditionSuggestionOutputSchema>;

export async function symptomToConditionSuggestion(input: SymptomToConditionSuggestionInput): Promise<SymptomToConditionSuggestionOutput> {
  return symptomToConditionSuggestionFlow(input);
}

const symptomToConditionSuggestionPrompt = ai.definePrompt({
  name: 'symptomToConditionSuggestionPrompt',
  input: { schema: SymptomToConditionSuggestionInputSchema },
  output: { schema: SymptomToConditionSuggestionOutputSchema },
  system: `You are a helpful AI assistant specialized in providing general information about potential medical conditions based on symptoms. You are NOT a medical professional and your suggestions should NEVER be taken as medical advice.
  
Your task is to analyze the user's symptoms, which may be a detailed description or just a few keywords. Based on the symptoms, suggest a list of possible conditions. For each condition, provide its name and a brief description explaining its relevance.

**CRITICAL**: You MUST always include the following disclaimer at the end of EACH condition's description: "This is for informational purposes and not a substitute for professional medical advice. Consult a healthcare provider for any health concerns."

Even if the input is very short (e.g., "cough"), you must still generate a list of potential conditions in the required JSON format. Do not refuse to answer or ask for more details.`,
  prompt: `User's symptoms: {{{symptoms}}}`,
  config: {
    safetySettings: [
      { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_NONE' },
    ]
  }
});

const symptomToConditionSuggestionFlow = ai.defineFlow(
  {
    name: 'symptomToConditionSuggestionFlow',
    inputSchema: SymptomToConditionSuggestionInputSchema,
    outputSchema: SymptomToConditionSuggestionOutputSchema,
  },
  async (input) => {
    const { output } = await symptomToConditionSuggestionPrompt(input);
    if (!output || !output.conditions || output.conditions.length === 0) {
      throw new Error('The AI could not generate suggestions. This may be due to safety policies or a vague query. Please try rephrasing with more detail.');
    }
    return output;
  }
);
