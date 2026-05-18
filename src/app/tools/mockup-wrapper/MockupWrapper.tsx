'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import {
  backgroundPresets,
  frameStyles,
  type FrameStyle,
} from '@/lib/mockup-frames';

const CANVAS_WIDTH = 800;   // logical px; rendered at 2× for retina
const CANVAS_HEIGHT = 600;

// — Canvas path helpers — pure, stateless, kept at module scope so they are
// not redeclared per render and are defined before the draw effect uses them.
function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y,     x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x,     y + h, r);
  ctx.arcTo(x,     y + h, x,     y,     r);
  ctx.arcTo(x,     y,     x + w, y,     r);
  ctx.closePath();
}
function roundRectTopOnly(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.arcTo(x + w, y, x + w, y + r, r);
  ctx.lineTo(x + w, y + h);
  ctx.lineTo(x, y + h);
  ctx.lineTo(x, y + r);
  ctx.arcTo(x, y, x + r, y, r);
  ctx.closePath();
}
function roundRectBottomOnly(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x + w, y);
  ctx.lineTo(x + w, y + h - r);
  ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
  ctx.lineTo(x + r, y + h);
  ctx.arcTo(x, y + h, x, y + h - r, r);
  ctx.closePath();
}

export function MockupWrapper() {
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [imageName, setImageName] = useState<string>('');
  const [frame, setFrame] = useState<FrameStyle>('browser');
  const [backgroundId, setBackgroundId] = useState<string>('dusk');
  const [padding, setPadding] = useState<number>(48);
  const [shadow, setShadow] = useState<boolean>(true);
  const [shadowDepth, setShadowDepth] = useState<number>(40);
  const [radius, setRadius] = useState<number>(12);
  const [dragOver, setDragOver] = useState<boolean>(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // — Load file into Image —
  const loadFile = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) return;
    setImageName(file.name);
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => setImage(img);
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) loadFile(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) loadFile(file);
  };

  // — Render to canvas —
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = 2; // export at 2× — display canvas is scaled via CSS
    canvas.width = CANVAS_WIDTH * dpr;
    canvas.height = CANVAS_HEIGHT * dpr;
    canvas.style.width = '100%';
    canvas.style.maxWidth = `${CANVAS_WIDTH}px`;
    canvas.style.aspectRatio = `${CANVAS_WIDTH} / ${CANVAS_HEIGHT}`;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // — Background —
    const preset = backgroundPresets.find((p) => p.id === backgroundId);
    if (preset?.background) {
      if (preset.background.startsWith('linear-gradient')) {
        // Parse the two endpoints of the gradient (we only support 135deg here)
        const match = preset.background.match(/#[0-9A-Fa-f]{6}/g);
        if (match && match.length >= 2) {
          const grad = ctx.createLinearGradient(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
          match.forEach((color, i) => {
            grad.addColorStop(i / (match.length - 1), color);
          });
          ctx.fillStyle = grad;
        } else {
          ctx.fillStyle = '#FAFAF7';
        }
      } else {
        ctx.fillStyle = preset.background;
      }
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    }
    // If transparent, leave the cleared canvas as-is.

    if (!image) {
      // Empty state hint on the canvas itself
      ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
      ctx.font = '14px ui-monospace, monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('drop a screenshot here', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);
      return;
    }

    // — Image fit (contain inside padded area) —
    const chromeHeight = frame === 'browser' ? 32 : 0;
    const availW = CANVAS_WIDTH - padding * 2;
    const availH = CANVAS_HEIGHT - padding * 2 - chromeHeight;
    const imgRatio = image.width / image.height;
    const availRatio = availW / availH;
    let drawW = availW;
    let drawH = availH;
    if (imgRatio > availRatio) {
      drawH = availW / imgRatio;
    } else {
      drawW = availH * imgRatio;
    }
    const x = (CANVAS_WIDTH - drawW) / 2;
    const y = (CANVAS_HEIGHT - drawH - chromeHeight) / 2;

    // — Shadow (applied to the whole frame, not the image alone) —
    if (shadow) {
      ctx.save();
      ctx.shadowColor = 'rgba(0, 0, 0, 0.25)';
      ctx.shadowBlur = shadowDepth;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = shadowDepth / 3;
      // Draw a shape under the frame to cast the shadow, then clear
      ctx.fillStyle = '#FFFFFF';
      roundRect(ctx, x, y, drawW, drawH + chromeHeight, radius);
      ctx.fill();
      ctx.restore();
    }

    // — Frame chrome —
    if (frame === 'browser') {
      // Mac-style title bar
      ctx.fillStyle = '#E5E5E5';
      roundRectTopOnly(ctx, x, y, drawW, chromeHeight, radius);
      ctx.fill();
      // Traffic lights
      const dotY = y + chromeHeight / 2;
      const dotR = 5;
      ctx.fillStyle = '#FF5F57'; ctx.beginPath(); ctx.arc(x + 14, dotY, dotR, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#FEBC2E'; ctx.beginPath(); ctx.arc(x + 30, dotY, dotR, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#28C840'; ctx.beginPath(); ctx.arc(x + 46, dotY, dotR, 0, Math.PI * 2); ctx.fill();
    }

    // — Image (clipped to the frame's body shape) —
    ctx.save();
    if (frame === 'browser') {
      // Bottom-only rounded rect for the image body
      roundRectBottomOnly(ctx, x, y + chromeHeight, drawW, drawH, radius);
    } else {
      // 'card' — just a rounded rect
      roundRect(ctx, x, y, drawW, drawH, radius);
    }
    ctx.clip();
    ctx.drawImage(image, x, y + chromeHeight, drawW, drawH);
    ctx.restore();
  }, [image, frame, backgroundId, padding, shadow, shadowDepth, radius]);

  // — Export —
  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `cargo-mockup-${Date.now()}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 'image/png');
  };

  return (
    <>
      <style>{`
        .mw-drop {
          border: 1.5px dashed var(--border-strong);
          border-radius: var(--radius-md);
          padding: var(--space-5);
          text-align: center;
          cursor: pointer;
          transition: border-color var(--t-fast) var(--ease), background var(--t-fast) var(--ease);
          font-family: var(--font-mono);
          font-size: var(--text-xs);
          color: var(--text-muted);
          letter-spacing: 0.02em;
        }
        .mw-drop:hover, .mw-drop[data-drag-over="true"] {
          border-color: var(--accent);
          background: var(--accent-soft);
          color: var(--text);
        }
        .mw-drop__filename {
          color: var(--text);
          margin-top: var(--space-2);
          word-break: break-all;
        }
        .mw-canvas-wrap {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: var(--radius-lg);
          padding: var(--space-5);
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 440px;
        }
        .mw-canvas {
          display: block;
          background-image:
            linear-gradient(45deg, var(--surface-muted) 25%, transparent 25%),
            linear-gradient(-45deg, var(--surface-muted) 25%, transparent 25%),
            linear-gradient(45deg, transparent 75%, var(--surface-muted) 75%),
            linear-gradient(-45deg, transparent 75%, var(--surface-muted) 75%);
          background-size: 16px 16px;
          background-position: 0 0, 0 8px, 8px -8px, -8px 0;
          border-radius: var(--radius-md);
        }
        .mw-bg-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: var(--space-2);
        }
        .mw-bg-swatch {
          aspect-ratio: 1.4;
          border-radius: var(--radius-sm);
          border: 1.5px solid transparent;
          cursor: pointer;
          background-clip: padding-box;
          transition: border-color var(--t-fast) var(--ease), transform var(--t-fast) var(--ease);
          position: relative;
          background-color: transparent;
        }
        .mw-bg-swatch:hover { transform: translateY(-1px); }
        .mw-bg-swatch[data-active="true"] { border-color: var(--accent); }
        .mw-bg-swatch--transparent {
          background-image:
            linear-gradient(45deg, var(--surface-muted) 25%, transparent 25%),
            linear-gradient(-45deg, var(--surface-muted) 25%, transparent 25%),
            linear-gradient(45deg, transparent 75%, var(--surface-muted) 75%),
            linear-gradient(-45deg, transparent 75%, var(--surface-muted) 75%);
          background-size: 8px 8px;
          background-position: 0 0, 0 4px, 4px -4px, -4px 0;
        }
      `}</style>
      <div className="lab">
        <div className="lab__panel panel" data-testid="mw-panel">
          <p className="panel__title"><span>upload</span></p>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            style={{ display: 'none' }}
            data-testid="mw-file-input"
          />
          <div
            className="mw-drop"
            data-drag-over={dragOver || undefined}
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            data-testid="mw-drop"
          >
            <span>{image ? 'click or drop to replace' : 'click or drop a screenshot'}</span>
            {imageName && (
              <div className="mw-drop__filename">{imageName}</div>
            )}
          </div>

          <p className="panel__title" style={{ marginTop: 'var(--space-6)' }}><span>frame</span></p>
          <div className="tint-toggle" role="group" aria-label="Frame style">
            {frameStyles.map((f) => (
              <button
                key={f.id}
                type="button"
                className={`tint-toggle__option ${frame === f.id ? 'tint-toggle__option--active' : ''}`}
                onClick={() => setFrame(f.id)}
                data-testid={`mw-frame-${f.id}`}
              >
                {f.label}
              </button>
            ))}
          </div>

          <p className="panel__title" style={{ marginTop: 'var(--space-6)' }}><span>background</span></p>
          <div className="mw-bg-grid">
            {backgroundPresets.map((p) => (
              <button
                key={p.id}
                type="button"
                className={`mw-bg-swatch ${p.id === 'transparent' ? 'mw-bg-swatch--transparent' : ''}`}
                onClick={() => setBackgroundId(p.id)}
                data-active={backgroundId === p.id || undefined}
                data-testid={`mw-bg-${p.id}`}
                aria-label={p.label}
                style={p.background ? { background: p.background } : undefined}
                title={p.label}
              />
            ))}
          </div>

          <div className="field" style={{ marginTop: 'var(--space-6)' }}>
            <label className="field__label" htmlFor="mw-padding">
              <span>padding</span>
              <span className="field__value" data-testid="mw-padding-value">{padding}px</span>
            </label>
            <input
              id="mw-padding"
              type="range"
              min={16}
              max={120}
              step={4}
              value={padding}
              onChange={(e) => setPadding(Number(e.target.value))}
              className="slider"
              data-testid="mw-padding-slider"
            />
          </div>

          <div className="field" style={{ marginTop: 'var(--space-5)' }}>
            <label className="field__label" htmlFor="mw-radius">
              <span>radius</span>
              <span className="field__value">{radius}px</span>
            </label>
            <input
              id="mw-radius"
              type="range"
              min={0}
              max={32}
              step={1}
              value={radius}
              onChange={(e) => setRadius(Number(e.target.value))}
              className="slider"
            />
          </div>

          <div className="field" style={{ marginTop: 'var(--space-5)' }}>
            <div className="bool-toggle">
              <label className="field__label" style={{ margin: 0 }}>
                <span>shadow</span>
              </label>
              <button
                type="button"
                className={`bool-toggle__btn ${shadow ? 'bool-toggle__btn--on' : ''}`}
                onClick={() => setShadow((s) => !s)}
                aria-pressed={shadow}
                data-testid="mw-shadow-toggle"
              >
                {shadow ? 'on' : 'off'}
              </button>
            </div>
          </div>

          {shadow && (
            <div className="field" style={{ marginTop: 'var(--space-4)' }}>
              <label className="field__label" htmlFor="mw-shadow-depth">
                <span>shadow depth</span>
                <span className="field__value">{shadowDepth}px</span>
              </label>
              <input
                id="mw-shadow-depth"
                type="range"
                min={0}
                max={80}
                step={2}
                value={shadowDepth}
                onChange={(e) => setShadowDepth(Number(e.target.value))}
                className="slider"
              />
            </div>
          )}
        </div>

        <div className="lab__preview-wrap">
          <div className="mw-canvas-wrap">
            <canvas
              ref={canvasRef}
              className="mw-canvas"
              data-testid="mw-canvas"
            />
          </div>
        </div>

        <div className="lab__code-wrap">
          <button
            type="button"
            className="btn btn--primary"
            onClick={handleDownload}
            disabled={!image}
            data-testid="mw-download"
            style={{ width: '100%', justifyContent: 'center', padding: '12px 16px', opacity: image ? 1 : 0.5, cursor: image ? 'pointer' : 'not-allowed' }}
          >
            {image ? 'Download PNG at 2× resolution' : 'Upload a screenshot to enable download'}
          </button>
        </div>
      </div>
    </>
  );
}
