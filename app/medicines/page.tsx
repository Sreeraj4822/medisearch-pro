'use client';

import { useState, useMemo } from 'react';
import { medicines } from '@/lib/data';
import type { Medicine } from '@/lib/definitions';
import PageHeader from '@/components/page-header';
import { Input } from '@/components/ui/input';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function MedicinesPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredMedicines = useMemo(() => {
    if (!searchQuery) return medicines;
    return medicines.filter(
      (med) =>
        med.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        med.genericName.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="Medicine Information"
        description="Search for medicines by brand name or generic name."
      />

      <div className="relative">
        <Input
          type="search"
          placeholder="e.g., 'Exaspirin' or 'Aspirinum exempli'"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full"
        />
      </div>

      {filteredMedicines.length > 0 ? (
        <Accordion type="single" collapsible className="w-full">
          {filteredMedicines.map((med: Medicine) => (
            <AccordionItem key={med.id} value={med.id}>
              <AccordionTrigger className="text-lg hover:no-underline">
                <div>
                  <h3 className="font-headline font-semibold">{med.name}</h3>
                  <p className="text-sm text-muted-foreground">{med.genericName}</p>
                </div>
              </AccordionTrigger>
              <AccordionContent className="space-y-4 pt-2">
                <p className="text-base">{med.description}</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="space-y-1">
                        <h4 className="font-semibold">Common Uses</h4>
                        <p>{med.uses.join(', ')}</p>
                    </div>
                    <div className="space-y-1">
                        <h4 className="font-semibold">Possible Side Effects</h4>
                        <p>{med.sideEffects.join(', ')}</p>
                    </div>
                    <div className="space-y-1">
                        <h4 className="font-semibold">Dosage Information</h4>
                        <p>{med.dosages}</p>
                    </div>
                     <div className="space-y-1">
                        <h4 className="font-semibold">Interactions</h4>
                        <p>{med.interactions}</p>
                    </div>
                </div>
                <p className="pt-2 text-xs text-muted-foreground">Source: {med.dataSource}</p>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      ) : (
        <Card className="flex h-64 w-full flex-col items-center justify-center text-center">
            <CardHeader>
                <CardTitle className="font-headline">No Medicines Found</CardTitle>
            </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Your search for "{searchQuery}" did not match any medicines.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
