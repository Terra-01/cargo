'use client';
import { useState } from 'react';

// The aha is the two failure modes plus the squint test. The user can push
// the block flat (a wall) or crank it to shouting, the screen names both,
// and the blur toggle makes scannability literally visible: a good
// hierarchy keeps its shape blurred, a flat one is a gray slab.
const BODY_SIZE = 16;

const S_MIN = 1.0;
const S_MAX = 2.1;
const W_MIN = 0;
const W_MAX = 300;

type Verdict = 'flat' | 'readable' | 'shouting';

const VERDICT_LABEL: Record<Verdict, string> = {
  flat: 'no hierarchy · nothing leads the eye',
  readable: 'readable · the eye knows where to go',
  shouting: 'over-done · everything competes',
};

function contrastOf(size: number, weight: number) {
  const sizeN = (size - S_MIN) / (S_MAX - S_MIN);
  const weightN = (weight - W_MIN) / (W_MAX - W_MIN);
  return (sizeN + weightN) / 2;
}

function judge(size: number, weight: number): Verdict {
  const c = contrastOf(size, weight);
  if (c < 0.18) return 'flat';
  if (c > 0.8) return 'shouting';
  return 'readable';
}

const PRESETS = [
  { id: 'flat', label: 'flat', size: 1.05, weight: 0 },
  { id: 'balanced', label: 'balanced', size: 1.5, weight: 175 },
  { id: 'shouting', label: 'shouting', size: 2.1, weight: 300 },
] as const;

export function HierarchyDemo() {
  const [size, setSize] = useState(1.5);
  const [weight, setWeight] = useState(175);
  const [squint, setSquint] = useState(false);

  const verdict = judge(size, weight);
  const activePreset =
    PRESETS.find((p) => p.size === size && p.weight === weight)?.id ?? null;

  const headingSize = Math.round(BODY_SIZE * size * size);
  const subheadSize = Math.round(BODY_SIZE * size);
  const headingWeight = 400 + weight;
  const subheadWeight = 400 + Math.round(weight / 2);

  return (
    <div className="tfg-hi" data-testid="hi-demo">
      <style>{`
        .tfg-hi {
          margin-top: var(--space-8);
          border: 1px solid var(--border);
          border-radius: var(--radius-lg);
          background: var(--surface);
          overflow: hidden;
        }
        .tfg-hi__stage {
          padding: var(--space-8);
        }
        .tfg-hi__stage--squint { filter: blur(3px); }
        .tfg-hi__heading {
          font-family: var(--font-sans);
          line-height: 1.15;
          letter-spacing: -0.02em;
          color: var(--text);
          margin: 0 0 var(--space-2);
          max-width: 22ch;
        }
        .tfg-hi__subhead {
          font-family: var(--font-sans);
          line-height: 1.3;
          color: var(--text-muted);
          margin: 0 0 var(--space-4);
          max-width: 34ch;
        }
        .tfg-hi__body {
          font-family: var(--font-sans);
          font-size: 16px;
          font-weight: 400;
          line-height: 1.65;
          color: var(--text-muted);
          margin: 0;
          max-width: 60ch;
        }
        .tfg-hi__controls {
          border-top: 1px solid var(--border);
          background: var(--surface-muted);
          padding: var(--space-5) var(--space-8) var(--space-6);
          display: flex;
          flex-direction: column;
          gap: var(--space-5);
        }
        .tfg-hi__verdict {
          display: flex;
          align-items: baseline;
          justify-content: space-between;
          gap: var(--space-4);
          flex-wrap: wrap;
        }
        .tfg-hi__judgment {
          font-family: var(--font-sans);
          font-weight: 500;
          font-size: var(--text-md);
          letter-spacing: -0.01em;
          color: var(--text-faint);
        }
        .tfg-hi__judgment--ok { color: var(--accent); }
        .tfg-hi__value {
          font-family: var(--font-mono);
          font-size: var(--text-sm);
          color: var(--text-muted);
          font-variant-numeric: tabular-nums;
        }
        .tfg-hi__segments {
          display: flex;
          border: 1px solid var(--border-strong);
          border-radius: var(--radius-md);
          overflow: hidden;
        }
        .tfg-hi__segment {
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
        .tfg-hi__segment:first-child { border-left: none; }
        .tfg-hi__segment:hover { color: var(--text); }
        .tfg-hi__segment--active {
          background: var(--text);
          color: var(--bg);
        }
        .tfg-hi__segment--active.tfg-hi__segment--ok {
          background: var(--accent);
          color: #FFFFFF;
        }
        .tfg-hi__sliders {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: var(--space-5);
        }
        @media (max-width: 599px) { /* migrated from max-width: 560px (canonical mobile band) */
          .tfg-hi__sliders { grid-template-columns: 1fr; }
        }
        .tfg-hi__slider-row {
          display: flex;
          flex-direction: column;
          gap: var(--space-2);
        }
        .tfg-hi__slider-label {
          font-family: var(--font-mono);
          font-size: var(--text-xs);
          letter-spacing: 0.04em;
          color: var(--text-muted);
          display: flex;
          justify-content: space-between;
        }
        .tfg-hi__squint {
          align-self: flex-start;
          font-family: var(--font-mono);
          font-size: var(--text-xs);
          letter-spacing: 0.04em;
          color: var(--text-muted);
          background: transparent;
          border: 1px solid var(--border-strong);
          border-radius: var(--radius-md);
          padding: 7px 14px;
          cursor: pointer;
          transition: all var(--t-fast) var(--ease);
        }
        .tfg-hi__squint:hover { color: var(--text); border-color: var(--text); }
        .tfg-hi__squint--on {
          background: var(--accent);
          color: #FFFFFF;
          border-color: var(--accent);
        }
        .tfg-hi__hint {
          font-family: var(--font-mono);
          font-size: var(--text-xs);
          line-height: 1.6;
          letter-spacing: 0.02em;
          color: var(--text-faint);
          margin: 0;
          max-width: 60ch;
        }
      `}</style>

      <div
        className={`tfg-hi__stage ${squint ? 'tfg-hi__stage--squint' : ''}`}
        data-testid="hi-stage"
      >
        <h3
          className="tfg-hi__heading"
          data-testid="hi-heading"
          style={{ fontSize: headingSize, fontWeight: headingWeight }}
        >
          How people read a page
        </h3>
        <p
          className="tfg-hi__subhead"
          style={{ fontSize: subheadSize, fontWeight: subheadWeight }}
        >
          Mostly they do not. They scan.
        </p>
        <p className="tfg-hi__body">
          A reader&apos;s eye hunts for the part it wants and skips the rest.
          Hierarchy is the difference in size and weight that tells the eye
          what is a heading and what is just the body. Flatten those
          differences and the page is a wall. Push them too far and everything
          shouts at once. Hit the squint button: a good hierarchy still has a
          shape, a flat one is a gray slab.
        </p>
      </div>

      <div className="tfg-hi__controls">
        <div className="tfg-hi__verdict">
          <span
            className={`tfg-hi__judgment ${verdict === 'readable' ? 'tfg-hi__judgment--ok' : ''}`}
            data-testid="hi-judgment"
          >
            {VERDICT_LABEL[verdict]}
          </span>
          <span className="tfg-hi__value" data-testid="hi-value">
            size ×{size.toFixed(2)} · weight Δ{weight}
          </span>
        </div>

        <div
          className="tfg-hi__segments"
          role="group"
          aria-label="Hierarchy presets"
        >
          {PRESETS.map((p) => {
            const active = activePreset === p.id;
            return (
              <button
                key={p.id}
                type="button"
                className={`tfg-hi__segment ${active ? 'tfg-hi__segment--active' : ''} ${
                  p.id === 'balanced' ? 'tfg-hi__segment--ok' : ''
                }`}
                aria-pressed={active}
                data-testid={`hi-state-${p.id}`}
                onClick={() => {
                  setSize(p.size);
                  setWeight(p.weight);
                }}
              >
                {p.label}
              </button>
            );
          })}
        </div>

        <div className="tfg-hi__sliders">
          <div className="tfg-hi__slider-row">
            <span className="tfg-hi__slider-label">
              <span>size step</span>
              <span>same → huge</span>
            </span>
            <input
              type="range"
              className="slider"
              min={S_MIN}
              max={S_MAX}
              step={0.05}
              value={size}
              onChange={(e) => setSize(Number(e.target.value))}
              aria-label="Size step between levels"
              data-testid="hi-size-slider"
            />
          </div>
          <div className="tfg-hi__slider-row">
            <span className="tfg-hi__slider-label">
              <span>weight contrast</span>
              <span>same → heavy</span>
            </span>
            <input
              type="range"
              className="slider"
              min={W_MIN}
              max={W_MAX}
              step={25}
              value={weight}
              onChange={(e) => setWeight(Number(e.target.value))}
              aria-label="Weight contrast between levels"
              data-testid="hi-weight-slider"
            />
          </div>
        </div>

        <button
          type="button"
          className={`tfg-hi__squint ${squint ? 'tfg-hi__squint--on' : ''}`}
          aria-pressed={squint}
          data-testid="hi-squint"
          onClick={() => setSquint((v) => !v)}
        >
          squint test: {squint ? 'on' : 'off'}
        </button>

        <p className="tfg-hi__hint">
          Squint, or hit the blur. A clear hierarchy keeps its shape; a flat
          one goes featureless. Most pages need about three sizes and two
          weights, not more.
        </p>
      </div>
    </div>
  );
}
