'use client';
import { easings } from '@/lib/easings';
import { EasingCard } from './EasingCard';

export function EasingCookbook() {
  return (
    <div className="catalog" data-testid="easing-catalog">
      {easings.map((easing, i) => (
        <EasingCard key={easing.name} easing={easing} index={i} />
      ))}
    </div>
  );
}
