import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About — Cargo',
  description: 'What Cargo is, and what it is built on.',
};

const prose = {
  fontSize: 'var(--text-md)',
  lineHeight: 1.75,
  color: 'var(--text-muted)',
  maxWidth: '66ch',
  marginBottom: 'var(--space-5)',
};

const softHeader = {
  marginTop: 'var(--space-12)',
  marginBottom: 'var(--space-5)',
};

export default function AboutPage() {
  return (
    <main id="main" className="container">
      <div className="tool-page">
        <header className="tool-page__header">
          <p className="eyebrow tool-page__eyebrow">{'// about'}</p>
          <h1 className="tool-page__title">A workshop, not a product.</h1>
          <p className="tool-page__desc">
            Cargo is a small set of tools for people who make things on the web. It is free, it has no accounts, and it is built slowly.
          </p>
        </header>

        <p style={prose}>
          Cargo is a workshop. Every tool in it does one small thing and tries to do that one thing well. A playground for CSS effects. A library of text animations you can copy. A wrapper that frames a screenshot. None of them want to be a platform. They are the kind of tool you open once, take what you need, and close.
        </p>
        <p style={prose}>
          It is free and it stays free. Nothing to sign up for, nothing tracked, no ads now or later. If a tool helps you, take what it gives you and go build your thing. That is the whole transaction.
        </p>
        <p style={prose}>
          It gets built one Saturday at a time. Cargo is a side project and it moves at the speed of a side project. Some weekends a whole tool ships. Some weekends a single bug gets fixed and that is the weekend. The slowness is not a problem to solve, it is the point. Each tool gets to be properly finished before the next one starts, which is a luxury most software never gets.
        </p>

        <h2 className="heading heading--md" style={softHeader}>
          Built on other people&apos;s work
        </h2>
        <p style={prose}>
          Cargo does not stand on its own. The gradient tool is a port of <strong>Neat</strong>, an open-source gradient library by <strong>FireCMS</strong>. Two of its shaders, &ldquo;Rainbow&rdquo; and &ldquo;Ether&rdquo;, come from <strong>Shadertoy</strong>, the second by an author who goes by <strong>nimitz</strong>. The text animation library follows a collection of a hundred animations published by <strong>川合卓也 (Takuya Kawai)</strong> of <strong>KAWAI DESIGN</strong>, and many of the effects in it are older still, tracing back to <strong>Animate.css</strong> by <strong>Daniel Eden</strong>. The type is <strong>Manrope</strong>, <strong>Instrument Serif</strong> and <strong>IBM Plex Mono</strong>, all open-licensed. None of those people know this project exists. The work they shared openly made a good part of Cargo possible, and that is worth saying plainly.
        </p>
        <p style={prose}>
          Every one of those debts is written down properly, with author, source and license, in the project&apos;s{' '}
          <a
            href="https://github.com/Terra-01/cargo/blob/main/THIRD-PARTY-NOTICES.md"
            className="about__link"
            target="_blank"
            rel="noreferrer"
          >
            third-party notices
          </a>
          . Cargo itself is MIT licensed. A few of the files it borrows are not, and that file says exactly which.
        </p>
      </div>

      <section className="principle">
        <p className="eyebrow principle__eyebrow">{'// the cargo principle'}</p>
        <p className="principle__quote">
          &ldquo;Build the tool you wish existed, then ship it on a Saturday.&rdquo;
        </p>
      </section>
    </main>
  );
}
