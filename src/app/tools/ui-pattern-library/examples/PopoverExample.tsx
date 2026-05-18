'use client';
import { useEffect, useRef, useState } from 'react';

// A real scenario: the SAME "share / filter" trigger, two payloads. A compact
// interactive cluster anchored to the control (a popover doing its job), vs a
// long form crammed into the same bubble (the misuse — it overflows, scrolls,
// and fights the anchor). The "open as a panel instead" button shows where the
// content actually wanted to live. A plain hint would be a tooltip, not this;
// large content wants a panel or a page. You feel where the popover stops.

type Mode = 'compact' | 'overstuffed';

export function PopoverExample() {
  const [mode, setMode] = useState<Mode>('compact');
  const [open, setOpen] = useState(false);
  const [panel, setPanel] = useState(false);
  const [filters, setFilters] = useState({ open: true, mine: false, archived: false });
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('mousedown', onDoc);
    window.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDoc);
      window.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const switchMode = (m: Mode) => {
    setMode(m);
    setOpen(false);
    setPanel(false);
  };

  return (
    <div className="upl-ex" data-testid="ex-popover">
      <style>{`
        .upl-ex-po__seg {
          display: inline-flex;
          border: 1px solid var(--border-strong);
          border-radius: var(--radius-md);
          overflow: hidden;
          margin-bottom: var(--space-4);
        }
        .upl-ex-po__seg button {
          font-family: var(--font-mono);
          font-size: 11px;
          min-height: 44px;
          padding: 6px 14px;
          border: none;
          background: var(--surface);
          color: var(--text-muted);
          cursor: pointer;
        }
        .upl-ex-po__seg button[data-on="true"] { background: var(--accent-soft); color: var(--accent); }
        .upl-ex-po__seg button + button { border-left: 1px solid var(--border-strong); }
        .upl-ex-po__stage {
          position: relative;
          overflow: hidden;
          border-radius: var(--radius-md);
          background: var(--surface-muted);
          border: 1px solid var(--border);
          padding: var(--space-5);
          min-height: 240px;
        }
        .upl-ex-po__toolbar {
          display: flex;
          align-items: center;
          gap: var(--space-3);
        }
        .upl-ex-po__anchor { position: relative; display: inline-flex; }
        .upl-ex-po__trigger {
          font-family: var(--font-mono);
          font-size: var(--text-xs);
          display: inline-flex;
          align-items: center;
          min-height: 44px;
          padding: 7px 14px;
          border-radius: var(--radius-md);
          border: 1px solid var(--border-strong);
          background: var(--surface);
          color: var(--text);
          cursor: pointer;
        }
        .upl-ex-po__trigger:hover { border-color: var(--accent); }
        .upl-ex-po__pop {
          position: absolute;
          top: calc(100% + 8px);
          left: 0;
          width: 250px;
          background: var(--surface);
          border: 1px solid var(--border-strong);
          border-radius: var(--radius-md);
          box-shadow: 0 14px 34px color-mix(in srgb, #000 22%, transparent);
          z-index: 6;
          padding: var(--space-3);
        }
        .upl-ex-po__pop[data-variant="overstuffed"] { max-height: 168px; overflow-y: auto; }
        .upl-ex-po__pop h5 {
          font-size: var(--text-sm);
          font-weight: 600;
          color: var(--text);
          margin-bottom: 8px;
        }
        .upl-ex-po__check {
          display: flex;
          align-items: center;
          gap: 8px;
          min-height: 44px;
          font-size: 12px;
          color: var(--text-muted);
          padding: 5px 0;
        }
        .upl-ex-po__check input { width: 18px; height: 18px; }
        .upl-ex-po__row { display: flex; flex-direction: column; gap: 4px; margin-bottom: 9px; }
        .upl-ex-po__row label { font-family: var(--font-mono); font-size: 10px; color: var(--text-faint); }
        .upl-ex-po__row input, .upl-ex-po__row textarea {
          font-family: var(--font-mono);
          font-size: 12px;
          padding: 6px 8px;
          border: 1px solid var(--border-strong);
          border-radius: var(--radius-sm);
          background: var(--surface);
          color: var(--text);
        }
        .upl-ex-po__apply {
          margin-top: 8px;
          font-family: var(--font-mono);
          font-size: 11px;
          min-height: 44px;
          padding: 5px 14px;
          border-radius: var(--radius-sm);
          border: 1px solid var(--accent);
          background: var(--accent-soft);
          color: var(--accent);
          cursor: pointer;
        }
        .upl-ex-po__overflow {
          margin-top: var(--space-3);
          font-family: var(--font-mono);
          font-size: 11px;
          color: #dc2626;
        }
        .upl-ex-po__open-panel {
          font-family: var(--font-mono);
          font-size: 11px;
          display: inline-flex;
          align-items: center;
          min-height: 44px;
          padding: 5px 14px;
          border-radius: var(--radius-sm);
          border: 1px solid var(--border-strong);
          background: var(--surface);
          color: var(--text);
          cursor: pointer;
          margin-left: var(--space-3);
        }
        .upl-ex-po__panel {
          position: absolute;
          top: 0;
          right: 0;
          bottom: 0;
          width: 62%;
          background: var(--surface);
          border-left: 1px solid var(--border-strong);
          box-shadow: -16px 0 40px color-mix(in srgb, #000 20%, transparent);
          transform: translateX(102%);
          transition: transform 320ms var(--ease-out);
          padding: var(--space-5);
          z-index: 7;
          overflow-y: auto;
        }
        .upl-ex-po__panel[data-open="true"] { transform: none; }
        .upl-ex-po__panel h4 { font-size: var(--text-md); font-weight: 600; color: var(--text); margin-bottom: var(--space-3); }
        .upl-ex-po__panel-close {
          position: absolute; top: 8px; right: 8px;
          display: inline-flex; align-items: center; justify-content: center;
          min-width: 44px; min-height: 44px;
          background: none; border: none; color: var(--text-muted);
          font-size: 16px; cursor: pointer;
        }
        .upl-ex-po__note {
          margin-top: var(--space-3);
          font-size: var(--text-sm);
          line-height: 1.55;
          color: var(--text-muted);
          padding: var(--space-3);
          border-left: 2px solid var(--accent);
          background: var(--accent-soft);
          border-radius: var(--radius-sm);
          overflow-wrap: anywhere;
        }
        .upl-ex-po__overflow { overflow-wrap: anywhere; }
        .upl-ex-po__toolbar { flex-wrap: wrap; }
        .upl-ex-po__row input,
        .upl-ex-po__row textarea { min-width: 0; max-width: 100%; }
        /* Mobile: keep the popover and slide-in panel inside the demo box
           so the demo fits a phone without internal horizontal scroll. */
        @media (max-width: 599px) {
          .upl-ex-po__stage { padding: var(--space-4); }
          .upl-ex-po__pop { width: 190px; }
          .upl-ex-po__open-panel { margin-left: 0; }
          .upl-ex-po__panel { width: 88%; }
        }
      `}</style>

      <div className="upl-ex-po__seg" role="group" aria-label="Popover content">
        <button type="button" data-on={mode === 'compact'} onClick={() => switchMode('compact')} data-testid="ex-pop-mode-compact">compact (right)</button>
        <button type="button" data-on={mode === 'overstuffed'} onClick={() => switchMode('overstuffed')} data-testid="ex-pop-mode-overstuffed">overstuffed (wrong)</button>
      </div>

      <div className="upl-ex-po__stage" ref={rootRef}>
        <div className="upl-ex-po__toolbar">
          <div className="upl-ex-po__anchor">
            <button
              type="button"
              className="upl-ex-po__trigger"
              onClick={() => setOpen((o) => !o)}
              aria-expanded={open}
              data-testid="ex-pop-trigger"
            >
              {mode === 'compact' ? 'filter ▾' : 'edit settings ▾'}
            </button>

            {open && mode === 'compact' && (
              <div className="upl-ex-po__pop" data-variant="compact" role="dialog" aria-label="Filter" data-testid="ex-pop-popover">
                <h5>Filter results</h5>
                {(['open', 'mine', 'archived'] as const).map((k) => (
                  <label key={k} className="upl-ex-po__check">
                    <input
                      type="checkbox"
                      checked={filters[k]}
                      onChange={(e) => setFilters((f) => ({ ...f, [k]: e.target.checked }))}
                    />
                    {k === 'open' ? 'Open only' : k === 'mine' ? 'Assigned to me' : 'Include archived'}
                  </label>
                ))}
                <button type="button" className="upl-ex-po__apply" onClick={() => setOpen(false)}>apply</button>
              </div>
            )}

            {open && mode === 'overstuffed' && (
              <div className="upl-ex-po__pop" data-variant="overstuffed" role="dialog" aria-label="Settings" data-testid="ex-pop-popover">
                <h5>Project settings</h5>
                {['Name', 'Description', 'Visibility', 'Default branch', 'Topics', 'Timezone', 'Billing email'].map((f) => (
                  <div className="upl-ex-po__row" key={f}>
                    <label>{f}</label>
                    {f === 'Description'
                      ? <textarea rows={2} defaultValue="" />
                      : <input type="text" defaultValue="" />}
                  </div>
                ))}
                <button type="button" className="upl-ex-po__apply" onClick={() => setOpen(false)}>save</button>
              </div>
            )}
          </div>

          {mode === 'overstuffed' && (
            <button
              type="button"
              className="upl-ex-po__open-panel"
              onClick={() => { setOpen(false); setPanel(true); }}
              data-testid="ex-pop-open-panel"
            >
              open as a panel instead →
            </button>
          )}
        </div>

        {mode === 'overstuffed' && open && (
          <p className="upl-ex-po__overflow" data-testid="ex-pop-overflow-note">
            seven fields in a tiny anchored bubble: it scrolls, the anchor is
            useless, and the form is cramped. This wants a panel or a page.
          </p>
        )}

        <div className="upl-ex-po__panel" data-open={panel} data-testid="ex-pop-panel" aria-hidden={!panel}>
          <button type="button" className="upl-ex-po__panel-close" onClick={() => setPanel(false)} aria-label="Close panel">×</button>
          <h4>Project settings</h4>
          {['Name', 'Description', 'Visibility', 'Default branch', 'Topics', 'Timezone', 'Billing email'].map((f) => (
            <div className="upl-ex-po__row" key={f}>
              <label>{f}</label>
              {f === 'Description'
                ? <textarea rows={3} defaultValue="" />
                : <input type="text" defaultValue="" />}
            </div>
          ))}
        </div>
      </div>

      <p className="upl-ex-po__note" data-testid="ex-pop-note">
        {mode === 'compact'
          ? 'A short, optional, interactive cluster anchored to its trigger: this is exactly what a popover is for. (A plain text hint would be a tooltip, not this.)'
          : 'The same popover, overstuffed. Large or complex content overflows the bubble and breaks the anchor — it belongs in a panel or a page. The popover is not the container for everything.'}
      </p>
    </div>
  );
}
