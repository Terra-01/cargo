'use client';
import { useRef } from 'react';
import { getPresetsForShader } from '@/lib/shader-presets';
import type { ShaderPreset } from '@/lib/shader-presets';
import { shaderPrograms } from '@/lib/shader-program';
import { DEFAULT_CONFIG } from '@/lib/shader-types';
import type { ShaderProgram } from '@/lib/shader-types';

// Lightweight CSS swatch from a preset's enabled color stops — used only as a
// fallback background until the real-shader thumbnail loads (or if it 404s).
function presetSwatch(preset: ShaderPreset): string {
  const stops = (preset.config.colors ?? DEFAULT_CONFIG.colors)
    .filter((c) => c.enabled)
    .map((c) => c.color);
  if (stops.length === 0) return '#222';
  if (stops.length === 1) return stops[0];
  return `linear-gradient(90deg, ${stops.join(', ')})`;
}

// The curated shaders have no color-stop array — representative static swatches.
const SHADER_SWATCH: Record<string, string> = {
  'rainbow-warp':
    'linear-gradient(90deg,#ff004c,#ff8a00,#f5d300,#16d600,#00b3ff,#7a00ff,#ff00c8)',
  ether: 'linear-gradient(90deg,#05060f,#10204a,#2b6fb0,#0a1430)',
};

// Looks that lead the grid, in this exact order.
const FEATURED = ['rainbow-warp', 'ether', 'funky', 'yex', 'virus'];

// Pre-rendered real-shader-output thumbnail (public/look-thumbnails/<id>.webp).
// On error, fall back to the CSS swatch so a missing asset degrades gracefully.
function Thumb({ id, fallback }: { id: string; fallback: string }) {
  return (
    <span className="sg-swatch__img" style={{ background: fallback }}>
      <img
        src={`/look-thumbnails/${id}.webp`}
        alt=""
        aria-hidden="true"
        loading="lazy"
        decoding="async"
        onError={(e) => {
          e.currentTarget.style.visibility = 'hidden';
        }}
      />
    </span>
  );
}

interface Props {
  shaderId: string;
  activePresetId: string | null;
  onPickPreset: (preset: ShaderPreset) => void;
  onPickShader: (id: string) => void;
}

type Item =
  | { kind: 'preset'; id: string; preset: ShaderPreset }
  | { kind: 'shader'; id: string; prog: ShaderProgram };

// An always-visible, horizontally-scrolling palette of looks — a tactile,
// visual-first browser (Figma/Framer/VJ-tool style). The grid leads with the
// FEATURED looks (Rainbow Warp, Ether, Funky, Yex, Virus), then a divider,
// then every remaining look in its natural order.
export function SwatchGrid({
  shaderId,
  activePresetId,
  onPickPreset,
  onPickShader,
}: Props) {
  const stripRef = useRef<HTMLDivElement | null>(null);
  const presets = getPresetsForShader('neat-gradient');
  const curated = shaderPrograms.filter((p) => p.id !== 'neat-gradient');

  const all: Item[] = [
    ...curated.map((prog) => ({ kind: 'shader' as const, id: prog.id, prog })),
    ...presets.map((preset) => ({
      kind: 'preset' as const,
      id: preset.id,
      preset,
    })),
  ];

  const featured = FEATURED.map((id) => all.find((it) => it.id === id)).filter(
    (it): it is Item => Boolean(it)
  );
  const rest = all.filter((it) => !FEATURED.includes(it.id));

  const renderTile = (it: Item) => {
    if (it.kind === 'shader') {
      const active = shaderId === it.id;
      return (
        <button
          key={`s-${it.id}`}
          type="button"
          className="sg-swatch"
          data-testid={`sg-look-shader-${it.id}`}
          data-active={active ? 'true' : 'false'}
          role="option"
          aria-selected={active}
          title={it.prog.name}
          onClick={() => onPickShader(it.id)}
        >
          <Thumb id={it.id} fallback={SHADER_SWATCH[it.id] ?? '#222'} />
          <span className="sg-swatch__name">{it.prog.name}</span>
        </button>
      );
    }
    const active = shaderId === 'neat-gradient' && activePresetId === it.id;
    return (
      <button
        key={`p-${it.id}`}
        type="button"
        className="sg-swatch"
        data-testid={`sg-look-preset-${it.id}`}
        data-active={active ? 'true' : 'false'}
        role="option"
        aria-selected={active}
        title={it.preset.name}
        onClick={() => onPickPreset(it.preset)}
      >
        <Thumb id={it.id} fallback={presetSwatch(it.preset)} />
        <span className="sg-swatch__name">{it.preset.name}</span>
      </button>
    );
  };

  return (
    <div className="sg-swatches" data-testid="sg-look-grid">
      <p className="sg-swatches__eyebrow">// Presets</p>
      <div
        className="sg-swatches__strip"
        ref={stripRef}
        role="listbox"
        aria-label="Look"
      >
        {featured.map(renderTile)}

        <span className="sg-swatches__divider" data-testid="sg-look-divider">
          more
        </span>

        {rest.map(renderTile)}
      </div>
    </div>
  );
}
