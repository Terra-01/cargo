import { ManifestStrip } from '@/components/ManifestStrip';

export default function Home() {
  return (
    <main className="container">
      <section className="hero">
        <p className="eyebrow hero__eyebrow">// design system · v0.1</p>
        <h1 className="hero__title">
          Small tools for people who <em>make things</em> on the web.
        </h1>
        <p className="hero__lead">
          A workshop of single-purpose utilities for designers and vibe coders. The first batch is in the workshop right now.
        </p>
      </section>

      <ManifestStrip shipped={0} planned={13} version="0.1.0" />

      <section style={{ padding: 'var(--space-12) 0', textAlign: 'center' }}>
        <p className="serif-flourish" style={{ fontSize: 'var(--text-xl)', color: 'var(--text-muted)' }}>
          The first tools are arriving soon.
        </p>
      </section>
    </main>
  );
}
