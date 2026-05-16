'use client';
import { useState } from 'react';
import { textAnimations, getBundleSnippet } from '@/lib/text-animations';

interface PickerTrayProps {
  pickedIds: Set<string>;
  onRemove: (id: string) => void;
  onClear: () => void;
}

export function PickerTray({ pickedIds, onRemove, onClear }: PickerTrayProps) {
  const [copied, setCopied] = useState(false);
  // Collapsed by default — the tray is a single fixed-height row no matter how
  // many animations are picked. Expand reveals the (capped, scrolling) chips.
  const [expanded, setExpanded] = useState(false);
  const isEmpty = pickedIds.size === 0;
  const pickedAnimations = textAnimations.filter((a) => pickedIds.has(a.id));
  const showChips = !isEmpty && expanded;

  const handleCopy = async () => {
    if (isEmpty) return;
    const snippet = getBundleSnippet(pickedAnimations);
    try {
      await navigator.clipboard.writeText(snippet);
    } catch {
      // ignored
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div
      className="picker-tray"
      data-empty={isEmpty || undefined}
      data-expanded={showChips || undefined}
      data-testid="picker-tray"
      role="region"
      aria-label="Picked animations"
    >
      <div className="picker-tray__summary">
        <span className="picker-tray__count">
          <span className="picker-tray__count-num" data-testid="picker-count">
            {pickedIds.size}
          </span>
          {' '}picked
        </span>
        {isEmpty ? (
          <span className="picker-tray__empty-hint">
            click any card to add to the bundle
          </span>
        ) : (
          <button
            type="button"
            className="picker-tray__toggle"
            onClick={() => setExpanded((v) => !v)}
            data-testid="picker-toggle"
            aria-expanded={expanded}
            aria-controls="picker-tray-chips"
          >
            <span className="picker-tray__caret" aria-hidden="true">
              {expanded ? '▾' : '▸'}
            </span>
            {expanded ? 'hide' : 'show'}
          </button>
        )}
        <div className="picker-tray__actions">
          <button
            type="button"
            className="btn btn--sm"
            onClick={onClear}
            disabled={isEmpty}
            data-testid="picker-clear"
            style={{ opacity: isEmpty ? 0.4 : 1 }}
          >
            clear
          </button>
          <button
            type="button"
            className="btn btn--sm btn--primary"
            onClick={handleCopy}
            disabled={isEmpty}
            data-testid="picker-copy"
            style={{ opacity: isEmpty ? 0.4 : 1 }}
          >
            {copied ? 'copied' : `copy bundle (${pickedIds.size})`}
          </button>
        </div>
      </div>
      {showChips && (
        <div
          className="picker-tray__chips"
          id="picker-tray-chips"
          data-testid="picker-chips"
        >
          {pickedAnimations.map((a) => (
            <button
              key={a.id}
              type="button"
              className="picker-chip"
              onClick={() => onRemove(a.id)}
              data-testid={`picker-chip-${a.id}`}
              aria-label={`Remove ${a.name} from bundle`}
            >
              <span className="picker-chip__name">{a.name}</span>
              <span className="picker-chip__remove" aria-hidden="true">×</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
