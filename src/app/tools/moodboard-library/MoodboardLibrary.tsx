'use client';
import { useState, useMemo } from 'react';
import { moodboards, type MoodboardCategory } from '@/lib/moodboards';
import { MoodboardCard } from './MoodboardCard';

// The six MoodboardCategory families, plus 'all' (the default — no filter).
// Order is fixed for the control; per-category counts are derived at runtime.
const CATEGORY_FILTERS: Array<MoodboardCategory | 'all'> = [
  'all',
  'editorial',
  'brutalist',
  'minimal',
  'maximal',
  'retro',
  'organic',
];

export function MoodboardLibrary() {
  const [category, setCategory] = useState<MoodboardCategory | 'all'>('all');

  const filtered = useMemo(() => {
    if (category === 'all') return moodboards;
    return moodboards.filter((mb) => mb.category === category);
  }, [category]);

  // Per-category counts for the filter labels — derived from the data, not
  // hard-coded, so the control reflects whatever the catalogue actually is.
  // editorial is intentionally 0 until milestone B; the chip still renders.
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: moodboards.length };
    for (const mb of moodboards) {
      counts[mb.category] = (counts[mb.category] ?? 0) + 1;
    }
    return counts;
  }, []);

  return (
    <>
      <style>{`
        .mb-toolbar {
          display: flex;
          flex-direction: column;
          align-items: stretch;
          gap: var(--space-3);
          margin-bottom: var(--space-5);
        }
        .mb-categories {
          display: flex;
          flex-wrap: wrap;
          gap: var(--space-2);
        }
        .mb-cat {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          min-height: 44px;
          padding: 5px 14px;
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
        .mb-cat:hover {
          border-color: var(--border-strong);
          color: var(--text);
        }
        .mb-cat:focus-visible {
          outline: none;
          border-color: var(--accent);
          box-shadow: 0 0 0 3px var(--accent-soft);
        }
        .mb-cat[data-active="true"] {
          border-color: var(--accent);
          background: var(--accent-soft);
          color: var(--accent);
        }
        .mb-cat__count {
          font-size: 10px;
          opacity: 0.7;
          letter-spacing: 0;
        }
        .mb-empty {
          font-family: var(--font-mono);
          font-size: var(--text-sm);
          color: var(--text-faint);
          letter-spacing: 0.01em;
          padding: var(--space-6) 0;
        }
        .mb-catalog {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: var(--space-4);
        }
        @media (max-width: 1023px) { /* migrated from max-width: 860px (tablet-and-below) */
          .mb-catalog { grid-template-columns: repeat(2, minmax(0, 1fr)); }
        }
        @media (max-width: 599px) { /* migrated from max-width: 520px (mobile) */
          .mb-catalog { grid-template-columns: 1fr; }
        }
        .mb-card {
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
          transition: border-color var(--t-base) var(--ease), transform var(--t-fast) var(--ease);
          position: relative;
          overflow: hidden;
        }
        .mb-card:hover { border-color: var(--border-strong); }
        .mb-card:active { transform: translateY(1px); }
        .mb-card:focus-visible {
          outline: none;
          border-color: var(--accent);
          box-shadow: 0 0 0 3px var(--accent-soft);
        }
        .mb-card[data-copied="true"] { border-color: var(--accent); }
        .mb-card__head {
          display: flex;
          align-items: baseline;
          justify-content: space-between;
          gap: var(--space-2);
        }
        .mb-card__name {
          font-family: var(--font-sans);
          font-size: var(--text-md);
          font-weight: 500;
          letter-spacing: -0.01em;
          color: var(--text);
        }
        .mb-card__category {
          font-family: var(--font-mono);
          font-size: 10px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--text-faint);
        }
        .mb-card__specimen {
          display: block;
          width: 100%;
          height: auto;
          aspect-ratio: 280 / 140;
          border-radius: var(--radius-md);
          overflow: hidden;
          border: 1px solid var(--border);
        }
        .mb-card__palette {
          display: flex;
          height: 56px;
          border-radius: var(--radius-md);
          overflow: hidden;
          border: 1px solid var(--border);
        }
        .mb-card__swatch {
          flex: 1;
        }
        .mb-card__tagline {
          font-family: var(--font-serif);
          font-style: italic;
          font-weight: 400;
          font-size: var(--text-md);
          color: var(--text);
          line-height: 1.3;
          letter-spacing: -0.005em;
          padding-bottom: var(--space-3);
          border-bottom: 1px solid var(--border);
        }
        .mb-card__meta {
          display: flex;
          flex-direction: column;
          gap: var(--space-2);
          font-family: var(--font-mono);
          font-size: 11px;
          color: var(--text-muted);
          letter-spacing: 0.01em;
          line-height: 1.45;
          flex: 1;
        }
        .mb-card__meta-row {
          display: flex;
          gap: var(--space-2);
        }
        .mb-card__meta-label {
          color: var(--text-faint);
          flex-shrink: 0;
          width: 52px;
        }
        .mb-card__meta-value {
          color: var(--text-muted);
        }
        .mb-card__footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: var(--space-2);
          padding-top: var(--space-3);
          border-top: 1px solid var(--border);
          font-family: var(--font-mono);
          font-size: 11px;
          color: var(--text-faint);
        }
        .mb-card__copy-hint {
          font-size: 10px;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          transition: color var(--t-fast) var(--ease);
        }
        .mb-card:hover .mb-card__copy-hint { color: var(--text-muted); }
        .mb-card[data-copied="true"] .mb-card__copy-hint { color: var(--accent); }
      `}</style>
      <div className="mb-toolbar">
        <div className="mb-categories" role="group" aria-label="Filter by family" data-testid="mb-categories">
          {CATEGORY_FILTERS.map((cat) => (
            <button
              key={cat}
              type="button"
              className="mb-cat"
              data-active={category === cat || undefined}
              data-testid={`mb-cat-${cat}`}
              aria-pressed={category === cat}
              onClick={() => setCategory(cat)}
            >
              {cat}
              <span className="mb-cat__count">{categoryCounts[cat] ?? 0}</span>
            </button>
          ))}
        </div>
      </div>
      {filtered.length === 0 ? (
        <p className="mb-empty" data-testid="mb-empty">
          No boards in this family yet.
        </p>
      ) : (
        <div className="mb-catalog" data-testid="mb-catalog">
          {filtered.map((mb) => (
            <MoodboardCard key={mb.id} moodboard={mb} />
          ))}
        </div>
      )}
    </>
  );
}
