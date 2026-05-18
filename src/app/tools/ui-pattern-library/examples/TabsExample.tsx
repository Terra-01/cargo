'use client';
import { useState } from 'react';

// A real scenario, and the accordion entry's lesson from the tab side. Peer
// sections of one product (Description / Specs / Reviews) as tabs: right, you
// read one at a time and never need two at once. Then a comparison task forced
// into tabs: "which plan has more storage?" with Plan A and Plan B as tabs.
// You cannot see both, so you answer from memory. "Show both side by side"
// resolves it instantly. Tabs hide all but one; for comparison that is exactly
// the accordion problem, just wearing tabs.

type Mode = 'peer' | 'compare';

const PRODUCT: Record<string, string> = {
  Description: 'A 13-inch ultralight laptop. Aluminium unibody, 1.1kg, built for travel.',
  Specs: '14-core CPU, 16GB RAM, 512GB SSD, 18-hour battery, two USB-C ports.',
  Reviews: '“Fast and silent.” — 4.6/5 across 2,300 ratings.',
};

const PLANS = {
  'Plan A': { Storage: '100 GB', Seats: '3', Price: '$12/mo' },
  'Plan B': { Storage: '1 TB', Seats: '10', Price: '$29/mo' },
} as const;

export function TabsExample() {
  const [mode, setMode] = useState<Mode>('peer');
  const [peerTab, setPeerTab] = useState('Description');
  const [planTab, setPlanTab] = useState<'Plan A' | 'Plan B'>('Plan A');
  const [showBoth, setShowBoth] = useState(false);

  const switchMode = (m: Mode) => {
    setMode(m);
    setPeerTab('Description');
    setPlanTab('Plan A');
    setShowBoth(false);
  };

  return (
    <div className="upl-ex" data-testid="ex-tabs">
      <style>{`
        .upl-ex-tb__seg { display: inline-flex; border: 1px solid var(--border-strong); border-radius: var(--radius-md); overflow: hidden; margin-bottom: var(--space-3); }
        .upl-ex-tb__seg button {
          font-family: var(--font-mono); font-size: 11px;
          min-height: 44px; padding: 6px 14px;
          border: none; background: var(--surface); color: var(--text-muted); cursor: pointer;
        }
        .upl-ex-tb__seg button[data-on="true"] { background: var(--accent-soft); color: var(--accent); }
        .upl-ex-tb__seg button + button { border-left: 1px solid var(--border-strong); }
        .upl-ex-tb__q { font-size: var(--text-sm); font-weight: 600; color: var(--text); margin-bottom: var(--space-3); }
        .upl-ex-tb__stage {
          border: 1px solid var(--border); border-radius: var(--radius-md);
          background: var(--surface-muted); padding: var(--space-3); min-height: 168px;
        }
        .upl-ex-tb__tabs { display: flex; flex-wrap: wrap; gap: 4px; margin-bottom: 8px; }
        .upl-ex-tb__tab {
          font-family: var(--font-mono); font-size: 11px;
          min-height: 44px; padding: 7px 14px;
          display: inline-flex; align-items: center;
          border: 1px solid var(--border); border-radius: var(--radius-sm);
          background: var(--surface); color: var(--text-muted); cursor: pointer;
        }
        .upl-ex-tb__tab[data-on="true"] { border-color: var(--accent); background: var(--accent-soft); color: var(--accent); }
        .upl-ex-tb__panel {
          background: var(--surface); border: 1px solid var(--border);
          border-radius: var(--radius-sm); padding: var(--space-4);
          font-size: var(--text-sm); color: var(--text-muted); line-height: 1.55;
        }
        .upl-ex-tb__dl > div { display: flex; justify-content: space-between; padding: 4px 0; font-size: 13px; }
        .upl-ex-tb__dl dt { color: var(--text-faint); font-family: var(--font-mono); }
        .upl-ex-tb__dl dd { color: var(--text); }
        .upl-ex-tb__dl [data-key="Storage"] dd { color: var(--accent); font-weight: 600; }
        .upl-ex-tb__both { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
        .upl-ex-tb__col h5 { font-size: 12px; font-weight: 600; color: var(--text); margin-bottom: 4px; }
        .upl-ex-tb__showboth {
          margin-top: 8px; font-family: var(--font-mono); font-size: 11px;
          min-height: 44px; padding: 6px 14px;
          display: inline-flex; align-items: center;
          border-radius: var(--radius-sm);
          border: 1px solid var(--accent); background: var(--accent-soft);
          color: var(--accent); cursor: pointer;
        }
        .upl-ex-tb__note {
          margin-top: var(--space-3); font-size: var(--text-sm); line-height: 1.55;
          color: var(--text-muted); padding: var(--space-3);
          border-left: 2px solid var(--accent); background: var(--accent-soft);
          border-radius: var(--radius-sm);
        }
        .upl-ex-tb__note[data-kind="bad"] { border-left-color: #dc2626; }
        .upl-ex-tb__note b { color: var(--text); }
        .upl-ex-tb__q,
        .upl-ex-tb__note,
        .upl-ex-tb__panel { overflow-wrap: anywhere; }
        .upl-ex-tb__col { min-width: 0; }
        /* Mobile: the long-labelled mode toggle stacks full width so its
           text is never clipped by the segment's overflow:hidden. */
        @media (max-width: 599px) {
          .upl-ex-tb__seg {
            display: flex;
            flex-direction: column;
            width: 100%;
          }
          .upl-ex-tb__seg button + button {
            border-left: none;
            border-top: 1px solid var(--border-strong);
          }
        }
      `}</style>

      <div className="upl-ex-tb__seg" role="group" aria-label="Tab usage">
        <button type="button" data-on={mode === 'peer'} onClick={() => switchMode('peer')} data-testid="ex-tab-mode-peer">peer sections (right)</button>
        <button type="button" data-on={mode === 'compare'} onClick={() => switchMode('compare')} data-testid="ex-tab-mode-compare">comparison (wrong)</button>
      </div>

      {mode === 'peer' ? (
        <>
          <p className="upl-ex-tb__q">One product, sections you read one at a time</p>
          <div className="upl-ex-tb__stage">
            <div className="upl-ex-tb__tabs" role="tablist">
              {Object.keys(PRODUCT).map((t) => (
                <button
                  key={t}
                  type="button"
                  role="tab"
                  className="upl-ex-tb__tab"
                  data-on={peerTab === t}
                  aria-selected={peerTab === t}
                  onClick={() => setPeerTab(t)}
                  data-testid={`ex-tab-tab-${t}`}
                >
                  {t}
                </button>
              ))}
            </div>
            <div className="upl-ex-tb__panel" role="tabpanel" data-testid="ex-tab-panel">
              {PRODUCT[peerTab]}
            </div>
          </div>
          <p className="upl-ex-tb__note" data-testid="ex-tab-note">
            Description, Specs and Reviews are peers of one object and nobody
            needs two at once. One at a time in shared space is exactly what
            tabs are for.
          </p>
        </>
      ) : (
        <>
          <p className="upl-ex-tb__q">Task: which plan has more storage?</p>
          <div className="upl-ex-tb__stage">
            {!showBoth ? (
              <>
                <div className="upl-ex-tb__tabs" role="tablist">
                  {(['Plan A', 'Plan B'] as const).map((t) => (
                    <button
                      key={t}
                      type="button"
                      role="tab"
                      className="upl-ex-tb__tab"
                      data-on={planTab === t}
                      aria-selected={planTab === t}
                      onClick={() => setPlanTab(t)}
                      data-testid={`ex-tab-tab-${t}`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
                <div className="upl-ex-tb__panel" role="tabpanel" data-testid="ex-tab-panel">
                  <dl className="upl-ex-tb__dl">
                    {Object.entries(PLANS[planTab]).map(([k, v]) => (
                      <div key={k} data-key={k}><dt>{k}</dt><dd>{v}</dd></div>
                    ))}
                  </dl>
                </div>
                <button
                  type="button"
                  className="upl-ex-tb__showboth"
                  onClick={() => setShowBoth(true)}
                  data-testid="ex-tab-showboth"
                >
                  show both side by side
                </button>
              </>
            ) : (
              <div className="upl-ex-tb__both" data-testid="ex-tab-both">
                {(Object.keys(PLANS) as Array<'Plan A' | 'Plan B'>).map((p) => (
                  <div className="upl-ex-tb__col" key={p}>
                    <h5>{p}</h5>
                    <div className="upl-ex-tb__panel">
                      <dl className="upl-ex-tb__dl">
                        {Object.entries(PLANS[p]).map(([k, v]) => (
                          <div key={k} data-key={k}><dt>{k}</dt><dd>{v}</dd></div>
                        ))}
                      </dl>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <p className="upl-ex-tb__note" data-kind={showBoth ? undefined : 'bad'} data-testid="ex-tab-note">
            {showBoth
              ? 'Side by side, "Plan B has more" is instant. The comparison needed both visible at once.'
              : 'Tabbed, you see one plan, switch, and answer from memory. Tabs hide all but one — for content that must be compared this is the accordion problem from the tab side.'}
          </p>
        </>
      )}
    </div>
  );
}
