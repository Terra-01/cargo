// Preset access layer. The verbatim Neat preset data lives in
// shader-presets-data.ts (dropped in from the companion file). Rainbow Warp
// and Ether are single-look shaders driven only by the curated dials, so they
// have no presets.

import { DEFAULT_CONFIG } from './shader-types';
import type { ShaderConfig } from './shader-types';
import { NEAT_PRESETS } from './shader-presets-data';
import type { ShaderPreset } from './shader-presets-data';
import { NEAT_PROCEDURAL_PRESETS } from './shader-procedural-presets-data';

export type { ShaderPreset };
export { NEAT_PRESETS };

// 19 non-procedural + 4 procedural (Funky, Fluid, Yex, Virus) = 23.
export const ALL_NEAT_PRESETS: ShaderPreset[] = [
  ...NEAT_PRESETS,
  ...NEAT_PROCEDURAL_PRESETS,
];

export function getPresetsForShader(shaderId: string): ShaderPreset[] {
  return shaderId === 'neat-gradient' ? ALL_NEAT_PRESETS : [];
}

// A preset's config is a Partial — merge it over DEFAULT_CONFIG so omitted
// fields (hueShift, flow*, yOffset, mouse*) get sensible defaults.
export function applyPreset(preset: ShaderPreset): ShaderConfig {
  return { ...DEFAULT_CONFIG, ...preset.config };
}

export function getDefaultPreset(): ShaderPreset {
  return NEAT_PRESETS[0];
}
