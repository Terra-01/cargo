'use client';
import { useEffect, useRef, useState } from 'react';

// A real scenario with BOTH sides of the tension on screen, because the lesson
// is the boundary, not the pattern:
//
//  Row A — a PRIMARY choice of 3 (billing period). As a dropdown the options
//  are hidden behind a click and cannot be compared; as a segmented control
//  they are all visible and the decision is one tap. Dropdown is wrong here.
//
//  Row B — ~200 options (country). "Make them visible" renders the wall so you
//  feel why collapsing is the entire point. Dropdown is right here.
//
// Same control, opposite verdicts. You feel where the dropdown belongs.

type FewPres = 'dropdown' | 'segmented';
type ManyPres = 'dropdown' | 'visible';

const PERIODS = ['Monthly', 'Yearly', 'Two-year'] as const;
const COUNTRIES = [
  'Argentina','Australia','Austria','Belgium','Brazil','Canada','Chile','Colombia',
  'Denmark','Egypt','Finland','France','Germany','Ghana','Greece','India','Indonesia',
  'Ireland','Italy','Japan','Kenya','Mexico','Morocco','Nepal','Netherlands','Nigeria',
  'Norway','Peru','Poland','Portugal','Spain','Sweden','Switzerland','Thailand','Turkey',
  'Uganda','Ukraine','United Kingdom','United States','Vietnam',
];

export function DropdownMenuExample() {
  const [fewPres, setFewPres] = useState<FewPres>('dropdown');
  const [period, setPeriod] = useState<string>('Monthly');
  const [fewOpen, setFewOpen] = useState(false);

  const [manyPres, setManyPres] = useState<ManyPres>('dropdown');
  const [country, setCountry] = useState<string>('Germany');
  const [manyOpen, setManyOpen] = useState(false);

  const rootRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!fewOpen && !manyOpen) return;
    const onDoc = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setFewOpen(false);
        setManyOpen(false);
      }
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, [fewOpen, manyOpen]);

  return (
    <div className="upl-ex" data-testid="ex-dropdown-menu" ref={rootRef}>
      <style>{`
        .upl-ex-dm__sec { margin-bottom: var(--space-5); }
        .upl-ex-dm__sec:last-child { margin-bottom: 0; }
        .upl-ex-dm__head {
          display: flex; align-items: center; justify-content: space-between;
          gap: var(--space-3); margin-bottom: var(--space-3); flex-wrap: wrap;
        }
        .upl-ex-dm__title { font-size: var(--text-sm); font-weight: 600; color: var(--text); }
        .upl-ex-dm__seg { display: inline-flex; border: 1px solid var(--border-strong); border-radius: var(--radius-md); overflow: hidden; }
        .upl-ex-dm__seg button {
          font-family: var(--font-mono); font-size: 11px; padding: 6px 11px;
          border: none; background: var(--surface); color: var(--text-muted); cursor: pointer;
        }
        .upl-ex-dm__seg button[data-on="true"] { background: var(--accent-soft); color: var(--accent); }
        .upl-ex-dm__seg button + button { border-left: 1px solid var(--border-strong); }
        .upl-ex-dm__stage {
          border: 1px solid var(--border); border-radius: var(--radius-md);
          background: var(--surface-muted); padding: var(--space-4); min-height: 96px;
        }
        .upl-ex-dm__anchor { position: relative; display: inline-flex; }
        .upl-ex-dm__trigger {
          font-family: var(--font-mono); font-size: var(--text-xs); padding: 8px 13px;
          border-radius: var(--radius-md); border: 1px solid var(--border-strong);
          background: var(--surface); color: var(--text); cursor: pointer; min-width: 150px;
          display: flex; justify-content: space-between; gap: 10px;
        }
        .upl-ex-dm__trigger:hover { border-color: var(--accent); }
        .upl-ex-dm__list {
          position: absolute; top: calc(100% + 6px); left: 0; min-width: 100%;
          background: var(--surface); border: 1px solid var(--border-strong);
          border-radius: var(--radius-md); box-shadow: 0 12px 30px color-mix(in srgb, #000 22%, transparent);
          z-index: 6; padding: 5px; max-height: 168px; overflow-y: auto;
        }
        .upl-ex-dm__opt {
          display: block; width: 100%; text-align: left;
          font-family: var(--font-mono); font-size: 12px; padding: 7px 10px;
          border: none; background: none; color: var(--text-muted); cursor: pointer;
          border-radius: var(--radius-sm);
        }
        .upl-ex-dm__opt:hover { background: var(--surface-muted); color: var(--text); }
        .upl-ex-dm__opt[data-on="true"] { color: var(--accent); }
        .upl-ex-dm__segpick { display: flex; gap: 6px; flex-wrap: wrap; }
        .upl-ex-dm__segpick button {
          font-family: var(--font-mono); font-size: 12px; padding: 8px 14px;
          border: 1px solid var(--border-strong); border-radius: var(--radius-md);
          background: var(--surface); color: var(--text-muted); cursor: pointer;
        }
        .upl-ex-dm__segpick button[data-on="true"] { border-color: var(--accent); background: var(--accent-soft); color: var(--accent); }
        .upl-ex-dm__wall { display: flex; flex-wrap: wrap; gap: 5px; max-height: 150px; overflow-y: auto; }
        .upl-ex-dm__wall button {
          font-family: var(--font-mono); font-size: 11px; padding: 5px 9px;
          border: 1px solid var(--border); border-radius: var(--radius-sm);
          background: var(--surface); color: var(--text-muted); cursor: pointer;
        }
        .upl-ex-dm__wall button[data-on="true"] { border-color: var(--accent); background: var(--accent-soft); color: var(--accent); }
        .upl-ex-dm__note {
          margin-top: var(--space-3); font-size: var(--text-sm); line-height: 1.55;
          color: var(--text-muted); padding: var(--space-3);
          border-left: 2px solid var(--accent); background: var(--accent-soft);
          border-radius: var(--radius-sm);
        }
        .upl-ex-dm__note[data-kind="bad"] { border-left-color: #dc2626; }
        .upl-ex-dm__note[data-kind="good"] { border-left-color: #16a34a; }
      `}</style>

      {/* Row A — small primary choice */}
      <div className="upl-ex-dm__sec">
        <div className="upl-ex-dm__head">
          <span className="upl-ex-dm__title">Billing period — 3 options, central to the task</span>
          <div className="upl-ex-dm__seg" role="group" aria-label="Presentation, few options">
            <button type="button" data-on={fewPres === 'dropdown'} onClick={() => { setFewPres('dropdown'); setFewOpen(false); }} data-testid="ex-dd-fewmode-dropdown">dropdown</button>
            <button type="button" data-on={fewPres === 'segmented'} onClick={() => { setFewPres('segmented'); setFewOpen(false); }} data-testid="ex-dd-fewmode-segmented">segmented</button>
          </div>
        </div>
        <div className="upl-ex-dm__stage">
          {fewPres === 'dropdown' ? (
            <div className="upl-ex-dm__anchor">
              <button type="button" className="upl-ex-dm__trigger" onClick={() => setFewOpen((o) => !o)} aria-expanded={fewOpen} data-testid="ex-dd-few-trigger">
                <span>{period}</span><span>▾</span>
              </button>
              {fewOpen && (
                <div className="upl-ex-dm__list" role="listbox" data-testid="ex-dd-few-list">
                  {PERIODS.map((p) => (
                    <button key={p} type="button" className="upl-ex-dm__opt" data-on={period === p} onClick={() => { setPeriod(p); setFewOpen(false); }} data-testid={`ex-dd-few-opt-${p}`}>{p}</button>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="upl-ex-dm__segpick" role="group" aria-label="Billing period" data-testid="ex-dd-few-segmented">
              {PERIODS.map((p) => (
                <button key={p} type="button" data-on={period === p} onClick={() => setPeriod(p)} data-testid={`ex-dd-seg-opt-${p}`}>{p}</button>
              ))}
            </div>
          )}
        </div>
        <p className="upl-ex-dm__note" data-kind={fewPres === 'dropdown' ? 'bad' : 'good'} data-testid="ex-dd-note-few">
          {fewPres === 'dropdown'
            ? 'Three mutually exclusive options that matter to the task, hidden behind a click. You cannot weigh them without opening the menu. A dropdown adds friction and hides the comparison.'
            : 'All three visible, comparable at a glance, chosen in one tap. For a small primary set this is the right call — show the options.'}
        </p>
      </div>

      {/* Row B — many options */}
      <div className="upl-ex-dm__sec">
        <div className="upl-ex-dm__head">
          <span className="upl-ex-dm__title">Country — ~200 options, secondary</span>
          <div className="upl-ex-dm__seg" role="group" aria-label="Presentation, many options">
            <button type="button" data-on={manyPres === 'dropdown'} onClick={() => { setManyPres('dropdown'); setManyOpen(false); }} data-testid="ex-dd-manymode-dropdown">dropdown</button>
            <button type="button" data-on={manyPres === 'visible'} onClick={() => { setManyPres('visible'); setManyOpen(false); }} data-testid="ex-dd-manymode-visible">make visible</button>
          </div>
        </div>
        <div className="upl-ex-dm__stage">
          {manyPres === 'dropdown' ? (
            <div className="upl-ex-dm__anchor">
              <button type="button" className="upl-ex-dm__trigger" onClick={() => setManyOpen((o) => !o)} aria-expanded={manyOpen} data-testid="ex-dd-many-trigger">
                <span>{country}</span><span>▾</span>
              </button>
              {manyOpen && (
                <div className="upl-ex-dm__list" role="listbox" data-testid="ex-dd-many-list">
                  {COUNTRIES.map((c) => (
                    <button key={c} type="button" className="upl-ex-dm__opt" data-on={country === c} onClick={() => { setCountry(c); setManyOpen(false); }}>{c}</button>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="upl-ex-dm__wall" data-testid="ex-dd-many-wall">
              {COUNTRIES.map((c) => (
                <button key={c} type="button" data-on={country === c} onClick={() => setCountry(c)}>{c}</button>
              ))}
            </div>
          )}
        </div>
        <p className="upl-ex-dm__note" data-kind={manyPres === 'dropdown' ? 'good' : 'bad'} data-testid="ex-dd-note-many">
          {manyPres === 'dropdown'
            ? 'Two hundred options no one compares side by side. Collapsing them behind a click is exactly the dropdown\'s job — the same pattern that was wrong above is right here.'
            : 'Make the same set visible and it is a wall: unscannable, space-eating, no faster to use. This is why the dropdown exists.'}
        </p>
      </div>
    </div>
  );
}
