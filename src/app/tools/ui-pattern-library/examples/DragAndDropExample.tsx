'use client';
import { useCallback, useEffect, useRef, useState } from 'react';

// A real scenario built on the genuine tension: drag as the ONLY way vs drag
// PLUS a visible fallback. The drag is a real pointer-events interaction (not
// the flaky HTML5 DnD API) and works the same in both modes — so the lesson is
// purely the fallback's presence. Drag-only has no grip, no buttons, default
// cursor: nothing says it can move and there is no other path. Drag-plus has
// the same drag, a grip hint, and up/down controls, so the action is reachable
// without dragging at all.
//
// Reorder strategy: every row sorts by its vertical centre, except the dragged
// row which sorts by the live pointer Y. Stable and deterministic under
// automated input on Chromium and Firefox alike.

type Mode = 'dragonly' | 'fallback';

const INITIAL = [
  { id: 'alpha', label: 'Inbox' },
  { id: 'beta', label: 'Drafts' },
  { id: 'gamma', label: 'Sent' },
  { id: 'delta', label: 'Archive' },
];

export function DragAndDropExample() {
  const [mode, setMode] = useState<Mode>('dragonly');
  const [order, setOrder] = useState(INITIAL);
  const [dragId, setDragId] = useState<string | null>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const dragIdRef = useRef<string | null>(null);

  const ids = order.map((o) => o.id);

  const resequence = useCallback((pointerY: number) => {
    const held = dragIdRef.current;
    const list = listRef.current;
    if (!held || !list) return;
    const rows = Array.from(
      list.querySelectorAll<HTMLElement>('[data-dnd-row]')
    );
    const yOf = new Map<string, number>();
    for (const row of rows) {
      const id = row.dataset.id!;
      const r = row.getBoundingClientRect();
      yOf.set(id, id === held ? pointerY : r.top + r.height / 2);
    }
    setOrder((prev) => {
      const next = [...prev].sort(
        (a, b) => (yOf.get(a.id) ?? 0) - (yOf.get(b.id) ?? 0)
      );
      const changed = next.some((it, i) => it.id !== prev[i].id);
      return changed ? next : prev;
    });
  }, []);

  const endDrag = useCallback(() => {
    dragIdRef.current = null;
    setDragId(null);
  }, []);

  useEffect(() => {
    if (!dragId) return;
    document.body.style.userSelect = 'none';
    const onMove = (e: PointerEvent) => {
      e.preventDefault();
      resequence(e.clientY);
    };
    const onUp = () => endDrag();
    window.addEventListener('pointermove', onMove, { passive: false });
    window.addEventListener('pointerup', onUp);
    window.addEventListener('pointercancel', onUp);
    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('pointercancel', onUp);
      document.body.style.userSelect = '';
    };
  }, [dragId, resequence, endDrag]);

  const startDrag = (e: React.PointerEvent, id: string) => {
    if (e.button !== 0) return;
    e.preventDefault();
    dragIdRef.current = id;
    setDragId(id);
  };

  const nudge = (id: string, dir: -1 | 1) => {
    setOrder((prev) => {
      const i = prev.findIndex((o) => o.id === id);
      const j = i + dir;
      if (j < 0 || j >= prev.length) return prev;
      const next = [...prev];
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });
  };

  const switchMode = (m: Mode) => {
    setMode(m);
    setOrder(INITIAL);
    endDrag();
  };

  return (
    <div className="upl-ex" data-testid="ex-drag-and-drop">
      <style>{`
        .upl-ex-dd__seg { display: inline-flex; border: 1px solid var(--border-strong); border-radius: var(--radius-md); overflow: hidden; margin-bottom: var(--space-3); }
        .upl-ex-dd__seg button {
          font-family: var(--font-mono); font-size: 11px; padding: 6px 11px;
          border: none; background: var(--surface); color: var(--text-muted); cursor: pointer;
        }
        .upl-ex-dd__seg button[data-on="true"] { background: var(--accent-soft); color: var(--accent); }
        .upl-ex-dd__seg button + button { border-left: 1px solid var(--border-strong); }
        .upl-ex-dd__list {
          border: 1px solid var(--border); border-radius: var(--radius-md);
          background: var(--surface-muted); padding: var(--space-3);
          display: flex; flex-direction: column; gap: 8px; min-height: 210px;
        }
        .upl-ex-dd__row {
          display: flex; align-items: center; gap: 12px;
          padding: 12px 14px; background: var(--surface);
          border: 1px solid var(--border); border-radius: var(--radius-sm);
          font-family: var(--font-mono); font-size: var(--text-sm); color: var(--text);
          touch-action: none;
        }
        .upl-ex-dd__row[data-dragging="true"] {
          border-color: var(--accent); background: var(--accent-soft);
          box-shadow: 0 6px 18px color-mix(in srgb, #000 18%, transparent);
        }
        .upl-ex-dd__surface {
          flex: 1; display: flex; align-items: center; gap: 12px;
        }
        .upl-ex-dd__row[data-mode="dragonly"] .upl-ex-dd__surface { cursor: default; }
        .upl-ex-dd__row[data-mode="fallback"] .upl-ex-dd__surface { cursor: grab; }
        .upl-ex-dd__row[data-dragging="true"] .upl-ex-dd__surface { cursor: grabbing; }
        .upl-ex-dd__grip { color: var(--text-faint); letter-spacing: -2px; }
        .upl-ex-dd__pos {
          font-size: 10px; color: var(--text-faint); min-width: 16px;
        }
        .upl-ex-dd__ctrls { display: flex; gap: 4px; }
        .upl-ex-dd__ctrls button {
          width: 26px; height: 26px; line-height: 1;
          font-family: var(--font-mono); font-size: 12px;
          border: 1px solid var(--border-strong); border-radius: var(--radius-sm);
          background: var(--surface); color: var(--text); cursor: pointer;
        }
        .upl-ex-dd__ctrls button:hover { border-color: var(--accent); }
        .upl-ex-dd__ctrls button:disabled { opacity: 0.3; cursor: not-allowed; }
        .upl-ex-dd__note {
          margin-top: var(--space-3); font-size: var(--text-sm); line-height: 1.55;
          color: var(--text-muted); padding: var(--space-3);
          border-left: 2px solid var(--accent); background: var(--accent-soft);
          border-radius: var(--radius-sm);
        }
        .upl-ex-dd__note[data-kind="bad"] { border-left-color: #dc2626; }
        .upl-ex-dd__note b { color: var(--text); }
      `}</style>

      <div className="upl-ex-dd__seg" role="group" aria-label="Affordance">
        <button type="button" data-on={mode === 'dragonly'} onClick={() => switchMode('dragonly')} data-testid="ex-dnd-mode-dragonly">drag only (wrong)</button>
        <button type="button" data-on={mode === 'fallback'} onClick={() => switchMode('fallback')} data-testid="ex-dnd-mode-fallback">drag + controls (right)</button>
      </div>

      <div
        className="upl-ex-dd__list"
        ref={listRef}
        data-testid="ex-dnd-list"
        data-order={ids.join(',')}
      >
        {order.map((item, i) => (
          <div
            key={item.id}
            data-dnd-row
            data-id={item.id}
            data-mode={mode}
            data-dragging={dragId === item.id}
            data-pos={i}
            className="upl-ex-dd__row"
            data-testid={`ex-dnd-item-${item.id}`}
          >
            <div
              className="upl-ex-dd__surface"
              onPointerDown={(e) => startDrag(e, item.id)}
              data-testid={`ex-dnd-handle-${item.id}`}
            >
              {mode === 'fallback' && (
                <span className="upl-ex-dd__grip" aria-hidden>⠿</span>
              )}
              <span>{item.label}</span>
            </div>

            {mode === 'fallback' && (
              <div className="upl-ex-dd__ctrls">
                <button
                  type="button"
                  onClick={() => nudge(item.id, -1)}
                  disabled={i === 0}
                  aria-label={`Move ${item.label} up`}
                  data-testid={`ex-dnd-up-${item.id}`}
                >
                  ↑
                </button>
                <button
                  type="button"
                  onClick={() => nudge(item.id, 1)}
                  disabled={i === order.length - 1}
                  aria-label={`Move ${item.label} down`}
                  data-testid={`ex-dnd-down-${item.id}`}
                >
                  ↓
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      <p className="upl-ex-dd__note" data-kind={mode === 'dragonly' ? 'bad' : undefined} data-testid="ex-dnd-note">
        {mode === 'dragonly'
          ? <><b>Drag is the only way.</b> No grip, no buttons, an ordinary cursor: nothing signals these move, and there is no touch or keyboard path. The interaction is invisible and, for many users, impossible.</>
          : <><b>Same drag, plus a visible fallback.</b> A grip hints it is draggable, and the up/down controls perform the exact same reorder without a drag. The fallback is not optional — it is what makes the action reachable.</>}
      </p>
    </div>
  );
}
