import type { Metadata } from 'next';
import Link from 'next/link';
import { ShaderGradientLab } from './ShaderGradientLab';
import { tools } from '@/lib/tools';

export const metadata: Metadata = {
  title: 'Shader Gradient Lab — Cargo',
  description:
    'A custom WebGL2 gradient generator. Faithful Neat port plus curated Shadertoy shaders. Tweak waves, colors, flow, and grain in real-time. Export as PNG.',
};

export default function ShaderGradientLabPage() {
  const tool = tools.find((t) => t.id === 'shader-gradient-lab')!;

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
            A faithful WebGL2 port of Neat&apos;s gradient shader, plus two curated
            Shadertoy effects. One editor: per-shader, the dials it can&apos;t use
            are greyed. Pick a preset, tweak the dials, export a PNG.
          </p>
        </header>
        <ShaderGradientLab />
      </div>
    </main>
  );
}
