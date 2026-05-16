'use client';
import { useEffect, useRef, useState } from 'react';

// This demo does NOT touch real font loading. A real load happens once, on
// first paint, too fast and unrepeatable to teach with. Instead it is a
// replayable timed simulation: a fixed "loading" window during which the
// swap panel shows readable fallback text and the block panel shows a blank
// reserved gap, then both settle to the same real font. The reload button
// replays the wait as many times as the user likes. The only difference the
// user ever sees is what happened during the wait.
const LOAD_MS = 2000;

// Two visibly different already-available fonts. No network fetch: the
// "swap" panel just switches this family string when the simulated load
// ends. The serif fallback is unmistakably not the geometric sans.
const REAL_FONT = 'var(--font-sans)';
const FALLBACK_FONT = "Georgia, 'Times New Roman', serif";

const LINE = 'This line is waiting for its font to arrive.';

export function WebFontsDemo() {
  const [loading, setLoading] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clear = () => {
    if (timer.current) {
      clearTimeout(timer.current);
      timer.current = null;
    }
  };

  useEffect(() => clear, []);

  const replay = () => {
    clear();
    setLoading(true);
    timer.current = setTimeout(() => {
      setLoading(false);
      timer.current = null;
    }, LOAD_MS);
  };

  const swapState = loading ? 'fallback' : 'real';
  const blockState = loading ? 'blank' : 'real';

  return (
    <div
      className="tfg-wf"
      data-testid="wf-demo"
      data-loading={loading ? 'true' : 'false'}
    >
      <style>{`
        .tfg-wf {
          margin-top: var(--space-8);
          border: 1px solid var(--border);
          border-radius: var(--radius-lg);
          background: var(--surface);
          overflow: hidden;
        }
        .tfg-wf__stage {
          display: grid;
          grid-template-columns: 1fr 1fr;
        }
        @media (max-width: 620px) {
          .tfg-wf__stage { grid-template-columns: 1fr; }
          .tfg-wf__panel + .tfg-wf__panel {
            border-left: none;
            border-top: 1px solid var(--border);
          }
        }
        .tfg-wf__panel {
          padding: var(--space-6);
          display: flex;
          flex-direction: column;
          gap: var(--space-4);
        }
        .tfg-wf__panel + .tfg-wf__panel { border-left: 1px solid var(--border); }
        .tfg-wf__prop {
          font-family: var(--font-mono);
          font-size: var(--text-sm);
          color: var(--text);
          margin: 0;
        }
        .tfg-wf__sub {
          font-family: var(--font-mono);
          font-size: var(--text-xs);
          letter-spacing: 0.04em;
          color: var(--text-faint);
          margin: 0;
        }
        .tfg-wf__line-wrap {
          min-height: 96px;
          display: flex;
          align-items: center;
          border: 1px dashed var(--border-strong);
          border-radius: var(--radius-md);
          padding: var(--space-4);
          background: var(--bg);
        }
        .tfg-wf__line {
          font-size: 20px;
          line-height: 1.4;
          color: var(--text);
          margin: 0;
        }
        .tfg-wf__line--hidden { visibility: hidden; }
        .tfg-wf__status {
          font-family: var(--font-mono);
          font-size: var(--text-xs);
          letter-spacing: 0.04em;
          margin: 0;
        }
        .tfg-wf__status--loading { color: var(--accent); }
        .tfg-wf__status--rest { color: var(--text-faint); }
        .tfg-wf__controls {
          border-top: 1px solid var(--border);
          background: var(--surface-muted);
          padding: var(--space-5) var(--space-8) var(--space-6);
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: var(--space-4);
          flex-wrap: wrap;
        }
        .tfg-wf__hint {
          font-family: var(--font-mono);
          font-size: var(--text-xs);
          line-height: 1.6;
          letter-spacing: 0.02em;
          color: var(--text-faint);
          margin: 0;
          max-width: 52ch;
        }
        .tfg-wf__reload {
          font-family: var(--font-mono);
          font-size: var(--text-xs);
          letter-spacing: 0.04em;
          color: #FFFFFF;
          background: var(--accent);
          border: 1px solid var(--accent);
          border-radius: var(--radius-md);
          padding: 8px 18px;
          cursor: pointer;
          white-space: nowrap;
          transition: background var(--t-fast) var(--ease);
        }
        .tfg-wf__reload:hover { background: var(--accent-hover); }
      `}</style>

      <div className="tfg-wf__stage">
        <div
          className="tfg-wf__panel"
          data-testid="wf-swap"
          data-state={swapState}
        >
          <p className="tfg-wf__prop">font-display: swap</p>
          <p className="tfg-wf__sub">readable immediately</p>
          <div className="tfg-wf__line-wrap">
            <p
              className="tfg-wf__line"
              data-testid="wf-swap-text"
              style={{
                fontFamily: loading ? FALLBACK_FONT : REAL_FONT,
              }}
            >
              {LINE}
            </p>
          </div>
          <p
            className={`tfg-wf__status ${loading ? 'tfg-wf__status--loading' : 'tfg-wf__status--rest'}`}
          >
            {loading ? 'showing fallback font' : 'real font, loaded'}
          </p>
        </div>

        <div
          className="tfg-wf__panel"
          data-testid="wf-block"
          data-state={blockState}
        >
          <p className="tfg-wf__prop">font-display: block</p>
          <p className="tfg-wf__sub">blank until it loads</p>
          <div className="tfg-wf__line-wrap">
            <p
              className={`tfg-wf__line ${loading ? 'tfg-wf__line--hidden' : ''}`}
              data-testid="wf-block-text"
              style={{ fontFamily: REAL_FONT }}
            >
              {LINE}
            </p>
          </div>
          <p
            className={`tfg-wf__status ${loading ? 'tfg-wf__status--loading' : 'tfg-wf__status--rest'}`}
          >
            {loading ? 'waiting, blank' : 'real font, loaded'}
          </p>
        </div>
      </div>

      <div className="tfg-wf__controls">
        <p className="tfg-wf__hint">
          Same final result. The only difference is what the reader saw during
          the wait. Press reload to replay the load.
        </p>
        <button
          type="button"
          className="tfg-wf__reload"
          onClick={replay}
          data-testid="wf-reload"
        >
          reload the font
        </button>
      </div>
    </div>
  );
}
