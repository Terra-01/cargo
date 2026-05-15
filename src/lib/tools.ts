import type { ComponentType } from 'react';
import { CssEffectLabPreview } from '@/components/previews/CssEffectLabPreview';
import { EasingCookbookPreview } from '@/components/previews/EasingCookbookPreview';
import { LoadingStatesPreview } from '@/components/previews/LoadingStatesPreview';
import { MockupWrapperPreview } from '@/components/previews/MockupWrapperPreview';
import { TypeScalePreview } from '@/components/previews/TypeScalePreview';
import { PromptBuilderPreview } from '@/components/previews/PromptBuilderPreview';
import { MoodboardPreview } from '@/components/previews/MoodboardPreview';

export type ToolStatus = 'shipped' | 'coming_soon';

export interface Tool {
  id: string;
  number: string;          // "01", "02", etc — zero-padded
  category: string;        // mono-formatted, e.g. "production_tools"
  title: string;
  description: string;
  tags: string[];
  href: string;            // route path (used when shipped)
  status: ToolStatus;
  Preview: ComponentType;
}

export const tools: Tool[] = [
  {
    id: 'css-effect-lab',
    number: '01',
    category: 'production_tools',
    title: 'CSS Effect Lab',
    description: 'A live playground for glassmorphism, mesh gradients, and animated borders.',
    tags: ['css', 'design', 'playground'],
    href: '/tools/css-effect-lab',
    status: 'shipped',
    Preview: CssEffectLabPreview,
  },
  {
    id: 'easing-cookbook',
    number: '02',
    category: 'learning_tools',
    title: 'Easing Cookbook',
    description: 'Every cubic-bezier and spring curve, visualized side-by-side with a draggable demo so you can feel the difference.',
    tags: ['animation', 'reference'],
    href: '/tools/easing-cookbook',
    status: 'coming_soon',
    Preview: EasingCookbookPreview,
  },
  {
    id: 'loading-states',
    number: '03',
    category: 'inspiration',
    title: 'Loading States Gallery',
    description: 'Skeleton loaders, spinners, and empty states with copy-pasteable code. The thing every project needs.',
    tags: ['ui', 'patterns', 'reference'],
    href: '/tools/loading-states',
    status: 'coming_soon',
    Preview: LoadingStatesPreview,
  },
  {
    id: 'mockup-wrapper',
    number: '04',
    category: 'visual_creator',
    title: 'Mockup Wrapper',
    description: 'Drop in a screenshot, get it framed in a browser chrome, phone, or floating-card mockup. Export as PNG.',
    tags: ['mockup', 'image'],
    href: '/tools/mockup-wrapper',
    status: 'coming_soon',
    Preview: MockupWrapperPreview,
  },
  {
    id: 'type-scale',
    number: '05',
    category: 'visual_creator',
    title: 'Type & Spacing Scale',
    description: 'Build a modular type scale and spacing system. Export as CSS variables or Tailwind config.',
    tags: ['typography', 'design-systems'],
    href: '/tools/type-scale',
    status: 'coming_soon',
    Preview: TypeScalePreview,
  },
  {
    id: 'prompt-builder',
    number: '06',
    category: 'generator',
    title: 'Component Prompt Builder',
    description: 'Pick a component, style, and framework. Get a sharp prompt you paste into Claude, v0, or Lovable.',
    tags: ['ai', 'prompts', 'vibe-coding'],
    href: '/tools/prompt-builder',
    status: 'coming_soon',
    Preview: PromptBuilderPreview,
  },
  {
    id: 'moodboard-library',
    number: '07',
    category: 'reference',
    title: 'Moodboard Library',
    description: 'Hand-curated vibes with palette, fonts, and texture suggestions. From dusty Tokyo sunset to 90s Memphis.',
    tags: ['inspiration', 'color', 'palette'],
    href: '/tools/moodboard-library',
    status: 'coming_soon',
    Preview: MoodboardPreview,
  },
];

export const shippedCount = (): number => tools.filter((t) => t.status === 'shipped').length;
export const plannedCount = (): number => tools.length;
