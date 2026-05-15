export type MoodboardCategory = 'warm' | 'cool' | 'soft' | 'high-contrast';

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
    category: 'warm',
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
    },
  },
  {
    id: '90s-memphis',
    number: '02',
    name: '90s Memphis',
    tagline: 'Cartoons, geometry, and a complete refusal to be quiet.',
    category: 'high-contrast',
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
    },
  },
  {
    id: 'scandinavian-quiet',
    number: '03',
    name: 'Scandinavian Quiet',
    tagline: 'Soft daylight on careful objects.',
    category: 'soft',
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
    },
  },
  {
    id: 'tokyo-at-3am',
    number: '04',
    name: 'Tokyo at 3am',
    tagline: 'Vending-machine glow on wet asphalt.',
    category: 'cool',
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
    },
  },
  {
    id: 'brutalist-office',
    number: '05',
    name: 'Brutalist Office',
    tagline: 'A copy room in 1973, but on purpose.',
    category: 'warm',
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
    },
  },
  {
    id: 'soft-lab',
    number: '06',
    name: 'Soft Lab',
    tagline: 'Pastels with a clinical edge.',
    category: 'soft',
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
    },
  },
];

export function buildMoodboardSnippet(mb: Moodboard): string {
  const longest = Math.max(...mb.palette.map((c) => c.label.length));
  const pad = (s: string) => s + ' '.repeat(Math.max(0, longest - s.length));
  const paletteLines = mb.palette
    .map((c) => `  --${pad(c.label)}: ${c.hex};`)
    .join('\n');

  return `/* CARGO/07 · Moodboard: ${mb.name} */
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
