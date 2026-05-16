import { ConceptSection } from '../ConceptSection';
import { LetterSpacingDemo } from './LetterSpacingDemo';

/**
 * The letter-spacing concept. Follows the established template: a
 * <ConceptSection> wrapper, prose, then one demo. The prose is static and
 * server rendered; only <LetterSpacingDemo> is a client component.
 */
export function LetterSpacing() {
  return (
    <ConceptSection eyebrow="letter spacing" heading="Letter spacing">
      <p className="tfg-prose">
        Letter spacing is the gap between individual characters. The most
        useful thing to know about it is that body text almost never needs it
        touched. The font already has its spacing set by someone who knew what
        they were doing.
      </p>
      <p className="tfg-prose">
        There are two honest exceptions. Big headings often look better with
        slightly negative letter spacing, pulled a touch tighter, because at
        large sizes the default gaps start to look loose. And small uppercase
        text, the kind used for labels, usually wants the opposite, a little
        positive spacing, because capital letters jammed together at a small
        size are hard to read.
      </p>
      <p className="tfg-prose">
        That is the whole of it. Tighten large text a little, open up small
        caps a little, leave everything else alone.
      </p>
      <LetterSpacingDemo />
    </ConceptSection>
  );
}
