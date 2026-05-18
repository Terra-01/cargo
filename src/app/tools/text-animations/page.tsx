import type { Metadata } from 'next';
import Link from 'next/link';
import { TextAnimationLibrary } from './TextAnimationLibrary';
import { tools } from '@/lib/tools';

export const metadata: Metadata = {
  title: 'Text Animation Library — Cargo',
  description: '146 hand-crafted text animations — CSS and JS-driven. Browse, copy, or pick several to bundle.',
};

export default function TextAnimationsPage() {
  const tool = tools.find((t) => t.id === 'text-animations')!;

  return (
    <main className="container">
      <div className="tool-page">
        <Link href="/" className="tool-page__back">back to the workshop</Link>
        <header className="tool-page__header">
          <p className="eyebrow tool-page__eyebrow">
            {'// '}{tool.category} · cargo/{tool.number}
          </p>
          <h1 className="tool-page__title">{tool.title}</h1>
          <p className="tool-page__desc">
            A catalog of 146 text animations, CSS and JS-driven. Most loop on their own; hover or tap a hover card to play it. Tap cards to pick several, then copy them as one bundle.
          </p>
        </header>
        <TextAnimationLibrary />
      </div>
    </main>
  );
}
