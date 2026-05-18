import { type CausalChain as Chain, dimensionFor } from '@/lib/spec-pressure-test';

/**
 * One causal chain, rendered as a single cause-and-effect sequence:
 *
 *   the gap  ->  the assumption  ->  the consequence
 *
 * Not three independent boxes. The three stages share one escalating spine
 * (neutral gap, the wrong turn, the failure) and are joined by explicit
 * "leads to" connectors so the reader feels the progression. Presentational
 * and server-rendered (same family as the Type Field Guide's ConceptSection);
 * the .spt-* classes live once in the page's <style> block.
 */

const STAGES = [
  { key: 'gap', tag: 'the gap', caption: 'what the spec left unsaid' },
  { key: 'assumption', tag: 'the assumption', caption: 'what the agent fills in instead' },
  { key: 'consequence', tag: 'the consequence', caption: 'the failure that ships' },
] as const;

export function CausalChain({ chain, index }: { chain: Chain; index: number }) {
  const dim = dimensionFor(chain.dimension);

  return (
    <article
      className="spt-chain"
      data-testid="spt-chain"
      data-dimension={chain.dimension}
    >
      <header className="spt-chain__head">
        <p className="eyebrow spt-chain__eyebrow">
          {'// '}
          {String(index).padStart(2, '0')} · {dim.name}
        </p>
        <p className="spt-chain__blurb">{dim.blurb}</p>
      </header>

      <div className="spt-flow">
        {STAGES.map((s, i) => (
          <div className="spt-stage-wrap" key={s.key}>
            <section
              className={`spt-stage spt-stage--${s.key}`}
              data-testid={`spt-stage-${s.key}`}
            >
              <p className="spt-stage__label">
                <span className="spt-stage__tag">{s.tag}</span>
                <span className="spt-stage__caption">{s.caption}</span>
              </p>
              <p className="spt-stage__text">{chain[s.key]}</p>
            </section>
            {i < STAGES.length - 1 && (
              <p className="spt-connector" aria-hidden="true">
                <span className="spt-connector__line" />
                <span className="spt-connector__word">leads to</span>
                <span className="spt-connector__arrow">&#8595;</span>
              </p>
            )}
          </div>
        ))}
      </div>
    </article>
  );
}
