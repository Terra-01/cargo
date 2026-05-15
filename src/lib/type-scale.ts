export interface RatioOption {
  id: string;
  label: string;
  value: number;
}

export interface FontOption {
  id: string;
  label: string;
  // Concrete CSS font-family stack (not a CSS variable so the inline style applies independently of the page tokens)
  stack: string;
}

export const fontOptions: FontOption[] = [
  { id: 'sans',   label: 'Sans',         stack: '"Inter", "Helvetica Neue", system-ui, -apple-system, sans-serif' },
  { id: 'serif',  label: 'Serif',        stack: '"Instrument Serif", "Times New Roman", Georgia, serif' },
  { id: 'mono',   label: 'Mono',         stack: '"JetBrains Mono", ui-monospace, "SF Mono", Menlo, monospace' },
  { id: 'system', label: 'System',       stack: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' },
];

export const TEXT_MAX_LENGTH = 15;

export const ratios: RatioOption[] = [
  { id: 'major-second',   label: 'Major Second · 1.125',   value: 1.125 },
  { id: 'minor-third',    label: 'Minor Third · 1.2',      value: 1.2 },
  { id: 'major-third',    label: 'Major Third · 1.25',     value: 1.25 },
  { id: 'perfect-fourth', label: 'Perfect Fourth · 1.333', value: 1.333 },
  { id: 'aug-fourth',     label: 'Augmented Fourth · 1.414', value: 1.414 },
  { id: 'perfect-fifth',  label: 'Perfect Fifth · 1.5',    value: 1.5 },
  { id: 'golden',         label: 'Golden Ratio · 1.618',   value: 1.618 },
  { id: 'minor-sixth',    label: 'Minor Sixth · 1.667',    value: 1.667 },
  { id: 'major-sixth',    label: 'Major Sixth · 1.8',      value: 1.8 },
];

const SIZE_NAMES_UP   = ['lg', 'xl', '2xl', '3xl', '4xl', '5xl', '6xl', '7xl'];
const SIZE_NAMES_DOWN = ['sm', 'xs', '2xs'];

export interface TypeStep {
  name: string;
  size: number;
  isBase: boolean;
}

export interface SpaceStep {
  name: string;
  value: number;
  multiplier: number;
}

export function generateTypeScale(
  base: number,
  ratio: number,
  stepsUp: number,
  stepsDown: number
): TypeStep[] {
  const steps: TypeStep[] = [];
  // Largest-to-smallest (top-down display order)
  for (let i = stepsUp; i > 0; i--) {
    steps.push({
      name: `text-${SIZE_NAMES_UP[i - 1]}`,
      size: Math.round(base * Math.pow(ratio, i)),
      isBase: false,
    });
  }
  steps.push({ name: 'text-base', size: base, isBase: true });
  for (let i = 1; i <= stepsDown; i++) {
    steps.push({
      name: `text-${SIZE_NAMES_DOWN[i - 1]}`,
      size: Math.round(base / Math.pow(ratio, i)),
      isBase: false,
    });
  }
  return steps;
}

export function generateSpacingScale(baseUnit: number): SpaceStep[] {
  const multipliers = [1, 2, 3, 4, 6, 8, 12, 16];
  return multipliers.map((m) => ({
    name: `space-${m}`,
    value: baseUnit * m,
    multiplier: m,
  }));
}

export function generateCss(typeSteps: TypeStep[], spaceSteps: SpaceStep[]): string {
  // For CSS output, emit smallest-to-largest top-down (easier to read).
  const typeAsc = [...typeSteps].sort((a, b) => a.size - b.size);
  const padName = (n: string, width: number) => {
    const spaces = Math.max(0, width - n.length);
    return n + ' '.repeat(spaces);
  };
  const typeNameWidth = Math.max(...typeAsc.map((s) => s.name.length));
  const spaceNameWidth = Math.max(...spaceSteps.map((s) => s.name.length));

  const lines: string[] = [];
  lines.push(':root {');
  lines.push('  /* Type scale */');
  typeAsc.forEach((step) => {
    lines.push(`  --${padName(step.name, typeNameWidth)}: ${step.size}px;`);
  });
  lines.push('');
  lines.push('  /* Spacing scale */');
  spaceSteps.forEach((step) => {
    lines.push(`  --${padName(step.name, spaceNameWidth)}: ${step.value}px;`);
  });
  lines.push('}');
  return lines.join('\n');
}
