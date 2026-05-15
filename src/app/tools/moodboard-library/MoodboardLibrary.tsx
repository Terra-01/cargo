'use client';
import { moodboards } from '@/lib/moodboards';
import { MoodboardCard } from './MoodboardCard';

export function MoodboardLibrary() {
  return (
    <>
      <style>{`
        .mb-catalog {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: var(--space-4);
        }
        @media (max-width: 860px) {
          .mb-catalog { grid-template-columns: repeat(2, minmax(0, 1fr)); }
        }
        @media (max-width: 520px) {
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
      <div className="mb-catalog" data-testid="mb-catalog">
        {moodboards.map((mb) => (
          <MoodboardCard key={mb.id} moodboard={mb} />
        ))}
      </div>
    </>
  );
}
