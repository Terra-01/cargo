// Single-source driver functions. The JS bundle export (getBundleSnippet)
// emits each picked driver's runtime source verbatim via Function.toString(),
// so the exported bytes equal the bytes the tool actually runs.
import { taDrivers } from './text-animation-drivers';

export type AnimationCategory =
  | 'entrance'
  | 'loop'
  | 'stagger'
  | 'hover'
  | 'decorative'
  | 'specialty';

export type AnimationTrigger = 'auto' | 'hover';
export type AnimationSplit = 'character' | 'word' | 'line';

export type AnimationEngine = 'css' | 'js';

export interface JsDriverSpec {
  kind: 'typewriter' | 'terminal' | 'shuffle' | 'binary-decode' | 'random-reveal' | 'spotlight';
  stepMs?: number;     // tick cadence for the stepped drivers
  sweepMs?: number;    // sweep duration for the spotlight driver
}

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
  engine?: AnimationEngine;   // default 'css'; 'js' for JS-driven animations
  jsDriver?: JsDriverSpec;    // present iff engine === 'js'
}

// Cubic-bezier values are inlined verbatim into each animation string for
// portability — a copied bundle must be self-contained (no shared constants).

export const textAnimations: TextAnimation[] = [
{
  id: "kw-fade-in",
  name: "Fade In",
  category: "stagger",
  keyframes: "from { opacity: 0; } to { opacity: 1; }",
  animation: "0.8s forwards",
  baseStyles: "display: inline-block;",
  split: "character",
  staggerDelayMs: 50,
  durationMs: 1150,
},
{
  id: "kw-slide-up",
  name: "Slide Up",
  category: "stagger",
  keyframes: "from { transform: translateY(100%); opacity: 0; } to { transform: translateY(0); opacity: 1; }",
  animation: "0.5s forwards",
  baseStyles: "display: inline-block;",
  split: "character",
  staggerDelayMs: 50,
  durationMs: 900,
},
{
  id: "kw-scale-in",
  name: "Scale In",
  category: "stagger",
  keyframes: "from { transform: scale(0); opacity: 0; } to { transform: scale(1); opacity: 1; }",
  animation: "0.5s forwards",
  baseStyles: "display: inline-block;",
  split: "character",
  staggerDelayMs: 50,
  durationMs: 900,
},
{
  id: "kw-blur-in",
  name: "Blur In",
  category: "stagger",
  keyframes: "from { filter: blur(12px); opacity: 0; transform: scale(1.1); } to { filter: blur(0); opacity: 1; transform: scale(1); }",
  animation: "0.8s forwards",
  baseStyles: "display: inline-block;",
  split: "character",
  staggerDelayMs: 50,
  durationMs: 1150,
},
{
  id: "kw-glow-in",
  name: "Glow In",
  category: "stagger",
  keyframes: "0% { opacity: 0; text-shadow: 0 0 0px rgba(255,255,255,0); } 50% { opacity: 1; text-shadow: 0 0 20px rgba(255,255,255,1); } 100% { opacity: 1; text-shadow: 0 0 0px rgba(255,255,255,0); }",
  animation: "1s forwards",
  baseStyles: "display: inline-block;",
  split: "character",
  staggerDelayMs: 50,
  durationMs: 1350,
},
{
  id: "kw-bounce",
  name: "Bounce",
  category: "stagger",
  keyframes: "0% { transform: translateY(-50px); opacity: 0; animation-timing-function: cubic-bezier(0.8, 0, 1, 1); } 50% { transform: translateY(15px); opacity: 1; animation-timing-function: cubic-bezier(0, 0, 0.2, 1); } 75% { transform: translateY(-5px); opacity: 1; animation-timing-function: cubic-bezier(0.8, 0, 1, 1); } 100% { transform: translateY(0); opacity: 1; }",
  animation: "0.6s forwards",
  baseStyles: "display: inline-block;",
  split: "character",
  staggerDelayMs: 80,
  durationMs: 1080,
},
{
  id: "kw-flip-in",
  name: "Flip In",
  category: "stagger",
  keyframes: "from { transform: perspective(400px) rotateX(-90deg); opacity: 0; transform-origin: bottom; } to { transform: perspective(400px) rotateX(0deg); opacity: 1; transform-origin: bottom; }",
  animation: "0.6s forwards",
  baseStyles: "display: inline-block;",
  split: "character",
  staggerDelayMs: 50,
  durationMs: 950,
},
{
  id: "kw-rotate-in",
  name: "Rotate In",
  category: "stagger",
  keyframes: "from { transform: rotate(-180deg) scale(0); opacity: 0; } to { transform: rotate(0) scale(1); opacity: 1; }",
  animation: "0.5s forwards",
  baseStyles: "display: inline-block;",
  split: "character",
  staggerDelayMs: 50,
  durationMs: 950,
},
{
  id: "kw-slide-down",
  name: "Slide Down",
  category: "stagger",
  keyframes: "from { transform: translateY(-100%); opacity: 0; } to { transform: translateY(0); opacity: 1; }",
  animation: "0.5s forwards",
  baseStyles: "display: inline-block;",
  split: "character",
  staggerDelayMs: 50,
  durationMs: 1000,
},
{
  id: "kw-slide-left",
  name: "Slide Left",
  category: "stagger",
  keyframes: "from { transform: translateX(-100%); opacity: 0; } to { transform: translateX(0); opacity: 1; }",
  animation: "0.5s forwards",
  baseStyles: "display: inline-block;",
  split: "character",
  staggerDelayMs: 50,
  durationMs: 1000,
},
{
  id: "kw-slide-right",
  name: "Slide Right",
  category: "stagger",
  keyframes: "from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; }",
  animation: "0.5s forwards",
  baseStyles: "display: inline-block;",
  split: "character",
  staggerDelayMs: 50,
  durationMs: 1050,
},
{
  id: "kw-drop-in",
  name: "Drop In",
  category: "stagger",
  keyframes: "0% { transform: translateY(-200%); opacity: 0; } 60% { transform: translateY(20%); opacity: 1; } 80% { transform: translateY(-10%); opacity: 1; } 100% { transform: translateY(0); opacity: 1; }",
  animation: "0.6s forwards",
  baseStyles: "display: inline-block;",
  split: "character",
  staggerDelayMs: 60,
  durationMs: 1020,
},
{
  id: "kw-swing",
  name: "Swing",
  category: "decorative",
  keyframes: "0% { opacity: 0; transform: rotate(15deg); } 20% { opacity: 1; transform: rotate(15deg); } 40% { transform: rotate(-10deg); opacity: 1; } 60% { transform: rotate(5deg); opacity: 1; } 80% { transform: rotate(-5deg); opacity: 1; } 100% { transform: rotate(0deg); opacity: 1; }",
  animation: "0.8s forwards",
  baseStyles: "display: inline-block;",
  split: "character",
  staggerDelayMs: 50,
  durationMs: 1050,
},
{
  id: "kw-pulse",
  name: "Pulse",
  category: "loop",
  keyframes: "0% { transform: scale(1); opacity: 0; } 50% { transform: scale(1.2); opacity: 1; } 100% { transform: scale(1); opacity: 1; }",
  animation: "0.5s forwards",
  baseStyles: "display: inline-block;",
  split: "character",
  staggerDelayMs: 50,
  durationMs: 750,
},
{
  id: "kw-flash",
  name: "Flash",
  category: "loop",
  keyframes: "0%, 50%, 100% { opacity: 1; } 25%, 75% { opacity: 0; }",
  animation: "1s forwards",
  baseStyles: "display: inline-block;",
  split: "character",
  staggerDelayMs: 50,
  durationMs: 1250,
},
{
  id: "kw-shake-x",
  name: "Shake X",
  category: "decorative",
  keyframes: "0%, 100% { transform: translateX(0); opacity: 0; } 10%, 30%, 50%, 70%, 90% { transform: translateX(-10px); opacity: 1; } 20%, 40%, 60%, 80% { transform: translateX(10px); opacity: 1; }",
  animation: "0.8s forwards",
  baseStyles: "display: inline-block;",
  split: "character",
  staggerDelayMs: 50,
  durationMs: 1150,
},
{
  id: "kw-shake-y",
  name: "Shake Y",
  category: "decorative",
  keyframes: "0%, 100% { transform: translateY(0); opacity: 0; } 10%, 30%, 50%, 70%, 90% { transform: translateY(-10px); opacity: 1; } 20%, 40%, 60%, 80% { transform: translateY(10px); opacity: 1; }",
  animation: "0.8s forwards",
  baseStyles: "display: inline-block;",
  split: "character",
  staggerDelayMs: 50,
  durationMs: 1150,
},
{
  id: "kw-tada",
  name: "Tada",
  category: "decorative",
  keyframes: "0% { transform: scale(1); opacity: 0; } 10%, 20% { transform: scale(0.9) rotate(-3deg); opacity: 1; } 30%, 50%, 70%, 90% { transform: scale(1.1) rotate(3deg); opacity: 1; } 40%, 60%, 80% { transform: scale(1.1) rotate(-3deg); opacity: 1; } 100% { transform: scale(1) rotate(0); opacity: 1; }",
  animation: "0.8s forwards",
  baseStyles: "display: inline-block;",
  split: "character",
  staggerDelayMs: 50,
  durationMs: 1000,
},
{
  id: "kw-jello",
  name: "Jello",
  category: "decorative",
  keyframes: "0% { transform: translate(0); opacity: 0; } 11.1% { transform: skewX(-12.5deg) skewY(-12.5deg); opacity: 1; } 22.2% { transform: skewX(6.25deg) skewY(6.25deg); opacity: 1; } 33.3% { transform: skewX(-3.125deg) skewY(-3.125deg); opacity: 1; } 44.4% { transform: skewX(1.5625deg) skewY(1.5625deg); opacity: 1; } 55.5% { transform: skewX(-0.78125deg) skewY(-0.78125deg); opacity: 1; } 66.6% { transform: skewX(0.390625deg) skewY(0.390625deg); opacity: 1; } 77.7% { transform: skewX(-0.1953125deg) skewY(-0.1953125deg); opacity: 1; } 100% { transform: translate(0); opacity: 1; }",
  animation: "0.8s forwards",
  baseStyles: "display: inline-block;",
  split: "character",
  staggerDelayMs: 50,
  durationMs: 1050,
},
{
  id: "kw-rubber-band",
  name: "Rubber Band",
  category: "decorative",
  keyframes: "0% { transform: scale(1); opacity: 0; } 30% { transform: scaleX(1.25) scaleY(0.75); opacity: 1; } 40% { transform: scaleX(0.75) scaleY(1.25); opacity: 1; } 50% { transform: scaleX(1.15) scaleY(0.85); opacity: 1; } 65% { transform: scaleX(0.95) scaleY(1.05); opacity: 1; } 75% { transform: scaleX(1.05) scaleY(0.95); opacity: 1; } 100% { transform: scale(1); opacity: 1; }",
  animation: "0.8s forwards",
  baseStyles: "display: inline-block;",
  split: "character",
  staggerDelayMs: 50,
  durationMs: 1350,
},
{
  id: "kw-wave",
  name: "Wave",
  category: "loop",
  keyframes: "0%, 100% { transform: translateY(0); opacity: 1; } 50% { transform: translateY(-15px); opacity: 1; }",
  animation: "0.6s forwards",
  baseStyles: "display: inline-block;",
  split: "character",
  staggerDelayMs: 80,
  durationMs: 920,
},
{
  id: "kw-stretch",
  name: "Stretch",
  category: "stagger",
  keyframes: "0% { transform: scaleX(1); opacity: 0; } 50% { transform: scaleX(1.5); opacity: 1; } 100% { transform: scaleX(1); opacity: 1; }",
  animation: "0.5s forwards",
  baseStyles: "display: inline-block;",
  split: "character",
  staggerDelayMs: 50,
  durationMs: 850,
},
{
  id: "kw-squeeze",
  name: "Squeeze",
  category: "stagger",
  keyframes: "0% { transform: scaleY(1); opacity: 0; } 50% { transform: scaleY(0.5); opacity: 1; } 100% { transform: scaleY(1); opacity: 1; }",
  animation: "0.5s forwards",
  baseStyles: "display: inline-block;",
  split: "character",
  staggerDelayMs: 50,
  durationMs: 850,
},
{
  id: "kw-color-shift",
  name: "Color Shift",
  category: "loop",
  keyframes: "0% { color: #ffffff; opacity: 0; } 33% { color: #ff0055; opacity: 1; } 66% { color: #00ccff; opacity: 1; } 100% { color: #ffffff; opacity: 1; }",
  animation: "1s forwards",
  baseStyles: "display: inline-block;",
  split: "character",
  staggerDelayMs: 50,
  durationMs: 1550,
},
{
  id: "kw-zoom-in",
  name: "Zoom In",
  category: "stagger",
  keyframes: "0% { transform: scale(0); opacity: 0; } 100% { transform: scale(1); opacity: 1; }",
  animation: "0.5s forwards",
  baseStyles: "display: inline-block;",
  split: "character",
  staggerDelayMs: 50,
  durationMs: 850,
},
{
  id: "kw-zoom-out",
  name: "Zoom Out",
  category: "stagger",
  keyframes: "0% { transform: scale(2); opacity: 0; } 100% { transform: scale(1); opacity: 1; }",
  animation: "0.5s forwards",
  baseStyles: "display: inline-block;",
  split: "character",
  staggerDelayMs: 50,
  durationMs: 900,
},
{
  id: "kw-roll-in",
  name: "Roll In",
  category: "stagger",
  keyframes: "0% { transform: translateX(-100%) rotate(-120deg); opacity: 0; } 100% { transform: translateX(0) rotate(0); opacity: 1; }",
  animation: "0.6s forwards",
  baseStyles: "display: inline-block;",
  split: "character",
  staggerDelayMs: 50,
  durationMs: 950,
},
{
  id: "kw-glitch",
  name: "Glitch",
  category: "loop",
  keyframes: "0% { transform: translate(0); opacity: 0; } 10% { transform: translate(-2px, 2px); opacity: 1; } 20% { transform: translate(-2px, -2px); opacity: 1; } 30% { transform: translate(2px, 2px); opacity: 1; } 40% { transform: translate(2px, -2px); opacity: 1; } 50% { transform: translate(-2px, 2px); opacity: 1; } 60% { transform: translate(-2px, -2px); opacity: 1; } 70% { transform: translate(2px, 2px); opacity: 1; } 80% { transform: translate(2px, -2px); opacity: 1; } 90% { transform: translate(-2px, 2px); opacity: 1; } 100% { transform: translate(0); opacity: 1; }",
  animation: "0.4s forwards",
  baseStyles: "display: inline-block;",
  split: "character",
  staggerDelayMs: 100,
  durationMs: 1000,
},
{
  id: "kw-focus-in",
  name: "Focus In",
  category: "stagger",
  keyframes: "0% { filter: blur(12px); transform: scale(1.5); opacity: 0; } 100% { filter: blur(0); transform: scale(1); opacity: 1; }",
  animation: "0.8s forwards",
  baseStyles: "display: inline-block;",
  split: "character",
  staggerDelayMs: 50,
  durationMs: 1200,
},
{
  id: "kw-fall-down",
  name: "Fall Down",
  category: "stagger",
  keyframes: "0% { transform: translateY(-50px); opacity: 0; } 100% { transform: translateY(0); opacity: 1; }",
  animation: "0.5s forwards",
  baseStyles: "display: inline-block;",
  split: "character",
  staggerDelayMs: 50,
  durationMs: 950,
},
{
  id: "kw-rise-up",
  name: "Rise Up",
  category: "stagger",
  keyframes: "0% { transform: translateY(50px); opacity: 0; } 100% { transform: translateY(0); opacity: 1; }",
  animation: "0.5s forwards",
  baseStyles: "display: inline-block;",
  split: "character",
  staggerDelayMs: 50,
  durationMs: 850,
},
{
  id: "kw-pop-in",
  name: "Pop In",
  category: "stagger",
  keyframes: "0% { transform: scale(0.5); opacity: 0; } 80% { transform: scale(1.2); opacity: 1; } 100% { transform: scale(1); opacity: 1; }",
  animation: "0.5s forwards",
  baseStyles: "display: inline-block;",
  split: "character",
  staggerDelayMs: 50,
  durationMs: 800,
},
{
  id: "kw-slit-in-vertical",
  name: "Slit In Vertical",
  category: "stagger",
  keyframes: "0% { transform: scaleY(0); opacity: 0; } 100% { transform: scaleY(1); opacity: 1; }",
  animation: "0.5s forwards",
  baseStyles: "display: inline-block;",
  split: "character",
  staggerDelayMs: 50,
  durationMs: 1300,
},
{
  id: "kw-slit-in-horizontal",
  name: "Slit In Horizontal",
  category: "stagger",
  keyframes: "0% { transform: scaleX(0); opacity: 0; } 100% { transform: scaleX(1); opacity: 1; }",
  animation: "0.5s forwards",
  baseStyles: "display: inline-block;",
  split: "character",
  staggerDelayMs: 50,
  durationMs: 1400,
},
{
  id: "kw-roll-in-top",
  name: "Roll In Top",
  category: "stagger",
  keyframes: "0% { transform: translateY(-50px) rotate(-120deg); opacity: 0; } 100% { transform: translateY(0) rotate(0); opacity: 1; }",
  animation: "0.6s forwards",
  baseStyles: "display: inline-block;",
  split: "character",
  staggerDelayMs: 50,
  durationMs: 1150,
},
{
  id: "kw-roll-in-bottom",
  name: "Roll In Bottom",
  category: "stagger",
  keyframes: "0% { transform: translateY(50px) rotate(120deg); opacity: 0; } 100% { transform: translateY(0) rotate(0); opacity: 1; }",
  animation: "0.6s forwards",
  baseStyles: "display: inline-block;",
  split: "character",
  staggerDelayMs: 50,
  durationMs: 1300,
},
{
  id: "kw-bounce-in-left",
  name: "Bounce In Left",
  category: "stagger",
  keyframes: "0% { transform: translateX(-50px); opacity: 0; } 60% { transform: translateX(10px); opacity: 1; } 80% { transform: translateX(-5px); opacity: 1; } 100% { transform: translateX(0); opacity: 1; }",
  animation: "0.6s forwards",
  baseStyles: "display: inline-block;",
  split: "character",
  staggerDelayMs: 50,
  durationMs: 1300,
},
{
  id: "kw-bounce-in-right",
  name: "Bounce In Right",
  category: "stagger",
  keyframes: "0% { transform: translateX(50px); opacity: 0; } 60% { transform: translateX(-10px); opacity: 1; } 80% { transform: translateX(5px); opacity: 1; } 100% { transform: translateX(0); opacity: 1; }",
  animation: "0.6s forwards",
  baseStyles: "display: inline-block;",
  split: "character",
  staggerDelayMs: 50,
  durationMs: 1350,
},
{
  id: "kw-rotate-in-y",
  name: "Rotate In Y",
  category: "specialty",
  keyframes: "0% { transform: perspective(400px) rotateY(90deg); opacity: 0; } 100% { transform: perspective(400px) rotateY(0deg); opacity: 1; }",
  animation: "0.6s forwards",
  baseStyles: "display: inline-block;",
  split: "character",
  staggerDelayMs: 50,
  is3d: true,
  durationMs: 1150,
},
{
  id: "kw-rotate-in-x",
  name: "Rotate In X",
  category: "specialty",
  keyframes: "0% { transform: perspective(400px) rotateX(90deg); opacity: 0; } 100% { transform: perspective(400px) rotateX(0deg); opacity: 1; }",
  animation: "0.6s forwards",
  baseStyles: "display: inline-block;",
  split: "character",
  staggerDelayMs: 50,
  is3d: true,
  durationMs: 1150,
},
{
  id: "kw-flicker",
  name: "Flicker",
  category: "loop",
  keyframes: "0%, 2%, 4%, 8%, 12%, 16%, 20% { opacity: 0; } 1%, 3%, 5%, 9%, 13%, 17%, 21%, 100% { opacity: 1; }",
  animation: "1.2s forwards",
  baseStyles: "display: inline-block;",
  split: "character",
  staggerDelayMs: 50,
  durationMs: 1550,
},
{
  id: "kw-blur-in-right",
  name: "Blur In Right",
  category: "stagger",
  keyframes: "0% { transform: translateX(50px); filter: blur(10px); opacity: 0; } 100% { transform: translateX(0); filter: blur(0); opacity: 1; }",
  animation: "0.6s forwards",
  baseStyles: "display: inline-block;",
  split: "character",
  staggerDelayMs: 50,
  durationMs: 1250,
},
{
  id: "kw-blur-in-left",
  name: "Blur In Left",
  category: "stagger",
  keyframes: "0% { transform: translateX(-50px); filter: blur(10px); opacity: 0; } 100% { transform: translateX(0); filter: blur(0); opacity: 1; }",
  animation: "0.6s forwards",
  baseStyles: "display: inline-block;",
  split: "character",
  staggerDelayMs: 50,
  durationMs: 1200,
},
{
  id: "kw-fly-in-up",
  name: "Fly In Up",
  category: "stagger",
  keyframes: "0% { transform: translateY(200px); opacity: 0; } 100% { transform: translateY(0); opacity: 1; }",
  animation: "0.8s forwards",
  baseStyles: "display: inline-block;",
  split: "character",
  staggerDelayMs: 30,
  durationMs: 1070,
},
{
  id: "kw-fly-in-down",
  name: "Fly In Down",
  category: "stagger",
  keyframes: "0% { transform: translateY(-200px); opacity: 0; } 100% { transform: translateY(0); opacity: 1; }",
  animation: "0.8s forwards",
  baseStyles: "display: inline-block;",
  split: "character",
  staggerDelayMs: 30,
  durationMs: 1130,
},
{
  id: "kw-wobble",
  name: "Wobble",
  category: "decorative",
  keyframes: "0% { transform: translateX(0%); } 15% { transform: translateX(-15%) rotate(-5deg); opacity: 1; } 30% { transform: translateX(10%) rotate(3deg); } 45% { transform: translateX(-10%) rotate(-3deg); } 60% { transform: translateX(5%) rotate(2deg); } 75% { transform: translateX(-2%) rotate(-1deg); } 100% { transform: translateX(0%); opacity: 1; }",
  animation: "1s forwards",
  baseStyles: "display: inline-block;",
  split: "character",
  staggerDelayMs: 50,
  durationMs: 1300,
},
{
  id: "kw-tracking-expand",
  name: "Tracking Expand",
  category: "entrance",
  keyframes: "0% { letter-spacing: -0.5em; opacity: 0; } 100% { letter-spacing: 0.05em; opacity: 1; }",
  animation: "1.2s forwards",
  baseStyles: "display: inline-block;",
  split: "character",
  staggerDelayMs: 50,
  durationMs: 1950,
},
{
  id: "kw-tracking-contract",
  name: "Tracking Contract",
  category: "entrance",
  keyframes: "0% { letter-spacing: 1em; opacity: 0; } 100% { letter-spacing: 0.05em; opacity: 1; }",
  animation: "1.2s forwards",
  baseStyles: "display: inline-block;",
  split: "character",
  staggerDelayMs: 50,
  durationMs: 2050,
},
{
  id: "kw-skew-in-up",
  name: "Skew In Up",
  category: "stagger",
  keyframes: "0% { transform: translateY(100%) skewY(20deg); opacity: 0; } 100% { transform: translateY(0) skewY(0deg); opacity: 1; }",
  animation: "0.6s forwards",
  baseStyles: "display: inline-block;",
  split: "character",
  staggerDelayMs: 50,
  durationMs: 1100,
},
{
  id: "kw-skew-in-down",
  name: "Skew In Down",
  category: "stagger",
  keyframes: "0% { transform: translateY(-100%) skewY(-20deg); opacity: 0; } 100% { transform: translateY(0) skewY(0deg); opacity: 1; }",
  animation: "0.6s forwards",
  baseStyles: "display: inline-block;",
  split: "character",
  staggerDelayMs: 50,
  durationMs: 1200,
},
{
  id: "kw-skew-in-left",
  name: "Skew In Left",
  category: "stagger",
  keyframes: "0% { transform: translateX(-100%) skewX(30deg); opacity: 0; } 100% { transform: translateX(0) skewX(0deg); opacity: 1; }",
  animation: "0.6s forwards",
  baseStyles: "display: inline-block;",
  split: "character",
  staggerDelayMs: 50,
  durationMs: 1200,
},
{
  id: "kw-skew-in-right",
  name: "Skew In Right",
  category: "stagger",
  keyframes: "0% { transform: translateX(100%) skewX(-30deg); opacity: 0; } 100% { transform: translateX(0) skewX(0deg); opacity: 1; }",
  animation: "0.6s forwards",
  baseStyles: "display: inline-block;",
  split: "character",
  staggerDelayMs: 50,
  durationMs: 1250,
},
{
  id: "kw-unfold-vertical",
  name: "Unfold Vertical",
  category: "stagger",
  keyframes: "0% { transform: rotateX(-90deg); opacity: 0; } 100% { transform: rotateX(0deg); opacity: 1; }",
  animation: "0.6s forwards",
  baseStyles: "display: inline-block;",
  split: "character",
  staggerDelayMs: 50,
  durationMs: 1350,
},
{
  id: "kw-unfold-horizontal",
  name: "Unfold Horizontal",
  category: "stagger",
  keyframes: "0% { transform: rotateY(-90deg); opacity: 0; } 100% { transform: rotateY(0deg); opacity: 1; }",
  animation: "0.6s forwards",
  baseStyles: "display: inline-block;",
  split: "character",
  staggerDelayMs: 50,
  durationMs: 1450,
},
{
  id: "kw-outline-to-solid",
  name: "Outline To Solid",
  category: "entrance",
  keyframes: "0% { -webkit-text-stroke: 1px #fff; color: transparent; opacity: 0; } 50% { -webkit-text-stroke: 1px #fff; color: transparent; opacity: 1; } 100% { -webkit-text-stroke: 0px transparent; color: #fff; opacity: 1; }",
  animation: "0.8s forwards",
  baseStyles: "display: inline-block;",
  split: "character",
  staggerDelayMs: 50,
  durationMs: 1600,
},
{
  id: "kw-solid-to-outline",
  name: "Solid To Outline",
  category: "entrance",
  keyframes: "0% { -webkit-text-stroke: 0px transparent; color: #fff; opacity: 0; } 50% { -webkit-text-stroke: 0px transparent; color: #fff; opacity: 1; } 100% { -webkit-text-stroke: 1px #fff; color: transparent; opacity: 1; }",
  animation: "0.8s forwards",
  baseStyles: "display: inline-block;",
  split: "character",
  staggerDelayMs: 50,
  durationMs: 1600,
},
{
  id: "kw-smoke-in",
  name: "Smoke In",
  category: "stagger",
  keyframes: "0% { transform: translateY(-20px) scale(1.5); filter: blur(20px); opacity: 0; } 100% { transform: translateY(0) scale(1); filter: blur(0); opacity: 1; }",
  animation: "0.8s forwards",
  baseStyles: "display: inline-block;",
  split: "character",
  staggerDelayMs: 50,
  durationMs: 1200,
},
{
  id: "kw-smoke-out",
  name: "Smoke Out",
  category: "stagger",
  keyframes: "0% { transform: translateY(0) scale(1); filter: blur(0); opacity: 1; } 100% { transform: translateY(-20px) scale(1.5); filter: blur(20px); opacity: 0; }",
  animation: "0.8s forwards",
  baseStyles: "display: inline-block;",
  split: "character",
  staggerDelayMs: 50,
  durationMs: 1250,
},
{
  id: "kw-slot-drop",
  name: "Slot Drop",
  category: "stagger",
  keyframes: "0% { transform: translateY(-300%); filter: blur(5px); opacity: 0; } 50% { transform: translateY(20%); filter: blur(2px); opacity: 1; } 100% { transform: translateY(0); filter: blur(0); opacity: 1; }",
  animation: "0.6s forwards",
  baseStyles: "display: inline-block;",
  split: "character",
  staggerDelayMs: 50,
  durationMs: 1050,
},
{
  id: "kw-elastic-scale",
  name: "Elastic Scale",
  category: "stagger",
  keyframes: "0% { transform: scale(0); opacity: 0; } 60% { transform: scale(1.3); opacity: 1; } 80% { transform: scale(0.9); opacity: 1; } 100% { transform: scale(1); opacity: 1; }",
  animation: "0.8s forwards",
  baseStyles: "display: inline-block;",
  split: "character",
  staggerDelayMs: 50,
  durationMs: 1450,
},
{
  id: "kw-glitch-rgb",
  name: "Glitch RGB",
  category: "loop",
  keyframes: "0% { text-shadow: 2px 0 0 red, -2px 0 0 blue; opacity: 0; } 20% { text-shadow: -2px 0 0 red, 2px 0 0 blue; opacity: 1; } 40% { text-shadow: 2px 0 0 red, -2px 0 0 blue; } 60% { text-shadow: -2px 0 0 red, 2px 0 0 blue; } 80% { text-shadow: 1px 0 0 red, -1px 0 0 blue; } 100% { text-shadow: 0px 0 0 transparent; opacity: 1; }",
  animation: "0.4s forwards",
  baseStyles: "display: inline-block;",
  split: "character",
  staggerDelayMs: 100,
  durationMs: 1400,
},
{
  id: "kw-water-drop",
  name: "Water Drop",
  category: "stagger",
  keyframes: "0% { transform: translateY(-100px) scale(0.1, 2); opacity: 0; } 50% { transform: translateY(0) scale(1.5, 0.5); opacity: 1; } 100% { transform: translateY(0) scale(1, 1); opacity: 1; }",
  animation: "0.6s forwards",
  baseStyles: "display: inline-block;",
  split: "character",
  staggerDelayMs: 50,
  durationMs: 1100,
},
{
  id: "kw-anti-gravity",
  name: "Anti Gravity",
  category: "stagger",
  keyframes: "0% { transform: translateY(0); opacity: 0; } 50% { opacity: 1; transform: translateY(-20px); } 100% { transform: translateY(-50px); opacity: 0; }",
  animation: "2s forwards",
  baseStyles: "display: inline-block;",
  split: "character",
  staggerDelayMs: 100,
  durationMs: 3200,
},
{
  id: "kw-falling-leaves",
  name: "Falling Leaves",
  category: "stagger",
  keyframes: "0% { transform: translate(0, -50px) rotate(0deg); opacity: 0; } 50% { transform: translate(20px, 0) rotate(45deg); opacity: 1; } 100% { transform: translate(-20px, 50px) rotate(90deg); opacity: 0; }",
  animation: "1.5s forwards",
  baseStyles: "display: inline-block;",
  split: "character",
  staggerDelayMs: 100,
  durationMs: 2900,
},
{
  id: "kw-slingshot",
  name: "Slingshot",
  category: "stagger",
  keyframes: "0% { transform: translateZ(-500px) scale(0.1); opacity: 0; } 60% { transform: translateZ(100px) scale(1.2); opacity: 1; } 100% { transform: translateZ(0) scale(1); opacity: 1; }",
  animation: "0.8s forwards",
  baseStyles: "display: inline-block;",
  split: "character",
  staggerDelayMs: 50,
  durationMs: 1250,
},
{
  id: "kw-giant-slide",
  name: "Giant Slide",
  category: "stagger",
  keyframes: "0% { transform: translateX(-200%) scale(3); opacity: 0; } 100% { transform: translateX(0) scale(1); opacity: 1; }",
  animation: "0.6s forwards",
  baseStyles: "display: inline-block;",
  split: "character",
  staggerDelayMs: 50,
  durationMs: 1150,
},
{
  id: "kw-staircase",
  name: "Staircase",
  category: "stagger",
  keyframes: "0% { transform: translateY(50px); opacity: 0; } 100% { transform: translateY(0); opacity: 1; }",
  animation: "0.5s forwards",
  baseStyles: "display: inline-block;",
  split: "character",
  staggerDelayMs: 100,
  durationMs: 1400,
},
{
  id: "kw-shadow-first",
  name: "Shadow First",
  category: "stagger",
  keyframes: "0% { text-shadow: 0 50px 20px rgba(255,255,255,0); opacity: 0; color: transparent; } 50% { text-shadow: 0 0 5px rgba(255,255,255,0.8); opacity: 1; color: transparent; } 100% { text-shadow: 0 0 0 rgba(255,255,255,0); color: #fff; opacity: 1; }",
  animation: "0.8s forwards",
  baseStyles: "display: inline-block;",
  split: "character",
  staggerDelayMs: 50,
  durationMs: 1400,
},
{
  id: "kw-cube-flip-x",
  name: "Cube Flip X",
  category: "specialty",
  keyframes: "0% { transform: perspective(400px) rotateX(-90deg) translateZ(50px); opacity: 0; } 100% { transform: perspective(400px) rotateX(0deg) translateZ(0); opacity: 1; }",
  animation: "0.6s forwards",
  baseStyles: "display: inline-block;",
  split: "character",
  staggerDelayMs: 50,
  is3d: true,
  durationMs: 1150,
},
{
  id: "kw-cube-flip-y",
  name: "Cube Flip Y",
  category: "specialty",
  keyframes: "0% { transform: perspective(400px) rotateY(-90deg) translateZ(50px); opacity: 0; } 100% { transform: perspective(400px) rotateY(0deg) translateZ(0); opacity: 1; }",
  animation: "0.6s forwards",
  baseStyles: "display: inline-block;",
  split: "character",
  staggerDelayMs: 50,
  is3d: true,
  durationMs: 1150,
},
{
  id: "kw-speed-dash",
  name: "Speed Dash",
  category: "stagger",
  keyframes: "0% { transform: translateX(-200%) skewX(-45deg); opacity: 0; } 70% { transform: translateX(10%) skewX(-10deg); opacity: 1; } 100% { transform: translateX(0) skewX(0deg); opacity: 1; }",
  animation: "0.5s forwards",
  baseStyles: "display: inline-block;",
  split: "character",
  staggerDelayMs: 50,
  durationMs: 1000,
},
{
  id: "kw-heartbeat-burst",
  name: "Heartbeat Burst",
  category: "loop",
  keyframes: "0% { transform: scale(0.5); opacity: 0; } 30% { transform: scale(1.2); opacity: 1; } 50% { transform: scale(0.9); opacity: 1; } 70% { transform: scale(1.1); opacity: 1; } 100% { transform: scale(1); opacity: 1; }",
  animation: "0.8s forwards",
  baseStyles: "display: inline-block;",
  split: "character",
  staggerDelayMs: 50,
  durationMs: 1550,
},
{
  id: "kw-movie-credits",
  name: "Movie Credits",
  category: "entrance",
  keyframes: "0% { transform: translateY(50px); opacity: 0; } 20% { opacity: 1; } 80% { opacity: 1; } 100% { transform: translateY(-50px); opacity: 0; }",
  animation: "2s forwards",
  baseStyles: "display: inline-block;",
  split: "character",
  staggerDelayMs: 100,
  durationMs: 3300,
},
{
  id: "kw-springy-text",
  name: "Springy Text",
  category: "stagger",
  keyframes: "0% { transform: scaleY(0); transform-origin: bottom; opacity: 0; } 50% { transform: scaleY(1.5); opacity: 1; } 75% { transform: scaleY(0.8); } 100% { transform: scaleY(1); opacity: 1; }",
  animation: "0.6s forwards",
  baseStyles: "display: inline-block;",
  split: "character",
  staggerDelayMs: 50,
  durationMs: 1200,
},
{
  id: "kw-flip-bounce",
  name: "Flip Bounce",
  category: "stagger",
  keyframes: "0% { transform: perspective(400px) rotateX(90deg); opacity: 0; } 50% { transform: perspective(400px) rotateX(-20deg); opacity: 1; } 75% { transform: perspective(400px) rotateX(10deg); opacity: 1; } 100% { transform: perspective(400px) rotateX(0deg); opacity: 1; }",
  animation: "0.8s forwards",
  baseStyles: "display: inline-block;",
  split: "character",
  staggerDelayMs: 50,
  durationMs: 1350,
},
{
  id: "kw-rotate-3d-in",
  name: "Rotate 3D In",
  category: "specialty",
  keyframes: "0% { transform: perspective(500px) rotate3d(1, 1, 1, 90deg); opacity: 0; } 100% { transform: perspective(500px) rotate3d(0, 0, 0, 0deg); opacity: 1; }",
  animation: "0.8s forwards",
  baseStyles: "display: inline-block;",
  split: "character",
  staggerDelayMs: 50,
  is3d: true,
  durationMs: 1400,
},
{
  id: "kw-squeeze-expand",
  name: "Squeeze Expand",
  category: "stagger",
  keyframes: "0% { letter-spacing: -0.5em; opacity: 0; transform: scaleY(0.1); } 50% { letter-spacing: 0.2em; transform: scaleY(1.2); opacity: 1; } 100% { letter-spacing: 0.05em; transform: scaleY(1); opacity: 1; }",
  animation: "0.8s forwards",
  baseStyles: "display: inline-block;",
  split: "character",
  staggerDelayMs: 50,
  durationMs: 1500,
},
{
  id: "kw-zip-in",
  name: "Zip In",
  category: "stagger",
  keyframes: "0% { transform: scale(0); opacity: 0; } 80% { transform: scale(1.1) rotate(10deg); opacity: 1; } 100% { transform: scale(1) rotate(0deg); opacity: 1; }",
  animation: "0.5s forwards",
  baseStyles: "display: inline-block;",
  split: "character",
  staggerDelayMs: 50,
  durationMs: 800,
},
{
  id: "kw-blur-drop",
  name: "Blur Drop",
  category: "stagger",
  keyframes: "0% { transform: translateY(-50px); filter: blur(10px); opacity: 0; } 100% { transform: translateY(0); filter: blur(0); opacity: 1; }",
  animation: "0.6s forwards",
  baseStyles: "display: inline-block;",
  split: "character",
  staggerDelayMs: 50,
  durationMs: 1050,
},
{
  id: "kw-blur-rise",
  name: "Blur Rise",
  category: "stagger",
  keyframes: "0% { transform: translateY(50px); filter: blur(10px); opacity: 0; } 100% { transform: translateY(0); filter: blur(0); opacity: 1; }",
  animation: "0.6s forwards",
  baseStyles: "display: inline-block;",
  split: "character",
  staggerDelayMs: 50,
  durationMs: 1050,
},
{
  id: "kw-swing-in",
  name: "Swing In",
  category: "stagger",
  keyframes: "0% { transform: rotateX(-100deg); transform-origin: top; opacity: 0; } 100% { transform: rotateX(0deg); transform-origin: top; opacity: 1; }",
  animation: "0.8s forwards",
  baseStyles: "display: inline-block;",
  split: "character",
  staggerDelayMs: 50,
  durationMs: 1200,
},
{
  id: "kw-swing-out",
  name: "Swing Out",
  category: "stagger",
  keyframes: "0% { transform: rotateX(0deg); transform-origin: top; opacity: 1; } 100% { transform: rotateX(-100deg); transform-origin: top; opacity: 0; }",
  animation: "0.8s forwards",
  baseStyles: "display: inline-block;",
  split: "character",
  staggerDelayMs: 50,
  durationMs: 1250,
},
{
  id: "kw-pendulum",
  name: "Pendulum",
  category: "decorative",
  keyframes: "0% { transform: rotate(10deg); transform-origin: top; opacity: 0; } 50% { transform: rotate(-5deg); transform-origin: top; opacity: 1; } 100% { transform: rotate(0deg); transform-origin: top; opacity: 1; }",
  animation: "1s forwards",
  baseStyles: "display: inline-block;",
  split: "character",
  staggerDelayMs: 50,
  durationMs: 1400,
},
{
  id: "kw-pulse-neon",
  name: "Pulse Neon",
  category: "loop",
  keyframes: "0%, 100% { text-shadow: 0 0 5px #fff, 0 0 10px #fff, 0 0 20px #0ff; opacity: 1; } 50% { text-shadow: 0 0 2px #fff, 0 0 5px #fff, 0 0 10px #0ff; opacity: 0.5; }",
  animation: "1.5s forwards",
  baseStyles: "display: inline-block;",
  split: "character",
  staggerDelayMs: 50,
  durationMs: 2000,
},
{
  id: "kw-flip-in-x",
  name: "Flip In X",
  category: "specialty",
  keyframes: "0% { transform: perspective(400px) rotateX(90deg); opacity: 0; } 100% { transform: perspective(400px) rotateX(0deg); opacity: 1; }",
  animation: "0.5s forwards",
  baseStyles: "display: inline-block;",
  split: "character",
  staggerDelayMs: 50,
  is3d: true,
  durationMs: 950,
},
{
  id: "kw-flip-in-y",
  name: "Flip In Y",
  category: "specialty",
  keyframes: "0% { transform: perspective(400px) rotateY(90deg); opacity: 0; } 100% { transform: perspective(400px) rotateY(0deg); opacity: 1; }",
  animation: "0.5s forwards",
  baseStyles: "display: inline-block;",
  split: "character",
  staggerDelayMs: 50,
  is3d: true,
  durationMs: 950,
},
{
  id: "kw-boomerang",
  name: "Boomerang",
  category: "stagger",
  keyframes: "0% { transform: translateZ(-500px) rotate(45deg); opacity: 0; } 50% { transform: translateZ(100px) rotate(-10deg); opacity: 1; } 100% { transform: translateZ(0) rotate(0deg); opacity: 1; }",
  animation: "0.8s forwards",
  baseStyles: "display: inline-block;",
  split: "character",
  staggerDelayMs: 50,
  durationMs: 1250,
},
{
  id: "kw-space-in",
  name: "Space In",
  category: "stagger",
  keyframes: "0% { transform: scale(0.2) translateZ(-1000px); opacity: 0; } 100% { transform: scale(1) translateZ(0); opacity: 1; }",
  animation: "1s forwards",
  baseStyles: "display: inline-block;",
  split: "character",
  staggerDelayMs: 50,
  durationMs: 1400,
},
{
  id: "kw-perspective-in",
  name: "Perspective In",
  category: "specialty",
  keyframes: "0% { transform: perspective(800px) translateZ(300px); opacity: 0; } 100% { transform: perspective(800px) translateZ(0); opacity: 1; }",
  animation: "0.8s forwards",
  baseStyles: "display: inline-block;",
  split: "character",
  staggerDelayMs: 50,
  is3d: true,
  durationMs: 1500,
},
{
  id: "kw-expand-forward",
  name: "Expand Forward",
  category: "stagger",
  keyframes: "0% { letter-spacing: -0.5em; transform: translateZ(-700px); opacity: 0; } 100% { letter-spacing: 0.05em; transform: translateZ(0); opacity: 1; }",
  animation: "1s forwards",
  baseStyles: "display: inline-block;",
  split: "character",
  staggerDelayMs: 50,
  durationMs: 1700,
},
{
  id: "kw-contract-back",
  name: "Contract Back",
  category: "stagger",
  keyframes: "0% { letter-spacing: 0.05em; transform: translateZ(0); opacity: 1; } 100% { letter-spacing: -0.5em; transform: translateZ(-500px); opacity: 0; }",
  animation: "1s forwards",
  baseStyles: "display: inline-block;",
  split: "character",
  staggerDelayMs: 50,
  durationMs: 1650,
},
{
  id: "kw-text-shadow-pop",
  name: "Text Shadow Pop",
  category: "decorative",
  keyframes: "0% { text-shadow: 0 0 #555, 0 0 #555; transform: translateX(0) translateY(0); opacity: 0; } 100% { text-shadow: 1px 1px #555, 2px 2px #555, 3px 3px #555, 4px 4px #555; transform: translateX(-4px) translateY(-4px); opacity: 1; }",
  animation: "0.5s forwards",
  baseStyles: "display: inline-block;",
  split: "character",
  staggerDelayMs: 50,
  durationMs: 1250,
},
{
  id: "kw-flicker-in",
  name: "Flicker In",
  category: "stagger",
  keyframes: "0% { opacity: 0; } 10% { opacity: 1; } 20% { opacity: 0; } 30% { opacity: 1; } 40% { opacity: 0; } 50% { opacity: 1; } 100% { opacity: 1; }",
  animation: "1.2s forwards",
  baseStyles: "display: inline-block;",
  split: "character",
  staggerDelayMs: 50,
  durationMs: 1700,
},
{
  id: "kw-typewriter",
  name: "Typewriter",
  category: "specialty",
  engine: "js",
  jsDriver: { kind: "typewriter", stepMs: 80 },
  durationMs: 1700,
},
{
  id: "kw-terminal-type",
  name: "Terminal Type",
  category: "specialty",
  engine: "js",
  jsDriver: { kind: "terminal", stepMs: 100 },
  sampleText: "init system...",
  durationMs: 2300,
},
{
  id: "kw-shuffle-text",
  name: "Shuffle Text",
  category: "specialty",
  engine: "js",
  jsDriver: { kind: "shuffle", stepMs: 30 },
  durationMs: 2010,
},
{
  id: "kw-binary-decode",
  name: "Binary Decode",
  category: "specialty",
  engine: "js",
  jsDriver: { kind: "binary-decode", stepMs: 40 },
  sampleText: "01001011 Decode",
  durationMs: 3380,
},
{
  id: "kw-random-reveal",
  name: "Random Reveal",
  category: "specialty",
  engine: "js",
  jsDriver: { kind: "random-reveal", stepMs: 50 },
  durationMs: 1550,
},
{
  id: "kw-spotlight",
  name: "Spotlight",
  category: "specialty",
  engine: "js",
  jsDriver: { kind: "spotlight", sweepMs: 2000 },
  durationMs: 2900,
},
{
  id: "ta-fade-in-up",
  name: "Fade in up",
  category: "entrance",
  keyframes: "from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); }",
  animation: "0.7s cubic-bezier(0.16, 1, 0.3, 1) both",
  durationMs: 2800,
},
{
  id: "ta-fade-in-down",
  name: "Fade in down",
  category: "entrance",
  keyframes: "from { opacity: 0; transform: translateY(-20px); } to { opacity: 1; transform: translateY(0); }",
  animation: "0.7s cubic-bezier(0.16, 1, 0.3, 1) both",
  durationMs: 2800,
},
{
  id: "ta-fade-in-left",
  name: "Fade in left",
  category: "entrance",
  keyframes: "from { opacity: 0; transform: translateX(-20px); } to { opacity: 1; transform: translateX(0); }",
  animation: "0.7s cubic-bezier(0.16, 1, 0.3, 1) both",
  durationMs: 2800,
},
{
  id: "ta-fade-in-right",
  name: "Fade in right",
  category: "entrance",
  keyframes: "from { opacity: 0; transform: translateX(20px); } to { opacity: 1; transform: translateX(0); }",
  animation: "0.7s cubic-bezier(0.16, 1, 0.3, 1) both",
  durationMs: 2800,
},
{
  id: "ta-slide-in-up",
  name: "Slide in up",
  category: "entrance",
  keyframes: "from { transform: translateY(100%); } to { transform: translateY(0); }",
  animation: "0.6s cubic-bezier(0.16, 1, 0.3, 1) both",
  durationMs: 2800,
},
{
  id: "ta-slide-in-down",
  name: "Slide in down",
  category: "entrance",
  keyframes: "from { transform: translateY(-100%); } to { transform: translateY(0); }",
  animation: "0.6s cubic-bezier(0.16, 1, 0.3, 1) both",
  durationMs: 2800,
},
{
  id: "ta-slide-in-left",
  name: "Slide in left",
  category: "entrance",
  keyframes: "from { transform: translateX(-100%); } to { transform: translateX(0); }",
  animation: "0.6s cubic-bezier(0.16, 1, 0.3, 1) both",
  durationMs: 2800,
},
{
  id: "ta-slide-in-right",
  name: "Slide in right",
  category: "entrance",
  keyframes: "from { transform: translateX(100%); } to { transform: translateX(0); }",
  animation: "0.6s cubic-bezier(0.16, 1, 0.3, 1) both",
  durationMs: 2800,
},
{
  id: "ta-zoom-in",
  name: "Zoom in",
  category: "entrance",
  keyframes: "from { opacity: 0; transform: scale(0.5); } to { opacity: 1; transform: scale(1); }",
  animation: "0.6s cubic-bezier(0.16, 1, 0.3, 1) both",
  durationMs: 2800,
},
{
  id: "ta-zoom-out-settle",
  name: "Zoom out settle",
  category: "entrance",
  keyframes: "from { opacity: 0; transform: scale(1.5); } to { opacity: 1; transform: scale(1); }",
  animation: "0.7s cubic-bezier(0.16, 1, 0.3, 1) both",
  durationMs: 2800,
},
{
  id: "ta-zoom-bounce",
  name: "Zoom bounce",
  category: "entrance",
  keyframes: "0% { opacity: 0; transform: scale(0.6); } 60% { opacity: 1; transform: scale(1.08); } 100% { transform: scale(1); }",
  animation: "0.8s cubic-bezier(0.34, 1.56, 0.64, 1) both",
  durationMs: 2800,
},
{
  id: "ta-focus-in",
  name: "Focus in",
  category: "entrance",
  keyframes: "from { opacity: 0; filter: blur(16px); transform: scale(1.4); } to { opacity: 1; filter: blur(0); transform: scale(1); }",
  animation: "0.9s cubic-bezier(0.16, 1, 0.3, 1) both",
  durationMs: 2800,
},
{
  id: "ta-skew-in",
  name: "Skew in",
  category: "entrance",
  keyframes: "from { opacity: 0; transform: skewX(-10deg) translateX(-20px); } to { opacity: 1; transform: skewX(0) translateX(0); }",
  animation: "0.7s cubic-bezier(0.16, 1, 0.3, 1) both",
  durationMs: 2800,
},
{
  id: "ta-back-in",
  name: "Back in",
  category: "entrance",
  keyframes: "0% { opacity: 0; transform: scale(0.95); } 70% { opacity: 1; transform: scale(1.02); } 100% { transform: scale(1); }",
  animation: "0.7s cubic-bezier(0.34, 1.56, 0.64, 1) both",
  durationMs: 2800,
},
{
  id: "ta-gradient-sweep",
  name: "Gradient sweep",
  category: "loop",
  keyframes: "0% { background-position: 0% 50%; } 100% { background-position: 200% 50%; }",
  animation: "3s linear infinite",
  baseStyles: `background-image: linear-gradient(90deg, #C2410C 0%, #FB923C 25%, #C2410C 50%, #FB923C 75%, #C2410C 100%);
  background-size: 200% 100%;
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;
  -webkit-text-fill-color: transparent;`,
  durationMs: 3000,
},
{
  id: "ta-gradient-shift",
  name: "Gradient shift",
  category: "loop",
  keyframes: "0%, 100% { background-position: 0% 50%; } 50% { background-position: 100% 50%; }",
  animation: "4s cubic-bezier(0.65, 0, 0.35, 1) infinite",
  baseStyles: `background-image: linear-gradient(90deg, #C2410C, #0EA5E9, #84CC16, #C2410C);
  background-size: 300% 100%;
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;
  -webkit-text-fill-color: transparent;`,
  durationMs: 4000,
},
{
  id: "ta-glitch-rgb",
  name: "Glitch RGB",
  category: "loop",
  keyframes: "0%, 100% { text-shadow: 0 0 0 transparent; } 25% { text-shadow: -2px 0 0 #ef4444, 2px 0 0 #06b6d4; } 50% { text-shadow: 0 0 0 transparent; } 75% { text-shadow: 2px 0 0 #ef4444, -2px 0 0 #06b6d4; }",
  animation: "1.2s linear infinite",
  durationMs: 2400,
},
{
  id: "ta-color-cycle",
  name: "Color cycle",
  category: "loop",
  keyframes: "0%, 100% { color: #C2410C; } 25% { color: #0EA5E9; } 50% { color: #84CC16; } 75% { color: #A855F7; }",
  animation: "4s cubic-bezier(0.65, 0, 0.35, 1) infinite",
  durationMs: 4000,
},
{
  id: "ta-stagger-fade-up",
  name: "Stagger fade up",
  category: "stagger",
  keyframes: "from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); }",
  animation: "0.6s cubic-bezier(0.16, 1, 0.3, 1) both",
  baseStyles: "display: inline-block;",
  split: "character",
  durationMs: 2200,
},
{
  id: "ta-stagger-rise",
  name: "Stagger rise",
  category: "stagger",
  keyframes: "from { opacity: 0; transform: translateY(40px) scale(0.9); } to { opacity: 1; transform: translateY(0) scale(1); }",
  animation: "0.7s cubic-bezier(0.16, 1, 0.3, 1) both",
  baseStyles: "display: inline-block;",
  split: "character",
  durationMs: 2400,
},
{
  id: "ta-stagger-drop",
  name: "Stagger drop",
  category: "stagger",
  keyframes: "from { opacity: 0; transform: translateY(-30px); } to { opacity: 1; transform: translateY(0); }",
  animation: "0.6s cubic-bezier(0.16, 1, 0.3, 1) both",
  baseStyles: "display: inline-block;",
  split: "character",
  durationMs: 2200,
},
{
  id: "ta-stagger-rotate",
  name: "Stagger rotate",
  category: "stagger",
  keyframes: "from { opacity: 0; transform: rotate(-90deg) scale(0.5); } to { opacity: 1; transform: rotate(0) scale(1); }",
  animation: "0.6s cubic-bezier(0.16, 1, 0.3, 1) both",
  baseStyles: "display: inline-block;",
  split: "character",
  staggerDelayMs: 50,
  durationMs: 2400,
},
{
  id: "ta-stagger-zoom",
  name: "Stagger zoom",
  category: "stagger",
  keyframes: "from { opacity: 0; transform: scale(0); } to { opacity: 1; transform: scale(1); }",
  animation: "0.6s cubic-bezier(0.34, 1.56, 0.64, 1) both",
  baseStyles: "display: inline-block;",
  split: "character",
  staggerDelayMs: 50,
  durationMs: 2400,
},
{
  id: "ta-stagger-blur",
  name: "Stagger blur",
  category: "stagger",
  keyframes: "from { opacity: 0; filter: blur(8px); } to { opacity: 1; filter: blur(0); }",
  animation: "0.7s cubic-bezier(0.16, 1, 0.3, 1) both",
  baseStyles: "display: inline-block;",
  split: "character",
  staggerDelayMs: 60,
  durationMs: 2600,
},
{
  id: "ta-stagger-flip",
  name: "Stagger flip",
  category: "stagger",
  keyframes: "from { opacity: 0; transform: perspective(400px) rotateX(-90deg); } to { opacity: 1; transform: perspective(400px) rotateX(0); }",
  animation: "0.7s cubic-bezier(0.16, 1, 0.3, 1) both",
  baseStyles: "display: inline-block;",
  split: "character",
  staggerDelayMs: 60,
  durationMs: 2600,
},
{
  id: "ta-stagger-words-rise",
  name: "Stagger words — rise",
  category: "stagger",
  keyframes: "from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); }",
  animation: "0.6s cubic-bezier(0.16, 1, 0.3, 1) both",
  baseStyles: "display: inline-block;",
  split: "word",
  staggerDelayMs: 150,
  durationMs: 2200,
},
{
  id: "ta-stagger-words-slide",
  name: "Stagger words — slide",
  category: "stagger",
  keyframes: "from { opacity: 0; transform: translateX(-30px); } to { opacity: 1; transform: translateX(0); }",
  animation: "0.6s cubic-bezier(0.16, 1, 0.3, 1) both",
  baseStyles: "display: inline-block;",
  split: "word",
  staggerDelayMs: 150,
  durationMs: 2200,
},
{
  id: "ta-stagger-words-zoom",
  name: "Stagger words — zoom",
  category: "stagger",
  keyframes: "from { opacity: 0; transform: scale(0.6); } to { opacity: 1; transform: scale(1); }",
  animation: "0.6s cubic-bezier(0.34, 1.56, 0.64, 1) both",
  baseStyles: "display: inline-block;",
  split: "word",
  staggerDelayMs: 150,
  durationMs: 2200,
},
{
  id: "ta-stagger-lines-rise",
  name: "Stagger lines — rise",
  category: "stagger",
  keyframes: "from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); }",
  animation: "0.7s cubic-bezier(0.16, 1, 0.3, 1) both",
  baseStyles: "display: block;",
  split: "line",
  staggerDelayMs: 200,
  sampleText: `Line one.
Line two.
Line three.`,
  durationMs: 2400,
},
{
  id: "ta-stagger-lines-fade",
  name: "Stagger lines — fade",
  category: "stagger",
  keyframes: "from { opacity: 0; } to { opacity: 1; }",
  animation: "0.6s cubic-bezier(0.16, 1, 0.3, 1) both",
  baseStyles: "display: block;",
  split: "line",
  staggerDelayMs: 200,
  sampleText: `Line one.
Line two.
Line three.`,
  durationMs: 2400,
},
{
  id: "ta-stagger-lines-reveal",
  name: "Stagger lines — reveal",
  category: "stagger",
  keyframes: "from { opacity: 0; clip-path: inset(0 100% 0 0); } to { opacity: 1; clip-path: inset(0 0 0 0); }",
  animation: "0.8s cubic-bezier(0.16, 1, 0.3, 1) both",
  baseStyles: "display: block;",
  split: "line",
  staggerDelayMs: 250,
  sampleText: `Line one.
Line two.
Line three.`,
  durationMs: 2800,
},
{
  id: "ta-underline-grow",
  name: "Underline grow",
  category: "hover",
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
  transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}
.ta-underline-grow:hover::after {
  transform: scaleX(1);
}`,
  trigger: "hover",
  durationMs: 2800,
},
{
  id: "ta-underline-center",
  name: "Underline center",
  category: "hover",
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
  transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}
.ta-underline-center:hover::after {
  transform: scaleX(1);
}`,
  trigger: "hover",
  durationMs: 2800,
},
{
  id: "ta-underline-reveal",
  name: "Underline reveal",
  category: "hover",
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
  transition: clip-path 0.5s cubic-bezier(0.16, 1, 0.3, 1);
}
.ta-underline-reveal:hover::after {
  clip-path: inset(0 0 0 0);
}`,
  trigger: "hover",
  durationMs: 2800,
},
{
  id: "ta-underline-thick",
  name: "Underline thick",
  category: "hover",
  customCss: `.ta-underline-thick {
  display: inline-block;
  box-shadow: inset 0 0 0 currentColor;
  transition: box-shadow 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}
.ta-underline-thick:hover {
  box-shadow: inset 0 -4px 0 currentColor;
}`,
  trigger: "hover",
  durationMs: 2800,
},
{
  id: "ta-hover-color-shift",
  name: "Hover color shift",
  category: "hover",
  customCss: `.ta-hover-color-shift {
  display: inline-block;
  transition: color 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}
.ta-hover-color-shift:hover {
  color: #C2410C;
}`,
  trigger: "hover",
  durationMs: 2800,
},
{
  id: "ta-hover-highlight",
  name: "Hover highlight",
  category: "hover",
  customCss: `.ta-hover-highlight {
  display: inline-block;
  padding: 0 4px;
  background-image: linear-gradient(transparent 60%, rgba(251, 146, 60, 0.45) 60%);
  background-size: 0 100%;
  background-repeat: no-repeat;
  transition: background-size 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}
.ta-hover-highlight:hover {
  background-size: 100% 100%;
}`,
  trigger: "hover",
  durationMs: 2800,
},
{
  id: "ta-hover-glow",
  name: "Hover glow",
  category: "hover",
  customCss: `.ta-hover-glow {
  display: inline-block;
  text-shadow: 0 0 0 transparent;
  transition: text-shadow 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}
.ta-hover-glow:hover {
  text-shadow: 0 0 12px rgba(251, 146, 60, 0.7);
}`,
  trigger: "hover",
  durationMs: 2800,
},
{
  id: "ta-hover-lift",
  name: "Hover lift",
  category: "hover",
  customCss: `.ta-hover-lift {
  display: inline-block;
  transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}
.ta-hover-lift:hover {
  transform: translateY(-3px);
}`,
  trigger: "hover",
  durationMs: 2800,
},
{
  id: "ta-hover-scale",
  name: "Hover scale",
  category: "hover",
  customCss: `.ta-hover-scale {
  display: inline-block;
  transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}
.ta-hover-scale:hover {
  transform: scale(1.05);
}`,
  trigger: "hover",
  durationMs: 2800,
},
{
  id: "ta-hover-letter-spacing",
  name: "Hover letter spacing",
  category: "hover",
  customCss: `.ta-hover-letter-spacing {
  display: inline-block;
  letter-spacing: normal;
  transition: letter-spacing 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}
.ta-hover-letter-spacing:hover {
  letter-spacing: 0.1em;
}`,
  trigger: "hover",
  durationMs: 2800,
},
{
  id: "ta-hover-strike",
  name: "Hover strikethrough",
  category: "hover",
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
  transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}
.ta-hover-strike:hover::after {
  transform: scaleX(1);
}`,
  trigger: "hover",
  durationMs: 2800,
},
{
  id: "ta-hover-arrow",
  name: "Hover arrow",
  category: "hover",
  customCss: `.ta-hover-arrow {
  position: relative;
  display: inline-block;
  padding-right: 0;
  transition: padding-right 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}
.ta-hover-arrow::after {
  content: '→';
  position: absolute;
  right: 0;
  top: 50%;
  transform: translate(-8px, -50%);
  opacity: 0;
  transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}
.ta-hover-arrow:hover {
  padding-right: 22px;
}
.ta-hover-arrow:hover::after {
  transform: translate(0, -50%);
  opacity: 1;
}`,
  trigger: "hover",
  durationMs: 2800,
},
{
  id: "ta-hover-split",
  name: "Hover split",
  category: "hover",
  customCss: `.ta-hover-split {
  display: inline-block;
  letter-spacing: normal;
  transition: letter-spacing 0.5s cubic-bezier(0.16, 1, 0.3, 1);
}
.ta-hover-split:hover {
  letter-spacing: 0.4em;
}`,
  trigger: "hover",
  durationMs: 2800,
},
{
  id: "ta-rubber-band",
  name: "Rubber band",
  category: "decorative",
  keyframes: "0%, 100% { transform: scale(1); } 30% { transform: scaleX(1.25) scaleY(0.75); } 40% { transform: scaleX(0.75) scaleY(1.25); } 50% { transform: scaleX(1.15) scaleY(0.85); } 65% { transform: scaleX(0.95) scaleY(1.05); } 75% { transform: scaleX(1.05) scaleY(0.95); }",
  animation: "1.6s linear infinite",
  baseStyles: "display: inline-block;",
  durationMs: 1600,
},
{
  id: "ta-mask-reveal",
  name: "Mask reveal",
  category: "specialty",
  keyframes: "0% { -webkit-mask-position: -100% 0; mask-position: -100% 0; } 100% { -webkit-mask-position: 200% 0; mask-position: 200% 0; }",
  animation: "3s linear infinite",
  baseStyles: "display: inline-block; -webkit-mask-image: linear-gradient(90deg, transparent, black 40%, black 60%, transparent); mask-image: linear-gradient(90deg, transparent, black 40%, black 60%, transparent); -webkit-mask-size: 200% 100%; mask-size: 200% 100%; -webkit-mask-repeat: no-repeat; mask-repeat: no-repeat;",
  durationMs: 3000,
},
{
  id: "ta-rainbow",
  name: "Rainbow",
  category: "specialty",
  keyframes: "0% { background-position: 0% 50%; } 100% { background-position: 200% 50%; }",
  animation: "4s linear infinite",
  baseStyles: "display: inline-block; background-image: linear-gradient(90deg, #FF0080, #FF8C00, #FFD700, #00C853, #00B0FF, #6200EA, #FF0080); background-size: 200% 100%; background-clip: text; -webkit-background-clip: text; color: transparent; -webkit-text-fill-color: transparent;",
  durationMs: 4000,
},
];

// — Helpers —
const DEFAULT_SAMPLE = 'Hello, Cargo.';

export function getKeyframesCss(a: TextAnimation): string {
  // JS-driven animations contribute nothing to the CSS section — their code
  // lives in the JS section of the bundle instead.
  if (a.engine === 'js') return '';
  // Animations using customCss don't have a separate keyframes block
  if (a.customCss) return '';
  if (!a.keyframes) return '';
  return `@keyframes ${a.id} {\n  ${a.keyframes.trim()}\n}`;
}

export function getClassCss(a: TextAnimation): string {
  // JS-driven animations contribute nothing to the CSS section (no class /
  // @keyframes); without this they'd emit `.id { animation: id undefined; }`.
  if (a.engine === 'js') return '';
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

/**
 * Stable identifier for an emitted JS driver, derived from its kind:
 * `binary-decode` -> `taDriverBinaryDecode`. Matches the authored names in
 * text-animation-drivers.js, but is computed rather than read off `fn.name`,
 * which a production build strips. See the note in getBundleSnippet.
 */
function driverIdent(kind: string): string {
  const pascal = kind
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join('');
  return `taDriver${pascal}`;
}

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

  // Classes block — skip empties so a JS-only pick produces no `/* Classes */`
  // header and no empty `.id {}` rule (JS animations return '' from getClassCss).
  const classParts = animations
    .map(getClassCss)
    .filter((s) => s.length > 0);
  if (classParts.length > 0) {
    lines.push('/* Classes */');
    lines.push(classParts.join('\n\n'));
    lines.push('');
  }

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

  // — JS section — only when the pick contains a JS-driven animation.
  // De-duplicate driver kinds, preserving the order they were picked in.
  const jsKinds: JsDriverSpec['kind'][] = [];
  for (const a of animations) {
    if (a.engine === 'js' && a.jsDriver && !jsKinds.includes(a.jsDriver.kind)) {
      jsKinds.push(a.jsDriver.kind);
    }
  }
  if (jsKinds.length > 0) {
    if (lines[lines.length - 1] !== '') lines.push('');
    const pickedList = jsKinds.join(', ');

    // Markup note — how the user must mark up elements for the JS drivers.
    lines.push('/* JS animations — markup:');
    lines.push(`     <span data-ta-anim="${jsKinds[0]}" data-ta-text="Your text"></span>`);
    lines.push(`   data-ta-anim = the animation kind (picked: ${pickedList})`);
    lines.push('   data-ta-text = the text to animate');
    lines.push('   Optional: data-ta-step (tick ms), data-ta-sweep (spotlight sweep ms) */');
    lines.push('');

    // <script> block. Driver function bodies are sliced VERBATIM from
    // text-animation-drivers.js via Function.toString() — single-source: the
    // emitted bytes equal the bytes the tool runs. Registry + harness are
    // generic; only which drivers/entries appear varies per pick.
    //
    // Each driver is bound to an identifier WE derive from the kind, rather
    // than emitted as a bare declaration relying on `fn.name`. A production
    // build minifies these functions to anonymous expressions, so a bare
    // `function(a,t,e){...}` statement is a SyntaxError and `fn.name` is empty
    // — which shipped a bundle that could not run. Assigning to a var we name
    // ourselves is correct whether the source arrives named, anonymous, or
    // mangled.
    const script: string[] = [];
    script.push('<script>');
    script.push(`/* Cargo Text Animations — JS drivers (picked: ${pickedList}) */`);
    script.push('(function(){');
    for (const k of jsKinds) {
      script.push(`var ${driverIdent(k)} = ${taDrivers[k].toString()};`);
    }
    script.push('var __taDrivers = {');
    for (const k of jsKinds) {
      script.push(`  "${k}": ${driverIdent(k)},`);
    }
    script.push('};');
    script.push("var nodes = document.querySelectorAll('[data-ta-anim]');");
    script.push('Array.prototype.forEach.call(nodes, function(el){');
    script.push("  var kind = el.getAttribute('data-ta-anim');");
    script.push('  var driver = __taDrivers[kind];');
    script.push("  if (typeof driver !== 'function') return;");
    script.push("  var text = el.getAttribute('data-ta-text') || el.textContent || '';");
    script.push('  var params = {};');
    script.push("  var step = el.getAttribute('data-ta-step'); if (step) params.stepMs = parseInt(step,10);");
    script.push("  var sweep = el.getAttribute('data-ta-sweep'); if (sweep) params.sweepMs = parseInt(sweep,10);");
    script.push('  driver(el, text, params);');
    script.push('});');
    script.push('})();');
    script.push('</script>');
    lines.push(script.join('\n'));
  }

  return lines.join('\n');
}

export function getSampleText(a: TextAnimation): string {
  return a.sampleText ?? DEFAULT_SAMPLE;
}

export function getCategoryLabel(c: AnimationCategory): string {
  return c;
}
