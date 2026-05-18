import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Notes — Cargo',
  description: 'A devlog. What got built, and what got learned building it.',
};

const prose = {
  fontSize: 'var(--text-md)',
  lineHeight: 1.75,
  color: 'var(--text-muted)',
  maxWidth: '66ch',
  marginBottom: 'var(--space-5)',
};

const session = {
  marginTop: 'var(--space-16)',
  marginBottom: 'var(--space-10)',
};

const part = {
  marginTop: 'var(--space-12)',
};

const partTitle = {
  marginTop: 'var(--space-3)',
  marginBottom: 'var(--space-5)',
};

const roadmap = {
  marginTop: 'var(--space-20)',
  paddingTop: 'var(--space-12)',
  borderTop: '1px solid var(--border)',
};

export default function NotesPage() {
  return (
    <main className="container">
      <div className="tool-page">
        <header className="tool-page__header">
          <p className="eyebrow tool-page__eyebrow">{'// the devlog'}</p>
          <h1 className="tool-page__title">Notes from the workshop.</h1>
          <p className="tool-page__desc">
            A log of what gets built here, and what gets learned building it. It starts today, so there is not much of it yet. One Saturday, in parts.
          </p>
        </header>

        <h2 className="heading heading--lg" style={session}>
          Saturday One
        </h2>

        <section style={part}>
          <p className="eyebrow">{'// part one'}</p>
          <h3 className="heading heading--md" style={partTitle}>
            Tearing down the gradient tool
          </h3>
          <p style={prose}>
            The gradient tool got rebuilt from nothing. The old version had a flaw I had been ignoring for a while: every preset pulled from the same small set of colors, so they all looked like siblings. In the picker you genuinely could not tell them apart.
          </p>
          <p style={prose}>
            The new one is built on an open-source gradient library, ported with some care so it behaves like the real thing and not a rough copy of it. It got procedural textures, presets that actually look like different ideas, and a way to take your gradient with you, either as a single file or a snippet for a page you are already building. The picker shows real thumbnails now, each one rendered from the actual shader, so you choose with your eyes.
          </p>
          <p style={prose}>This was most of the day.</p>
        </section>

        <section style={part}>
          <p className="eyebrow">{'// part two'}</p>
          <h3 className="heading heading--md" style={partTitle}>
            Halving the animation library, then doubling it
          </h3>
          <p style={prose}>
            The text animation tool had a hundred animations and too many of them were filler. So every one went up for review, side by side with a hundred from another library, each one watched while it played, each one kept or cut. Fifty four got cut.
          </p>
          <p style={prose}>
            The thing I did not expect: most of the other library&apos;s animations were worth keeping, and the reason was subtle. They animate each letter on its own. Ours mostly moved the whole word at once. A fade that lands letter by letter and a fade that lands all at once look like the same animation in a list and are not the same animation at all. So both stayed. The catalogue is a hundred and forty six now, bigger than it started, and not padded.
          </p>
        </section>

        <section style={part}>
          <p className="eyebrow">{'// part three'}</p>
          <h3 className="heading heading--md" style={partTitle}>
            A bug that had been wrong for a long time
          </h3>
          <p style={prose}>
            While rebuilding the library I found out why the bouncy animations never felt right. Every bounce, every elastic, every rubber band had been using the wrong easing curve. A smoothing one. The keyframes were describing a bounce and the easing was flattening it the entire time.
          </p>
          <p style={prose}>
            Nobody had reported it, because it was not broken. It just felt slightly lifeless and there was no obvious reason why. Those are the bugs that last the longest.
          </p>
        </section>

        <section style={part}>
          <p className="eyebrow">{'// part four'}</p>
          <h3 className="heading heading--md" style={partTitle}>
            Being wrong, on the record
          </h3>
          <p style={prose}>
            Not everything today was a clean line. I was sure one of the glitch animations was mistimed and rewrote it to be faster. It got looked at, playing, and the original was simply better. I put mine in the bin. Twice I miscounted how many animations had survived the review and had to walk the number back, once in a document that disagreed with its own table.
          </p>
          <p style={prose}>
            I am writing that down on purpose. A devlog where every call lands perfectly is not a log, it is a brochure. The work was lumpy. It corrected itself a few times. That is what the work is actually like.
          </p>
        </section>

        <section style={part}>
          <p className="eyebrow">{'// part five'}</p>
          <h3 className="heading heading--md" style={partTitle}>
            On doing this one Saturday at a time
          </h3>
          <p style={prose}>
            Everything above is one Saturday. That is the whole project so far, and writing it out makes the pace honest. There is no sprint here and nothing is behind schedule, because there is no schedule. A tool gets the time it needs and ships when it is done.
          </p>
          <p style={prose}>
            The reward of building this way is that nothing has to be a minimum viable anything. The cost is that it is slow. That trade feels right. The log will grow one Saturday at a time, same as the workshop.
          </p>
        </section>

        <section style={roadmap}>
          <p className="eyebrow">{'// the roadmap'}</p>
          <h2 className="heading heading--md" style={partTitle}>
            The roadmap, loosely
          </h2>
          <p style={prose}>
            A roadmap for a side project is a wishlist. Read it as one. No order, no dates.
          </p>
          <p style={prose}>
            The CSS Effect Lab got the same teardown the gradient tool got. It went from a single effect to a small playground of them, and it is better for it.
          </p>
          <p style={prose}>
            The dictionary of interface patterns that was circling got built. It shipped as the UI Pattern Library, a searchable reference of the small reusable pieces every web project rebuilds, with a position on when not to use each one.
          </p>
          <p style={prose}>
            The Component Prompt Builder was retired. It was a thin idea that did not earn its place next to the rest, so it came out rather than linger half believed in.
          </p>
          <p style={prose}>
            The Mockup Wrapper is the one still waiting. It could use more frames and a cleaner way to export, and that is the next obvious Saturday.
          </p>
          <p style={prose}>
            If you are reading this and that would help you, that is a good reason for it to jump the queue.
          </p>
        </section>
      </div>
    </main>
  );
}
