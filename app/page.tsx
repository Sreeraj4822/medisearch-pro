import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  CalendarPlus,
  FileText,
  HeartPulse,
  Hospital,
  Pill,
  Sparkles,
  Stethoscope,
} from 'lucide-react';
import Link from 'next/link';
import PageHeader from '@/components/page-header';

const features = [
  {
    title: 'AI Search Engine',
    description: 'Ask our AI about medicines, symptoms, and providers.',
    href: '/search',
    icon: <Sparkles className="size-8 text-primary" />,
  },
  {
    title: 'Medicine Info',
    description: 'Find detailed information on any drug.',
    href: '/medicines',
    icon: <Pill className="size-8 text-primary" />,
  },
  {
    title: 'Symptom Checker',
    description: 'Get potential conditions based on symptoms.',
    href: '/symptoms',
    icon: <Stethoscope className="size-8 text-primary" />,
  },
  {
    title: 'Hospital Directory',
    description: 'Search our directory of hospitals.',
    href: '/hospitals',
    icon: <Hospital className="size-8 text-primary" />,
  },
  {
    title: 'Doctor Finder',
    description: 'Find the right specialist for your needs.',
    href: '/doctors',
    icon: <HeartPulse className="size-8 text-primary" />,
  },
  {
    title: 'Report Analyzer',
    description: 'Get an AI analysis of your blood test report.',
    href: '/summarizer',
    icon: <FileText className="size-8 text-primary" />,
  },
  {
    title: 'Appointment Reminders',
    description: 'Add and track your upcoming appointments.',
    href: '/reminders',
    icon: <CalendarPlus className="size-8 text-primary" />,
  },
];

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="Welcome to MediSearch Pro"
        description="Your intelligent partner for navigating the world of medical information. Select an option below to get started."
      />

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {features.map((feature) => (
          <Link href={feature.href} key={feature.href}>
            <Card className="h-full transform-gpu transition-all duration-200 ease-in-out hover:-translate-y-1 hover:shadow-xl">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="font-headline text-lg font-medium">
                  {feature.title}
                </CardTitle>
                {feature.icon}
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
