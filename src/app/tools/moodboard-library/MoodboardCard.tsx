'use client';
import { useState } from 'react';
import type { Moodboard } from '@/lib/moodboards';
import { buildMoodboardSnippet } from '@/lib/moodboards';

interface MoodboardCardProps {
  moodboard: Moodboard;
}

export function MoodboardCard({ moodboard: mb }: MoodboardCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(buildMoodboardSnippet(mb));
    } catch {
      // ignore in restricted environments
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <button
      type="button"
      className="mb-card"
      onClick={handleCopy}
      data-copied={copied || undefined}
      data-moodboard-id={mb.id}
      data-testid={`mb-card-${mb.id}`}
      aria-label={`Copy ${mb.name} moodboard CSS`}
    >
      <div className="mb-card__head">
        <span className="mb-card__name">{mb.name}</span>
        <span className="mb-card__category">{mb.category}</span>
      </div>
      <div className="mb-card__palette" aria-hidden="true">
        {mb.palette.map((c) => (
          <div
            key={c.label}
            className="mb-card__swatch"
            style={{ background: c.hex }}
            data-swatch-label={c.label}
          />
        ))}
      </div>
      <p className="mb-card__tagline">{mb.tagline}</p>
      <div className="mb-card__meta">
        <div className="mb-card__meta-row">
          <span className="mb-card__meta-label">type</span>
          <span className="mb-card__meta-value">{mb.fonts.heading} + {mb.fonts.body}</span>
        </div>
        <div className="mb-card__meta-row">
          <span className="mb-card__meta-label">texture</span>
          <span className="mb-card__meta-value">{mb.textures}</span>
        </div>
      </div>
      <div className="mb-card__footer">
        <span>4 colors · 2 fonts</span>
        <span className="mb-card__copy-hint">
          {copied ? 'copied' : 'copy'}
        </span>
      </div>
    </button>
  );
}
