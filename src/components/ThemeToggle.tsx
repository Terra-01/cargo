'use client';
import { useState, useEffect } from 'react';

type ThemeState = 'auto' | 'light' | 'dark';

export function ThemeToggle() {
  const [theme, setTheme] = useState<ThemeState>('auto');

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'auto') {
      root.removeAttribute('data-theme');
    } else {
      root.setAttribute('data-theme', theme);
    }
  }, [theme]);

  const cycle = () => {
    setTheme((t) => (t === 'auto' ? 'light' : t === 'light' ? 'dark' : 'auto'));
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
