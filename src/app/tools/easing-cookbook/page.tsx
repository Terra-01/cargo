import type { Metadata } from 'next';
import Link from 'next/link';
import { EasingCookbook } from './EasingCookbook';
import { tools } from '@/lib/tools';

export const metadata: Metadata = {
  title: 'Easing Cookbook — Cargo',
  description: 'Sixteen curated CSS easing functions, side by side. Click to copy.',
};

export default function EasingCookbookPage() {
  const tool = tools.find((t) => t.id === 'easing-cookbook')!;

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
            Sixteen curated cubic-bezier easings, drawn and animated side by side. Click any card to copy its value.
          </p>
        </header>
        <EasingCookbook />
      </div>
    </main>
  );
}
