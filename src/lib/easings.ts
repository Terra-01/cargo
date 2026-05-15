export interface Easing {
  name: string;          // CSS-style name, e.g. 'ease-out-quart'
  category: 'standard' | 'out' | 'in' | 'in-out' | 'overshoot';
  bezier: [number, number, number, number]; // x1, y1, x2, y2
}

export const easings: Easing[] = [
  // Standards
  { name: 'linear',           category: 'standard',  bezier: [0,    0,    1,    1] },
  { name: 'ease',             category: 'standard',  bezier: [0.25, 0.1,  0.25, 1] },
  { name: 'ease-in',          category: 'in',        bezier: [0.42, 0,    1,    1] },
  { name: 'ease-out',         category: 'out',       bezier: [0,    0,    0.58, 1] },
  { name: 'ease-in-out',      category: 'in-out',    bezier: [0.42, 0,    0.58, 1] },
  // Outs — curated useful ones
  { name: 'ease-out-quad',    category: 'out',       bezier: [0.5,  1,    0.89, 1] },
  { name: 'ease-out-cubic',   category: 'out',       bezier: [0.33, 1,    0.68, 1] },
  { name: 'ease-out-quart',   category: 'out',       bezier: [0.25, 1,    0.5,  1] },
  { name: 'ease-out-quint',   category: 'out',       bezier: [0.22, 1,    0.36, 1] },
  { name: 'ease-out-expo',    category: 'out',       bezier: [0.16, 1,    0.3,  1] },
  // Ins
  { name: 'ease-in-cubic',    category: 'in',        bezier: [0.32, 0,    0.67, 0] },
  { name: 'ease-in-quart',    category: 'in',        bezier: [0.5,  0,    0.75, 0] },
  // In-outs
  { name: 'ease-in-out-cubic', category: 'in-out',   bezier: [0.65, 0,    0.35, 1] },
  { name: 'ease-in-out-expo',  category: 'in-out',   bezier: [0.87, 0,    0.13, 1] },
  // Overshoots
  { name: 'ease-out-back',    category: 'overshoot', bezier: [0.34, 1.56, 0.64, 1] },
  { name: 'ease-in-back',     category: 'overshoot', bezier: [0.36, 0,    0.66, -0.56] },
];

export function bezierString(b: Easing['bezier']): string {
  return `cubic-bezier(${b.join(', ')})`;
}
