'use client';
import { useState, useMemo } from 'react';
import {
  ratios,
  fontOptions,
  TEXT_MAX_LENGTH,
  generateTypeScale,
  generateSpacingScale,
  generateCss,
  type TypeStep,
  type SpaceStep,
} from '@/lib/type-scale';

const DEFAULT_SAMPLE_TEXT = 'Hello, Cargo.';
const PREVIEW_FONT_CAP = 72; // largest rendered font-size in the preview; metadata still shows the true value

export function TypeScale() {
  const [base, setBase] = useState(16);
  const [ratioValue, setRatioValue] = useState(1.25);
  const [stepsUp, setStepsUp] = useState(6);
  const [stepsDown, setStepsDown] = useState(2);
  const [spacingBase, setSpacingBase] = useState(4);
  const [fontId, setFontId] = useState('sans');
  const [sampleText, setSampleText] = useState(DEFAULT_SAMPLE_TEXT);
  const [copied, setCopied] = useState(false);

  const fontStack = useMemo(
    () => fontOptions.find((f) => f.id === fontId)?.stack ?? fontOptions[0].stack,
    [fontId]
  );
  const renderedText = sampleText.length > 0 ? sampleText : DEFAULT_SAMPLE_TEXT;

  const typeSteps: TypeStep[] = useMemo(
    () => generateTypeScale(base, ratioValue, stepsUp, stepsDown),
    [base, ratioValue, stepsUp, stepsDown]
  );
  const spaceSteps: SpaceStep[] = useMemo(
    () => generateSpacingScale(spacingBase),
    [spacingBase]
  );
  const css = useMemo(() => generateCss(typeSteps, spaceSteps), [typeSteps, spaceSteps]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(css);
    } catch {
      // ignore in restricted environments
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <>
      <style>{`
        .ts-preview-wrap {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: var(--radius-lg);
          padding: var(--space-5) var(--space-6);
          display: flex;
          flex-direction: column;
          gap: var(--space-6);
        }
        .ts-section__title {
          font-family: var(--font-mono);
          font-size: var(--text-xs);
          letter-spacing: 0.08em;
          color: var(--text-faint);
          text-transform: uppercase;
          margin-bottom: var(--space-4);
          display: flex;
          align-items: center;
          gap: var(--space-2);
        }
        .ts-section__title::after {
          content: '';
          flex: 1;
          height: 1px;
          background: var(--border);
        }
        .ts-type-row {
          display: grid;
          grid-template-columns: 90px 56px 1fr;
          align-items: baseline;
          gap: var(--space-3);
          padding: var(--space-3) 0 var(--space-2);
          border-bottom: 1px solid var(--border);
        }
        .ts-type-row:last-child { border-bottom: none; }
        .ts-type-row__name {
          font-family: var(--font-mono);
          font-size: 11px;
          color: var(--text-muted);
          letter-spacing: 0.02em;
        }
        .ts-type-row__size {
          font-family: var(--font-mono);
          font-size: 11px;
          color: var(--text-faint);
          font-variant-numeric: tabular-nums;
        }
        .ts-type-row__sample {
          color: var(--text);
          font-weight: 500;
          letter-spacing: -0.02em;
          /* line-height >= 1.25 keeps descenders (g, y, p, etc.) inside the line box so 'overflow: hidden' on long text doesn't clip them */
          line-height: 1.25;
          padding-bottom: 0.05em;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .ts-space-row {
          display: grid;
          grid-template-columns: 90px 1fr 56px;
          align-items: center;
          gap: var(--space-3);
          padding: var(--space-2) 0;
        }
        .ts-space-row__name {
          font-family: var(--font-mono);
          font-size: 11px;
          color: var(--text-muted);
        }
        .ts-space-row__bar-wrap {
          height: 14px;
          display: flex;
          align-items: center;
        }
        .ts-space-row__bar {
          height: 14px;
          background: var(--accent);
          border-radius: 2px;
          opacity: 0.85;
        }
        .ts-space-row__value {
          font-family: var(--font-mono);
          font-size: 11px;
          color: var(--text-faint);
          font-variant-numeric: tabular-nums;
          text-align: right;
        }
      `}</style>
      <div className="lab">
        <div className="lab__panel panel" data-testid="ts-panel">
          <p className="panel__title"><span>controls</span></p>
          <div className="field" style={{ marginBottom: 'var(--space-5)' }}>
            <label className="field__label" htmlFor="base">
              <span>base size</span>
              <span className="field__value" data-testid="base-value">{base}px</span>
            </label>
            <input
              id="base"
              type="range"
              min={14}
              max={20}
              step={1}
              value={base}
              onChange={(e) => setBase(Number(e.target.value))}
              className="slider"
              data-testid="base-slider"
            />
          </div>
          <div className="field" style={{ marginBottom: 'var(--space-5)' }}>
            <label className="field__label" htmlFor="ratio"><span>ratio</span></label>
            <select
              id="ratio"
              className="select"
              value={ratioValue}
              onChange={(e) => setRatioValue(Number(e.target.value))}
              data-testid="ratio-select"
            >
              {ratios.map((r) => (
                <option key={r.id} value={r.value}>{r.label}</option>
              ))}
            </select>
          </div>
          <div className="field" style={{ marginBottom: 'var(--space-5)' }}>
            <label className="field__label" htmlFor="steps-up">
              <span>steps up</span>
              <span className="field__value" data-testid="steps-up-value">{stepsUp}</span>
            </label>
            <input
              id="steps-up"
              type="range"
              min={4}
              max={8}
              step={1}
              value={stepsUp}
              onChange={(e) => setStepsUp(Number(e.target.value))}
              className="slider"
              data-testid="steps-up-slider"
            />
          </div>
          <div className="field" style={{ marginBottom: 'var(--space-5)' }}>
            <label className="field__label" htmlFor="steps-down">
              <span>steps down</span>
              <span className="field__value">{stepsDown}</span>
            </label>
            <input
              id="steps-down"
              type="range"
              min={1}
              max={3}
              step={1}
              value={stepsDown}
              onChange={(e) => setStepsDown(Number(e.target.value))}
              className="slider"
            />
          </div>
          <div className="field" style={{ marginBottom: 'var(--space-5)' }}>
            <label className="field__label" htmlFor="font"><span>preview font</span></label>
            <select
              id="font"
              className="select"
              value={fontId}
              onChange={(e) => setFontId(e.target.value)}
              data-testid="font-select"
            >
              {fontOptions.map((opt) => (
                <option key={opt.id} value={opt.id}>{opt.label}</option>
              ))}
            </select>
          </div>
          <div className="field" style={{ marginBottom: 'var(--space-5)' }}>
            <label className="field__label" htmlFor="sample-text">
              <span>sample text</span>
              <span className="field__value" data-testid="sample-text-count">{sampleText.length}/{TEXT_MAX_LENGTH}</span>
            </label>
            <input
              id="sample-text"
              type="text"
              className="input"
              maxLength={TEXT_MAX_LENGTH}
              value={sampleText}
              onChange={(e) => setSampleText(e.target.value)}
              placeholder={DEFAULT_SAMPLE_TEXT}
              data-testid="sample-text-input"
            />
          </div>
          <div className="field">
            <label className="field__label"><span>spacing base</span></label>
            <div className="tint-toggle" role="group" aria-label="Spacing base unit">
              <button
                type="button"
                className={`tint-toggle__option ${spacingBase === 4 ? 'tint-toggle__option--active' : ''}`}
                onClick={() => setSpacingBase(4)}
                data-testid="space-base-4"
              >
                4px
              </button>
              <button
                type="button"
                className={`tint-toggle__option ${spacingBase === 8 ? 'tint-toggle__option--active' : ''}`}
                onClick={() => setSpacingBase(8)}
                data-testid="space-base-8"
              >
                8px
              </button>
            </div>
          </div>
        </div>
        <div className="lab__preview-wrap">
          <div className="ts-preview-wrap">
            <div data-testid="type-specimen">
              <p className="ts-section__title"><span>type scale</span></p>
              {typeSteps.map((step) => (
                <div key={step.name} className="ts-type-row">
                  <span className="ts-type-row__name">{step.name}</span>
                  <span className="ts-type-row__size">{step.size}px</span>
                  <span
                    className="ts-type-row__sample"
                    style={{
                      fontSize: `${Math.min(step.size, PREVIEW_FONT_CAP)}px`,
                      fontFamily: fontStack,
                    }}
                  >
                    {renderedText}
                  </span>
                </div>
              ))}
            </div>
            <div data-testid="spacing-specimen">
              <p className="ts-section__title"><span>spacing scale</span></p>
              {spaceSteps.map((step) => (
                <div key={step.name} className="ts-space-row">
                  <span className="ts-space-row__name">{step.name}</span>
                  <div className="ts-space-row__bar-wrap">
                    <div
                      className="ts-space-row__bar"
                      style={{ width: `${step.value}px` }}
                    />
                  </div>
                  <span className="ts-space-row__value">{step.value}px</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="lab__code-wrap">
          <div className="code" data-testid="ts-css-output">{css}<button
              type="button"
              className="code__copy"
              onClick={handleCopy}
              data-testid="copy-btn"
            >
              {copied ? 'copied' : 'copy'}
            </button></div>
        </div>
      </div>
    </>
  );
}
