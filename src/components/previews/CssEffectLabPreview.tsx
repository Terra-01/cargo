export function CssEffectLabPreview() {
  return (
    <div style={{ position: 'relative', width: 90, height: 90 }}>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'var(--accent)',
          borderRadius: '50%',
          opacity: 0.5,
          filter: 'blur(12px)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 12,
          background: 'var(--surface)',
          borderRadius: '50%',
          border: '1px solid var(--border-strong)',
        }}
      />
    </div>
  );
}
