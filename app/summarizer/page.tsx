'use client';

import { useFormStatus } from 'react-dom';
import { getBloodReportAnalysis, ReportAnalysisFormState } from '@/lib/actions';
import PageHeader from '@/components/page-header';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useEffect, useActionState, useRef, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { AlertCircle, FileText, Loader2, ShieldAlert, Activity, ClipboardCheck, Lightbulb } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const initialState: ReportAnalysisFormState = {
  success: false,
  message: '',
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full sm:w-auto">
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Analyzing...
        </>
      ) : (
        <>
          <FileText className="mr-2 h-4 w-4" />
          Analyze Report
        </>
      )}
    </Button>
  );
}

const severityBadgeVariants: { [key: string]: 'default' | 'secondary' | 'destructive' | 'outline' } = {
    Normal: 'secondary',
    Mild: 'outline',
    Moderate: 'default',
    Severe: 'destructive',
    Critical: 'destructive',
};

const findingTextVariants: { [key: string]: string } = {
    Normal: 'text-accent',
    Low: 'text-primary',
    High: 'text-destructive',
    Borderline: 'text-muted-foreground',
    Abnormal: 'text-foreground font-bold',
};

export default function BloodReportAnalyzerPage() {
  const [state, formAction] = useActionState(getBloodReportAnalysis, initialState);
  const { toast } = useToast();
  const hiddenInputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  useEffect(() => {
    if (!state.success && state.message) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: state.message,
      });
    }
     if (state.success) {
      // Clear file input on success
      const fileInput = document.getElementById('reportFile') as HTMLInputElement;
      if (fileInput) {
        fileInput.value = '';
      }
      setFileName(null);
    }
  }, [state, toast]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      const reader = new FileReader();
      reader.onload = (loadEvent) => {
        if (hiddenInputRef.current) {
          hiddenInputRef.current.value = loadEvent.target?.result as string;
        }
      };
      reader.readAsDataURL(file);
    } else {
      setFileName(null);
      if (hiddenInputRef.current) {
        hiddenInputRef.current.value = '';
      }
    }
  };


  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="AI Blood Report Analyzer"
        description="Upload a PDF or image of your blood test report to get an AI-powered analysis."
      />

       <Alert variant="destructive">
        <ShieldAlert className="h-4 w-4" />
        <AlertTitle>For Informational Purposes Only</AlertTitle>
        <AlertDescription>
          This tool provides an AI-generated analysis and is NOT a substitute for professional medical advice. Always consult with a qualified healthcare provider.
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Analyze Your Report</CardTitle>
          <CardDescription>
            Select a file (PDF, PNG, JPG) to upload for analysis.
          </CardDescription>
        </CardHeader>
        <form action={formAction}>
          <CardContent>
             <Input
              id="reportFile"
              name="reportFile"
              type="file"
              required
              accept=".pdf,.png,.jpg,.jpeg"
              onChange={handleFileChange}
            />
            {fileName && (
              <p className="mt-2 text-sm text-muted-foreground">
                Selected: {fileName}
              </p>
            )}
             <input type="hidden" name="reportDataUri" ref={hiddenInputRef} />
          </CardContent>
          <CardFooter className="border-t px-6 py-4">
            <SubmitButton />
          </CardFooter>
        </form>
      </Card>

      {state.success && state.data && (
        <div className="space-y-6 animate-in fade-in-50">
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline flex items-center gap-2"><ClipboardCheck />Overall Summary</CardTitle>
                    <CardDescription>A high-level overview of your report.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <p className="whitespace-pre-wrap">{state.data.summary}</p>
                    <div className="flex items-center gap-2">
                        <p className="font-semibold">Overall Severity:</p>
                        <Badge variant={severityBadgeVariants[state.data.severity] || 'secondary'} className={cn("text-base", state.data.severity === 'Critical' ? 'font-bold' : '')}>{state.data.severity}</Badge>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="font-headline flex items-center gap-2"><Activity />Key Findings</CardTitle>
                    <CardDescription>A breakdown of significant results from your report.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {state.data.keyFindings.map((finding, index) => (
                        <div key={index} className="rounded-lg border bg-card p-4">
                            <div className="flex justify-between items-start gap-4">
                                <div className="flex-1">
                                    <h3 className="font-semibold text-lg">{finding.test}</h3>
                                    <p className="text-muted-foreground">{finding.interpretation}</p>
                                </div>
                                <div className="text-right flex-shrink-0">
                                    <p className="font-bold text-lg">{finding.value}</p>
                                    <p className={cn("font-semibold", findingTextVariants[finding.finding])}>{finding.finding}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="font-headline flex items-center gap-2"><Lightbulb />Suggested Precautions</CardTitle>
                    <CardDescription>General suggestions based on the analysis. Not a medical prescription.</CardDescription>
                </CardHeader>
                <CardContent>
                    <ul className="list-disc space-y-2 pl-5">
                        {state.data.suggestedPrecautions.map((precaution, index) => (
                            <li key={index}>{precaution}</li>
                        ))}
                    </ul>
                </CardContent>
            </Card>

            <Alert variant="default" className="bg-muted/50">
                <ShieldAlert className="h-4 w-4" />
                <AlertTitle>Disclaimer</AlertTitle>
                <AlertDescription>{state.data.disclaimer}</AlertDescription>
            </Alert>
        </div>
      )}

      {!state.success && state.message && (
        <Card className="border-destructive bg-destructive/10">
          <CardHeader className="flex-row items-center gap-4 space-y-0">
            <AlertCircle className="h-8 w-8 text-destructive" />
            <div>
                <CardTitle className="font-headline text-destructive">Analysis Failed</CardTitle>
                <CardDescription className="text-destructive/80">{state.message}</CardDescription>
            </div>
          </CardHeader>
        </Card>
      )}
    </div>
  );
}
