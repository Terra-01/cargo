import type { Metadata } from 'next';
import Link from 'next/link';
import { LoadingStates } from './LoadingStates';
import { tools } from '@/lib/tools';

export const metadata: Metadata = {
  title: 'Loading States Gallery — Cargo',
  description: 'Twenty-one curated CSS loading states across seven categories. Click any card to copy HTML + CSS.',
};

export default function LoadingStatesPage() {
  const tool = tools.find((t) => t.id === 'loading-states')!;

  return (
    <main id="main" className="container">
      <div className="tool-page">
        <Link href="/" className="tool-page__back">back to the workshop</Link>
        <header className="tool-page__header">
          <p className="eyebrow tool-page__eyebrow">
            {'// '}{tool.category} · cargo/{tool.number}
          </p>
          <h1 className="tool-page__title">{tool.title}</h1>
          <p className="tool-page__desc">
            Twenty-one curated CSS loading states across skeletons, spinners, dots, bars, progress, overlays, and inline loaders. Click any card to copy the HTML and CSS as one snippet.
          </p>
        </header>
        <LoadingStates />
      </div>
    </main>
  );
}
