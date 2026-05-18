// Preview for The Spec Pressure-Test. The tool's unit is a three-part causal
// chain: a gap leads to an assumption leads to a consequence. The preview is
// that chain in miniature: two neutral links flowing down into one that has
// gone wrong (accent is the failure the gap became).
export function SpecPressureTestPreview() {
  return (
    <svg
      viewBox="0 0 280 140"
      preserveAspectRatio="xMidYMid meet"
      aria-hidden="true"
      style={{ width: '100%', height: '100%' }}
    >
      <g stroke="var(--text)" strokeWidth="1.4" fill="none" opacity="0.85">
        <rect x="92" y="14" width="96" height="26" rx="4" />
        <rect x="92" y="57" width="96" height="26" rx="4" />
      </g>
      <g stroke="var(--text)" strokeWidth="1.4" opacity="0.4" fill="none">
        <line x1="140" y1="40" x2="140" y2="57" />
        <line x1="140" y1="83" x2="140" y2="100" />
        <path d="M136 53 L140 57 L144 53" />
        <path d="M136 96 L140 100 L144 96" />
      </g>
      <rect
        x="92"
        y="100"
        width="96"
        height="26"
        rx="4"
        fill="var(--accent)"
        opacity="0.92"
      />
    </svg>
  );
}
