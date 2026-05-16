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
  parseConfigJson,
} from '@/lib/standalone-export';
import { ShaderControls } from './ShaderControls';
import { TextOverlay, drawTextOverlay } from './TextOverlay';
import { BottomToolbar } from './BottomToolbar';
import { DialsModal } from './DialsModal';

export function ShaderGradientLab() {
  const [shaderId, setShaderId] = useState('neat-gradient');
  const [config, setConfig] = useState<ShaderConfig>(DEFAULT_CONFIG);
  const [activePresetId, setActivePresetId] = useState<string | null>('neat');
  const [glError, setGlError] = useState<string | null>(null);
  const [fps, setFps] = useState(0);
  const [fpsMin, setFpsMin] = useState<number | null>(null);
  const [fpsMax, setFpsMax] = useState<number | null>(null);
  const [dialsOpen, setDialsOpen] = useState(false);
  const [uiHidden, setUiHidden] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const runtimeRef = useRef<ShaderRuntime | null>(null);

  const program = useMemo(
    () => getProgramById(shaderId) ?? shaderPrograms[0],
    [shaderId]
  );

  // Create the runtime once. The canvas is always mounted (hide-UI only
  // collapses chrome), so the runtime persists across UI toggles.
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
      const v = rt.getFps();
      setFps(v);
      if (v > 0) {
        setFpsMin((m) => (m == null ? v : Math.min(m, v)));
        setFpsMax((m) => (m == null ? v : Math.max(m, v)));
      }
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

  const resetFps = () => {
    setFpsMin(null);
    setFpsMax(null);
  };

  const handlePickShader = (id: string) => {
    setShaderId(id);
    if (id !== 'neat-gradient') setActivePresetId(null);
    resetFps();
  };

  const handlePreset = (preset: ShaderPreset) => {
    setShaderId('neat-gradient');
    // Preset is a full config reset, but the text overlay is shader-
    // independent and user-owned — preserve it across preset switches.
    setConfig((prev) => ({ ...applyPreset(preset), textOverlay: prev.textOverlay }));
    setActivePresetId(preset.id);
    resetFps();
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

  const handleImportJson = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      const parsed = parseConfigJson(String(reader.result ?? ''));
      if (!parsed) return; // invalid JSON — ignore silently
      setShaderId(parsed.shaderId);
      setConfig(parsed.config);
      setActivePresetId(null);
      resetFps();
    };
    reader.readAsText(file);
  };

  return (
    <div className="sg-lab" data-ui-hidden={uiHidden ? 'true' : 'false'}>
      <style>{`
        .sg-lab { display: flex; flex-direction: column; gap: var(--space-4); }

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
        .sg-show-ui {
          position: absolute; top: var(--space-3); right: var(--space-3);
          z-index: 5;
          font-family: var(--font-mono); font-size: var(--text-xs);
          letter-spacing: 0.04em;
          padding: 6px 12px; border-radius: var(--radius-pill);
          background: var(--glass-bg);
          border: 1px solid var(--glass-border);
          color: var(--text);
          backdrop-filter: blur(var(--glass-blur));
          -webkit-backdrop-filter: blur(var(--glass-blur));
          box-shadow: var(--glass-shadow);
          cursor: pointer;
        }

        /* ---- glass bottom toolbar ---- */
        .sg-toolbar {
          display: flex; align-items: center; justify-content: space-between;
          gap: var(--space-4); flex-wrap: wrap;
          padding: var(--space-3) var(--space-4);
          border-radius: var(--radius-lg);
          background: var(--glass-bg);
          border: 1px solid var(--glass-border);
          box-shadow: var(--glass-shadow);
          backdrop-filter: blur(var(--glass-blur));
          -webkit-backdrop-filter: blur(var(--glass-blur));
        }
        .sg-toolbar__group {
          display: flex; align-items: center; gap: var(--space-3);
          flex-wrap: wrap;
        }
        .sg-toolbar__text {
          font-family: var(--font-mono); font-size: var(--text-xs);
          padding: 7px 12px; min-width: 180px;
          background: var(--surface); color: var(--text);
          border: 1px solid var(--border-strong);
          border-radius: var(--radius-md);
        }
        .sg-toolbar__text:focus { outline: none; border-color: var(--accent); }
        .sg-toolbar__btn {
          font-family: var(--font-mono); font-size: var(--text-xs);
          letter-spacing: 0.02em;
          padding: 7px 14px; border-radius: var(--radius-md);
          border: 1px solid var(--border-strong);
          background: var(--surface); color: var(--text-muted);
          cursor: pointer; transition: all var(--t-fast) var(--ease);
        }
        .sg-toolbar__btn:hover { color: var(--text); border-color: var(--text); }

        /* ---- look picker ---- */
        .sg-look { position: relative; }
        .sg-look__trigger {
          display: flex; align-items: center; gap: var(--space-2);
          font-family: var(--font-mono); font-size: var(--text-xs);
          padding: 6px 12px 6px 6px; border-radius: var(--radius-pill);
          border: 1px solid var(--border-strong);
          background: var(--surface); color: var(--text);
          cursor: pointer;
        }
        .sg-look__trigger:hover { border-color: var(--accent); }
        .sg-look__swatch {
          width: 28px; height: 18px; border-radius: var(--radius-sm);
          border: 1px solid var(--border-strong);
        }
        .sg-look__caret { color: var(--text-faint); }
        .sg-look__popover {
          position: absolute; bottom: calc(100% + 8px); left: 0;
          z-index: 20;
          width: 248px; max-height: 360px; overflow-y: auto;
          padding: var(--space-2);
          border-radius: var(--radius-lg);
          background: var(--glass-bg);
          border: 1px solid var(--glass-border);
          box-shadow: var(--glass-shadow);
          backdrop-filter: blur(calc(var(--glass-blur) * 1.4));
          -webkit-backdrop-filter: blur(calc(var(--glass-blur) * 1.4));
        }
        .sg-look__row {
          display: flex; align-items: center; gap: var(--space-3);
          width: 100%; text-align: left;
          font-family: var(--font-mono); font-size: var(--text-xs);
          padding: 6px 8px; border-radius: var(--radius-md);
          border: 1px solid transparent; background: transparent;
          color: var(--text-muted); cursor: pointer;
        }
        .sg-look__row:hover { background: var(--surface-muted); color: var(--text); }
        .sg-look__row[data-active="true"] {
          border-color: var(--accent); color: var(--accent);
        }
        .sg-look__rowswatch {
          width: 40px; height: 20px; border-radius: var(--radius-sm);
          border: 1px solid var(--border-strong); flex: none;
        }
        .sg-look__divider {
          font-family: var(--font-mono); font-size: 10px;
          letter-spacing: 0.1em; text-transform: uppercase;
          color: var(--text-faint);
          padding: var(--space-3) 8px var(--space-2);
          border-top: 1px solid var(--border);
          margin-top: var(--space-2);
        }
        .sg-textstyle-popover {
          left: auto; right: 0; width: 260px;
        }
        .sg-textstyle { display: flex; flex-direction: column; gap: var(--space-4); }

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
          background: var(--glass-bg);
          border: 1px solid var(--glass-border);
          box-shadow: var(--glass-shadow);
          backdrop-filter: blur(var(--glass-blur));
          -webkit-backdrop-filter: blur(var(--glass-blur));
          overflow: hidden;
        }
        .sg-modal__head {
          display: flex; align-items: center; justify-content: space-between;
          padding: var(--space-4) var(--space-5);
          border-bottom: 1px solid var(--border);
        }
        .sg-modal__title {
          font-family: var(--font-mono); font-size: 10px;
          letter-spacing: 0.1em; text-transform: uppercase;
          color: var(--text-faint);
        }
        .sg-modal__close {
          font-family: var(--font-mono); font-size: var(--text-sm);
          background: none; border: none; color: var(--text-muted);
          cursor: pointer; padding: 4px 8px; border-radius: var(--radius-sm);
        }
        .sg-modal__close:hover { color: var(--text); background: var(--surface-muted); }
        .sg-modal__body {
          padding: var(--space-5);
          overflow-y: auto;
        }

        /* ---- dial controls (reused inside the modal) ---- */
        .sg-controls { display: flex; flex-direction: column; gap: var(--space-5); }
        .sg-group { display: flex; flex-direction: column; gap: var(--space-4); }
        .sg-group__title {
          font-family: var(--font-mono); font-size: 10px;
          letter-spacing: 0.1em; text-transform: uppercase;
          color: var(--text-faint);
          border-bottom: 1px solid var(--border);
          padding-bottom: var(--space-2);
        }
        .sg-field[data-disabled="true"] { opacity: 0.38; pointer-events: none; }
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
          background: var(--surface); color: var(--text-muted); cursor: pointer;
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
          border-radius: var(--radius-sm); background: var(--surface);
          cursor: pointer; padding: 0;
        }
        .sg-text-grid__cell[data-on="true"] {
          background: var(--accent); border-color: var(--accent);
        }

        .sg-fps {
          font-family: var(--font-mono); font-size: var(--text-xs);
          color: var(--text-faint); letter-spacing: 0.03em;
          font-variant-numeric: tabular-nums; white-space: nowrap;
        }
        .sg-fps strong { color: var(--text); font-weight: 500; }
        .sg-fps__mm { color: var(--text-faint); }

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

        {!uiHidden && dialsOpen && !glError && (
          <DialsModal onClose={() => setDialsOpen(false)}>
            <ShaderControls
              program={program}
              config={config}
              onChange={handleChange}
            />
          </DialsModal>
        )}

        {uiHidden && (
          <button
            type="button"
            className="sg-show-ui"
            data-testid="sg-show-ui"
            onClick={() => setUiHidden(false)}
          >
            ⤢ show UI
          </button>
        )}
      </div>

      {!uiHidden && (
        <BottomToolbar
          shaderId={shaderId}
          activePresetId={activePresetId}
          textOverlay={config.textOverlay}
          fps={fps}
          fpsMin={fpsMin}
          fpsMax={fpsMax}
          onPickPreset={handlePreset}
          onPickShader={handlePickShader}
          onTextChange={handleTextChange}
          onTextStyleChange={handleTextStyleChange}
          onEditDials={() => setDialsOpen(true)}
          onHideUI={() => setUiHidden(true)}
          onDownload={handleDownload}
          onExportHtml={handleExportHtml}
          onCopySnippet={handleCopySnippet}
          onExportJson={handleExportJson}
          onImportJson={handleImportJson}
        />
      )}
    </div>
  );
}
