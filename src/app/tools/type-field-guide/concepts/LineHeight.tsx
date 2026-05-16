import { ConceptSection } from '../ConceptSection';
import { LineHeightDemo } from './LineHeightDemo';

/**
 * The line-height concept. This is the template every later concept follows:
 * a <ConceptSection> wrapper, two or three .tfg-prose paragraphs of plain
 * explanation, then one interactive demo. The prose is static and server
 * rendered; only <LineHeightDemo> is a client component.
 */
export function LineHeight() {
  return (
    <ConceptSection eyebrow="line height" heading="Line height">
      <p className="tfg-prose">
        Line height is the space from one line of text to the next. Browsers
        default to roughly 1.2, which is often too tight for body text. The
        lines sit close, the eye trips going from the end of one to the start
        of the next, and reading gets quietly tiring.
      </p>
      <p className="tfg-prose">
        For body text, somewhere around 1.5 is a safe starting point. Bigger
        text needs proportionally less, so headings usually want something
        tighter, often in the 1.1 to 1.3 range. A heading set at body line
        height can look like it is coming apart.
      </p>
      <p className="tfg-prose">
        Here is the trick worth keeping. Squint at a paragraph until the words
        go blurry. You want an even gray. If it looks striped and dark, the
        line height is probably too tight. If it looks washed out and gappy,
        it is too loose.
      </p>
      <LineHeightDemo />
    </ConceptSection>
  );
}
