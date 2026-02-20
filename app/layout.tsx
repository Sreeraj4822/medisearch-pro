import type { Metadata } from 'next';
import './globals.css';
import { cn } from '@/lib/utils';
import { AppShell } from '@/components/app-shell';
import { Toaster } from '@/components/ui/toaster';

export const metadata: Metadata = {
  title: 'MediSearch Pro',
  description: 'AI-powered medical information platform',
  manifest: '/manifest.json',
  icons: {
    icon: '/icon-192.png',
    apple: '/icon-192.png',
  },
  themeColor: '#64B5F6',
};

export const viewport = {
  themeColor: '#64B5F6',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn('font-body antialiased')}>
        <AppShell>{children}</AppShell>
        <Toaster />
      </body>
    </html>
  );
}