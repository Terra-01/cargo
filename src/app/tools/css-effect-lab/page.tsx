import Link from 'next/link';
import { CssEffectLab } from './CssEffectLab';
import { tools } from '@/lib/tools';

export const metadata = {
  title: 'CSS Effect Lab — Cargo',
  description: 'A live playground for glassmorphism. Tweak parameters, copy the CSS.',
};

export default function CssEffectLabPage() {
  const tool = tools.find((t) => t.id === 'css-effect-lab')!;

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
            A live glassmorphism playground. Tweak the parameters, watch the frost react, copy the CSS.
          </p>
        </header>
        <CssEffectLab />
      </div>
    </main>
  );
}
