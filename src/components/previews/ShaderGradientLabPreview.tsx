export function ShaderGradientLabPreview() {
  return (
    <svg
      viewBox="0 0 280 140"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
      style={{ width: '100%', height: '100%' }}
    >
      <defs>
        <radialGradient id="sgl-a" cx="20%" cy="30%" r="60%">
          <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.65" />
          <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="sgl-b" cx="80%" cy="70%" r="55%">
          <stop offset="0%" stopColor="var(--text)" stopOpacity="0.35" />
          <stop offset="100%" stopColor="var(--text)" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="280" height="140" fill="url(#sgl-a)" />
      <rect width="280" height="140" fill="url(#sgl-b)" />
    </svg>
  );
}
