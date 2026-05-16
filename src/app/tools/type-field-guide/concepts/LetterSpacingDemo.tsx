'use client';
import { useState } from 'react';

// The aha is that the right move goes in opposite directions. The heading
// gets better as it tightens (negative); the small label gets better as it
// opens up (positive). The default and improved markers on the two tracks
// sit on opposite sides of centre, which is the visual punchline.
interface Sample {
  min: number;
  max: number;
  step: number;
  improved: number;
}

const HEADING: Sample = { min: -0.06, max: 0.04, step: 0.005, improved: -0.03 };
const LABEL: Sample = { min: -0.02, max: 0.22, step: 0.01, improved: 0.12 };

const pct = (s: Sample, v: number) =>
  ((v - s.min) / (s.max - s.min)) * 100;

export function LetterSpacingDemo() {
  const [heading, setHeading] = useState(0);
  const [label, setLabel] = useState(0);

  return (
    <div className="tfg-ls" data-testid="ls-demo">
      <style>{`
        .tfg-ls {
          margin-top: var(--space-8);
          border: 1px solid var(--border);
          border-radius: var(--radius-lg);
          background: var(--surface);
          overflow: hidden;
        }
        .tfg-ls__stage {
          display: grid;
          grid-template-columns: 1fr 1fr;
        }
        @media (max-width: 620px) {
          .tfg-ls__stage { grid-template-columns: 1fr; }
          .tfg-ls__col + .tfg-ls__col {
            border-left: none;
            border-top: 1px solid var(--border);
          }
        }
        .tfg-ls__col {
          padding: var(--space-7) var(--space-6) var(--space-6);
          display: flex;
          flex-direction: column;
          gap: var(--space-5);
        }
        .tfg-ls__col + .tfg-ls__col { border-left: 1px solid var(--border); }
        .tfg-ls__caption {
          font-family: var(--font-mono);
          font-size: var(--text-xs);
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--text-faint);
          margin: 0;
        }
        .tfg-ls__sample-wrap {
          min-height: 92px;
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
        }
        .tfg-ls__heading {
          font-family: var(--font-sans);
          font-weight: 600;
          font-size: 40px;
          line-height: 1.1;
          color: var(--text);
          margin: 0;
        }
        .tfg-ls__label {
          font-family: var(--font-sans);
          font-weight: 500;
          font-size: 12px;
          text-transform: uppercase;
          color: var(--text-muted);
          margin: 0;
        }
        .tfg-ls__value {
          font-family: var(--font-mono);
          font-size: var(--text-sm);
          color: var(--text-muted);
          font-variant-numeric: tabular-nums;
          text-align: center;
        }
        .tfg-ls__track {
          position: relative;
          height: 18px;
        }
        .tfg-ls__tick {
          position: absolute;
          top: 0;
          transform: translateX(-50%);
          font-family: var(--font-mono);
          font-size: 10px;
          letter-spacing: 0.04em;
          white-space: nowrap;
          color: var(--text-faint);
        }
        .tfg-ls__tick::before {
          content: '';
          position: absolute;
          left: 50%;
          top: 13px;
          width: 1px;
          height: 6px;
          background: var(--border-strong);
        }
        .tfg-ls__tick--improved { color: var(--accent); }
        .tfg-ls__tick--improved::before { background: var(--accent); }
        .tfg-ls__segments {
          display: flex;
          border: 1px solid var(--border-strong);
          border-radius: var(--radius-md);
          overflow: hidden;
        }
        .tfg-ls__segment {
          flex: 1;
          padding: 7px 12px;
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
        .tfg-ls__segment:first-child { border-left: none; }
        .tfg-ls__segment:hover { color: var(--text); }
        .tfg-ls__segment--improved-on {
          background: var(--accent);
          color: #FFFFFF;
        }
        .tfg-ls__footer {
          border-top: 1px solid var(--border);
          background: var(--surface-muted);
          padding: var(--space-5) var(--space-8);
        }
        .tfg-ls__hint {
          font-family: var(--font-mono);
          font-size: var(--text-xs);
          line-height: 1.6;
          letter-spacing: 0.02em;
          color: var(--text-faint);
          margin: 0;
          max-width: 64ch;
        }
      `}</style>

      <div className="tfg-ls__stage">
        <div className="tfg-ls__col">
          <p className="tfg-ls__caption">large heading · wants tightening</p>
          <div className="tfg-ls__sample-wrap">
            <p
              className="tfg-ls__heading"
              data-testid="ls-heading-sample"
              style={{ letterSpacing: `${heading}em` }}
            >
              Tighten this headline
            </p>
          </div>
          <span className="tfg-ls__value" data-testid="ls-heading-value">
            letter-spacing: {heading.toFixed(3)}em
          </span>
          <input
            type="range"
            className="slider"
            min={HEADING.min}
            max={HEADING.max}
            step={HEADING.step}
            value={heading}
            onChange={(e) => setHeading(Number(e.target.value))}
            aria-label="Heading letter spacing"
            data-testid="ls-heading-slider"
          />
          <div className="tfg-ls__track" aria-hidden="true">
            <span
              className="tfg-ls__tick"
              style={{ left: `${pct(HEADING, 0)}%` }}
            >
              default
            </span>
            <span
              className="tfg-ls__tick tfg-ls__tick--improved"
              style={{ left: `${pct(HEADING, HEADING.improved)}%` }}
            >
              improved
            </span>
          </div>
          <div className="tfg-ls__segments" role="group" aria-label="Heading presets">
            <button
              type="button"
              className="tfg-ls__segment"
              data-testid="ls-heading-default"
              onClick={() => setHeading(0)}
            >
              default
            </button>
            <button
              type="button"
              className={`tfg-ls__segment ${heading === HEADING.improved ? 'tfg-ls__segment--improved-on' : ''}`}
              data-testid="ls-heading-improved"
              onClick={() => setHeading(HEADING.improved)}
            >
              improved
            </button>
          </div>
        </div>

        <div className="tfg-ls__col">
          <p className="tfg-ls__caption">small caps label · wants opening up</p>
          <div className="tfg-ls__sample-wrap">
            <p
              className="tfg-ls__label"
              data-testid="ls-label-sample"
              style={{ letterSpacing: `${label}em` }}
            >
              Filed under typography
            </p>
          </div>
          <span className="tfg-ls__value" data-testid="ls-label-value">
            letter-spacing: {label.toFixed(3)}em
          </span>
          <input
            type="range"
            className="slider"
            min={LABEL.min}
            max={LABEL.max}
            step={LABEL.step}
            value={label}
            onChange={(e) => setLabel(Number(e.target.value))}
            aria-label="Label letter spacing"
            data-testid="ls-label-slider"
          />
          <div className="tfg-ls__track" aria-hidden="true">
            <span
              className="tfg-ls__tick"
              style={{ left: `${pct(LABEL, 0)}%` }}
            >
              default
            </span>
            <span
              className="tfg-ls__tick tfg-ls__tick--improved"
              style={{ left: `${pct(LABEL, LABEL.improved)}%` }}
            >
              improved
            </span>
          </div>
          <div className="tfg-ls__segments" role="group" aria-label="Label presets">
            <button
              type="button"
              className="tfg-ls__segment"
              data-testid="ls-label-default"
              onClick={() => setLabel(0)}
            >
              default
            </button>
            <button
              type="button"
              className={`tfg-ls__segment ${label === LABEL.improved ? 'tfg-ls__segment--improved-on' : ''}`}
              data-testid="ls-label-improved"
              onClick={() => setLabel(LABEL.improved)}
            >
              improved
            </button>
          </div>
        </div>
      </div>

      <div className="tfg-ls__footer">
        <p className="tfg-ls__hint">
          Body text is not in this demo on purpose: leave it alone. Better is
          a small move, and the two cases pull opposite ways. The improved
          marks land on opposite sides of the default.
        </p>
      </div>
    </div>
  );
}
