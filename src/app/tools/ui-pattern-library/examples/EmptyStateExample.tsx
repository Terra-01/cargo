'use client';
import { useState } from 'react';

// A real scenario: the SAME empty "Projects" view, three ways. A literal blank
// (the user thinks it broke), a bare "No projects" (true, useless, a dead
// end), and a designed state that orients, explains, and offers the next step
// — and whose button actually works, turning the empty view into the populated
// one. You feel the difference between a dead end and a doorway by trying to
// get out of each.

type Mode = 'blank' | 'bare' | 'designed';

export function EmptyStateExample() {
  const [mode, setMode] = useState<Mode>('blank');
  const [projects, setProjects] = useState<string[]>([]);

  const switchMode = (m: Mode) => {
    setMode(m);
    setProjects([]);
  };

  const create = () =>
    setProjects((p) => [...p, `Project ${p.length + 1}`]);

  const populated = projects.length > 0;

  return (
    <div className="upl-ex" data-testid="ex-empty-state">
      <style>{`
        .upl-ex-em__seg { display: inline-flex; border: 1px solid var(--border-strong); border-radius: var(--radius-md); overflow: hidden; margin-bottom: var(--space-3); }
        .upl-ex-em__seg button {
          font-family: var(--font-mono); font-size: 11px;
          min-height: 44px; min-width: 44px; padding: 6px 13px;
          display: inline-flex; align-items: center; justify-content: center;
          border: none; background: var(--surface); color: var(--text-muted); cursor: pointer;
        }
        .upl-ex-em__seg button[data-on="true"] { background: var(--accent-soft); color: var(--accent); }
        .upl-ex-em__seg button + button { border-left: 1px solid var(--border-strong); }
        .upl-ex-em__chrome {
          border: 1px solid var(--border); border-radius: var(--radius-md);
          background: var(--surface); overflow: hidden;
        }
        .upl-ex-em__top {
          display: flex; align-items: center; justify-content: space-between;
          padding: 10px 14px; border-bottom: 1px solid var(--border);
          font-family: var(--font-mono); font-size: 12px; color: var(--text);
        }
        .upl-ex-em__top span { color: var(--text-faint); font-size: 11px; }
        .upl-ex-em__view {
          min-height: 196px; display: flex; align-items: center; justify-content: center;
          padding: var(--space-5); background: var(--surface-muted);
        }
        .upl-ex-em__blank { width: 100%; height: 156px; }
        .upl-ex-em__bare { font-family: var(--font-mono); font-size: 13px; color: var(--text-faint); }
        .upl-ex-em__designed {
          display: flex; flex-direction: column; align-items: center; text-align: center;
          gap: 10px; max-width: 320px;
        }
        .upl-ex-em__icon {
          width: 46px; height: 46px; border-radius: var(--radius-md);
          border: 2px dashed var(--border-strong);
          display: flex; align-items: center; justify-content: center;
          color: var(--text-faint); font-size: 20px;
        }
        .upl-ex-em__designed h4 { font-size: var(--text-md); font-weight: 600; color: var(--text); }
        .upl-ex-em__designed p { font-size: var(--text-sm); color: var(--text-muted); line-height: 1.5; }
        .upl-ex-em__cta {
          margin-top: 4px; font-family: var(--font-mono); font-size: 12px;
          min-height: 44px; padding: 8px 16px;
          display: inline-flex; align-items: center; justify-content: center;
          border-radius: var(--radius-md);
          border: 1px solid var(--accent); background: var(--accent); color: #fff; cursor: pointer;
        }
        .upl-ex-em__cta:hover { background: var(--accent-hover); }
        .upl-ex-em__list { width: 100%; display: flex; flex-direction: column; gap: 6px; align-self: stretch; }
        .upl-ex-em__row {
          display: flex; align-items: center; gap: 10px;
          padding: 10px 12px; background: var(--surface);
          border: 1px solid var(--border); border-radius: var(--radius-sm);
          font-family: var(--font-mono); font-size: 13px; color: var(--text);
        }
        .upl-ex-em__row::before { content: '▣'; color: var(--accent); }
        .upl-ex-em__note {
          margin-top: var(--space-3); font-size: var(--text-sm); line-height: 1.55;
          color: var(--text-muted); padding: var(--space-3);
          border-left: 2px solid var(--accent); background: var(--accent-soft);
          border-radius: var(--radius-sm);
        }
        .upl-ex-em__note[data-kind="bad"] { border-left-color: #dc2626; }
        .upl-ex-em__note b { color: var(--text); }
      `}</style>

      <div className="upl-ex-em__seg" role="group" aria-label="Empty state quality">
        <button type="button" data-on={mode === 'blank'} onClick={() => switchMode('blank')} data-testid="ex-es-mode-blank">blank</button>
        <button type="button" data-on={mode === 'bare'} onClick={() => switchMode('bare')} data-testid="ex-es-mode-bare">bare &quot;no projects&quot;</button>
        <button type="button" data-on={mode === 'designed'} onClick={() => switchMode('designed')} data-testid="ex-es-mode-designed">designed</button>
      </div>

      <div className="upl-ex-em__chrome">
        <div className="upl-ex-em__top">
          Projects <span>{projects.length} total</span>
        </div>
        <div className="upl-ex-em__view" data-testid="ex-es-view">
          {populated ? (
            <div className="upl-ex-em__list" data-testid="ex-es-populated">
              {projects.map((p) => (
                <div className="upl-ex-em__row" key={p}>{p}</div>
              ))}
            </div>
          ) : mode === 'blank' ? (
            <div className="upl-ex-em__blank" data-testid="ex-es-blank" aria-hidden />
          ) : mode === 'bare' ? (
            <p className="upl-ex-em__bare" data-testid="ex-es-bare">No projects.</p>
          ) : (
            <div className="upl-ex-em__designed" data-testid="ex-es-designed">
              <div className="upl-ex-em__icon" aria-hidden>＋</div>
              <h4>No projects yet</h4>
              <p>Projects you create will show up here. Start with your first one.</p>
              <button type="button" className="upl-ex-em__cta" onClick={create} data-testid="ex-es-cta">
                Create your first project
              </button>
            </div>
          )}
        </div>
      </div>

      <p className="upl-ex-em__note" data-kind={mode === 'designed' ? undefined : 'bad'} data-testid="ex-es-note">
        {mode === 'blank'
          ? <><b>A dead end that looks broken.</b> Nothing tells the user this is empty by design rather than failing or still loading.</>
          : mode === 'bare'
            ? <><b>A dead end that is merely true.</b> &quot;No projects&quot; explains nothing and offers nothing — the user is told they are stuck, not shown the way out.</>
            : <><b>A doorway.</b> It orients, says why it is empty, and hands over the next action. The button works — the empty view becomes the populated one. A first-run empty state is onboarding, not a blank screen.</>}
      </p>
    </div>
  );
}
