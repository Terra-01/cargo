'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';

const links = [
  {
    href: '/',
    label: 'Tools',
    isActive: (p: string) => p === '/' || p.startsWith('/tools'),
  },
  {
    href: '/notes',
    label: 'Notes',
    isActive: (p: string) => p.startsWith('/notes'),
  },
  {
    href: '/about',
    label: 'About',
    isActive: (p: string) => p === '/about',
  },
];

export function TopbarNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // Close the menu on navigation (route change) and on Escape.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <>
      <nav className="topbar__nav">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={link.isActive(pathname) ? 'is-active' : ''}
          >
            {link.label}
          </Link>
        ))}
      </nav>

      <button
        type="button"
        className="topbar__menu-btn"
        aria-label={open ? 'Close menu' : 'Open menu'}
        aria-expanded={open}
        aria-controls="topbar-menu"
        onClick={() => setOpen((v) => !v)}
        data-testid="topbar-menu-button"
      >
        <span
          className="topbar__menu-icon"
          aria-hidden="true"
          data-open={open}
        />
      </button>

      {open && (
        <div
          className="topbar__menu-backdrop"
          aria-hidden="true"
          onClick={() => setOpen(false)}
        />
      )}

      <nav
        id="topbar-menu"
        className="topbar__menu"
        aria-label="Site navigation"
        data-open={open}
        data-testid="topbar-menu"
      >
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={link.isActive(pathname) ? 'is-active' : ''}
            onClick={() => setOpen(false)}
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </>
  );
}
