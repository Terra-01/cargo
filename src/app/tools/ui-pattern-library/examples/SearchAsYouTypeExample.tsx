'use client';
import { useEffect, useRef, useState } from 'react';

// A real scenario: the SAME field over the SAME list, three ways. Instant
// against a small local list is snappy and right. Instant against a costly
// (remote-feeling) source fires a request per keystroke — the counter climbs,
// results lag and flicker stale. Debounced is the middle ground: live feeling,
// one request after you pause. You feel why instant is right locally and
// wrong when each query costs something.

type Mode = 'instant' | 'costly' | 'debounced';

const ITEMS = [
  'Dashboard', 'Settings', 'Billing', 'Members', 'API keys', 'Webhooks',
  'Audit log', 'Integrations', 'Notifications', 'Security', 'Domains', 'Usage',
];

export function SearchAsYouTypeExample() {
  const [mode, setMode] = useState<Mode>('instant');
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<string[]>(ITEMS);
  const [requests, setRequests] = useState(0);
  const [searching, setSearching] = useState(false);
  const debounceRef = useRef<number | null>(null);
  const reqRef = useRef<number | null>(null);

  const filterFor = (q: string) =>
    ITEMS.filter((i) => i.toLowerCase().includes(q.trim().toLowerCase()));

  useEffect(
    () => () => {
      if (debounceRef.current) window.clearTimeout(debounceRef.current);
      if (reqRef.current) window.clearTimeout(reqRef.current);
    },
    []
  );

  const reset = (m: Mode) => {
    if (debounceRef.current) window.clearTimeout(debounceRef.current);
    if (reqRef.current) window.clearTimeout(reqRef.current);
    setMode(m);
    setQuery('');
    setResults(ITEMS);
    setRequests(0);
    setSearching(false);
  };

  const runRemote = (q: string) => {
    setRequests((n) => n + 1);
    setSearching(true);
    if (reqRef.current) window.clearTimeout(reqRef.current);
    reqRef.current = window.setTimeout(() => {
      setResults(filterFor(q));
      setSearching(false);
    }, 650);
  };

  const onChange = (q: string) => {
    setQuery(q);
    if (mode === 'instant') {
      setResults(filterFor(q));
      return;
    }
    if (mode === 'costly') {
      runRemote(q); // a request on every keystroke
      return;
    }
    // debounced: one request after the user pauses
    setSearching(true);
    if (debounceRef.current) window.clearTimeout(debounceRef.current);
    debounceRef.current = window.setTimeout(() => runRemote(q), 400);
  };

  return (
    <div className="upl-ex" data-testid="ex-search-as-you-type">
      <style>{`
        .upl-ex-st__seg { display: inline-flex; border: 1px solid var(--border-strong); border-radius: var(--radius-md); overflow: hidden; margin-bottom: var(--space-3); }
        .upl-ex-st__seg button {
          font-family: var(--font-mono); font-size: 11px;
          min-height: 44px; min-width: 44px; padding: 6px 13px;
          display: inline-flex; align-items: center; justify-content: center;
          border: none; background: var(--surface); color: var(--text-muted); cursor: pointer;
        }
        .upl-ex-st__seg button[data-on="true"] { background: var(--accent-soft); color: var(--accent); }
        .upl-ex-st__seg button + button { border-left: 1px solid var(--border-strong); }
        .upl-ex-st__field { position: relative; margin-bottom: var(--space-3); }
        .upl-ex-st__field input {
          width: 100%; min-height: 44px; padding: 9px 12px; background: var(--surface);
          border: 1px solid var(--border-strong); border-radius: var(--radius-md);
          font-family: var(--font-mono); font-size: var(--text-sm); color: var(--text);
        }
        .upl-ex-st__field input:focus-visible { outline: none; border-color: var(--accent); box-shadow: 0 0 0 3px var(--accent-soft); }
        .upl-ex-st__meta {
          display: flex; gap: var(--space-4); margin-bottom: var(--space-2);
          font-family: var(--font-mono); font-size: 11px; color: var(--text-faint);
        }
        .upl-ex-st__meta b { color: var(--accent); }
        .upl-ex-st__meta [data-busy="true"] { color: #d97706; }
        .upl-ex-st__list {
          border: 1px solid var(--border); border-radius: var(--radius-md);
          background: var(--surface-muted); padding: var(--space-2);
          min-height: 150px; max-height: 150px; overflow-y: auto;
          transition: opacity 120ms linear;
        }
        .upl-ex-st__list[data-stale="true"] { opacity: 0.45; }
        .upl-ex-st__row {
          padding: 7px 10px; font-family: var(--font-mono); font-size: 12px;
          color: var(--text); border-radius: var(--radius-sm);
        }
        .upl-ex-st__row:nth-child(odd) { background: var(--surface); }
        .upl-ex-st__empty { padding: var(--space-3); font-family: var(--font-mono); font-size: 12px; color: var(--text-faint); }
        .upl-ex-st__note {
          margin-top: var(--space-3); font-size: var(--text-sm); line-height: 1.55;
          color: var(--text-muted); padding: var(--space-3);
          border-left: 2px solid var(--accent); background: var(--accent-soft);
          border-radius: var(--radius-sm);
        }
        .upl-ex-st__note[data-kind="bad"]  { border-left-color: #dc2626; }
        .upl-ex-st__note[data-kind="warn"] { border-left-color: #d97706; }
        .upl-ex-st__note b { color: var(--text); }
      `}</style>

      <div className="upl-ex-st__seg" role="group" aria-label="Search behaviour">
        <button type="button" data-on={mode === 'instant'} onClick={() => reset('instant')} data-testid="ex-sat-mode-instant">local · instant (right)</button>
        <button type="button" data-on={mode === 'costly'} onClick={() => reset('costly')} data-testid="ex-sat-mode-costly">remote · per keystroke (wrong)</button>
        <button type="button" data-on={mode === 'debounced'} onClick={() => reset('debounced')} data-testid="ex-sat-mode-debounced">remote · debounced</button>
      </div>

      <div className="upl-ex-st__field">
        <input
          type="text"
          value={query}
          placeholder="filter…"
          onChange={(e) => onChange(e.target.value)}
          data-testid="ex-sat-input"
          aria-label="Search"
        />
      </div>

      <div className="upl-ex-st__meta">
        <span>requests fired: <b data-testid="ex-sat-reqcount">{requests}</b></span>
        <span data-busy={searching} data-testid="ex-sat-status">
          {searching ? 'searching…' : 'idle'}
        </span>
      </div>

      <div
        className="upl-ex-st__list"
        data-stale={searching && mode !== 'instant'}
        data-testid="ex-sat-results"
      >
        {results.length === 0 ? (
          <p className="upl-ex-st__empty">no matches</p>
        ) : (
          results.map((r) => (
            <div className="upl-ex-st__row" key={r} data-testid={`ex-sat-row-${r}`}>{r}</div>
          ))
        )}
      </div>

      <p
        className="upl-ex-st__note"
        data-kind={mode === 'costly' ? 'bad' : mode === 'debounced' ? 'warn' : undefined}
        data-testid="ex-sat-note"
      >
        {mode === 'instant'
          ? 'A bounded local list, filtered live. Zero network, instant feedback — search-as-you-type at its best.'
          : mode === 'costly'
            ? <><b>One request per keystroke.</b> The counter climbs, results lag and flash stale. For a costly or remote query this is wasteful and janky.</>
            : <><b>Debounced.</b> Still feels live, but one request fires after you pause — the middle ground when feedback is wanted and each query has a cost.</>}
      </p>
    </div>
  );
}
