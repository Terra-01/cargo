import type { Metadata } from 'next';
import Link from 'next/link';
import { PromptBuilder } from './PromptBuilder';
import { tools } from '@/lib/tools';

export const metadata: Metadata = {
  title: 'Component Prompt Builder — Cargo',
  description: 'Generate sharp prompts for AI coding tools. Pick component, style, and framework.',
};

export default function PromptBuilderPage() {
  const tool = tools.find((t) => t.id === 'prompt-builder')!;

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
            Pick a component, a visual style, and a framework. Get a sharp prompt you can paste into Claude, v0, Lovable, or Cursor.
          </p>
        </header>
        <PromptBuilder />
      </div>
    </main>
  );
}
