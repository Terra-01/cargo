export function MockupWrapperPreview() {
  return (
    <div
      style={{
        width: 110,
        height: 75,
        background: 'var(--surface)',
        border: '1px solid var(--border-strong)',
        borderRadius: 'var(--radius-md)',
        overflow: 'hidden',
        boxShadow: '0 4px 12px var(--border)',
      }}
    >
      <div
        style={{
          height: 14,
          background: 'var(--surface-muted)',
          borderBottom: '1px solid var(--border)',
          display: 'flex',
          alignItems: 'center',
          paddingLeft: 6,
          gap: 4,
        }}
      >
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            style={{
              width: 5,
              height: 5,
              borderRadius: '50%',
              background: 'var(--text-faint)',
            }}
          />
        ))}
      </div>
      <div
        style={{
          padding: 8,
          display: 'flex',
          flexDirection: 'column',
          gap: 4,
        }}
      >
        <div style={{ height: 4, width: '60%', background: 'var(--border-strong)', borderRadius: 2 }} />
        <div style={{ height: 4, width: '90%', background: 'var(--border-strong)', borderRadius: 2 }} />
        <div style={{ height: 4, width: '75%', background: 'var(--border-strong)', borderRadius: 2 }} />
      </div>
    </div>
  );
}
