
'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  CalendarPlus,
  FileText,
  Hospital,
  LayoutDashboard,
  Pill,
  Sparkles,
  Stethoscope,
} from 'lucide-react';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarTrigger,
  SidebarFooter,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

const navItems = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/search', label: 'AI Search', icon: Sparkles },
  { href: '/medicines', label: 'Medicines', icon: Pill },
  { href: '/symptoms', label: 'Symptom Checker', icon: Stethoscope },
  { href: '/hospitals', label: 'Hospitals', icon: Hospital },
  { href: '/summarizer', label: 'Report Analyzer', icon: FileText },
  { href: '/reminders', label: 'Reminders', icon: CalendarPlus },
];

const MedicalPlusIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M12 5v14" />
    <path d="M5 12h14" />
  </svg>
);

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="shrink-0 bg-primary/20 hover:bg-primary/30 text-primary"
              asChild
            >
              <Link href="/">
                <MedicalPlusIcon className="size-5" />
                <span className="sr-only">MediSearch Pro</span>
              </Link>
            </Button>
            <h1 className="font-headline text-lg font-semibold tracking-tight">
              MediSearch Pro
            </h1>
          </div>
        </SidebarHeader>

        <SidebarContent>
          <SidebarMenu>
            {navItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === item.href}
                  tooltip={item.label}
                >
                  <Link href={item.href}>
                    <item.icon />
                    <span>{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>

        <SidebarFooter>
          <Separator className="my-2" />
          <p className="px-2 text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} MediSearch Pro
          </p>
        </SidebarFooter>
      </Sidebar>

      <SidebarInset>
        <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background/80 px-4 backdrop-blur-sm md:hidden">
          <SidebarTrigger />
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="shrink-0 bg-primary/20 hover:bg-primary/30 text-primary"
              asChild
            >
              <Link href="/">
                <MedicalPlusIcon className="size-5" />
              </Link>
            </Button>
            <h1 className="font-headline text-lg font-semibold tracking-tight">
              MediSearch Pro
            </h1>
          </div>
        </header>

        <main className="flex-1 p-4 md:p-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}