'use client';
import { useEffect, useRef, useState } from 'react';
import type { TextOverlayConfig } from '@/lib/shader-types';
import type { ShaderPreset } from '@/lib/shader-presets';
import { LookPicker } from './LookPicker';
import { FpsCounter } from './FpsCounter';
import { TextStyleControls } from './TextOverlay';

interface Props {
  shaderId: string;
  activePresetId: string | null;
  textOverlay: TextOverlayConfig;
  fps: number;
  fpsMin: number | null;
  fpsMax: number | null;
  onPickPreset: (preset: ShaderPreset) => void;
  onPickShader: (id: string) => void;
  onTextChange: (text: string) => void;
  onTextStyleChange: (patch: Partial<TextOverlayConfig>) => void;
  onEditDials: () => void;
  onHideUI: () => void;
  onDownload: () => void;
  onExportHtml: () => void;
  onCopySnippet: () => void;
  onExportJson: () => void;
  onImportJson: (file: File) => void;
}

export function BottomToolbar(props: Props) {
  const [styleOpen, setStyleOpen] = useState(false);
  const [snippetCopied, setSnippetCopied] = useState(false);
  const styleRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!styleOpen) return;
    const onDoc = (e: MouseEvent) => {
      if (styleRef.current && !styleRef.current.contains(e.target as Node)) {
        setStyleOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setStyleOpen(false);
    };
    document.addEventListener('mousedown', onDoc);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDoc);
      document.removeEventListener('keydown', onKey);
    };
  }, [styleOpen]);

  return (
    <div className="sg-toolbar" data-testid="sg-toolbar">
      <div className="sg-toolbar__group">
        <LookPicker
          shaderId={props.shaderId}
          activePresetId={props.activePresetId}
          onPickPreset={props.onPickPreset}
          onPickShader={props.onPickShader}
        />

        <input
          type="text"
          className="sg-toolbar__text"
          value={props.textOverlay.text}
          placeholder="overlay text…"
          data-testid="sg-text-input"
          aria-label="Overlay text"
          onChange={(e) => props.onTextChange(e.target.value)}
        />

        <div className="sg-look" ref={styleRef}>
          <button
            type="button"
            className="sg-toolbar__btn"
            data-testid="sg-text-style-trigger"
            aria-haspopup="dialog"
            aria-expanded={styleOpen}
            title="Text styling"
            onClick={() => setStyleOpen((v) => !v)}
          >
            Aa
          </button>
          {styleOpen && (
            <div
              className="sg-look__popover sg-textstyle-popover"
              data-testid="sg-text-style-popover"
            >
              <TextStyleControls
                overlay={props.textOverlay}
                onChange={props.onTextStyleChange}
              />
            </div>
          )}
        </div>
      </div>

      <div className="sg-toolbar__group">
        <FpsCounter fps={props.fps} min={props.fpsMin} max={props.fpsMax} />
        <button
          type="button"
          className="sg-toolbar__btn"
          data-testid="sg-edit-dials"
          onClick={props.onEditDials}
        >
          edit dials
        </button>
        <button
          type="button"
          className="sg-toolbar__btn"
          data-testid="sg-hide-ui"
          title="Hide UI — clean gradient view"
          onClick={props.onHideUI}
        >
          ⤢ hide
        </button>
        <button
          type="button"
          className="sg-toolbar__btn"
          data-testid="sg-download"
          onClick={props.onDownload}
        >
          Download PNG
        </button>
        <button
          type="button"
          className="sg-toolbar__btn"
          data-testid="sg-export-html"
          title="Download a self-contained, zero-dependency .html of this look"
          onClick={props.onExportHtml}
        >
          Export HTML
        </button>
        <button
          type="button"
          className="sg-toolbar__btn"
          data-testid="sg-copy-snippet"
          data-copied={snippetCopied ? 'true' : 'false'}
          title="Copy a guest-safe <script> snippet to paste into your own page"
          onClick={() => {
            props.onCopySnippet();
            setSnippetCopied(true);
            window.setTimeout(() => setSnippetCopied(false), 1600);
          }}
        >
          {snippetCopied ? 'Copied!' : 'Copy Snippet'}
        </button>
        <button
          type="button"
          className="sg-toolbar__btn"
          data-testid="sg-export-json"
          title="Download the config as JSON"
          onClick={props.onExportJson}
        >
          Export JSON
        </button>
        <label className="sg-toolbar__btn" data-testid="sg-import-json" title="Import a config JSON">
          Import
          <input
            type="file"
            accept="application/json,.json"
            style={{ display: 'none' }}
            data-testid="sg-import-json-input"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) props.onImportJson(f);
              e.target.value = '';
            }}
          />
        </label>
      </div>
    </div>
  );
}
