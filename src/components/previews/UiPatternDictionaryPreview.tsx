export function UiPatternDictionaryPreview() {
  return (
    <svg
      viewBox="0 0 280 140"
      preserveAspectRatio="xMidYMid meet"
      aria-hidden="true"
      style={{ width: '100%', height: '100%' }}
    >
      <g stroke="var(--text)" strokeWidth="1.4" fill="none" opacity="0.85">
        <rect x="32" y="32" width="64" height="14" rx="3" />
        <rect x="32" y="54" width="92" height="14" rx="3" />
        <rect x="32" y="76" width="48" height="14" rx="3" />
        <rect x="32" y="98" width="76" height="14" rx="3" />
      </g>
      <g fill="var(--accent)">
        <circle cx="248" cy="39" r="3" />
        <circle cx="248" cy="61" r="3" opacity="0.7" />
        <circle cx="248" cy="83" r="3" opacity="0.4" />
        <circle cx="248" cy="105" r="3" opacity="0.2" />
      </g>
    </svg>
  );
}
