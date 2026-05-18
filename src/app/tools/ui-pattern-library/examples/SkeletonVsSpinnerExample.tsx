'use client';
import { useCallback, useEffect, useRef, useState } from 'react';

// A real scenario: the SAME content area (a profile + a short feed) loading
// the SAME 1.6s, shown as a skeleton vs a spinner, so you feel why a skeleton
// of a known layout reads as "almost there" while a spinner reads as a blank
// wait. Then a 200ms action: the skeleton flashes and is worse than nothing —
// the misuse. The loaders themselves live in the Loading States tool.

type Mode = 'skeleton' | 'spinner';

const LONG_MS = 1600;
const SHORT_MS = 200;

export function SkeletonVsSpinnerExample() {
  const [mode, setMode] = useState<Mode>('skeleton');
  const [loading, setLoading] = useState(false);
  const [flashed, setFlashed] = useState(false);
  const timer = useRef<number | null>(null);

  useEffect(
    () => () => {
      if (timer.current) window.clearTimeout(timer.current);
    },
    []
  );

  const run = useCallback((ms: number, isShort: boolean) => {
    if (timer.current) window.clearTimeout(timer.current);
    setFlashed(false);
    setLoading(true);
    timer.current = window.setTimeout(() => {
      setLoading(false);
      if (isShort && mode === 'skeleton') setFlashed(true);
    }, ms);
  }, [mode]);

  return (
    <div className="upl-ex" data-testid="ex-skeleton-vs-spinner">
      <style>{`
        .upl-ex-ss__bar {
          display: flex;
          align-items: center;
          gap: var(--space-2);
          flex-wrap: wrap;
          margin-bottom: var(--space-3);
        }
        .upl-ex-ss__seg {
          display: inline-flex;
          border: 1px solid var(--border-strong);
          border-radius: var(--radius-md);
          overflow: hidden;
        }
        .upl-ex-ss__seg button {
          font-family: var(--font-mono);
          font-size: 11px;
          padding: 6px 11px;
          border: none;
          background: var(--surface);
          color: var(--text-muted);
          cursor: pointer;
        }
        .upl-ex-ss__seg button[data-on="true"] { background: var(--accent-soft); color: var(--accent); }
        .upl-ex-ss__seg button + button { border-left: 1px solid var(--border-strong); }
        .upl-ex-ss__btn {
          font-family: var(--font-mono);
          font-size: 11px;
          padding: 6px 11px;
          border-radius: var(--radius-md);
          border: 1px solid var(--border-strong);
          background: var(--surface);
          color: var(--text);
          cursor: pointer;
        }
        .upl-ex-ss__btn:hover { border-color: var(--accent); }
        .upl-ex-ss__stage {
          border: 1px solid var(--border);
          border-radius: var(--radius-md);
          background: var(--surface-muted);
          padding: var(--space-5);
          min-height: 200px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .upl-ex-ss__card {
          width: 100%;
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: var(--radius-md);
          padding: var(--space-4);
          display: flex;
          flex-direction: column;
          gap: var(--space-4);
        }
        .upl-ex-ss__profile { display: flex; align-items: center; gap: var(--space-3); }
        .upl-ex-ss__avatar {
          width: 44px; height: 44px; border-radius: 50%;
          background: linear-gradient(135deg, var(--accent), var(--accent-hover));
          flex-shrink: 0;
        }
        .upl-ex-ss__who b { display: block; font-size: var(--text-sm); color: var(--text); }
        .upl-ex-ss__who span { font-family: var(--font-mono); font-size: 11px; color: var(--text-faint); }
        .upl-ex-ss__feed { display: flex; flex-direction: column; gap: 8px; }
        .upl-ex-ss__feed p {
          font-size: var(--text-sm); color: var(--text-muted); line-height: 1.5;
          padding-bottom: 8px; border-bottom: 1px solid var(--border);
        }
        .upl-ex-ss__feed p:last-child { border-bottom: none; padding-bottom: 0; }

        .upl-ex-ss__sk { display: flex; flex-direction: column; gap: var(--space-4); width: 100%; }
        .upl-ex-ss__sk-row { display: flex; align-items: center; gap: var(--space-3); }
        .upl-ex-ss__sk-block, .upl-ex-ss__sk-line {
          background: linear-gradient(90deg, var(--surface-muted) 0%, var(--border-strong) 50%, var(--surface-muted) 100%);
          background-size: 200% 100%;
          animation: upl-ex-ss-shimmer 1.4s ease-in-out infinite;
          border-radius: 4px;
        }
        .upl-ex-ss__sk-block { width: 44px; height: 44px; border-radius: 50%; flex-shrink: 0; }
        .upl-ex-ss__sk-lines { display: flex; flex-direction: column; gap: 7px; flex: 1; }
        .upl-ex-ss__sk-line { height: 9px; }
        .upl-ex-ss__sk-line.w60 { width: 60%; }
        .upl-ex-ss__sk-line.w40 { width: 40%; }
        .upl-ex-ss__sk-feed { display: flex; flex-direction: column; gap: 12px; }
        .upl-ex-ss__sk-line.full { width: 100%; }
        .upl-ex-ss__sk-line.w80 { width: 80%; }
        @keyframes upl-ex-ss-shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        .upl-ex-ss__spin {
          width: 30px; height: 30px;
          border: 3px solid var(--surface-muted);
          border-top-color: var(--accent);
          border-radius: 50%;
          animation: upl-ex-ss-rotate 0.8s linear infinite;
        }
        @keyframes upl-ex-ss-rotate { to { transform: rotate(360deg); } }
        .upl-ex-ss__note {
          margin-top: var(--space-3);
          font-size: var(--text-sm);
          line-height: 1.55;
          color: var(--text-muted);
          padding: var(--space-3);
          border-left: 2px solid var(--accent);
          background: var(--accent-soft);
          border-radius: var(--radius-sm);
        }
        .upl-ex-ss__link {
          font-family: var(--font-mono);
          font-size: 11px;
          color: var(--accent);
          text-decoration: underline;
        }
      `}</style>

      <div className="upl-ex-ss__bar">
        <div className="upl-ex-ss__seg" role="group" aria-label="Loading style">
          <button type="button" data-on={mode === 'skeleton'} onClick={() => setMode('skeleton')} data-testid="ex-ss-mode-skeleton">skeleton</button>
          <button type="button" data-on={mode === 'spinner'} onClick={() => setMode('spinner')} data-testid="ex-ss-mode-spinner">spinner</button>
        </div>
        <button type="button" className="upl-ex-ss__btn" onClick={() => run(LONG_MS, false)} data-testid="ex-ss-reload">
          reload (1.6s)
        </button>
        <button type="button" className="upl-ex-ss__btn" onClick={() => run(SHORT_MS, true)} data-testid="ex-ss-short">
          quick action (200ms)
        </button>
      </div>

      <div className="upl-ex-ss__stage">
        {loading ? (
          mode === 'skeleton' ? (
            <div className="upl-ex-ss__sk" data-testid="ex-ss-skeleton" aria-busy="true">
              <div className="upl-ex-ss__sk-row">
                <div className="upl-ex-ss__sk-block" />
                <div className="upl-ex-ss__sk-lines">
                  <div className="upl-ex-ss__sk-line w60" />
                  <div className="upl-ex-ss__sk-line w40" />
                </div>
              </div>
              <div className="upl-ex-ss__sk-feed">
                <div className="upl-ex-ss__sk-line full" />
                <div className="upl-ex-ss__sk-line w80" />
                <div className="upl-ex-ss__sk-line full" />
              </div>
            </div>
          ) : (
            <div className="upl-ex-ss__spin" data-testid="ex-ss-spinner" aria-busy="true" role="status" aria-label="Loading" />
          )
        ) : (
          <div className="upl-ex-ss__card" data-testid="ex-ss-content">
            <div className="upl-ex-ss__profile">
              <div className="upl-ex-ss__avatar" />
              <div className="upl-ex-ss__who">
                <b>Dana Okoro</b>
                <span>@danabuilds · Product designer</span>
              </div>
            </div>
            <div className="upl-ex-ss__feed">
              <p>Rebuilt the settings screen around one decision per view.</p>
              <p>The grid system finally feels right after three tries.</p>
              <p>Shipped on a Friday. It is fine. The tests are green.</p>
            </div>
          </div>
        )}
      </div>

      <p className="upl-ex-ss__note" data-testid="ex-ss-note">
        {flashed ? (
          <span data-testid="ex-ss-flash-note">
            <b>That flash</b> is the misuse: a skeleton for a 200ms wait blinks
            in and out and reads as a glitch. Below that threshold, show nothing
            or use a spinner.{' '}
          </span>
        ) : (
          'Reload with a known layout: the skeleton reads as "almost here", the spinner as a blank wait. Try the 200ms action in skeleton mode to feel the flash. '
        )}
        <a className="upl-ex-ss__link" href="/tools/loading-states" data-testid="ex-ss-link">
          see the Loading States tool for the loaders themselves →
        </a>
      </p>
    </div>
  );
}
