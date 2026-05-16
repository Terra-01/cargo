'use client';
import { useState, useMemo } from 'react';
import {
  textAnimations,
  getFullSnippet,
  type AnimationCategory,
} from '@/lib/text-animations';
import { TextAnimationCard } from './TextAnimationCard';
import { PickerTray } from './PickerTray';

// The six AnimationCategory values, plus 'all' (the default — no filter).
// Order is fixed for the control; per-category counts are derived at runtime.
const CATEGORY_FILTERS: Array<AnimationCategory | 'all'> = [
  'all',
  'entrance',
  'loop',
  'stagger',
  'hover',
  'decorative',
  'specialty',
];

export function TextAnimationLibrary() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<AnimationCategory | 'all'>('all');
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

  // Category filter and text search combine — both narrow the result.
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return textAnimations.filter((a) => {
      if (category !== 'all' && a.category !== category) return false;
      if (!q) return true;
      return (
        a.name.toLowerCase().includes(q) ||
        a.id.toLowerCase().includes(q) ||
        a.category.toLowerCase().includes(q)
      );
    });
  }, [search, category]);

  // Per-category counts for the filter labels — derived from the data, not
  // hard-coded, so the control reflects whatever the catalogue actually is.
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: textAnimations.length };
    for (const a of textAnimations) {
      counts[a.category] = (counts[a.category] ?? 0) + 1;
    }
    return counts;
  }, []);

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
          flex-direction: column;
          align-items: stretch;
          gap: var(--space-3);
          margin-bottom: var(--space-5);
        }
        .ta-toolbar__row {
          display: flex;
          align-items: center;
          gap: var(--space-3);
        }
        .ta-categories {
          display: flex;
          flex-wrap: wrap;
          gap: var(--space-2);
        }
        .ta-cat {
          display: inline-flex;
          align-items: baseline;
          gap: 6px;
          padding: 5px 10px;
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: var(--radius-pill);
          font-family: var(--font-mono);
          font-size: var(--text-xs);
          letter-spacing: 0.02em;
          color: var(--text-muted);
          cursor: pointer;
          transition: border-color var(--t-fast) var(--ease), color var(--t-fast) var(--ease), background var(--t-fast) var(--ease);
        }
        .ta-cat:hover {
          border-color: var(--border-strong);
          color: var(--text);
        }
        .ta-cat:focus-visible {
          outline: none;
          border-color: var(--accent);
          box-shadow: 0 0 0 3px var(--accent-soft);
        }
        .ta-cat[data-active="true"] {
          border-color: var(--accent);
          background: var(--accent-soft);
          color: var(--accent);
        }
        .ta-cat__count {
          font-size: 10px;
          opacity: 0.7;
          letter-spacing: 0;
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
        .ta-catalog {
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: var(--space-5);
        }
        @media (max-width: 1100px) {
          .ta-catalog { grid-template-columns: repeat(2, minmax(0, 1fr)); }
        }
        @media (max-width: 620px) {
          .ta-catalog { grid-template-columns: 1fr; }
        }
        .ta-card {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: var(--radius-lg);
          padding: var(--space-5);
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
          align-items: center;
          justify-content: space-between;
          gap: var(--space-2);
        }
        .ta-card__name {
          font-family: var(--font-mono);
          font-size: 15px;
          font-weight: 500;
          letter-spacing: 0.01em;
          color: var(--text);
          min-width: 0;
          overflow-wrap: anywhere;
        }
        .ta-card__preview {
          background: var(--surface-muted);
          border-radius: var(--radius-md);
          height: 200px;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          position: relative;
          perspective: 1000px;
        }
        .ta-card__preview-text {
          font-family: var(--font-sans);
          font-size: 26px;
          font-weight: 500;
          color: var(--text);
          letter-spacing: -0.01em;
          padding: 16px 20px;
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
        .ta-card__id {
          text-transform: none;
          letter-spacing: 0.02em;
          color: var(--text-faint);
          opacity: 0.7;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          min-width: 0;
        }
        .ta-card__pick-hint {
          color: var(--text-muted);
          flex-shrink: 0;
        }
        .ta-card[data-picked="true"] .ta-card__pick-hint {
          color: var(--accent);
        }
        /* Blinking cursor for the JS 'terminal' driver (Terminal Type) */
        .ta-terminal-cursor {
          display: inline-block;
          width: 0.55em;
          height: 1.05em;
          margin-left: 2px;
          background: currentColor;
          vertical-align: text-bottom;
          animation: ta-cursor-blink 1s steps(1) infinite;
        }
        @keyframes ta-cursor-blink {
          0%, 50% { opacity: 1; }
          50.01%, 100% { opacity: 0; }
        }
        /* Inject every animation's @keyframes + .ta-{id} class */
        ${allAnimationsCss}
      `}</style>
      <div className="ta-toolbar">
        <div className="ta-toolbar__row">
          <div className="ta-search">
            <input
              type="text"
              placeholder="filter by name…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              data-testid="ta-search-input"
              aria-label="Filter animations by name"
            />
          </div>
          <span className="ta-result-count" data-testid="ta-result-count">
            {filtered.length} / {textAnimations.length}
          </span>
        </div>
        <div className="ta-categories" role="group" aria-label="Filter by category">
          {CATEGORY_FILTERS.map((cat) => (
            <button
              key={cat}
              type="button"
              className="ta-cat"
              data-active={category === cat || undefined}
              data-testid={`ta-cat-${cat}`}
              aria-pressed={category === cat}
              onClick={() => setCategory(cat)}
            >
              {cat}
              <span className="ta-cat__count">{categoryCounts[cat] ?? 0}</span>
            </button>
          ))}
        </div>
      </div>
      <div className="catalog ta-catalog" data-testid="ta-catalog">
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
