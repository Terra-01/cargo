export type LoadingCategory = 'skeleton' | 'spinner' | 'dots' | 'bar';

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
];

export function combinedSnippet(state: LoadingState): string {
  return `${state.html}
<style>
${state.css}
</style>`;
}
