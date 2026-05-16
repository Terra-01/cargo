// Custom WebGL2 runtime for the Shader Gradient Lab.
//
// Compiles a ShaderProgram, uploads a single subdivided plane mesh (shared by
// all three programs — Neat reads a_uv as plane coords, the curated ports read
// it as a flat 0..1 uv), runs the render loop, and supports captureFrame() for
// PNG export. Attribute locations are forced (bindAttribLocation) so the one
// VAO survives a setProgram() hot-swap. All uniforms are set through a
// safe-set pattern (null location -> no-op) so the three programs, which
// expose different uniform subsets, share one render loop.

import type { ShaderConfig, ShaderProgram } from './shader-types';
import { createProceduralTexture } from './neat-procedural-texture';
import {
  BRUSH_VERTEX,
  BRUSH_FRAGMENT,
  BRUSH_POOL_SIZE,
  BRUSH_BASE_PX,
  createBrushCanvas,
} from './shaders/brush';

interface Brush {
  x: number;
  y: number;
  scale: number;
  rot: number;
  opacity: number;
  active: boolean;
}

const PLANE_SEGMENTS = 128;
const PLANE_WIDTH = 50;
const PLANE_HEIGHT = 80;
const COLOR_STOPS = 6;

function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace('#', '').trim();
  const full =
    h.length === 3
      ? h
          .split('')
          .map((c) => c + c)
          .join('')
      : h;
  const n = parseInt(full || '000000', 16);
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
}

function buildPlane(segments: number): {
  vertices: Float32Array;
  indices: Uint32Array;
} {
  const verts: number[] = [];
  const idx: number[] = [];
  for (let r = 0; r <= segments; r++) {
    for (let c = 0; c <= segments; c++) {
      const u = c / segments;
      const v = r / segments;
      // interleaved [clipX, clipY, u, v]
      verts.push(u * 2 - 1, v * 2 - 1, u, v);
    }
  }
  const row = segments + 1;
  for (let r = 0; r < segments; r++) {
    for (let c = 0; c < segments; c++) {
      const a = r * row + c;
      const b = a + 1;
      const d = a + row;
      const e = d + 1;
      idx.push(a, b, d, b, e, d);
    }
  }
  return { vertices: new Float32Array(verts), indices: new Uint32Array(idx) };
}

export class ShaderRuntime {
  private canvas: HTMLCanvasElement;
  private gl: WebGL2RenderingContext;
  private program: ShaderProgram;
  private config: ShaderConfig;
  private glProgram: WebGLProgram | null = null;
  private vao: WebGLVertexArrayObject | null = null;
  private indexCount = 0;
  private uniformCache = new Map<string, WebGLUniformLocation | null>();
  private start = performance.now();
  private raf = 0;
  private running = false;
  private mouse: [number, number] = [0.5, 0.5];
  private dpr = 1;
  private io: IntersectionObserver | null = null;
  private ro: ResizeObserver | null = null;
  private visible = true;
  private intersecting = true;
  private destroyed = false;

  // procedural texture (Canvas2D -> GL, regenerated only on input change)
  private proceduralTex: WebGLTexture | null = null;
  private procKey: string | null = null;

  // FBO mouse trail (Neat's render-to-texture brush pool)
  private brushProg: WebGLProgram | null = null;
  private brushVao: WebGLVertexArrayObject | null = null;
  private brushTex: WebGLTexture | null = null;
  private brushU: Record<string, WebGLUniformLocation | null> = {};
  private mouseFbo: WebGLFramebuffer | null = null;
  private mouseTex: WebGLTexture | null = null;
  private mouseFboW = 0;
  private mouseFboH = 0;
  private brushes: Brush[] = [];
  private currentBrush = 0;
  private pendingBrush: [number, number] | null = null;
  private trailDirty = false;

  // rolling FPS
  private frames = 0;
  private fpsLast = performance.now();
  private fps = 0;

  constructor(canvas: HTMLCanvasElement, program: ShaderProgram, config: ShaderConfig) {
    this.canvas = canvas;
    this.program = program;
    this.config = config;
    const gl = canvas.getContext('webgl2', {
      antialias: true,
      preserveDrawingBuffer: true,
      premultipliedAlpha: false,
    });
    if (!gl) throw new Error('WebGL2 is not available in this browser.');
    this.gl = gl;

    const plane = buildPlane(PLANE_SEGMENTS);
    this.indexCount = plane.indices.length;

    this.vao = gl.createVertexArray();
    gl.bindVertexArray(this.vao);

    const vbo = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
    gl.bufferData(gl.ARRAY_BUFFER, plane.vertices, gl.STATIC_DRAW);
    const ebo = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ebo);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, plane.indices, gl.STATIC_DRAW);

    // a_position -> loc 0, a_uv -> loc 1 (stride 16 bytes)
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 16, 0);
    gl.enableVertexAttribArray(1);
    gl.vertexAttribPointer(1, 2, gl.FLOAT, false, 16, 8);
    gl.bindVertexArray(null);

    // Placeholder so sampler unit 0 always has a complete texture, even when
    // the procedural texture is disabled / not yet generated.
    this.proceduralTex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, this.proceduralTex);
    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      gl.RGBA,
      1,
      1,
      0,
      gl.RGBA,
      gl.UNSIGNED_BYTE,
      new Uint8Array([0, 0, 0, 255])
    );
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.bindTexture(gl.TEXTURE_2D, null);

    this.compile();
    this.initBrush();
    this.setupObservers();
    this.resize();
  }

  // --- FBO mouse trail -----------------------------------------------------

  private initBrush() {
    const gl = this.gl;
    // Brush program (the sixth GL program).
    const vs = this.compileShader(gl.VERTEX_SHADER, BRUSH_VERTEX);
    const fs = this.compileShader(gl.FRAGMENT_SHADER, BRUSH_FRAGMENT);
    const prog = gl.createProgram()!;
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.bindAttribLocation(prog, 0, 'a_pos');
    gl.bindAttribLocation(prog, 1, 'a_uv');
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      const log = gl.getProgramInfoLog(prog);
      gl.deleteProgram(prog);
      throw new Error(`Brush program link error: ${log}`);
    }
    gl.deleteShader(vs);
    gl.deleteShader(fs);
    this.brushProg = prog;
    for (const n of ['u_center', 'u_scale', 'u_rotation', 'u_brush', 'u_opacity']) {
      this.brushU[n] = gl.getUniformLocation(prog, n);
    }

    // Unit quad [-0.5, 0.5] with 0..1 uv (interleaved [px, py, u, v]).
    this.brushVao = gl.createVertexArray();
    gl.bindVertexArray(this.brushVao);
    const quad = new Float32Array([
      -0.5, -0.5, 0, 0,
      0.5, -0.5, 1, 0,
      -0.5, 0.5, 0, 1,
      0.5, 0.5, 1, 1,
    ]);
    const vbo = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
    gl.bufferData(gl.ARRAY_BUFFER, quad, gl.STATIC_DRAW);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 16, 0);
    gl.enableVertexAttribArray(1);
    gl.vertexAttribPointer(1, 2, gl.FLOAT, false, 16, 8);
    gl.bindVertexArray(null);

    // Radial-gradient brush sprite.
    this.brushTex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, this.brushTex);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      gl.RGBA,
      gl.RGBA,
      gl.UNSIGNED_BYTE,
      createBrushCanvas()
    );
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.bindTexture(gl.TEXTURE_2D, null);

    // Fixed pool of 50 brushes (Neat's pool size).
    this.brushes = Array.from({ length: BRUSH_POOL_SIZE }, () => ({
      x: 0,
      y: 0,
      scale: 0.2,
      rot: 0,
      opacity: 0,
      active: false,
    }));

    // u_mouse_texture must point at a real texture from the very first frame.
    this.ensureMouseFbo();
  }

  // Half canvas resolution (Neat); reallocated when the canvas resizes.
  private ensureMouseFbo() {
    const gl = this.gl;
    const w = Math.max(1, Math.floor(this.canvas.width / 2));
    const h = Math.max(1, Math.floor(this.canvas.height / 2));
    if (this.mouseFbo && w === this.mouseFboW && h === this.mouseFboH) return;
    this.mouseFboW = w;
    this.mouseFboH = h;
    if (this.mouseTex) gl.deleteTexture(this.mouseTex);
    if (this.mouseFbo) gl.deleteFramebuffer(this.mouseFbo);
    this.mouseTex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, this.mouseTex);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, w, h, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    this.mouseFbo = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, this.mouseFbo);
    gl.framebufferTexture2D(
      gl.FRAMEBUFFER,
      gl.COLOR_ATTACHMENT0,
      gl.TEXTURE_2D,
      this.mouseTex,
      0
    );
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.bindTexture(gl.TEXTURE_2D, null);
    this.trailDirty = true; // force a clear of the freshly-sized FBO
  }

  private clearMouseFbo() {
    const gl = this.gl;
    gl.bindFramebuffer(gl.FRAMEBUFFER, this.mouseFbo);
    gl.viewport(0, 0, this.mouseFboW, this.mouseFboH);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.viewport(0, 0, this.canvas.width, this.canvas.height);
  }

  private renderMouseFbo() {
    const gl = this.gl;
    gl.bindFramebuffer(gl.FRAMEBUFFER, this.mouseFbo);
    gl.viewport(0, 0, this.mouseFboW, this.mouseFboH);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE); // THREE.AdditiveBlending
    gl.useProgram(this.brushProg);
    gl.bindVertexArray(this.brushVao);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this.brushTex);
    gl.uniform1i(this.brushU.u_brush!, 0);
    const cssW = this.canvas.clientWidth || this.canvas.width;
    const cssH = this.canvas.clientHeight || this.canvas.height;
    for (const b of this.brushes) {
      if (!b.active) continue;
      // Neat: 200px base sprite scaled by mouseDistortionRadius. Convert the
      // canvas-px diameter to clip size (full canvas width = 2.0 clip).
      const sx = ((BRUSH_BASE_PX * b.scale) / cssW) * 2;
      const sy = ((BRUSH_BASE_PX * b.scale) / cssH) * 2;
      gl.uniform2f(this.brushU.u_center!, b.x * 2 - 1, b.y * 2 - 1);
      gl.uniform2f(this.brushU.u_scale!, sx, sy);
      gl.uniform1f(this.brushU.u_rotation!, b.rot);
      gl.uniform1f(this.brushU.u_opacity!, b.opacity);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    }
    gl.bindVertexArray(null);
    gl.disable(gl.BLEND);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.viewport(0, 0, this.canvas.width, this.canvas.height);
  }

  // Per-frame: stamp the rAF-batched cursor sample, decay the pool, render
  // the trail FBO — or skip entirely when idle (Neat's optimization).
  private updateTrail() {
    const c = this.config;
    const neat = this.program.id === 'neat-gradient';
    const strength = Math.max(0, c.mouseDistortionStrength);
    if (!neat || strength <= 0) {
      this.pendingBrush = null;
      if (this.trailDirty) {
        this.clearMouseFbo();
        for (const b of this.brushes) b.active = false;
        this.trailDirty = false;
      }
      return;
    }
    // rAF-batched: at most one stamp per frame regardless of mousemove count.
    if (this.pendingBrush) {
      const b = this.brushes[this.currentBrush];
      b.x = this.pendingBrush[0];
      b.y = this.pendingBrush[1];
      b.scale = Math.max(0.01, Math.min(c.mouseDistortionRadius, 1.0));
      b.rot = Math.random() * Math.PI * 2;
      b.opacity = 1.0;
      b.active = true;
      this.currentBrush = (this.currentBrush + 1) % BRUSH_POOL_SIZE;
      this.pendingBrush = null;
    }
    const decay = Math.min(0.99, Math.max(0.9, c.mouseDecayRate));
    let anyVisible = false;
    for (const b of this.brushes) {
      if (!b.active) continue;
      b.opacity *= decay;
      b.rot += 0.01;
      if (b.opacity < 0.01) {
        b.active = false;
        continue;
      }
      anyVisible = true;
    }
    if (anyVisible) {
      this.renderMouseFbo();
      this.trailDirty = true;
    } else if (this.trailDirty) {
      this.clearMouseFbo(); // one final clear so the trail fully vanishes
      this.trailDirty = false;
    }
    // idle + clean -> skip the FBO render entirely (zero cost)
  }

  // Regenerate the procedural texture only when an input changed (Neat's
  // _textureNeedsUpdate). A 1024² Canvas2D regen is heavy — never per frame.
  private maybeRegenerateTexture() {
    const c = this.config;
    const neat = this.program.id === 'neat-gradient';
    if (!neat || !c.enableProceduralTexture) return;
    const key = JSON.stringify({
      colors: c.colors,
      s: c.textureSeed,
      cb: c.textureColorBlending,
      vl: c.textureVoidLikelihood,
      vmin: c.textureVoidWidthMin,
      vmax: c.textureVoidWidthMax,
      bd: c.textureBandDensity,
      bg: c.proceduralBackgroundColor,
      t: c.textureShapeTriangles,
      ci: c.textureShapeCircles,
      ba: c.textureShapeBars,
      sq: c.textureShapeSquiggles,
    });
    if (key === this.procKey) return;
    this.procKey = key;

    const canvas = createProceduralTexture({
      colors: c.colors,
      textureSeed: c.textureSeed,
      textureColorBlending: c.textureColorBlending,
      textureVoidLikelihood: c.textureVoidLikelihood,
      textureVoidWidthMin: c.textureVoidWidthMin,
      textureVoidWidthMax: c.textureVoidWidthMax,
      textureBandDensity: c.textureBandDensity,
      proceduralBackgroundColor: c.proceduralBackgroundColor,
      textureShapeTriangles: c.textureShapeTriangles,
      textureShapeCircles: c.textureShapeCircles,
      textureShapeBars: c.textureShapeBars,
      textureShapeSquiggles: c.textureShapeSquiggles,
    });

    const gl = this.gl;
    gl.bindTexture(gl.TEXTURE_2D, this.proceduralTex);
    // Canvas is top-left origin; GL textures are bottom-left.
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, canvas);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
    gl.generateMipmap(gl.TEXTURE_2D);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
    const aniso =
      gl.getExtension('EXT_texture_filter_anisotropic') ||
      gl.getExtension('WEBKIT_EXT_texture_filter_anisotropic');
    if (aniso) {
      const max = gl.getParameter(aniso.MAX_TEXTURE_MAX_ANISOTROPY_EXT);
      gl.texParameterf(
        gl.TEXTURE_2D,
        aniso.TEXTURE_MAX_ANISOTROPY_EXT,
        Math.min(16, max)
      );
    }
    gl.bindTexture(gl.TEXTURE_2D, null);
  }

  private compileShader(type: number, src: string): WebGLShader {
    const gl = this.gl;
    const sh = gl.createShader(type)!;
    gl.shaderSource(sh, src);
    gl.compileShader(sh);
    if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
      const log = gl.getShaderInfoLog(sh);
      gl.deleteShader(sh);
      throw new Error(
        `${type === gl.VERTEX_SHADER ? 'Vertex' : 'Fragment'} shader compile error: ${log}`
      );
    }
    return sh;
  }

  private compile() {
    const gl = this.gl;
    if (this.glProgram) gl.deleteProgram(this.glProgram);
    this.uniformCache.clear();
    const vs = this.compileShader(gl.VERTEX_SHADER, this.program.vertexShader);
    const fs = this.compileShader(gl.FRAGMENT_SHADER, this.program.fragmentShader);
    const prog = gl.createProgram()!;
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    // Force attribute locations so the single VAO survives program swaps.
    gl.bindAttribLocation(prog, 0, 'a_position');
    gl.bindAttribLocation(prog, 1, 'a_uv');
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      const log = gl.getProgramInfoLog(prog);
      gl.deleteProgram(prog);
      throw new Error(`Program link error: ${log}`);
    }
    gl.deleteShader(vs);
    gl.deleteShader(fs);
    this.glProgram = prog;
  }

  private loc(name: string): WebGLUniformLocation | null {
    if (this.uniformCache.has(name)) return this.uniformCache.get(name)!;
    const l = this.gl.getUniformLocation(this.glProgram!, name);
    this.uniformCache.set(name, l);
    return l;
  }

  private u1f(name: string, v: number) {
    const l = this.loc(name);
    if (l) this.gl.uniform1f(l, v);
  }
  private u1i(name: string, v: number) {
    const l = this.loc(name);
    if (l) this.gl.uniform1i(l, v);
  }
  private u2f(name: string, a: number, b: number) {
    const l = this.loc(name);
    if (l) this.gl.uniform2f(l, a, b);
  }
  private u3f(name: string, a: number, b: number, c: number) {
    const l = this.loc(name);
    if (l) this.gl.uniform3f(l, a, b, c);
  }

  setProgram(program: ShaderProgram) {
    this.program = program;
    this.compile();
  }

  setConfig(config: ShaderConfig) {
    this.config = config;
  }

  private setupObservers() {
    if (typeof IntersectionObserver !== 'undefined') {
      this.io = new IntersectionObserver((entries) => {
        this.intersecting = entries[0]?.isIntersecting ?? true;
        this.maybeRun();
      });
      this.io.observe(this.canvas);
    }
    if (typeof ResizeObserver !== 'undefined') {
      this.ro = new ResizeObserver(() => this.resize());
      this.ro.observe(this.canvas);
    }
    document.addEventListener('visibilitychange', this.onVisibility);
    this.canvas.addEventListener('pointermove', this.onPointer);
    this.canvas.addEventListener('pointerleave', this.onPointerLeave);
  }

  private onVisibility = () => {
    this.visible = document.visibilityState !== 'hidden';
    this.maybeRun();
  };

  private onPointer = (e: PointerEvent) => {
    const rect = this.canvas.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;
    this.mouse = [
      (e.clientX - rect.left) / rect.width,
      1 - (e.clientY - rect.top) / rect.height,
    ];
    // rAF-batched: many mousemoves in one frame collapse to one stamp.
    this.pendingBrush = [this.mouse[0], this.mouse[1]];
  };

  private onPointerLeave = () => {
    this.mouse = [0.5, 0.5];
  };

  private resize() {
    const gl = this.gl;
    const rect = this.canvas.getBoundingClientRect();
    const cssW = Math.max(1, Math.round(rect.width));
    const cssH = Math.max(1, Math.round(rect.height));
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);
    const res = Math.min(Math.max(this.config.resolution || 1, 0.25), 2);
    const w = Math.max(1, Math.round(cssW * this.dpr * res));
    const h = Math.max(1, Math.round(cssH * this.dpr * res));
    if (this.canvas.width !== w || this.canvas.height !== h) {
      this.canvas.width = w;
      this.canvas.height = h;
    }
    gl.viewport(0, 0, w, h);
    // Mouse FBO tracks half the canvas resolution (Neat's resize handler).
    this.ensureMouseFbo();
  }

  start_() {
    this.maybeRun();
  }

  private maybeRun() {
    const should = this.visible && this.intersecting && !this.destroyed;
    if (should && !this.running) {
      this.running = true;
      this.raf = requestAnimationFrame(this.frame);
    } else if (!should && this.running) {
      this.running = false;
      cancelAnimationFrame(this.raf);
    }
  }

  private setUniforms() {
    const c = this.config;
    const now = performance.now();
    const elapsed = now - this.start;
    const neat = this.program.id === 'neat-gradient';

    this.u1f('u_time', elapsed);
    // Neat's tick advances at delta_s * speed/20; folding that into our
    // `time = u_time*0.001*u_speed` means u_speed = speed/20 for Neat.
    // The curated ports' iTime expects the raw speed dial.
    this.u1f('u_speed', neat ? c.speed / 20 : c.speed);
    this.u2f('u_resolution', this.canvas.width, this.canvas.height);
    this.u2f('u_mouse', this.mouse[0], this.mouse[1]);
    this.u1f('u_mouse_distortion_strength', Math.max(0, c.mouseDistortionStrength));
    this.u1f(
      'u_mouse_distortion_radius',
      Math.max(0.01, Math.min(c.mouseDistortionRadius, 1.0))
    );

    // Neat setter scalings (NeatGradient.ts set *). Curated shaders don't
    // declare these uniforms, so the scaling is harmless when they're active.
    this.u1f('u_wave_amplitude', c.waveAmplitude * 0.75);
    this.u1f('u_wave_frequency_x', c.waveFrequencyX * 0.04);
    this.u1f('u_wave_frequency_y', c.waveFrequencyY * 0.04);
    this.u2f('u_color_pressure', c.horizontalPressure / 4, c.verticalPressure / 4);
    this.u1f('u_color_blending', c.colorBlending / 10);

    this.u1f('u_plane_width', PLANE_WIDTH);
    this.u1f('u_plane_height', PLANE_HEIGHT);

    this.u1f('u_shadows', c.shadows / 100);
    this.u1f('u_highlights', c.highlights / 100);
    // Neat: saturation(color, 1.0 + colorSaturation/10). The curated tail
    // (cg_curatedTail) normalises raw colorSaturation by /7 itself.
    this.u1f('u_saturation', neat ? c.colorSaturation / 10 : c.colorSaturation);
    this.u1f('u_brightness', c.colorBrightness);

    this.u1f('u_grain_intensity', c.grainIntensity);
    this.u1f('u_grain_sparsity', c.grainSparsity);
    this.u1f('u_grain_scale', c.grainScale === 0 ? 1 : c.grainScale);
    this.u1f('u_grain_speed', c.grainSpeed);

    this.u1f('u_flow_distortion_a', c.flowDistortionA);
    this.u1f('u_flow_distortion_b', c.flowDistortionB);
    this.u1f('u_flow_scale', c.flowScale);
    this.u1f('u_flow_ease', c.flowEase);
    this.u1f('u_flow_enabled', c.flowEnabled ? 1 : 0);

    // Faithful to Neat: u_y_offset is the static preset value (Neat does NOT
    // animate it in its render loop — animation comes from u_time inside the
    // noise). The y-offset multipliers are scaled /1000 (Neat setters).
    this.u1f('u_y_offset', c.yOffset);
    this.u1f('u_y_offset_wave_multiplier', c.yOffsetWaveMultiplier / 1000);
    this.u1f('u_y_offset_color_multiplier', c.yOffsetColorMultiplier / 1000);
    this.u1f('u_y_offset_flow_multiplier', c.yOffsetFlowMultiplier / 1000);

    this.u1f('u_hue_shift', c.hueShift);

    // Procedural texture (Neat only; curated shaders don't declare these).
    this.u1f('u_enable_procedural_texture', neat && c.enableProceduralTexture ? 1 : 0);
    this.u1f('u_texture_ease', c.textureEase);
    this.u1i('u_procedural_texture', 0);
    // FBO mouse-trail texture lives on unit 1 (Neat samples u_mouse_texture).
    this.u1i('u_mouse_texture', 1);

    // Struct-array colors — query each member individually.
    this.u1i('u_colors_count', Math.min(c.colors.length, COLOR_STOPS));
    for (let i = 0; i < COLOR_STOPS; i++) {
      const stop = c.colors[i];
      const active = stop && stop.enabled ? 1 : 0;
      const rgb = stop ? hexToRgb(stop.color) : [0, 0, 0];
      this.u1f(`u_colors[${i}].is_active`, active);
      this.u3f(`u_colors[${i}].color`, rgb[0], rgb[1], rgb[2]);
      this.u1f(`u_colors[${i}].value`, i / (COLOR_STOPS - 1));
    }
  }

  private draw() {
    const gl = this.gl;
    this.maybeRegenerateTexture();
    gl.useProgram(this.glProgram);
    gl.bindVertexArray(this.vao);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this.proceduralTex);
    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, this.mouseTex);
    const bg = hexToRgb(this.config.backgroundColor);
    gl.clearColor(bg[0], bg[1], bg[2], 1);
    gl.clear(gl.COLOR_BUFFER_BIT);
    this.setUniforms();
    gl.drawElements(gl.TRIANGLES, this.indexCount, gl.UNSIGNED_INT, 0);
    gl.bindVertexArray(null);
  }

  private frame = () => {
    if (!this.running) return;
    this.resize();
    this.updateTrail();
    this.draw();
    this.frames++;
    const now = performance.now();
    if (now - this.fpsLast >= 500) {
      this.fps = Math.round((this.frames * 1000) / (now - this.fpsLast));
      this.frames = 0;
      this.fpsLast = now;
    }
    this.raf = requestAnimationFrame(this.frame);
  };

  getFps(): number {
    return this.fps;
  }

  /** Render one frame synchronously and return a PNG data URL. */
  captureFrame(): string {
    this.resize();
    this.draw();
    return this.canvas.toDataURL('image/png');
  }

  destroy() {
    this.destroyed = true;
    this.running = false;
    cancelAnimationFrame(this.raf);
    this.io?.disconnect();
    this.ro?.disconnect();
    document.removeEventListener('visibilitychange', this.onVisibility);
    this.canvas.removeEventListener('pointermove', this.onPointer);
    this.canvas.removeEventListener('pointerleave', this.onPointerLeave);
    const gl = this.gl;
    if (this.glProgram) gl.deleteProgram(this.glProgram);
    if (this.vao) gl.deleteVertexArray(this.vao);
    if (this.proceduralTex) gl.deleteTexture(this.proceduralTex);
    if (this.brushProg) gl.deleteProgram(this.brushProg);
    if (this.brushVao) gl.deleteVertexArray(this.brushVao);
    if (this.brushTex) gl.deleteTexture(this.brushTex);
    if (this.mouseTex) gl.deleteTexture(this.mouseTex);
    if (this.mouseFbo) gl.deleteFramebuffer(this.mouseFbo);
    // NOTE: do NOT call WEBGL_lose_context.loseContext() here. A <canvas> has
    // exactly one WebGL context for its lifetime; force-losing it poisons any
    // later getContext() on the same canvas. Under React StrictMode's dev
    // double-mount (mount -> unmount/destroy -> remount) the remount's
    // getContext('webgl2') would return the lost context, and the next
    // compileShader() fails with a null info log -> the misleading
    // "Vertex shader compile error: null" (Chromium silently recovers a fresh
    // context; Firefox does not). Deleting the GL resources above is
    // sufficient cleanup; the browser frees the context on its own.
  }
}
