export function LoadingStatesPreview() {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        width: '70%',
      }}
    >
      {[100, 70, 85].map((width, i) => (
        <div
          key={i}
          className="cargo-shimmer-bar"
          style={{
            height: 8,
            background: 'var(--border-strong)',
            borderRadius: 4,
            width: `${width}%`,
            opacity: 0.6,
            animation: `cargo-shimmer 1.6s ease-in-out ${i * 0.2}s infinite`,
          }}
        />
      ))}
      <style>{`
        @keyframes cargo-shimmer {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.85; }
        }
        /* Decorative hub-card polish, not a tool demo — it loops forever on the
           landing page, so it stops outright under reduced motion. */
        @media (prefers-reduced-motion: reduce) {
          .cargo-shimmer-bar { animation: none !important; }
        }
      `}</style>
    </div>
  );
}
