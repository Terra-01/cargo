import { ConceptSection } from '../ConceptSection';
import { TypeScaleDemo } from './TypeScaleDemo';

/**
 * The type-scale concept. Follows the line-height template: a
 * <ConceptSection> wrapper, prose, then one demo. The prose is static and
 * server rendered; only <TypeScaleDemo> is a client component.
 */
export function TypeScale() {
  return (
    <ConceptSection eyebrow="type scale" heading="The type scale">
      <p className="tfg-prose">
        Most people pick font sizes by feel. 14 here, 22 there, 32 for the big
        heading, whatever looks right in the moment. It works until the
        project grows and the sizes start to multiply, and then nothing quite
        lines up.
      </p>
      <p className="tfg-prose">
        A type scale fixes that. Pick a base size, usually 16 pixels, and a
        ratio. Every size is the one below it multiplied by the ratio. The
        sizes relate to each other because they are all built from the same
        number, like notes spaced evenly apart.
      </p>
      <p className="tfg-prose">
        A tight ratio like 1.2 keeps everything close, which suits dashboards
        and apps with a lot of text. A wide ratio like 1.5 spreads the sizes
        far apart, which suits a marketing page that wants one enormous
        headline. Neither is correct. They are different tools.
      </p>
      <TypeScaleDemo />
    </ConceptSection>
  );
}
