import type { Metadata } from 'next';
import './globals.css';
import { Topbar } from '@/components/Topbar';
import { Footer } from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Cargo — small tools for people who make things',
  description: 'A workshop of free single-purpose utilities for designers and vibe coders.',
  icons: {
    icon: '/favicon.svg',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Topbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
