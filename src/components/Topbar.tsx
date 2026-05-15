import Link from 'next/link';
import { TopbarNav } from './TopbarNav';
import { ThemeToggle } from './ThemeToggle';

export function Topbar() {
  return (
    <header className="topbar">
      <div className="topbar__inner">
        <Link href="/" className="topbar__brand">
          <span className="topbar__mark" aria-hidden="true"></span>
          <span>CARGO</span>
        </Link>
        <TopbarNav />
        <ThemeToggle />
      </div>
    </header>
  );
}
