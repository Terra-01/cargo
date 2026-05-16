import type { ShaderProgram } from '../shader-types';
import { CURATED_SUPPORTED_FIELDS } from '../shader-types';
import { BASIC_VERTEX_SHADER, CURATED_HELPERS, GLSL_PRECISION } from './shared';

// Rainbow Warp — port of "Rainbow", https://www.shadertoy.com/view/Ws3SRn,
// CC BY-NC-SA 3.0. The procedural `spectral_colour` wavelength->rgb table and
// the 8-iteration domain-warp loop are the faithful port of the Shadertoy
// source. Standard Shadertoy -> WebGL2 ES 3.00 translation: iTime/iResolution
// macros (with a small mouse-lean term), a `vec2 fragCoord = v_uv *
// u_resolution;` prelude, and the shared curated tail (hue / saturation /
// brightness / grain) so the curated dials work.

const FRAGMENT = `#version 300 es
${GLSL_PRECISION}

in vec2 v_uv;
out vec4 fragColor;

uniform float u_time;
uniform float u_speed;
uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_mouse_distortion_strength;
uniform float u_hue_shift;
uniform float u_saturation;
uniform float u_brightness;
uniform float u_grain_scale;
uniform float u_grain_intensity;
uniform float u_grain_speed;
uniform float u_grain_sparsity;

#define iResolution u_resolution
#define iTime (u_time * 0.001 * u_speed + dot(u_mouse - 0.5, vec2(1.0)) * u_mouse_distortion_strength * 0.2)

${CURATED_HELPERS}

vec3 spectral_colour(float l) {
    float r = 0.0, g = 0.0, b = 0.0;
    if ((l >= 400.0) && (l < 410.0)) { float t = (l - 400.0) / (410.0 - 400.0); r = +(0.33 * t) - (0.20 * t * t); }
    else if ((l >= 410.0) && (l < 475.0)) { float t = (l - 410.0) / (475.0 - 410.0); r = 0.14 - (0.13 * t * t); }
    else if ((l >= 545.0) && (l < 595.0)) { float t = (l - 545.0) / (595.0 - 545.0); r = +(1.98 * t) - (t * t); }
    else if ((l >= 595.0) && (l < 650.0)) { float t = (l - 595.0) / (650.0 - 595.0); r = 0.98 + (0.06 * t) - (0.40 * t * t); }
    else if ((l >= 650.0) && (l < 700.0)) { float t = (l - 650.0) / (700.0 - 650.0); r = 0.65 - (0.84 * t) + (0.20 * t * t); }
    if ((l >= 415.0) && (l < 475.0)) { float t = (l - 415.0) / (475.0 - 415.0); g = +(0.80 * t * t); }
    else if ((l >= 475.0) && (l < 590.0)) { float t = (l - 475.0) / (590.0 - 475.0); g = 0.8 + (0.76 * t) - (0.80 * t * t); }
    else if ((l >= 585.0) && (l < 639.0)) { float t = (l - 585.0) / (639.0 - 585.0); g = 0.82 - (0.80 * t); }
    if ((l >= 400.0) && (l < 475.0)) { float t = (l - 400.0) / (475.0 - 400.0); b = +(2.20 * t) - (1.50 * t * t); }
    else if ((l >= 475.0) && (l < 560.0)) { float t = (l - 475.0) / (560.0 - 475.0); b = 0.7 - (t) + (0.30 * t * t); }
    return vec3(r, g, b);
}

void main() {
    vec2 fragCoord = v_uv * u_resolution;
    vec2 p = (2.0 * fragCoord.xy - iResolution.xy) / min(iResolution.x, iResolution.y);
    p *= 2.0;
    for (int i = 0; i < 8; i++) {
        vec2 newp = vec2(
            p.y + cos(p.x + iTime) - sin(p.y * cos(iTime * 0.2)),
            p.x - sin(p.y - iTime) - cos(p.x * sin(iTime * 0.3))
        );
        p = newp;
    }
    vec3 col = spectral_colour(p.y * 50.0 + 500.0 + sin(iTime * 0.6));
    col = cg_curatedTail(col, fragCoord, iTime, u_hue_shift,
                         u_saturation, u_brightness,
                         u_grain_scale, u_grain_intensity,
                         u_grain_speed, u_grain_sparsity);
    fragColor = vec4(col, 1.0);
}`;

export const rainbowWarpProgram: ShaderProgram = {
  id: 'rainbow-warp',
  name: 'Rainbow Warp',
  vertexShader: BASIC_VERTEX_SHADER,
  fragmentShader: FRAGMENT,
  supportedFields: CURATED_SUPPORTED_FIELDS,
  usesColorStops: false,
  attribution: {
    title: 'Rainbow',
    author: 'Shadertoy contributor',
    source: 'https://www.shadertoy.com/view/Ws3SRn',
    license: 'CC BY-NC-SA 3.0',
  },
};
