import type { Metadata } from 'next';
import './globals.css';
import { Topbar } from '@/components/Topbar';
import { Footer } from '@/components/Footer';

// Absolute base for canonical + Open Graph URLs. Set NEXT_PUBLIC_SITE_URL for a
// custom domain; on Vercel the production URL is picked up automatically; local
// dev falls back to localhost so metadata still resolves.
const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : 'http://localhost:3000');

const title = 'Cargo — small tools for people who make things';
const description =
  'A workshop of free single-purpose utilities for designers and vibe coders.';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  // No title template: every page already sets its own "<Tool> — Cargo".
  title,
  description,
  applicationName: 'Cargo',
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    siteName: 'Cargo',
    title,
    description,
    url: '/',
    locale: 'en',
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
  },
  icons: {
    icon: '/favicon.svg',
  },
};

// Applies the saved theme before first paint, so a visitor who chose dark on a
// light-mode OS does not get a flash of light. Static author-written string, no
// interpolation. `auto` intentionally sets nothing and lets the CSS
// prefers-color-scheme rules win.
const THEME_SCRIPT = `try{var t=localStorage.getItem('cargo-theme');if(t==='light'||t==='dark')document.documentElement.setAttribute('data-theme',t)}catch(e){}`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
      </head>
      <body>
        <a href="#main" className="skip-link">Skip to content</a>
        <Topbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
