'use client';

interface Props {
  fps: number;
}

// Read-only live frame-rate readout. No min/max tracking, no controls — just
// the current rate, kept legible over the shader behind the glass toolbar.
export function FpsCounter({ fps }: Props) {
  return (
    <span
      className="sg-fps"
      data-testid="sg-fps"
      title="frames per second (live)"
    >
      <strong>{fps}</strong> fps
    </span>
  );
}
