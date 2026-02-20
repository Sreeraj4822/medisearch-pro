
'use client';

import { useState, useMemo } from 'react';
import { hospitals } from '@/lib/data';
import type { Hospital } from '@/lib/definitions';
import PageHeader from '@/components/page-header';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Star } from 'lucide-react';

export default function HospitalsPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredHospitals = useMemo(() => {
    if (!searchQuery) return hospitals;
    return hospitals.filter(
      (hospital) =>
        hospital.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        hospital.location.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="Hospital Directory"
        description="Search for hospitals by name or location."
      />

      <div className="relative">
        <Input
          type="search"
          placeholder="e.g., 'Apollo Hospital' or 'Chennai'"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full"
        />
      </div>

      {filteredHospitals.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filteredHospitals.map((hospital: Hospital) => (
            <Card key={hospital.id} className="flex flex-col">
              <CardHeader className="p-0">
                 <Image
                    src={hospital.image.url}
                    alt={`Exterior of ${hospital.name}`}
                    width={600}
                    height={400}
                    data-ai-hint={hospital.image.hint}
                    className="aspect-video w-full rounded-t-lg object-cover"
                />
              </CardHeader>
              <CardContent className="flex-grow pt-6 space-y-4">
                 <div className="space-y-1">
                    <div className="flex justify-between items-start">
                        <CardTitle className="font-headline text-xl">{hospital.name}</CardTitle>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Star className="size-4 fill-yellow-400 text-yellow-500" />
                            <span>{hospital.reviews.rating} ({hospital.reviews.count})</span>
                        </div>
                    </div>
                    <p className="text-md text-muted-foreground">{hospital.location}</p>
                 </div>
                 <div>
                    <h4 className="font-semibold mb-2">Services</h4>
                    <div className="flex flex-wrap gap-2">
                        {hospital.services.slice(0, 4).map((service) => (
                            <Badge key={service} variant="secondary">{service}</Badge>
                        ))}
                    </div>
                 </div>
              </CardContent>
              <CardFooter>
                 <p className="text-xs text-muted-foreground">Source: {hospital.dataSource}</p>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="flex h-64 w-full flex-col items-center justify-center text-center">
            <CardHeader>
                <CardTitle className="font-headline">No Hospitals Found</CardTitle>
            </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Your search for "{searchQuery}" did not match any hospitals.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
