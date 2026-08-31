import { ManifestStrip } from '@/components/ManifestStrip';
import { ToolCard } from '@/components/ToolCard';
import { tools, shippedCount, plannedCount } from '@/lib/tools';

export default function Home() {
  const shipped = shippedCount();
  const planned = plannedCount();

  return (
    <main id="main" className="container">
      <section className="hero">
        <p className="eyebrow hero__eyebrow">{'// a workshop · est. 2026'}</p>
        <h1 className="hero__title">
          Small tools for people who <em>make things</em> on the web.
        </h1>
        <p className="hero__lead">
          A workshop of single-purpose utilities for designers and design engineers. Free, forever. Built one Saturday at a time.
        </p>
      </section>

      <ManifestStrip shipped={shipped} planned={planned} version="0.1.0" />

      <section className="hub-section">
        <div className="hub-section__header">
          <span className="eyebrow">{'// the workshop'}</span>
        </div>
        <h2 className="heading heading--lg" style={{ marginBottom: 'var(--space-8)', maxWidth: '20ch' }}>
          What&apos;s being built.
        </h2>

        <div className="tool-list" data-testid="tool-list">
          {tools.map((tool) => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
        </div>
      </section>

      <section className="principle">
        <p className="eyebrow principle__eyebrow">{'// the cargo principle'}</p>
        <p className="principle__quote">
          &ldquo;Build the tool you wish existed, then ship it on a Saturday.&rdquo;
        </p>
      </section>
    </main>
  );
}
