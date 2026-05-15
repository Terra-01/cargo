import Link from 'next/link';
import { MoodboardLibrary } from './MoodboardLibrary';
import { tools } from '@/lib/tools';

export const metadata = {
  title: 'Moodboard Library — Cargo',
  description: 'Six hand-curated moodboards. Palettes, fonts, and texture direction. Copy as CSS.',
};

export default function MoodboardLibraryPage() {
  const tool = tools.find((t) => t.id === 'moodboard-library')!;

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
            Six hand-curated moodboards — palette, fonts, and texture direction. Click any card to copy the whole moodboard as a CSS snippet.
          </p>
        </header>
        <MoodboardLibrary />
      </div>
    </main>
  );
}
