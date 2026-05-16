'use client';
import { useEffect, useRef, useState } from 'react';
import type { TextOverlayConfig } from '@/lib/shader-types';
import { FpsCounter } from './FpsCounter';
import { TextStyleControls } from './TextOverlay';

interface Props {
  textOverlay: TextOverlayConfig;
  fps: number;
  onTextChange: (text: string) => void;
  onTextStyleChange: (patch: Partial<TextOverlayConfig>) => void;
  onEditDials: () => void;
  onDownload: () => void;
  onExportHtml: () => void;
  onCopySnippet: () => void;
  onExportJson: () => void;
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
      {/* LEFT — text content + typography */}
      <div className="sg-toolbar__group sg-toolbar__group--left">
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
            className="sg-toolbar__btn sg-toolbar__btn--icon"
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

      {/* CENTER — primary actions */}
      <div className="sg-toolbar__group sg-toolbar__group--center">
        <button
          type="button"
          className="sg-toolbar__btn"
          data-testid="sg-edit-dials"
          onClick={props.onEditDials}
        >
          edit dials
        </button>
        <span className="sg-toolbar__div" aria-hidden="true" />
        <button
          type="button"
          className="sg-toolbar__btn sg-toolbar__btn--primary"
          data-testid="sg-download"
          onClick={props.onDownload}
        >
          Download PNG
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
          data-testid="sg-export-html"
          title="Download a self-contained, zero-dependency .html of this look"
          onClick={props.onExportHtml}
        >
          Export HTML
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
      </div>

      {/* RIGHT — live FPS, fixed-width so it never shifts the layout */}
      <div className="sg-toolbar__group sg-toolbar__group--right">
        <FpsCounter fps={props.fps} />
      </div>
    </div>
  );
}
