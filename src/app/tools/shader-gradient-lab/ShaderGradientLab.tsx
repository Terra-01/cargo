'use client';
import { useEffect, useMemo, useRef, useState } from 'react';
import { ShaderRuntime } from '@/lib/shader-runtime';
import { getProgramById, shaderPrograms } from '@/lib/shader-program';
import { DEFAULT_CONFIG } from '@/lib/shader-types';
import type { ShaderConfig, TextOverlayConfig } from '@/lib/shader-types';
import { applyPreset } from '@/lib/shader-presets';
import type { ShaderPreset } from '@/lib/shader-presets';
import {
  buildStandaloneHtml,
  buildEmbedSnippet,
  buildConfigJson,
} from '@/lib/standalone-export';
import { ShaderControls } from './ShaderControls';
import { TextOverlay, drawTextOverlay } from './TextOverlay';
import { BottomToolbar } from './BottomToolbar';
import { SwatchGrid } from './SwatchGrid';
import { DialsModal } from './DialsModal';

export function ShaderGradientLab() {
  const [shaderId, setShaderId] = useState('neat-gradient');
  const [config, setConfig] = useState<ShaderConfig>(DEFAULT_CONFIG);
  const [activePresetId, setActivePresetId] = useState<string | null>('neat');
  const [glError, setGlError] = useState<string | null>(null);
  const [fps, setFps] = useState(0);
  const [dialsOpen, setDialsOpen] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const runtimeRef = useRef<ShaderRuntime | null>(null);

  const program = useMemo(
    () => getProgramById(shaderId) ?? shaderPrograms[0],
    [shaderId]
  );

  // Create the runtime once. The canvas is always mounted, so the runtime
  // persists for the lifetime of the tool.
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    try {
      const rt = new ShaderRuntime(canvas, program, config);
      runtimeRef.current = rt;
      rt.start_();
    } catch (err) {
      setGlError(err instanceof Error ? err.message : 'WebGL2 unavailable.');
    }
    const fpsTimer = window.setInterval(() => {
      const rt = runtimeRef.current;
      if (!rt) return;
      setFps(rt.getFps());
    }, 500);
    return () => {
      window.clearInterval(fpsTimer);
      runtimeRef.current?.destroy();
      runtimeRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Hot-swap the program when the shader changes.
  useEffect(() => {
    if (!runtimeRef.current) return;
    try {
      runtimeRef.current.setProgram(program);
      setGlError(null);
    } catch (err) {
      setGlError(err instanceof Error ? err.message : 'Shader compile failed.');
    }
  }, [program]);

  // Push config every change.
  useEffect(() => {
    runtimeRef.current?.setConfig(config);
  }, [config]);

  const handlePickShader = (id: string) => {
    setShaderId(id);
    if (id !== 'neat-gradient') {
      setActivePresetId(null);
      // Curated shaders (Rainbow Warp / Ether) have no preset config of
      // their own — give them a sensible default resolution on selection.
      setConfig((prev) => ({ ...prev, resolution: 0.7 }));
    }
  };

  const handlePreset = (preset: ShaderPreset) => {
    setShaderId('neat-gradient');
    // Preset is a full config reset, but the text overlay is shader-
    // independent and user-owned — preserve it across preset switches.
    setConfig((prev) => ({ ...applyPreset(preset), textOverlay: prev.textOverlay }));
    setActivePresetId(preset.id);
  };

  const handleChange = (patch: Partial<ShaderConfig>) => {
    setConfig((prev) => ({ ...prev, ...patch }));
    setActivePresetId(null);
  };

  const handleTextChange = (text: string) => {
    setConfig((prev) => ({ ...prev, textOverlay: { ...prev.textOverlay, text } }));
  };

  const handleTextStyleChange = (patch: Partial<TextOverlayConfig>) => {
    setConfig((prev) => ({
      ...prev,
      textOverlay: { ...prev.textOverlay, ...patch },
    }));
  };

  const triggerDownload = (href: string) => {
    const a = document.createElement('a');
    a.href = href;
    a.download = `shader-${shaderId}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleDownload = () => {
    const rt = runtimeRef.current;
    const canvas = canvasRef.current;
    if (!rt || !canvas) return;
    const url = rt.captureFrame();
    const overlay = config.textOverlay;
    if (!overlay.text) {
      triggerDownload(url);
      return;
    }
    const img = new Image();
    img.onload = () => {
      const c = document.createElement('canvas');
      c.width = img.naturalWidth;
      c.height = img.naturalHeight;
      const ctx = c.getContext('2d');
      if (!ctx) {
        triggerDownload(url);
        return;
      }
      ctx.drawImage(img, 0, 0);
      const cssW = canvas.clientWidth || img.naturalWidth;
      const scale = img.naturalWidth / cssW;
      drawTextOverlay(ctx, c.width, c.height, overlay, scale);
      triggerDownload(c.toDataURL('image/png'));
    };
    img.onerror = () => triggerDownload(url);
    img.src = url;
  };

  const downloadBlob = (content: string, type: string, filename: string) => {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const lookName = `shader-${activePresetId ?? shaderId}`;

  const handleExportHtml = () => {
    downloadBlob(
      buildStandaloneHtml(shaderId, config),
      'text/html',
      `${lookName}.html`
    );
  };

  const handleCopySnippet = () => {
    const snippet = buildEmbedSnippet(shaderId, config);
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(snippet).catch(() => {
        /* clipboard blocked — confirmation still shows; user can re-try */
      });
    }
  };

  const handleExportJson = () => {
    downloadBlob(
      buildConfigJson(shaderId, config),
      'application/json',
      `${lookName}.json`
    );
  };

  return (
    <div className="sg-lab">
      <style>{`
        .sg-lab { display: flex; flex-direction: column; gap: var(--space-4); }

        /* Shared frosted-glass surface: a translucent panel kept LEGIBLE over
           bright / high-saturation shaders by stacking a soft adaptive dark
           wash over the tinted glass + a stronger blur and depth shadow.
           Still see-through — just no longer washed out. */
        .sg-glass,
        .sg-toolbar,
        .sg-swatches,
        .sg-modal,
        .sg-look__popover {
          background:
            linear-gradient(rgba(8, 8, 11, 0.46), rgba(8, 8, 11, 0.46)),
            var(--glass-bg);
          border: 1px solid var(--glass-border);
          box-shadow:
            0 12px 44px rgba(0, 0, 0, 0.52),
            inset 0 1px 0 rgba(255, 255, 255, 0.09);
          backdrop-filter: blur(calc(var(--glass-blur) * 1.7)) saturate(140%);
          -webkit-backdrop-filter: blur(calc(var(--glass-blur) * 1.7)) saturate(140%);
        }
        @media (prefers-color-scheme: light) {
          .sg-glass,
          .sg-toolbar,
          .sg-swatches,
          .sg-modal,
          .sg-look__popover {
            background:
              linear-gradient(rgba(255, 255, 255, 0.34), rgba(255, 255, 255, 0.34)),
              var(--glass-bg);
          }
        }

        /* ---- the gradient canvas: the hero ---- */
        .sg-stage {
          position: relative;
          height: clamp(420px, 70vh, 760px);
          border-radius: var(--radius-lg);
          overflow: hidden;
          border: 1px solid var(--border);
          background: #000;
        }
        .sg-canvas { width: 100%; height: 100%; display: block; }
        .sg-error {
          position: absolute; inset: 0;
          display: flex; align-items: center; justify-content: center;
          text-align: center; padding: var(--space-6);
          font-family: var(--font-mono); font-size: var(--text-sm);
          color: var(--text-muted);
        }
        /* ---- glass bottom toolbar ---- */
        .sg-toolbar {
          display: flex; align-items: center; justify-content: space-between;
          gap: var(--space-4); flex-wrap: wrap;
          padding: var(--space-3) var(--space-4);
          border-radius: var(--radius-lg);
        }
        .sg-toolbar__group {
          display: flex; align-items: center; gap: var(--space-3);
          flex-wrap: wrap;
        }
        .sg-toolbar__group--center {
          gap: var(--space-2); flex: 1 1 auto; justify-content: center;
        }
        .sg-toolbar__group--right { flex: none; justify-content: flex-end; }
        .sg-toolbar__div {
          width: 1px; height: 22px; flex: none;
          background: var(--glass-border);
        }
        .sg-toolbar__text {
          font-family: var(--font-mono); font-size: var(--text-xs);
          padding: 8px 12px; min-width: 170px;
          background: rgba(0, 0, 0, 0.34); color: var(--text);
          border: 1px solid var(--border-strong);
          border-radius: var(--radius-md);
        }
        .sg-toolbar__text::placeholder { color: var(--text-faint); }
        .sg-toolbar__text:focus {
          outline: none; border-color: var(--accent);
          background: rgba(0, 0, 0, 0.46);
        }
        .sg-toolbar__btn {
          font-family: var(--font-mono); font-size: var(--text-xs);
          letter-spacing: 0.02em; white-space: nowrap;
          padding: 8px 14px; border-radius: var(--radius-md);
          border: 1px solid var(--border-strong);
          background: rgba(0, 0, 0, 0.28); color: var(--text);
          text-shadow: 0 1px 1px rgba(0, 0, 0, 0.5);
          cursor: pointer; transition: all var(--t-fast) var(--ease);
        }
        .sg-toolbar__btn:hover {
          color: var(--text); border-color: var(--text);
          background: rgba(0, 0, 0, 0.42);
        }
        .sg-toolbar__btn--icon { padding: 8px 12px; }
        .sg-toolbar__btn--primary {
          border-color: var(--accent); color: var(--accent);
        }
        .sg-toolbar__btn--primary:hover {
          border-color: var(--accent); color: var(--accent-hover);
        }
        .sg-toolbar__btn[data-copied="true"] {
          border-color: var(--accent); color: var(--accent);
        }
        /* ---- popovers / look picker shell (Aa typography popover) ---- */
        .sg-look { position: relative; }
        .sg-look__popover {
          position: absolute; bottom: calc(100% + 10px); left: 0;
          z-index: 20;
          width: 260px; max-height: 380px; overflow-y: auto;
          padding: var(--space-4);
          border-radius: var(--radius-lg);
        }
        .sg-textstyle-popover { left: 0; right: auto; }
        .sg-textstyle { display: flex; flex-direction: column; gap: var(--space-4); }

        /* ---- swatch grid (always-visible look palette) ---- */
        .sg-swatches {
          display: flex; flex-direction: column; gap: var(--space-2);
          padding: var(--space-3) var(--space-4);
          border-radius: var(--radius-lg);
        }
        .sg-swatches__eyebrow {
          font-family: var(--font-mono); font-size: 10px;
          letter-spacing: 0.12em; text-transform: uppercase;
          color: var(--text-muted);
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.55);
        }
        .sg-swatches__strip {
          display: flex; align-items: stretch; gap: var(--space-3);
          overflow-x: auto; overflow-y: hidden;
          padding-bottom: 6px;
          scrollbar-width: thin;
          scrollbar-color: var(--glass-border) transparent;
        }
        .sg-swatches__strip::-webkit-scrollbar { height: 7px; }
        .sg-swatches__strip::-webkit-scrollbar-thumb {
          background: var(--glass-border); border-radius: var(--radius-pill);
        }
        .sg-swatches__divider {
          flex: none; align-self: center;
          writing-mode: vertical-rl; transform: rotate(180deg);
          font-family: var(--font-mono); font-size: 9px;
          letter-spacing: 0.18em; text-transform: uppercase;
          color: var(--text-faint);
          padding: 0 var(--space-2);
          border-left: 1px solid var(--glass-border);
        }
        .sg-swatch {
          flex: none; width: 96px;
          display: flex; flex-direction: column; gap: 6px;
          padding: 5px; border-radius: var(--radius-md);
          border: 1px solid transparent; background: transparent;
          cursor: pointer; transition: all var(--t-fast) var(--ease);
        }
        .sg-swatch:hover { transform: translateY(-2px); }
        .sg-swatch__img {
          display: block; width: 100%; height: 54px;
          border-radius: var(--radius-sm); overflow: hidden;
          border: 1px solid var(--border-strong);
          background-size: cover; position: relative;
          transition: border-color var(--t-fast) var(--ease),
            box-shadow var(--t-fast) var(--ease);
        }
        .sg-swatch__img img {
          width: 100%; height: 100%; object-fit: cover; display: block;
        }
        .sg-swatch:hover .sg-swatch__img {
          border-color: var(--text);
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.5);
        }
        .sg-swatch__name {
          font-family: var(--font-mono); font-size: 10px;
          letter-spacing: 0.02em;
          color: var(--text-muted);
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.6);
          text-align: center;
          overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
          transition: color var(--t-fast) var(--ease);
        }
        .sg-swatch:hover .sg-swatch__name { color: var(--text); }
        .sg-swatch[data-active="true"] .sg-swatch__img {
          border-color: var(--accent);
          box-shadow: 0 0 0 2px var(--accent), 0 6px 20px rgba(0, 0, 0, 0.5);
        }
        .sg-swatch[data-active="true"] .sg-swatch__name {
          color: var(--accent);
        }

        /* ---- dials modal (glass, OVER the live gradient) ---- */
        .sg-modal-backdrop {
          position: absolute; inset: 0; z-index: 10;
          display: flex; align-items: stretch; justify-content: flex-end;
          padding: var(--space-4);
        }
        .sg-modal {
          width: min(420px, 100%);
          display: flex; flex-direction: column;
          border-radius: var(--radius-lg);
          overflow: hidden;
        }
        .sg-modal__head {
          display: flex; align-items: center; justify-content: space-between;
          padding: var(--space-4) var(--space-5);
          border-bottom: 1px solid var(--glass-border);
        }
        .sg-modal__title {
          font-family: var(--font-mono); font-size: 10px;
          letter-spacing: 0.12em; text-transform: uppercase;
          color: var(--text);
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.6);
        }
        .sg-modal__close {
          font-family: var(--font-mono); font-size: var(--text-sm);
          background: none; border: none; color: var(--text);
          cursor: pointer; padding: 4px 8px; border-radius: var(--radius-sm);
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.6);
        }
        .sg-modal__close:hover { color: var(--accent); }
        .sg-modal__body { padding: var(--space-5); overflow-y: auto; }

        /* ---- dial controls (reused inside the modal) ---- */
        .sg-controls { display: flex; flex-direction: column; gap: var(--space-5); }
        .sg-group { display: flex; flex-direction: column; gap: var(--space-4); }
        .sg-group__title {
          font-family: var(--font-mono); font-size: 10px;
          letter-spacing: 0.12em; text-transform: uppercase;
          color: var(--text);
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.55);
          border-bottom: 1px solid var(--glass-border);
          padding-bottom: var(--space-2);
        }
        .sg-controls .field__label {
          color: var(--text);
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
        }
        .sg-controls .field__value { color: var(--accent); }
        .sg-field[data-disabled="true"] { opacity: 0.4; pointer-events: none; }
        .sg-field input[type="range"]:disabled,
        .sg-field button:disabled,
        .sg-field input[type="color"]:disabled { cursor: not-allowed; }
        .sg-stops { display: flex; flex-wrap: wrap; gap: var(--space-2); }
        .sg-stop { display: flex; flex-direction: column; align-items: center; gap: 4px; }
        .sg-stop__color {
          width: 34px; height: 28px; padding: 0;
          border: 1px solid var(--border-strong);
          border-radius: var(--radius-sm); background: none; cursor: pointer;
        }
        .sg-stop__toggle, .sg-toggle {
          font-family: var(--font-mono); font-size: 9px;
          letter-spacing: 0.06em; text-transform: uppercase;
          padding: 3px 8px; border-radius: var(--radius-sm);
          border: 1px solid var(--border-strong);
          background: rgba(0, 0, 0, 0.3); color: var(--text); cursor: pointer;
        }
        .sg-toggle { padding: 6px 14px; font-size: 11px; align-self: flex-start; }
        .sg-stop__toggle[data-on="true"], .sg-toggle[data-on="true"] {
          background: var(--accent); border-color: var(--accent); color: #fff;
        }
        .sg-text-style { display: flex; gap: var(--space-2); }
        .sg-text-grid {
          display: grid; grid-template-columns: repeat(3, 1fr);
          gap: 4px; width: 84px;
        }
        .sg-text-grid__cell {
          aspect-ratio: 1; border: 1px solid var(--border-strong);
          border-radius: var(--radius-sm); background: rgba(0, 0, 0, 0.3);
          cursor: pointer; padding: 0;
        }
        .sg-text-grid__cell[data-on="true"] {
          background: var(--accent); border-color: var(--accent);
        }

        /* Fixed-width box sized for "1440 fps" so the toolbar never shifts as
           the digit count changes (1 → 3 → 4 digits). */
        .sg-fps {
          display: inline-flex; align-items: baseline;
          justify-content: flex-end; gap: 5px;
          box-sizing: border-box;
          min-width: 92px;
          padding: 7px 12px;
          border: 1px solid var(--border-strong);
          border-radius: var(--radius-md);
          background: rgba(0, 0, 0, 0.28);
          font-family: var(--font-mono); font-size: var(--text-xs);
          color: var(--text-muted); letter-spacing: 0.03em;
          font-variant-numeric: tabular-nums; white-space: nowrap;
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.6);
        }
        .sg-fps strong { color: var(--text); font-weight: 600; }

        @media (max-width: 860px) {
          .sg-toolbar { justify-content: center; }
          .sg-toolbar__group--center { order: 3; flex-basis: 100%; }
        }
        @media (max-width: 720px) {
          .sg-modal-backdrop { justify-content: stretch; }
          .sg-modal { width: 100%; }
        }
      `}</style>

      <div className="sg-stage">
        {glError ? (
          <div className="sg-error" data-testid="sg-error">{glError}</div>
        ) : (
          <>
            <canvas
              ref={canvasRef}
              className="sg-canvas"
              data-testid="sg-canvas"
              aria-label="Shader gradient preview"
            />
            <TextOverlay overlay={config.textOverlay} />
          </>
        )}

        {dialsOpen && !glError && (
          <DialsModal onClose={() => setDialsOpen(false)}>
            <ShaderControls
              program={program}
              config={config}
              onChange={handleChange}
            />
          </DialsModal>
        )}
      </div>

      <BottomToolbar
        textOverlay={config.textOverlay}
        fps={fps}
        onTextChange={handleTextChange}
        onTextStyleChange={handleTextStyleChange}
        onEditDials={() => setDialsOpen(true)}
        onDownload={handleDownload}
        onExportHtml={handleExportHtml}
        onCopySnippet={handleCopySnippet}
        onExportJson={handleExportJson}
      />
      <SwatchGrid
        shaderId={shaderId}
        activePresetId={activePresetId}
        onPickPreset={handlePreset}
        onPickShader={handlePickShader}
      />
    </div>
  );
}
