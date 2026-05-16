'use client';
import { useEffect, useRef, useState } from 'react';
import { getPresetsForShader } from '@/lib/shader-presets';
import type { ShaderPreset } from '@/lib/shader-presets';
import { shaderPrograms } from '@/lib/shader-program';
import { DEFAULT_CONFIG } from '@/lib/shader-types';

// Lightweight CSS swatch from a preset's enabled color stops — NOT a live
// WebGL preview (25 contexts would wreck performance). A linear-gradient
// strip is enough to pick a look by sight.
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

// Pre-rendered real-shader-output thumbnail (Phase 11D-5,
// public/look-thumbnails/<id>.webp). On error, fall back to the CSS swatch so
// a missing asset degrades gracefully rather than showing a broken image.
function Thumb({
  id,
  fallback,
  className,
}: {
  id: string;
  fallback: string;
  className: string;
}) {
  return (
    <img
      className={className}
      src={`/look-thumbnails/${id}.webp`}
      alt=""
      aria-hidden="true"
      loading="lazy"
      decoding="async"
      style={{ objectFit: 'cover', background: fallback }}
      onError={(e) => {
        const el = e.currentTarget;
        el.style.visibility = 'hidden'; // reveal the fallback background
      }}
    />
  );
}

interface Props {
  shaderId: string;
  activePresetId: string | null;
  onPickPreset: (preset: ShaderPreset) => void;
  onPickShader: (id: string) => void;
}

export function LookPicker({
  shaderId,
  activePresetId,
  onPickPreset,
  onPickShader,
}: Props) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);

  const presets = getPresetsForShader('neat-gradient');
  const curated = shaderPrograms.filter((p) => p.id !== 'neat-gradient');

  const currentLabel =
    shaderId === 'neat-gradient'
      ? presets.find((p) => p.id === activePresetId)?.name ?? 'Custom'
      : shaderPrograms.find((p) => p.id === shaderId)?.name ?? shaderId;

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onDoc);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDoc);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <div className="sg-look" ref={rootRef}>
      <button
        type="button"
        className="sg-look__trigger"
        data-testid="sg-look-trigger"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <Thumb
          className="sg-look__swatch"
          id={
            shaderId === 'neat-gradient'
              ? activePresetId ?? presets[0].id
              : shaderId
          }
          fallback={
            shaderId === 'neat-gradient'
              ? presetSwatch(
                  presets.find((p) => p.id === activePresetId) ?? presets[0]
                )
              : SHADER_SWATCH[shaderId] ?? '#222'
          }
        />
        <span className="sg-look__label">{currentLabel}</span>
        <span className="sg-look__caret" aria-hidden="true">▾</span>
      </button>

      {open && (
        <div className="sg-look__popover" data-testid="sg-look-popover" role="listbox">
          {presets.map((preset) => {
            const active =
              shaderId === 'neat-gradient' && activePresetId === preset.id;
            return (
              <button
                key={preset.id}
                type="button"
                className="sg-look__row"
                data-testid={`sg-look-preset-${preset.id}`}
                data-active={active ? 'true' : 'false'}
                role="option"
                aria-selected={active}
                onClick={() => {
                  onPickPreset(preset);
                  setOpen(false);
                }}
              >
                <Thumb
                  className="sg-look__rowswatch"
                  id={preset.id}
                  fallback={presetSwatch(preset)}
                />
                <span>{preset.name}</span>
              </button>
            );
          })}

          <p className="sg-look__divider" data-testid="sg-look-divider">
            // shaders
          </p>

          {curated.map((prog) => {
            const active = shaderId === prog.id;
            return (
              <button
                key={prog.id}
                type="button"
                className="sg-look__row"
                data-testid={`sg-look-shader-${prog.id}`}
                data-active={active ? 'true' : 'false'}
                role="option"
                aria-selected={active}
                onClick={() => {
                  onPickShader(prog.id);
                  setOpen(false);
                }}
              >
                <Thumb
                  className="sg-look__rowswatch"
                  id={prog.id}
                  fallback={SHADER_SWATCH[prog.id] ?? '#222'}
                />
                <span>{prog.name}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
