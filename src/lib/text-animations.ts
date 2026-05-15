export type AnimationCategory =
  | 'entrance'
  | 'loop'
  | 'stagger'
  | 'hover'
  | 'decorative'
  | 'specialty';

export type AnimationTrigger = 'auto' | 'hover';
export type AnimationSplit = 'character' | 'word' | 'line';

export interface TextAnimation {
  id: string;             // kebab-case identifier, also the @keyframes name (prefixed `ta-`)
  name: string;           // human-readable display name
  category: AnimationCategory;
  // Standard shape (used by entrances, loops, most decoratives, stagger, most specialty)
  keyframes?: string;
  animation?: string;
  baseStyles?: string;
  // Escape hatch — full CSS block. If present, overrides the structured fields in the bundle.
  // Used by hover animations (which mostly use transitions, not @keyframes) and a few specialties.
  customCss?: string;
  // Behavior modifiers
  trigger?: AnimationTrigger;       // default 'auto'
  split?: AnimationSplit;           // for stagger animations
  staggerDelayMs?: number;          // default 50; only used when split is set
  is3d?: boolean;                   // adds "3D" badge + relies on global perspective
  sampleText?: string;
  durationMs?: number;              // default 2800
}

// Inline cubic-bezier values for portability — bundle copy must be self-contained.
const E_OUT = 'cubic-bezier(0.16, 1, 0.3, 1)';        // expressive ease-out
const E_INOUT = 'cubic-bezier(0.65, 0, 0.35, 1)';      // ease-in-out
const E_BACK = 'cubic-bezier(0.34, 1.56, 0.64, 1)';    // back overshoot
const E_LINEAR = 'linear';

export const textAnimations: TextAnimation[] = [
  // ============ ENTRANCES (25) ============

  // — Fades (5) —
  {
    id: 'ta-fade-in',
    name: 'Fade in',
    category: 'entrance',
    keyframes: `from { opacity: 0; } to { opacity: 1; }`,
    animation: `0.6s ${E_OUT} both`,
  },
  {
    id: 'ta-fade-in-up',
    name: 'Fade in up',
    category: 'entrance',
    keyframes: `from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); }`,
    animation: `0.7s ${E_OUT} both`,
  },
  {
    id: 'ta-fade-in-down',
    name: 'Fade in down',
    category: 'entrance',
    keyframes: `from { opacity: 0; transform: translateY(-20px); } to { opacity: 1; transform: translateY(0); }`,
    animation: `0.7s ${E_OUT} both`,
  },
  {
    id: 'ta-fade-in-left',
    name: 'Fade in left',
    category: 'entrance',
    keyframes: `from { opacity: 0; transform: translateX(-20px); } to { opacity: 1; transform: translateX(0); }`,
    animation: `0.7s ${E_OUT} both`,
  },
  {
    id: 'ta-fade-in-right',
    name: 'Fade in right',
    category: 'entrance',
    keyframes: `from { opacity: 0; transform: translateX(20px); } to { opacity: 1; transform: translateX(0); }`,
    animation: `0.7s ${E_OUT} both`,
  },

  // — Slides (5) —
  {
    id: 'ta-slide-in-up',
    name: 'Slide in up',
    category: 'entrance',
    keyframes: `from { transform: translateY(100%); } to { transform: translateY(0); }`,
    animation: `0.6s ${E_OUT} both`,
  },
  {
    id: 'ta-slide-in-down',
    name: 'Slide in down',
    category: 'entrance',
    keyframes: `from { transform: translateY(-100%); } to { transform: translateY(0); }`,
    animation: `0.6s ${E_OUT} both`,
  },
  {
    id: 'ta-slide-in-left',
    name: 'Slide in left',
    category: 'entrance',
    keyframes: `from { transform: translateX(-100%); } to { transform: translateX(0); }`,
    animation: `0.6s ${E_OUT} both`,
  },
  {
    id: 'ta-slide-in-right',
    name: 'Slide in right',
    category: 'entrance',
    keyframes: `from { transform: translateX(100%); } to { transform: translateX(0); }`,
    animation: `0.6s ${E_OUT} both`,
  },
  {
    id: 'ta-slide-in-up-big',
    name: 'Slide in up (big)',
    category: 'entrance',
    keyframes: `from { transform: translateY(200%); } to { transform: translateY(0); }`,
    animation: `0.8s ${E_OUT} both`,
  },

  // — Zooms (4) —
  {
    id: 'ta-zoom-in',
    name: 'Zoom in',
    category: 'entrance',
    keyframes: `from { opacity: 0; transform: scale(0.5); } to { opacity: 1; transform: scale(1); }`,
    animation: `0.6s ${E_OUT} both`,
  },
  {
    id: 'ta-zoom-in-up',
    name: 'Zoom in up',
    category: 'entrance',
    keyframes: `from { opacity: 0; transform: scale(0.5) translateY(24px); } to { opacity: 1; transform: scale(1) translateY(0); }`,
    animation: `0.7s ${E_OUT} both`,
  },
  {
    id: 'ta-zoom-out-settle',
    name: 'Zoom out settle',
    category: 'entrance',
    keyframes: `from { opacity: 0; transform: scale(1.5); } to { opacity: 1; transform: scale(1); }`,
    animation: `0.7s ${E_OUT} both`,
  },
  {
    id: 'ta-zoom-bounce',
    name: 'Zoom bounce',
    category: 'entrance',
    keyframes: `0% { opacity: 0; transform: scale(0.6); } 60% { opacity: 1; transform: scale(1.08); } 100% { transform: scale(1); }`,
    animation: `0.8s ${E_BACK} both`,
  },

  // — Rotates (3) —
  {
    id: 'ta-rotate-in',
    name: 'Rotate in',
    category: 'entrance',
    keyframes: `from { opacity: 0; transform: rotate(-180deg) scale(0.5); } to { opacity: 1; transform: rotate(0) scale(1); }`,
    animation: `0.8s ${E_OUT} both`,
  },
  {
    id: 'ta-rotate-in-90',
    name: 'Rotate in 90',
    category: 'entrance',
    keyframes: `from { opacity: 0; transform: rotate(-90deg); } to { opacity: 1; transform: rotate(0); }`,
    animation: `0.7s ${E_OUT} both`,
  },
  {
    id: 'ta-rotate-in-counter',
    name: 'Rotate in counter',
    category: 'entrance',
    keyframes: `from { opacity: 0; transform: rotate(180deg) scale(0.5); } to { opacity: 1; transform: rotate(0) scale(1); }`,
    animation: `0.8s ${E_OUT} both`,
  },

  // — Flips (3) —
  {
    id: 'ta-flip-in-x',
    name: 'Flip in X',
    category: 'entrance',
    keyframes: `from { opacity: 0; transform: perspective(400px) rotateX(90deg); } to { opacity: 1; transform: perspective(400px) rotateX(0); }`,
    animation: `0.8s ${E_OUT} both`,
  },
  {
    id: 'ta-flip-in-y',
    name: 'Flip in Y',
    category: 'entrance',
    keyframes: `from { opacity: 0; transform: perspective(400px) rotateY(90deg); } to { opacity: 1; transform: perspective(400px) rotateY(0); }`,
    animation: `0.8s ${E_OUT} both`,
  },
  {
    id: 'ta-flip-card',
    name: 'Flip card',
    category: 'entrance',
    keyframes: `from { opacity: 0; transform: perspective(600px) rotateY(180deg); } to { opacity: 1; transform: perspective(600px) rotateY(0); }`,
    animation: `0.9s ${E_OUT} both`,
  },

  // — Special entrances (5) —
  {
    id: 'ta-blur-in',
    name: 'Blur in',
    category: 'entrance',
    keyframes: `from { opacity: 0; filter: blur(16px); } to { opacity: 1; filter: blur(0); }`,
    animation: `0.8s ${E_OUT} both`,
  },
  {
    id: 'ta-focus-in',
    name: 'Focus in',
    category: 'entrance',
    keyframes: `from { opacity: 0; filter: blur(16px); transform: scale(1.4); } to { opacity: 1; filter: blur(0); transform: scale(1); }`,
    animation: `0.9s ${E_OUT} both`,
  },
  {
    id: 'ta-scale-in-soft',
    name: 'Scale in soft',
    category: 'entrance',
    keyframes: `from { opacity: 0; transform: scale(0.8); } to { opacity: 1; transform: scale(1); }`,
    animation: `0.6s ${E_OUT} both`,
  },
  {
    id: 'ta-skew-in',
    name: 'Skew in',
    category: 'entrance',
    keyframes: `from { opacity: 0; transform: skewX(-10deg) translateX(-20px); } to { opacity: 1; transform: skewX(0) translateX(0); }`,
    animation: `0.7s ${E_OUT} both`,
  },
  {
    id: 'ta-back-in',
    name: 'Back in',
    category: 'entrance',
    keyframes: `0% { opacity: 0; transform: scale(0.95); } 70% { opacity: 1; transform: scale(1.02); } 100% { transform: scale(1); }`,
    animation: `0.7s ${E_BACK} both`,
  },

  // ============ LOOPS (15) ============

  // — Type effects (4) —
  {
    id: 'ta-typewriter',
    name: 'Typewriter',
    category: 'loop',
    keyframes: `0%, 12% { width: 0; } 50%, 90% { width: 100%; } 100% { width: 0; }`,
    animation: `4s steps(20, end) infinite`,
    baseStyles: `display: inline-block;
  white-space: nowrap;
  overflow: hidden;
  vertical-align: bottom;`,
    durationMs: 4000,
  },
  {
    id: 'ta-ticker',
    name: 'Ticker',
    category: 'loop',
    keyframes: `0% { transform: translateX(120%); } 100% { transform: translateX(-120%); }`,
    animation: `5s ${E_LINEAR} infinite`,
    baseStyles: `display: inline-block;
  white-space: nowrap;`,
    durationMs: 5000,
  },
  {
    id: 'ta-marquee',
    name: 'Marquee',
    category: 'loop',
    keyframes: `0% { transform: translateX(100%); } 100% { transform: translateX(-100%); }`,
    animation: `6s ${E_LINEAR} infinite`,
    baseStyles: `display: inline-block;
  white-space: nowrap;`,
    durationMs: 6000,
  },
  {
    id: 'ta-crawl-up',
    name: 'Crawl up',
    category: 'loop',
    keyframes: `0% { transform: translateY(100%); } 100% { transform: translateY(-100%); }`,
    animation: `4s ${E_LINEAR} infinite`,
    baseStyles: `display: inline-block;`,
    durationMs: 4000,
  },

  // — Visual effects (6) —
  {
    id: 'ta-gradient-sweep',
    name: 'Gradient sweep',
    category: 'loop',
    keyframes: `0% { background-position: 0% 50%; } 100% { background-position: 200% 50%; }`,
    animation: `3s ${E_LINEAR} infinite`,
    baseStyles: `background-image: linear-gradient(90deg, #C2410C 0%, #FB923C 25%, #C2410C 50%, #FB923C 75%, #C2410C 100%);
  background-size: 200% 100%;
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;
  -webkit-text-fill-color: transparent;`,
    durationMs: 3000,
  },
  {
    id: 'ta-gradient-shift',
    name: 'Gradient shift',
    category: 'loop',
    keyframes: `0%, 100% { background-position: 0% 50%; } 50% { background-position: 100% 50%; }`,
    animation: `4s ${E_INOUT} infinite`,
    baseStyles: `background-image: linear-gradient(90deg, #C2410C, #0EA5E9, #84CC16, #C2410C);
  background-size: 300% 100%;
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;
  -webkit-text-fill-color: transparent;`,
    durationMs: 4000,
  },
  {
    id: 'ta-glitch',
    name: 'Glitch',
    category: 'loop',
    keyframes: `0%, 100% { transform: translate(0, 0); } 20% { transform: translate(-2px, 1px); } 40% { transform: translate(2px, -1px); } 60% { transform: translate(-1px, 2px); } 80% { transform: translate(1px, -2px); }`,
    animation: `0.4s ${E_LINEAR} infinite`,
    durationMs: 2400,
  },
  {
    id: 'ta-glitch-rgb',
    name: 'Glitch RGB',
    category: 'loop',
    keyframes: `0%, 100% { text-shadow: 0 0 0 transparent; } 25% { text-shadow: -2px 0 0 #ef4444, 2px 0 0 #06b6d4; } 50% { text-shadow: 0 0 0 transparent; } 75% { text-shadow: 2px 0 0 #ef4444, -2px 0 0 #06b6d4; }`,
    animation: `1.2s ${E_LINEAR} infinite`,
    durationMs: 2400,
  },
  {
    id: 'ta-color-cycle',
    name: 'Color cycle',
    category: 'loop',
    keyframes: `0%, 100% { color: #C2410C; } 25% { color: #0EA5E9; } 50% { color: #84CC16; } 75% { color: #A855F7; }`,
    animation: `4s ${E_INOUT} infinite`,
    durationMs: 4000,
  },
  {
    id: 'ta-shimmer-text',
    name: 'Shimmer text',
    category: 'loop',
    keyframes: `0% { background-position: -200% 50%; } 100% { background-position: 200% 50%; }`,
    animation: `2.4s ${E_LINEAR} infinite`,
    baseStyles: `background-image: linear-gradient(90deg, rgba(120,120,120,0.65) 0%, rgba(120,120,120,0.65) 35%, #FB923C 50%, rgba(120,120,120,0.65) 65%, rgba(120,120,120,0.65) 100%);
  background-size: 200% 100%;
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;
  -webkit-text-fill-color: transparent;`,
    durationMs: 2400,
  },

  // — Pulse-style (5) —
  {
    id: 'ta-pulse-fade',
    name: 'Pulse fade',
    category: 'loop',
    keyframes: `0%, 100% { opacity: 1; } 50% { opacity: 0.4; }`,
    animation: `2s ${E_INOUT} infinite`,
    durationMs: 2000,
  },
  {
    id: 'ta-pulse-scale',
    name: 'Pulse scale',
    category: 'loop',
    keyframes: `0%, 100% { transform: scale(1); } 50% { transform: scale(1.05); }`,
    animation: `2s ${E_INOUT} infinite`,
    durationMs: 2000,
  },
  {
    id: 'ta-breath',
    name: 'Breath',
    category: 'loop',
    keyframes: `0%, 100% { transform: scale(1); opacity: 0.85; } 50% { transform: scale(1.03); opacity: 1; }`,
    animation: `3.6s ${E_INOUT} infinite`,
    durationMs: 3600,
  },
  {
    id: 'ta-glow-pulse',
    name: 'Glow pulse',
    category: 'loop',
    keyframes: `0%, 100% { text-shadow: 0 0 0 rgba(251, 146, 60, 0); } 50% { text-shadow: 0 0 18px rgba(251, 146, 60, 0.65); }`,
    animation: `2.4s ${E_INOUT} infinite`,
    durationMs: 2400,
  },
  {
    id: 'ta-ghost-fade',
    name: 'Ghost fade',
    category: 'loop',
    keyframes: `0%, 100% { opacity: 0.2; } 50% { opacity: 1; }`,
    animation: `3s ${E_INOUT} infinite`,
    durationMs: 3000,
  },

  // ============ STAGGER (15) ============

  // — Character splits (8) —
  {
    id: 'ta-stagger-fade-up',
    name: 'Stagger fade up',
    category: 'stagger',
    trigger: 'auto',
    split: 'character',
    keyframes: `from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); }`,
    animation: `0.6s ${E_OUT} both`,
    baseStyles: `display: inline-block;`,
    durationMs: 2200,
  },
  {
    id: 'ta-stagger-rise',
    name: 'Stagger rise',
    category: 'stagger',
    trigger: 'auto',
    split: 'character',
    keyframes: `from { opacity: 0; transform: translateY(40px) scale(0.9); } to { opacity: 1; transform: translateY(0) scale(1); }`,
    animation: `0.7s ${E_OUT} both`,
    baseStyles: `display: inline-block;`,
    durationMs: 2400,
  },
  {
    id: 'ta-stagger-drop',
    name: 'Stagger drop',
    category: 'stagger',
    trigger: 'auto',
    split: 'character',
    keyframes: `from { opacity: 0; transform: translateY(-30px); } to { opacity: 1; transform: translateY(0); }`,
    animation: `0.6s ${E_OUT} both`,
    baseStyles: `display: inline-block;`,
    durationMs: 2200,
  },
  {
    id: 'ta-stagger-wave',
    name: 'Stagger wave',
    category: 'stagger',
    trigger: 'auto',
    split: 'character',
    keyframes: `0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); }`,
    animation: `1.4s ${E_INOUT} infinite`,
    baseStyles: `display: inline-block;`,
    staggerDelayMs: 80,
    durationMs: 2800,
  },
  {
    id: 'ta-stagger-rotate',
    name: 'Stagger rotate',
    category: 'stagger',
    trigger: 'auto',
    split: 'character',
    keyframes: `from { opacity: 0; transform: rotate(-90deg) scale(0.5); } to { opacity: 1; transform: rotate(0) scale(1); }`,
    animation: `0.6s ${E_OUT} both`,
    baseStyles: `display: inline-block;`,
    staggerDelayMs: 50,
    durationMs: 2400,
  },
  {
    id: 'ta-stagger-zoom',
    name: 'Stagger zoom',
    category: 'stagger',
    trigger: 'auto',
    split: 'character',
    keyframes: `from { opacity: 0; transform: scale(0); } to { opacity: 1; transform: scale(1); }`,
    animation: `0.6s ${E_BACK} both`,
    baseStyles: `display: inline-block;`,
    staggerDelayMs: 50,
    durationMs: 2400,
  },
  {
    id: 'ta-stagger-blur',
    name: 'Stagger blur',
    category: 'stagger',
    trigger: 'auto',
    split: 'character',
    keyframes: `from { opacity: 0; filter: blur(8px); } to { opacity: 1; filter: blur(0); }`,
    animation: `0.7s ${E_OUT} both`,
    baseStyles: `display: inline-block;`,
    staggerDelayMs: 60,
    durationMs: 2600,
  },
  {
    id: 'ta-stagger-flip',
    name: 'Stagger flip',
    category: 'stagger',
    trigger: 'auto',
    split: 'character',
    keyframes: `from { opacity: 0; transform: perspective(400px) rotateX(-90deg); } to { opacity: 1; transform: perspective(400px) rotateX(0); }`,
    animation: `0.7s ${E_OUT} both`,
    baseStyles: `display: inline-block;`,
    staggerDelayMs: 60,
    durationMs: 2600,
  },

  // — Word splits (4) —
  {
    id: 'ta-stagger-words-fade',
    name: 'Stagger words — fade',
    category: 'stagger',
    trigger: 'auto',
    split: 'word',
    keyframes: `from { opacity: 0; } to { opacity: 1; }`,
    animation: `0.5s ${E_OUT} both`,
    baseStyles: `display: inline-block;`,
    staggerDelayMs: 150,
    durationMs: 2000,
  },
  {
    id: 'ta-stagger-words-rise',
    name: 'Stagger words — rise',
    category: 'stagger',
    trigger: 'auto',
    split: 'word',
    keyframes: `from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); }`,
    animation: `0.6s ${E_OUT} both`,
    baseStyles: `display: inline-block;`,
    staggerDelayMs: 150,
    durationMs: 2200,
  },
  {
    id: 'ta-stagger-words-slide',
    name: 'Stagger words — slide',
    category: 'stagger',
    trigger: 'auto',
    split: 'word',
    keyframes: `from { opacity: 0; transform: translateX(-30px); } to { opacity: 1; transform: translateX(0); }`,
    animation: `0.6s ${E_OUT} both`,
    baseStyles: `display: inline-block;`,
    staggerDelayMs: 150,
    durationMs: 2200,
  },
  {
    id: 'ta-stagger-words-zoom',
    name: 'Stagger words — zoom',
    category: 'stagger',
    trigger: 'auto',
    split: 'word',
    keyframes: `from { opacity: 0; transform: scale(0.6); } to { opacity: 1; transform: scale(1); }`,
    animation: `0.6s ${E_BACK} both`,
    baseStyles: `display: inline-block;`,
    staggerDelayMs: 150,
    durationMs: 2200,
  },

  // — Line splits (3) —
  {
    id: 'ta-stagger-lines-rise',
    name: 'Stagger lines — rise',
    category: 'stagger',
    trigger: 'auto',
    split: 'line',
    keyframes: `from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); }`,
    animation: `0.7s ${E_OUT} both`,
    baseStyles: `display: block;`,
    staggerDelayMs: 200,
    durationMs: 2400,
    sampleText: 'Line one.\nLine two.\nLine three.',
  },
  {
    id: 'ta-stagger-lines-fade',
    name: 'Stagger lines — fade',
    category: 'stagger',
    trigger: 'auto',
    split: 'line',
    keyframes: `from { opacity: 0; } to { opacity: 1; }`,
    animation: `0.6s ${E_OUT} both`,
    baseStyles: `display: block;`,
    staggerDelayMs: 200,
    durationMs: 2400,
    sampleText: 'Line one.\nLine two.\nLine three.',
  },
  {
    id: 'ta-stagger-lines-reveal',
    name: 'Stagger lines — reveal',
    category: 'stagger',
    trigger: 'auto',
    split: 'line',
    keyframes: `from { opacity: 0; clip-path: inset(0 100% 0 0); } to { opacity: 1; clip-path: inset(0 0 0 0); }`,
    animation: `0.8s ${E_OUT} both`,
    baseStyles: `display: block;`,
    staggerDelayMs: 250,
    durationMs: 2800,
    sampleText: 'Line one.\nLine two.\nLine three.',
  },

  // ============ HOVER (15) ============

  // — Underline effects (4) —
  {
    id: 'ta-underline-grow',
    name: 'Underline grow',
    category: 'hover',
    trigger: 'hover',
    customCss: `.ta-underline-grow {
  position: relative;
  display: inline-block;
}
.ta-underline-grow::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  height: 2px;
  width: 100%;
  background: currentColor;
  transform: scaleX(0);
  transform-origin: left center;
  transition: transform 0.4s ${E_OUT};
}
.ta-underline-grow:hover::after {
  transform: scaleX(1);
}`,
  },
  {
    id: 'ta-underline-center',
    name: 'Underline center',
    category: 'hover',
    trigger: 'hover',
    customCss: `.ta-underline-center {
  position: relative;
  display: inline-block;
}
.ta-underline-center::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  height: 2px;
  width: 100%;
  background: currentColor;
  transform: scaleX(0);
  transform-origin: center;
  transition: transform 0.4s ${E_OUT};
}
.ta-underline-center:hover::after {
  transform: scaleX(1);
}`,
  },
  {
    id: 'ta-underline-reveal',
    name: 'Underline reveal',
    category: 'hover',
    trigger: 'hover',
    customCss: `.ta-underline-reveal {
  position: relative;
  display: inline-block;
}
.ta-underline-reveal::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  height: 2px;
  width: 100%;
  background: currentColor;
  clip-path: inset(0 100% 0 0);
  transition: clip-path 0.5s ${E_OUT};
}
.ta-underline-reveal:hover::after {
  clip-path: inset(0 0 0 0);
}`,
  },
  {
    id: 'ta-underline-thick',
    name: 'Underline thick',
    category: 'hover',
    trigger: 'hover',
    customCss: `.ta-underline-thick {
  display: inline-block;
  box-shadow: inset 0 0 0 currentColor;
  transition: box-shadow 0.4s ${E_OUT};
}
.ta-underline-thick:hover {
  box-shadow: inset 0 -4px 0 currentColor;
}`,
  },

  // — Color/fill effects (4) —
  {
    id: 'ta-hover-fill-up',
    name: 'Hover fill up',
    category: 'hover',
    trigger: 'hover',
    customCss: `.ta-hover-fill-up {
  position: relative;
  display: inline-block;
  overflow: hidden;
  padding: 2px 8px;
  border-radius: 4px;
  transition: color 0.4s ${E_OUT};
  isolation: isolate;
}
.ta-hover-fill-up::before {
  content: '';
  position: absolute;
  inset: 0;
  background: currentColor;
  transform: translateY(100%);
  transition: transform 0.4s ${E_OUT};
  z-index: -1;
}
.ta-hover-fill-up:hover::before {
  transform: translateY(0);
}
.ta-hover-fill-up:hover {
  color: #FFFFFF;
  mix-blend-mode: difference;
}`,
  },
  {
    id: 'ta-hover-color-shift',
    name: 'Hover color shift',
    category: 'hover',
    trigger: 'hover',
    customCss: `.ta-hover-color-shift {
  display: inline-block;
  transition: color 0.3s ${E_OUT};
}
.ta-hover-color-shift:hover {
  color: #C2410C;
}`,
  },
  {
    id: 'ta-hover-highlight',
    name: 'Hover highlight',
    category: 'hover',
    trigger: 'hover',
    customCss: `.ta-hover-highlight {
  display: inline-block;
  padding: 0 4px;
  background-image: linear-gradient(transparent 60%, rgba(251, 146, 60, 0.45) 60%);
  background-size: 0 100%;
  background-repeat: no-repeat;
  transition: background-size 0.4s ${E_OUT};
}
.ta-hover-highlight:hover {
  background-size: 100% 100%;
}`,
  },
  {
    id: 'ta-hover-glow',
    name: 'Hover glow',
    category: 'hover',
    trigger: 'hover',
    customCss: `.ta-hover-glow {
  display: inline-block;
  text-shadow: 0 0 0 transparent;
  transition: text-shadow 0.4s ${E_OUT};
}
.ta-hover-glow:hover {
  text-shadow: 0 0 12px rgba(251, 146, 60, 0.7);
}`,
  },

  // — Transform effects (4) —
  {
    id: 'ta-hover-skew',
    name: 'Hover skew',
    category: 'hover',
    trigger: 'hover',
    customCss: `.ta-hover-skew {
  display: inline-block;
  transition: transform 0.3s ${E_OUT};
}
.ta-hover-skew:hover {
  transform: skewX(-10deg);
}`,
  },
  {
    id: 'ta-hover-lift',
    name: 'Hover lift',
    category: 'hover',
    trigger: 'hover',
    customCss: `.ta-hover-lift {
  display: inline-block;
  transition: transform 0.3s ${E_OUT};
}
.ta-hover-lift:hover {
  transform: translateY(-3px);
}`,
  },
  {
    id: 'ta-hover-scale',
    name: 'Hover scale',
    category: 'hover',
    trigger: 'hover',
    customCss: `.ta-hover-scale {
  display: inline-block;
  transition: transform 0.3s ${E_OUT};
}
.ta-hover-scale:hover {
  transform: scale(1.05);
}`,
  },
  {
    id: 'ta-hover-letter-spacing',
    name: 'Hover letter spacing',
    category: 'hover',
    trigger: 'hover',
    customCss: `.ta-hover-letter-spacing {
  display: inline-block;
  letter-spacing: normal;
  transition: letter-spacing 0.4s ${E_OUT};
}
.ta-hover-letter-spacing:hover {
  letter-spacing: 0.1em;
}`,
  },

  // — Special (3) —
  {
    id: 'ta-hover-strike',
    name: 'Hover strikethrough',
    category: 'hover',
    trigger: 'hover',
    customCss: `.ta-hover-strike {
  position: relative;
  display: inline-block;
}
.ta-hover-strike::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 0;
  height: 2px;
  width: 100%;
  background: currentColor;
  transform: scaleX(0);
  transform-origin: left center;
  transition: transform 0.4s ${E_OUT};
}
.ta-hover-strike:hover::after {
  transform: scaleX(1);
}`,
  },
  {
    id: 'ta-hover-arrow',
    name: 'Hover arrow',
    category: 'hover',
    trigger: 'hover',
    customCss: `.ta-hover-arrow {
  position: relative;
  display: inline-block;
  padding-right: 0;
  transition: padding-right 0.3s ${E_OUT};
}
.ta-hover-arrow::after {
  content: '→';
  position: absolute;
  right: 0;
  top: 50%;
  transform: translate(-8px, -50%);
  opacity: 0;
  transition: transform 0.3s ${E_OUT}, opacity 0.3s ${E_OUT};
}
.ta-hover-arrow:hover {
  padding-right: 22px;
}
.ta-hover-arrow:hover::after {
  transform: translate(0, -50%);
  opacity: 1;
}`,
  },
  {
    id: 'ta-hover-split',
    name: 'Hover split',
    category: 'hover',
    trigger: 'hover',
    customCss: `.ta-hover-split {
  display: inline-block;
  letter-spacing: normal;
  transition: letter-spacing 0.5s ${E_OUT};
}
.ta-hover-split:hover {
  letter-spacing: 0.4em;
}`,
  },

  // ============ DECORATIVE (15) ============

  // — Wobble family (4) —
  {
    id: 'ta-wobble',
    name: 'Wobble',
    category: 'decorative',
    trigger: 'auto',
    keyframes: `0%, 100% { transform: translateX(0) rotate(0); } 15% { transform: translateX(-12px) rotate(-3deg); } 30% { transform: translateX(10px) rotate(2deg); } 45% { transform: translateX(-8px) rotate(-2deg); } 60% { transform: translateX(6px) rotate(1deg); } 75% { transform: translateX(-3px) rotate(-0.5deg); }`,
    animation: `1.6s ${E_INOUT} infinite`,
    baseStyles: `display: inline-block;`,
    durationMs: 1600,
  },
  {
    id: 'ta-wobble-soft',
    name: 'Wobble soft',
    category: 'decorative',
    trigger: 'auto',
    keyframes: `0%, 100% { transform: rotate(0); } 25% { transform: rotate(-2deg); } 75% { transform: rotate(2deg); }`,
    animation: `2s ${E_INOUT} infinite`,
    baseStyles: `display: inline-block;`,
    durationMs: 2000,
  },
  {
    id: 'ta-jitter',
    name: 'Jitter',
    category: 'decorative',
    trigger: 'auto',
    keyframes: `0%, 100% { transform: translate(0, 0); } 20% { transform: translate(-1px, 1px); } 40% { transform: translate(1px, -1px); } 60% { transform: translate(-1px, -1px); } 80% { transform: translate(1px, 1px); }`,
    animation: `0.2s ${E_LINEAR} infinite`,
    baseStyles: `display: inline-block;`,
    durationMs: 1200,
  },
  {
    id: 'ta-tremble',
    name: 'Tremble',
    category: 'decorative',
    trigger: 'auto',
    keyframes: `0%, 100% { transform: translateY(0); } 50% { transform: translateY(1px); }`,
    animation: `0.1s ${E_LINEAR} infinite`,
    baseStyles: `display: inline-block;`,
    durationMs: 1500,
  },

  // — Bounce family (4) —
  {
    id: 'ta-bounce-soft',
    name: 'Bounce soft',
    category: 'decorative',
    trigger: 'auto',
    keyframes: `0%, 100% { transform: translateY(0); } 50% { transform: translateY(-12px); }`,
    animation: `1.4s ${E_INOUT} infinite`,
    baseStyles: `display: inline-block;`,
    durationMs: 1400,
  },
  {
    id: 'ta-bounce-hard',
    name: 'Bounce hard',
    category: 'decorative',
    trigger: 'auto',
    keyframes: `0%, 100% { transform: translateY(0); } 30% { transform: translateY(-22px); } 60% { transform: translateY(-4px); } 80% { transform: translateY(-2px); }`,
    animation: `1.2s ${E_INOUT} infinite`,
    baseStyles: `display: inline-block;`,
    durationMs: 1200,
  },
  {
    id: 'ta-bounce-rotate',
    name: 'Bounce rotate',
    category: 'decorative',
    trigger: 'auto',
    keyframes: `0%, 100% { transform: translateY(0) rotate(0); } 50% { transform: translateY(-12px) rotate(8deg); }`,
    animation: `1.5s ${E_INOUT} infinite`,
    baseStyles: `display: inline-block;`,
    durationMs: 1500,
  },
  {
    id: 'ta-jiggle',
    name: 'Jiggle',
    category: 'decorative',
    trigger: 'auto',
    keyframes: `0%, 100% { transform: rotate(0); } 25% { transform: rotate(-8deg); } 75% { transform: rotate(8deg); }`,
    animation: `0.6s ${E_INOUT} infinite`,
    baseStyles: `display: inline-block;`,
    durationMs: 1800,
  },

  // — Shake family (3) —
  {
    id: 'ta-shake',
    name: 'Shake',
    category: 'decorative',
    trigger: 'auto',
    keyframes: `0%, 100% { transform: translateX(0); } 25% { transform: translateX(-6px); } 50% { transform: translateX(6px); } 75% { transform: translateX(-4px); }`,
    animation: `0.5s ${E_INOUT} infinite`,
    baseStyles: `display: inline-block;`,
    durationMs: 500,
  },
  {
    id: 'ta-shake-vertical',
    name: 'Shake vertical',
    category: 'decorative',
    trigger: 'auto',
    keyframes: `0%, 100% { transform: translateY(0); } 25% { transform: translateY(-6px); } 50% { transform: translateY(6px); } 75% { transform: translateY(-4px); }`,
    animation: `0.5s ${E_INOUT} infinite`,
    baseStyles: `display: inline-block;`,
    durationMs: 500,
  },
  {
    id: 'ta-shake-rotate',
    name: 'Shake rotate',
    category: 'decorative',
    trigger: 'auto',
    keyframes: `0%, 100% { transform: rotate(0); } 25% { transform: rotate(-4deg); } 50% { transform: rotate(4deg); } 75% { transform: rotate(-2deg); }`,
    animation: `0.5s ${E_INOUT} infinite`,
    baseStyles: `display: inline-block;`,
    durationMs: 500,
  },

  // — Special decorative (4) —
  {
    id: 'ta-rubber-band',
    name: 'Rubber band',
    category: 'decorative',
    trigger: 'auto',
    keyframes: `0%, 100% { transform: scale(1); } 30% { transform: scaleX(1.25) scaleY(0.75); } 40% { transform: scaleX(0.75) scaleY(1.25); } 50% { transform: scaleX(1.15) scaleY(0.85); } 65% { transform: scaleX(0.95) scaleY(1.05); } 75% { transform: scaleX(1.05) scaleY(0.95); }`,
    animation: `1.6s ${E_INOUT} infinite`,
    baseStyles: `display: inline-block;`,
    durationMs: 1600,
  },
  {
    id: 'ta-swing',
    name: 'Swing',
    category: 'decorative',
    trigger: 'auto',
    keyframes: `0%, 100% { transform: rotate(0); } 20% { transform: rotate(15deg); } 40% { transform: rotate(-10deg); } 60% { transform: rotate(5deg); } 80% { transform: rotate(-5deg); }`,
    animation: `1.8s ${E_INOUT} infinite`,
    baseStyles: `display: inline-block; transform-origin: top center;`,
    durationMs: 1800,
  },
  {
    id: 'ta-tada',
    name: 'Tada',
    category: 'decorative',
    trigger: 'auto',
    keyframes: `0%, 100% { transform: scale(1) rotate(0); } 10%, 20% { transform: scale(0.9) rotate(-3deg); } 30%, 50%, 70%, 90% { transform: scale(1.1) rotate(3deg); } 40%, 60%, 80% { transform: scale(1.1) rotate(-3deg); }`,
    animation: `1.4s ${E_INOUT} infinite`,
    baseStyles: `display: inline-block;`,
    durationMs: 1400,
  },
  {
    id: 'ta-flash',
    name: 'Flash',
    category: 'decorative',
    trigger: 'auto',
    keyframes: `0%, 50%, 100% { opacity: 1; } 25%, 75% { opacity: 0; }`,
    animation: `1.2s ${E_INOUT} infinite`,
    baseStyles: `display: inline-block;`,
    durationMs: 1200,
  },

  // ============ SPECIALTY (15) ============

  // — 3D rotations (5) —
  {
    id: 'ta-3d-rotate-y',
    name: '3D rotate Y',
    category: 'specialty',
    trigger: 'auto',
    is3d: true,
    keyframes: `from { transform: rotateY(0); } to { transform: rotateY(360deg); }`,
    animation: `3s ${E_LINEAR} infinite`,
    baseStyles: `display: inline-block; transform-style: preserve-3d;`,
    durationMs: 3000,
  },
  {
    id: 'ta-3d-rotate-x',
    name: '3D rotate X',
    category: 'specialty',
    trigger: 'auto',
    is3d: true,
    keyframes: `from { transform: rotateX(0); } to { transform: rotateX(360deg); }`,
    animation: `3s ${E_LINEAR} infinite`,
    baseStyles: `display: inline-block; transform-style: preserve-3d;`,
    durationMs: 3000,
  },
  {
    id: 'ta-3d-flip-card',
    name: '3D flip card',
    category: 'specialty',
    trigger: 'auto',
    is3d: true,
    keyframes: `0% { transform: rotateY(0); } 50% { transform: rotateY(180deg); } 100% { transform: rotateY(360deg); }`,
    animation: `2.4s ${E_INOUT} infinite`,
    baseStyles: `display: inline-block; transform-style: preserve-3d; backface-visibility: hidden;`,
    durationMs: 2400,
  },
  {
    id: 'ta-3d-cube-spin',
    name: '3D cube spin',
    category: 'specialty',
    trigger: 'auto',
    is3d: true,
    keyframes: `0% { transform: rotateX(0) rotateY(0); } 50% { transform: rotateX(180deg) rotateY(180deg); } 100% { transform: rotateX(360deg) rotateY(360deg); }`,
    animation: `4s ${E_LINEAR} infinite`,
    baseStyles: `display: inline-block; transform-style: preserve-3d;`,
    durationMs: 4000,
  },
  {
    id: 'ta-3d-tilt',
    name: '3D tilt',
    category: 'specialty',
    trigger: 'auto',
    is3d: true,
    keyframes: `0%, 100% { transform: rotateY(-12deg) rotateX(4deg); } 50% { transform: rotateY(12deg) rotateX(-4deg); }`,
    animation: `4s ${E_INOUT} infinite`,
    baseStyles: `display: inline-block; transform-style: preserve-3d;`,
    durationMs: 4000,
  },

  // — Blur effects (3) —
  {
    id: 'ta-blur-pulse',
    name: 'Blur pulse',
    category: 'specialty',
    trigger: 'auto',
    keyframes: `0%, 100% { filter: blur(0); } 50% { filter: blur(6px); }`,
    animation: `2.4s ${E_INOUT} infinite`,
    baseStyles: `display: inline-block;`,
    durationMs: 2400,
  },
  {
    id: 'ta-blur-reveal',
    name: 'Blur reveal',
    category: 'specialty',
    trigger: 'auto',
    keyframes: `0% { opacity: 0; filter: blur(16px); } 40%, 80% { opacity: 1; filter: blur(0); } 100% { opacity: 0; filter: blur(16px); }`,
    animation: `3.2s ${E_INOUT} infinite`,
    baseStyles: `display: inline-block;`,
    durationMs: 3200,
  },
  {
    id: 'ta-focus-cycle',
    name: 'Focus cycle',
    category: 'specialty',
    trigger: 'auto',
    keyframes: `0%, 100% { filter: blur(0); } 33% { filter: blur(3px); } 66% { filter: blur(8px); }`,
    animation: `3.6s ${E_INOUT} infinite`,
    baseStyles: `display: inline-block;`,
    durationMs: 3600,
  },

  // — Clip-path reveals (4) —
  {
    id: 'ta-clip-reveal-left',
    name: 'Clip reveal left',
    category: 'specialty',
    trigger: 'auto',
    keyframes: `0% { clip-path: inset(0 100% 0 0); } 50% { clip-path: inset(0 0 0 0); } 100% { clip-path: inset(0 0 0 100%); }`,
    animation: `2.4s ${E_INOUT} infinite`,
    baseStyles: `display: inline-block;`,
    durationMs: 2400,
  },
  {
    id: 'ta-clip-reveal-right',
    name: 'Clip reveal right',
    category: 'specialty',
    trigger: 'auto',
    keyframes: `0% { clip-path: inset(0 0 0 100%); } 50% { clip-path: inset(0 0 0 0); } 100% { clip-path: inset(0 100% 0 0); }`,
    animation: `2.4s ${E_INOUT} infinite`,
    baseStyles: `display: inline-block;`,
    durationMs: 2400,
  },
  {
    id: 'ta-clip-reveal-center',
    name: 'Clip reveal center',
    category: 'specialty',
    trigger: 'auto',
    keyframes: `0% { clip-path: inset(0 50% 0 50%); } 50% { clip-path: inset(0 0 0 0); } 100% { clip-path: inset(0 50% 0 50%); }`,
    animation: `2.4s ${E_INOUT} infinite`,
    baseStyles: `display: inline-block;`,
    durationMs: 2400,
  },
  {
    id: 'ta-mask-reveal',
    name: 'Mask reveal',
    category: 'specialty',
    trigger: 'auto',
    keyframes: `0% { -webkit-mask-position: -100% 0; mask-position: -100% 0; } 100% { -webkit-mask-position: 200% 0; mask-position: 200% 0; }`,
    animation: `3s ${E_LINEAR} infinite`,
    baseStyles: `display: inline-block; -webkit-mask-image: linear-gradient(90deg, transparent, black 40%, black 60%, transparent); mask-image: linear-gradient(90deg, transparent, black 40%, black 60%, transparent); -webkit-mask-size: 200% 100%; mask-size: 200% 100%; -webkit-mask-repeat: no-repeat; mask-repeat: no-repeat;`,
    durationMs: 3000,
  },

  // — Text effects (3) —
  {
    id: 'ta-rainbow',
    name: 'Rainbow',
    category: 'specialty',
    trigger: 'auto',
    keyframes: `0% { background-position: 0% 50%; } 100% { background-position: 200% 50%; }`,
    animation: `4s ${E_LINEAR} infinite`,
    baseStyles: `display: inline-block; background-image: linear-gradient(90deg, #FF0080, #FF8C00, #FFD700, #00C853, #00B0FF, #6200EA, #FF0080); background-size: 200% 100%; background-clip: text; -webkit-background-clip: text; color: transparent; -webkit-text-fill-color: transparent;`,
    durationMs: 4000,
  },
  {
    id: 'ta-spotlight',
    name: 'Spotlight',
    category: 'specialty',
    trigger: 'auto',
    keyframes: `0%, 100% { background-position: 0% 50%; } 50% { background-position: 100% 50%; }`,
    animation: `3s ${E_INOUT} infinite`,
    baseStyles: `display: inline-block; background-image: radial-gradient(circle at 20% 50%, #FB923C 0%, rgba(120, 120, 120, 0.45) 30%); background-size: 200% 100%; background-clip: text; -webkit-background-clip: text; color: transparent; -webkit-text-fill-color: transparent;`,
    durationMs: 3000,
  },
  {
    id: 'ta-mirror-flip',
    name: 'Mirror flip',
    category: 'specialty',
    trigger: 'auto',
    keyframes: `0%, 45%, 100% { transform: scaleX(1); } 50%, 95% { transform: scaleX(-1); }`,
    animation: `3s ${E_INOUT} infinite`,
    baseStyles: `display: inline-block;`,
    durationMs: 3000,
  },
];

// — Helpers —
const DEFAULT_SAMPLE = 'Hello, Cargo.';

export function getKeyframesCss(a: TextAnimation): string {
  // Animations using customCss don't have a separate keyframes block
  if (a.customCss) return '';
  if (!a.keyframes) return '';
  return `@keyframes ${a.id} {\n  ${a.keyframes.trim()}\n}`;
}

export function getClassCss(a: TextAnimation): string {
  // Custom-CSS animations emit their full block verbatim
  if (a.customCss) {
    return a.customCss.trim();
  }
  // Stagger animations target child spans, not the root element
  if (a.split) {
    const delay = a.staggerDelayMs ?? 50;
    const childDisplay = a.split === 'line' ? 'block' : 'inline-block';
    const baseRoot = a.baseStyles ? `.${a.id} {\n  ${a.baseStyles.trim()}\n}\n` : '';
    return (
      baseRoot +
      `.${a.id} > span {\n` +
      `  display: ${childDisplay};\n` +
      `  animation: ${a.id} ${a.animation};\n` +
      `  animation-delay: calc(var(--i) * ${(delay / 1000).toFixed(3)}s);\n` +
      `}`
    );
  }
  // Standard shape
  const base = a.baseStyles ? `  ${a.baseStyles.trim()}\n` : '';
  return `.${a.id} {\n${base}  animation: ${a.id} ${a.animation};\n}`;
}

export function getFullSnippet(a: TextAnimation): string {
  const keyframes = getKeyframesCss(a);
  const cls = getClassCss(a);
  return keyframes ? `${keyframes}\n\n${cls}` : cls;
}

const STAGGER_HTML_COMMENT = `/* ============================================
   HTML structure for stagger animations
   ============================================
   The stagger classes below expect each character (or word, or line)
   wrapped in a <span> with a \`--i\` index variable. Example for a
   character-split animation:
     <span class="ta-stagger-fade-up">
       <span style="--i: 0">H</span>
       <span style="--i: 1">e</span>
       <span style="--i: 2">l</span>
       <span style="--i: 3">l</span>
       <span style="--i: 4">o</span>
     </span>
*/`;

const STAGGER_JS_HELPER = `/* ============================================
   Optional: auto-split helper (JS)
   ============================================
   Drop this into your script to auto-wrap any element with a
   ta-stagger-* class. Detects character vs word vs line split
   by the suffix. Uses createElement/textContent (no innerHTML).

   function staggerSplit(el) {
     const text = el.textContent;
     const className = el.className;
     let parts;
     if (className.includes('-words')) {
       parts = text.split(' ').filter(p => p.length > 0);
     } else if (className.includes('-lines')) {
       parts = text.split('\\n');
     } else {
       parts = text.split('');
     }
     while (el.firstChild) el.removeChild(el.firstChild);
     const isWords = className.includes('-words');
     parts.forEach((p, i) => {
       const span = document.createElement('span');
       span.style.setProperty('--i', String(i));
       span.textContent = (p === ' ') ? '\\u00A0' : p;
       el.appendChild(span);
       if (isWords && i < parts.length - 1) {
         el.appendChild(document.createTextNode(' '));
       }
     });
   }
   document.querySelectorAll('[class*="ta-stagger"]').forEach(staggerSplit);
*/`;

export function getBundleSnippet(animations: TextAnimation[]): string {
  if (animations.length === 0) return '';
  const hasStagger = animations.some((a) => Boolean(a.split));
  const has3d = animations.some((a) => a.is3d);

  const lines: string[] = [];
  lines.push(`/* Cargo Text Animations — ${animations.length} picked */`);
  lines.push('');

  // Keyframes block (skip custom-CSS animations)
  const keyframesParts = animations
    .map(getKeyframesCss)
    .filter((s) => s.length > 0);
  if (keyframesParts.length > 0) {
    lines.push('/* Keyframes */');
    lines.push(keyframesParts.join('\n\n'));
    lines.push('');
  }

  // Classes block
  lines.push('/* Classes */');
  lines.push(animations.map(getClassCss).join('\n\n'));
  lines.push('');

  // 3D note if any 3D animations included
  if (has3d) {
    lines.push('/* Note: 3D animations need a `perspective` on the parent element:');
    lines.push('   .your-parent { perspective: 1000px; }                              */');
    lines.push('');
  }

  // Stagger sections (only if any stagger animations included)
  if (hasStagger) {
    lines.push(STAGGER_HTML_COMMENT);
    lines.push('');
    lines.push(STAGGER_JS_HELPER);
  }

  return lines.join('\n');
}

export function getSampleText(a: TextAnimation): string {
  return a.sampleText ?? DEFAULT_SAMPLE;
}

export function getCategoryLabel(c: AnimationCategory): string {
  return c;
}
