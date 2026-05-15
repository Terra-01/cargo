export function MoodboardPreview() {
  const swatches = ['#C2410C', '#D97757', '#F0EFE9', '#57534E'];
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
