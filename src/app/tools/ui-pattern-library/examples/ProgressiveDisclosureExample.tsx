'use client';
import { useState } from 'react';

// A real scenario: the SAME account panel, disclosed two ways. Done well, the
// three fields people actually touch are visible and a rarely-needed cluster
// hides behind an honest "show advanced". Done wrong, the routine field
// (Email) is buried under "show more", so the everyday task costs an extra
// click every single time. The task "change your email" makes the friction
// something you do, not something you read about.

type Mode = 'good' | 'bad';

export function ProgressiveDisclosureExample() {
  const [mode, setMode] = useState<Mode>('good');
  const [openAdvanced, setOpenAdvanced] = useState(false);
  const [openEssential, setOpenEssential] = useState(false);
  const [expandCount, setExpandCount] = useState(0);

  const switchMode = (m: Mode) => {
    setMode(m);
    setOpenAdvanced(false);
    setOpenEssential(false);
    setExpandCount(0);
  };

  const field = (label: string, value: string, testid?: string) => (
    <div className="upl-ex-pd__field" data-testid={testid}>
      <label>{label}</label>
      <input type="text" defaultValue={value} />
    </div>
  );

  return (
    <div className="upl-ex" data-testid="ex-progressive-disclosure">
      <style>{`
        .upl-ex-pd__seg { display: inline-flex; border: 1px solid var(--border-strong); border-radius: var(--radius-md); overflow: hidden; margin-bottom: var(--space-4); }
        .upl-ex-pd__seg button {
          font-family: var(--font-mono); font-size: 11px; padding: 6px 11px;
          border: none; background: var(--surface); color: var(--text-muted); cursor: pointer;
        }
        .upl-ex-pd__seg button[data-on="true"] { background: var(--accent-soft); color: var(--accent); }
        .upl-ex-pd__seg button + button { border-left: 1px solid var(--border-strong); }
        .upl-ex-pd__task {
          font-family: var(--font-mono); font-size: 11px; color: var(--text-faint);
          margin-bottom: var(--space-3);
        }
        .upl-ex-pd__task b { color: var(--accent); }
        .upl-ex-pd__panel {
          border: 1px solid var(--border); border-radius: var(--radius-md);
          background: var(--surface-muted); padding: var(--space-5);
          display: flex; flex-direction: column; gap: var(--space-3); min-height: 200px;
        }
        .upl-ex-pd__field { display: flex; flex-direction: column; gap: 5px; }
        .upl-ex-pd__field label { font-family: var(--font-mono); font-size: 11px; color: var(--text-muted); }
        .upl-ex-pd__field input {
          padding: 9px 12px; background: var(--surface);
          border: 1px solid var(--border-strong); border-radius: var(--radius-md);
          font-family: var(--font-mono); font-size: var(--text-sm); color: var(--text);
        }
        .upl-ex-pd__field input:focus { outline: none; border-color: var(--accent); }
        .upl-ex-pd__more {
          align-self: flex-start;
          font-family: var(--font-mono); font-size: 11px; padding: 5px 0;
          border: none; background: none; color: var(--accent); cursor: pointer;
          text-decoration: underline;
        }
        .upl-ex-pd__revealed {
          display: flex; flex-direction: column; gap: var(--space-3);
          padding-top: var(--space-3); border-top: 1px dashed var(--border-strong);
        }
        .upl-ex-pd__note {
          margin-top: var(--space-3); font-size: var(--text-sm); line-height: 1.55;
          color: var(--text-muted); padding: var(--space-3);
          border-left: 2px solid var(--accent); background: var(--accent-soft);
          border-radius: var(--radius-sm);
        }
        .upl-ex-pd__note[data-kind="bad"] { border-left-color: #dc2626; }
        .upl-ex-pd__note b { color: var(--text); }
      `}</style>

      <div className="upl-ex-pd__seg" role="group" aria-label="Disclosure quality">
        <button type="button" data-on={mode === 'good'} onClick={() => switchMode('good')} data-testid="ex-pd-mode-good">sensible default (right)</button>
        <button type="button" data-on={mode === 'bad'} onClick={() => switchMode('bad')} data-testid="ex-pd-mode-bad">hides essentials (wrong)</button>
      </div>

      <p className="upl-ex-pd__task">
        task: <b>change your email address</b>
      </p>

      <div className="upl-ex-pd__panel">
        {field('Display name', 'Dana Okoro')}

        {mode === 'good' ? (
          <>
            {field('Email', 'dana@example.com', 'ex-pd-essential')}
            {field('Password', '••••••••')}
            <button
              type="button"
              className="upl-ex-pd__more"
              onClick={() => { setOpenAdvanced((o) => !o); }}
              aria-expanded={openAdvanced}
              data-testid="ex-pd-toggle"
            >
              {openAdvanced ? 'hide advanced' : 'show advanced (3)'}
            </button>
            {openAdvanced && (
              <div className="upl-ex-pd__revealed" data-testid="ex-pd-advanced">
                {field('API key', 'sk_live_••••••')}
                {field('Webhook URL', 'https://')}
                {field('Data region', 'eu-west-1')}
              </div>
            )}
          </>
        ) : (
          <>
            <button
              type="button"
              className="upl-ex-pd__more"
              onClick={() => { setOpenEssential((o) => !o); setExpandCount((c) => c + 1); }}
              aria-expanded={openEssential}
              data-testid="ex-pd-toggle"
            >
              {openEssential ? 'show less' : 'show more'}
            </button>
            {openEssential && (
              <div className="upl-ex-pd__revealed">
                {field('Email', 'dana@example.com', 'ex-pd-essential')}
                {field('Password', '••••••••')}
                {field('API key', 'sk_live_••••••')}
              </div>
            )}
          </>
        )}
      </div>

      <p className="upl-ex-pd__note" data-kind={mode === 'bad' ? 'bad' : undefined} data-testid="ex-pd-note">
        {mode === 'good'
          ? 'The fields people actually touch are visible; a rarely-needed cluster waits behind an honest "show advanced". The default view is simple but complete.'
          : (
            <>
              <b>Email is buried under &quot;show more&quot;.</b> The routine task needs a
              reveal click every time
              {expandCount > 0 ? ` (expanded ${expandCount}×)` : ''}. Disclosure
              used to hide what people need is just friction wearing a tidy mask.
            </>
          )}
      </p>
    </div>
  );
}
