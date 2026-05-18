import { SPEC_DIMENSIONS, chainsForDimension } from '@/lib/spec-pressure-test';
import { CausalChain } from './CausalChain';

/**
 * Mode 2: the self-check. Where the user transfers the habit the worked
 * examples taught, applied to their own feature description.
 *
 * It is composition, not new machinery: the 8 SPEC_DIMENSIONS, each with its
 * causalQuestion (data), and for each a native <details> that surfaces the
 * matching chain from every worked example via the existing CausalChain
 * component (chainsForDimension is pure derivation over existing data).
 *
 * No AI, no tally, no score, no persistence. The tool does not read the
 * user's spec; it asks the question and shows a concrete failure of that
 * dimension. Server-rendered, no client state (same family as the rest of
 * the tool).
 */
export function SelfCheck() {
  return (
    <section className="spt-mode" data-testid="spt-selfcheck">
      <p className="eyebrow spt-mode__eyebrow">{'// mode 02 · the self-check'}</p>
      <h2 className="heading heading--lg spt-mode__heading">
        Now pressure-test your own spec
      </h2>
      <p className="spt-mode__lead">
        Bring your own feature description and work it against the same eight
        dimensions the examples were broken down by. The tool does not read
        your spec, you do. There is no score and nothing to submit: the point
        is not to pass, it is to see the gap before an agent fills it. For
        each dimension, ask the question of your own spec, then open the
        chains to see what leaving it unsaid did to four real ones.
      </p>

      <div className="spt-check">
        {SPEC_DIMENSIONS.map((dim, i) => (
          <section
            className="spt-check__dim"
            key={dim.id}
            data-testid="spt-check-dim"
            data-dimension={dim.id}
          >
            <p className="eyebrow spt-check__eyebrow">
              {'// '}
              {String(i + 1).padStart(2, '0')} · {dim.name}
            </p>
            <p className="spt-check__question" data-testid="spt-check-question">
              {dim.causalQuestion}
            </p>

            <details className="spt-disclosure">
              <summary className="spt-disclosure__summary">
                see what leaving this unsaid did to four real specs
              </summary>
              <div className="spt-disclosure__body">
                {chainsForDimension(dim.id).map(({ example, chain }) => (
                  <div className="spt-linked" key={example.id}>
                    <p className="spt-linked__from">from: {example.name}</p>
                    <CausalChain chain={chain} index={i + 1} />
                  </div>
                ))}
              </div>
            </details>
          </section>
        ))}
      </div>

      <p className="spt-check__closer">
        That is the whole skill. Eight questions, asked before you hand the
        spec over, not explained after the incident.
      </p>
    </section>
  );
}
