'use client';
import { useState, useMemo } from 'react';

type Tint = 'light' | 'dark';

export function CssEffectLab() {
  const [blur, setBlur] = useState(14);
  const [tint, setTint] = useState<Tint>('light');
  const [bgOpacity, setBgOpacity] = useState(12);       // 0–50
  const [borderOpacity, setBorderOpacity] = useState(20); // 0–50
  const [radius, setRadius] = useState(16);
  const [saturate, setSaturate] = useState(true);
  const [copied, setCopied] = useState(false);

  const baseRgb = tint === 'light' ? '255, 255, 255' : '0, 0, 0';
  const bgAlpha = (bgOpacity / 100).toFixed(2);
  const borderAlpha = (borderOpacity / 100).toFixed(2);
  const filter = `blur(${blur}px)${saturate ? ' saturate(180%)' : ''}`;

  const glassStyle = useMemo<React.CSSProperties>(
    () => ({
      backdropFilter: filter,
      WebkitBackdropFilter: filter,
      background: `rgba(${baseRgb}, ${bgAlpha})`,
      border: `1px solid rgba(${baseRgb}, ${borderAlpha})`,
      borderRadius: `${radius}px`,
      color: tint === 'light' ? '#FFFFFF' : '#0F0F0E',
    }),
    [filter, baseRgb, bgAlpha, borderAlpha, radius, tint]
  );

  const css = `.glass {
  backdrop-filter: ${filter};
  -webkit-backdrop-filter: ${filter};
  background: rgba(${baseRgb}, ${bgAlpha});
  border: 1px solid rgba(${baseRgb}, ${borderAlpha});
  border-radius: ${radius}px;
}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(css);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard may be unavailable in some test environments; fail silently
    }
  };

  return (
    <div className="lab">
      <div className="lab__panel panel" data-testid="lab-panel">
        <p className="panel__title"><span>controls</span></p>

        <div className="field">
          <label className="field__label" htmlFor="blur">
            <span>blur</span>
            <span className="field__value" data-testid="blur-value">{blur}px</span>
          </label>
          <input
            id="blur"
            type="range"
            className="slider"
            min={0}
            max={40}
            step={1}
            value={blur}
            onChange={(e) => setBlur(Number(e.target.value))}
            data-testid="blur-slider"
          />
        </div>

        <div className="field">
          <label className="field__label"><span>tint</span></label>
          <div className="tint-toggle" role="group" aria-label="Glass tint base">
            <button
              type="button"
              className={`tint-toggle__option ${tint === 'light' ? 'tint-toggle__option--active' : ''}`}
              onClick={() => setTint('light')}
              data-testid="tint-light"
            >
              light
            </button>
            <button
              type="button"
              className={`tint-toggle__option ${tint === 'dark' ? 'tint-toggle__option--active' : ''}`}
              onClick={() => setTint('dark')}
              data-testid="tint-dark"
            >
              dark
            </button>
          </div>
        </div>

        <div className="field">
          <label className="field__label" htmlFor="bg-opacity">
            <span>bg opacity</span>
            <span className="field__value">{bgOpacity}%</span>
          </label>
          <input
            id="bg-opacity"
            type="range"
            className="slider"
            min={0}
            max={50}
            step={1}
            value={bgOpacity}
            onChange={(e) => setBgOpacity(Number(e.target.value))}
          />
        </div>

        <div className="field">
          <label className="field__label" htmlFor="border-opacity">
            <span>border opacity</span>
            <span className="field__value">{borderOpacity}%</span>
          </label>
          <input
            id="border-opacity"
            type="range"
            className="slider"
            min={0}
            max={50}
            step={1}
            value={borderOpacity}
            onChange={(e) => setBorderOpacity(Number(e.target.value))}
          />
        </div>

        <div className="field">
          <label className="field__label" htmlFor="radius">
            <span>radius</span>
            <span className="field__value">{radius}px</span>
          </label>
          <input
            id="radius"
            type="range"
            className="slider"
            min={0}
            max={32}
            step={1}
            value={radius}
            onChange={(e) => setRadius(Number(e.target.value))}
          />
        </div>

        <div className="field">
          <div className="bool-toggle">
            <label className="field__label" style={{ margin: 0 }}>
              <span>saturate 180%</span>
            </label>
            <button
              type="button"
              className={`bool-toggle__btn ${saturate ? 'bool-toggle__btn--on' : ''}`}
              onClick={() => setSaturate((s) => !s)}
              aria-pressed={saturate}
              data-testid="saturate-toggle"
            >
              {saturate ? 'on' : 'off'}
            </button>
          </div>
        </div>
      </div>

      <div className="lab__preview-wrap">
        <div className="lab__preview" data-testid="lab-preview">
          <div className="lab__backdrop" aria-hidden="true"></div>
          <div className="lab__glass" style={glassStyle} data-testid="lab-glass">
            <p className="lab__glass-label" style={{ color: glassStyle.color }}>TUESDAY</p>
            <p className="lab__glass-value" style={{ color: glassStyle.color }}>$12,438</p>
            <p className="lab__glass-meta" style={{ color: glassStyle.color }}>+4.2% this week</p>
          </div>
        </div>
      </div>

      <div className="lab__code-wrap">
        <div className="code" data-testid="lab-code">
{css}
          <button
            type="button"
            className="code__copy"
            onClick={handleCopy}
            data-testid="copy-btn"
          >
            {copied ? 'copied' : 'copy'}
          </button>
        </div>
      </div>
    </div>
  );
}
