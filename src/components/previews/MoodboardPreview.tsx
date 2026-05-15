export function MoodboardPreview() {
  const swatches = ['#C2410C', '#FCD34D', '#4D7C0F', '#1E40AF'];
  return (
    <div
      style={{
        display: 'flex',
        width: '80%',
        height: 70,
        borderRadius: 'var(--radius-md)',
        overflow: 'hidden',
        border: '1px solid var(--border)',
      }}
    >
      {swatches.map((color) => (
        <div key={color} style={{ flex: 1, background: color }} />
      ))}
    </div>
  );
}
