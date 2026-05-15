export interface SelectOption {
  id: string;
  label: string;
  description?: string;
}

export const componentTypes: SelectOption[] = [
  { id: 'card', label: 'Card' },
  { id: 'hero', label: 'Hero section' },
  { id: 'nav', label: 'Nav bar' },
  { id: 'modal', label: 'Modal dialog' },
  { id: 'form', label: 'Form' },
  { id: 'button', label: 'Button' },
  { id: 'pricing', label: 'Pricing table' },
  { id: 'footer', label: 'Footer' },
  { id: 'sidebar', label: 'Sidebar' },
  { id: 'empty-state', label: 'Empty state' },
  { id: 'dashboard-tile', label: 'Dashboard tile' },
  { id: 'login', label: 'Login screen' },
];

export const styles: SelectOption[] = [
  {
    id: 'minimal',
    label: 'Minimal',
    description: 'clean lines, generous whitespace, restrained color palette, hairline borders, no decoration unless it earns its place',
  },
  {
    id: 'brutalist',
    label: 'Brutalist',
    description: 'thick borders, raw structure, off-white or warm paper backgrounds, monospace accents, geometric shapes, intentional asymmetry',
  },
  {
    id: 'glassy',
    label: 'Glassmorphic',
    description: 'frosted backdrop-blur surfaces, semi-transparent layers, soft inner glows, sits over a vivid backdrop',
  },
  {
    id: 'editorial',
    label: 'Editorial',
    description: 'serif display typography paired with sans body, magazine-inspired layout, generous line height, italic flourishes',
  },
  {
    id: 'playful',
    label: 'Playful',
    description: 'rounded corners, bright accent colors, friendly micro-interactions, slight tilts or wobbles on hover',
  },
  {
    id: 'industrial',
    label: 'Industrial',
    description: 'monospace labels, sharper geometry, functional aesthetic, restrained accent color, shipping-label motifs',
  },
  {
    id: 'soft',
    label: 'Soft pastel',
    description: 'pastel color palette, soft drop shadows, gentle rounded shapes, low-contrast harmony',
  },
  {
    id: 'retro',
    label: 'Retro-futuristic',
    description: 'neon accents, dark backgrounds, 80s-inspired typography, scanline or grid textures, slight CRT bloom',
  },
];

export const frameworks: SelectOption[] = [
  { id: 'react-tailwind', label: 'React + Tailwind CSS' },
  { id: 'react-css',      label: 'React + CSS Modules' },
  { id: 'vue-tailwind',   label: 'Vue 3 + Tailwind CSS' },
  { id: 'html-css',       label: 'HTML + vanilla CSS' },
  { id: 'svelte',         label: 'Svelte 5' },
];

export interface BuildPromptOptions {
  componentType: string;
  style: string;
  framework: string;
  darkMode: boolean;
  notes: string;
}

export function buildPrompt(opts: BuildPromptOptions): string {
  const typeLabel = (componentTypes.find((t) => t.id === opts.componentType)?.label ?? 'component').toLowerCase();
  const styleData = styles.find((s) => s.id === opts.style);
  const frameworkLabel = frameworks.find((f) => f.id === opts.framework)?.label ?? 'React + Tailwind CSS';

  const lines: string[] = [];
  lines.push(`Build a ${typeLabel} using ${frameworkLabel}.`);
  lines.push('');
  lines.push(`Visual style: ${styleData?.label ?? 'minimal'} — ${styleData?.description ?? ''}.`);
  lines.push('');
  lines.push('Requirements:');
  lines.push('- Production-grade attention to spacing, typography, and visual hierarchy.');
  lines.push('- Accessible with proper ARIA attributes and keyboard navigation.');
  lines.push('- Responsive across desktop, tablet, and mobile.');
  if (opts.darkMode) {
    lines.push('- Support both light and dark color schemes using CSS custom properties or framework-native theming.');
  }
  const trimmedNotes = opts.notes.trim();
  if (trimmedNotes.length > 0) {
    lines.push('');
    lines.push('Additional context:');
    lines.push(trimmedNotes);
  }
  lines.push('');
  lines.push('Return the complete component code. Use semantic HTML. Avoid generic AI aesthetics — make distinctive design choices that feel intentional and considered.');
  return lines.join('\n');
}
