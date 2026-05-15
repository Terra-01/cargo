'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

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
  return (
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
  );
}
