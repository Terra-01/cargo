import { type WorkedExample as Example } from '@/lib/spec-pressure-test';
import { CausalChain } from './CausalChain';

/**
 * One worked example: the under-specified spec the user reads, then one
 * causal chain per dimension. Rendered entirely from a WorkedExample data
 * object, so a later milestone adds an example by appending one object to
 * `workedExamples` and changing nothing here.
 */
export function WorkedExample({ example }: { example: Example }) {
  return (
    <section className="spt-example" data-testid="spt-example">
      <p className="eyebrow spt-example__eyebrow">{'// worked example'}</p>
      <h2 className="heading heading--lg spt-example__heading">
        {example.name}
      </h2>

      <figure className="spt-brief" data-testid="spt-brief">
        <figcaption className="spt-brief__label">
          the spec you were handed
        </figcaption>
        <p className="spt-brief__text">{example.featureSpec}</p>
      </figure>

      <p className="spt-example__lead">
        It looks reasonable. It is not. Below are eight dimensions a spec has
        to settle. For each one, the gap this spec left, the specific thing an
        agent fills in instead, and the concrete failure that reaches
        production.
      </p>

      <div className="spt-chains">
        {example.chains.map((chain, i) => (
          <CausalChain key={chain.dimension} chain={chain} index={i + 1} />
        ))}
      </div>
    </section>
  );
}
