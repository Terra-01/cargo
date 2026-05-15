export function PromptBuilderPreview() {
  return (
    <div
      style={{
        fontFamily: 'var(--font-mono)',
        fontSize: 10,
        color: 'var(--text-muted)',
        lineHeight: 1.6,
        textAlign: 'left',
        padding: '0 8px',
      }}
    >
      <div><span style={{ color: 'var(--accent)' }}>$</span> build a card</div>
      <div style={{ color: 'var(--text-faint)' }}>&nbsp;&nbsp;+ tailwind</div>
      <div style={{ color: 'var(--text-faint)' }}>&nbsp;&nbsp;+ brutalist</div>
      <div style={{ color: 'var(--text-faint)' }}>&nbsp;&nbsp;+ dark mode</div>
    </div>
  );
}
