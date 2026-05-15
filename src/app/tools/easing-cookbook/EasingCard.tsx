'use client';
import { useState } from 'react';
import type { Easing } from '@/lib/easings';
import { bezierString } from '@/lib/easings';

interface EasingCardProps {
  easing: Easing;
  index: number;
}

export function EasingCard({ easing, index }: EasingCardProps) {
  const [copied, setCopied] = useState(false);

  const [x1, y1, x2, y2] = easing.bezier;
  const value = bezierString(easing.bezier);

  // SVG curve coordinates — viewBox 0,-20,100,140 to accommodate overshoots
  // Path: M 0,100 C (x1*100),((1-y1)*100), (x2*100),((1-y2)*100), 100,0
  const cp1x = x1 * 100;
  const cp1y = (1 - y1) * 100;
  const cp2x = x2 * 100;
  const cp2y = (1 - y2) * 100;
  const curvePath = `M 0 100 C ${cp1x.toFixed(2)} ${cp1y.toFixed(2)}, ${cp2x.toFixed(2)} ${cp2y.toFixed(2)}, 100 0`;

  // Stagger demo animations so they don't all sync
  const animationDelay = `${(index * 0.18).toFixed(2)}s`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
    } catch {
      // Clipboard may be blocked in some test envs; still toggle visual state
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <button
      type="button"
      className="easing-card"
      onClick={handleCopy}
      data-copied={copied || undefined}
      data-easing-name={easing.name}
      data-testid={`easing-card-${easing.name}`}
      aria-label={`Copy ${value}`}
    >
      <div className="easing-card__head">
        <span className="easing-card__name">{easing.name}</span>
        <span className="easing-card__category">{easing.category}</span>
      </div>
      <div className="easing-card__curve">
        <svg viewBox="-4 -24 108 148" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
          {/* baseline (0% value) */}
          <line className="easing-card__curve-axis" x1="0" y1="100" x2="100" y2="100" />
          {/* top line (100% value) */}
          <line className="easing-card__curve-axis" x1="0" y1="0" x2="100" y2="0" />
          {/* the curve */}
          <path className="easing-card__curve-path" d={curvePath} />
          {/* endpoints */}
          <circle className="easing-card__curve-endpoint" cx="0" cy="100" r="2.5" />
          <circle className="easing-card__curve-endpoint" cx="100" cy="0" r="2.5" />
        </svg>
      </div>
      <div className="easing-card__demo">
        <span
          className="easing-card__demo-dot"
          style={{
            // Inject the easing as the animation-timing-function via custom property
            ['--ease' as string]: value,
            animationDelay,
          }}
        />
      </div>
      <div className="easing-card__value">
        <span className="easing-card__value-text">{value}</span>
        <span className="easing-card__copy-hint">
          {copied ? 'copied' : 'copy'}
        </span>
      </div>
    </button>
  );
}
