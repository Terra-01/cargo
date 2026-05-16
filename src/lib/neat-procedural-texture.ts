// Procedural texture generator — verbatim port of Neat's
// `_createProceduralTexture()` (https://github.com/FireCMSco/neat,
// MIT + Commons Clause, lib/src/NeatGradient.ts). It is a Canvas2D generator,
// NOT a shader pass: it draws to an offscreen 1024×1024 2D canvas and the
// runtime uploads that canvas as a GL texture once per parameter change.
//
// The seeded RNG (`Math.sin(seed++) * 10000`), the `setSeed(50000)` isolation
// for the masking pass, the exact iteration counts and magic numbers are all
// preserved — the look is deterministic on `textureSeed`.

export interface ProceduralTextureParams {
  colors: { color: string; enabled: boolean }[];
  textureSeed: number;
  textureColorBlending: number;
  textureVoidLikelihood: number;
  textureVoidWidthMin: number;
  textureVoidWidthMax: number;
  textureBandDensity: number;
  proceduralBackgroundColor: string;
  textureShapeTriangles: number;
  textureShapeCircles: number;
  textureShapeBars: number;
  textureShapeSquiggles: number;
}

/** Returns a 1024×1024 canvas ready to upload as a GL texture. */
export function createProceduralTexture(
  params: ProceduralTextureParams
): HTMLCanvasElement {
  const texSize = 1024;
  const sourceCanvas = document.createElement('canvas');
  sourceCanvas.width = texSize;
  sourceCanvas.height = texSize;
  const sCtx = sourceCanvas.getContext('2d', { willReadFrequently: true });

  const baseColor = params.proceduralBackgroundColor || '#000000';

  const blank = (): HTMLCanvasElement => {
    const c = document.createElement('canvas');
    c.width = texSize;
    c.height = texSize;
    const cx = c.getContext('2d');
    if (cx) {
      cx.fillStyle = baseColor;
      cx.fillRect(0, 0, texSize, texSize);
    }
    return c;
  };

  if (!sCtx) return blank();

  let seed = params.textureSeed;
  const baseSeed = params.textureSeed;

  function random() {
    const x = Math.sin(seed++) * 10000;
    return x - Math.floor(x);
  }

  // Helper to reset seed for isolated shape generation
  const setSeed = (offset: number) => {
    seed = baseSeed + offset;
  };

  const colors = params.colors.filter((c) => c.enabled).map((c) => c.color);
  if (colors.length === 0) return blank();

  function hexToRgb(hex: string) {
    const bigint = parseInt(hex.replace('#', ''), 16);
    return {
      r: (bigint >> 16) & 255,
      g: (bigint >> 8) & 255,
      b: bigint & 255,
    };
  }

  function rgbToHex(r: number, g: number, b: number) {
    return (
      '#' +
      ((1 << 24) + (Math.round(r) << 16) + (Math.round(g) << 8) + Math.round(b))
        .toString(16)
        .slice(1)
    );
  }

  const getInterColor = () => {
    const c1 = colors[Math.floor(random() * colors.length)];
    const c2 = colors[Math.floor(random() * colors.length)];
    const mix = random() * params.textureColorBlending;
    const rgb1 = hexToRgb(c1);
    const rgb2 = hexToRgb(c2);
    const r = rgb1.r + (rgb2.r - rgb1.r) * mix;
    const g = rgb1.g + (rgb2.g - rgb1.g) * mix;
    const b = rgb1.b + (rgb2.b - rgb1.b) * mix;
    return rgbToHex(r, g, b);
  };

  // === SOURCE CANVAS ===
  sCtx.fillStyle = baseColor;
  sCtx.fillRect(0, 0, texSize, texSize);

  const bgGrad = sCtx.createLinearGradient(0, 0, 0, texSize);
  bgGrad.addColorStop(0, getInterColor());
  bgGrad.addColorStop(1, getInterColor());
  sCtx.fillStyle = bgGrad;
  sCtx.fillRect(0, 0, texSize, texSize);

  // Triangles
  for (let i = 0; i < params.textureShapeTriangles; i++) {
    sCtx.fillStyle = getInterColor();
    sCtx.beginPath();
    const x = random() * texSize;
    const y = random() * texSize;
    const s = 100 + random() * 300;
    sCtx.moveTo(x, y);
    sCtx.lineTo(x + (random() - 0.5) * s, y + (random() - 0.5) * s);
    sCtx.lineTo(x + (random() - 0.5) * s, y + (random() - 0.5) * s);
    sCtx.fill();
  }

  // Circles / rings
  for (let i = 0; i < params.textureShapeCircles; i++) {
    sCtx.strokeStyle = getInterColor();
    sCtx.lineWidth = 10 + random() * 50;
    sCtx.beginPath();
    const x = random() * texSize;
    const y = random() * texSize;
    const r = 50 + random() * 150;
    sCtx.arc(x, y, r, 0, Math.PI * 2);
    sCtx.stroke();
  }

  // Bars
  for (let i = 0; i < params.textureShapeBars; i++) {
    sCtx.fillStyle = getInterColor();
    sCtx.save();
    sCtx.translate(random() * texSize, random() * texSize);
    sCtx.rotate(random() * Math.PI);
    sCtx.fillRect(-150, -25, 300, 50);
    sCtx.restore();
  }

  // Squiggles
  sCtx.lineWidth = 15;
  sCtx.lineCap = 'round';
  for (let i = 0; i < params.textureShapeSquiggles; i++) {
    sCtx.strokeStyle = getInterColor();
    sCtx.beginPath();
    let x = random() * texSize;
    let y = random() * texSize;
    sCtx.moveTo(x, y);
    for (let j = 0; j < 4; j++) {
      sCtx.bezierCurveTo(
        x + (random() - 0.5) * 300,
        y + (random() - 0.5) * 300,
        x + (random() - 0.5) * 300,
        y + (random() - 0.5) * 300,
        x + (random() - 0.5) * 300,
        y + (random() - 0.5) * 300
      );
      x += (random() - 0.5) * 300;
      y += (random() - 0.5) * 300;
    }
    sCtx.stroke();
  }

  // === MASKED CANVAS ===
  setSeed(50000);
  const canvas = document.createElement('canvas');
  canvas.width = texSize;
  canvas.height = texSize;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) return blank();

  ctx.fillStyle = baseColor;
  ctx.fillRect(0, 0, texSize, texSize);

  let layoutHead = 0;
  const segments: Array<{ type: 'void' | 'matter'; x: number; width: number }> = [];

  while (layoutHead < texSize) {
    const isVoid = random() < params.textureVoidLikelihood;
    if (isVoid) {
      const w =
        params.textureVoidWidthMin +
        random() * (params.textureVoidWidthMax - params.textureVoidWidthMin);
      segments.push({ type: 'void', x: layoutHead, width: w });
      layoutHead += w;
    } else {
      const w = 50 + random() * 200;
      segments.push({ type: 'matter', x: layoutHead, width: w });
      layoutHead += w;
    }
  }

  for (const seg of segments) {
    if (seg.type === 'matter') {
      const startX = seg.x;
      const endX = Math.min(seg.x + seg.width, texSize);
      let currentX = startX;

      while (currentX < endX) {
        const stripeWidth = (2 + random() * 20) / params.textureBandDensity;
        const sourceX = Math.floor(random() * texSize);
        ctx.drawImage(
          sourceCanvas,
          sourceX,
          0,
          stripeWidth,
          texSize,
          currentX,
          0,
          stripeWidth,
          texSize
        );
        currentX += stripeWidth;
      }
    }
    // void segments: leave as baseColor
  }

  return canvas;
}
