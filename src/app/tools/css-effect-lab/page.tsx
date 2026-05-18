import type { Metadata } from 'next';
import Link from 'next/link';
import { CssEffectLab } from './CssEffectLab';
import { tools } from '@/lib/tools';

export const metadata: Metadata = {
  title: 'CSS Effect Lab — Cargo',
  description: 'A lab for hard CSS effects: glow borders, layered glows, grain, and more. Tweak a recipe, copy the complete code.',
};

export default function CssEffectLabPage() {
  const tool = tools.find((t) => t.id === 'css-effect-lab')!;

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
            Hard CSS effects, built right. Pick one, tweak it, copy code that actually works.
          </p>
        </header>
        <CssEffectLab />
      </div>
    </main>
  );
}
