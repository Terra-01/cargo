import type { Metadata } from 'next';
import Link from 'next/link';
import { MockupWrapper } from './MockupWrapper';
import { tools } from '@/lib/tools';

export const metadata: Metadata = {
  title: 'Mockup Wrapper — Cargo',
  description: 'Drop in a screenshot, get it framed in browser chrome or a clean card. Export as PNG.',
};

export default function MockupWrapperPage() {
  const tool = tools.find((t) => t.id === 'mockup-wrapper')!;

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
            Drop in a screenshot. Pick a frame, a background, a little shadow. Download the PNG.
          </p>
        </header>
        <MockupWrapper />
      </div>
    </main>
  );
}
