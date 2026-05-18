'use client';
import { useCallback, useEffect, useRef, useState } from 'react';

// A real scenario: the SAME routine delete, protected two ways, plus the
// failure mode the entry is really about.
//
//  - Confirm dialog: every delete asks "are you sure?". Delete a few in a row
//    and a habituation counter climbs — the dialog reports that you are now
//    clicking through it without reading. That is the failure: a confirmation
//    used on routine reversible actions trains the reflex that defeats it.
//  - Undo: the delete just happens, a toast offers undo. Frictionless, trusts
//    the user, and genuinely reversible — click undo and the item is back.

type Mode = 'confirm' | 'undo';

const INITIAL = ['Q3 report.pdf', 'budget.xlsx', 'notes.md', 'logo.svg', 'draft.txt'];

export function ConfirmationVsUndoExample() {
  const [mode, setMode] = useState<Mode>('confirm');
  const [items, setItems] = useState<string[]>(INITIAL);
  const [pending, setPending] = useState<string | null>(null); // confirm dialog target
  const [confirmCount, setConfirmCount] = useState(0);
  const [undoItem, setUndoItem] = useState<string | null>(null);
  const [restored, setRestored] = useState(false);
  const toastTimer = useRef<number | null>(null);

  useEffect(
    () => () => {
      if (toastTimer.current) window.clearTimeout(toastTimer.current);
    },
    []
  );

  const reset = (m: Mode) => {
    if (toastTimer.current) window.clearTimeout(toastTimer.current);
    setMode(m);
    setItems(INITIAL);
    setPending(null);
    setConfirmCount(0);
    setUndoItem(null);
    setRestored(false);
  };

  const requestDelete = (name: string) => {
    if (mode === 'confirm') {
      setPending(name);
    } else {
      setItems((xs) => xs.filter((x) => x !== name));
      setUndoItem(name);
      setRestored(false);
      if (toastTimer.current) window.clearTimeout(toastTimer.current);
      toastTimer.current = window.setTimeout(() => setUndoItem(null), 3200);
    }
  };

  const confirmDelete = useCallback(() => {
    setItems((xs) => xs.filter((x) => x !== pending));
    setPending(null);
    setConfirmCount((c) => c + 1);
  }, [pending]);

  const undo = () => {
    if (!undoItem) return;
    if (toastTimer.current) window.clearTimeout(toastTimer.current);
    setItems((xs) => (xs.includes(undoItem) ? xs : [undoItem, ...xs]));
    setRestored(true);
    setUndoItem(null);
  };

  const trained = confirmCount >= 3;

  return (
    <div className="upl-ex" data-testid="ex-confirmation-vs-undo">
      <style>{`
        .upl-ex-cu__bar {
          display: flex; align-items: center; gap: var(--space-3);
          margin-bottom: var(--space-4); flex-wrap: wrap;
        }
        .upl-ex-cu__seg { display: inline-flex; border: 1px solid var(--border-strong); border-radius: var(--radius-md); overflow: hidden; }
        .upl-ex-cu__seg button {
          font-family: var(--font-mono); font-size: 11px; padding: 6px 11px;
          border: none; background: var(--surface); color: var(--text-muted); cursor: pointer;
        }
        .upl-ex-cu__seg button[data-on="true"] { background: var(--accent-soft); color: var(--accent); }
        .upl-ex-cu__seg button + button { border-left: 1px solid var(--border-strong); }
        .upl-ex-cu__stage {
          position: relative; overflow: hidden;
          border: 1px solid var(--border); border-radius: var(--radius-md);
          background: var(--surface-muted); padding: var(--space-3); min-height: 224px;
        }
        .upl-ex-cu__item {
          display: flex; align-items: center; justify-content: space-between;
          gap: var(--space-3); padding: 10px 13px; background: var(--surface);
          border: 1px solid var(--border); border-radius: var(--radius-sm);
          margin-bottom: 6px; font-family: var(--font-mono); font-size: var(--text-sm); color: var(--text);
        }
        .upl-ex-cu__item:last-child { margin-bottom: 0; }
        .upl-ex-cu__del {
          font-family: var(--font-mono); font-size: 11px; padding: 5px 10px;
          border-radius: var(--radius-sm); border: 1px solid color-mix(in srgb, #dc2626 45%, var(--border-strong));
          background: var(--surface); color: #dc2626; cursor: pointer;
        }
        .upl-ex-cu__del:hover { background: color-mix(in srgb, #dc2626 9%, transparent); border-color: #dc2626; }
        .upl-ex-cu__empty { font-family: var(--font-mono); font-size: 12px; color: var(--text-faint); padding: var(--space-4); text-align: center; }
        .upl-ex-cu__scrim {
          position: absolute; inset: 0; background: color-mix(in srgb, #000 40%, transparent);
          display: flex; align-items: center; justify-content: center; padding: var(--space-4); z-index: 4;
        }
        .upl-ex-cu__dialog {
          background: var(--surface); border: 1px solid var(--border-strong);
          border-radius: var(--radius-lg); padding: var(--space-5); max-width: 320px; width: 100%;
          display: flex; flex-direction: column; gap: var(--space-3);
          box-shadow: 0 16px 40px color-mix(in srgb, #000 28%, transparent);
        }
        .upl-ex-cu__dialog h4 { font-size: var(--text-md); font-weight: 600; color: var(--text); }
        .upl-ex-cu__dialog p { font-size: var(--text-sm); color: var(--text-muted); line-height: 1.5; }
        .upl-ex-cu__dialog[data-trained="true"] p::after {
          content: ' (you are not reading this any more)';
          color: #dc2626;
        }
        .upl-ex-cu__actions { display: flex; justify-content: flex-end; gap: var(--space-2); margin-top: var(--space-2); }
        .upl-ex-cu__btn {
          font-family: var(--font-mono); font-size: 11px; padding: 6px 12px;
          border-radius: var(--radius-sm); border: 1px solid var(--border-strong);
          background: var(--surface); color: var(--text); cursor: pointer;
        }
        .upl-ex-cu__btn--danger { border-color: #dc2626; color: #dc2626; }
        .upl-ex-cu__toast {
          position: absolute; left: 50%; bottom: var(--space-4);
          transform: translate(-50%, 160%);
          display: flex; align-items: center; gap: 12px;
          background: var(--text); color: var(--surface); font-size: var(--text-sm);
          padding: 9px 14px; border-radius: var(--radius-pill);
          box-shadow: 0 8px 24px color-mix(in srgb, #000 24%, transparent);
          transition: transform 320ms var(--ease-out); z-index: 4;
        }
        .upl-ex-cu__toast[data-up="true"] { transform: translate(-50%, 0); }
        .upl-ex-cu__toast button {
          font-family: var(--font-mono); font-size: 11px; padding: 3px 10px;
          border-radius: var(--radius-sm); border: 1px solid color-mix(in srgb, var(--surface) 45%, transparent);
          background: transparent; color: var(--surface); cursor: pointer;
        }
        .upl-ex-cu__note {
          margin-top: var(--space-3); font-size: var(--text-sm); line-height: 1.55;
          color: var(--text-muted); padding: var(--space-3);
          border-left: 2px solid var(--accent); background: var(--accent-soft);
          border-radius: var(--radius-sm);
        }
        .upl-ex-cu__note[data-kind="bad"] { border-left-color: #dc2626; }
        .upl-ex-cu__note b { color: var(--text); }
      `}</style>

      <div className="upl-ex-cu__bar">
        <div className="upl-ex-cu__seg" role="group" aria-label="Mistake protection">
          <button type="button" data-on={mode === 'confirm'} onClick={() => reset('confirm')} data-testid="ex-cu-mode-confirm">confirm dialog</button>
          <button type="button" data-on={mode === 'undo'} onClick={() => reset('undo')} data-testid="ex-cu-mode-undo">undo</button>
        </div>
        {mode === 'confirm' && (
          <span className="upl-ex-cu__note" style={{ margin: 0, padding: '4px 10px' }} data-testid="ex-cu-count">
            confirmed {confirmCount}×
          </span>
        )}
      </div>

      <div className="upl-ex-cu__stage">
        {items.length === 0 ? (
          <p className="upl-ex-cu__empty" data-testid="ex-cu-empty">all files deleted</p>
        ) : (
          items.map((name) => (
            <div className="upl-ex-cu__item" key={name} data-testid={`ex-cu-item-${name}`}>
              <span>{name}</span>
              <button
                type="button"
                className="upl-ex-cu__del"
                onClick={() => requestDelete(name)}
                data-testid={`ex-cu-del-${name}`}
              >
                delete
              </button>
            </div>
          ))
        )}

        {pending && (
          <div className="upl-ex-cu__scrim" data-testid="ex-cu-scrim" onClick={() => setPending(null)}>
            <div
              className="upl-ex-cu__dialog"
              data-trained={trained}
              role="dialog"
              aria-modal="true"
              aria-label="Confirm delete"
              onClick={(e) => e.stopPropagation()}
              data-testid="ex-cu-dialog"
            >
              <h4>Delete “{pending}”?</h4>
              <p>This is a routine, reversible delete. You are being asked anyway.</p>
              <div className="upl-ex-cu__actions">
                <button type="button" className="upl-ex-cu__btn" onClick={() => setPending(null)} data-testid="ex-cu-cancel">cancel</button>
                <button type="button" className="upl-ex-cu__btn upl-ex-cu__btn--danger" onClick={confirmDelete} data-testid="ex-cu-confirm">delete</button>
              </div>
            </div>
          </div>
        )}

        <div className="upl-ex-cu__toast" data-up={!!undoItem} data-testid="ex-cu-toast" aria-hidden={!undoItem}>
          <span>Deleted “{undoItem}”</span>
          <button type="button" onClick={undo} data-testid="ex-cu-undo">undo</button>
        </div>
      </div>

      <p
        className="upl-ex-cu__note"
        data-kind={mode === 'confirm' && trained ? 'bad' : undefined}
        data-testid="ex-cu-note"
      >
        {mode === 'confirm' ? (
          trained ? (
            <span data-testid="ex-cu-habit">
              <b>This is the failure mode.</b> Three routine confirms in and you
              click “delete” without reading the dialog. A confirmation on
              reversible actions trains the reflex that defeats it — it now
              protects nothing.
            </span>
          ) : (
            'A confirmation on every routine delete. Friction now, every time. Delete a few in a row and watch what the habit does to it.'
          )
        ) : restored ? (
          'Undone — the file is back. The action was frictionless and still fully recoverable. For reversible actions this beats a dialog.'
        ) : (
          'The delete just happens; a toast offers undo. No friction, the user is trusted, and the mistake is one click from being fixed. Reserve the dialog for the truly irreversible.'
        )}
      </p>
    </div>
  );
}
