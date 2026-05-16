// Shader Gradient Lab — shared types, default config, and the editor's
// single source of truth for which dials exist (CONTROL_GROUPS).
//
// The parameter set mirrors Neat (https://github.com/FireCMSco/neat,
// MIT + Commons Clause) plus a `hueShift` dial used only by the curated
// Shadertoy ports. The union dial model: every ShaderProgram lists the
// fields it supports; the editor renders the full control list and greys
// anything not in the active program's supported set.

export interface NeatColorStop {
  color: string;
  enabled: boolean;
}

export interface ShaderConfig {
  // Colors — up to 6 (Neat uses 6; curated shaders use none)
  colors: NeatColorStop[];
  // Core animation
  speed: number; // 0–10
  // Waves
  waveAmplitude: number; // 0–10
  waveFrequencyX: number; // 0–10
  waveFrequencyY: number; // 0–10
  // Color pressure
  horizontalPressure: number; // 0–10
  verticalPressure: number; // 0–10
  colorBlending: number; // 0–10
  // Post-processing
  shadows: number; // 0–10
  highlights: number; // 0–10
  colorBrightness: number; // 0–2
  colorSaturation: number; // −10–10 (negative = desaturate, intentional in Neat)
  // Grain
  grainScale: number; // 0–5 (presets may exceed; slider clamps the UI only)
  grainIntensity: number; // 0–1
  grainSpeed: number; // 0–10
  grainSparsity: number; // 0–1
  // Flow field
  flowEnabled: boolean;
  flowDistortionA: number; // 0–3
  flowDistortionB: number; // 0–3
  flowScale: number; // 0–5
  flowEase: number; // 0–1
  // Y-offset parallax (preset-driven; not exposed as editor dials)
  yOffset: number;
  yOffsetWaveMultiplier: number;
  yOffsetColorMultiplier: number;
  yOffsetFlowMultiplier: number;
  // Mouse
  mouseDistortionStrength: number; // 0–1
  mouseDistortionRadius: number; // 0.05–0.5
  mouseDecayRate: number; // 0.9–0.99 (FBO trail decay; Neat only)
  // Background
  backgroundColor: string;
  // Curated-shader control (not in Neat)
  hueShift: number; // 0–360
  // Render
  resolution: number; // 0.25–2.0
  // Procedural texture (Canvas2D generator — all used raw, no setter scaling)
  enableProceduralTexture: boolean;
  textureVoidLikelihood: number; // 0–1
  textureVoidWidthMin: number; // 0–500
  textureVoidWidthMax: number; // 0–500
  textureBandDensity: number; // 0.1–3
  textureColorBlending: number; // 0–1
  textureSeed: number; // 0–1000 (integer)
  textureEase: number; // 0–1
  proceduralBackgroundColor: string;
  textureShapeTriangles: number; // 0–50 (integer)
  textureShapeCircles: number; // 0–50 (integer)
  textureShapeBars: number; // 0–50 (integer)
  textureShapeSquiggles: number; // 0–50 (integer)
  // Custom text overlay (HTML over the canvas; shader-independent)
  textOverlay: TextOverlayConfig;
}

export type TextPosition =
  | 'top-left'
  | 'top-center'
  | 'top-right'
  | 'center-left'
  | 'center'
  | 'center-right'
  | 'bottom-left'
  | 'bottom-center'
  | 'bottom-right';

export interface TextOverlayConfig {
  text: string;
  fontFamily: string;
  fontSize: number; // px
  bold: boolean;
  italic: boolean;
  underline: boolean;
  color: string;
  position: TextPosition;
  dropShadow: boolean;
}

// Curated font set — project fonts + web-safe families, usable as-is both in
// CSS and Canvas2D `font` strings (no extra font dependencies).
export const FONT_OPTIONS: { label: string; value: string }[] = [
  { label: 'Sans — General Sans', value: "'General Sans', sans-serif" },
  { label: 'Serif — Instrument Serif', value: "'Instrument Serif', Georgia, serif" },
  { label: 'Mono — IBM Plex Mono', value: "'IBM Plex Mono', monospace" },
  { label: 'Georgia', value: 'Georgia, serif' },
  { label: 'Helvetica', value: 'Helvetica, Arial, sans-serif' },
  { label: 'Courier New', value: "'Courier New', monospace" },
  { label: 'Impact', value: 'Impact, sans-serif' },
];

export const TEXT_POSITIONS: TextPosition[] = [
  'top-left',
  'top-center',
  'top-right',
  'center-left',
  'center',
  'center-right',
  'bottom-left',
  'bottom-center',
  'bottom-right',
];

export interface ShaderProgram {
  id: string;
  name: string;
  vertexShader: string;
  fragmentShader: string;
  // The union dial model: a control whose `field` is NOT in `supportedFields`
  // renders greyed/disabled in the editor.
  supportedFields: (keyof ShaderConfig)[];
  // Whether the colors section is interactive for this shader.
  usesColorStops: boolean;
  attribution?: {
    title: string;
    author: string;
    source: string;
    license: string;
  };
}

export type ControlType = 'slider' | 'toggle' | 'color' | 'color-stops';

export interface ControlSpec {
  field: keyof ShaderConfig;
  label: string;
  type: ControlType;
  min?: number;
  max?: number;
  step?: number;
}

export interface ControlGroup {
  title: string;
  controls: ControlSpec[];
}

// Single source of truth for the editor UI. Y-offset parallax fields are
// intentionally absent — they are preset-driven only.
export const CONTROL_GROUPS: ControlGroup[] = [
  {
    title: 'Animation',
    controls: [
      { field: 'speed', label: 'Speed', type: 'slider', min: 0, max: 10, step: 0.1 },
      { field: 'resolution', label: 'Resolution', type: 'slider', min: 0.25, max: 2, step: 0.05 },
    ],
  },
  {
    title: 'Colors',
    controls: [{ field: 'colors', label: 'Color stops', type: 'color-stops' }],
  },
  {
    title: 'Waves',
    controls: [
      { field: 'waveAmplitude', label: 'Amplitude', type: 'slider', min: 0, max: 10, step: 0.1 },
      { field: 'waveFrequencyX', label: 'Frequency X', type: 'slider', min: 0, max: 10, step: 0.1 },
      { field: 'waveFrequencyY', label: 'Frequency Y', type: 'slider', min: 0, max: 10, step: 0.1 },
    ],
  },
  {
    title: 'Color Pressure',
    controls: [
      { field: 'horizontalPressure', label: 'Horizontal', type: 'slider', min: 0, max: 10, step: 0.1 },
      { field: 'verticalPressure', label: 'Vertical', type: 'slider', min: 0, max: 10, step: 0.1 },
      { field: 'colorBlending', label: 'Blending', type: 'slider', min: 0, max: 10, step: 0.1 },
    ],
  },
  {
    title: 'Post-processing',
    controls: [
      { field: 'shadows', label: 'Shadows', type: 'slider', min: 0, max: 10, step: 0.1 },
      { field: 'highlights', label: 'Highlights', type: 'slider', min: 0, max: 10, step: 0.1 },
      { field: 'colorBrightness', label: 'Brightness', type: 'slider', min: 0, max: 2, step: 0.01 },
      { field: 'colorSaturation', label: 'Saturation', type: 'slider', min: -10, max: 10, step: 0.1 },
    ],
  },
  {
    title: 'Flow',
    controls: [
      { field: 'flowEnabled', label: 'Flow field', type: 'toggle' },
      { field: 'flowDistortionA', label: 'Distortion A', type: 'slider', min: 0, max: 3, step: 0.05 },
      { field: 'flowDistortionB', label: 'Distortion B', type: 'slider', min: 0, max: 3, step: 0.05 },
      { field: 'flowScale', label: 'Scale', type: 'slider', min: 0, max: 5, step: 0.05 },
      { field: 'flowEase', label: 'Ease', type: 'slider', min: 0, max: 1, step: 0.01 },
    ],
  },
  {
    title: 'Grain',
    controls: [
      { field: 'grainScale', label: 'Scale', type: 'slider', min: 0, max: 5, step: 0.05 },
      { field: 'grainIntensity', label: 'Intensity', type: 'slider', min: 0, max: 1, step: 0.01 },
      { field: 'grainSpeed', label: 'Speed', type: 'slider', min: 0, max: 10, step: 0.1 },
      { field: 'grainSparsity', label: 'Sparsity', type: 'slider', min: 0, max: 1, step: 0.01 },
    ],
  },
  {
    title: 'Mouse',
    controls: [
      { field: 'mouseDistortionStrength', label: 'Strength', type: 'slider', min: 0, max: 1, step: 0.01 },
      { field: 'mouseDistortionRadius', label: 'Radius', type: 'slider', min: 0.05, max: 0.5, step: 0.01 },
      { field: 'mouseDecayRate', label: 'Trail decay', type: 'slider', min: 0.9, max: 0.99, step: 0.01 },
    ],
  },
  {
    title: 'Procedural Texture',
    controls: [
      { field: 'enableProceduralTexture', label: 'Enable texture', type: 'toggle' },
      { field: 'textureVoidLikelihood', label: 'Void likelihood', type: 'slider', min: 0, max: 1, step: 0.01 },
      { field: 'textureVoidWidthMin', label: 'Void width min', type: 'slider', min: 0, max: 500, step: 5 },
      { field: 'textureVoidWidthMax', label: 'Void width max', type: 'slider', min: 0, max: 500, step: 5 },
      { field: 'textureBandDensity', label: 'Band density', type: 'slider', min: 0.1, max: 3, step: 0.05 },
      { field: 'textureColorBlending', label: 'Color blending', type: 'slider', min: 0, max: 1, step: 0.01 },
      { field: 'textureSeed', label: 'Seed', type: 'slider', min: 0, max: 1000, step: 1 },
      { field: 'textureEase', label: 'Ease', type: 'slider', min: 0, max: 1, step: 0.01 },
      { field: 'textureShapeTriangles', label: 'Triangles', type: 'slider', min: 0, max: 50, step: 1 },
      { field: 'textureShapeCircles', label: 'Circles', type: 'slider', min: 0, max: 50, step: 1 },
      { field: 'textureShapeBars', label: 'Bars', type: 'slider', min: 0, max: 50, step: 1 },
      { field: 'textureShapeSquiggles', label: 'Squiggles', type: 'slider', min: 0, max: 50, step: 1 },
      { field: 'proceduralBackgroundColor', label: 'Texture background', type: 'color' },
    ],
  },
  {
    title: 'Background',
    controls: [{ field: 'backgroundColor', label: 'Background', type: 'color' }],
  },
  {
    title: 'Hue',
    controls: [{ field: 'hueShift', label: 'Hue shift', type: 'slider', min: 0, max: 360, step: 1 }],
  },
];

// Every ShaderConfig field, derived from CONTROL_GROUPS + the preset-driven
// parallax fields, used to build per-program supported-field sets.
const ALL_FIELDS: (keyof ShaderConfig)[] = [
  'colors',
  'speed',
  'waveAmplitude',
  'waveFrequencyX',
  'waveFrequencyY',
  'horizontalPressure',
  'verticalPressure',
  'colorBlending',
  'shadows',
  'highlights',
  'colorBrightness',
  'colorSaturation',
  'grainScale',
  'grainIntensity',
  'grainSpeed',
  'grainSparsity',
  'flowEnabled',
  'flowDistortionA',
  'flowDistortionB',
  'flowScale',
  'flowEase',
  'yOffset',
  'yOffsetWaveMultiplier',
  'yOffsetColorMultiplier',
  'yOffsetFlowMultiplier',
  'mouseDistortionStrength',
  'mouseDistortionRadius',
  'mouseDecayRate',
  'backgroundColor',
  'hueShift',
  'resolution',
  'enableProceduralTexture',
  'textureVoidLikelihood',
  'textureVoidWidthMin',
  'textureVoidWidthMax',
  'textureBandDensity',
  'textureColorBlending',
  'textureSeed',
  'textureEase',
  'proceduralBackgroundColor',
  'textureShapeTriangles',
  'textureShapeCircles',
  'textureShapeBars',
  'textureShapeSquiggles',
];

// Neat supports everything except hueShift.
export const NEAT_SUPPORTED_FIELDS: (keyof ShaderConfig)[] = ALL_FIELDS.filter(
  (f) => f !== 'hueShift'
);

// Curated Shadertoy ports support only the universal post tail + speed/mouse.
export const CURATED_SUPPORTED_FIELDS: (keyof ShaderConfig)[] = [
  'speed',
  'colorBrightness',
  'colorSaturation',
  'grainScale',
  'grainIntensity',
  'grainSpeed',
  'grainSparsity',
  'hueShift',
  'mouseDistortionStrength',
  'mouseDistortionRadius',
  'resolution',
];

// Equal to the `Neat` preset (first entry of the preset data), with the
// fields that preset omits filled with sensible defaults.
export const DEFAULT_CONFIG: ShaderConfig = {
  colors: [
    { color: '#FF5772', enabled: true },
    { color: '#4CB4BB', enabled: true },
    { color: '#FFC600', enabled: true },
    { color: '#8B6AE6', enabled: true },
    { color: '#2E0EC7', enabled: true },
    { color: '#FF9A9E', enabled: true },
  ],
  speed: 2.5,
  waveAmplitude: 5,
  waveFrequencyX: 2,
  waveFrequencyY: 3,
  horizontalPressure: 3,
  verticalPressure: 4,
  colorBlending: 8,
  shadows: 1,
  highlights: 5,
  colorBrightness: 1,
  colorSaturation: 7,
  grainScale: 0,
  grainIntensity: 0,
  grainSpeed: 1,
  grainSparsity: 0,
  flowEnabled: true,
  flowDistortionA: 0,
  flowDistortionB: 0,
  flowScale: 0,
  flowEase: 0,
  yOffset: 0,
  yOffsetWaveMultiplier: 4,
  yOffsetColorMultiplier: 4,
  yOffsetFlowMultiplier: 4,
  mouseDistortionStrength: 0,
  mouseDistortionRadius: 0.2,
  mouseDecayRate: 0.96,
  backgroundColor: '#003FFF',
  hueShift: 0,
  resolution: 1,
  // Procedural texture — dormant by default (Neat default preset is non-procedural)
  enableProceduralTexture: false,
  textureVoidLikelihood: 0.2,
  textureVoidWidthMin: 60,
  textureVoidWidthMax: 300,
  textureBandDensity: 1,
  textureColorBlending: 0.5,
  textureSeed: 333,
  textureEase: 0.5,
  proceduralBackgroundColor: '#003FFF',
  textureShapeTriangles: 20,
  textureShapeCircles: 15,
  textureShapeBars: 15,
  textureShapeSquiggles: 10,
  textOverlay: {
    text: '',
    fontFamily: "'General Sans', sans-serif",
    fontSize: 64,
    bold: false,
    italic: false,
    underline: false,
    color: '#FFFFFF',
    position: 'center',
    dropShadow: true,
  },
};
