import { ConceptSection } from '../ConceptSection';
import { WebFontsDemo } from './WebFontsDemo';

/**
 * The web-fonts concept, the final one in the guide. Follows the established
 * template: a <ConceptSection> wrapper, prose, then one demo. The prose is
 * static and server rendered; only <WebFontsDemo> is a client component.
 */
export function WebFonts() {
  return (
    <ConceptSection eyebrow="web fonts" heading="Web fonts">
      <p className="tfg-prose">
        Every other part of this guide is about how type looks once it is on
        the page. This last one is about the moment it arrives.
      </p>
      <p className="tfg-prose">
        A custom font is a file, and it loads a beat after the rest of the
        page. In that beat the browser has to show something. Watch the demo:
        on one side the text appears in a fallback font right away and swaps
        to the real font when it loads, readable the whole time. On the other
        side the browser waits, and the reader gets a blank space until the
        font shows up.
      </p>
      <p className="tfg-prose">
        That difference is one CSS property,{' '}
        <code className="tfg-code">font-display</code>. Set it to{' '}
        <code className="tfg-code">swap</code> and you get the readable
        version. And before you reach for a custom font at all, look at the
        system font stack, the fonts already on the reader&apos;s device. They
        cost nothing to load, they never flash, and they look good enough that
        a lot of projects do not need anything else.
      </p>
      <WebFontsDemo />
    </ConceptSection>
  );
}
