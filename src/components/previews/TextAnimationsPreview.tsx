export function TextAnimationsPreview() {
  return (
    <svg
      viewBox="0 0 280 140"
      preserveAspectRatio="xMidYMid meet"
      aria-hidden="true"
      style={{ width: '100%', height: '100%' }}
    >
      <text x="32" y="48" fontFamily="var(--font-sans)" fontSize="22" fontWeight="500" fill="var(--text)">
        type
      </text>
      <text x="32" y="80" fontFamily="var(--font-sans)" fontSize="22" fontWeight="500" fill="var(--text)" opacity="0.55">
        flow
      </text>
      <text x="32" y="112" fontFamily="var(--font-sans)" fontSize="22" fontWeight="500" fill="var(--text)" opacity="0.25">
        wave
      </text>
    </svg>
  );
}
