'use client';
import { useEffect, useRef, useState } from 'react';

// A real scenario built around behaviour over TIME, so the failure case is the
// whole point. A like button, the canonical optimistic action, with a network
// toggle you can set to fail:
//
//  - Optimistic + fail: the heart fills and the count jumps instantly, then
//    ~900ms later it awkwardly un-fills and drops back. For a moment the UI
//    lied. That is the cost, and you can feel it.
//  - Pessimistic + fail: a spinner, then nothing changes and an honest "could
//    not save". Slower, but it never showed a state that was not true.
//
// The event log makes the sequence legible — the lesson is in the ordering.

type Mode = 'optimistic' | 'pessimistic';
type Net = 'ok' | 'fail';

export function OptimisticVsPessimisticExample() {
  const [mode, setMode] = useState<Mode>('optimistic');
  const [net, setNet] = useState<Net>('fail');
  const [liked, setLiked] = useState(false);
  const [count, setCount] = useState(128);
  const [pending, setPending] = useState(false);
  const [log, setLog] = useState<string[]>([]);
  const timer = useRef<number | null>(null);

  useEffect(() => () => {
    if (timer.current) window.clearTimeout(timer.current);
  }, []);

  const push = (line: string) =>
    setLog((l) => [line, ...l].slice(0, 4));

  const reset = () => {
    if (timer.current) window.clearTimeout(timer.current);
    setLiked(false);
    setCount(128);
    setPending(false);
    setLog([]);
  };

  const onLike = () => {
    if (pending) return;
    const willLike = !liked;

    if (mode === 'optimistic') {
      // Update now, reconcile later.
      setLiked(willLike);
      setCount((c) => c + (willLike ? 1 : -1));
      setPending(true);
      push(`tap → UI updated instantly (${willLike ? 'liked' : 'unliked'})`);
      timer.current = window.setTimeout(() => {
        setPending(false);
        if (net === 'fail') {
          setLiked(!willLike);
          setCount((c) => c + (willLike ? -1 : 1));
          push('server failed → reverted. The UI briefly lied.');
        } else {
          push('server confirmed → nothing to do, already shown');
        }
      }, 900);
    } else {
      // Wait for the server. Show only the truth.
      setPending(true);
      push('tap → waiting for the server, UI unchanged');
      timer.current = window.setTimeout(() => {
        setPending(false);
        if (net === 'fail') {
          push('server failed → still unchanged, honest "could not save"');
        } else {
          setLiked(willLike);
          setCount((c) => c + (willLike ? 1 : -1));
          push(`server confirmed → UI updated now (${willLike ? 'liked' : 'unliked'})`);
        }
      }, 900);
    }
  };

  const failedNow =
    !pending &&
    net === 'fail' &&
    log[0]?.includes('could not save') === true;

  return (
    <div className="upl-ex" data-testid="ex-optimistic">
      <style>{`
        .upl-ex-op__bar {
          display: flex;
          gap: var(--space-2);
          flex-wrap: wrap;
          align-items: center;
          margin-bottom: var(--space-4);
        }
        .upl-ex-op__bar > span {
          font-family: var(--font-mono);
          font-size: 11px;
          color: var(--text-faint);
        }
        .upl-ex-op__post {
          border: 1px solid var(--border);
          border-radius: var(--radius-md);
          background: var(--surface);
          padding: var(--space-4);
          display: flex;
          flex-direction: column;
          gap: var(--space-3);
        }
        .upl-ex-op__head {
          display: flex;
          align-items: center;
          gap: var(--space-3);
        }
        .upl-ex-op__avatar {
          width: 30px; height: 30px;
          border-radius: 50%;
          background: linear-gradient(135deg, var(--accent), var(--accent-hover));
          flex-shrink: 0;
        }
        .upl-ex-op__who b {
          display: block;
          font-size: var(--text-sm);
          color: var(--text);
        }
        .upl-ex-op__who span {
          font-family: var(--font-mono);
          font-size: 11px;
          color: var(--text-faint);
        }
        .upl-ex-op__body {
          font-size: var(--text-sm);
          color: var(--text-muted);
          line-height: 1.55;
        }
        .upl-ex-op__like {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          align-self: flex-start;
          font-family: var(--font-mono);
          font-size: var(--text-sm);
          padding: 8px 14px;
          border-radius: var(--radius-pill);
          border: 1px solid var(--border-strong);
          background: var(--surface);
          color: var(--text);
          cursor: pointer;
        }
        .upl-ex-op__like[data-liked="true"] {
          border-color: var(--accent);
          background: var(--accent-soft);
          color: var(--accent);
        }
        .upl-ex-op__like:disabled { cursor: progress; }
        .upl-ex-op__heart[data-liked="true"] { color: var(--accent); }
        .upl-ex-op__spin {
          width: 12px; height: 12px;
          border: 2px solid var(--accent-soft);
          border-top-color: var(--accent);
          border-radius: 50%;
          animation: upl-ex-op-spin 0.7s linear infinite;
        }
        @keyframes upl-ex-op-spin { to { transform: rotate(360deg); } }
        .upl-ex-op__err {
          font-family: var(--font-mono);
          font-size: 11px;
          color: #dc2626;
        }
        .upl-ex-op__log {
          margin-top: var(--space-3);
          border: 1px solid var(--border);
          border-radius: var(--radius-md);
          background: var(--surface-muted);
          padding: var(--space-3);
          display: flex;
          flex-direction: column;
          gap: 4px;
          min-height: 92px;
        }
        .upl-ex-op__log b {
          font-family: var(--font-mono);
          font-size: 10px;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: var(--text-faint);
        }
        .upl-ex-op__log li {
          font-family: var(--font-mono);
          font-size: 11px;
          color: var(--text-muted);
          list-style: none;
        }
        .upl-ex-op__log li:first-of-type { color: var(--text); }
        /* Self-contained controls — no reliance on a sibling example. */
        .upl-ex-op__seg {
          display: inline-flex;
          border: 1px solid var(--border-strong);
          border-radius: var(--radius-md);
          overflow: hidden;
        }
        .upl-ex-op__seg button {
          font-family: var(--font-mono);
          font-size: 11px;
          padding: 6px 11px;
          border: none;
          background: var(--surface);
          color: var(--text-muted);
          cursor: pointer;
        }
        .upl-ex-op__seg button[data-on="true"] {
          background: var(--accent-soft);
          color: var(--accent);
        }
        .upl-ex-op__seg button + button { border-left: 1px solid var(--border-strong); }
        .upl-ex-op__btn {
          font-family: var(--font-mono);
          font-size: var(--text-xs);
          padding: 7px 13px;
          border-radius: var(--radius-md);
          border: 1px solid var(--border-strong);
          background: var(--surface);
          color: var(--text);
          cursor: pointer;
          transition: border-color var(--t-fast) var(--ease), background var(--t-fast) var(--ease);
          white-space: nowrap;
        }
        .upl-ex-op__btn:hover { border-color: var(--accent); }
      `}</style>

      <div className="upl-ex-op__bar">
        <div className="upl-ex-op__seg" role="group" aria-label="UI strategy">
          <button
            type="button"
            data-on={mode === 'optimistic'}
            onClick={() => { setMode('optimistic'); reset(); }}
            data-testid="ex-op-mode-optimistic"
          >
            optimistic
          </button>
          <button
            type="button"
            data-on={mode === 'pessimistic'}
            onClick={() => { setMode('pessimistic'); reset(); }}
            data-testid="ex-op-mode-pessimistic"
          >
            pessimistic
          </button>
        </div>
        <div className="upl-ex-op__seg" role="group" aria-label="Network outcome">
          <button
            type="button"
            data-on={net === 'ok'}
            onClick={() => setNet('ok')}
            data-testid="ex-op-net-ok"
          >
            network ok
          </button>
          <button
            type="button"
            data-on={net === 'fail'}
            onClick={() => setNet('fail')}
            data-testid="ex-op-net-fail"
          >
            network fails
          </button>
        </div>
        <button
          type="button"
          className="upl-ex-op__btn"
          onClick={reset}
          data-testid="ex-op-reset"
        >
          reset
        </button>
      </div>

      <div className="upl-ex-op__post">
        <div className="upl-ex-op__head">
          <div className="upl-ex-op__avatar" />
          <div className="upl-ex-op__who">
            <b>Dana Okoro</b>
            <span>@danabuilds · 2h</span>
          </div>
        </div>
        <p className="upl-ex-op__body">
          Shipped the new grid system today. Small thing, but it finally feels
          right.
        </p>
        <button
          type="button"
          className="upl-ex-op__like"
          data-liked={liked}
          onClick={onLike}
          disabled={pending}
          data-testid="ex-op-like"
        >
          {pending && mode === 'pessimistic' ? (
            <span className="upl-ex-op__spin" data-testid="ex-op-spinner" />
          ) : (
            <span className="upl-ex-op__heart" data-liked={liked} aria-hidden>
              {liked ? '♥' : '♡'}
            </span>
          )}
          <span data-testid="ex-op-count">{count}</span>
        </button>
        {failedNow && (
          <span className="upl-ex-op__err" data-testid="ex-op-error">
            could not save your like, tap to try again
          </span>
        )}
      </div>

      <ul className="upl-ex-op__log" data-testid="ex-op-log">
        <b>event log</b>
        {log.length === 0 ? (
          <li style={{ opacity: 0.6 }}>tap the like button…</li>
        ) : (
          log.map((line, i) => <li key={`${i}-${line}`}>{line}</li>)
        )}
      </ul>
    </div>
  );
}
