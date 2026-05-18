'use client';
import { useEffect, useRef, useState } from 'react';

// A real scenario: the SAME setting, side by side as a segmented control and
// as a dropdown, with a live "how many options" control so you can watch the
// segmented control win at 3, strain at 6, and become an unusable wall at 12 —
// the exact point where the dropdown takes over. This entry IS the decision:
// you find the threshold by moving it, not by being told.

type Count = 3 | 6 | 12;

const ALL = [
  'Day', 'Week', 'Month', 'Quarter', 'Half-year', 'Year',
  'Two-year', 'Three-year', 'Five-year', 'Decade', 'All time', 'Custom',
];

export function SegmentedVsDropdownExample() {
  const [count, setCount] = useState<Count>(3);
  const [value, setValue] = useState<string>('Day');
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  const options = ALL.slice(0, count);

  // Adjusting state during render (React-recommended) rather than in an
  // effect: when count shrinks so the current value is no longer offered,
  // snap to the first option before paint. The guard makes this converge in
  // one extra render with no loop.
  if (!options.includes(value)) {
    setValue(options[0]);
  }

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, [open]);

  const segVerdict =
    count <= 3 ? 'good' : count <= 6 ? 'warn' : 'bad';

  return (
    <div className="upl-ex" data-testid="ex-segmented-vs-dropdown" ref={rootRef}>
      <style>{`
        .upl-ex-sd__bar {
          display: flex; align-items: center; gap: var(--space-3);
          margin-bottom: var(--space-4); flex-wrap: wrap;
        }
        .upl-ex-sd__bar > span { font-family: var(--font-mono); font-size: 11px; color: var(--text-faint); }
        .upl-ex-sd__seg { display: inline-flex; border: 1px solid var(--border-strong); border-radius: var(--radius-md); overflow: hidden; }
        .upl-ex-sd__seg button {
          font-family: var(--font-mono); font-size: 11px; padding: 6px 11px;
          border: none; background: var(--surface); color: var(--text-muted); cursor: pointer;
        }
        .upl-ex-sd__seg button[data-on="true"] { background: var(--accent-soft); color: var(--accent); }
        .upl-ex-sd__seg button + button { border-left: 1px solid var(--border-strong); }
        .upl-ex-sd__grid {
          display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-3);
        }
        @media (max-width: 640px) { .upl-ex-sd__grid { grid-template-columns: 1fr; } }
        .upl-ex-sd__col {
          border: 1px solid var(--border); border-radius: var(--radius-md);
          background: var(--surface-muted); padding: var(--space-4);
          display: flex; flex-direction: column; gap: var(--space-3);
        }
        .upl-ex-sd__col h5 {
          font-family: var(--font-mono); font-size: 10px; letter-spacing: 0.06em;
          text-transform: uppercase; color: var(--text-faint);
        }
        .upl-ex-sd__pills { display: flex; flex-wrap: wrap; gap: 5px; }
        .upl-ex-sd__pills button {
          font-family: var(--font-mono); font-size: 12px; padding: 7px 11px;
          border: 1px solid var(--border-strong); border-radius: var(--radius-md);
          background: var(--surface); color: var(--text-muted); cursor: pointer;
          white-space: nowrap;
        }
        .upl-ex-sd__pills button[data-on="true"] { border-color: var(--accent); background: var(--accent-soft); color: var(--accent); }
        .upl-ex-sd__anchor { position: relative; display: inline-flex; }
        .upl-ex-sd__trigger {
          font-family: var(--font-mono); font-size: 12px; padding: 8px 13px; min-width: 150px;
          border: 1px solid var(--border-strong); border-radius: var(--radius-md);
          background: var(--surface); color: var(--text); cursor: pointer;
          display: flex; justify-content: space-between; gap: 10px;
        }
        .upl-ex-sd__list {
          position: absolute; top: calc(100% + 6px); left: 0; min-width: 100%;
          background: var(--surface); border: 1px solid var(--border-strong);
          border-radius: var(--radius-md); box-shadow: 0 12px 30px color-mix(in srgb, #000 22%, transparent);
          z-index: 6; padding: 5px; max-height: 160px; overflow-y: auto;
        }
        .upl-ex-sd__list button {
          display: block; width: 100%; text-align: left; font-family: var(--font-mono);
          font-size: 12px; padding: 7px 10px; border: none; background: none;
          color: var(--text-muted); cursor: pointer; border-radius: var(--radius-sm);
        }
        .upl-ex-sd__list button[data-on="true"] { color: var(--accent); }
        .upl-ex-sd__list button:hover { background: var(--surface-muted); }
        .upl-ex-sd__note {
          margin-top: var(--space-3); font-size: var(--text-sm); line-height: 1.55;
          color: var(--text-muted); padding: var(--space-3);
          border-left: 2px solid var(--accent); background: var(--accent-soft);
          border-radius: var(--radius-sm);
        }
        .upl-ex-sd__note[data-kind="good"] { border-left-color: #16a34a; }
        .upl-ex-sd__note[data-kind="warn"] { border-left-color: #d97706; }
        .upl-ex-sd__note[data-kind="bad"]  { border-left-color: #dc2626; }
      `}</style>

      <div className="upl-ex-sd__bar">
        <span>options in this setting:</span>
        <div className="upl-ex-sd__seg" role="group" aria-label="Option count">
          {([3, 6, 12] as Count[]).map((c) => (
            <button key={c} type="button" data-on={count === c} onClick={() => setCount(c)} data-testid={`ex-sd-count-${c}`}>{c}</button>
          ))}
        </div>
      </div>

      <div className="upl-ex-sd__grid">
        <div className="upl-ex-sd__col">
          <h5>segmented control</h5>
          <div className="upl-ex-sd__pills" role="group" aria-label="Range, segmented" data-testid="ex-sd-segmented">
            {options.map((o) => (
              <button key={o} type="button" data-on={value === o} onClick={() => setValue(o)} data-testid={`ex-sd-seg-${o}`}>{o}</button>
            ))}
          </div>
        </div>

        <div className="upl-ex-sd__col">
          <h5>dropdown</h5>
          <div className="upl-ex-sd__anchor">
            <button type="button" className="upl-ex-sd__trigger" onClick={() => setOpen((v) => !v)} aria-expanded={open} data-testid="ex-sd-dropdown">
              <span>{value}</span><span>▾</span>
            </button>
            {open && (
              <div className="upl-ex-sd__list" role="listbox" data-testid="ex-sd-dropdown-list">
                {options.map((o) => (
                  <button key={o} type="button" data-on={value === o} onClick={() => { setValue(o); setOpen(false); }}>{o}</button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <p className="upl-ex-sd__note" data-kind={segVerdict} data-testid="ex-sd-note">
        {count <= 3
          ? 'At three short options the segmented control wins outright: every option visible, comparable, one tap, no hidden state. The dropdown here only adds a click.'
          : count <= 6
            ? 'At six it is straining — the row is getting wide and the labels crowd. Still usable, but the segmented control\'s advantage is thinning.'
            : 'At twelve the segmented control is an unscannable wall that eats the layout. This is the threshold: past a handful of options, the dropdown is the right pattern.'}
      </p>
    </div>
  );
}
