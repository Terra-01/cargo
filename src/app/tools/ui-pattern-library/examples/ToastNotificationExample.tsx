'use client';
import { useCallback, useEffect, useRef, useState } from 'react';

// A real scenario in two halves:
//
//  A. Copy link → a "Copied" toast. Low-stakes, nothing to act on, self-
//     dismisses. The toast doing its job.
//  B. Delete item → an "Undo" affordance, the SAME actionable message shown
//     two ways. As a toast it vanishes on a timer: blink and the undo window
//     is gone, the item is lost. As an inline banner it stays until you act.
//     The toggle lets you actually miss the undo and feel it.

type Mode = 'toast' | 'banner';

const TOAST_MS = 2600;

export function ToastNotificationExample() {
  const [copied, setCopied] = useState(false);
  const [mode, setMode] = useState<Mode>('toast');
  const [deleted, setDeleted] = useState(false);
  const [undoToastUp, setUndoToastUp] = useState(false);
  const [outcome, setOutcome] = useState<'idle' | 'restored' | 'missed'>('idle');
  const copyTimer = useRef<number | null>(null);
  const toastTimer = useRef<number | null>(null);

  useEffect(
    () => () => {
      if (copyTimer.current) window.clearTimeout(copyTimer.current);
      if (toastTimer.current) window.clearTimeout(toastTimer.current);
    },
    []
  );

  const onCopy = useCallback(() => {
    setCopied(false);
    window.setTimeout(() => setCopied(true), 20);
    if (copyTimer.current) window.clearTimeout(copyTimer.current);
    copyTimer.current = window.setTimeout(() => setCopied(false), TOAST_MS);
  }, []);

  const onDelete = useCallback(() => {
    setDeleted(true);
    setOutcome('idle');
    if (mode === 'toast') {
      setUndoToastUp(true);
      if (toastTimer.current) window.clearTimeout(toastTimer.current);
      // The undo lives only as long as the toast does. Miss it and it is gone.
      toastTimer.current = window.setTimeout(() => {
        setUndoToastUp(false);
        setOutcome('missed');
      }, TOAST_MS);
    }
  }, [mode]);

  const onUndo = useCallback(() => {
    if (toastTimer.current) window.clearTimeout(toastTimer.current);
    setUndoToastUp(false);
    setDeleted(false);
    setOutcome('restored');
  }, []);

  const resetDelete = useCallback(() => {
    if (toastTimer.current) window.clearTimeout(toastTimer.current);
    setDeleted(false);
    setUndoToastUp(false);
    setOutcome('idle');
  }, []);

  return (
    <div className="upl-ex" data-testid="ex-toast-notification">
      <style>{`
        .upl-ex-tn__stage {
          position: relative;
          overflow: hidden;
          border-radius: var(--radius-md);
          background: var(--surface-muted);
          border: 1px solid var(--border);
          padding: var(--space-5);
          min-height: 240px;
          display: flex;
          flex-direction: column;
          gap: var(--space-4);
        }
        .upl-ex-tn__row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: var(--space-3);
          padding: var(--space-3) var(--space-4);
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: var(--radius-md);
        }
        .upl-ex-tn__label b {
          display: block;
          font-size: var(--text-sm);
          font-weight: 600;
          color: var(--text);
        }
        .upl-ex-tn__label span {
          font-family: var(--font-mono);
          font-size: 11px;
          color: var(--text-faint);
        }
        .upl-ex-tn__btn {
          font-family: var(--font-mono);
          font-size: var(--text-xs);
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-height: 44px;
          padding: 7px 14px;
          border-radius: var(--radius-md);
          border: 1px solid var(--border-strong);
          background: var(--surface);
          color: var(--text);
          cursor: pointer;
          white-space: nowrap;
          transition: border-color var(--t-fast) var(--ease);
        }
        .upl-ex-tn__btn:hover { border-color: var(--accent); }
        .upl-ex-tn__btn--danger { color: #dc2626; border-color: color-mix(in srgb, #dc2626 50%, var(--border-strong)); }
        .upl-ex-tn__btn--danger:hover { border-color: #dc2626; background: color-mix(in srgb, #dc2626 9%, transparent); }
        .upl-ex-tn__seg {
          display: inline-flex;
          border: 1px solid var(--border-strong);
          border-radius: var(--radius-md);
          overflow: hidden;
        }
        .upl-ex-tn__seg button {
          font-family: var(--font-mono);
          font-size: 11px;
          min-height: 44px;
          padding: 6px 14px;
          border: none;
          background: var(--surface);
          color: var(--text-muted);
          cursor: pointer;
        }
        .upl-ex-tn__seg button[data-on="true"] { background: var(--accent-soft); color: var(--accent); }
        .upl-ex-tn__seg button + button { border-left: 1px solid var(--border-strong); }
        .upl-ex-tn__banner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: var(--space-3);
          padding: 10px 14px;
          border-radius: var(--radius-md);
          border: 1px solid var(--accent);
          background: var(--accent-soft);
          color: var(--text);
          font-size: var(--text-sm);
        }
        .upl-ex-tn__outcome {
          font-family: var(--font-mono);
          font-size: 11px;
        }
        .upl-ex-tn__outcome[data-kind="restored"] { color: #16a34a; }
        .upl-ex-tn__outcome[data-kind="missed"]   { color: #dc2626; }
        .upl-ex-tn__toast {
          position: absolute;
          left: 50%;
          bottom: var(--space-4);
          transform: translate(-50%, 150%);
          display: flex;
          align-items: center;
          gap: 10px;
          background: var(--text);
          color: var(--surface);
          font-size: var(--text-sm);
          padding: 9px 14px;
          border-radius: var(--radius-pill);
          box-shadow: 0 8px 24px color-mix(in srgb, #000 24%, transparent);
          transition: transform 340ms var(--ease-out);
          z-index: 4;
        }
        .upl-ex-tn__toast[data-up="true"] { transform: translate(-50%, 0); }
        .upl-ex-tn__toast button {
          font-family: var(--font-mono);
          font-size: 11px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-height: 44px;
          padding: 3px 14px;
          border-radius: var(--radius-sm);
          border: 1px solid color-mix(in srgb, var(--surface) 45%, transparent);
          background: transparent;
          color: var(--surface);
          cursor: pointer;
        }
        .upl-ex-tn__toast--plain { pointer-events: none; }
        .upl-ex-tn__toast--plain::before {
          content: '';
          width: 7px; height: 7px; border-radius: 50%; background: #22c55e;
        }
        .upl-ex-tn__controls {
          display: flex;
          gap: var(--space-2);
          align-items: center;
        }
        .upl-ex-tn__label { min-width: 0; }
        .upl-ex-tn__label b,
        .upl-ex-tn__label span,
        .upl-ex-tn__banner span,
        .upl-ex-tn__outcome { overflow-wrap: anywhere; }
        /* Mobile: each settings row stacks and the seg+delete group wraps,
           so the long "inline banner" label is never clipped by the
           segment's overflow:hidden. */
        @media (max-width: 599px) {
          .upl-ex-tn__row {
            flex-direction: column;
            align-items: stretch;
            gap: var(--space-3);
          }
          .upl-ex-tn__controls { flex-wrap: wrap; }
          .upl-ex-tn__seg { flex: 1 1 auto; }
          .upl-ex-tn__seg button { flex: 1 1 auto; padding: 6px 10px; }
        }
      `}</style>

      <div className="upl-ex-tn__stage">
        <div className="upl-ex-tn__row">
          <div className="upl-ex-tn__label">
            <b>Share link</b>
            <span>low-stakes · nothing to act on</span>
          </div>
          <button
            type="button"
            className="upl-ex-tn__btn"
            onClick={onCopy}
            data-testid="ex-toast-copy"
          >
            copy link
          </button>
        </div>

        <div className="upl-ex-tn__row">
          <div className="upl-ex-tn__label">
            <b>Delete item</b>
            <span>action-required · undo matters</span>
          </div>
          <div className="upl-ex-tn__controls">
            <div className="upl-ex-tn__seg" role="group" aria-label="Undo affordance">
              <button
                type="button"
                data-on={mode === 'toast'}
                onClick={() => { setMode('toast'); resetDelete(); }}
                data-testid="ex-toast-mode-toast"
              >
                toast
              </button>
              <button
                type="button"
                data-on={mode === 'banner'}
                onClick={() => { setMode('banner'); resetDelete(); }}
                data-testid="ex-toast-mode-banner"
              >
                inline banner
              </button>
            </div>
            <button
              type="button"
              className="upl-ex-tn__btn upl-ex-tn__btn--danger"
              onClick={onDelete}
              disabled={deleted}
              data-testid="ex-toast-delete"
            >
              delete
            </button>
          </div>
        </div>

        {mode === 'banner' && deleted && (
          <div className="upl-ex-tn__banner" data-testid="ex-toast-banner">
            <span>Item deleted. This banner stays until you decide.</span>
            <button
              type="button"
              className="upl-ex-tn__btn"
              onClick={onUndo}
              data-testid="ex-toast-undo-banner"
            >
              undo
            </button>
          </div>
        )}

        {outcome !== 'idle' && (
          <p className="upl-ex-tn__outcome" data-kind={outcome} data-testid="ex-toast-outcome">
            {outcome === 'restored'
              ? 'item restored — you caught the undo in time'
              : 'the toast vanished before you acted — the item is gone, undo missed'}
          </p>
        )}

        <div
          className="upl-ex-tn__toast upl-ex-tn__toast--plain"
          data-up={copied}
          data-testid="ex-toast-copied"
          aria-hidden={!copied}
        >
          Link copied
        </div>

        <div
          className="upl-ex-tn__toast"
          data-up={undoToastUp}
          data-testid="ex-toast-undo-toast"
          aria-hidden={!undoToastUp}
        >
          <span>Item deleted</span>
          <button type="button" onClick={onUndo} data-testid="ex-toast-undo-toast-btn">
            undo
          </button>
        </div>
      </div>
    </div>
  );
}
