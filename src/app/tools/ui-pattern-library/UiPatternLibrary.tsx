'use client';
import { useMemo, useState } from 'react';
import {
  uiPatterns,
  UI_PATTERN_CATEGORIES,
  type UiPatternCategory,
} from '@/lib/ui-patterns';
import { UiPatternCard } from './UiPatternCard';

// 'all' (default, no filter) plus the four fixed category values. Order is
// fixed for the control; per-category counts are derived from the data at
// runtime, never hard-coded — same contract as the Text Animation Library,
// Loading States and Moodboard filters.
const CATEGORY_FILTERS: Array<UiPatternCategory | 'all'> = [
  'all',
  ...UI_PATTERN_CATEGORIES,
];

export function UiPatternLibrary() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<UiPatternCategory | 'all'>('all');

  // Category filter and text search combine — both narrow the result.
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return uiPatterns.filter((p) => {
      if (category !== 'all' && p.category !== category) return false;
      if (!q) return true;
      return (
        p.name.toLowerCase().includes(q) ||
        p.id.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
      );
    });
  }, [search, category]);

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: uiPatterns.length };
    for (const p of uiPatterns) {
      counts[p.category] = (counts[p.category] ?? 0) + 1;
    }
    return counts;
  }, []);

  return (
    <>
      <style>{`
        .upl-toolbar {
          display: flex;
          flex-direction: column;
          align-items: stretch;
          gap: var(--space-3);
          margin-bottom: var(--space-6);
        }
        .upl-toolbar__row {
          display: flex;
          align-items: center;
          gap: var(--space-3);
        }
        .upl-search { flex: 1; max-width: 320px; }
        .upl-search input {
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
        .upl-search input:focus { outline: none; border-color: var(--accent); }
        .upl-result-count {
          font-family: var(--font-mono);
          font-size: var(--text-xs);
          color: var(--text-faint);
          letter-spacing: 0.04em;
        }
        .upl-categories { display: flex; flex-wrap: wrap; gap: var(--space-2); }
        .upl-cat {
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
        .upl-cat:hover { border-color: var(--border-strong); color: var(--text); }
        .upl-cat:focus-visible {
          outline: none;
          border-color: var(--accent);
          box-shadow: 0 0 0 3px var(--accent-soft);
        }
        .upl-cat[data-active="true"] {
          border-color: var(--accent);
          background: var(--accent-soft);
          color: var(--accent);
        }
        .upl-cat__count { font-size: 10px; opacity: 0.7; letter-spacing: 0; }

        .upl-catalog {
          display: flex;
          flex-direction: column;
          gap: var(--space-6);
        }
        .upl-empty {
          padding: var(--space-12) 0;
          text-align: center;
          font-family: var(--font-mono);
          font-size: var(--text-sm);
          color: var(--text-faint);
        }

        .upl-card {
          border: 1px solid var(--border);
          border-radius: var(--radius-lg);
          background: var(--surface);
          padding: var(--space-6);
        }
        .upl-card__head { margin-bottom: var(--space-5); }
        .upl-card__eyebrow { margin-bottom: var(--space-2); }
        .upl-card__name {
          font-family: var(--font-sans);
          font-weight: 500;
          font-size: var(--text-2xl);
          letter-spacing: -0.02em;
          line-height: 1.15;
          color: var(--text);
          margin-bottom: var(--space-3);
        }
        .upl-card__name { overflow-wrap: anywhere; }
        .upl-card__what {
          font-size: var(--text-md);
          color: var(--text-muted);
          line-height: 1.6;
          max-width: 62ch;
          overflow-wrap: anywhere;
        }
        .upl-card__body {
          display: grid;
          grid-template-columns: minmax(240px, 0.85fr) minmax(0, 1.35fr);
          gap: var(--space-6);
          align-items: start;
        }
        /* Grid children must be allowed to shrink below their content
           min-size, otherwise a wide demo forces the body (and the page)
           sideways. The example column then contains its own overflow. */
        .upl-card__anatomy,
        .upl-card__example { min-width: 0; }
        @media (max-width: 1023px) { /* migrated from max-width: 900px (tablet-and-below) */
          .upl-card__body { grid-template-columns: 1fr; gap: var(--space-5); }
        }
        .upl-card__anatomy {
          display: flex;
          flex-direction: column;
          gap: var(--space-4);
        }
        .upl-anat {
          display: flex;
          flex-direction: column;
          gap: 5px;
          padding-left: var(--space-3);
          border-left: 2px solid var(--border-strong);
        }
        .upl-anat[data-kind="use"]     { border-left-color: #16a34a; }
        .upl-anat[data-kind="avoid"]   { border-left-color: #dc2626; }
        .upl-anat[data-kind="instead"] { border-left-color: var(--accent); }
        .upl-anat__label {
          font-family: var(--font-mono);
          font-size: 10px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--text-faint);
        }
        .upl-anat p {
          font-size: var(--text-sm);
          color: var(--text-muted);
          line-height: 1.6;
        }
        .upl-card__example {
          position: relative;
          border: 1px dashed var(--border-strong);
          border-radius: var(--radius-md);
          padding: var(--space-5);
          padding-top: calc(var(--space-5) + 14px);
          background: var(--surface);
        }
        .upl-card__example-tag {
          position: absolute;
          top: -9px;
          left: var(--space-4);
          padding: 1px 8px;
          background: var(--accent);
          color: #fff;
          font-family: var(--font-mono);
          font-size: 9px;
          font-weight: 500;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          border-radius: var(--radius-sm);
        }
        .upl-card__example-scroll {
          min-width: 0;
          overflow-x: auto;
          overscroll-behavior-x: contain;
        }
        .upl-card__example-missing {
          font-family: var(--font-mono);
          font-size: var(--text-sm);
          color: var(--text-faint);
        }
      `}</style>

      <div className="upl-toolbar">
        <div className="upl-toolbar__row">
          <div className="upl-search">
            <input
              type="text"
              placeholder="filter by name…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              data-testid="upl-search-input"
              aria-label="Filter patterns by name"
            />
          </div>
          <span className="upl-result-count" data-testid="upl-result-count">
            {filtered.length} / {uiPatterns.length}
          </span>
        </div>
        <div
          className="upl-categories"
          role="group"
          aria-label="Filter by category"
          data-testid="upl-categories"
        >
          {CATEGORY_FILTERS.map((cat) => (
            <button
              key={cat}
              type="button"
              className="upl-cat"
              data-active={category === cat || undefined}
              data-testid={`upl-cat-${cat}`}
              aria-pressed={category === cat}
              onClick={() => setCategory(cat)}
            >
              {cat}
              <span className="upl-cat__count">{categoryCounts[cat] ?? 0}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="upl-catalog" data-testid="upl-catalog">
        {filtered.length === 0 ? (
          <p className="upl-empty" data-testid="upl-empty">
            no patterns match.
          </p>
        ) : (
          filtered.map((pattern) => (
            <UiPatternCard key={pattern.id} pattern={pattern} />
          ))
        )}
      </div>
    </>
  );
}
