// Export (Phase 11D-5 standalone HTML + JSON, Phase 11D-6 embed snippet).
//
// Turns the CURRENT look (shader + full ShaderConfig + text overlay) into:
//   • buildStandaloneHtml — a single zero-dependency .html file that runs in
//     any browser from file://.
//   • buildEmbedSnippet — a guest-safe <script> drop-in (Shadow-DOM isolated)
//     pasted into a page the user is already building.
//   • buildConfigJson / parseConfigJson — a round-trippable JSON config.
//
// All three share ONE inlined core (PROCEDURAL_JS + CORE_JS + emitPayload):
// the runtime, the GLSL, the procedural Canvas2D generator and the config are
// inlined; no @firecms/neat, no CDN, no network. The inlined GLSL is verbatim
// from the program objects, which carry the 11D-3 `#version 300 es` +
// dual-precision discipline, so exports work in Firefox too.

import { getProgramById } from './shader-program';
import { DEFAULT_CONFIG } from './shader-types';
import type { ShaderConfig } from './shader-types';

export interface ExportedLook {
  version: 1;
  shaderId: string;
  config: ShaderConfig;
}

// Escape `<` so an inlined `</script>` (e.g. in user overlay text inside the
// embedded JSON, or in the GLSL) cannot break out of the <script> element.
// ONLY touches `<` — must not alter GLSL/JSON whitespace.
function jsSafe(s: string): string {
  return s.replace(/</g, '\\u003c');
}

function htmlEscape(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// ---- JSON config (round-trip) ----

export function buildConfigJson(shaderId: string, config: ShaderConfig): string {
  const payload: ExportedLook = { version: 1, shaderId, config };
  return JSON.stringify(payload, null, 2);
}

export function parseConfigJson(
  text: string
): { shaderId: string; config: ShaderConfig } | null {
  try {
    const data = JSON.parse(text) as Partial<ExportedLook>;
    if (!data || typeof data !== 'object') return null;
    const shaderId =
      typeof data.shaderId === 'string' && getProgramById(data.shaderId)
        ? data.shaderId
        : 'neat-gradient';
    if (!data.config || typeof data.config !== 'object') return null;
    // Merge over DEFAULT_CONFIG so a partial / older JSON still restores.
    const config: ShaderConfig = {
      ...DEFAULT_CONFIG,
      ...data.config,
      textOverlay: {
        ...DEFAULT_CONFIG.textOverlay,
        ...(data.config.textOverlay ?? {}),
      },
    };
    return { shaderId, config };
  } catch {
    return null;
  }
}

// ---- the inlined procedural Canvas2D generator (plain JS, zero-dep) ----
// Faithful copy of src/lib/neat-procedural-texture.ts (kept inline so the
// exported file has no imports). Only runs for procedural Neat looks.
const PROCEDURAL_JS = String.raw`
function createProceduralTexture(p) {
  var texSize = 1024;
  var src = document.createElement('canvas'); src.width = texSize; src.height = texSize;
  var sCtx = src.getContext('2d', { willReadFrequently: true });
  var baseColor = p.proceduralBackgroundColor || '#000000';
  function blank(){ var c=document.createElement('canvas'); c.width=texSize; c.height=texSize;
    var x=c.getContext('2d'); if(x){ x.fillStyle=baseColor; x.fillRect(0,0,texSize,texSize);} return c; }
  if(!sCtx) return blank();
  var seed = p.textureSeed, baseSeed = p.textureSeed;
  function random(){ var x=Math.sin(seed++)*10000; return x-Math.floor(x); }
  function setSeed(o){ seed = baseSeed + o; }
  var colors = p.colors.filter(function(c){return c.enabled;}).map(function(c){return c.color;});
  if(colors.length===0) return blank();
  function hexToRgb(h){ var n=parseInt(h.replace('#',''),16); return {r:(n>>16)&255,g:(n>>8)&255,b:n&255}; }
  function rgbToHex(r,g,b){ return '#'+((1<<24)+(Math.round(r)<<16)+(Math.round(g)<<8)+Math.round(b)).toString(16).slice(1); }
  function getInterColor(){ var c1=colors[Math.floor(random()*colors.length)], c2=colors[Math.floor(random()*colors.length)];
    var m=random()*p.textureColorBlending, a=hexToRgb(c1), b=hexToRgb(c2);
    return rgbToHex(a.r+(b.r-a.r)*m, a.g+(b.g-a.g)*m, a.b+(b.b-a.b)*m); }
  sCtx.fillStyle=baseColor; sCtx.fillRect(0,0,texSize,texSize);
  var g=sCtx.createLinearGradient(0,0,0,texSize); g.addColorStop(0,getInterColor()); g.addColorStop(1,getInterColor());
  sCtx.fillStyle=g; sCtx.fillRect(0,0,texSize,texSize);
  for(var i=0;i<p.textureShapeTriangles;i++){ sCtx.fillStyle=getInterColor(); sCtx.beginPath();
    var x=random()*texSize,y=random()*texSize,s=100+random()*300;
    sCtx.moveTo(x,y); sCtx.lineTo(x+(random()-0.5)*s,y+(random()-0.5)*s); sCtx.lineTo(x+(random()-0.5)*s,y+(random()-0.5)*s); sCtx.fill(); }
  for(var i2=0;i2<p.textureShapeCircles;i2++){ sCtx.strokeStyle=getInterColor(); sCtx.lineWidth=10+random()*50; sCtx.beginPath();
    var cx=random()*texSize,cy=random()*texSize,rr=50+random()*150; sCtx.arc(cx,cy,rr,0,Math.PI*2); sCtx.stroke(); }
  for(var i3=0;i3<p.textureShapeBars;i3++){ sCtx.fillStyle=getInterColor(); sCtx.save();
    sCtx.translate(random()*texSize,random()*texSize); sCtx.rotate(random()*Math.PI); sCtx.fillRect(-150,-25,300,50); sCtx.restore(); }
  sCtx.lineWidth=15; sCtx.lineCap='round';
  for(var i4=0;i4<p.textureShapeSquiggles;i4++){ sCtx.strokeStyle=getInterColor(); sCtx.beginPath();
    var sx=random()*texSize,sy=random()*texSize; sCtx.moveTo(sx,sy);
    for(var j=0;j<4;j++){ sCtx.bezierCurveTo(sx+(random()-0.5)*300,sy+(random()-0.5)*300,sx+(random()-0.5)*300,sy+(random()-0.5)*300,sx+(random()-0.5)*300,sy+(random()-0.5)*300);
      sx+=(random()-0.5)*300; sy+=(random()-0.5)*300; } sCtx.stroke(); }
  setSeed(50000);
  var canvas=document.createElement('canvas'); canvas.width=texSize; canvas.height=texSize;
  var ctx=canvas.getContext('2d',{willReadFrequently:true}); if(!ctx) return blank();
  ctx.fillStyle=baseColor; ctx.fillRect(0,0,texSize,texSize);
  var head=0, segs=[];
  while(head<texSize){ var isVoid=random()<p.textureVoidLikelihood;
    if(isVoid){ var w=p.textureVoidWidthMin+random()*(p.textureVoidWidthMax-p.textureVoidWidthMin); segs.push({t:'void',x:head,w:w}); head+=w; }
    else { var w2=50+random()*200; segs.push({t:'matter',x:head,w:w2}); head+=w2; } }
  for(var k=0;k<segs.length;k++){ var sg=segs[k]; if(sg.t==='matter'){ var startX=sg.x,endX=Math.min(sg.x+sg.w,texSize),cur=startX;
    while(cur<endX){ var sw=(2+random()*20)/p.textureBandDensity, srcX=Math.floor(random()*texSize);
      ctx.drawImage(src,srcX,0,sw,texSize,cur,0,sw,texSize); cur+=sw; } } }
  return canvas;
}`;

// ---- the SHARED inlined runtime core (zero-dep) ----
// A faithful, compact subset of src/lib/shader-runtime.ts: subdivided plane,
// program compile, per-frame uniforms with Neat's exact setter scaling
// (speed/20, pressure/4, waveFreq*0.04, highlights|shadows/100,
// saturation/10 for Neat, blending/10, yOffsetMult/1000, grainScale 0->1),
// the u_colors[6] struct array, the procedural texture, the text overlay, and
// a static mouse texture (the interactive FBO trail is intentionally not
// exported — the export is a showcase of the look, not the editor).
//
// This is the ONE core both exports share. It expects `canvas`, `mount`,
// `SHADER_ID`, `CONFIG`, `VS`, `FS` and `createProceduralTexture` already in
// scope — the standalone HTML wrapper and the embeddable-snippet wrapper each
// supply those differently (full-document vs Shadow-DOM guest), but the
// rendering core below is identical and never duplicated.
const CORE_JS = String.raw`
  var gl=canvas.getContext('webgl2',{antialias:true,premultipliedAlpha:false,preserveDrawingBuffer:true});
  if(!gl){ var m=document.createElement('p'); m.textContent='WebGL2 is required to view this gradient.';
    m.style.cssText='color:#fff;font-family:monospace;padding:2rem'; mount.appendChild(m); return; }
  var NEAT = SHADER_ID === 'neat-gradient';
  function hexRgb(h){ h=h.replace('#',''); if(h.length===3) h=h.split('').map(function(c){return c+c;}).join('');
    var n=parseInt(h||'000000',16); return [((n>>16)&255)/255,((n>>8)&255)/255,(n&255)/255]; }
  var SEG=128, verts=[], idx=[];
  for(var r=0;r<=SEG;r++) for(var c=0;c<=SEG;c++){ var u=c/SEG,v=r/SEG; verts.push(u*2-1,v*2-1,u,v); }
  var row=SEG+1;
  for(var r2=0;r2<SEG;r2++) for(var c2=0;c2<SEG;c2++){ var a=r2*row+c2,b=a+1,d=a+row,e=d+1; idx.push(a,b,d,b,e,d); }
  var vao=gl.createVertexArray(); gl.bindVertexArray(vao);
  var vbo=gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER,vbo); gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(verts),gl.STATIC_DRAW);
  var ebo=gl.createBuffer(); gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,ebo); gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,new Uint32Array(idx),gl.STATIC_DRAW);
  gl.enableVertexAttribArray(0); gl.vertexAttribPointer(0,2,gl.FLOAT,false,16,0);
  gl.enableVertexAttribArray(1); gl.vertexAttribPointer(1,2,gl.FLOAT,false,16,8);
  gl.bindVertexArray(null);
  function mk(t,s){ var sh=gl.createShader(t); gl.shaderSource(sh,s); gl.compileShader(sh);
    if(!gl.getShaderParameter(sh,gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(sh)); return sh; }
  var prog=gl.createProgram();
  gl.attachShader(prog,mk(gl.VERTEX_SHADER,VS)); gl.attachShader(prog,mk(gl.FRAGMENT_SHADER,FS));
  gl.bindAttribLocation(prog,0,'a_position'); gl.bindAttribLocation(prog,1,'a_uv');
  gl.linkProgram(prog);
  if(!gl.getProgramParameter(prog,gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(prog));
  var locs={};
  function L(n){ if(!(n in locs)) locs[n]=gl.getUniformLocation(prog,n); return locs[n]; }
  function u1f(n,x){ var l=L(n); if(l) gl.uniform1f(l,x); }
  function u1i(n,x){ var l=L(n); if(l) gl.uniform1i(l,x); }
  function u2f(n,x,y){ var l=L(n); if(l) gl.uniform2f(l,x,y); }
  function u3f(n,x,y,z){ var l=L(n); if(l) gl.uniform3f(l,x,y,z); }
  var procTex=gl.createTexture(); gl.bindTexture(gl.TEXTURE_2D,procTex);
  gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,1,1,0,gl.RGBA,gl.UNSIGNED_BYTE,new Uint8Array([0,0,0,255]));
  gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR); gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);
  var mouseTex=gl.createTexture(); gl.bindTexture(gl.TEXTURE_2D,mouseTex);
  gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,1,1,0,gl.RGBA,gl.UNSIGNED_BYTE,new Uint8Array([0,0,0,0]));
  gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR); gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);
  gl.bindTexture(gl.TEXTURE_2D,null);
  if(NEAT && CONFIG.enableProceduralTexture){
    var cv=createProceduralTexture(CONFIG);
    gl.bindTexture(gl.TEXTURE_2D,procTex);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL,true);
    gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,cv);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL,false);
    gl.generateMipmap(gl.TEXTURE_2D);
    gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR_MIPMAP_LINEAR);
    gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.REPEAT);
    gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.REPEAT);
    gl.bindTexture(gl.TEXTURE_2D,null);
  }
  var start=performance.now();
  function resize(){
    var dpr=Math.min(window.devicePixelRatio||1,2);
    var res=Math.min(Math.max(CONFIG.resolution||1,0.25),2);
    var rect=canvas.getBoundingClientRect();
    var cw=Math.max(1, rect.width || canvas.clientWidth || window.innerWidth);
    var ch=Math.max(1, rect.height || canvas.clientHeight || window.innerHeight);
    var w=Math.max(1,Math.round(cw*dpr*res));
    var h=Math.max(1,Math.round(ch*dpr*res));
    if(canvas.width!==w||canvas.height!==h){ canvas.width=w; canvas.height=h; }
    gl.viewport(0,0,w,h);
  }
  window.addEventListener('resize',resize);
  if(typeof ResizeObserver!=='undefined'){ try{ new ResizeObserver(resize).observe(canvas); }catch(e){} }
  resize();
  // Text overlay (built in-DOM into the same mount the canvas lives in, so it
  // is correctly scoped — into the Shadow root for the embed, into <body> for
  // the standalone). No innerHTML; faithful to the tool's overlay.
  (function(){
    var ov=CONFIG.textOverlay;
    if(!ov||!ov.text) return;
    var isC=ov.position==='center', pp=ov.position.split('-');
    var rk=isC?'center':pp[0], ck=isC?'center':pp[1];
    var al=ck==='left'?'flex-start':ck==='right'?'flex-end':'center';
    var ju=rk==='top'?'flex-start':rk==='bottom'?'flex-end':'center';
    var wrap=document.createElement('div');
    wrap.style.cssText='position:absolute;inset:0;display:flex;flex-direction:column;align-items:'+al+';justify-content:'+ju+';padding:6%;pointer-events:none;';
    var sp=document.createElement('span');
    sp.textContent=ov.text;
    sp.style.cssText='font-family:'+ov.fontFamily+';font-size:'+ov.fontSize+'px;font-weight:'+(ov.bold?700:400)+';font-style:'+(ov.italic?'italic':'normal')+';text-decoration:'+(ov.underline?'underline':'none')+';color:'+ov.color+';line-height:1.15;text-align:'+ck+';white-space:pre-wrap;text-shadow:'+(ov.dropShadow?('0 2px '+Math.max(4,ov.fontSize*0.12)+'px rgba(0,0,0,0.55)'):'none')+';';
    wrap.appendChild(sp); mount.appendChild(wrap);
  })();
  function setU(){
    var c=CONFIG, t=performance.now()-start;
    u1f('u_time',t);
    u1f('u_speed', NEAT ? c.speed/20 : c.speed);
    u2f('u_resolution',canvas.width,canvas.height);
    u2f('u_mouse',0.5,0.5);
    u1f('u_mouse_distortion_strength',Math.max(0,c.mouseDistortionStrength));
    u1f('u_mouse_distortion_radius',Math.max(0.01,Math.min(c.mouseDistortionRadius,1)));
    u1f('u_wave_amplitude',c.waveAmplitude*0.75);
    u1f('u_wave_frequency_x',c.waveFrequencyX*0.04);
    u1f('u_wave_frequency_y',c.waveFrequencyY*0.04);
    u2f('u_color_pressure',c.horizontalPressure/4,c.verticalPressure/4);
    u1f('u_color_blending',c.colorBlending/10);
    u1f('u_plane_width',50); u1f('u_plane_height',80);
    u1f('u_shadows',c.shadows/100); u1f('u_highlights',c.highlights/100);
    u1f('u_saturation', NEAT ? c.colorSaturation/10 : c.colorSaturation);
    u1f('u_brightness',c.colorBrightness);
    u1f('u_grain_intensity',c.grainIntensity);
    u1f('u_grain_sparsity',c.grainSparsity);
    u1f('u_grain_scale',c.grainScale===0?1:c.grainScale);
    u1f('u_grain_speed',c.grainSpeed);
    u1f('u_flow_distortion_a',c.flowDistortionA);
    u1f('u_flow_distortion_b',c.flowDistortionB);
    u1f('u_flow_scale',c.flowScale);
    u1f('u_flow_ease',c.flowEase);
    u1f('u_flow_enabled',c.flowEnabled?1:0);
    u1f('u_y_offset',c.yOffset);
    u1f('u_y_offset_wave_multiplier',c.yOffsetWaveMultiplier/1000);
    u1f('u_y_offset_color_multiplier',c.yOffsetColorMultiplier/1000);
    u1f('u_y_offset_flow_multiplier',c.yOffsetFlowMultiplier/1000);
    u1f('u_hue_shift',c.hueShift);
    u1f('u_enable_procedural_texture', NEAT && c.enableProceduralTexture?1:0);
    u1f('u_texture_ease',c.textureEase);
    u1i('u_procedural_texture',0); u1i('u_mouse_texture',1);
    u1i('u_colors_count',Math.min(c.colors.length,6));
    for(var i=0;i<6;i++){ var st=c.colors[i]; var on=st&&st.enabled?1:0; var rgb=st?hexRgb(st.color):[0,0,0];
      u1f('u_colors['+i+'].is_active',on); u3f('u_colors['+i+'].color',rgb[0],rgb[1],rgb[2]); u1f('u_colors['+i+'].value',i/5); }
  }
  function frame(){
    resize();
    gl.useProgram(prog); gl.bindVertexArray(vao);
    gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D,procTex);
    gl.activeTexture(gl.TEXTURE1); gl.bindTexture(gl.TEXTURE_2D,mouseTex);
    var bg=hexRgb(CONFIG.backgroundColor); gl.clearColor(bg[0],bg[1],bg[2],1); gl.clear(gl.COLOR_BUFFER_BIT);
    setU();
    gl.drawElements(gl.TRIANGLES,idx.length,gl.UNSIGNED_INT,0);
    gl.bindVertexArray(null);
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
`;

// Shared attribution helpers — the licenses (Neat MIT+Commons-Clause,
// Shadertoy CC BY-NC-SA 3.0) require attribution, and an export is a
// distribution, so both wrappers carry this verbatim.
function attributionBlock(shaderId: string): string {
  const prog = getProgramById(shaderId) ?? getProgramById('neat-gradient')!;
  const at = prog.attribution;
  if (!at) return ' *  (no attribution metadata)';
  const isMit = at.license.startsWith('MIT');
  return [
    ` *  Shader: "${at.title}" by ${at.author}`,
    ` *  Source: ${at.source}`,
    ` *  License: ${at.license}`,
    isMit
      ? ' *  (MIT + Commons Clause: free to use/modify/distribute; do not'
      : ' *  (CC BY-NC-SA 3.0: attribution required, non-commercial,',
    isMit
      ? ' *   sell a product whose value derives substantially from it.)'
      : ' *   share-alike for derivatives.)',
  ].join('\n');
}

// The shared payload both wrappers inject before CORE_JS: the editable config
// surface + the verbatim (Firefox-safe) GLSL + the procedural generator.
function emitPayload(shaderId: string, config: ShaderConfig): string {
  const prog = getProgramById(shaderId) ?? getProgramById('neat-gradient')!;
  return `/* ============================================================
   EXPORTED LOOK — this is the editable surface.
   Tweak any value below (speed, a color, waveAmplitude, the
   text overlay, etc.) and reload to see it change.
   ============================================================ */
var SHADER_ID = ${JSON.stringify(shaderId)};
var CONFIG = ${jsSafe(JSON.stringify(config, null, 2))};
/* ---- end editable settings ---- */

var VS = ${jsSafe(JSON.stringify(prog.vertexShader))};
var FS = ${jsSafe(JSON.stringify(prog.fragmentShader))};
${PROCEDURAL_JS}`;
}

export function buildStandaloneHtml(
  shaderId: string,
  config: ShaderConfig
): string {
  const prog = getProgramById(shaderId) ?? getProgramById('neat-gradient')!;
  const header = `<!--
  ============================================================
  Exported from Cargo — Shader Gradient Lab
  A self-contained, zero-dependency animated gradient.
  Open this file directly in any browser (file://) — it runs
  with no build step, no imports, and no network requests.

${attributionBlock(shaderId)}
  ============================================================
-->`;

  return `<!DOCTYPE html>
<html lang="en">
${header}
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Cargo gradient — ${htmlEscape(prog.name)}</title>
<style>
  html,body{margin:0;height:100%;background:#000;overflow:hidden}
  #c{display:block;width:100vw;height:100vh;position:fixed;inset:0}
</style>
</head>
<body>
<canvas id="c"></canvas>
<script>
${emitPayload(shaderId, config)}
(function(){
  var canvas=document.getElementById('c');
  var mount=document.body;
${CORE_JS}
})();
</script>
</body>
</html>`;
}

// ---- the embeddable snippet — a guest in someone else's page ----
// A movable container <div> + an IIFE <script> that renders the same core
// into a Shadow root attached to that div: true CSS/DOM isolation from the
// host (no leaked globals, no leaked styles, host page untouched). Survives
// being pasted multiple times (each script binds to its own preceding div via
// document.currentScript, with an idempotent ready-flag fallback) and being
// placed in <head> or <body> (the div is parsed before its inline script).
export function buildEmbedSnippet(
  shaderId: string,
  config: ShaderConfig
): string {
  const prog = getProgramById(shaderId) ?? getProgramById('neat-gradient')!;
  const header = `<!-- ============================================================
  Cargo — Shader Gradient Lab — embeddable snippet (${htmlEscape(prog.name)})
  Paste this block into your page. Zero dependencies, no network.
  Move it anywhere; resize by editing the div's style (e.g.
  style="width:600px;height:400px" or a different aspect-ratio).
  Keep the <div> and its <script> together as one block.

${attributionBlock(shaderId)}
  ============================================================ -->`;

  return `${header}
<div data-cargo-gradient style="display:block;width:100%;aspect-ratio:16 / 9;"></div>
<script>
(function(){
  "use strict";
  var __cs = document.currentScript;
  var host = (__cs && __cs.previousElementSibling
    && __cs.previousElementSibling.getAttribute
    && __cs.previousElementSibling.getAttribute('data-cargo-gradient') !== null)
    ? __cs.previousElementSibling : null;
  if(!host){
    var __all=document.querySelectorAll('[data-cargo-gradient]');
    for(var __i=0;__i<__all.length;__i++){ if(!__all[__i].getAttribute('data-cargo-ready')){ host=__all[__i]; break; } }
  }
  if(!host || host.getAttribute('data-cargo-ready')) return;
  host.setAttribute('data-cargo-ready','1');
  var root = host.attachShadow ? host.attachShadow({mode:'open'}) : host;
  var style=document.createElement('style');
  style.textContent = (root===host
    ? '[data-cargo-gradient]{position:relative;overflow:hidden}'
    : ':host{position:relative;display:block;overflow:hidden}')
    + ' canvas{position:absolute;top:0;left:0;width:100%;height:100%;display:block}';
  root.appendChild(style);
  var canvas=document.createElement('canvas');
  root.appendChild(canvas);
  var mount=root;
  try {
${emitPayload(shaderId, config)}
${CORE_JS}
  } catch(e) { /* never throw into the host page */ if(window.console) console.error('[cargo-gradient]', e); }
})();
</script>`;
}
