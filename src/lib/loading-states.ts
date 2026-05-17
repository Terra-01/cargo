export type LoadingCategory =
  | 'skeleton'
  | 'spinner'
  | 'dots'
  | 'bar'
  | 'progress'
  | 'overlay'
  | 'inline';

export interface LoadingState {
  id: string;
  name: string;
  category: LoadingCategory;
  html: string;
  css: string;
}

export const loadingStates: LoadingState[] = [
  {
    id: 'skeleton-text',
    name: 'Skeleton text',
    category: 'skeleton',
    html: `<div class="skeleton">
  <div class="skeleton__line"></div>
  <div class="skeleton__line"></div>
  <div class="skeleton__line"></div>
</div>`,
    css: `.skeleton { display: flex; flex-direction: column; gap: 8px; }
.skeleton__line {
  height: 12px;
  border-radius: 4px;
  background: linear-gradient(90deg, #e5e5e5 0%, #f5f5f5 50%, #e5e5e5 100%);
  background-size: 200% 100%;
  animation: skeleton-shimmer 1.5s ease-in-out infinite;
}
.skeleton__line:nth-child(1) { width: 100%; }
.skeleton__line:nth-child(2) { width: 80%; }
.skeleton__line:nth-child(3) { width: 60%; }
@keyframes skeleton-shimmer {
  0%   { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}`,
  },
  {
    id: 'skeleton-card',
    name: 'Skeleton card',
    category: 'skeleton',
    html: `<div class="card-skeleton">
  <div class="card-skeleton__title"></div>
  <div class="card-skeleton__line"></div>
  <div class="card-skeleton__line"></div>
  <div class="card-skeleton__button"></div>
</div>`,
    css: `.card-skeleton {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 16px;
  border: 1px solid #eaeaea;
  border-radius: 8px;
}
.card-skeleton > * {
  background: linear-gradient(90deg, #e5e5e5 0%, #f5f5f5 50%, #e5e5e5 100%);
  background-size: 200% 100%;
  animation: skeleton-shimmer 1.5s ease-in-out infinite;
  border-radius: 4px;
}
.card-skeleton__title  { height: 16px; width: 60%; }
.card-skeleton__line   { height: 10px; width: 100%; }
.card-skeleton__button { height: 32px; width: 96px; border-radius: 6px; margin-top: 6px; }
@keyframes skeleton-shimmer {
  0%   { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}`,
  },
  {
    id: 'spinner-classic',
    name: 'Spinner (classic)',
    category: 'spinner',
    html: `<div class="spinner" role="status" aria-label="Loading"></div>`,
    css: `.spinner {
  width: 32px;
  height: 32px;
  border: 3px solid #e5e5e5;
  border-top-color: #C2410C;
  border-radius: 50%;
  animation: spinner-rotate 0.8s linear infinite;
}
@keyframes spinner-rotate {
  to { transform: rotate(360deg); }
}`,
  },
  {
    id: 'spinner-conic',
    name: 'Spinner (conic)',
    category: 'spinner',
    html: `<div class="spinner-conic" role="status" aria-label="Loading"></div>`,
    css: `.spinner-conic {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: conic-gradient(from 0deg, transparent 0%, #C2410C 100%);
  -webkit-mask: radial-gradient(circle, transparent 56%, black 58%);
          mask: radial-gradient(circle, transparent 56%, black 58%);
  animation: spinner-rotate 1s linear infinite;
}
@keyframes spinner-rotate {
  to { transform: rotate(360deg); }
}`,
  },
  {
    id: 'pulse-dots',
    name: 'Pulse dots',
    category: 'dots',
    html: `<div class="pulse-dots" role="status" aria-label="Loading">
  <span></span><span></span><span></span>
</div>`,
    css: `.pulse-dots {
  display: flex;
  gap: 8px;
}
.pulse-dots > span {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #C2410C;
  animation: pulse-dot 1.4s ease-in-out infinite;
}
.pulse-dots > span:nth-child(2) { animation-delay: 0.2s; }
.pulse-dots > span:nth-child(3) { animation-delay: 0.4s; }
@keyframes pulse-dot {
  0%, 80%, 100% { transform: scale(0.6); opacity: 0.5; }
  40%           { transform: scale(1);   opacity: 1; }
}`,
  },
  {
    id: 'bouncing-dots',
    name: 'Bouncing dots',
    category: 'dots',
    html: `<div class="bouncing-dots" role="status" aria-label="Loading">
  <span></span><span></span><span></span>
</div>`,
    css: `.bouncing-dots {
  display: flex;
  gap: 6px;
  align-items: flex-end;
  height: 20px;
}
.bouncing-dots > span {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #C2410C;
  animation: bounce-dot 1s ease-in-out infinite;
}
.bouncing-dots > span:nth-child(2) { animation-delay: 0.15s; }
.bouncing-dots > span:nth-child(3) { animation-delay: 0.3s; }
@keyframes bounce-dot {
  0%, 100% { transform: translateY(0); }
  50%      { transform: translateY(-10px); }
}`,
  },
  {
    id: 'progress-bar',
    name: 'Progress bar',
    category: 'bar',
    html: `<div class="progress" role="progressbar" aria-label="Loading">
  <div class="progress__fill"></div>
</div>`,
    css: `.progress {
  width: 100%;
  height: 4px;
  background: #e5e5e5;
  border-radius: 2px;
  overflow: hidden;
  position: relative;
}
.progress__fill {
  position: absolute;
  inset: 0;
  width: 30%;
  background: #C2410C;
  border-radius: 2px;
  animation: progress-slide 1.8s ease-in-out infinite;
}
@keyframes progress-slide {
  0%   { left: -30%; }
  100% { left: 100%; }
}`,
  },
  {
    id: 'wave-bars',
    name: 'Wave bars',
    category: 'bar',
    html: `<div class="wave" role="status" aria-label="Loading">
  <span></span><span></span><span></span><span></span><span></span>
</div>`,
    css: `.wave {
  display: flex;
  gap: 4px;
  align-items: center;
  height: 32px;
}
.wave > span {
  width: 4px;
  height: 100%;
  background: #C2410C;
  border-radius: 2px;
  animation: wave-bar 1.2s ease-in-out infinite;
  transform-origin: center;
}
.wave > span:nth-child(2) { animation-delay: 0.1s; }
.wave > span:nth-child(3) { animation-delay: 0.2s; }
.wave > span:nth-child(4) { animation-delay: 0.3s; }
.wave > span:nth-child(5) { animation-delay: 0.4s; }
@keyframes wave-bar {
  0%, 100% { transform: scaleY(0.3); }
  50%      { transform: scaleY(1); }
}`,
  },
  {
    id: 'skeleton-pulse',
    name: 'Skeleton pulse',
    category: 'skeleton',
    html: `<div class="skeleton-pulse">
  <div class="skeleton-pulse__line"></div>
  <div class="skeleton-pulse__line"></div>
  <div class="skeleton-pulse__line"></div>
</div>`,
    css: `.skeleton-pulse { display: flex; flex-direction: column; gap: 8px; }
.skeleton-pulse__line {
  height: 12px;
  border-radius: 4px;
  background: #e5e5e5;
  animation: skeleton-pulse 1.4s ease-in-out infinite;
}
.skeleton-pulse__line:nth-child(1) { width: 100%; }
.skeleton-pulse__line:nth-child(2) { width: 80%; }
.skeleton-pulse__line:nth-child(3) { width: 60%; }
@keyframes skeleton-pulse {
  0%, 100% { opacity: 1; }
  50%      { opacity: 0.4; }
}`,
  },
  {
    id: 'spinner-dual-ring',
    name: 'Spinner (dual ring)',
    category: 'spinner',
    html: `<div class="dual-ring" role="status" aria-label="Loading">
  <div class="dual-ring__outer"></div>
  <div class="dual-ring__inner"></div>
</div>`,
    css: `.dual-ring {
  position: relative;
  width: 36px;
  height: 36px;
}
.dual-ring__outer,
.dual-ring__inner {
  position: absolute;
  border-radius: 50%;
  border: 3px solid transparent;
}
.dual-ring__outer {
  inset: 0;
  border-top-color: #C2410C;
  border-bottom-color: #C2410C;
  animation: dual-ring-spin 1.2s linear infinite;
}
.dual-ring__inner {
  inset: 7px;
  border-left-color: #C2410C;
  border-right-color: #C2410C;
  animation: dual-ring-spin 0.9s linear infinite reverse;
}
@keyframes dual-ring-spin {
  to { transform: rotate(360deg); }
}`,
  },
  {
    id: 'fading-dots',
    name: 'Fading dots',
    category: 'dots',
    html: `<div class="fading-dots" role="status" aria-label="Loading">
  <span></span><span></span><span></span>
</div>`,
    css: `.fading-dots { display: flex; gap: 8px; }
.fading-dots > span {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #C2410C;
  animation: fading-dot 1.2s ease-in-out infinite;
}
.fading-dots > span:nth-child(2) { animation-delay: 0.2s; }
.fading-dots > span:nth-child(3) { animation-delay: 0.4s; }
@keyframes fading-dot {
  0%, 100% { opacity: 0.2; }
  50%      { opacity: 1; }
}`,
  },
  {
    id: 'indeterminate-stripes',
    name: 'Indeterminate stripes',
    category: 'bar',
    html: `<div class="stripes" role="status" aria-label="Loading"></div>`,
    css: `.stripes {
  width: 100%;
  height: 10px;
  border-radius: 5px;
  background-image: repeating-linear-gradient(
    -45deg,
    #C2410C 0 10px,
    #FDEDD8 10px 20px
  );
  background-size: 28px 28px;
  animation: stripes-move 0.7s linear infinite;
}
@keyframes stripes-move {
  to { background-position: -28px 0; }
}`,
  },
  {
    id: 'progress-percent',
    name: 'Progress (percent)',
    category: 'progress',
    html: `<div class="progress-pct">
  <div
    class="progress-pct__track"
    role="progressbar"
    aria-valuenow="65"
    aria-valuemin="0"
    aria-valuemax="100"
  >
    <div class="progress-pct__fill"></div>
  </div>
  <span class="progress-pct__label">65%</span>
</div>`,
    css: `.progress-pct {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
}
.progress-pct__track {
  flex: 1;
  height: 8px;
  background: #e5e5e5;
  border-radius: 4px;
  overflow: hidden;
}
.progress-pct__fill {
  width: 65%;
  height: 100%;
  border-radius: 4px;
  background-color: #C2410C;
  background-image: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.35),
    transparent
  );
  background-size: 50px 100%;
  background-repeat: no-repeat;
  animation: progress-pct-shimmer 1.5s ease-in-out infinite;
}
.progress-pct__label {
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: 12px;
  color: #57534E;
  min-width: 34px;
  text-align: right;
}
@keyframes progress-pct-shimmer {
  0%   { background-position: -50px 0; }
  100% { background-position: calc(100% + 50px) 0; }
}`,
  },
  {
    id: 'progress-ring',
    name: 'Progress (ring)',
    category: 'progress',
    html: `<div
  class="progress-ring"
  role="progressbar"
  aria-valuenow="65"
  aria-valuemin="0"
  aria-valuemax="100"
>
  <div class="progress-ring__circle"></div>
  <span class="progress-ring__label">65%</span>
</div>`,
    css: `.progress-ring {
  position: relative;
  width: 64px;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.progress-ring__circle {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  background: conic-gradient(#C2410C 0% 65%, #e5e5e5 65% 100%);
  -webkit-mask: radial-gradient(circle, transparent 58%, #000 60%);
          mask: radial-gradient(circle, transparent 58%, #000 60%);
}
.progress-ring__label {
  position: relative;
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: 13px;
  font-weight: 600;
  color: #18181B;
}`,
  },
  {
    id: 'progress-segments',
    name: 'Progress (segments)',
    category: 'progress',
    html: `<div
  class="seg-progress"
  role="progressbar"
  aria-valuenow="3"
  aria-valuemin="0"
  aria-valuemax="5"
  aria-label="Step 3 of 5"
>
  <span class="seg-progress__seg is-filled"></span>
  <span class="seg-progress__seg is-filled"></span>
  <span class="seg-progress__seg is-filled is-current"></span>
  <span class="seg-progress__seg"></span>
  <span class="seg-progress__seg"></span>
</div>`,
    css: `.seg-progress {
  display: flex;
  gap: 6px;
  width: 100%;
}
.seg-progress__seg {
  flex: 1;
  height: 8px;
  border-radius: 4px;
  background: #e5e5e5;
}
.seg-progress__seg.is-filled {
  background: #C2410C;
}
.seg-progress__seg.is-current {
  animation: seg-pulse 1.4s ease-in-out infinite;
}
@keyframes seg-pulse {
  0%, 100% { opacity: 1; }
  50%      { opacity: 0.5; }
}`,
  },
  {
    id: 'overlay-spinner',
    name: 'Overlay spinner',
    category: 'overlay',
    html: `<!-- Place inside a position: relative container -->
<div class="loading-overlay" role="status" aria-label="Loading">
  <div class="loading-overlay__spinner"></div>
</div>`,
    css: `.loading-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.65);
  z-index: 10;
}
.loading-overlay__spinner {
  width: 34px;
  height: 34px;
  border: 3px solid rgba(194, 65, 12, 0.2);
  border-top-color: #C2410C;
  border-radius: 50%;
  animation: loading-overlay-spin 0.8s linear infinite;
}
@keyframes loading-overlay-spin {
  to { transform: rotate(360deg); }
}`,
  },
  {
    id: 'overlay-message',
    name: 'Overlay message',
    category: 'overlay',
    html: `<!-- Place inside a position: relative container -->
<div class="loading-overlay-msg" role="status" aria-label="Loading">
  <div class="loading-overlay-msg__spinner"></div>
  <p class="loading-overlay-msg__text">Loading</p>
</div>`,
    css: `.loading-overlay-msg {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 14px;
  background: rgba(255, 255, 255, 0.7);
  z-index: 10;
}
.loading-overlay-msg__spinner {
  width: 32px;
  height: 32px;
  border: 3px solid rgba(194, 65, 12, 0.2);
  border-top-color: #C2410C;
  border-radius: 50%;
  animation: loading-overlay-msg-spin 0.8s linear infinite;
}
.loading-overlay-msg__text {
  margin: 0;
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: 13px;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: #57534E;
}
@keyframes loading-overlay-msg-spin {
  to { transform: rotate(360deg); }
}`,
  },
  {
    id: 'overlay-blur',
    name: 'Overlay blur',
    category: 'overlay',
    html: `<!-- Place inside a position: relative container -->
<div class="loading-overlay-blur" role="status" aria-label="Loading">
  <div class="loading-overlay-blur__spinner"></div>
</div>`,
    css: `.loading-overlay-blur {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.4);
  -webkit-backdrop-filter: blur(4px);
          backdrop-filter: blur(4px);
  z-index: 10;
}
.loading-overlay-blur__spinner {
  width: 34px;
  height: 34px;
  border: 3px solid rgba(194, 65, 12, 0.2);
  border-top-color: #C2410C;
  border-radius: 50%;
  animation: loading-overlay-blur-spin 0.8s linear infinite;
}
@keyframes loading-overlay-blur-spin {
  to { transform: rotate(360deg); }
}`,
  },
  {
    id: 'inline-button',
    name: 'Inline button',
    category: 'inline',
    html: `<button class="btn-loading" type="button" disabled>
  <span class="btn-loading__spinner" aria-hidden="true"></span>
  Submitting
</button>`,
    css: `.btn-loading {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 18px;
  font-family: inherit;
  font-size: 14px;
  font-weight: 500;
  color: #ffffff;
  background: #C2410C;
  border: none;
  border-radius: 6px;
  cursor: progress;
}
.btn-loading__spinner {
  width: 14px;
  height: 14px;
  border: 2px solid rgba(255, 255, 255, 0.4);
  border-top-color: #ffffff;
  border-radius: 50%;
  animation: btn-loading-spin 0.7s linear infinite;
}
@keyframes btn-loading-spin {
  to { transform: rotate(360deg); }
}`,
  },
  {
    id: 'inline-text',
    name: 'Inline text',
    category: 'inline',
    html: `<span class="inline-loading">
  <span class="inline-loading__spinner" aria-hidden="true"></span>
  Saving changes
</span>`,
    css: `.inline-loading {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  font-family: inherit;
  font-size: 14px;
  color: #57534E;
}
.inline-loading__spinner {
  width: 12px;
  height: 12px;
  border: 2px solid rgba(194, 65, 12, 0.25);
  border-top-color: #C2410C;
  border-radius: 50%;
  animation: inline-loading-spin 0.7s linear infinite;
}
@keyframes inline-loading-spin {
  to { transform: rotate(360deg); }
}`,
  },
  {
    id: 'inline-dots',
    name: 'Inline dots',
    category: 'inline',
    html: `<span class="inline-dots" role="status" aria-label="Loading">
  <span></span><span></span><span></span>
</span>`,
    css: `.inline-dots {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  vertical-align: middle;
}
.inline-dots > span {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: #C2410C;
  animation: inline-dots-blink 1.2s ease-in-out infinite;
}
.inline-dots > span:nth-child(2) { animation-delay: 0.2s; }
.inline-dots > span:nth-child(3) { animation-delay: 0.4s; }
@keyframes inline-dots-blink {
  0%, 100% { opacity: 0.25; }
  50%      { opacity: 1; }
}`,
  },
];

export function combinedSnippet(state: LoadingState): string {
  return `${state.html}
<style>
${state.css}
</style>`;
}
