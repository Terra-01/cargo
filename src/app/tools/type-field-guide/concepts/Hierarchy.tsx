import { ConceptSection } from '../ConceptSection';
import { HierarchyDemo } from './HierarchyDemo';

/**
 * The hierarchy concept. Follows the established template: a
 * <ConceptSection> wrapper, prose, then one demo. The prose is static and
 * server rendered; only <HierarchyDemo> is a client component.
 */
export function Hierarchy() {
  return (
    <ConceptSection eyebrow="hierarchy" heading="Hierarchy">
      <p className="tfg-prose">
        Hierarchy is what lets someone scan a page instead of reading every
        word to find the part they want. It is the difference between a wall
        of text and a page with an obvious shape.
      </p>
      <p className="tfg-prose">
        It is built from three things, and the trick is that you rarely need
        big moves in all of them. A heading does not have to be huge and bold
        and spaced out. Often it just needs to be a bit bigger and a bit
        bolder, and the contrast does the work. Size sets the loudest signal.
        Weight adds emphasis without taking space. Spacing groups things, so a
        heading sits closer to the text it introduces than to the section
        above it.
      </p>
      <p className="tfg-prose">
        The most common mistake is too many levels. If everything is
        emphasized, nothing is. Most pages need about three text sizes and two
        weights.
      </p>
      <HierarchyDemo />
    </ConceptSection>
  );
}
