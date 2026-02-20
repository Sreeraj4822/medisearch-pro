'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import PageHeader from '@/components/page-header';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Sparkles, Link as LinkIcon, AlertCircle, ShieldAlert } from 'lucide-react';
import Link from 'next/link';
import { getAiSearchResults, AiSearchFormState } from '@/lib/actions';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import React from 'react';

const initialState: AiSearchFormState = {
    success: false,
    message: '',
};

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" disabled={pending} className="absolute right-1 top-1/2 -translate-y-1/2 h-9 px-4">
            {pending ? (
                <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
                "Search"
            )}
            <span className="sr-only">Search</span>
        </Button>
    );
}

function SearchResults({ state }: { state: AiSearchFormState }) {
  const { pending } = useFormStatus();

  // Loading Skeleton
  if (pending) {
    return (
      <div className="space-y-6 animate-pulse mt-8">
        <Card>
          <CardHeader>
            <div className="h-6 w-48 bg-muted rounded-md" />
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="h-4 w-full bg-muted rounded-md" />
            <div className="h-4 w-full bg-muted rounded-md" />
            <div className="h-4 w-3/4 bg-muted rounded-md" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <div className="h-6 w-40 bg-muted rounded-md" />
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="h-16 w-full bg-muted rounded-lg" />
            <div className="h-16 w-full bg-muted rounded-lg" />
          </CardContent>
        </Card>
      </div>
    );
  }

  // Error State
  if (!state.success && state.message) {
    return (
      <Card className="border-destructive bg-destructive/10 mt-8">
        <CardHeader className="flex-row items-center gap-4 space-y-0">
          <AlertCircle className="h-8 w-8 text-destructive" />
          <div>
            <CardTitle className="font-headline text-destructive">Search Failed</CardTitle>
            <CardDescription className="text-destructive/80">{state.message}</CardDescription>
          </div>
        </CardHeader>
      </Card>
    );
  }

  // Success State
  if (state.success && state.data) {
    return (
      <div className="space-y-6 animate-in fade-in-50 mt-8">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline flex items-center gap-2">
              <Sparkles className="text-primary" /> AI Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="whitespace-pre-wrap text-base">{state.data.summary}</p>
          </CardContent>
        </Card>

        {state.data.suggestedLinks && state.data.suggestedLinks.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="font-headline">Suggested Pages</CardTitle>
              <CardDescription>Explore these pages for more information.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {state.data.suggestedLinks.map((link, index) => (
                <Link href={link.href} key={index} className="block rounded-lg border bg-card p-4 hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <LinkIcon className="h-5 w-5 text-primary" />
                    <div>
                      <h3 className="font-semibold">{link.title}</h3>
                      <p className="text-sm text-muted-foreground">{link.relevance}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </CardContent>
          </Card>
        )}

        <Alert variant="default" className="bg-muted/50">
          <ShieldAlert className="h-4 w-4" />
          <AlertTitle>Disclaimer</AlertTitle>
          <AlertDescription>{state.data.disclaimer}</AlertDescription>
        </Alert>
      </div>
    );
  }

  // Initial State
  return (
    <Card className="flex h-64 w-full flex-col items-center justify-center text-center mt-8 animate-in fade-in-50">
      <CardHeader>
        <Sparkles className="mx-auto h-12 w-12 text-primary" />
        <CardTitle className="font-headline mt-4">Ready to help</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">
          Ask a question or enter a search term above to get started.
        </p>
      </CardContent>
    </Card>
  );
}

export default function SearchPage() {
    const [state, formAction] = useActionState(getAiSearchResults, initialState);

    return (
        <div className="flex flex-col gap-8">
            <PageHeader
                title="AI Search Engine"
                description="Your intelligent medical search assistant. Ask anything about medicines, symptoms, or providers."
            />
            
            <form action={formAction}>
                <div className="relative">
                    <Sparkles className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                        name="query"
                        type="search"
                        placeholder="e.g., 'What are the side effects of Exaspirin?'"
                        className="w-full pl-10 pr-28 h-12 text-base"
                        required
                    />
                    <SubmitButton />
                </div>
                <SearchResults state={state} />
            </form>
        </div>
    );
}
