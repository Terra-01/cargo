'use client';
import { useState } from 'react';

// A real scenario built around the misuse: comparison content.
//
// Three pricing plans with one quiet differentiator (only Team has SSO). The
// task is a comparison: "which plans include SSO?". The toggle shows the SAME
// content as an accordion, as tabs, and fully visible. In an accordion you can
// hold one plan on screen at a time, so the comparison forces you to expand,
// memorise, collapse, expand. Tabs are the same one-at-a-time trap dressed as
// peers. Shown in full, the answer is readable at a glance. The number of
// plans you can actually compare at once is shown live, so the misuse is felt.

type Mode = 'accordion' | 'tabs' | 'showall';

const PLANS = [
  { id: 'starter', name: 'Starter', price: '$0', seats: '1 seat', support: 'Community', sso: false },
  { id: 'pro', name: 'Pro', price: '$29', seats: '5 seats', support: 'Business hours', sso: false },
  { id: 'team', name: 'Team', price: '$99', seats: 'Unlimited', support: '24/7', sso: true },
] as const;

function PlanBody({ p }: { p: (typeof PLANS)[number] }) {
  return (
    <dl className="upl-ex-ac__dl">
      <div><dt>Price</dt><dd>{p.price}/mo</dd></div>
      <div><dt>Seats</dt><dd>{p.seats}</dd></div>
      <div><dt>Support</dt><dd>{p.support}</dd></div>
      <div data-sso={p.sso}>
        <dt>SSO</dt>
        <dd>{p.sso ? 'Included ✓' : 'Not included'}</dd>
      </div>
    </dl>
  );
}

export function AccordionExample() {
  const [mode, setMode] = useState<Mode>('accordion');
  const [open, setOpen] = useState<string | null>(null); // accordion: single open
  const [tab, setTab] = useState<string>('starter');

  const switchMode = (m: Mode) => {
    setMode(m);
    setOpen(null);
    setTab('starter');
  };

  const comparableNow =
    mode === 'showall' ? PLANS.length : mode === 'tabs' ? 1 : open ? 1 : 0;

  return (
    <div className="upl-ex" data-testid="ex-accordion">
      <style>{`
        .upl-ex-ac__bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: var(--space-3);
          margin-bottom: var(--space-3);
          flex-wrap: wrap;
        }
        .upl-ex-ac__seg {
          display: inline-flex;
          border: 1px solid var(--border-strong);
          border-radius: var(--radius-md);
          overflow: hidden;
        }
        .upl-ex-ac__seg button {
          font-family: var(--font-mono);
          font-size: 11px;
          padding: 6px 11px;
          border: none;
          background: var(--surface);
          color: var(--text-muted);
          cursor: pointer;
        }
        .upl-ex-ac__seg button[data-on="true"] { background: var(--accent-soft); color: var(--accent); }
        .upl-ex-ac__seg button + button { border-left: 1px solid var(--border-strong); }
        .upl-ex-ac__q {
          font-size: var(--text-sm);
          color: var(--text);
          font-weight: 600;
        }
        .upl-ex-ac__stage {
          border: 1px solid var(--border);
          border-radius: var(--radius-md);
          background: var(--surface-muted);
          padding: var(--space-3);
          min-height: 220px;
        }
        .upl-ex-ac__sect { border-bottom: 1px solid var(--border); }
        .upl-ex-ac__sect:last-child { border-bottom: none; }
        .upl-ex-ac__head {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 11px 13px;
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: var(--radius-sm);
          margin-bottom: 6px;
          font-family: var(--font-mono);
          font-size: var(--text-sm);
          color: var(--text);
          cursor: pointer;
        }
        .upl-ex-ac__head:hover { border-color: var(--accent); }
        .upl-ex-ac__head span:last-child { color: var(--text-faint); }
        .upl-ex-ac__tabs {
          display: flex;
          gap: 4px;
          margin-bottom: 8px;
        }
        .upl-ex-ac__tab {
          font-family: var(--font-mono);
          font-size: 11px;
          padding: 6px 12px;
          border: 1px solid var(--border);
          border-radius: var(--radius-sm);
          background: var(--surface);
          color: var(--text-muted);
          cursor: pointer;
        }
        .upl-ex-ac__tab[data-on="true"] { border-color: var(--accent); background: var(--accent-soft); color: var(--accent); }
        .upl-ex-ac__panel {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: var(--radius-sm);
          padding: var(--space-3) var(--space-4);
        }
        .upl-ex-ac__grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 8px;
        }
        @media (max-width: 560px) {
          .upl-ex-ac__grid { grid-template-columns: 1fr; }
        }
        .upl-ex-ac__col {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: var(--radius-sm);
          padding: var(--space-3);
        }
        .upl-ex-ac__col h5 {
          font-size: var(--text-sm);
          font-weight: 600;
          color: var(--text);
          margin-bottom: 6px;
        }
        .upl-ex-ac__dl > div {
          display: flex;
          justify-content: space-between;
          gap: 8px;
          padding: 3px 0;
          font-size: 12px;
        }
        .upl-ex-ac__dl dt { color: var(--text-faint); font-family: var(--font-mono); }
        .upl-ex-ac__dl dd { color: var(--text-muted); }
        .upl-ex-ac__dl > div[data-sso="true"] dd { color: #16a34a; font-weight: 600; }
        .upl-ex-ac__note {
          margin-top: var(--space-3);
          font-size: var(--text-sm);
          line-height: 1.55;
          color: var(--text-muted);
          padding: var(--space-3);
          border-left: 2px solid var(--accent);
          background: var(--accent-soft);
          border-radius: var(--radius-sm);
        }
        .upl-ex-ac__note b { color: var(--text); }
      `}</style>

      <div className="upl-ex-ac__bar">
        <div className="upl-ex-ac__seg" role="group" aria-label="Layout">
          <button type="button" data-on={mode === 'accordion'} onClick={() => switchMode('accordion')} data-testid="ex-acc-mode-accordion">accordion</button>
          <button type="button" data-on={mode === 'tabs'} onClick={() => switchMode('tabs')} data-testid="ex-acc-mode-tabs">tabs</button>
          <button type="button" data-on={mode === 'showall'} onClick={() => switchMode('showall')} data-testid="ex-acc-mode-showall">show all</button>
        </div>
        <p className="upl-ex-ac__q">Task: which plans include SSO?</p>
      </div>

      <div className="upl-ex-ac__stage">
        {mode === 'accordion' && (
          <div>
            {PLANS.map((p) => (
              <div className="upl-ex-ac__sect" key={p.id}>
                <button
                  type="button"
                  className="upl-ex-ac__head"
                  onClick={() => setOpen((o) => (o === p.id ? null : p.id))}
                  aria-expanded={open === p.id}
                  data-testid={`ex-acc-head-${p.id}`}
                >
                  <span>{p.name}</span>
                  <span>{open === p.id ? '−' : '+'}</span>
                </button>
                {open === p.id && (
                  <div className="upl-ex-ac__panel" data-testid={`ex-acc-panel-${p.id}`}>
                    <PlanBody p={p} />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {mode === 'tabs' && (
          <div>
            <div className="upl-ex-ac__tabs" role="tablist">
              {PLANS.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  role="tab"
                  className="upl-ex-ac__tab"
                  data-on={tab === p.id}
                  aria-selected={tab === p.id}
                  onClick={() => setTab(p.id)}
                  data-testid={`ex-acc-tab-${p.id}`}
                >
                  {p.name}
                </button>
              ))}
            </div>
            {PLANS.filter((p) => p.id === tab).map((p) => (
              <div className="upl-ex-ac__panel" key={p.id} role="tabpanel" data-testid={`ex-acc-panel-${p.id}`}>
                <PlanBody p={p} />
              </div>
            ))}
          </div>
        )}

        {mode === 'showall' && (
          <div className="upl-ex-ac__grid">
            {PLANS.map((p) => (
              <div className="upl-ex-ac__col" key={p.id} data-testid={`ex-acc-panel-${p.id}`}>
                <h5>{p.name}</h5>
                <PlanBody p={p} />
              </div>
            ))}
          </div>
        )}
      </div>

      <p className="upl-ex-ac__note" data-testid="ex-acc-note">
        plans you can compare at once:{' '}
        <b data-testid="ex-acc-visible-count">{comparableNow}</b> of {PLANS.length}.{' '}
        {mode === 'showall'
          ? 'All three on screen — "only Team has SSO" is readable in one glance. This is the right call for comparison content.'
          : mode === 'tabs'
            ? 'Tabs show one plan at a time. They are peers, but you still cannot see SSO across all three together — you compare from memory.'
            : 'An accordion hides what the task needs side by side. To answer, you expand one, remember it, collapse, expand the next. The pattern is fighting the task.'}
      </p>
    </div>
  );
}
