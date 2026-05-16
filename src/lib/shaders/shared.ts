// Shared GLSL building blocks for the Shader Gradient Lab WebGL2 runtime.
//
// The Neat shader (neat-gradient.ts) carries its OWN verbatim copies of the
// Ashima/Gustavson simplex + classic Perlin noise and the color helpers, so
// the upstream structure stays byte-faithful. These shared blocks are used by
// the two Shadertoy ports (ether.ts, rainbow-warp.ts) for their curated tail
// (hue / saturation / brightness / grain).

// STANDING RULE (do not remove): every GLSL ES 3.00 shader stage in this
// project — vertex AND fragment, for EVERY program — MUST begin, immediately
// after `#version 300 es`, with BOTH precision declarations below, identical
// across the two stages. GLSL ES 3.00 gives the vertex stage a default highp
// for `int`, but the fragment stage has NO default `int` precision. A uniform
// like `int u_colors_count` then resolves to different precisions in the two
// stages; strict WebGL linkers (Firefox) reject the program with
// "Uniform 'u_colors_count' is not linkable between attached shaders".
// (three.js injects a consistent preamble for Neat upstream; our custom
// runtime has none, so we inject it ourselves.) Declaring both precisions
// identically at the very top of every stage prevents this entire bug class.
export const GLSL_PRECISION = `precision highp float;
precision highp int;`;

// Full-screen subdivided-plane vertex shader. The runtime always uploads one
// subdivided plane mesh; curated shaders only need the flat clip-space quad +
// a 0..1 uv, so they share this trivial vertex stage.
export const BASIC_VERTEX_SHADER = `#version 300 es
${GLSL_PRECISION}
in vec2 a_position;
in vec2 a_uv;
out vec2 v_uv;
void main() {
  v_uv = a_uv;
  gl_Position = vec4(a_position, 0.0, 1.0);
}`;

// 3D simplex noise + fbm + HSV helpers for the curated post tail. Same
// Ashima/Gustavson implementation Neat uses (kept independent so the curated
// ports compile standalone).
export const CURATED_HELPERS = `
vec4 cg_permute(vec4 x) { return floor(fract(sin(x) * 43758.5453123) * 289.0); }
vec4 cg_taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

float cg_snoise(vec3 v) {
  const vec2  C = vec2(1.0/6.0, 1.0/3.0);
  const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);
  vec3 i  = floor(v + dot(v, C.yyy));
  vec3 x0 =   v - i + dot(i, C.xxx);
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy);
  vec3 i2 = max(g.xyz, l.zxy);
  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy;
  vec3 x3 = x0 - D.yyy;
  vec4 p = cg_permute(cg_permute(cg_permute(
            i.z + vec4(0.0, i1.z, i2.z, 1.0))
          + i.y + vec4(0.0, i1.y, i2.y, 1.0))
          + i.x + vec4(0.0, i1.x, i2.x, 1.0));
  float n_ = 0.142857142857;
  vec3  ns = n_ * D.wyz - D.xzx;
  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_);
  vec4 x = x_ * ns.x + ns.yyyy;
  vec4 y = y_ * ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);
  vec4 b0 = vec4(x.xy, y.xy);
  vec4 b1 = vec4(x.zw, y.zw);
  vec4 s0 = floor(b0)*2.0 + 1.0;
  vec4 s1 = floor(b1)*2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));
  vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
  vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
  vec3 p0 = vec3(a0.xy, h.x);
  vec3 p1 = vec3(a0.zw, h.y);
  vec3 p2 = vec3(a1.xy, h.z);
  vec3 p3 = vec3(a1.zw, h.w);
  vec4 norm = cg_taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
  p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
  m = m * m;
  return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
}

float cg_fbm(vec3 x) {
  float value = 0.0;
  float amplitude = 0.5;
  float frequency = 1.0;
  for (int i = 0; i < 4; i++) {
    value += amplitude * cg_snoise(x * frequency);
    frequency *= 2.0;
    amplitude *= 0.5;
  }
  return value;
}

vec3 cg_rgb2hsv(vec3 c) {
  vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);
  vec4 p = mix(vec4(c.bg, K.wz), vec4(c.gb, K.xy), step(c.b, c.g));
  vec4 q = mix(vec4(p.xyw, c.r), vec4(c.r, p.yzx), step(p.x, c.r));
  float d = q.x - min(q.w, q.y);
  float e = 1.0e-10;
  return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + e)), d / (q.x + e), q.x);
}

vec3 cg_hsv2rgb(vec3 c) {
  vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
  vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
  return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

// Curated post-processing tail shared by Ether + Rainbow Warp.
// hueShift (degrees) -> saturation -> brightness -> film grain.
// colorSaturation is normalised so the curated shaders look like their source
// at the Neat-derived default (colorSaturation 7 -> identity), while the dial
// stays functional across its range.
vec3 cg_curatedTail(vec3 color, vec2 fragCoord, float t,
                    float hueShiftDeg, float sat, float bright,
                    float grainScale, float grainIntensity,
                    float grainSpeed, float grainSparsity) {
  vec3 hsv = cg_rgb2hsv(color);
  hsv.x = fract(hsv.x + hueShiftDeg / 360.0);
  color = cg_hsv2rgb(hsv);

  float satMul = clamp(sat / 7.0, 0.0, 2.0);
  float luma = dot(color, vec3(0.299, 0.587, 0.114));
  color = mix(vec3(luma), color, satMul);
  color *= bright;

  vec2 noiseCoords = fragCoord / max(grainScale, 1.0);
  float grain = (grainSpeed != 0.0)
    ? cg_fbm(vec3(noiseCoords, t * grainSpeed))
    : cg_fbm(vec3(noiseCoords, 0.0));
  grain = grain * 0.5 + 0.5;
  grain -= 0.5;
  grain = (grain > grainSparsity) ? grain : 0.0;
  grain *= grainIntensity;
  color += vec3(grain);
  return color;
}`;
