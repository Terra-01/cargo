import type { Metadata } from 'next';
import Link from 'next/link';
import { tools } from '@/lib/tools';
import { TypeScale } from './concepts/TypeScale';
import { LineHeight } from './concepts/LineHeight';
import { LineLength } from './concepts/LineLength';
import { Hierarchy } from './concepts/Hierarchy';
import { LetterSpacing } from './concepts/LetterSpacing';
import { WebFonts } from './concepts/WebFonts';

export const metadata: Metadata = {
  title: 'The Type Field Guide — Cargo',
  description: 'A short, hands-on guide to web typography.',
};

export default function TypeFieldGuidePage() {
  const tool = tools.find((t) => t.id === 'type-field-guide')!;

  return (
    <main className="container">
      <div className="tool-page">
        <style>{`
          .tfg-prose {
            font-size: var(--text-md);
            line-height: 1.75;
            color: var(--text-muted);
            max-width: 66ch;
            margin-bottom: var(--space-5);
          }
          .tfg-prose:last-of-type { margin-bottom: 0; }
          .tfg-intro { margin-bottom: var(--space-4); }
          .tfg-concept {
            margin-top: var(--space-20);
            padding-top: var(--space-12);
            border-top: 1px solid var(--border);
          }
          .tfg-concept__eyebrow { margin-bottom: var(--space-4); }
          .tfg-concept__heading { margin-bottom: var(--space-6); }
          .tfg-closer {
            margin-top: var(--space-20);
            padding-top: var(--space-12);
            border-top: 1px solid var(--border);
          }
          .tfg-link {
            color: var(--accent);
            text-decoration: underline;
            text-underline-offset: 2px;
            transition: color var(--t-fast) var(--ease);
          }
          .tfg-link:hover { color: var(--accent-hover); }
          .tfg-code {
            font-family: var(--font-mono);
            font-size: 0.9em;
            color: var(--text);
            background: var(--surface-muted);
            border: 1px solid var(--border);
            border-radius: var(--radius-sm);
            padding: 0.1em 0.4em;
          }
        `}</style>

        <Link href="/" className="tool-page__back">back to the workshop</Link>
        <header className="tool-page__header">
          <p className="eyebrow tool-page__eyebrow">
            // {tool.category} · cargo/{tool.number}
          </p>
          <h1 className="tool-page__title">{tool.title}</h1>
          <p className="tool-page__desc">
            Six things worth knowing about type on the web. Each one explained
            plainly, each one with something you can play with.
          </p>
        </header>

        <section className="tfg-intro">
          <p className="tfg-prose">
            Typography is a deep subject and most of it you can happily ignore.
            This is the part you cannot: a handful of ideas that decide whether
            text on a page is comfortable to read or quietly annoying.
          </p>
          <p className="tfg-prose">
            This is not a course. It is the 20 percent that fixes 80 percent of
            the mistakes. Read a little, drag the demos, and move on.
          </p>
        </section>

        <TypeScale />
        <LineHeight />
        <LineLength />
        <Hierarchy />
        <LetterSpacing />
        <WebFonts />

        <section className="tfg-closer">
          <p className="tfg-prose">
            That is the essentials. Not all of typography, but enough to make
            text on a page work and to know why when it does not.
          </p>
          <p className="tfg-prose">
            If you want to go deeper,{' '}
            <a
              className="tfg-link"
              href="https://betterwebtype.com/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Better Web Type
            </a>{' '}
            is a genuinely good free course, and{' '}
            <a
              className="tfg-link"
              href="https://practicaltypography.com/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Practical Typography
            </a>{' '}
            by Matthew Butterick is worth a read.
          </p>
        </section>
      </div>
    </main>
  );
}
