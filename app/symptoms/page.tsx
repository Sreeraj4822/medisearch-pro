'use client';

import { useFormStatus } from 'react-dom';
import { getSymptomSuggestions, SymptomFormState } from '@/lib/actions';
import PageHeader from '@/components/page-header';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, AlertTriangle, Lightbulb, Loader2, Stethoscope } from 'lucide-react';
import { useActionState } from 'react';

const initialState: SymptomFormState = {
  success: false,
  message: '',
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Analyzing...
        </>
      ) : (
        <>
          <Stethoscope className="mr-2 h-4 w-4" />
          Get Suggestions
        </>
      )}
    </Button>
  );
}

export default function SymptomsPage() {
  const [state, formAction] = useActionState(getSymptomSuggestions, initialState);

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="Symptom Checker"
        description="Describe your symptoms to get a list of possible related conditions from our AI."
      />

      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Disclaimer</AlertTitle>
        <AlertDescription>
          This tool is for informational purposes only and does not constitute medical advice. Always consult with a qualified healthcare professional for any health concerns.
        </AlertDescription>
      </Alert>

      <Card>
        <form action={formAction}>
          <CardHeader>
            <CardTitle className="font-headline">Describe Your Symptoms</CardTitle>
            <CardDescription>
             Enter a few keywords (e.g., "cough, fever") or describe your symptoms in detail.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              name="symptoms"
              placeholder="e.g., 'cough, fever, headache' or 'I have a persistent dry cough...'"
              rows={5}
            />
          </CardContent>
          <CardFooter className="border-t px-6 py-4">
            <SubmitButton />
          </CardFooter>
        </form>
      </Card>
      
      {state.success && state.data && (
        <Card className="animate-in fade-in-50">
            <CardHeader>
                <CardTitle className="font-headline">Possible Conditions</CardTitle>
                <CardDescription>Based on the symptoms you provided, here are some possibilities. Please consult a doctor for a diagnosis.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {state.data.conditions.map((condition, index) => (
                    <div key={index} className="rounded-lg border bg-card text-card-foreground p-4">
                        <h3 className="font-semibold text-lg flex items-center gap-2"><Lightbulb className="h-5 w-5 text-primary"/>{condition.name}</h3>
                        <p className="text-muted-foreground mt-1">{condition.description}</p>
                    </div>
                ))}
            </CardContent>
            <CardFooter>
                <p className="text-xs text-muted-foreground">Source: AI analysis. Not medical advice.</p>
            </CardFooter>
        </Card>
      )}

      {!state.success && state.message && (
        <Card className="border-destructive bg-destructive/10">
          <CardHeader className="flex-row items-center gap-4 space-y-0">
            <AlertCircle className="h-8 w-8 text-destructive" />
            <div>
                <CardTitle className="font-headline text-destructive">Error</CardTitle>
                <CardDescription className="text-destructive/80">{state.message}</CardDescription>
            </div>
          </CardHeader>
        </Card>
      )}
    </div>
  );
}
