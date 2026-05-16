'use client';

interface Props {
  fps: number;
  min: number | null;
  max: number | null;
}

export function FpsCounter({ fps, min, max }: Props) {
  return (
    <span className="sg-fps" data-testid="sg-fps" title="frames per second — current · min · max">
      <strong>{fps}</strong> fps
      <span className="sg-fps__mm">
        {' '}· ▼{min ?? '–'} ▲{max ?? '–'}
      </span>
    </span>
  );
}
