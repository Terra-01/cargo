'use client';
import { useMemo, useState } from 'react';
import { ratios, generateTypeScale } from '@/lib/type-scale';

// This demo's whole job is to NOT be the old calculator. It never leads with
// a list of sizes. It shows the SAME page fragment rendered at two ratios so
// the user sees a ratio change the personality of a page, not a number line.
// Tight reads calm and UI-like; wide reads dramatic and editorial. Those two
// labeled bookends are the lesson; the free control is secondary.
const BASE = 16;

const PRESETS = [
  { id: 'tight', label: 'tight', value: 1.2 },
  { id: 'wide', label: 'wide', value: 1.5 },
] as const;

// No "correct" answer here, so the judgment names a personality, not a
// verdict. The copy is explicit that neither is right; they are different
// tools, so the wording stays descriptive.
const TIGHT_MAX = 1.25;
const WIDE_MIN = 1.5;

function personality(ratio: number) {
  if (ratio <= TIGHT_MAX) return 'calm · suits a dense UI';
  if (ratio >= WIDE_MIN) return 'dramatic · suits a landing page';
  return 'balanced · a safe middle';
}

// The closest ratio in the lib's set, so the free slider snaps to real,
// named musical ratios rather than arbitrary decimals.
function nearestRatioIndex(value: number) {
  let best = 0;
  let bestDelta = Infinity;
  ratios.forEach((r, i) => {
    const d = Math.abs(r.value - value);
    if (d < bestDelta) {
      bestDelta = d;
      best = i;
    }
  });
  return best;
}

export function TypeScaleDemo() {
  const [ratioIndex, setRatioIndex] = useState(() => nearestRatioIndex(1.5));
  const [copied, setCopied] = useState(false);

  const ratio = ratios[ratioIndex];
  const steps = useMemo(
    () => generateTypeScale(BASE, ratio.value, 6, 2),
    [ratio.value]
  );
  const sizeOf = (name: string) =>
    steps.find((s) => s.name === name)?.size ?? BASE;

  const headline = sizeOf('text-3xl');
  const subhead = sizeOf('text-xl');
  const kicker = sizeOf('text-sm');

  const activePreset =
    ratio.value <= TIGHT_MAX ? 'tight' : ratio.value >= WIDE_MIN ? 'wide' : null;

  // Type-only CSS. The lib's generateCss also emits a spacing scale, which
  // this concept does not teach, so we format the type steps here in the
  // same :root style. generateTypeScale still does the maths.
  const css = useMemo(() => {
    const asc = [...steps].sort((a, b) => a.size - b.size);
    const width = Math.max(...asc.map((s) => s.name.length));
    const lines = [':root {', '  /* Type scale */'];
    asc.forEach((s) =>
      lines.push(`  --${s.name.padEnd(width)} : ${s.size}px;`)
    );
    lines.push('}');
    return lines.join('\n');
  }, [steps]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(css);
    } catch {
      // ignore in restricted environments
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="tfg-ts" data-testid="ts-demo">
      <style>{`
        .tfg-ts {
          margin-top: var(--space-8);
          border: 1px solid var(--border);
          border-radius: var(--radius-lg);
          background: var(--surface);
          overflow: hidden;
        }
        .tfg-ts__stage {
          padding: var(--space-10) var(--space-8) var(--space-10);
        }
        .tfg-ts__kicker {
          font-family: var(--font-mono);
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--text-faint);
          margin: 0 0 var(--space-4);
        }
        .tfg-ts__headline {
          font-family: var(--font-sans);
          font-weight: 600;
          letter-spacing: -0.025em;
          line-height: 1.08;
          color: var(--text);
          margin: 0 0 var(--space-4);
          max-width: 16ch;
        }
        .tfg-ts__subhead {
          font-family: var(--font-sans);
          font-weight: 500;
          line-height: 1.3;
          color: var(--text-muted);
          margin: 0 0 var(--space-5);
          max-width: 30ch;
        }
        .tfg-ts__body {
          font-family: var(--font-sans);
          font-size: 16px;
          line-height: 1.6;
          color: var(--text-muted);
          margin: 0;
          max-width: 48ch;
        }
        .tfg-ts__controls {
          border-top: 1px solid var(--border);
          background: var(--surface-muted);
          padding: var(--space-5) var(--space-8) var(--space-6);
          display: flex;
          flex-direction: column;
          gap: var(--space-5);
        }
        .tfg-ts__verdict {
          display: flex;
          align-items: baseline;
          justify-content: space-between;
          gap: var(--space-4);
          flex-wrap: wrap;
        }
        .tfg-ts__judgment {
          font-family: var(--font-sans);
          font-weight: 500;
          font-size: var(--text-xl);
          letter-spacing: -0.015em;
          color: var(--text);
        }
        .tfg-ts__value {
          font-family: var(--font-mono);
          font-size: var(--text-sm);
          color: var(--text-muted);
          font-variant-numeric: tabular-nums;
        }
        .tfg-ts__segments {
          display: flex;
          border: 1px solid var(--border-strong);
          border-radius: var(--radius-md);
          overflow: hidden;
        }
        .tfg-ts__segment {
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
        .tfg-ts__segment:first-child { border-left: none; }
        .tfg-ts__segment:hover { color: var(--text); }
        .tfg-ts__segment--active {
          background: var(--text);
          color: var(--bg);
        }
        .tfg-ts__slider-row {
          display: flex;
          flex-direction: column;
          gap: var(--space-2);
        }
        .tfg-ts__scale {
          display: flex;
          justify-content: space-between;
          font-family: var(--font-mono);
          font-size: var(--text-xs);
          color: var(--text-faint);
          letter-spacing: 0.04em;
        }
        .tfg-ts__footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: var(--space-4);
          flex-wrap: wrap;
        }
        .tfg-ts__hint {
          font-family: var(--font-mono);
          font-size: var(--text-xs);
          line-height: 1.6;
          letter-spacing: 0.02em;
          color: var(--text-faint);
          margin: 0;
          max-width: 52ch;
        }
        .tfg-ts__copy {
          font-family: var(--font-mono);
          font-size: var(--text-xs);
          letter-spacing: 0.04em;
          color: var(--text-muted);
          background: transparent;
          border: 1px solid var(--border-strong);
          border-radius: var(--radius-md);
          padding: 5px 12px;
          cursor: pointer;
          white-space: nowrap;
          transition: all var(--t-fast) var(--ease);
        }
        .tfg-ts__copy:hover { color: var(--text); border-color: var(--text); }
      `}</style>

      <div className="tfg-ts__stage" data-testid="ts-stage">
        <p className="tfg-ts__kicker" style={{ fontSize: kicker }}>
          a small workshop
        </p>
        <h3
          className="tfg-ts__headline"
          style={{ fontSize: headline }}
          data-testid="ts-headline"
        >
          Build the thing you wish existed.
        </h3>
        <p
          className="tfg-ts__subhead"
          style={{ fontSize: subhead }}
          data-testid="ts-subhead"
        >
          Small tools, made carefully, and shipped on a Saturday.
        </p>
        <p className="tfg-ts__body" data-testid="ts-body">
          This paragraph stays at 16 pixels the whole time. Only the headline
          and subheading move, because a scale changes how sizes relate, not
          the body you actually read. Switch between tight and wide and watch
          the page change personality.
        </p>
      </div>

      <div className="tfg-ts__controls">
        <div className="tfg-ts__verdict">
          <span className="tfg-ts__judgment" data-testid="ts-judgment">
            {personality(ratio.value)}
          </span>
          <span className="tfg-ts__value" data-testid="ts-value">
            ratio {ratio.value.toFixed(3).replace(/0+$/, '').replace(/\.$/, '')}{' '}
            · {ratio.label.split(' · ')[0]}
          </span>
        </div>

        <div
          className="tfg-ts__segments"
          role="group"
          aria-label="Type scale presets"
        >
          {PRESETS.map((p) => {
            const active = activePreset === p.id;
            return (
              <button
                key={p.id}
                type="button"
                className={`tfg-ts__segment ${active ? 'tfg-ts__segment--active' : ''}`}
                aria-pressed={active}
                data-testid={`ts-state-${p.id}`}
                onClick={() => setRatioIndex(nearestRatioIndex(p.value))}
              >
                {p.label}
              </button>
            );
          })}
        </div>

        <div className="tfg-ts__slider-row">
          <input
            type="range"
            className="slider"
            min={0}
            max={ratios.length - 1}
            step={1}
            value={ratioIndex}
            onChange={(e) => setRatioIndex(Number(e.target.value))}
            aria-label="Type scale ratio"
            data-testid="ts-slider"
          />
          <div className="tfg-ts__scale" aria-hidden="true">
            <span>tight</span>
            <span>balanced</span>
            <span>wide</span>
          </div>
        </div>

        <div className="tfg-ts__footer">
          <p className="tfg-ts__hint">
            Same words, same body size. Only the ratio between sizes changed,
            and with it the whole feel of the page.
          </p>
          <button
            type="button"
            className="tfg-ts__copy"
            onClick={handleCopy}
            data-testid="ts-copy"
          >
            {copied ? 'copied' : 'copy CSS'}
          </button>
        </div>
      </div>
    </div>
  );
}
