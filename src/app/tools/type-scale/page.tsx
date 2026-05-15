import Link from 'next/link';
import { TypeScale } from './TypeScale';
import { tools } from '@/lib/tools';

export const metadata = {
  title: 'Type & Spacing Scale — Cargo',
  description: 'Build a modular type and spacing system. Export as CSS variables.',
};

export default function TypeScalePage() {
  const tool = tools.find((t) => t.id === 'type-scale')!;

  return (
    <main className="container">
      <div className="tool-page">
        <Link href="/" className="tool-page__back">back to the workshop</Link>
        <header className="tool-page__header">
          <p className="eyebrow tool-page__eyebrow">
            // {tool.category} · cargo/{tool.number}
          </p>
          <h1 className="tool-page__title">{tool.title}</h1>
          <p className="tool-page__desc">
            Pick a ratio and a base. Watch the scale rebuild itself. Copy the CSS.
          </p>
        </header>
        <TypeScale />
      </div>
    </main>
  );
}
