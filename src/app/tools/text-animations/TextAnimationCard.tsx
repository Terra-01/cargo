'use client';
import { useState, useEffect, useRef, type ReactNode, type CSSProperties } from 'react';
import { getSampleText, type TextAnimation, type AnimationSplit } from '@/lib/text-animations';

interface TextAnimationCardProps {
  animation: TextAnimation;
  picked: boolean;
  onTogglePick: (id: string) => void;
}

function indexStyle(i: number): CSSProperties {
  return { ['--i' as string]: i } as CSSProperties;
}

function renderSplit(text: string, split: AnimationSplit): ReactNode {
  if (split === 'character') {
    return text.split('').map((ch, i) => (
      <span key={i} style={indexStyle(i)}>
        {ch === ' ' ? ' ' : ch}
      </span>
    ));
  }
  if (split === 'word') {
    const words = text.split(' ');
    return words.map((word, i) => (
      <span key={i} style={indexStyle(i)}>
        {word}
        {i < words.length - 1 ? ' ' : ''}
      </span>
    ));
  }
  // 'line'
  return text.split('\n').map((line, i) => (
    <span key={i} style={indexStyle(i)}>
      {line}
    </span>
  ));
}

export function TextAnimationCard({ animation, picked, onTogglePick }: TextAnimationCardProps) {
  const cardRef = useRef<HTMLButtonElement>(null);
  const [visible, setVisible] = useState(false);
  const [replayKey, setReplayKey] = useState(0);
  const trigger = animation.trigger ?? 'auto';
  const isHoverTrigger = trigger === 'hover';

  // Track visibility with IntersectionObserver — off-screen cards don't animate.
  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold: 0.25 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Auto-replay loop — skip for hover-trigger animations (driven by CSS :hover).
  useEffect(() => {
    if (!visible || isHoverTrigger) return;
    const period = animation.durationMs ?? 2800;
    const interval = setInterval(() => {
      setReplayKey((k) => k + 1);
    }, period + 400);
    return () => clearInterval(interval);
  }, [visible, isHoverTrigger, animation.durationMs]);

  const handleClick = () => onTogglePick(animation.id);

  const sample = getSampleText(animation);
  const content = animation.split ? renderSplit(sample, animation.split) : sample;

  return (
    <button
      ref={cardRef}
      type="button"
      className="ta-card"
      onClick={handleClick}
      data-picked={picked || undefined}
      data-animation-id={animation.id}
      data-trigger={trigger}
      data-testid={`ta-card-${animation.id}`}
      aria-pressed={picked}
      aria-label={`${picked ? 'Unpick' : 'Pick'} ${animation.name} animation`}
    >
      <div className="ta-card__head">
        <span className="ta-card__name">{animation.id}</span>
        <span className="ta-card__category">
          {animation.category}
          {(isHoverTrigger || animation.is3d) && (
            <span className="ta-card__badges">
              {isHoverTrigger && (
                <span className="ta-card__badge" data-testid={`ta-badge-hover-${animation.id}`}>hover</span>
              )}
              {animation.is3d && (
                <span className="ta-card__badge" data-testid={`ta-badge-3d-${animation.id}`}>3D</span>
              )}
            </span>
          )}
        </span>
      </div>
      <div className="ta-card__preview">
        {visible && (
          <span
            key={replayKey}
            className={`ta-card__preview-text ${animation.id}`}
            data-split={animation.split || undefined}
            data-testid={`ta-preview-${animation.id}`}
          >
            {content}
          </span>
        )}
      </div>
      <div className="ta-card__footer">
        <span className="ta-card__name-display">{animation.name}</span>
        <span className="ta-card__pick-hint">
          {picked ? '✓ picked' : 'pick'}
        </span>
      </div>
    </button>
  );
}
