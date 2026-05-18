export type MoodboardCategory =
  | 'editorial'
  | 'brutalist'
  | 'minimal'
  | 'maximal'
  | 'retro'
  | 'organic';

export interface PaletteColor {
  label: string; // CSS-identifier-safe: lowercase + hyphens only
  hex: string;
}

export interface MoodboardSpecimen {
  // Background, foreground (text), and accent shape colors for the SVG specimen card.
  // Hexes — chosen explicitly per moodboard so each card has the right contrast.
  bg: string;
  fg: string;
  accent: string;
  // Fallback CSS font-family stack when the real heading face isn't installed.
  // Picks a system family that captures the vibe (display, serif, mono, etc.).
  headingFallback: string;
  // Whether the big "Aa" specimen renders italic. Declared per board rather
  // than sniffed from the font name: the heading face's italic suitability is
  // a design decision, not something derivable from the string. Editorial and
  // text-serif faces are italic; sans, display, mono, pixel, and the
  // intentionally-unstyled "browser default" board are upright.
  headingIsItalic: boolean;
}

export interface Moodboard {
  id: string;
  number: string; // 01..06, padded
  name: string;
  tagline: string;
  category: MoodboardCategory;
  palette: PaletteColor[]; // always 4 colors
  fonts: { heading: string; body: string };
  textures: string;
  specimen: MoodboardSpecimen;
}

export const moodboards: Moodboard[] = [
  {
    id: 'mediterranean-dusk',
    number: '01',
    name: 'Mediterranean Dusk',
    tagline: 'Heat, terracotta, the last hour of light.',
    category: 'organic',
    palette: [
      { label: 'terracotta', hex: '#C2410C' },
      { label: 'mustard',    hex: '#FCD34D' },
      { label: 'olive',      hex: '#4D7C0F' },
      { label: 'denim',      hex: '#1E40AF' },
    ],
    fonts: { heading: 'Instrument Serif', body: 'General Sans' },
    textures: 'matte clay, raw linen',
    specimen: {
      bg: '#C2410C',
      fg: '#FCD34D',
      accent: '#4D7C0F',
      headingFallback: 'Georgia, "Times New Roman", serif',
      headingIsItalic: true,
    },
  },
  {
    id: '90s-memphis',
    number: '02',
    name: '90s Memphis',
    tagline: 'Cartoons, geometry, and a complete refusal to be quiet.',
    category: 'retro',
    palette: [
      { label: 'ink',         hex: '#0F0F0E' },
      { label: 'hot-pink',    hex: '#EC4899' },
      { label: 'electric',    hex: '#FACC15' },
      { label: 'cyan',        hex: '#06B6D4' },
    ],
    fonts: { heading: 'Druk', body: 'IBM Plex Sans' },
    textures: 'checkerboard, neon plastic, squiggles',
    specimen: {
      bg: '#0F0F0E',
      fg: '#FACC15',
      accent: '#EC4899',
      headingFallback: '"Helvetica Neue", "Arial Black", sans-serif',
      headingIsItalic: false,
    },
  },
  {
    id: 'scandinavian-quiet',
    number: '03',
    name: 'Scandinavian Quiet',
    tagline: 'Soft daylight on careful objects.',
    category: 'minimal',
    palette: [
      { label: 'bone',     hex: '#F5F1EA' },
      { label: 'smoke',    hex: '#6B7280' },
      { label: 'sage',     hex: '#84A98C' },
      { label: 'espresso', hex: '#44403C' },
    ],
    fonts: { heading: 'Söhne', body: 'Plain' },
    textures: 'bleached wood, wool, ceramic',
    specimen: {
      bg: '#F5F1EA',
      fg: '#44403C',
      accent: '#84A98C',
      headingFallback: '"Helvetica Neue", Helvetica, system-ui, sans-serif',
      headingIsItalic: false,
    },
  },
  {
    id: 'tokyo-at-3am',
    number: '04',
    name: 'Tokyo at 3am',
    tagline: 'Vending-machine glow on wet asphalt.',
    category: 'maximal',
    palette: [
      { label: 'ink',     hex: '#0A0A0A' },
      { label: 'coral',   hex: '#FB7185' },
      { label: 'cyan',    hex: '#67E8F9' },
      { label: 'oxblood', hex: '#7F1D1D' },
    ],
    fonts: { heading: 'Migra', body: 'Pangea' },
    textures: 'wet asphalt, neon glass, condensation',
    specimen: {
      bg: '#0A0A0A',
      fg: '#67E8F9',
      accent: '#FB7185',
      headingFallback: 'Georgia, "Playfair Display", serif',
      headingIsItalic: true,
    },
  },
  {
    id: 'brutalist-office',
    number: '05',
    name: 'Brutalist Office',
    tagline: 'A copy room in 1973, but on purpose.',
    category: 'brutalist',
    palette: [
      { label: 'paper',    hex: '#F5F1E8' },
      { label: 'ink',      hex: '#18181B' },
      { label: 'marigold', hex: '#F59E0B' },
      { label: 'oxblood',  hex: '#991B1B' },
    ],
    fonts: { heading: 'Druk', body: 'JetBrains Mono' },
    textures: 'concrete, manila card, rubber stamp',
    specimen: {
      bg: '#F5F1E8',
      fg: '#18181B',
      accent: '#F59E0B',
      headingFallback: '"Arial Black", "Helvetica Neue", Impact, sans-serif',
      headingIsItalic: false,
    },
  },
  {
    id: 'soft-lab',
    number: '06',
    name: 'Soft Lab',
    tagline: 'Pastels with a clinical edge.',
    category: 'minimal',
    palette: [
      { label: 'celadon',  hex: '#C7E2D3' },
      { label: 'blush',    hex: '#FBD3D4' },
      { label: 'butter',   hex: '#FEF3C7' },
      { label: 'lavender', hex: '#DDD6FE' },
    ],
    fonts: { heading: 'PP Editorial New', body: 'General Sans' },
    textures: 'frosted glass, soft suede, ceramic',
    specimen: {
      bg: '#DDD6FE',
      fg: '#3F2E78',
      accent: '#FBD3D4',
      headingFallback: '"Playfair Display", Georgia, "Times New Roman", serif',
      headingIsItalic: true,
    },
  },
  {
    id: 'reading-room',
    number: '07',
    name: 'Reading Room',
    tagline: 'A long essay and the whole afternoon to read it.',
    category: 'editorial',
    palette: [
      { label: 'paper',  hex: '#F4ECDF' },
      { label: 'ink',    hex: '#26211C' },
      { label: 'claret', hex: '#7B341E' },
      { label: 'fog',    hex: '#C9C1B3' },
    ],
    fonts: { heading: 'Canela', body: 'Tiempos Text' },
    textures: 'uncoated paper, thread binding, deckle edge',
    specimen: {
      bg: '#F4ECDF',
      fg: '#26211C',
      accent: '#7B341E',
      headingFallback: 'Georgia, "Times New Roman", serif',
      headingIsItalic: true,
    },
  },
  {
    id: 'broadsheet',
    number: '08',
    name: 'Broadsheet',
    tagline: 'Set tight, printed by morning.',
    category: 'editorial',
    palette: [
      { label: 'newsprint', hex: '#ECEAE3' },
      { label: 'black',     hex: '#111111' },
      { label: 'press-red', hex: '#C8102E' },
      { label: 'rule-grey', hex: '#9CA3AF' },
    ],
    fonts: { heading: 'Miller', body: 'Franklin Gothic' },
    textures: 'newsprint, smudged ink, fold crease',
    specimen: {
      bg: '#ECEAE3',
      fg: '#111111',
      accent: '#C8102E',
      headingFallback: 'Georgia, "Times New Roman", serif',
      headingIsItalic: true,
    },
  },
  {
    id: 'the-long-read',
    number: '09',
    name: 'The Long Read',
    tagline: 'No deadline. Read it slowly.',
    category: 'editorial',
    palette: [
      { label: 'oat',      hex: '#EDE6D6' },
      { label: 'soft-ink', hex: '#3B362F' },
      { label: 'moss',     hex: '#6B7F66' },
      { label: 'cloud',    hex: '#D7D0C0' },
    ],
    fonts: { heading: 'Domaine Display', body: 'Source Serif Pro' },
    textures: 'matte stock, soft shadow, wide margin',
    specimen: {
      bg: '#EDE6D6',
      fg: '#3B362F',
      accent: '#6B7F66',
      headingFallback: '"Playfair Display", Georgia, serif',
      headingIsItalic: true,
    },
  },
  {
    id: 'concrete-and-caution',
    number: '10',
    name: 'Concrete and Caution',
    tagline: 'Hard hat area. Mind the type.',
    category: 'brutalist',
    palette: [
      { label: 'concrete',    hex: '#71706B' },
      { label: 'hazard',      hex: '#FFD400' },
      { label: 'black',       hex: '#0D0D0D' },
      { label: 'warning-red', hex: '#C81E1E' },
    ],
    fonts: { heading: 'Space Grotesk', body: 'Space Mono' },
    textures: 'poured concrete, hazard tape, stencil paint',
    specimen: {
      bg: '#71706B',
      fg: '#0D0D0D',
      accent: '#FFD400',
      headingFallback: '"Arial Black", "Helvetica Neue", Impact, sans-serif',
      headingIsItalic: false,
    },
  },
  {
    id: 'default-styles',
    number: '11',
    name: 'Default Styles',
    tagline: 'No CSS. That is the design.',
    category: 'brutalist',
    palette: [
      { label: 'white',           hex: '#FFFFFF' },
      { label: 'link-blue',       hex: '#0000EE' },
      { label: 'visited-purple',  hex: '#551A8B' },
      { label: 'black',           hex: '#000000' },
    ],
    fonts: { heading: 'Times New Roman', body: 'Arial' },
    textures: 'raw HTML, blue underline, blinking cursor',
    specimen: {
      bg: '#FFFFFF',
      fg: '#000000',
      accent: '#0000EE',
      headingFallback: 'Times, "Times New Roman", serif',
      headingIsItalic: false,
    },
  },
  {
    id: 'gallery-white',
    number: '12',
    name: 'Gallery White',
    tagline: 'One painting, one wall, nothing else.',
    category: 'minimal',
    palette: [
      { label: 'gallery',  hex: '#FBFBF9' },
      { label: 'plaster',  hex: '#EFEEEA' },
      { label: 'mist',     hex: '#DAD9D3' },
      { label: 'graphite', hex: '#2E2E2B' },
    ],
    fonts: { heading: 'Neue Haas Grotesk Display', body: 'Neue Haas Grotesk Text' },
    textures: 'white plaster, paper label, raking light',
    specimen: {
      bg: '#FBFBF9',
      fg: '#2E2E2B',
      accent: '#DAD9D3',
      headingFallback: '"Helvetica Neue", Helvetica, system-ui, sans-serif',
      headingIsItalic: false,
    },
  },
  {
    id: 'carnival',
    number: '13',
    name: 'Carnival',
    tagline: 'Every color shouting at once, and loving it.',
    category: 'maximal',
    palette: [
      { label: 'fairground-red', hex: '#E11D2A' },
      { label: 'cobalt',         hex: '#1D4ED8' },
      { label: 'sunshine',       hex: '#FBBF24' },
      { label: 'grass',          hex: '#16A34A' },
    ],
    fonts: { heading: 'Obviously', body: 'GT Maru' },
    textures: 'striped canvas, popcorn grease, string lights',
    specimen: {
      bg: '#1D4ED8',
      fg: '#FBBF24',
      accent: '#E11D2A',
      headingFallback: '"Arial Black", Impact, "Helvetica Neue", sans-serif',
      headingIsItalic: false,
    },
  },
  {
    id: 'acid-bloom',
    number: '14',
    name: 'Acid Bloom',
    tagline: 'Flyer ink that still glows at 4am.',
    category: 'maximal',
    palette: [
      { label: 'acid-lime',  hex: '#CCFF00' },
      { label: 'magenta',    hex: '#FF00A8' },
      { label: 'cyan',       hex: '#22D3EE' },
      { label: 'near-black', hex: '#0A0A0F' },
    ],
    fonts: { heading: 'Monument Extended', body: 'PP Neue Montreal' },
    textures: 'photocopier toner, blacklight, smudged flyer',
    specimen: {
      bg: '#0A0A0F',
      fg: '#CCFF00',
      accent: '#FF00A8',
      headingFallback: '"Arial Black", Impact, sans-serif',
      headingIsItalic: false,
    },
  },
  {
    id: 'arcade-sunset',
    number: '15',
    name: 'Arcade Sunset',
    tagline: 'The sun sets, eight bits at a time.',
    category: 'retro',
    palette: [
      { label: 'pixel-orange', hex: '#FF6B35' },
      { label: 'hot-pink',     hex: '#FF3C9E' },
      { label: 'grape',        hex: '#7B2FBE' },
      { label: 'dusk-navy',    hex: '#1B1340' },
    ],
    fonts: { heading: 'Silkscreen', body: 'Space Mono' },
    textures: 'CRT scanlines, dithered gradient, arcade glow',
    specimen: {
      bg: '#1B1340',
      fg: '#FF6B35',
      accent: '#FF3C9E',
      headingFallback: 'ui-monospace, "Courier New", monospace',
      headingIsItalic: false,
    },
  },
  {
    id: 'rec-room',
    number: '16',
    name: 'Rec Room',
    tagline: 'Shag carpet, a hi-fi, and good light.',
    category: 'retro',
    palette: [
      { label: 'walnut',       hex: '#6B4226' },
      { label: 'harvest-gold', hex: '#D99A2B' },
      { label: 'avocado',      hex: '#6B8E23' },
      { label: 'cream',        hex: '#EFE4CF' },
    ],
    fonts: { heading: 'Cooper BT', body: 'Hanken Grotesk' },
    textures: 'wood veneer, shag pile, faded film',
    specimen: {
      bg: '#6B4226',
      fg: '#EFE4CF',
      accent: '#D99A2B',
      headingFallback: 'Georgia, "Palatino Linotype", serif',
      headingIsItalic: false,
    },
  },
  {
    id: 'forest-floor',
    number: '17',
    name: 'Forest Floor',
    tagline: 'Wet bark, deep moss, no sky.',
    category: 'organic',
    palette: [
      { label: 'pine',   hex: '#1F3D2B' },
      { label: 'moss',   hex: '#5C7A4A' },
      { label: 'bark',   hex: '#4A3826' },
      { label: 'lichen', hex: '#C7D1B0' },
    ],
    fonts: { heading: 'Fraunces', body: 'Work Sans' },
    textures: 'wet bark, leaf litter, moss',
    specimen: {
      bg: '#1F3D2B',
      fg: '#C7D1B0',
      accent: '#5C7A4A',
      headingFallback: 'Georgia, "Times New Roman", serif',
      headingIsItalic: true,
    },
  },
  {
    id: 'hand-and-kiln',
    number: '18',
    name: 'Hand and Kiln',
    tagline: 'Thrown by hand, fired slow.',
    category: 'organic',
    palette: [
      { label: 'undyed-wool', hex: '#E8E0D1' },
      { label: 'raw-clay',    hex: '#B07A57' },
      { label: 'flax',        hex: '#CFC3A8' },
      { label: 'indigo-dye',  hex: '#3A4A63' },
    ],
    fonts: { heading: 'GT Alpina', body: 'Spectral' },
    textures: 'raw ceramic, undyed wool, kiln ash',
    specimen: {
      bg: '#E8E0D1',
      fg: '#3A4A63',
      accent: '#B07A57',
      headingFallback: 'Georgia, "Times New Roman", serif',
      headingIsItalic: true,
    },
  },
];

export function buildMoodboardSnippet(mb: Moodboard): string {
  const longest = Math.max(...mb.palette.map((c) => c.label.length));
  const pad = (s: string) => s + ' '.repeat(Math.max(0, longest - s.length));
  const paletteLines = mb.palette
    .map((c) => `  --${pad(c.label)}: ${c.hex};`)
    .join('\n');

  return `/* Cargo · Moodboard: ${mb.name} */
/* ${mb.tagline} */
:root {
  /* Palette */
${paletteLines}
}

/* Type direction */
/* Heading — ${mb.fonts.heading} */
/* Body    — ${mb.fonts.body} */

/* Texture direction */
/* ${mb.textures} */`;
}
