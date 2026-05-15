export function EasingCookbookPreview() {
  return (
    <svg viewBox="0 0 100 60" style={{ width: '80%', height: '80%' }} aria-hidden="true">
      <path
        d="M 5 50 Q 30 50 50 30 T 95 10"
        stroke="var(--accent)"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
      />
      <circle cx="5" cy="50" r="2.5" fill="var(--text)" />
      <circle cx="95" cy="10" r="2.5" fill="var(--text)" />
    </svg>
  );
}
