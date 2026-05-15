'use client';
import { useState, useMemo } from 'react';
import {
  componentTypes,
  styles,
  frameworks,
  buildPrompt,
} from '@/lib/prompt-builder';

export function PromptBuilder() {
  const [componentType, setComponentType] = useState('card');
  const [style, setStyle] = useState('minimal');
  const [framework, setFramework] = useState('react-tailwind');
  const [darkMode, setDarkMode] = useState(false);
  const [notes, setNotes] = useState('');
  const [copied, setCopied] = useState(false);

  const prompt = useMemo(
    () => buildPrompt({ componentType, style, framework, darkMode, notes }),
    [componentType, style, framework, darkMode, notes]
  );

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(prompt);
    } catch {
      // clipboard may be blocked in test envs
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="builder">
      <div className="builder__form panel" data-testid="builder-form">
        <p className="panel__title"><span>parameters</span></p>
        <div className="builder__form-grid">
          <div className="field">
            <label className="field__label" htmlFor="component-type"><span>component</span></label>
            <select
              id="component-type"
              className="select"
              value={componentType}
              onChange={(e) => setComponentType(e.target.value)}
              data-testid="component-select"
            >
              {componentTypes.map((opt) => (
                <option key={opt.id} value={opt.id}>{opt.label}</option>
              ))}
            </select>
          </div>
          <div className="field">
            <label className="field__label" htmlFor="style"><span>style</span></label>
            <select
              id="style"
              className="select"
              value={style}
              onChange={(e) => setStyle(e.target.value)}
              data-testid="style-select"
            >
              {styles.map((opt) => (
                <option key={opt.id} value={opt.id}>{opt.label}</option>
              ))}
            </select>
          </div>
          <div className="field">
            <label className="field__label" htmlFor="framework"><span>framework</span></label>
            <select
              id="framework"
              className="select"
              value={framework}
              onChange={(e) => setFramework(e.target.value)}
              data-testid="framework-select"
            >
              {frameworks.map((opt) => (
                <option key={opt.id} value={opt.id}>{opt.label}</option>
              ))}
            </select>
          </div>
          <div className="field">
            <label className="field__label"><span>dark mode</span></label>
            <div className="bool-toggle" style={{ marginTop: '4px' }}>
              <button
                type="button"
                className={`bool-toggle__btn ${darkMode ? 'bool-toggle__btn--on' : ''}`}
                onClick={() => setDarkMode((v) => !v)}
                aria-pressed={darkMode}
                data-testid="dark-mode-toggle"
              >
                {darkMode ? 'on' : 'off'}
              </button>
            </div>
          </div>
        </div>

        <div className="builder__notes-field field">
          <label className="field__label" htmlFor="notes">
            <span>additional context</span>
            <span className="field__value" style={{ color: 'var(--text-faint)' }}>optional</span>
          </label>
          <textarea
            id="notes"
            className="textarea"
            placeholder="e.g. show 3 tiers with the middle one highlighted as 'most popular'"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            data-testid="notes-field"
          />
        </div>
      </div>

      <div className="code code--prose" data-testid="prompt-output">{prompt}<button
          type="button"
          className="code__copy"
          onClick={handleCopy}
          data-testid="copy-btn"
        >
          {copied ? 'copied' : 'copy prompt'}
        </button></div>
    </div>
  );
}
