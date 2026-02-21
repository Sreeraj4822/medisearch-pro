'use client';

import { useState, useRef } from 'react';
import { useFormStatus } from 'react-dom';
import { getSymptomSuggestions, SymptomFormState } from '@/lib/actions';
import PageHeader from '@/components/page-header';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  AlertCircle,
  AlertTriangle,
  Lightbulb,
  Loader2,
  Stethoscope,
  Mic,
} from 'lucide-react';
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
  const [state, formAction] = useActionState(
    getSymptomSuggestions,
    initialState
  );

  const [symptomsText, setSymptomsText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);

  const toggleListening = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert('Speech Recognition not supported in this browser');
      return;
    }

    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.continuous = true;

    recognition.onstart = () => setIsListening(true);

    recognition.onresult = (event: any) => {
      const transcript =
        event.results[event.results.length - 1][0].transcript;

      // PRO UPGRADE: Append transcript
      setSymptomsText((prev) =>
        prev ? prev + ' ' + transcript : transcript
      );
    };

    recognition.onerror = () => {
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;
    recognition.start();
  };

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="Symptom Checker"
        description="Describe your symptoms to get possible related conditions from our AI."
      />

      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Disclaimer</AlertTitle>
        <AlertDescription>
          This tool is for informational purposes only and does not
          constitute medical advice. Always consult a qualified
          healthcare professional.
        </AlertDescription>
      </Alert>

      <Card>
        <form action={formAction}>
          <CardHeader>
            <CardTitle className="font-headline">
              Describe Your Symptoms
            </CardTitle>
            <CardDescription>
              Type or use voice input.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="flex gap-2 items-start">
              <Textarea
                name="symptoms"
                value={symptomsText}
                onChange={(e) => setSymptomsText(e.target.value)}
                placeholder="e.g., 'cough, fever' or describe in detail..."
                rows={5}
                className="flex-1"
              />

              <Button
                type="button"
                onClick={toggleListening}
                variant={isListening ? 'destructive' : 'secondary'}
                className="mt-1"
              >
                <Mic className="mr-2 h-4 w-4" />
                {isListening ? 'Stop' : 'Speak'}
              </Button>
            </div>
          </CardContent>

          <CardFooter className="border-t px-6 py-4">
            <SubmitButton />
          </CardFooter>
        </form>
      </Card>

      {state.success && state.data && (
        <Card className="animate-in fade-in-50">
          <CardHeader>
            <CardTitle className="font-headline">
              Possible Conditions
            </CardTitle>
            <CardDescription>
              Based on your symptoms. Consult a doctor for confirmation.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {state.data.conditions.map((condition, index) => (
              <div
                key={index}
                className="rounded-lg border bg-card p-4"
              >
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  <Lightbulb className="h-5 w-5 text-primary" />
                  {condition.name}
                </h3>
                <p className="text-muted-foreground mt-1">
                  {condition.description}
                </p>
              </div>
            ))}
          </CardContent>
          <CardFooter>
            <p className="text-xs text-muted-foreground">
              Source: AI analysis. Not medical advice.
            </p>
          </CardFooter>
        </Card>
      )}

      {!state.success && state.message && (
        <Card className="border-destructive bg-destructive/10">
          <CardHeader className="flex-row items-center gap-4 space-y-0">
            <AlertCircle className="h-8 w-8 text-destructive" />
            <div>
              <CardTitle className="font-headline text-destructive">
                Error
              </CardTitle>
              <CardDescription className="text-destructive/80">
                {state.message}
              </CardDescription>
            </div>
          </CardHeader>
        </Card>
      )}
    </div>
  );
}
