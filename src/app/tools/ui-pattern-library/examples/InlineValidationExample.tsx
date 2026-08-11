'use client';
import { useState } from 'react';

// A real scenario: the SAME signup form, the SAME keystrokes, validated two
// ways. On keystroke it marks your email invalid while you are still typing
// it — hostile, it is wrong about a field you have not finished. On blur it
// stays quiet until you leave the field, then helps. The skill in inline
// validation is not whether, it is WHEN it fires. You type the same thing in
// both modes and feel the difference.

type Mode = 'blur' | 'keystroke';

const emailValid = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
const passValid = (v: string) => v.length >= 8 && /\d/.test(v);

export function InlineValidationExample() {
  const [mode, setMode] = useState<Mode>('keystroke');
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [emailBlurred, setEmailBlurred] = useState(false);
  const [passBlurred, setPassBlurred] = useState(false);

  const switchMode = (m: Mode) => {
    setMode(m);
    setEmailBlurred(false);
    setPassBlurred(false);
  };

  // When should a field show feedback?
  //  keystroke → the moment it has any content (this is the hostile part)
  //  blur      → only once the user has left the field
  const emailShows =
    mode === 'keystroke' ? email.length > 0 : emailBlurred;
  const passShows = mode === 'keystroke' ? pass.length > 0 : passBlurred;

  const eOk = emailValid(email);
  const pOk = passValid(pass);

  return (
    <div className="upl-ex" data-testid="ex-inline-validation">
      <style>{`
        .upl-ex-iv__bar {
          display: flex;
          align-items: center;
          gap: var(--space-3);
          margin-bottom: var(--space-4);
          flex-wrap: wrap;
        }
        .upl-ex-iv__seg {
          display: inline-flex;
          border: 1px solid var(--border-strong);
          border-radius: var(--radius-md);
          overflow: hidden;
        }
        .upl-ex-iv__seg button {
          font-family: var(--font-mono);
          font-size: 11px;
          min-height: 44px;
          min-width: 44px;
          padding: 6px 13px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border: none;
          background: var(--surface);
          color: var(--text-muted);
          cursor: pointer;
        }
        .upl-ex-iv__seg button[data-on="true"] { background: var(--accent-soft); color: var(--accent); }
        .upl-ex-iv__seg button + button { border-left: 1px solid var(--border-strong); }
        .upl-ex-iv__cap {
          font-family: var(--font-mono);
          font-size: 11px;
          color: var(--text-faint);
        }
        .upl-ex-iv__form {
          border: 1px solid var(--border);
          border-radius: var(--radius-md);
          background: var(--surface-muted);
          padding: var(--space-5);
          display: flex;
          flex-direction: column;
          gap: var(--space-4);
        }
        .upl-ex-iv__field { display: flex; flex-direction: column; gap: 5px; }
        .upl-ex-iv__field label {
          font-family: var(--font-mono);
          font-size: 11px;
          color: var(--text-muted);
        }
        .upl-ex-iv__field input {
          min-height: 44px;
          padding: 9px 12px;
          background: var(--surface);
          border: 1px solid var(--border-strong);
          border-radius: var(--radius-md);
          font-family: var(--font-mono);
          font-size: var(--text-sm);
          color: var(--text);
        }
        .upl-ex-iv__field input:focus-visible { outline: none; border-color: var(--accent); box-shadow: 0 0 0 3px var(--accent-soft); }
        .upl-ex-iv__field input[data-state="bad"]  { border-color: #dc2626; }
        .upl-ex-iv__field input[data-state="good"] { border-color: #16a34a; }
        .upl-ex-iv__msg {
          font-family: var(--font-mono);
          font-size: 11px;
          min-height: 14px;
        }
        .upl-ex-iv__msg[data-kind="bad"]  { color: #dc2626; }
        .upl-ex-iv__msg[data-kind="good"] { color: #16a34a; }
      `}</style>

      <div className="upl-ex-iv__bar">
        <div className="upl-ex-iv__seg" role="group" aria-label="Validation timing">
          <button
            type="button"
            data-on={mode === 'keystroke'}
            onClick={() => switchMode('keystroke')}
            data-testid="ex-iv-mode-keystroke"
          >
            on every keystroke
          </button>
          <button
            type="button"
            data-on={mode === 'blur'}
            onClick={() => switchMode('blur')}
            data-testid="ex-iv-mode-blur"
          >
            on blur
          </button>
        </div>
        <span className="upl-ex-iv__cap">
          {mode === 'keystroke'
            ? 'nags you mid-entry — hostile'
            : 'waits until you leave the field — helpful'}
        </span>
      </div>

      <form className="upl-ex-iv__form" onSubmit={(e) => e.preventDefault()} noValidate>
        <div className="upl-ex-iv__field">
          <label htmlFor="upl-iv-email">Email</label>
          <input
            id="upl-iv-email"
            type="text"
            value={email}
            placeholder="you@example.com"
            data-state={emailShows ? (eOk ? 'good' : 'bad') : undefined}
            onChange={(e) => setEmail(e.target.value)}
            onBlur={() => setEmailBlurred(true)}
            data-testid="ex-iv-email"
          />
          <span
            className="upl-ex-iv__msg"
            data-kind={eOk ? 'good' : 'bad'}
            data-testid="ex-iv-email-msg"
          >
            {emailShows
              ? eOk
                ? 'looks good ✓'
                : mode === 'keystroke'
                  ? 'enter a valid email (you are not done typing it yet)'
                  : 'enter a valid email'
              : ''}
          </span>
        </div>

        <div className="upl-ex-iv__field">
          <label htmlFor="upl-iv-pass">Password</label>
          <input
            id="upl-iv-pass"
            type="text"
            value={pass}
            placeholder="8+ characters, a number"
            data-state={passShows ? (pOk ? 'good' : 'bad') : undefined}
            onChange={(e) => setPass(e.target.value)}
            onBlur={() => setPassBlurred(true)}
            data-testid="ex-iv-pass"
          />
          <span
            className="upl-ex-iv__msg"
            data-kind={pOk ? 'good' : 'bad'}
            data-testid="ex-iv-pass-msg"
          >
            {passShows
              ? pOk
                ? 'strong enough ✓'
                : 'at least 8 characters and one number'
              : ''}
          </span>
        </div>
      </form>
    </div>
  );
}
