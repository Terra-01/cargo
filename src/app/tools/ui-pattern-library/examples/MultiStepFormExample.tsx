'use client';
import { useState } from 'react';

// A real scenario: the SAME four fields, as one page and as a needless 3-step
// wizard. A live "clicks to submit" counter makes the cost concrete — 1 click
// on one page, 4 through the wizard — and the wizard hides the finish line
// (you cannot see how short it really is). The misuse is padding a short form
// into steps. The note states when steps genuinely earn their keep.

type Mode = 'onepage' | 'wizard';

const FIELDS = [
  { id: 'name', label: 'Full name', placeholder: 'Ada Lovelace' },
  { id: 'email', label: 'Email', placeholder: 'ada@example.com' },
  { id: 'password', label: 'Password', placeholder: '8+ characters' },
  { id: 'plan', label: 'Plan', placeholder: 'Pro' },
];

const STEPS = [[0], [1, 2], [3]]; // 4 fields padded into 3 steps

export function MultiStepFormExample() {
  const [mode, setMode] = useState<Mode>('onepage');
  const [step, setStep] = useState(0);
  const [clicks, setClicks] = useState(0);
  const [done, setDone] = useState(false);
  const [vals, setVals] = useState<Record<string, string>>({});

  const reset = (m: Mode) => {
    setMode(m);
    setStep(0);
    setClicks(0);
    setDone(false);
  };

  const set = (id: string, v: string) => setVals((s) => ({ ...s, [id]: v }));

  const field = (i: number) => {
    const f = FIELDS[i];
    return (
      <div className="upl-ex-ms__field" key={f.id}>
        <label htmlFor={`ms-${f.id}`}>{f.label}</label>
        <input
          id={`ms-${f.id}`}
          type="text"
          placeholder={f.placeholder}
          value={vals[f.id] ?? ''}
          onChange={(e) => set(f.id, e.target.value)}
          data-testid={`ex-msf-field-${f.id}`}
        />
      </div>
    );
  };

  return (
    <div className="upl-ex" data-testid="ex-multi-step-form">
      <style>{`
        .upl-ex-ms__bar {
          display: flex; align-items: center; gap: var(--space-3);
          margin-bottom: var(--space-4); flex-wrap: wrap;
        }
        .upl-ex-ms__seg { display: inline-flex; border: 1px solid var(--border-strong); border-radius: var(--radius-md); overflow: hidden; }
        .upl-ex-ms__seg button {
          font-family: var(--font-mono); font-size: 11px;
          min-height: 44px; min-width: 44px; padding: 6px 13px;
          display: inline-flex; align-items: center; justify-content: center;
          border: none; background: var(--surface); color: var(--text-muted); cursor: pointer;
        }
        .upl-ex-ms__seg button[data-on="true"] { background: var(--accent-soft); color: var(--accent); }
        .upl-ex-ms__seg button + button { border-left: 1px solid var(--border-strong); }
        .upl-ex-ms__clicks { font-family: var(--font-mono); font-size: 11px; color: var(--text-faint); }
        .upl-ex-ms__clicks b { color: var(--accent); }
        .upl-ex-ms__form {
          border: 1px solid var(--border); border-radius: var(--radius-md);
          background: var(--surface-muted); padding: var(--space-5);
          display: flex; flex-direction: column; gap: var(--space-4); min-height: 210px;
        }
        .upl-ex-ms__field { display: flex; flex-direction: column; gap: 5px; }
        .upl-ex-ms__field label { font-family: var(--font-mono); font-size: 11px; color: var(--text-muted); }
        .upl-ex-ms__field input {
          min-height: 44px; padding: 9px 12px; background: var(--surface);
          border: 1px solid var(--border-strong); border-radius: var(--radius-md);
          font-family: var(--font-mono); font-size: var(--text-sm); color: var(--text);
        }
        .upl-ex-ms__field input:focus-visible { outline: none; border-color: var(--accent); box-shadow: 0 0 0 3px var(--accent-soft); }
        .upl-ex-ms__progress { display: flex; gap: 5px; }
        .upl-ex-ms__progress span {
          flex: 1; height: 4px; border-radius: 2px; background: var(--border-strong);
        }
        .upl-ex-ms__progress span[data-done="true"] { background: var(--accent); }
        .upl-ex-ms__step-label { font-family: var(--font-mono); font-size: 11px; color: var(--text-faint); }
        .upl-ex-ms__actions { display: flex; justify-content: space-between; gap: var(--space-2); margin-top: auto; }
        .upl-ex-ms__btn {
          font-family: var(--font-mono); font-size: var(--text-xs);
          min-height: 44px; padding: 8px 16px;
          display: inline-flex; align-items: center; justify-content: center;
          border-radius: var(--radius-md); border: 1px solid var(--border-strong);
          background: var(--surface); color: var(--text); cursor: pointer;
        }
        .upl-ex-ms__btn:hover { border-color: var(--accent); }
        .upl-ex-ms__btn:disabled { opacity: 0.4; cursor: not-allowed; }
        .upl-ex-ms__btn--primary { background: var(--accent); border-color: var(--accent); color: #fff; }
        .upl-ex-ms__done {
          font-family: var(--font-mono); font-size: var(--text-sm); color: #16a34a;
          display: flex; align-items: center; gap: 8px;
        }
        .upl-ex-ms__note {
          margin-top: var(--space-3); font-size: var(--text-sm); line-height: 1.55;
          color: var(--text-muted); padding: var(--space-3);
          border-left: 2px solid var(--accent); background: var(--accent-soft);
          border-radius: var(--radius-sm);
        }
        .upl-ex-ms__note[data-kind="bad"] { border-left-color: #dc2626; }
      `}</style>

      <div className="upl-ex-ms__bar">
        <div className="upl-ex-ms__seg" role="group" aria-label="Form layout">
          <button type="button" data-on={mode === 'onepage'} onClick={() => reset('onepage')} data-testid="ex-msf-mode-onepage">one page (right)</button>
          <button type="button" data-on={mode === 'wizard'} onClick={() => reset('wizard')} data-testid="ex-msf-mode-wizard">3-step wizard (wrong)</button>
        </div>
        <span className="upl-ex-ms__clicks" data-testid="ex-msf-clicks">
          clicks to submit: <b>{clicks}</b>
        </span>
      </div>

      <div className="upl-ex-ms__form">
        {done ? (
          <div className="upl-ex-ms__done" data-testid="ex-msf-done">
            ✓ submitted in {clicks} click{clicks === 1 ? '' : 's'}
            {mode === 'wizard'
              ? ` — ${clicks} clicks to place ${FIELDS.length} fields`
              : ' — one page, one click'}
          </div>
        ) : mode === 'onepage' ? (
          <>
            {FIELDS.map((_, i) => field(i))}
            <div className="upl-ex-ms__actions">
              <span />
              <button
                type="button"
                className="upl-ex-ms__btn upl-ex-ms__btn--primary"
                onClick={() => { setClicks((c) => c + 1); setDone(true); }}
                data-testid="ex-msf-submit"
              >
                submit
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="upl-ex-ms__progress" aria-hidden>
              {STEPS.map((_, i) => (
                <span key={i} data-done={i <= step} />
              ))}
            </div>
            <span className="upl-ex-ms__step-label" data-testid="ex-msf-step">
              step {step + 1} of {STEPS.length}
            </span>
            {STEPS[step].map((fi) => field(fi))}
            <div className="upl-ex-ms__actions">
              <button
                type="button"
                className="upl-ex-ms__btn"
                onClick={() => { setClicks((c) => c + 1); setStep((s) => Math.max(0, s - 1)); }}
                disabled={step === 0}
                data-testid="ex-msf-back"
              >
                back
              </button>
              {step < STEPS.length - 1 ? (
                <button
                  type="button"
                  className="upl-ex-ms__btn upl-ex-ms__btn--primary"
                  onClick={() => { setClicks((c) => c + 1); setStep((s) => s + 1); }}
                  data-testid="ex-msf-next"
                >
                  next
                </button>
              ) : (
                <button
                  type="button"
                  className="upl-ex-ms__btn upl-ex-ms__btn--primary"
                  onClick={() => { setClicks((c) => c + 1); setDone(true); }}
                  data-testid="ex-msf-submit"
                >
                  submit
                </button>
              )}
            </div>
          </>
        )}
      </div>

      <p className="upl-ex-ms__note" data-kind={mode === 'wizard' ? 'bad' : undefined} data-testid="ex-msf-note">
        {mode === 'wizard'
          ? 'Four fields, three steps, several clicks, and you cannot see how short it actually is. The steps add work and hide the finish line. This is the misuse: a wizard for a form that fits on one screen.'
          : 'Four fields, one screen, one click, the end in sight. Steps only earn their keep on a genuinely long or branching form (think 20+ fields or conditional sections) where one page would overwhelm.'}
      </p>
    </div>
  );
}
