'use client';
import type { CSSProperties } from 'react';
import {
  FONT_OPTIONS,
  TEXT_POSITIONS,
} from '@/lib/shader-types';
import type { TextOverlayConfig, TextPosition } from '@/lib/shader-types';

// --- shared position math (HTML overlay + PNG export use the same anchors) ---

function rowCol(pos: TextPosition): { row: 'top' | 'center' | 'bottom'; col: 'left' | 'center' | 'right' } {
  const [a, b] = pos.split('-') as [string, string];
  // 'center' alone => center/center
  if (pos === 'center') return { row: 'center', col: 'center' };
  return {
    row: a as 'top' | 'center' | 'bottom',
    col: b as 'left' | 'center' | 'right',
  };
}

function fontString(o: TextOverlayConfig, fontSize: number): string {
  const style = o.italic ? 'italic ' : '';
  const weight = o.bold ? 'bold ' : '';
  return `${style}${weight}${fontSize}px ${o.fontFamily}`;
}

// --- the overlay element (HTML over the canvas) ---

interface OverlayProps {
  overlay: TextOverlayConfig;
}

export function TextOverlay({ overlay }: OverlayProps) {
  if (!overlay.text) return null;
  const { row, col } = rowCol(overlay.position);
  const align =
    col === 'left' ? 'flex-start' : col === 'right' ? 'flex-end' : 'center';
  const justify =
    row === 'top' ? 'flex-start' : row === 'bottom' ? 'flex-end' : 'center';

  const wrap: CSSProperties = {
    position: 'absolute',
    inset: 0,
    display: 'flex',
    flexDirection: 'column',
    alignItems: align,
    justifyContent: justify,
    padding: '6%',
    pointerEvents: 'none',
  };

  const textStyle: CSSProperties = {
    fontFamily: overlay.fontFamily,
    fontSize: `${overlay.fontSize}px`,
    fontWeight: overlay.bold ? 700 : 400,
    fontStyle: overlay.italic ? 'italic' : 'normal',
    textDecoration: overlay.underline ? 'underline' : 'none',
    color: overlay.color,
    lineHeight: 1.15,
    textAlign: col,
    whiteSpace: 'pre-wrap',
    textShadow: overlay.dropShadow
      ? `0 2px ${Math.max(4, overlay.fontSize * 0.12)}px rgba(0,0,0,0.55)`
      : 'none',
  };

  return (
    <div style={wrap} data-testid="sg-text-overlay-wrap" aria-hidden="true">
      <span style={textStyle} data-testid="sg-text-overlay">
        {overlay.text}
      </span>
    </div>
  );
}

// --- draw the overlay onto a 2D canvas for PNG export ---

export function drawTextOverlay(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  overlay: TextOverlayConfig,
  scale: number
) {
  if (!overlay.text) return;
  const fontSize = overlay.fontSize * scale;
  const { row, col } = rowCol(overlay.position);
  const pad = 0.06 * Math.min(width, height);

  ctx.save();
  ctx.font = fontString(overlay, fontSize);
  ctx.fillStyle = overlay.color;
  ctx.textAlign = col === 'left' ? 'left' : col === 'right' ? 'right' : 'center';
  ctx.textBaseline = row === 'top' ? 'top' : row === 'bottom' ? 'bottom' : 'middle';

  const x = col === 'left' ? pad : col === 'right' ? width - pad : width / 2;
  const y = row === 'top' ? pad : row === 'bottom' ? height - pad : height / 2;

  if (overlay.dropShadow) {
    ctx.shadowColor = 'rgba(0,0,0,0.55)';
    ctx.shadowBlur = Math.max(4, fontSize * 0.12);
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 2 * scale;
  }

  ctx.fillText(overlay.text, x, y);

  if (overlay.underline) {
    const m = ctx.measureText(overlay.text);
    const tw = m.width;
    const ux =
      col === 'left' ? x : col === 'right' ? x - tw : x - tw / 2;
    // approximate the underline a touch below the text box
    const asc =
      m.actualBoundingBoxAscent || fontSize * 0.8;
    const desc = m.actualBoundingBoxDescent || fontSize * 0.2;
    let uy: number;
    if (row === 'top') uy = y + asc + desc * 0.6;
    else if (row === 'bottom') uy = y + desc * 0.4;
    else uy = y + asc * 0.5 + desc;
    ctx.shadowColor = 'transparent';
    ctx.fillRect(ux, uy, tw, Math.max(1, fontSize * 0.06));
  }
  ctx.restore();
}

// --- text STYLING controls (rendered in the toolbar's `Aa` popover) ---
// The text CONTENT itself is an always-visible inline toolbar input (11D-4
// design decision); only font/size/B-I-U/color/position/shadow live here.

interface ControlsProps {
  overlay: TextOverlayConfig;
  onChange: (patch: Partial<TextOverlayConfig>) => void;
}

export function TextStyleControls({ overlay, onChange }: ControlsProps) {
  return (
    <section className="sg-textstyle" data-testid="sg-text-style-controls">
      <div className="field sg-field">
        <label className="field__label"><span>Font</span></label>
        <select
          className="select"
          value={overlay.fontFamily}
          data-testid="sg-text-font"
          aria-label="Overlay font"
          onChange={(e) => onChange({ fontFamily: e.target.value })}
        >
          {FONT_OPTIONS.map((f) => (
            <option key={f.value} value={f.value}>
              {f.label}
            </option>
          ))}
        </select>
      </div>

      <div className="field sg-field">
        <label className="field__label">
          <span>Size</span>
          <span className="field__value" data-testid="sg-text-size-value">
            {overlay.fontSize}
          </span>
        </label>
        <input
          type="range"
          className="slider"
          min={16}
          max={200}
          step={1}
          value={overlay.fontSize}
          data-testid="sg-text-size-slider"
          aria-label="Overlay font size"
          onChange={(e) => onChange({ fontSize: Number(e.target.value) })}
        />
      </div>

      <div className="field sg-field">
        <label className="field__label"><span>Style</span></label>
        <div className="sg-text-style">
          <button
            type="button"
            className="sg-toggle"
            data-testid="sg-text-bold"
            data-on={overlay.bold ? 'true' : 'false'}
            aria-pressed={overlay.bold}
            onClick={() => onChange({ bold: !overlay.bold })}
          >
            B
          </button>
          <button
            type="button"
            className="sg-toggle"
            data-testid="sg-text-italic"
            data-on={overlay.italic ? 'true' : 'false'}
            aria-pressed={overlay.italic}
            onClick={() => onChange({ italic: !overlay.italic })}
          >
            I
          </button>
          <button
            type="button"
            className="sg-toggle"
            data-testid="sg-text-underline"
            data-on={overlay.underline ? 'true' : 'false'}
            aria-pressed={overlay.underline}
            onClick={() => onChange({ underline: !overlay.underline })}
          >
            U
          </button>
        </div>
      </div>

      <div className="field sg-field">
        <label className="field__label"><span>Color</span></label>
        <input
          type="color"
          className="sg-stop__color"
          value={overlay.color}
          data-testid="sg-text-color"
          aria-label="Overlay color"
          onChange={(e) => onChange({ color: e.target.value })}
        />
      </div>

      <div className="field sg-field">
        <label className="field__label"><span>Position</span></label>
        <div className="sg-text-grid" data-testid="sg-text-position">
          {TEXT_POSITIONS.map((p) => (
            <button
              key={p}
              type="button"
              className="sg-text-grid__cell"
              data-testid={`sg-text-pos-${p}`}
              data-on={overlay.position === p ? 'true' : 'false'}
              aria-pressed={overlay.position === p}
              aria-label={p}
              onClick={() => onChange({ position: p })}
            />
          ))}
        </div>
      </div>

      <div className="field sg-field">
        <label className="field__label"><span>Drop shadow</span></label>
        <button
          type="button"
          className="sg-toggle"
          data-testid="sg-text-shadow"
          data-on={overlay.dropShadow ? 'true' : 'false'}
          aria-pressed={overlay.dropShadow}
          onClick={() => onChange({ dropShadow: !overlay.dropShadow })}
        >
          {overlay.dropShadow ? 'on' : 'off'}
        </button>
      </div>
    </section>
  );
}
