'use server';
/**
 * @fileOverview A Genkit flow for analyzing blood test reports from uploaded files.
 *
 * - analyzeBloodReport - A function that handles the blood report analysis process.
 * - BloodReportAnalysisInput - The input type for the analyzeBloodReport function.
 * - BloodReportAnalysisOutput - The return type for the analyzeBloodReport function.
 */
import { ai } from '@/ai/genkit';
import { z } from 'zod';

// 1. Define Input Schema
const BloodReportAnalysisInputSchema = z.object({
  reportDataUri: z.string().describe("A blood test report file (PDF or image), as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."),
});
export type BloodReportAnalysisInput = z.infer<typeof BloodReportAnalysisInputSchema>;

// 2. Define Output Schema
const BloodReportAnalysisOutputSchema = z.object({
  summary: z.string().describe('A concise, easy-to-understand summary of the key findings in the blood report.'),
  severity: z
    .enum(['Normal', 'Mild', 'Moderate', 'Severe', 'Critical'])
    .describe('An overall assessment of the severity of the findings in the report.'),
  keyFindings: z
    .array(
      z.object({
        test: z.string().describe('The name of the specific test or marker (e.g., "Hemoglobin", "Glucose").'),
        value: z.string().describe('The reported value for the test, including units (e.g., "14.5 g/dL").'),
        interpretation: z
          .string()
          .describe('A brief explanation of what this test measures and what the result means (e.g., "This is within the normal range for an adult male.").'),
        finding: z
          .enum(['Normal', 'Low', 'High', 'Borderline', 'Abnormal'])
          .describe('A classification of the finding for this specific test.'),
      })
    )
    .describe('A detailed breakdown of the most important individual test results from the report.'),
  suggestedPrecautions: z
    .array(z.string())
    .describe(
      'A list of general, non-prescriptive medical precautions or lifestyle suggestions based on the findings (e.g., "Consider discussing dietary changes with your doctor," "Follow up with a specialist for further evaluation.").'
    ),
  disclaimer: z
    .string()
    .describe(
      'A mandatory disclaimer stating that this is an AI analysis and not a substitute for professional medical advice.'
    ),
});
export type BloodReportAnalysisOutput = z.infer<typeof BloodReportAnalysisOutputSchema>;


// 3. Define Prompt
const bloodReportAnalysisPrompt = ai.definePrompt({
  name: 'bloodReportAnalysisPrompt',
  input: { schema: BloodReportAnalysisInputSchema },
  output: { schema: BloodReportAnalysisOutputSchema },
  system: `You are an expert AI medical assistant. Your task is to analyze a blood test report provided by a user as an image or PDF. You must extract relevant information and provide a structured analysis.
  
  Your analysis MUST be structured according to the output schema.
  
  1.  **Summary**: Provide a high-level, easy-to-understand summary of the report's key findings.
  2.  **Severity**: Based on all the results, classify the overall severity as 'Normal', 'Mild', 'Moderate', 'Severe', or 'Critical'. If all results are within normal ranges, classify as 'Normal'.
  3.  **Key Findings**: Identify the most significant tests in the report. For each, provide the test name, its value, and a clear interpretation. Classify each finding as 'Normal', 'Low', 'High', 'Borderline', or 'Abnormal'. Do not invent reference ranges if they are not provided in the report text; instead, base your interpretation on common medical knowledge.
  4.  **Suggested Precautions**: Based on the findings, suggest general precautions or next steps. These should be non-prescriptive (e.g., "Discuss these results with your healthcare provider," "Consider lifestyle modifications like diet and exercise"). NEVER suggest specific medications or treatments.
  5.  **Disclaimer**: CRITICAL: You MUST include the following exact disclaimer in the 'disclaimer' field: "This is an AI-generated analysis and is for informational purposes only. It is NOT a substitute for professional medical advice, diagnosis, or treatment. ALWAYS consult with a qualified healthcare provider for any health concerns or before making any decisions related to your health."
  
  Analyze the following report file carefully and generate the structured response.`,
  prompt: `Analyze this blood report: {{media url=reportDataUri}}`,
  config: {
    safetySettings: [
      { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_NONE' },
    ]
  }
});

// 4. Define Flow
const bloodReportAnalysisFlow = ai.defineFlow(
  {
    name: 'bloodReportAnalysisFlow',
    inputSchema: BloodReportAnalysisInputSchema,
    outputSchema: BloodReportAnalysisOutputSchema,
  },
  async (input) => {
    const { output } = await bloodReportAnalysisPrompt(input);
     if (!output) {
      throw new Error('The AI could not generate an analysis for this report. The content may be unclear or violate safety policies.');
    }
    // Ensure disclaimer is always present
    output.disclaimer = "This is an AI-generated analysis and is for informational purposes only. It is NOT a substitute for professional medical advice, diagnosis, or treatment. ALWAYS consult with a qualified healthcare provider for any health concerns or before making any decisions related to your health.";
    return output;
  }
);

// 5. Wrapper Function
export async function analyzeBloodReport(
  input: BloodReportAnalysisInput
): Promise<BloodReportAnalysisOutput> {
  return bloodReportAnalysisFlow(input);
}
