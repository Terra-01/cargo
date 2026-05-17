// CSS Effect Lab — effect registry.
//
// Each effect is a working recipe: it renders well on arrival and exposes
// 2–3 *character* knobs (color, spread, intensity). All structural plumbing
// (pseudo-elements, layered filters) is baked into build() and never shown
// as a control.
//
// The core honesty guarantee: build() returns ONE css string. The preview
// injects that exact string into a <style> tag and the export shows that
// exact string. What you copy is, by construction, what you see.
//
// Each effect also declares its own export `sections`. The shared
// ExportPanel renders whatever is declared — an effect with ::before/::after
// blocks plus a requirements note, and a filter-only single-rule effect,
// both flow through the same component unchanged.

export type RangeKnob = {
  id: string;
  label: string;
  kind: 'range';
  min: number;
  max: number;
  step: number;
  unit: string;
  def: number;
};

export type ColorKnob = {
  id: string;
  label: string;
  kind: 'color';
  def: string;
};

export type Knob = RangeKnob | ColorKnob;

export type KnobValues = Record<string, number | string>;

export type ExportSection =
  | { kind: 'code'; lang: 'css' | 'html'; label: string; slug: string; code: string }
  | { kind: 'note'; label: string; slug: string; text: string };

export interface EffectRecipe {
  /** The exact CSS the preview renders AND the user copies. One source of truth. */
  css: string;
  /** Declarative export sections — the export component renders whatever is here. */
  sections: ExportSection[];
}

export interface Effect {
  id: string;
  name: string;
  blurb: string;
  /** The class the recipe targets and the preview element wears. */
  selector: string;
  /** Which realistic preview target this effect mounts on. `card` and
      `shape` force their own surface; `panel` is a content surface with NO
      forced background, so an effect whose recipe paints its own background
      (grain over gradient) renders faithfully in the preview. */
  target: 'card' | 'shape' | 'panel';
  /** The backdrop the effect arrives on so the recipe reads on arrival.
      The toggle stays fully manual after. Defaults to 'dark'. */
  arrivalBackdrop?: 'dark' | 'light';
  knobs: Knob[];
  build: (v: KnobValues) => EffectRecipe;
}

/** The starting recipe state for an effect: every knob at its default. */
export function defaults(effect: Effect): KnobValues {
  return Object.fromEntries(effect.knobs.map((k) => [k.id, k.def]));
}

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const h = hex.replace('#', '');
  const full = h.length === 3 ? h.split('').map((c) => c + c).join('') : h;
  return {
    r: parseInt(full.slice(0, 2), 16) || 0,
    g: parseInt(full.slice(2, 4), 16) || 0,
    b: parseInt(full.slice(4, 6), 16) || 0,
  };
}

function rgbToHsl(r: number, g: number, b: number): { h: number; s: number; l: number } {
  const rn = r / 255;
  const gn = g / 255;
  const bn = b / 255;
  const max = Math.max(rn, gn, bn);
  const min = Math.min(rn, gn, bn);
  const d = max - min;
  let h = 0;
  if (d !== 0) {
    if (max === rn) h = ((gn - bn) / d) % 6;
    else if (max === gn) h = (bn - rn) / d + 2;
    else h = (rn - gn) / d + 4;
    h = Math.round(h * 60);
    if (h < 0) h += 360;
  }
  const l = (max + min) / 2;
  const s = d === 0 ? 0 : d / (1 - Math.abs(2 * l - 1));
  return { h, s: Math.round(s * 100), l: Math.round(l * 100) };
}

const HTML_NONE =
  'Works on any single element. No special markup needed: add the class to the element you want the effect on.';

// — Effect 1: Glow border ——————————————————————————————————————————————
// The full export model. Two pseudo-elements: ::after draws the crisp edge,
// ::before holds the same color blurred so light spills past the edge. Needs
// a positioning context, which is baked in and called out in the note.
const glowBorder: Effect = {
  id: 'glow-border',
  name: 'Glow border',
  blurb: 'A crisp edge with soft colored light radiating outward from it.',
  selector: 'glow-border',
  target: 'card',
  knobs: [
    { id: 'color', label: 'glow color', kind: 'color', def: '#FB923C' },
    { id: 'spread', label: 'glow spread', kind: 'range', min: 2, max: 40, step: 1, unit: 'px', def: 16 },
    { id: 'sharp', label: 'border sharpness', kind: 'range', min: 0, max: 100, step: 1, unit: '', def: 65 },
  ],
  build: (v) => {
    const color = String(v.color);
    const spread = Number(v.spread);
    const sharp = Number(v.sharp);
    // Sharpness drives the crisp ::after edge — thin & faint when soft,
    // thick & solid when crisp; the glow eases off as the edge takes over.
    const edge = (0.75 + (sharp / 100) * 2).toFixed(2);
    const edgeOpacity = (0.45 + (sharp / 100) * 0.55).toFixed(2);
    const glowOpacity = (0.9 - (sharp / 100) * 0.2).toFixed(2);

    const css = `.glow-border {
  position: relative;
  border-radius: 16px;
}
.glow-border::before {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: inherit;
  border: 2px solid ${color};
  filter: blur(${spread}px);
  opacity: ${glowOpacity};
  pointer-events: none;
}
.glow-border::after {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: inherit;
  border: ${edge}px solid ${color};
  opacity: ${edgeOpacity};
  pointer-events: none;
}`;

    return {
      css,
      sections: [
        { kind: 'code', lang: 'css', label: 'CSS', slug: 'css', code: css },
        { kind: 'note', label: 'HTML', slug: 'html', text: HTML_NONE },
        {
          kind: 'note',
          label: 'Requirements',
          slug: 'requirements',
          text:
            'Needs a positioning context. position: relative is baked into the recipe so the ::before and ::after layers anchor to the element box. Drop the class on any element that can carry pseudo-elements.',
        },
      ],
    };
  },
};

// — Effect 2: Shape-aware drop shadow ———————————————————————————————————
// The deliberate structural opposite: filter-only, no pseudo-elements, no
// markup. A layered drop-shadow() stack for a soft, realistic shadow that
// follows the element's true silhouette.
const shapeShadow: Effect = {
  id: 'shape-shadow',
  name: 'Shape-aware drop shadow',
  blurb: 'A shadow that follows the real silhouette, not the rectangular box.',
  selector: 'shape-shadow',
  target: 'shape',
  arrivalBackdrop: 'light', // a soft dark shadow needs a light surface to read
  knobs: [
    { id: 'color', label: 'shadow color', kind: 'color', def: '#0B0B12' },
    { id: 'depth', label: 'shadow depth', kind: 'range', min: 2, max: 48, step: 1, unit: 'px', def: 18 },
    { id: 'soft', label: 'shadow softness', kind: 'range', min: 1, max: 40, step: 1, unit: 'px', def: 16 },
  ],
  build: (v) => {
    const { r, g, b } = hexToRgb(String(v.color));
    const depth = Number(v.depth);
    const soft = Number(v.soft);
    // Two layers: a tight contact shadow plus a wider diffuse one — the
    // stack reads as one soft, realistic shadow.
    const d1 = Math.round(depth * 0.35);
    const s1 = Math.round(soft * 0.55);
    const d2 = depth;
    const s2 = Math.round(soft * 1.6);

    const css = `.shape-shadow {
  filter:
    drop-shadow(0 ${d1}px ${s1}px rgba(${r}, ${g}, ${b}, 0.30))
    drop-shadow(0 ${d2}px ${s2}px rgba(${r}, ${g}, ${b}, 0.22));
}`;

    return {
      css,
      sections: [
        { kind: 'code', lang: 'css', label: 'CSS', slug: 'css', code: css },
        { kind: 'note', label: 'HTML', slug: 'html', text: HTML_NONE },
        {
          kind: 'note',
          label: 'Requirements',
          slug: 'requirements',
          text:
            'Use this on shaped or transparent elements: clip-path shapes, notched cards, transparent PNGs, inline SVG. filter: drop-shadow() traces the real alpha silhouette so the shadow hugs the actual shape. box-shadow cannot do this; it always draws the rectangular border box.',
        },
      ],
    };
  },
};

// — Effect 3: Layered glow ————————————————————————————————————————————
// The straightforward sibling of glow border. A convincing glow is not one
// shadow: it is several stacked radial-gradients of different sizes on a
// ::before that sits behind the element. The stack and the pseudo-element
// are the structure, baked in; only color, size, intensity are exposed.
const layeredGlow: Effect = {
  id: 'layered-glow',
  name: 'Layered glow',
  blurb: 'A soft, rich glow that reads like real light, not a flat blur.',
  selector: 'layered-glow',
  target: 'card',
  knobs: [
    { id: 'color', label: 'glow color', kind: 'color', def: '#8B5CF6' },
    { id: 'size', label: 'glow size', kind: 'range', min: 10, max: 120, step: 1, unit: 'px', def: 60 },
    { id: 'intensity', label: 'glow intensity', kind: 'range', min: 20, max: 100, step: 1, unit: '', def: 70 },
  ],
  build: (v) => {
    const { r, g, b } = hexToRgb(String(v.color));
    const size = Number(v.size);
    const f = Number(v.intensity) / 100;
    // Three stacked radials: a bright dense core, a mid body, a wide faint
    // wash. Intensity scales the alphas together; size sets the reach.
    const aCore = (0.55 * f).toFixed(2);
    const aMid = (0.32 * f).toFixed(2);
    const aWide = (0.16 * f).toFixed(2);

    const css = `.layered-glow {
  position: relative;
  border-radius: 16px;
}
.layered-glow::before {
  content: "";
  position: absolute;
  inset: -${size}px;
  border-radius: inherit;
  background:
    radial-gradient(circle at 50% 50%, rgba(${r}, ${g}, ${b}, ${aWide}), transparent 78%),
    radial-gradient(circle at 50% 50%, rgba(${r}, ${g}, ${b}, ${aMid}), transparent 58%),
    radial-gradient(circle at 50% 50%, rgba(${r}, ${g}, ${b}, ${aCore}), transparent 40%);
  z-index: -1;
  pointer-events: none;
}`;

    return {
      css,
      sections: [
        { kind: 'code', lang: 'css', label: 'CSS', slug: 'css', code: css },
        { kind: 'note', label: 'HTML', slug: 'html', text: HTML_NONE },
        {
          kind: 'note',
          label: 'Requirements',
          slug: 'requirements',
          text:
            'Needs a positioning context. position: relative is baked into the recipe so the ::before glow anchors to the element box and sits behind it. Drop the class on any element that can carry a pseudo-element.',
        },
      ],
    };
  },
};

// — Effect 4: Animated gradient border ————————————————————————————————
// The heavy effect. A conic-gradient on a ::before behind the element, its
// start angle driven by a registered custom property (@property --angle)
// so it can be smoothly animated, a @keyframes spinning that angle 0→360,
// and a prefers-reduced-motion fallback that stops the spin (the border
// stays, just static). All of it is the recipe; only the knobs are exposed.
const gradientBorder: Effect = {
  id: 'gradient-border',
  name: 'Animated gradient border',
  blurb: 'A gradient border that slowly rotates around the element.',
  selector: 'gradient-border',
  target: 'card',
  knobs: [
    { id: 'color', label: 'gradient color', kind: 'color', def: '#6366F1' },
    { id: 'thickness', label: 'border thickness', kind: 'range', min: 1, max: 8, step: 1, unit: 'px', def: 3 },
    { id: 'duration', label: 'spin duration', kind: 'range', min: 2, max: 16, step: 1, unit: 's', def: 6 },
  ],
  build: (v) => {
    const { r, g, b } = hexToRgb(String(v.color));
    const { h, s, l } = rgbToHsl(r, g, b);
    const thickness = Number(v.thickness);
    const duration = Number(v.duration);
    // One color knob drives the whole gradient (consistent with how the
    // other effects treat color): a four-stop spectrum seeded from the
    // chosen hue, looping back so the rotation is seamless.
    const stop = (deg: number) => `hsl(${(h + deg) % 360}, ${s}%, ${l}%)`;
    const c0 = stop(0);
    const c1 = stop(90);
    const c2 = stop(180);
    const c3 = stop(270);

    const css = `.gradient-border {
  position: relative;
  border-radius: 16px;
  background: #14141A;
}
.gradient-border::before {
  content: "";
  position: absolute;
  inset: -${thickness}px;
  border-radius: inherit;
  background: conic-gradient(from var(--angle), ${c0}, ${c1}, ${c2}, ${c3}, ${c0});
  z-index: -1;
  animation: gradient-border-spin ${duration}s linear infinite;
}
@property --angle {
  syntax: "<angle>";
  inherits: false;
  initial-value: 0deg;
}
@keyframes gradient-border-spin {
  to {
    --angle: 360deg;
  }
}
@media (prefers-reduced-motion: reduce) {
  .gradient-border::before {
    animation: none;
  }
}`;

    return {
      css,
      sections: [
        { kind: 'code', lang: 'css', label: 'CSS', slug: 'css', code: css },
        { kind: 'note', label: 'HTML', slug: 'html', text: HTML_NONE },
        {
          kind: 'note',
          label: 'Requirements',
          slug: 'requirements',
          text:
            'Two things to know. First, the rotation needs @property to register --angle as an animatable angle. Support is good in current browsers; very old browsers cannot register it and fall back to a static gradient border instead of an animated one, which degrades gracefully. Second, the recipe respects prefers-reduced-motion: when the user asks for reduced motion the border stops rotating and stays a static gradient border.',
        },
      ],
    };
  },
};

// — Effect 5: Spotlight ————————————————————————————————————————————————
// A cone of light cast across the surface. A conic-gradient is the beam; a
// radial-gradient mask fades it with distance so it never ends in a hard
// line. It rides a ::before over the surface. The stage has isolation:
// isolate (M2) so the pseudo-element renders correctly in the preview.
const spotlight: Effect = {
  id: 'spotlight',
  name: 'Spotlight',
  blurb: 'A cone of light cast across the surface, like a lamp pointed at it.',
  selector: 'spotlight',
  target: 'card',
  knobs: [
    { id: 'color', label: 'light color', kind: 'color', def: '#FFE9B8' },
    { id: 'width', label: 'cone width', kind: 'range', min: 20, max: 170, step: 1, unit: 'deg', def: 80 },
    { id: 'soft', label: 'edge softness', kind: 'range', min: 0, max: 100, step: 1, unit: '', def: 55 },
  ],
  build: (v) => {
    const { r, g, b } = hexToRgb(String(v.color));
    const width = Number(v.width);
    const soft = Number(v.soft);
    // Half-angle of the beam; a bright plateau in the middle that shrinks
    // as softness rises, leaving a longer fade to the cone edges.
    const half = Math.round(width / 2);
    const plateau = Math.round(half * (1 - soft / 100));
    // The mask fades the beam with distance from its origin; softer edges
    // push the fade out further so the wash is gentler.
    const maskSolid = 22;
    const maskFade = 45 + Math.round((soft / 100) * 35);
    const lit = `rgba(${r}, ${g}, ${b}, 0.55)`;

    const css = `.spotlight {
  position: relative;
  border-radius: 16px;
  overflow: hidden;
}
.spotlight::before {
  content: "";
  position: absolute;
  inset: 0;
  pointer-events: none;
  background: conic-gradient(
    from 180deg at 50% 0%,
    ${lit} 0deg,
    ${lit} ${plateau}deg,
    transparent ${half}deg,
    transparent ${360 - half}deg,
    ${lit} ${360 - plateau}deg,
    ${lit} 360deg
  );
  -webkit-mask: radial-gradient(circle at 50% 0%, #000 0%, #000 ${maskSolid}%, transparent ${maskFade}%);
          mask: radial-gradient(circle at 50% 0%, #000 0%, #000 ${maskSolid}%, transparent ${maskFade}%);
}`;

    return {
      css,
      sections: [
        { kind: 'code', lang: 'css', label: 'CSS', slug: 'css', code: css },
        { kind: 'note', label: 'HTML', slug: 'html', text: HTML_NONE },
        {
          kind: 'note',
          label: 'Requirements',
          slug: 'requirements',
          text:
            'Needs a positioning context. position: relative is baked into the recipe so the ::before beam anchors to the element box, and overflow: hidden keeps the light inside it. The fade uses mask: the unprefixed property is widely supported, and a -webkit-mask line is included for older engines.',
        },
      ],
    };
  },
};

// — Effect 6: Grain over gradient ——————————————————————————————————————
// A gradient with a fine film of SVG noise over it, which kills the flat
// banding that makes CSS gradients look cheap. The noise is an feTurbulence
// filter delivered as a URL-encoded data-URI inside the CSS: no separate
// markup, the whole effect stays one CSS rule and the honesty guarantee
// stays simple. The encoding is the gotcha: # < > spaces must be encoded
// or the data-URI fails silently. encodeURIComponent handles all of them.
const grainGradient: Effect = {
  id: 'grain-gradient',
  name: 'Grain over gradient',
  blurb: 'A gradient with a film of noise over it, killing the cheap banding.',
  selector: 'grain-gradient',
  target: 'panel', // the recipe paints its own gradient; no forced surface
  knobs: [
    { id: 'color', label: 'gradient color', kind: 'color', def: '#6D5BD0' },
    { id: 'intensity', label: 'grain intensity', kind: 'range', min: 0, max: 100, step: 1, unit: '', def: 42 },
    { id: 'scale', label: 'grain scale', kind: 'range', min: 20, max: 100, step: 1, unit: '', def: 65 },
  ],
  build: (v) => {
    const { r, g, b } = hexToRgb(String(v.color));
    const { h, s, l } = rgbToHsl(r, g, b);
    const intensity = Number(v.intensity);
    const scale = Number(v.scale);
    // One color knob seeds a two-stop diagonal gradient (consistent with
    // the other effects); the second stop is hue-shifted and darker.
    const c1 = `hsl(${h}, ${s}%, ${l}%)`;
    const c2 = `hsl(${(h + 40) % 360}, ${s}%, ${Math.max(0, l - 20)}%)`;
    const opacity = ((intensity / 100) * 0.55).toFixed(2);
    // baseFrequency: higher = finer grain. Maps 20..100 → 0.40..1.20.
    const baseFreq = (0.4 + ((scale - 20) / 80) * 0.8).toFixed(2);
    // Single-quoted SVG so encodeURIComponent (which does not touch ') gives
    // a fully-safe data-URI: it encodes # < > = / spaces, so url(#g) becomes
    // url(%23g) and the classic silent-# truncation cannot happen.
    const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='140' height='140'><filter id='g'><feTurbulence type='fractalNoise' baseFrequency='${baseFreq}' numOctaves='2' stitchTiles='stitch'/><feColorMatrix type='saturate' values='0'/></filter><rect width='140' height='140' filter='url(#g)'/></svg>`;
    const noise = `data:image/svg+xml,${encodeURIComponent(svg)}`;

    const css = `.grain-gradient {
  position: relative;
  border-radius: 16px;
  overflow: hidden;
  background: linear-gradient(135deg, ${c1}, ${c2});
}
.grain-gradient::before {
  content: "";
  position: absolute;
  inset: 0;
  pointer-events: none;
  background-image: url("${noise}");
  opacity: ${opacity};
  mix-blend-mode: overlay;
}`;

    return {
      css,
      sections: [
        { kind: 'code', lang: 'css', label: 'CSS', slug: 'css', code: css },
        { kind: 'note', label: 'HTML', slug: 'html', text: HTML_NONE },
        {
          kind: 'note',
          label: 'Requirements',
          slug: 'requirements',
          text:
            'The grain is generated by an SVG feTurbulence filter embedded in the CSS as a URL-encoded data-URI, so there is no separate file or markup. The long encoded string in background-image is that SVG. Nothing for you to do; it is self-contained.',
        },
      ],
    };
  },
};

export const effects: Effect[] = [
  glowBorder,
  shapeShadow,
  layeredGlow,
  gradientBorder,
  spotlight,
  grainGradient,
];
