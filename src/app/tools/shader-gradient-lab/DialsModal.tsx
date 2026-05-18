'use client';
import { useEffect } from 'react';

interface Props {
  onClose: () => void;
  children: React.ReactNode;
}

// A semi-transparent glass modal that sits OVER the live gradient (inside the
// stage). The backdrop is transparent so the canvas stays fully visible and
// reacts as dials are dragged — Neat's pattern, not an opaque takeover.
export function DialsModal({ onClose, children }: Props) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div
      className="sg-modal-backdrop"
      data-testid="sg-dials-backdrop"
      onMouseDown={(e) => {
        // click-outside: only when the backdrop itself is pressed
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="sg-modal"
        data-testid="sg-dials-modal"
        role="dialog"
        aria-label="Shader dials"
      >
        <div className="sg-modal__head">
          <p className="sg-modal__title">{'// dials'}</p>
          <button
            type="button"
            className="sg-modal__close"
            data-testid="sg-dials-close"
            aria-label="Close dials"
            onClick={onClose}
          >
            ✕
          </button>
        </div>
        <div className="sg-modal__body">{children}</div>
      </div>
    </div>
  );
}
