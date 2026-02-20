
'use server';

import {
  symptomToConditionSuggestion,
  SymptomToConditionSuggestionInput,
  SymptomToConditionSuggestionOutput,
} from '@/ai/flows/symptom-to-condition-suggestion';
import {
  analyzeBloodReport,
  BloodReportAnalysisInput,
  BloodReportAnalysisOutput,
} from '@/ai/flows/medical-info-summarization';
import {
  aiSearch,
  AiSearchInput,
  AiSearchOutput,
} from '@/ai/flows/ai-search';
import { z } from 'zod';

// Symptom Checker Action
const symptomSchema = z.object({
  symptoms: z.string().min(1, { message: 'Please enter at least one symptom.' }),
});

export type SymptomFormState = {
  success: boolean;
  message: string;
  data?: SymptomToConditionSuggestionOutput;
};

export async function getSymptomSuggestions(
  prevState: SymptomFormState,
  formData: FormData
): Promise<SymptomFormState> {
  const validatedFields = symptomSchema.safeParse({
    symptoms: formData.get('symptoms'),
  });

  if (!validatedFields.success) {
    return {
      success: false,
      message: validatedFields.error.flatten().fieldErrors.symptoms?.[0] || "Validation failed.",
    };
  }

  try {
    const input: SymptomToConditionSuggestionInput = {
      symptoms: validatedFields.data.symptoms,
    };
    const result = await symptomToConditionSuggestion(input);
    return {
      success: true,
      message: 'Suggestions generated successfully.',
      data: result,
    };
  } catch (error: any) {
    console.error('Error in getSymptomSuggestions:', error);
    return {
      success: false,
      message: error.message || 'An AI-related error occurred. Please try again later.',
    };
  }
}

// Blood Report Analyzer Action
const reportSchema = z.object({
  reportDataUri: z.string().min(1, { message: 'Please upload a file.' }),
});

export type ReportAnalysisFormState = {
  success: boolean;
  message: string;
  data?: BloodReportAnalysisOutput;
};

export async function getBloodReportAnalysis(
  prevState: ReportAnalysisFormState,
  formData: FormData
): Promise<ReportAnalysisFormState> {
  const validatedFields = reportSchema.safeParse({
    reportDataUri: formData.get('reportDataUri'),
  });

  if (!validatedFields.success) {
    return {
      success: false,
      message: validatedFields.error.flatten().fieldErrors.reportDataUri?.[0] || 'Validation failed.',
    };
  }

  if (!validatedFields.data.reportDataUri.startsWith('data:')) {
     return {
      success: false,
      message: 'File could not be read. Please try uploading it again.',
    };
  }

  try {
    const input: BloodReportAnalysisInput = {
      reportDataUri: validatedFields.data.reportDataUri,
    };
    const result = await analyzeBloodReport(input);
    return {
      success: true,
      message: 'Report analyzed successfully.',
      data: result,
    };
  } catch (error: any) {
    console.error('Error in getBloodReportAnalysis:', error);
    return {
      success: false,
      message: error.message || 'An AI-related error occurred. Please try again.',
    };
  }
}

// AI Search Action
const searchSchema = z.object({
  query: z.string().min(1, { message: 'Please enter a search query.' }),
});

export type AiSearchFormState = {
  success: boolean;
  message: string;
  data?: AiSearchOutput;
};

export async function getAiSearchResults(
  prevState: AiSearchFormState,
  formData: FormData
): Promise<AiSearchFormState> {
    const validatedFields = searchSchema.safeParse({
        query: formData.get('query'),
    });

    if (!validatedFields.success) {
        return {
            success: false,
            message: validatedFields.error.flatten().fieldErrors.query?.[0] || 'Invalid query.',
        };
    }

    try {
        const input: AiSearchInput = { query: validatedFields.data.query };
        const result = await aiSearch(input);
        return {
            success: true,
            message: 'Search complete.',
            data: result,
        };
    } catch (error: any) {
        console.error('Error in getAiSearchResults:', error);
        return {
            success: false,
            message: error.message || 'An AI-related error occurred. Please try again.',
        };
    }
}
