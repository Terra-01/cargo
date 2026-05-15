'use client';
import { useState } from 'react';
import type { LoadingState } from '@/lib/loading-states';
import { combinedSnippet } from '@/lib/loading-states';
import { LoaderPreview } from './LoaderPreview';

interface LoadingStateCardProps {
  state: LoadingState;
}

export function LoadingStateCard({ state }: LoadingStateCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(combinedSnippet(state));
    } catch {
      // Clipboard may be blocked in some test environments
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <button
      type="button"
      className="easing-card loader-card"
      onClick={handleCopy}
      data-copied={copied || undefined}
      data-state-id={state.id}
      data-testid={`loader-card-${state.id}`}
      aria-label={`Copy ${state.name} HTML and CSS`}
    >
      <div className="easing-card__head">
        <span className="easing-card__name">{state.name}</span>
        <span className="easing-card__category">{state.category}</span>
      </div>
      <div className="loader-card__preview" data-testid={`loader-preview-${state.id}`}>
        <LoaderPreview id={state.id} />
      </div>
      <div className="easing-card__value">
        <span className="easing-card__value-text">html + css</span>
        <span className="easing-card__copy-hint">
          {copied ? 'copied' : 'copy'}
        </span>
      </div>
    </button>
  );
}
