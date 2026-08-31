'use client';
import { useSyncExternalStore } from 'react';

const QUERY = '(prefers-reduced-motion: reduce)';

function subscribe(onStoreChange: () => void): () => void {
  const mq = window.matchMedia(QUERY);
  mq.addEventListener('change', onStoreChange);
  return () => mq.removeEventListener('change', onStoreChange);
}

const getSnapshot = (): boolean => window.matchMedia(QUERY).matches;

// The server cannot know the preference. Rendering `false` means auto-play is
// opt-out for the first frame, which is the right default for the majority who
// have set no preference; the real value lands on hydration.
const getServerSnapshot = (): boolean => false;

/**
 * Tracks `prefers-reduced-motion: reduce`, and updates if the visitor changes
 * the OS setting while the page is open.
 *
 * Cargo's catalogue tools (text animations, loading states) auto-play their
 * previews when a card scrolls into view. That is the point of those tools, so
 * the motion is not removed — but it is not *started for you* either. Callers
 * use this to hold auto-play until the visitor asks, which keeps the tool fully
 * usable while honouring the preference.
 */
export function usePrefersReducedMotion(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
