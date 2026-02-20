'use client';

import { useState, useMemo } from 'react';
import { doctors } from '@/lib/data';
import type { Doctor } from '@/lib/definitions';
import PageHeader from '@/components/page-header';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Star } from 'lucide-react';

export default function DoctorsPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredDoctors = useMemo(() => {
    if (!searchQuery) return doctors;
    return doctors.filter(
      (doctor) =>
        doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doctor.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doctor.location.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="Doctor Finder"
        description="Search for doctors by name, specialty, or location."
      />

      <div className="relative">
        <Input
          type="search"
          placeholder="e.g., 'Dr. Smith', 'Cardiology', or 'New York'"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full"
        />
      </div>

      {filteredDoctors.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredDoctors.map((doctor: Doctor) => (
            <Card key={doctor.id} className="flex flex-col">
              <CardHeader className="flex-col items-start">
                 <Image
                    src={doctor.image.url}
                    alt={`Photo of ${doctor.name}`}
                    width={400}
                    height={400}
                    data-ai-hint={doctor.image.hint}
                    className="aspect-square w-full rounded-lg object-cover"
                />
                <div className="pt-4 w-full">
                    <div className="flex justify-between items-start">
                        <CardTitle className="font-headline text-xl">{doctor.name}</CardTitle>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Star className="size-4 fill-yellow-400 text-yellow-500" />
                            <span>{doctor.reviews.rating} ({doctor.reviews.count})</span>
                        </div>
                    </div>
                    <p className="text-md font-medium text-primary">{doctor.specialty}</p>
                    <p className="text-sm text-muted-foreground">{doctor.location}</p>
                </div>
              </CardHeader>
              <CardContent className="flex-grow">
                <div className="flex flex-wrap gap-2">
                  {doctor.qualifications.map((q) => (
                    <Badge key={q} variant="secondary">{q}</Badge>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                 <p className="text-xs text-muted-foreground">Source: {doctor.dataSource}</p>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="flex h-64 w-full flex-col items-center justify-center text-center">
            <CardHeader>
                <CardTitle className="font-headline">No Doctors Found</CardTitle>
            </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Your search for "{searchQuery}" did not match any doctors.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
