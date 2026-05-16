import { ConceptSection } from '../ConceptSection';
import { LineLengthDemo } from './LineLengthDemo';

/**
 * The line-length (measure) concept. Follows the line-height template: a
 * <ConceptSection> wrapper, prose, then one demo. The prose is static and
 * server rendered; only <LineLengthDemo> is a client component.
 */
export function LineLength() {
  return (
    <ConceptSection eyebrow="line length" heading="Line length">
      <p className="tfg-prose">
        Line length is how wide your text runs, and the way to measure it is
        by counting characters, not pixels. The comfortable range for reading
        is roughly 45 to 75 characters per line, spaces included.
      </p>
      <p className="tfg-prose">
        Go much wider and a problem called doubling shows up. The line is so
        long that when your eye jumps back to the left it cannot find the next
        line cleanly, so it lands on the one it just read. You have felt this
        on a site that runs its text the full width of a wide monitor. Go much
        narrower and the text breaks into stubs and the rhythm of reading
        keeps stalling.
      </p>
      <p className="tfg-prose">
        The fix is one line of CSS. Put a max width on your text in{' '}
        <code className="tfg-code">ch</code> units, which are sized to the
        width of a character. <code className="tfg-code">max-width: 65ch</code>{' '}
        and you are done.
      </p>
      <LineLengthDemo />
    </ConceptSection>
  );
}
