import type { ShaderProgram } from '../shader-types';
import { CURATED_SUPPORTED_FIELDS } from '../shader-types';
import { BASIC_VERTEX_SHADER, CURATED_HELPERS, GLSL_PRECISION } from './shared';

// Ether — port of "Ether" by nimitz, https://www.shadertoy.com/view/MsjSW3,
// CC BY-NC-SA 3.0. The map()/mainImage body is verbatim; standard
// Shadertoy -> WebGL2 ES 3.00 translation: iTime/iResolution macros, a
// `vec2 fragCoord = v_uv * u_resolution;` prelude, and the shared curated
// tail (hue / saturation / brightness / grain) so the curated dials work.
// The inner `vec3 p` (which shadows the outer `vec2 p` in the original) is
// renamed `rp` for ES 3.00 clarity; the math is unchanged.

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

${CURATED_HELPERS}

// Macros declared AFTER the shared helpers so \`#define t iTime\` cannot
// clobber cg_curatedTail's \`float t\` parameter.
#define iResolution u_resolution
#define iTime (u_time * 0.001 * u_speed + dot(u_mouse - 0.5, vec2(1.0)) * u_mouse_distortion_strength * 0.2)
#define t iTime

mat2 m(float a){float c=cos(a), s=sin(a);return mat2(c,-s,s,c);}

float map(vec3 p){
    p.xz*= m(t*0.4);p.xy*= m(t*0.3);
    vec3 q = p*2.+t;
    return length(p+vec3(sin(t*0.7)))*log(length(p)+1.) + sin(q.x+sin(q.z+sin(q.y)))*0.5 - 1.;
}

void main(){
    vec2 fragCoord = v_uv * u_resolution;
    vec2 p = fragCoord.xy/iResolution.y - vec2(.9,.5);
    vec3 cl = vec3(0.);
    float d = 2.5;
    for(int i=0; i<=5; i++) {
        vec3 rp = vec3(0,0,5.) + normalize(vec3(p, -1.))*d;
        float rz = map(rp);
        float f =  clamp((rz - map(rp+.1))*0.5, -.1, 1. );
        vec3 l = vec3(0.1,0.3,.4) + vec3(5., 2.5, 3.)*f;
        cl = cl*l + smoothstep(2.5, .0, rz)*.7*l;
        d += min(rz, 1.);
    }
    vec3 col = cl;
    col = cg_curatedTail(col, fragCoord, iTime, u_hue_shift,
                         u_saturation, u_brightness,
                         u_grain_scale, u_grain_intensity,
                         u_grain_speed, u_grain_sparsity);
    fragColor = vec4(col, 1.0);
}`;

export const etherProgram: ShaderProgram = {
  id: 'ether',
  name: 'Ether',
  vertexShader: BASIC_VERTEX_SHADER,
  fragmentShader: FRAGMENT,
  supportedFields: CURATED_SUPPORTED_FIELDS,
  usesColorStops: false,
  attribution: {
    title: 'Ether',
    author: 'nimitz',
    source: 'https://www.shadertoy.com/view/MsjSW3',
    license: 'CC BY-NC-SA 3.0',
  },
};
