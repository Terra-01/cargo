// Hub card preview — a static evocation of the Neat default gradient using
// Neat's exact default palette (#FF5772 #4CB4BB #FFC600 #8B6AE6 #2E0EC7
// #FF9A9E on a #003FFF base). Kept SVG (not a live WebGL canvas) for parity
// with the other nine previews and to keep the hub's strict no-console-error
// test stable; the live shader runs on the tool page itself.
export function ShaderGradientLabPreview() {
  return (
    <svg
      viewBox="0 0 280 140"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
      style={{ width: '100%', height: '100%' }}
    >
      <defs>
        <radialGradient id="sgl-1" cx="22%" cy="28%" r="58%">
          <stop offset="0%" stopColor="#FF5772" />
          <stop offset="100%" stopColor="#FF5772" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="sgl-2" cx="78%" cy="22%" r="55%">
          <stop offset="0%" stopColor="#FFC600" />
          <stop offset="100%" stopColor="#FFC600" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="sgl-3" cx="32%" cy="82%" r="60%">
          <stop offset="0%" stopColor="#4CB4BB" />
          <stop offset="100%" stopColor="#4CB4BB" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="sgl-4" cx="82%" cy="78%" r="58%">
          <stop offset="0%" stopColor="#8B6AE6" />
          <stop offset="100%" stopColor="#8B6AE6" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="sgl-5" cx="55%" cy="50%" r="48%">
          <stop offset="0%" stopColor="#FF9A9E" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#FF9A9E" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="280" height="140" fill="#2E0EC7" />
      <rect width="280" height="140" fill="url(#sgl-1)" />
      <rect width="280" height="140" fill="url(#sgl-2)" />
      <rect width="280" height="140" fill="url(#sgl-3)" />
      <rect width="280" height="140" fill="url(#sgl-4)" />
      <rect width="280" height="140" fill="url(#sgl-5)" />
    </svg>
  );
}
