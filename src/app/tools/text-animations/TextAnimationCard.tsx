'use client';
import { useState, useEffect, useRef, type ReactNode, type CSSProperties } from 'react';
import { type TextAnimation, type AnimationSplit } from '@/lib/text-animations';
import { taDrivers } from '@/lib/text-animation-drivers';

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
        {ch === ' ' ? ' ' : ch}
      </span>
    ));
  }
  if (split === 'word') {
    const words = text.split(' ');
    return words.map((word, i) => (
      <span key={i} style={indexStyle(i)}>
        {word}
        {i < words.length - 1 ? ' ' : ''}
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
  const previewRef = useRef<HTMLSpanElement>(null);
  const playTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [visible, setVisible] = useState(false);
  const [replayKey, setReplayKey] = useState(0);
  const [playing, setPlaying] = useState(false);
  const trigger = animation.trigger ?? 'auto';
  const isHoverTrigger = trigger === 'hover';
  const isJs = animation.engine === 'js';

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

  // JS-driven animations (engine === 'js'): the driver owns the preview
  // element's content and runs its own loop. Rides the same visible/replayKey
  // lifecycle as CSS cards — no parallel timer system. When replayKey ticks the
  // keyed span remounts, this effect re-runs, cleanup tears the old run down.
  useEffect(() => {
    if (!isJs || !visible) return;
    const el = previewRef.current;
    const spec = animation.jsDriver;
    if (!el || !spec) return;
    const driver = taDrivers[spec.kind];
    if (!driver) return;
    const text = animation.sampleText ?? animation.name;
    const cleanup = driver(el, text, spec);
    return cleanup;
  }, [isJs, visible, replayKey, animation.jsDriver, animation.sampleText, animation.name]);

  // Clean up a pending one-shot play timer on unmount.
  useEffect(() => {
    return () => {
      if (playTimer.current) clearTimeout(playTimer.current);
    };
  }, []);

  // Picking is the universal card action (all cards toggle into the bundle).
  // Hover-trigger animations have no auto-loop and are otherwise unreachable
  // on touch, so the same tap also plays a one-shot: data-playing applies the
  // hovered end-state (a parallel rule injected alongside the original :hover,
  // which is left intact so desktop hover-to-play is unchanged), then reverts.
  const handleClick = () => {
    onTogglePick(animation.id);
    if (!isHoverTrigger) return;
    setPlaying(true);
    if (playTimer.current) clearTimeout(playTimer.current);
    playTimer.current = setTimeout(
      () => setPlaying(false),
      animation.durationMs ?? 2800
    );
  };

  // The card demonstrates itself: it animates its own name. For JS animations
  // the driver fills the (initially empty) span, so no static content here.
  const previewText = animation.name;
  const content = isJs
    ? null
    : animation.split
      ? renderSplit(previewText, animation.split)
      : previewText;

  return (
    <button
      ref={cardRef}
      type="button"
      className="ta-card"
      onClick={handleClick}
      data-picked={picked || undefined}
      data-animation-id={animation.id}
      data-trigger={trigger}
      data-playing={isHoverTrigger && playing ? 'true' : undefined}
      data-testid={`ta-card-${animation.id}`}
      aria-pressed={picked}
      aria-label={`${picked ? 'Unpick' : 'Pick'} ${animation.name} animation`}
    >
      <div className="ta-card__head">
        <span className="ta-card__name">{animation.name}</span>
        {animation.is3d ? (
          <span className="ta-card__badges">
            <span className="ta-card__badge" data-testid={`ta-badge-3d-${animation.id}`}>3D</span>
          </span>
        ) : isHoverTrigger ? (
          <span className="ta-card__badges">
            <span className="ta-card__badge" data-testid={`ta-badge-hover-${animation.id}`}>hover / tap</span>
          </span>
        ) : null}
      </div>
      <div className="ta-card__preview">
        {visible && (
          <span
            key={replayKey}
            ref={previewRef}
            className={`ta-card__preview-text ${animation.id}`}
            data-split={animation.split || undefined}
            data-testid={`ta-preview-${animation.id}`}
          >
            {content}
          </span>
        )}
      </div>
      <div className="ta-card__footer">
        <span className="ta-card__id">{animation.id}</span>
        <span className="ta-card__pick-hint">
          {picked ? '✓ picked' : 'pick'}
        </span>
      </div>
    </button>
  );
}
