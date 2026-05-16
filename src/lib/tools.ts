import type { ComponentType } from 'react';
import { CssEffectLabPreview } from '@/components/previews/CssEffectLabPreview';
import { EasingCookbookPreview } from '@/components/previews/EasingCookbookPreview';
import { LoadingStatesPreview } from '@/components/previews/LoadingStatesPreview';
import { MockupWrapperPreview } from '@/components/previews/MockupWrapperPreview';
import { TypeScalePreview } from '@/components/previews/TypeScalePreview';
import { PromptBuilderPreview } from '@/components/previews/PromptBuilderPreview';
import { MoodboardPreview } from '@/components/previews/MoodboardPreview';
import { TextAnimationsPreview } from '@/components/previews/TextAnimationsPreview';
import { ShaderGradientLabPreview } from '@/components/previews/ShaderGradientLabPreview';
import { UiPatternDictionaryPreview } from '@/components/previews/UiPatternDictionaryPreview';

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
    status: 'shipped',
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
    status: 'shipped',
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
    status: 'shipped',
    Preview: MockupWrapperPreview,
  },
  {
    id: 'type-field-guide',
    number: '05',
    category: 'learning_tools',
    title: 'The Type Field Guide',
    description: 'A short, hands-on guide to web typography. Learn the essentials and feel each one with a live demo.',
    tags: ['typography', 'learning'],
    href: '/tools/type-field-guide',
    status: 'shipped',
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
    status: 'shipped',
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
    status: 'shipped',
    Preview: MoodboardPreview,
  },
  {
    id: 'text-animations',
    number: '08',
    category: 'learning_tools',
    title: 'Text Animation Library',
    description: '100 hand-crafted CSS text animations. Hover, copy, or pick several to bundle as one snippet.',
    tags: ['css', 'animation', 'motion'],
    href: '/tools/text-animations',
    status: 'shipped',
    Preview: TextAnimationsPreview,
  },
  {
    id: 'shader-gradient-lab',
    number: '09',
    category: 'visual_creator',
    title: 'Shader Gradient Lab',
    description: 'Custom WebGL2 gradient generator — a faithful Neat port plus curated Shadertoy shaders. Tweak waves, colors, flow, and grain in real-time. Export as PNG.',
    tags: ['webgl', 'gradient', 'background'],
    href: '/tools/shader-gradient-lab',
    status: 'shipped',
    Preview: ShaderGradientLabPreview,
  },
  {
    id: 'ui-pattern-dictionary',
    number: '10',
    category: 'reference',
    title: 'UI Pattern Dictionary',
    description: 'A searchable reference of UI patterns — what each one means, when to use it, when not to.',
    tags: ['reference', 'patterns', 'ui'],
    href: '/tools/ui-pattern-dictionary',
    status: 'coming_soon',
    Preview: UiPatternDictionaryPreview,
  },
];

export const shippedCount = (): number => tools.filter((t) => t.status === 'shipped').length;
export const plannedCount = (): number => tools.length;
