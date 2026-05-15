'use client';
import { useState, useMemo } from 'react';
import {
  textAnimations,
  getFullSnippet,
} from '@/lib/text-animations';
import { TextAnimationCard } from './TextAnimationCard';
import { PickerTray } from './PickerTray';

export function TextAnimationLibrary() {
  const [search, setSearch] = useState('');
  const [picked, setPicked] = useState<Set<string>>(new Set());

  const togglePick = (id: string) => {
    setPicked((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const clearPicks = () => setPicked(new Set());

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return textAnimations;
    return textAnimations.filter(
      (a) =>
        a.name.toLowerCase().includes(q) ||
        a.id.toLowerCase().includes(q) ||
        a.category.toLowerCase().includes(q)
    );
  }, [search]);

  // Inject every animation's @keyframes + .ta-{id} class once via a single <style> block
  // so each card can apply its animation via the `.ta-{id}` class with no per-card styling.
  const allAnimationsCss = useMemo(() => {
    return textAnimations
      .map((a) => getFullSnippet(a))
      .join('\n\n');
  }, []);

  return (
    <>
      <style>{`
        .ta-toolbar {
          display: flex;
          align-items: center;
          gap: var(--space-3);
          margin-bottom: var(--space-5);
        }
        .ta-search {
          flex: 1;
          max-width: 320px;
        }
        .ta-search input {
          width: 100%;
          padding: 8px 12px;
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: var(--radius-md);
          font-family: var(--font-mono);
          font-size: var(--text-xs);
          color: var(--text);
          transition: border-color var(--t-fast) var(--ease);
        }
        .ta-search input:focus {
          outline: none;
          border-color: var(--accent);
        }
        .ta-result-count {
          font-family: var(--font-mono);
          font-size: var(--text-xs);
          color: var(--text-faint);
          letter-spacing: 0.04em;
        }
        .ta-card {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: var(--radius-lg);
          padding: var(--space-4);
          cursor: pointer;
          display: flex;
          flex-direction: column;
          gap: var(--space-3);
          text-align: left;
          font-family: inherit;
          color: inherit;
          transition: border-color var(--t-fast) var(--ease), transform var(--t-fast) var(--ease);
          position: relative;
          overflow: hidden;
        }
        .ta-card:hover { border-color: var(--border-strong); }
        .ta-card:focus-visible {
          outline: none;
          border-color: var(--accent);
          box-shadow: 0 0 0 3px var(--accent-soft);
        }
        .ta-card[data-picked="true"] {
          border-color: var(--accent);
        }
        .ta-card[data-picked="true"]::before {
          content: '';
          position: absolute;
          top: 8px;
          right: 8px;
          width: 8px;
          height: 8px;
          background: var(--accent);
          border-radius: 50%;
          z-index: 2;
        }
        .ta-card__head {
          display: flex;
          align-items: baseline;
          justify-content: space-between;
          gap: var(--space-2);
        }
        .ta-card__name {
          font-family: var(--font-mono);
          font-size: 12px;
          letter-spacing: 0.01em;
          color: var(--text);
        }
        .ta-card__category {
          font-family: var(--font-mono);
          font-size: 10px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--text-faint);
        }
        .ta-card__preview {
          background: var(--surface-muted);
          border-radius: var(--radius-md);
          height: 96px;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          position: relative;
          perspective: 1000px;
        }
        .ta-card__preview-text {
          font-family: var(--font-sans);
          font-size: 17px;
          font-weight: 500;
          color: var(--text);
          letter-spacing: -0.01em;
          padding: 14px 18px;
          text-align: center;
          display: inline-block;
        }
        .ta-card__preview-text[data-split="line"] {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2px;
        }
        .ta-card__preview-text[data-split="line"] > span {
          display: block;
        }
        .ta-card__badges {
          display: inline-flex;
          gap: 6px;
          margin-left: 6px;
        }
        .ta-card__badge {
          display: inline-block;
          padding: 1px 5px;
          background: var(--accent-soft);
          color: var(--accent);
          font-family: var(--font-mono);
          font-size: 9px;
          font-weight: 500;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          border-radius: var(--radius-sm);
          line-height: 1.4;
        }
        .ta-card__footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: var(--space-2);
          font-family: var(--font-mono);
          font-size: 10px;
          color: var(--text-faint);
          letter-spacing: 0.04em;
          text-transform: uppercase;
        }
        .ta-card__pick-hint {
          color: var(--text-muted);
        }
        .ta-card[data-picked="true"] .ta-card__pick-hint {
          color: var(--accent);
        }
        /* Inject every animation's @keyframes + .ta-{id} class */
        ${allAnimationsCss}
      `}</style>
      <div className="ta-toolbar">
        <div className="ta-search">
          <input
            type="text"
            placeholder="filter by name or category…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            data-testid="ta-search-input"
            aria-label="Filter animations"
          />
        </div>
        <span className="ta-result-count" data-testid="ta-result-count">
          {filtered.length} / {textAnimations.length}
        </span>
      </div>
      <div className="catalog" data-testid="ta-catalog">
        {filtered.map((animation) => (
          <TextAnimationCard
            key={animation.id}
            animation={animation}
            picked={picked.has(animation.id)}
            onTogglePick={togglePick}
          />
        ))}
      </div>
      <PickerTray
        pickedIds={picked}
        onRemove={togglePick}
        onClear={clearPicks}
      />
    </>
  );
}
