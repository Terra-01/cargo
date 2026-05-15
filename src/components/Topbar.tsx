import Link from 'next/link';
import { ThemeToggle } from './ThemeToggle';

export function Topbar() {
  return (
    <header className="topbar">
      <div className="topbar__inner">
        <Link href="/" className="topbar__brand">
          <span className="topbar__mark" aria-hidden="true"></span>
          <span>CARGO</span>
        </Link>
        <nav className="topbar__nav">
          <Link href="/" className="is-active">Tools</Link>
          <Link href="/notes">Notes</Link>
          <Link href="/about">About</Link>
        </nav>
        <ThemeToggle />
      </div>
    </header>
  );
}
