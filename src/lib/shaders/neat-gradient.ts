import type { ShaderProgram } from '../shader-types';
import { NEAT_SUPPORTED_FIELDS } from '../shader-types';
import { GLSL_PRECISION } from './shared';

// Neat Gradient — faithful port of Neat (https://github.com/FireCMSco/neat,
// MIT + Commons Clause, © FireCMS). The uniforms / noise / color-function /
// vertex-main / fragment-main sections are copied verbatim from Neat's
// `lib/src/NeatGradient.ts` (buildUniforms / buildNoise / buildColorFunctions /
// buildVertexShader / buildFragmentShader), with only the mechanical changes
// required to run on our three.js-free WebGL2 runtime:
//   • GLSL ES 1.0 -> ES 3.00 (#version 300 es, varying->in/out, gl_FragColor)
//   • three.js auto-attributes removed: `uv`->a_uv, `position.xy`->planePos
//     (mapped to Neat's 50×80 plane), the projectionMatrix*modelViewMatrix
//     transform + the `normal`-displaced `newPosition` line dropped; the plane
//     stays flat and `gl_Position = vec4(a_position,0,1)` (Neat's camera is
//     orthographic + head-on, so the look is colour-dominated). The raw
//     `v_displacement_amount` varying is kept exactly as Neat computes it and
//     still drives the fragment highlights/shadows.
//   • speed folded into time: `float time = u_time*0.001*u_speed;` substituted
//     for Neat's `u_time` inside the mains.
//   • The procedural-texture branch and the mouse-FBO sampling are dropped
//     (11D-2 restores them); the mouse block is a direct u_mouse falloff.
//   • A `u_hue_shift` tail is appended (0 / greyed for Neat).
// `v_new_position` and the dropped sampler/procedural/mouse_darken uniforms are
// removed (unused downstream). A divide-by-zero guard wraps the grain scale.

// Precision is injected once at the top of each assembled stage (see
// GLSL_PRECISION / the standing rule in shared.ts) — NOT here, so the vertex
// and fragment stages declare it identically.
const NEAT_UNIFORMS = `struct Color {
    float is_active;
    vec3 color;
    float value;
};

uniform float u_grain_intensity;
uniform float u_grain_sparsity;
uniform float u_grain_scale;
uniform float u_grain_speed;
uniform float u_time;
uniform float u_speed;

uniform float u_wave_amplitude;
uniform float u_wave_frequency_x;
uniform float u_wave_frequency_y;

uniform vec2 u_color_pressure;

uniform float u_plane_width;
uniform float u_plane_height;

uniform float u_shadows;
uniform float u_highlights;
uniform float u_saturation;
uniform float u_brightness;

uniform float u_color_blending;

uniform int u_colors_count;
uniform Color u_colors[6];
uniform vec2 u_resolution;

uniform float u_y_offset;
uniform float u_y_offset_wave_multiplier;
uniform float u_y_offset_color_multiplier;
uniform float u_y_offset_flow_multiplier;

uniform float u_flow_distortion_a;
uniform float u_flow_distortion_b;
uniform float u_flow_scale;
uniform float u_flow_ease;
uniform float u_flow_enabled;

uniform float u_mouse_distortion_strength;
uniform float u_mouse_distortion_radius;
uniform vec2 u_mouse;

uniform float u_hue_shift;

uniform sampler2D u_procedural_texture;
uniform float u_enable_procedural_texture;
uniform float u_texture_ease;

uniform sampler2D u_mouse_texture;
`;

const NEAT_NOISE = `
vec4 permute(vec4 x) {
    return floor(fract(sin(x) * 43758.5453123) * 289.0);
}

vec4 taylorInvSqrt(vec4 r) {
  return 1.79284291400159 - 0.85373472095314 * r;
}

vec3 fade(vec3 t) {
  return t*t*t*(t*(t*6.0-15.0)+10.0);
}

float snoise(vec3 v) {
  const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
  const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);

  vec3 i  = floor(v + dot(v, C.yyy) );
  vec3 x0 =   v - i + dot(i, C.xxx) ;

  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min( g.xyz, l.zxy );
  vec3 i2 = max( g.xyz, l.zxy );

  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy;
  vec3 x3 = x0 - D.yyy;

  vec4 p = permute( permute( permute(
            i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
          + i.y + vec4(0.0, i1.y, i2.y, 1.0 ))
          + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));

  float n_ = 0.142857142857;
  vec3  ns = n_ * D.wyz - D.xzx;

  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);

  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_ );

  vec4 x = x_ *ns.x + ns.yyyy;
  vec4 y = y_ *ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);

  vec4 b0 = vec4( x.xy, y.xy );
  vec4 b1 = vec4( x.zw, y.zw );

  vec4 s0 = floor(b0)*2.0 + 1.0;
  vec4 s1 = floor(b1)*2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));

  vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
  vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;

  vec3 p0 = vec3(a0.xy,h.x);
  vec3 p1 = vec3(a0.zw,h.y);
  vec3 p2 = vec3(a1.xy,h.z);
  vec3 p3 = vec3(a1.zw,h.w);

  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
  p0 *= norm.x;
  p1 *= norm.y;
  p2 *= norm.z;
  p3 *= norm.w;

  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
  m = m * m;
  return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1),
                                dot(p2,x2), dot(p3,x3) ) );
}

float cnoise(vec3 P)
{
  vec3 Pi0 = floor(P);
  vec3 Pi1 = Pi0 + vec3(1.0);

  vec3 Pf0 = fract(P);
  vec3 Pf1 = Pf0 - vec3(1.0);
  vec4 ix = vec4(Pi0.x, Pi1.x, Pi0.x, Pi1.x);
  vec4 iy = vec4(Pi0.yy, Pi1.yy);
  vec4 iz0 = Pi0.zzzz;
  vec4 iz1 = Pi1.zzzz;

  vec4 ixy = permute(permute(ix) + iy);
  vec4 ixy0 = permute(ixy + iz0);
  vec4 ixy1 = permute(ixy + iz1);

  vec4 gx0 = ixy0 * (1.0 / 7.0);
  vec4 gy0 = fract(floor(gx0) * (1.0 / 7.0)) - 0.5;
  gx0 = fract(gx0);
  vec4 gz0 = vec4(0.5) - abs(gx0) - abs(gy0);
  vec4 sz0 = step(gz0, vec4(0.0));
  gx0 -= sz0 * (step(0.0, gx0) - 0.5);
  gy0 -= sz0 * (step(0.0, gy0) - 0.5);

  vec4 gx1 = ixy1 * (1.0 / 7.0);
  vec4 gy1 = fract(floor(gx1) * (1.0 / 7.0)) - 0.5;
  gx1 = fract(gx1);
  vec4 gz1 = vec4(0.5) - abs(gx1) - abs(gy1);
  vec4 sz1 = step(gz1, vec4(0.0));
  gx1 -= sz1 * (step(0.0, gx1) - 0.5);
  gy1 -= sz1 * (step(0.0, gy1) - 0.5);

  vec3 g000 = vec3(gx0.x,gy0.x,gz0.x);
  vec3 g100 = vec3(gx0.y,gy0.y,gz0.y);
  vec3 g010 = vec3(gx0.z,gy0.z,gz0.z);
  vec3 g110 = vec3(gx0.w,gy0.w,gz0.w);
  vec3 g001 = vec3(gx1.x,gy1.x,gz1.x);
  vec3 g101 = vec3(gx1.y,gy1.y,gz1.y);
  vec3 g011 = vec3(gx1.z,gy1.z,gz1.z);
  vec3 g111 = vec3(gx1.w,gy1.w,gz1.w);

  vec4 norm0 = taylorInvSqrt(vec4(dot(g000, g000), dot(g010, g010), dot(g100, g100), dot(g110, g110)));
  g000 *= norm0.x;
  g010 *= norm0.y;
  g100 *= norm0.z;
  g110 *= norm0.w;
  vec4 norm1 = taylorInvSqrt(vec4(dot(g001, g001), dot(g011, g011), dot(g101, g101), dot(g111, g111)));
  g001 *= norm1.x;
  g011 *= norm1.y;
  g101 *= norm1.z;
  g111 *= norm1.w;

  float n000 = dot(g000, Pf0);
  float n100 = dot(g100, vec3(Pf1.x, Pf0.yz));
  float n010 = dot(g010, vec3(Pf0.x, Pf1.y, Pf0.z));
  float n110 = dot(g110, vec3(Pf1.xy, Pf0.z));
  float n001 = dot(g001, vec3(Pf0.xy, Pf1.z));
  float n101 = dot(g101, vec3(Pf1.x, Pf0.y, Pf1.z));
  float n011 = dot(g011, vec3(Pf0.x, Pf1.yz));
  float n111 = dot(g111, Pf1);

  vec3 fade_xyz = fade(Pf0);
  vec4 n_z = mix(vec4(n000, n100, n010, n110), vec4(n001, n101, n011, n111), fade_xyz.z);
  vec2 n_yz = mix(n_z.xy, n_z.zw, fade_xyz.y);
  float n_xyz = mix(n_yz.x, n_yz.y, fade_xyz.x);
  return 2.2 * n_xyz;
}
`;

const NEAT_COLOR_FUNCS = `
vec3 saturation(vec3 rgb, float adjustment) {
    const vec3 W = vec3(0.2125, 0.7154, 0.0721);
    vec3 intensity = vec3(dot(rgb, W));
    return mix(intensity, rgb, adjustment);
}

float saturation(vec3 rgb)
{
    vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);
    vec4 p = mix(vec4(rgb.bg, K.wz), vec4(rgb.gb, K.xy), step(rgb.b, rgb.g));
    vec4 q = mix(vec4(p.xyw, rgb.r), vec4(rgb.r, p.yzx), step(p.x, rgb.r));

    float d = q.x - min(q.w, q.y);
    float e = 1.0e-10;
    return abs(6.0 * d + e);
}

float getSaturation(vec3 color) {
    float mx = max(color.r, max(color.g, color.b));
    float mn = min(color.r, min(color.g, color.b));
    return (mx - mn) / mx;
}

vec3 rgb2hsv(vec3 c)
{
    vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);
    vec4 p = mix(vec4(c.bg, K.wz), vec4(c.gb, K.xy), step(c.b, c.g));
    vec4 q = mix(vec4(p.xyw, c.r), vec4(c.r, p.yzx), step(p.x, c.r));

    float d = q.x - min(q.w, q.y);
    float e = 1.0e-10;
    return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + e)), d / (q.x + e), q.x);
}

vec3 hsv2rgb(vec3 c)
{
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}
`;

// Neat's buildVertexShader body, with: uv->a_uv, position.xy->planePos
// (mapped to the 50×80 plane), u_time->time (speed folded), the flat-plane
// gl_Position, and the dropped newPosition/v_new_position lines.
const NEAT_VERTEX_MAIN = `
void main() {
    float time = u_time * 0.001 * u_speed;
    vec2 planePos = (a_uv - 0.5) * vec2(u_plane_width, u_plane_height);
    vUv = a_uv;

    float waveOffset = -u_y_offset * u_y_offset_wave_multiplier;
    float colorOffset = -u_y_offset * u_y_offset_color_multiplier;
    float flowOffset = -u_y_offset * u_y_offset_flow_multiplier;

    v_displacement_amount = cnoise( vec3(
        u_wave_frequency_x * planePos.x + time,
        u_wave_frequency_y * (planePos.y + waveOffset) + time,
        time
    ));

    vec2 baseUv = vUv;
    baseUv.y += flowOffset / u_plane_height;
    vec2 flowUv = baseUv;

    if (u_flow_enabled > 0.5) {
        if (u_flow_ease > 0.0 || u_flow_distortion_a > 0.0) {
            vec2 ppp = -1.0 + 2.0 * baseUv;
            ppp += 0.1 * cos((1.5 * u_flow_scale) * ppp.yx + 1.1 * time + vec2(0.1, 1.1));
            ppp += 0.1 * cos((2.3 * u_flow_scale) * ppp.yx + 1.3 * time + vec2(3.2, 3.4));
            ppp += 0.1 * cos((2.2 * u_flow_scale) * ppp.yx + 1.7 * time + vec2(1.8, 5.2));
            ppp += u_flow_distortion_a * cos((u_flow_distortion_b * u_flow_scale) * ppp.yx + 1.4 * time + vec2(6.3, 3.9));

            float r = length(ppp);
            flowUv = mix(baseUv, vec2(baseUv.x * (1.0 - u_flow_ease) + r * u_flow_ease, baseUv.y), u_flow_ease);
        }
    }

    vFlowUv = flowUv;

    vec3 color = u_colors[0].color;
    vec2 adjustedUv = flowUv;
    adjustedUv.y += colorOffset / u_plane_height;

    vec2 noise_cord = adjustedUv * u_color_pressure;
    const float minNoise = .0;
    const float maxNoise = .9;

    for (int i = 1; i < u_colors_count; i++) {
        if(u_colors[i].is_active > 0.5){
            float noiseFlow = (1. + float(i)) / 30.;
            float noiseSpeed = (1. + float(i)) * 0.11;
            float noiseSeed = 13. + float(i) * 7.;

            float noise = snoise(
                vec3(
                    noise_cord.x * u_color_pressure.x + time * noiseFlow * 2.,
                    noise_cord.y * u_color_pressure.y,
                    time * noiseSpeed
                ) + noiseSeed
            ) - (.1 * float(i)) + (.5 * u_color_blending);

            noise = clamp(minNoise, maxNoise + float(i) * 0.02, noise);
            color = mix(color, u_colors[i].color, smoothstep(0.0, u_color_blending, noise));
        }
    }

    v_color = color;

    // Real vertex displacement (11D-2 waveAmplitude fix). We have no normal /
    // projection matrices and an orthographic-equivalent flat projection, so
    // pure Z displacement is invisible. Apply a subtle outward XY warp
    // proportional to the displacement so the Amplitude dial visibly changes
    // the wave character, plus a small clamped Z. At amplitude 0 the warp is
    // zero, so the baseline equals 11D-1's flat plane.
    float displaceZ = v_displacement_amount * u_wave_amplitude;
    // edgeMask pins the screen-quad boundary (0 at a_position = ±1) so the
    // XY warp never pulls the plane edge inward and reveals the background.
    float edgeMask = (1.0 - a_position.x * a_position.x)
                   * (1.0 - a_position.y * a_position.y);
    vec2 warp = a_position * (displaceZ * 0.06 * edgeMask);
    gl_Position = vec4(a_position + warp, clamp(displaceZ * 0.04, -0.95, 0.95), 1.0);
}
`;

// Neat's buildFragmentShader body, with: procedural branch dropped
// (baseColor = v_color), mouse-FBO sampling replaced by a direct u_mouse
// falloff (11D-2 restores the FBO trail), u_time->time, grain divide guarded,
// and a u_hue_shift tail appended.
const NEAT_FRAGMENT_MAIN = `
float random(vec2 p) {
    return fract(sin(dot(p, vec2(12.9898,78.233))) * 43758.5453);
}

float fbm(vec3 x) {
    float value = 0.0;
    float amplitude = 0.5;
    float frequency = 1.0;
    for (int i = 0; i < 4; i++) {
        value += amplitude * snoise(x * frequency);
        frequency *= 2.0;
        amplitude *= 0.5;
    }
    return value;
}

void main() {
    float time = u_time * 0.001 * u_speed;

    // Neat's original mouse-trail distortion: sample the FBO brush-trail
    // texture (rendered by the runtime's brush pool) and offset finalUv by it.
    vec2 finalUv = vFlowUv;
    if (u_mouse_distortion_strength > 0.0) {
        vec4 mouseColor = texture(u_mouse_texture, vUv);
        float mouseValue = mouseColor.r;
        if (mouseValue > 0.001) {
            float distortionAmount = mouseValue * u_mouse_distortion_strength;
            vec2 mouseDisp = vec2(distortionAmount, distortionAmount);
            finalUv -= mouseDisp;
        }
    }

    vec3 baseColor;
    if (u_enable_procedural_texture > 0.5) {
        // flow-field distance for the ease effect
        vec2 ppp = -1.0 + 2.0 * finalUv;
        ppp += 0.1 * cos((1.5 * u_flow_scale) * ppp.yx + 1.1 * time + vec2(0.1, 1.1));
        ppp += 0.1 * cos((2.3 * u_flow_scale) * ppp.yx + 1.3 * time + vec2(3.2, 3.4));
        ppp += 0.1 * cos((2.2 * u_flow_scale) * ppp.yx + 1.7 * time + vec2(1.8, 5.2));
        ppp += u_flow_distortion_a * cos((u_flow_distortion_b * u_flow_scale) * ppp.yx + 1.4 * time + vec2(6.3, 3.9));
        float r = length(ppp);
        // ease blend: 0 = topographic (flow), 1 = image (UV)
        float vx = (finalUv.x * u_texture_ease) + (r * (1.0 - u_texture_ease));
        float vy = (finalUv.y * u_texture_ease) + (0.0 * (1.0 - u_texture_ease));
        vec2 texUv = vec2(vx, vy);
        // parallax — texture lags behind the color layer
        float parallaxFactor = 0.25;
        texUv.y -= (u_y_offset * u_y_offset_color_multiplier / u_plane_height) * parallaxFactor;
        texUv *= 1.5; // tiling scale
        vec4 texSample = texture(u_procedural_texture, texUv);
        baseColor = texSample.rgb;
    } else {
        baseColor = v_color;
    }
    vec3 color = baseColor;

    color += pow(v_displacement_amount, 1.0) * u_highlights;
    color -= pow(1.0 - v_displacement_amount, 2.0) * u_shadows;
    color = saturation(color, 1.0 + u_saturation);
    color = color * u_brightness;

    vec2 noiseCoords = gl_FragCoord.xy / max(u_grain_scale, 1.0);
    float grain = (u_grain_speed != 0.0) ? fbm(vec3(noiseCoords, time * u_grain_speed)) : fbm(vec3(noiseCoords, 0.0));

    grain = grain * 0.5 + 0.5;
    grain -= 0.5;
    grain = (grain > u_grain_sparsity) ? grain : 0.0;
    grain *= u_grain_intensity;

    color += vec3(grain);

    vec3 hsv = rgb2hsv(color);
    hsv.x = fract(hsv.x + u_hue_shift / 360.0);
    color = hsv2rgb(hsv);

    fragColor = vec4(color, 1.0);
}
`;

const VERTEX = `#version 300 es
${GLSL_PRECISION}
${NEAT_UNIFORMS}
in vec2 a_position;
in vec2 a_uv;
out vec2 vUv;
out vec2 vFlowUv;
out vec3 v_color;
out float v_displacement_amount;
${NEAT_NOISE}
${NEAT_COLOR_FUNCS}
${NEAT_VERTEX_MAIN}`;

const FRAGMENT = `#version 300 es
${GLSL_PRECISION}
${NEAT_UNIFORMS}
in vec2 vUv;
in vec2 vFlowUv;
in vec3 v_color;
in float v_displacement_amount;
out vec4 fragColor;
${NEAT_COLOR_FUNCS}
${NEAT_NOISE}
${NEAT_FRAGMENT_MAIN}`;

export const neatGradientProgram: ShaderProgram = {
  id: 'neat-gradient',
  name: 'Neat Gradient',
  vertexShader: VERTEX,
  fragmentShader: FRAGMENT,
  supportedFields: NEAT_SUPPORTED_FIELDS,
  usesColorStops: true,
  attribution: {
    title: 'Neat',
    author: 'FireCMS',
    source: 'https://github.com/FireCMSco/neat',
    license: 'MIT + Commons Clause',
  },
};
