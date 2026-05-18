'use client';
import { useEffect, useRef, useState } from 'react';

// A real scenario in two halves:
//
//  A. An icon-only button with a text tooltip on hover/focus. A short hint
//     naming the control. The tooltip doing its job.
//  B. A "share" action that needs interactive content (a Copy button). Shown
//     as a tooltip vs a popover. In tooltip mode the content is literally
//     unreachable: a tooltip dismisses the moment you leave the trigger, so
//     reaching for the button inside it closes it. The popover stays open and
//     the button works. You feel why a tooltip cannot hold an action.

type Mode = 'tooltip' | 'popover';

export function TooltipExample() {
  const [hintShown, setHintShown] = useState(false);
  const [mode, setMode] = useState<Mode>('tooltip');
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [missed, setMissed] = useState(0);
  const [copied, setCopied] = useState(false);
  const copyTimer = useRef<number | null>(null);

  useEffect(
    () => () => {
      if (copyTimer.current) window.clearTimeout(copyTimer.current);
    },
    []
  );

  // Leaving the share trigger to reach the tooltip's button closes the
  // tooltip first. This is the real failure, modelled deterministically.
  const reachForTooltipButton = () => {
    setMissed((n) => n + 1);
  };

  const doCopy = () => {
    setCopied(false);
    window.setTimeout(() => setCopied(true), 20);
    if (copyTimer.current) window.clearTimeout(copyTimer.current);
    copyTimer.current = window.setTimeout(() => setCopied(false), 2200);
  };

  const switchMode = (m: Mode) => {
    setMode(m);
    setPopoverOpen(false);
    setMissed(0);
    setCopied(false);
  };

  return (
    <div className="upl-ex" data-testid="ex-tooltip">
      <style>{`
        .upl-ex-tp__stage {
          border-radius: var(--radius-md);
          background: var(--surface-muted);
          border: 1px solid var(--border);
          padding: var(--space-5);
          display: flex;
          flex-direction: column;
          gap: var(--space-5);
          min-height: 240px;
        }
        .upl-ex-tp__block {
          display: flex;
          flex-direction: column;
          gap: var(--space-2);
        }
        .upl-ex-tp__cap {
          font-family: var(--font-mono);
          font-size: 11px;
          color: var(--text-faint);
        }
        .upl-ex-tp__bar {
          display: flex;
          align-items: center;
          gap: var(--space-3);
          flex-wrap: wrap;
        }
        .upl-ex-tp__icon {
          position: relative;
          width: 44px;
          height: 44px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border: 1px solid var(--border-strong);
          border-radius: var(--radius-md);
          background: var(--surface);
          color: var(--text);
          cursor: pointer;
          font-size: 15px;
        }
        .upl-ex-tp__icon:hover, .upl-ex-tp__icon:focus-visible { border-color: var(--accent); outline: none; }
        .upl-ex-tp__hint {
          position: absolute;
          bottom: calc(100% + 7px);
          left: 50%;
          transform: translateX(-50%);
          background: var(--text);
          color: var(--surface);
          font-size: 11px;
          font-family: var(--font-mono);
          padding: 4px 8px;
          border-radius: var(--radius-sm);
          white-space: nowrap;
          pointer-events: none;
          opacity: 0;
          transition: opacity var(--t-fast) var(--ease);
        }
        .upl-ex-tp__hint[data-on="true"] { opacity: 1; }
        .upl-ex-tp__seg {
          display: inline-flex;
          border: 1px solid var(--border-strong);
          border-radius: var(--radius-md);
          overflow: hidden;
        }
        .upl-ex-tp__seg button {
          font-family: var(--font-mono);
          font-size: 11px;
          min-height: 44px;
          padding: 6px 14px;
          border: none;
          background: var(--surface);
          color: var(--text-muted);
          cursor: pointer;
        }
        .upl-ex-tp__seg button[data-on="true"] { background: var(--accent-soft); color: var(--accent); }
        .upl-ex-tp__seg button + button { border-left: 1px solid var(--border-strong); }
        .upl-ex-tp__share {
          position: relative;
          display: inline-flex;
        }
        .upl-ex-tp__trigger {
          font-family: var(--font-mono);
          font-size: var(--text-xs);
          display: inline-flex;
          align-items: center;
          min-height: 44px;
          padding: 7px 14px;
          border-radius: var(--radius-md);
          border: 1px solid var(--border-strong);
          background: var(--surface);
          color: var(--text);
          cursor: pointer;
        }
        .upl-ex-tp__trigger:hover { border-color: var(--accent); }
        .upl-ex-tp__float {
          position: absolute;
          top: calc(100% + 8px);
          left: 0;
          min-width: 200px;
          background: var(--surface);
          border: 1px solid var(--border-strong);
          border-radius: var(--radius-md);
          padding: var(--space-3);
          box-shadow: 0 12px 30px color-mix(in srgb, #000 22%, transparent);
          z-index: 5;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .upl-ex-tp__float[data-variant="tooltip"] {
          background: var(--text);
          border: none;
        }
        .upl-ex-tp__float[data-variant="tooltip"] p { color: var(--surface); }
        .upl-ex-tp__float p {
          font-size: 12px;
          color: var(--text-muted);
          line-height: 1.5;
        }
        .upl-ex-tp__float button {
          align-self: flex-start;
          font-family: var(--font-mono);
          font-size: 11px;
          display: inline-flex;
          align-items: center;
          min-height: 44px;
          padding: 5px 14px;
          border-radius: var(--radius-sm);
          border: 1px solid var(--accent);
          background: var(--accent-soft);
          color: var(--accent);
          cursor: pointer;
        }
        .upl-ex-tp__msg {
          font-family: var(--font-mono);
          font-size: 11px;
        }
        .upl-ex-tp__msg[data-kind="bad"] { color: #dc2626; }
        .upl-ex-tp__msg[data-kind="good"] { color: #16a34a; }
        .upl-ex-tp__cap,
        .upl-ex-tp__msg,
        .upl-ex-tp__float p { overflow-wrap: anywhere; }
        /* Mobile: the floating tooltip/popover stays inside the demo box. */
        @media (max-width: 599px) {
          .upl-ex-tp__float { min-width: 0; width: 200px; }
        }
      `}</style>

      <div className="upl-ex-tp__stage">
        <div className="upl-ex-tp__block">
          <span className="upl-ex-tp__cap">tooltip done right — a hint for an icon-only control</span>
          <div className="upl-ex-tp__bar">
            <span
              className="upl-ex-tp__icon"
              tabIndex={0}
              role="button"
              aria-label="Settings"
              aria-expanded={hintShown}
              data-testid="ex-tip-icon"
              onMouseEnter={() => setHintShown(true)}
              onMouseLeave={() => setHintShown(false)}
              onFocus={() => setHintShown(true)}
              onBlur={() => setHintShown(false)}
              onClick={() => setHintShown(true)}
            >
              ⚙
              <span
                className="upl-ex-tp__hint"
                data-on={hintShown}
                data-testid="ex-tip-tooltip"
                role="tooltip"
              >
                Settings
              </span>
            </span>
            <span className="upl-ex-tp__cap">hover, focus, or tap the icon</span>
          </div>
        </div>

        <div className="upl-ex-tp__block">
          <span className="upl-ex-tp__cap">
            now put an action inside it — tooltip cannot hold a button, popover can
          </span>
          <div className="upl-ex-tp__bar">
            <div className="upl-ex-tp__seg" role="group" aria-label="Container">
              <button
                type="button"
                data-on={mode === 'tooltip'}
                onClick={() => switchMode('tooltip')}
                data-testid="ex-tip-mode-tooltip"
              >
                tooltip
              </button>
              <button
                type="button"
                data-on={mode === 'popover'}
                onClick={() => switchMode('popover')}
                data-testid="ex-tip-mode-popover"
              >
                popover
              </button>
            </div>

            <div className="upl-ex-tp__share">
              <button
                type="button"
                className="upl-ex-tp__trigger"
                data-testid="ex-tip-share"
                onClick={() => {
                  if (mode === 'popover') setPopoverOpen((o) => !o);
                }}
              >
                share ▾
              </button>

              {mode === 'tooltip' && (
                <div
                  className="upl-ex-tp__float"
                  data-variant="tooltip"
                  data-testid="ex-tip-tooltip-float"
                  role="tooltip"
                >
                  <p>Copy link</p>
                  <button
                    type="button"
                    data-testid="ex-tip-reach"
                    onClick={reachForTooltipButton}
                  >
                    reach for this button →
                  </button>
                </div>
              )}

              {mode === 'popover' && popoverOpen && (
                <div
                  className="upl-ex-tp__float"
                  data-variant="popover"
                  data-testid="ex-tip-popover"
                  role="dialog"
                  aria-label="Share"
                >
                  <p>Share this page</p>
                  <button
                    type="button"
                    data-testid="ex-tip-copy"
                    onClick={doCopy}
                  >
                    {copied ? 'copied ✓' : 'copy link'}
                  </button>
                </div>
              )}
            </div>
          </div>

          {mode === 'tooltip' && missed > 0 && (
            <p className="upl-ex-tp__msg" data-kind="bad" data-testid="ex-tip-missed">
              the tooltip closed the moment you moved toward it ({missed}×). Its
              button is unreachable. A tooltip is hover-only and dies on leave.
            </p>
          )}
          {mode === 'popover' && copied && (
            <p className="upl-ex-tp__msg" data-kind="good" data-testid="ex-tip-copied">
              the popover stayed open and the action worked. This is what
              interactive content needs.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
