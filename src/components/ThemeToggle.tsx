'use client';
import { useEffect, useSyncExternalStore } from 'react';

type ThemeState = 'auto' | 'light' | 'dark';

const STORAGE_KEY = 'cargo-theme';
// Same-tab writes do not fire `storage` (that event is for other tabs only),
// so a write dispatches this too and every mounted toggle re-reads.
const CHANGE_EVENT = 'cargo-theme-change';

function isTheme(v: string | null): v is ThemeState {
  return v === 'auto' || v === 'light' || v === 'dark';
}

function subscribe(onStoreChange: () => void): () => void {
  window.addEventListener('storage', onStoreChange);
  window.addEventListener(CHANGE_EVENT, onStoreChange);
  return () => {
    window.removeEventListener('storage', onStoreChange);
    window.removeEventListener(CHANGE_EVENT, onStoreChange);
  };
}

// Session fallback. localStorage throws outright in private mode and with
// cookies blocked, and it is the store this hook reads from — so without this
// the toggle would silently do nothing for those visitors. Holding the choice
// in memory keeps it working for the session; only persistence is lost.
let sessionTheme: ThemeState = 'auto';

function getSnapshot(): ThemeState {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    // Nothing stored yet (first visit) falls through to whatever this session
    // has chosen, which is 'auto' until the visitor clicks.
    return isTheme(stored) ? stored : sessionTheme;
  } catch {
    return sessionTheme;
  }
}

const getServerSnapshot = (): ThemeState => 'auto';

function writeTheme(next: ThemeState): void {
  sessionTheme = next;
  try {
    localStorage.setItem(STORAGE_KEY, next);
  } catch {
    // See sessionTheme.
  }
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

export function ThemeToggle() {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  // Sync the DOM to the stored choice. The inline script in layout.tsx already
  // did this before first paint; this keeps it right on every later change.
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'auto') {
      root.removeAttribute('data-theme');
    } else {
      root.setAttribute('data-theme', theme);
    }
  }, [theme]);

  const cycle = () => {
    writeTheme(theme === 'auto' ? 'light' : theme === 'light' ? 'dark' : 'auto');
  };

  return (
    <button
      className="theme-toggle"
      onClick={cycle}
      aria-label="Toggle theme"
      data-testid="theme-toggle"
    >
      {theme}
    </button>
  );
}
