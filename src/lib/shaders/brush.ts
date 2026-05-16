// Brush shader program for the FBO mouse trail (Phase 11D-3).
//
// As the cursor moves, the runtime stamps brush sprites from a fixed pool
// along its path; each sprite fades over time; all live sprites are rendered
// additively into a half-resolution offscreen FBO; the Neat fragment shader
// samples that FBO as `u_mouse_texture`. This is a faithful port of Neat's
// THREE.AdditiveBlending sprite-trail (https://github.com/FireCMSco/neat).
//
// Both stages carry the project standing-rule precision preamble (see
// shared.ts) so the program links under strict linkers (Firefox).

import { GLSL_PRECISION } from './shared';

// Neat's pool size, brush texture size, and base sprite size (px). Neat maps
// mouseBrushBaseScale = mouseDistortionRadius against a 200px base plane
// (radius 0.25 -> 50px, radius 1.0 -> 200px).
export const BRUSH_POOL_SIZE = 50;
export const BRUSH_TEX_SIZE = 128;
export const BRUSH_BASE_PX = 200;

// A unit quad in [-0.5, 0.5] with 0..1 uv, rotated + scaled + centred in clip
// space per brush instance.
export const BRUSH_VERTEX = `#version 300 es
${GLSL_PRECISION}
in vec2 a_pos;
in vec2 a_uv;
uniform vec2 u_center;
uniform vec2 u_scale;
uniform float u_rotation;
out vec2 v_uv;
void main() {
  float c = cos(u_rotation);
  float s = sin(u_rotation);
  vec2 r = vec2(a_pos.x * c - a_pos.y * s, a_pos.x * s + a_pos.y * c);
  v_uv = a_uv;
  gl_Position = vec4(u_center + r * u_scale, 0.0, 1.0);
}`;

// Samples the radial brush texture; outputs its alpha falloff times the
// instance opacity in all channels (the Neat fragment reads `.r`). Rendered
// with additive blending so overlapping trail segments accumulate.
export const BRUSH_FRAGMENT = `#version 300 es
${GLSL_PRECISION}
in vec2 v_uv;
uniform sampler2D u_brush;
uniform float u_opacity;
out vec4 fragColor;
void main() {
  float a = texture(u_brush, v_uv).a * u_opacity;
  fragColor = vec4(a, a, a, a);
}`;

// Neat's exact 128×128 radial-gradient brush sprite.
export function createBrushCanvas(): HTMLCanvasElement {
  const c = document.createElement('canvas');
  c.width = BRUSH_TEX_SIZE;
  c.height = BRUSH_TEX_SIZE;
  const ctx = c.getContext('2d');
  if (!ctx) return c;
  const g = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
  g.addColorStop(0.0, 'rgba(255,255,255,0.8)');
  g.addColorStop(0.5, 'rgba(255,255,255,0.4)');
  g.addColorStop(1.0, 'rgba(255,255,255,0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, BRUSH_TEX_SIZE, BRUSH_TEX_SIZE);
  return c;
}
