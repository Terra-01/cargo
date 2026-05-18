'use client';
import { useCallback, useEffect, useState } from 'react';

// A real scenario, two halves of one mock "project settings" panel:
//
//  1. Delete project  → a modal done RIGHT. A destructive, irreversible
//     decision that genuinely must be resolved before anything else. It blocks
//     on purpose.
//  2. Save settings    → the SAME transient "it worked" message shown two ways.
//     As a modal (WRONG: it traps you in a dialog to say everything is fine)
//     versus as a toast (RIGHT: it informs without blocking). The toggle lets
//     you feel why one belongs in a modal and the other does not.

type FeedbackMode = 'modal' | 'toast';

export function ModalDialogExample() {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [savedModalOpen, setSavedModalOpen] = useState(false);
  const [toastUp, setToastUp] = useState(false);
  const [feedback, setFeedback] = useState<FeedbackMode>('modal');
  const [status, setStatus] = useState<'idle' | 'deleted'>('idle');

  const anyModalOpen = confirmOpen || savedModalOpen;

  // Escape closes whichever modal is open — table stakes for the pattern.
  useEffect(() => {
    if (!anyModalOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setConfirmOpen(false);
        setSavedModalOpen(false);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [anyModalOpen]);

  const confirmDelete = useCallback(() => {
    setConfirmOpen(false);
    setStatus('deleted');
    window.setTimeout(() => setStatus('idle'), 2400);
  }, []);

  const onSave = useCallback(() => {
    if (feedback === 'modal') {
      setSavedModalOpen(true);
    } else {
      setToastUp(false);
      // re-arm so repeated saves re-trigger the slide-in
      window.setTimeout(() => setToastUp(true), 20);
      window.setTimeout(() => setToastUp(false), 2800);
    }
  }, [feedback]);

  return (
    <div className="upl-ex" data-testid="ex-modal-dialog">
      <style>{`
        .upl-ex-modal__stage {
          position: relative;
          overflow: hidden;
          border-radius: var(--radius-md);
          background: var(--surface-muted);
          border: 1px solid var(--border);
          padding: var(--space-5);
          min-height: 248px;
        }
        .upl-ex-modal__panel {
          display: flex;
          flex-direction: column;
          gap: var(--space-4);
        }
        .upl-ex-modal__row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: var(--space-3);
          padding: var(--space-3) var(--space-4);
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: var(--radius-md);
        }
        .upl-ex-modal__label {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        .upl-ex-modal__label b {
          font-size: var(--text-sm);
          font-weight: 600;
          color: var(--text);
        }
        .upl-ex-modal__label span {
          font-family: var(--font-mono);
          font-size: 11px;
          color: var(--text-faint);
        }
        .upl-ex-btn {
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
          transition: border-color var(--t-fast) var(--ease), background var(--t-fast) var(--ease);
          white-space: nowrap;
        }
        .upl-ex-btn:hover { border-color: var(--accent); }
        .upl-ex-btn--danger {
          border-color: color-mix(in srgb, #dc2626 55%, var(--border-strong));
          color: #dc2626;
        }
        .upl-ex-btn--danger:hover {
          background: color-mix(in srgb, #dc2626 10%, transparent);
          border-color: #dc2626;
        }
        .upl-ex-btn--primary {
          background: var(--accent);
          border-color: var(--accent);
          color: #fff;
        }
        .upl-ex-btn--primary:hover { background: var(--accent-hover); border-color: var(--accent-hover); }
        .upl-ex-seg {
          display: inline-flex;
          border: 1px solid var(--border-strong);
          border-radius: var(--radius-md);
          overflow: hidden;
        }
        .upl-ex-seg button {
          font-family: var(--font-mono);
          font-size: 11px;
          min-height: 44px;
          padding: 6px 14px;
          border: none;
          background: var(--surface);
          color: var(--text-muted);
          cursor: pointer;
        }
        .upl-ex-seg button[data-on="true"] {
          background: var(--accent-soft);
          color: var(--accent);
        }
        .upl-ex-seg button + button { border-left: 1px solid var(--border-strong); }

        .upl-ex-modal__scrim {
          position: absolute;
          inset: 0;
          background: color-mix(in srgb, #000 42%, transparent);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: var(--space-5);
          animation: upl-ex-fade var(--t-fast) var(--ease);
          z-index: 3;
        }
        .upl-ex-modal__dialog {
          background: var(--surface);
          border: 1px solid var(--border-strong);
          border-radius: var(--radius-lg);
          padding: var(--space-5);
          max-width: 340px;
          width: 100%;
          box-shadow: 0 16px 40px color-mix(in srgb, #000 28%, transparent);
          display: flex;
          flex-direction: column;
          gap: var(--space-3);
          animation: upl-ex-pop 160ms var(--ease-out);
        }
        .upl-ex-modal__dialog h4 {
          font-size: var(--text-md);
          font-weight: 600;
          color: var(--text);
        }
        .upl-ex-modal__dialog p {
          font-size: var(--text-sm);
          color: var(--text-muted);
          line-height: 1.55;
        }
        .upl-ex-modal__actions {
          display: flex;
          justify-content: flex-end;
          gap: var(--space-2);
          margin-top: var(--space-2);
        }
        .upl-ex-modal__toast {
          position: absolute;
          left: 50%;
          bottom: var(--space-4);
          transform: translate(-50%, 140%);
          background: var(--text);
          color: var(--surface);
          font-size: var(--text-sm);
          padding: 10px 16px;
          border-radius: var(--radius-pill);
          display: flex;
          align-items: center;
          gap: 8px;
          box-shadow: 0 8px 24px color-mix(in srgb, #000 24%, transparent);
          transition: transform 360ms var(--ease-out);
          z-index: 3;
          pointer-events: none;
        }
        .upl-ex-modal__toast[data-up="true"] { transform: translate(-50%, 0); }
        .upl-ex-modal__toast::before {
          content: '';
          width: 7px; height: 7px; border-radius: 50%;
          background: #22c55e;
        }
        .upl-ex-modal__deleted {
          font-family: var(--font-mono);
          font-size: 11px;
          color: #16a34a;
        }
        @keyframes upl-ex-fade { from { opacity: 0; } to { opacity: 1; } }
        @keyframes upl-ex-pop {
          from { opacity: 0; transform: translateY(6px) scale(0.98); }
          to   { opacity: 1; transform: none; }
        }
        .upl-ex-modal__label { min-width: 0; }
        .upl-ex-modal__label b,
        .upl-ex-modal__dialog p { overflow-wrap: anywhere; }
        .upl-ex-modal__controls {
          display: flex;
          gap: var(--space-2);
          align-items: center;
        }
        /* Mobile: the settings rows stack so the label and its controls
           fit a phone, the seg+save group wraps instead of clipping the
           "toast" label, and the modal scrim hugs the small stage so the
           dialog is not crushed by padding. */
        @media (max-width: 599px) {
          .upl-ex-modal__row {
            flex-direction: column;
            align-items: stretch;
            gap: var(--space-3);
          }
          .upl-ex-modal__controls { flex-wrap: wrap; }
          .upl-ex-seg { flex: 1 1 auto; }
          .upl-ex-seg button { flex: 1 1 auto; padding: 6px 10px; }
          .upl-ex-modal__scrim { padding: var(--space-3); }
        }
      `}</style>

      <div className="upl-ex-modal__stage">
        <div className="upl-ex-modal__panel" inert={anyModalOpen}>
          <div className="upl-ex-modal__row">
            <div className="upl-ex-modal__label">
              <b>Delete project</b>
              <span>
                {status === 'deleted'
                  ? 'destructive · resolved'
                  : 'destructive · irreversible'}
              </span>
            </div>
            {status === 'deleted' ? (
              <span className="upl-ex-modal__deleted" data-testid="ex-modal-deleted">
                project deleted
              </span>
            ) : (
              <button
                type="button"
                className="upl-ex-btn upl-ex-btn--danger"
                onClick={() => setConfirmOpen(true)}
                data-testid="ex-modal-delete-trigger"
              >
                delete project
              </button>
            )}
          </div>

          <div className="upl-ex-modal__row">
            <div className="upl-ex-modal__label">
              <b>Save settings</b>
              <span>transient confirmation</span>
            </div>
            <div className="upl-ex-modal__controls">
              <div className="upl-ex-seg" role="group" aria-label="Feedback style">
                <button
                  type="button"
                  data-on={feedback === 'modal'}
                  onClick={() => setFeedback('modal')}
                  data-testid="ex-modal-fb-modal"
                >
                  modal
                </button>
                <button
                  type="button"
                  data-on={feedback === 'toast'}
                  onClick={() => setFeedback('toast')}
                  data-testid="ex-modal-fb-toast"
                >
                  toast
                </button>
              </div>
              <button
                type="button"
                className="upl-ex-btn upl-ex-btn--primary"
                onClick={onSave}
                data-testid="ex-modal-save-trigger"
              >
                save
              </button>
            </div>
          </div>
        </div>

        {confirmOpen && (
          <div
            className="upl-ex-modal__scrim"
            onClick={() => setConfirmOpen(false)}
            data-testid="ex-modal-confirm-scrim"
          >
            <div
              className="upl-ex-modal__dialog"
              role="dialog"
              aria-modal="true"
              aria-label="Confirm delete project"
              onClick={(e) => e.stopPropagation()}
              data-testid="ex-modal-confirm-dialog"
            >
              <h4>Delete this project?</h4>
              <p>
                This permanently removes the project and everything in it. This
                cannot be undone.
              </p>
              <div className="upl-ex-modal__actions">
                <button
                  type="button"
                  className="upl-ex-btn"
                  onClick={() => setConfirmOpen(false)}
                  data-testid="ex-modal-confirm-cancel"
                >
                  cancel
                </button>
                <button
                  type="button"
                  className="upl-ex-btn upl-ex-btn--danger"
                  onClick={confirmDelete}
                  data-testid="ex-modal-confirm-delete"
                >
                  delete
                </button>
              </div>
            </div>
          </div>
        )}

        {savedModalOpen && (
          <div
            className="upl-ex-modal__scrim"
            onClick={() => setSavedModalOpen(false)}
            data-testid="ex-modal-saved-scrim"
          >
            <div
              className="upl-ex-modal__dialog"
              role="dialog"
              aria-modal="true"
              aria-label="Settings saved"
              onClick={(e) => e.stopPropagation()}
              data-testid="ex-modal-saved-dialog"
            >
              <h4>Settings saved</h4>
              <p>
                Nothing went wrong, yet you cannot do anything else until you
                dismiss this. That is a transient message trapped in a modal.
              </p>
              <div className="upl-ex-modal__actions">
                <button
                  type="button"
                  className="upl-ex-btn upl-ex-btn--primary"
                  onClick={() => setSavedModalOpen(false)}
                  data-testid="ex-modal-saved-ok"
                >
                  ok
                </button>
              </div>
            </div>
          </div>
        )}

        <div
          className="upl-ex-modal__toast"
          data-up={toastUp}
          data-testid="ex-modal-toast"
          aria-hidden={!toastUp}
        >
          Settings saved
        </div>
      </div>
    </div>
  );
}
