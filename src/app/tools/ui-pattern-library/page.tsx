import type { Metadata } from 'next';
import Link from 'next/link';
import { UiPatternLibrary } from './UiPatternLibrary';
import { tools } from '@/lib/tools';

export const metadata: Metadata = {
  title: 'UI Pattern Library — Cargo',
  description:
    'A searchable library of UI patterns. Each entry says when to use it, when not to, and what to use instead, with a real interactive example.',
};

export default function UiPatternLibraryPage() {
  const tool = tools.find((t) => t.id === 'ui-pattern-library')!;

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
            A library of the UI patterns people building for the web get wrong.
            Every entry does the hard part: when to use it, when not to, what to
            reach for instead, shown with a real interactive example you can feel.
          </p>
        </header>
        <UiPatternLibrary />
      </div>
    </main>
  );
}
