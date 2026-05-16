'use client';
import { useState } from 'react';

// The three labeled states are the whole point of this demo. The user does
// not get an unmarked slider; they get "too tight", "comfortable", and
// "too loose" as named places they can jump between, with the screen telling
// them which one they are looking at. The two wrong versions sitting right
// next to the right one is what makes the lesson land before the user
// already knows the answer.
const STATES = [
  { id: 'tight', label: 'too tight', value: 1.15 },
  { id: 'comfortable', label: 'comfortable', value: 1.5 },
  { id: 'loose', label: 'too loose', value: 2.2 },
] as const;

type StateId = (typeof STATES)[number]['id'];

// The slider moves freely, so the judgment is derived from the value, not
// from which button was clicked. These bands keep "comfortable" centred on
// the ~1.5 the copy recommends, with the wrong zones on either side.
const TIGHT_MAX = 1.35;
const LOOSE_MIN = 1.78;

function judge(lh: number): StateId {
  if (lh < TIGHT_MAX) return 'tight';
  if (lh > LOOSE_MIN) return 'loose';
  return 'comfortable';
}

const SAMPLE =
  'Good typography is mostly invisible. You notice it only when it fails: when a block of text feels heavier than it should, when your eye loses its place jumping back for the next line, when a paragraph somehow tires you out before you have finished it. None of that is the words themselves. It is the space around them, set badly. Drag the control and watch the same three sentences become easy or exhausting to read.';

export function LineHeightDemo() {
  const [lh, setLh] = useState(1.5);
  const current = judge(lh);
  const currentLabel = STATES.find((s) => s.id === current)!.label;

  return (
    <div className="tfg-lh" data-testid="lh-demo">
      <style>{`
        .tfg-lh {
          margin-top: var(--space-8);
          border: 1px solid var(--border);
          border-radius: var(--radius-lg);
          background: var(--surface);
          overflow: hidden;
        }
        .tfg-lh__stage {
          padding: var(--space-8) var(--space-8) var(--space-6);
        }
        .tfg-lh__sample {
          font-family: var(--font-sans);
          font-size: 17px;
          color: var(--text);
          max-width: 54ch;
          margin: 0;
        }
        .tfg-lh__controls {
          border-top: 1px solid var(--border);
          background: var(--surface-muted);
          padding: var(--space-5) var(--space-8) var(--space-6);
          display: flex;
          flex-direction: column;
          gap: var(--space-5);
        }
        .tfg-lh__verdict {
          display: flex;
          align-items: baseline;
          justify-content: space-between;
          gap: var(--space-4);
          flex-wrap: wrap;
        }
        .tfg-lh__judgment {
          font-family: var(--font-sans);
          font-weight: 500;
          font-size: var(--text-xl);
          letter-spacing: -0.015em;
          color: var(--text-faint);
        }
        .tfg-lh__judgment--ok { color: var(--accent); }
        .tfg-lh__value {
          font-family: var(--font-mono);
          font-size: var(--text-sm);
          color: var(--text-muted);
          font-variant-numeric: tabular-nums;
        }
        .tfg-lh__segments {
          display: flex;
          border: 1px solid var(--border-strong);
          border-radius: var(--radius-md);
          overflow: hidden;
        }
        .tfg-lh__segment {
          flex: 1;
          padding: 8px 12px;
          font-family: var(--font-mono);
          font-size: var(--text-xs);
          letter-spacing: 0.04em;
          background: transparent;
          border: none;
          border-left: 1px solid var(--border-strong);
          color: var(--text-muted);
          cursor: pointer;
          transition: all var(--t-fast) var(--ease);
        }
        .tfg-lh__segment:first-child { border-left: none; }
        .tfg-lh__segment:hover { color: var(--text); }
        .tfg-lh__segment--active {
          background: var(--text);
          color: var(--bg);
        }
        .tfg-lh__segment--active.tfg-lh__segment--ok {
          background: var(--accent);
          color: #FFFFFF;
        }
        .tfg-lh__slider-row {
          display: flex;
          flex-direction: column;
          gap: var(--space-2);
        }
        .tfg-lh__scale {
          display: flex;
          justify-content: space-between;
          font-family: var(--font-mono);
          font-size: var(--text-xs);
          color: var(--text-faint);
          letter-spacing: 0.04em;
        }
        .tfg-lh__hint {
          font-family: var(--font-mono);
          font-size: var(--text-xs);
          line-height: 1.6;
          letter-spacing: 0.02em;
          color: var(--text-faint);
          margin: 0;
        }
      `}</style>

      <div className="tfg-lh__stage">
        <p
          className="tfg-lh__sample"
          data-testid="lh-paragraph"
          style={{ lineHeight: lh }}
        >
          {SAMPLE}
        </p>
      </div>

      <div className="tfg-lh__controls">
        <div className="tfg-lh__verdict">
          <span
            className={`tfg-lh__judgment ${current === 'comfortable' ? 'tfg-lh__judgment--ok' : ''}`}
            data-testid="lh-judgment"
          >
            {currentLabel}
          </span>
          <span className="tfg-lh__value" data-testid="lh-value">
            line-height: {lh.toFixed(2)}
          </span>
        </div>

        <div
          className="tfg-lh__segments"
          role="group"
          aria-label="Line height presets"
        >
          {STATES.map((s) => {
            const active = current === s.id;
            return (
              <button
                key={s.id}
                type="button"
                className={`tfg-lh__segment ${active ? 'tfg-lh__segment--active' : ''} ${
                  s.id === 'comfortable' ? 'tfg-lh__segment--ok' : ''
                }`}
                aria-pressed={active}
                data-testid={`lh-state-${s.id}`}
                onClick={() => setLh(s.value)}
              >
                {s.label}
              </button>
            );
          })}
        </div>

        <div className="tfg-lh__slider-row">
          <input
            type="range"
            className="slider"
            min={1}
            max={2.4}
            step={0.05}
            value={lh}
            onChange={(e) => setLh(Number(e.target.value))}
            aria-label="Line height"
            data-testid="lh-slider"
          />
          <div className="tfg-lh__scale" aria-hidden="true">
            <span>too tight</span>
            <span>comfortable</span>
            <span>too loose</span>
          </div>
        </div>

        <p className="tfg-lh__hint">
          Squint at the paragraph until the words blur. You want an even gray.
          Dark stripes mean it is too tight; pale gaps mean it is too loose.
        </p>
      </div>
    </div>
  );
}
