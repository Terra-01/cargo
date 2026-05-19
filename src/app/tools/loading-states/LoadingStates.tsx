'use client';
import { useState, useMemo } from 'react';
import { loadingStates, type LoadingCategory } from '@/lib/loading-states';
import { LoadingStateCard } from './LoadingStateCard';

// The seven LoadingCategory values, plus 'all' (the default — no filter).
// Order is fixed for the control; per-category counts are derived at runtime.
const CATEGORY_FILTERS: Array<LoadingCategory | 'all'> = [
  'all',
  'skeleton',
  'spinner',
  'dots',
  'bar',
  'progress',
  'overlay',
  'inline',
];

export function LoadingStates() {
  const [category, setCategory] = useState<LoadingCategory | 'all'>('all');

  const filtered = useMemo(() => {
    if (category === 'all') return loadingStates;
    return loadingStates.filter((s) => s.category === category);
  }, [category]);

  // Per-category counts for the filter labels — derived from the data, not
  // hard-coded, so the control reflects whatever the catalogue actually is.
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: loadingStates.length };
    for (const s of loadingStates) {
      counts[s.category] = (counts[s.category] ?? 0) + 1;
    }
    return counts;
  }, []);

  return (
    <>
      <style>{`
        /* — Category filter (mirrors the Text Animation Library control) — */
        .ls-toolbar {
          display: flex;
          flex-direction: column;
          align-items: stretch;
          gap: var(--space-3);
          margin-bottom: var(--space-5);
        }
        .ls-categories {
          display: flex;
          flex-wrap: wrap;
          gap: var(--space-2);
        }
        .ls-cat {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          min-height: 44px;
          padding: 5px 14px;
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: var(--radius-pill);
          font-family: var(--font-mono);
          font-size: var(--text-xs);
          letter-spacing: 0.02em;
          color: var(--text-muted);
          cursor: pointer;
          transition: border-color var(--t-fast) var(--ease), color var(--t-fast) var(--ease), background var(--t-fast) var(--ease);
        }
        .ls-cat:hover {
          border-color: var(--border-strong);
          color: var(--text);
        }
        .ls-cat:focus-visible {
          outline: none;
          border-color: var(--accent);
          box-shadow: 0 0 0 3px var(--accent-soft);
        }
        .ls-cat[data-active="true"] {
          border-color: var(--accent);
          background: var(--accent-soft);
          color: var(--accent);
        }
        .ls-cat__count {
          font-size: 10px;
          opacity: 0.7;
          letter-spacing: 0;
        }

        /* Loading-States grid — 3 columns so all 21 loaders sit in a full
           3 x 7 desktop grid. Scoped here so the shared .catalog (4-col,
           used by other tools) is unaffected. The compound selector beats
           the global .catalog rules regardless of stylesheet order. */
        .catalog.ls-catalog {
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: var(--space-5);
        }
        .catalog.ls-catalog .loader-card__preview {
          height: 160px;
        }
        @media (max-width: 1023px) { /* migrated from max-width: 1100px (tablet-and-below) */
          .catalog.ls-catalog { grid-template-columns: repeat(2, minmax(0, 1fr)); }
        }
        @media (max-width: 599px) { /* migrated from max-width: 620px (mobile) */
          .catalog.ls-catalog { grid-template-columns: 1fr; }
        }

        /* Scoped loader styles — only used inside loader previews */
        .ls-skeleton { display: flex; flex-direction: column; gap: 8px; }
        .ls-skeleton__line {
          height: 10px;
          border-radius: 4px;
          background: linear-gradient(90deg, var(--surface-muted) 0%, var(--border-strong) 50%, var(--surface-muted) 100%);
          background-size: 200% 100%;
          animation: ls-shimmer 1.5s ease-in-out infinite;
        }
        .ls-skeleton__line:nth-child(1) { width: 100%; }
        .ls-skeleton__line:nth-child(2) { width: 80%; }
        .ls-skeleton__line:nth-child(3) { width: 60%; }

        .ls-card-skeleton {
          display: flex;
          flex-direction: column;
          gap: 6px;
          padding: 10px;
          border: 1px solid var(--border);
          border-radius: 6px;
          background: var(--surface);
        }
        .ls-card-skeleton > * {
          background: linear-gradient(90deg, var(--surface-muted) 0%, var(--border-strong) 50%, var(--surface-muted) 100%);
          background-size: 200% 100%;
          animation: ls-shimmer 1.5s ease-in-out infinite;
          border-radius: 3px;
        }
        .ls-card-skeleton__title  { height: 10px; width: 55%; }
        .ls-card-skeleton__line   { height: 7px; width: 100%; }
        .ls-card-skeleton__button { height: 18px; width: 60px; border-radius: 4px; margin-top: 4px; }

        @keyframes ls-shimmer {
          0%   { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }

        .ls-skeleton-pulse { display: flex; flex-direction: column; gap: 8px; }
        .ls-skeleton-pulse__line {
          height: 10px;
          border-radius: 4px;
          background: var(--border-strong);
          animation: ls-skeleton-pulse 1.4s ease-in-out infinite;
        }
        .ls-skeleton-pulse__line:nth-child(1) { width: 100%; }
        .ls-skeleton-pulse__line:nth-child(2) { width: 80%; }
        .ls-skeleton-pulse__line:nth-child(3) { width: 60%; }
        @keyframes ls-skeleton-pulse {
          0%, 100% { opacity: 1; }
          50%      { opacity: 0.35; }
        }

        .ls-spinner {
          width: 28px;
          height: 28px;
          border: 3px solid var(--surface-muted);
          border-top-color: var(--accent);
          border-radius: 50%;
          animation: ls-rotate 0.8s linear infinite;
        }
        .ls-spinner-conic {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: conic-gradient(from 0deg, transparent 0%, var(--accent) 100%);
          -webkit-mask: radial-gradient(circle, transparent 56%, black 58%);
                  mask: radial-gradient(circle, transparent 56%, black 58%);
          animation: ls-rotate 1s linear infinite;
        }
        @keyframes ls-rotate {
          to { transform: rotate(360deg); }
        }

        .ls-dual-ring {
          position: relative;
          width: 32px;
          height: 32px;
        }
        .ls-dual-ring__outer,
        .ls-dual-ring__inner {
          position: absolute;
          border-radius: 50%;
          border: 3px solid transparent;
        }
        .ls-dual-ring__outer {
          inset: 0;
          border-top-color: var(--accent);
          border-bottom-color: var(--accent);
          animation: ls-rotate 1.2s linear infinite;
        }
        .ls-dual-ring__inner {
          inset: 6px;
          border-left-color: var(--accent);
          border-right-color: var(--accent);
          animation: ls-rotate 0.9s linear infinite reverse;
        }

        .ls-pulse-dots { display: flex; gap: 8px; }
        .ls-pulse-dots > span {
          width: 9px;
          height: 9px;
          border-radius: 50%;
          background: var(--accent);
          animation: ls-pulse 1.4s ease-in-out infinite;
        }
        .ls-pulse-dots > span:nth-child(2) { animation-delay: 0.2s; }
        .ls-pulse-dots > span:nth-child(3) { animation-delay: 0.4s; }
        @keyframes ls-pulse {
          0%, 80%, 100% { transform: scale(0.6); opacity: 0.5; }
          40%           { transform: scale(1);   opacity: 1; }
        }

        .ls-bouncing-dots {
          display: flex;
          gap: 6px;
          align-items: flex-end;
          height: 18px;
        }
        .ls-bouncing-dots > span {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: var(--accent);
          animation: ls-bounce 1s ease-in-out infinite;
        }
        .ls-bouncing-dots > span:nth-child(2) { animation-delay: 0.15s; }
        .ls-bouncing-dots > span:nth-child(3) { animation-delay: 0.3s; }
        @keyframes ls-bounce {
          0%, 100% { transform: translateY(0); }
          50%      { transform: translateY(-8px); }
        }

        .ls-fading-dots { display: flex; gap: 8px; }
        .ls-fading-dots > span {
          width: 9px;
          height: 9px;
          border-radius: 50%;
          background: var(--accent);
          animation: ls-fading-dot 1.2s ease-in-out infinite;
        }
        .ls-fading-dots > span:nth-child(2) { animation-delay: 0.2s; }
        .ls-fading-dots > span:nth-child(3) { animation-delay: 0.4s; }
        @keyframes ls-fading-dot {
          0%, 100% { opacity: 0.2; }
          50%      { opacity: 1; }
        }

        .ls-progress {
          height: 4px;
          background: var(--surface-muted);
          border-radius: 2px;
          overflow: hidden;
          position: relative;
        }
        .ls-progress__fill {
          position: absolute;
          top: 0;
          height: 100%;
          width: 30%;
          background: var(--accent);
          border-radius: 2px;
          animation: ls-progress 1.8s ease-in-out infinite;
        }
        @keyframes ls-progress {
          0%   { left: -30%; }
          100% { left: 100%; }
        }

        .ls-wave {
          display: flex;
          gap: 4px;
          align-items: center;
          height: 28px;
        }
        .ls-wave > span {
          width: 3px;
          height: 100%;
          background: var(--accent);
          border-radius: 2px;
          animation: ls-wave 1.2s ease-in-out infinite;
          transform-origin: center;
        }
        .ls-wave > span:nth-child(2) { animation-delay: 0.1s; }
        .ls-wave > span:nth-child(3) { animation-delay: 0.2s; }
        .ls-wave > span:nth-child(4) { animation-delay: 0.3s; }
        .ls-wave > span:nth-child(5) { animation-delay: 0.4s; }
        @keyframes ls-wave {
          0%, 100% { transform: scaleY(0.3); }
          50%      { transform: scaleY(1); }
        }

        .ls-stripes {
          height: 10px;
          border-radius: 5px;
          background-image: repeating-linear-gradient(
            -45deg,
            var(--accent) 0 10px,
            var(--accent-soft) 10px 20px
          );
          background-size: 28px 28px;
          animation: ls-stripes 0.7s linear infinite;
        }
        @keyframes ls-stripes {
          to { background-position: -28px 0; }
        }

        .ls-progress-pct {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .ls-progress-pct__track {
          flex: 1;
          height: 8px;
          background: var(--border-strong);
          border-radius: 4px;
          overflow: hidden;
        }
        .ls-progress-pct__fill {
          width: 65%;
          height: 100%;
          border-radius: 4px;
          background-color: var(--accent);
          background-image: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
          background-size: 50px 100%;
          background-repeat: no-repeat;
          animation: ls-progress-pct 1.5s ease-in-out infinite;
        }
        .ls-progress-pct__label {
          font-family: var(--font-mono);
          font-size: 12px;
          color: var(--text-muted);
          min-width: 32px;
          text-align: right;
        }
        @keyframes ls-progress-pct {
          0%   { background-position: -50px 0; }
          100% { background-position: calc(100% + 50px) 0; }
        }

        .ls-progress-ring {
          position: relative;
          width: 60px;
          height: 60px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .ls-progress-ring__circle {
          position: absolute;
          inset: 0;
          border-radius: 50%;
          background: conic-gradient(var(--accent) 0% 65%, var(--border-strong) 65% 100%);
          -webkit-mask: radial-gradient(circle, transparent 58%, #000 60%);
                  mask: radial-gradient(circle, transparent 58%, #000 60%);
        }
        .ls-progress-ring__label {
          position: relative;
          font-family: var(--font-mono);
          font-size: 13px;
          font-weight: 600;
          color: var(--text);
        }

        .ls-seg-progress { display: flex; gap: 6px; }
        .ls-seg-progress__seg {
          flex: 1;
          height: 8px;
          border-radius: 4px;
          background: var(--border-strong);
        }
        .ls-seg-progress__seg.is-filled { background: var(--accent); }
        .ls-seg-progress__seg.is-current {
          animation: ls-seg-pulse 1.4s ease-in-out infinite;
        }
        @keyframes ls-seg-pulse {
          0%, 100% { opacity: 1; }
          50%      { opacity: 0.5; }
        }

        .ls-overlay-host {
          position: relative;
          width: 100%;
          height: 100%;
          align-self: stretch;
          border-radius: var(--radius-md);
          overflow: hidden;
          background: var(--surface);
        }
        .ls-overlay-bg {
          position: absolute;
          inset: 0;
          display: flex;
          flex-direction: column;
          gap: 9px;
          padding: 14px;
        }
        .ls-overlay-bg__title {
          height: 11px;
          width: 50%;
          border-radius: 4px;
          background: var(--border-strong);
          opacity: 0.55;
        }
        .ls-overlay-bg__line {
          height: 8px;
          width: 100%;
          border-radius: 4px;
          background: var(--border-strong);
          opacity: 0.32;
        }
        .ls-overlay-bg__line--short { width: 62%; }
        .ls-overlay-scrim {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
        }
        .ls-overlay-scrim--plain {
          background: color-mix(in srgb, var(--surface) 62%, transparent);
        }
        .ls-overlay-scrim--msg {
          flex-direction: column;
          background: color-mix(in srgb, var(--surface) 70%, transparent);
        }
        .ls-overlay-scrim--blur {
          background: color-mix(in srgb, var(--surface) 38%, transparent);
          -webkit-backdrop-filter: blur(4px);
                  backdrop-filter: blur(4px);
        }
        .ls-overlay-scrim__spinner {
          width: 28px;
          height: 28px;
          border: 3px solid var(--accent-soft);
          border-top-color: var(--accent);
          border-radius: 50%;
          animation: ls-rotate 0.8s linear infinite;
        }
        .ls-overlay-scrim__text {
          font-family: var(--font-mono);
          font-size: 11px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--text-muted);
        }

        .ls-btn-loading {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 9px 16px;
          font-family: var(--font-mono);
          font-size: 13px;
          font-weight: 500;
          color: #fff;
          background: var(--accent);
          border-radius: var(--radius-md);
        }
        .ls-btn-loading__spinner {
          width: 13px;
          height: 13px;
          border: 2px solid rgba(255, 255, 255, 0.4);
          border-top-color: #fff;
          border-radius: 50%;
          animation: ls-rotate 0.7s linear infinite;
        }

        .ls-inline-loading {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          font-family: var(--font-sans);
          font-size: 14px;
          color: var(--text-muted);
        }
        .ls-inline-loading__spinner {
          width: 12px;
          height: 12px;
          border: 2px solid var(--accent-soft);
          border-top-color: var(--accent);
          border-radius: 50%;
          animation: ls-rotate 0.7s linear infinite;
        }

        .ls-inline-sentence {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-family: var(--font-sans);
          font-size: 14px;
          color: var(--text-muted);
        }
        .ls-inline-dots {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          vertical-align: middle;
        }
        .ls-inline-dots > span {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: var(--accent);
          animation: ls-inline-dots 1.2s ease-in-out infinite;
        }
        .ls-inline-dots > span:nth-child(2) { animation-delay: 0.2s; }
        .ls-inline-dots > span:nth-child(3) { animation-delay: 0.4s; }
        @keyframes ls-inline-dots {
          0%, 100% { opacity: 0.25; }
          50%      { opacity: 1; }
        }
      `}</style>
      <div className="ls-toolbar">
        <div className="ls-categories" role="group" aria-label="Filter by category" data-testid="ls-categories">
          {CATEGORY_FILTERS.map((cat) => (
            <button
              key={cat}
              type="button"
              className="ls-cat"
              data-active={category === cat || undefined}
              data-testid={`ls-cat-${cat}`}
              aria-pressed={category === cat}
              onClick={() => setCategory(cat)}
            >
              {cat}
              <span className="ls-cat__count">{categoryCounts[cat] ?? 0}</span>
            </button>
          ))}
        </div>
      </div>
      <div className="catalog ls-catalog" data-testid="loader-catalog">
        {filtered.map((state) => (
          <LoadingStateCard key={state.id} state={state} />
        ))}
      </div>
    </>
  );
}
