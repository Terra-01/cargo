'use client';
import { loadingStates } from '@/lib/loading-states';
import { LoadingStateCard } from './LoadingStateCard';

export function LoadingStates() {
  return (
    <>
      <style>{`
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
      `}</style>
      <div className="catalog" data-testid="loader-catalog">
        {loadingStates.map((state) => (
          <LoadingStateCard key={state.id} state={state} />
        ))}
      </div>
    </>
  );
}
