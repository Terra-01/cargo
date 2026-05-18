'use client';
import { useEffect, useRef, useState } from 'react';

// A real scenario: the SAME 30 search results, revealed two ways. The toggle
// lets you feel the actual difference, not read about it:
//
//  - Pagination: result #19 has an address (page 4). "Take me back to #19"
//    works instantly, and the footer sits right there under the last page.
//  - Infinite scroll: there is no address for #19. The best the stream can do
//    is reload from the top. And the footer keeps getting pushed further away
//    every time you near the bottom and more loads in.

type Mode = 'pagination' | 'infinite';

const TOTAL = 30;
const PAGE_SIZE = 6;
const PAGES = Math.ceil(TOTAL / PAGE_SIZE);

const RESULTS = Array.from({ length: TOTAL }, (_, i) => {
  const n = i + 1;
  return {
    n,
    title: `Result ${n} — "responsive grid layout"`,
    meta: `example.com/article-${n} · ${2 + (i % 9)} min read`,
  };
});

const TARGET = 19; // the result the user wants to return to
const TARGET_PAGE = Math.floor((TARGET - 1) / PAGE_SIZE) + 1;

export function PaginationVsInfiniteScrollExample() {
  const [mode, setMode] = useState<Mode>('pagination');
  const [page, setPage] = useState(1);
  const [loaded, setLoaded] = useState(PAGE_SIZE);
  const [loadingMore, setLoadingMore] = useState(false);
  const [highlight, setHighlight] = useState<number | null>(null);
  const [note, setNote] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const timer = useRef<number | null>(null);

  // Reset per-mode state when the user flips the toggle. Done in the event
  // handler (not an effect) since the toggle buttons are the only thing that
  // changes mode, and resetting on the interaction is the React-recommended
  // shape for "reset state when X changes".
  const switchMode = (m: Mode) => {
    setMode(m);
    setPage(1);
    setLoaded(PAGE_SIZE);
    setHighlight(null);
    setNote(null);
    if (scrollRef.current) scrollRef.current.scrollTop = 0;
  };

  useEffect(() => () => {
    if (timer.current) window.clearTimeout(timer.current);
  }, []);

  // Infinite mode: nearing the bottom appends another batch. This is exactly
  // why the footer runs away — every approach loads more before you reach it.
  const onScroll = () => {
    if (mode !== 'infinite') return;
    const el = scrollRef.current;
    if (!el || loadingMore || loaded >= TOTAL) return;
    if (el.scrollTop + el.clientHeight >= el.scrollHeight - 36) {
      setLoadingMore(true);
      timer.current = window.setTimeout(() => {
        setLoaded((n) => Math.min(n + PAGE_SIZE, TOTAL));
        setLoadingMore(false);
      }, 650);
    }
  };

  const goToTarget = () => {
    if (mode === 'pagination') {
      setPage(TARGET_PAGE);
      setHighlight(TARGET);
      setNote(`Jumped straight to result #${TARGET} — it lives at page ${TARGET_PAGE}.`);
    } else {
      // No address exists. The honest best a stream can do is start over.
      setLoaded(PAGE_SIZE);
      setHighlight(null);
      if (scrollRef.current) scrollRef.current.scrollTop = 0;
      setNote(
        `Infinite scroll has no address for result #${TARGET}. The best it can do is reload from the top and make you scroll for it again.`
      );
    }
  };

  const visible =
    mode === 'pagination'
      ? RESULTS.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)
      : RESULTS.slice(0, loaded);

  const footerReachable = mode === 'pagination' || loaded >= TOTAL;

  return (
    <div className="upl-ex" data-testid="ex-pagination">
      <style>{`
        .upl-ex-pg__bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: var(--space-3);
          margin-bottom: var(--space-3);
          flex-wrap: wrap;
        }
        .upl-ex-pg__addr {
          font-family: var(--font-mono);
          font-size: 11px;
          color: var(--text-faint);
        }
        .upl-ex-pg__addr b { color: var(--accent); font-weight: 600; }
        .upl-ex-pg__scroll {
          height: 250px;
          overflow-y: auto;
          border: 1px solid var(--border);
          border-radius: var(--radius-md);
          background: var(--surface-muted);
        }
        .upl-ex-pg__item {
          display: flex;
          align-items: baseline;
          gap: var(--space-3);
          padding: var(--space-3) var(--space-4);
          border-bottom: 1px solid var(--border);
          background: var(--surface);
        }
        .upl-ex-pg__item[data-hl="true"] {
          background: var(--accent-soft);
          box-shadow: inset 3px 0 0 var(--accent);
        }
        .upl-ex-pg__n {
          font-family: var(--font-mono);
          font-size: 11px;
          color: var(--text-faint);
          min-width: 26px;
        }
        .upl-ex-pg__txt b {
          display: block;
          font-size: var(--text-sm);
          font-weight: 500;
          color: var(--text);
        }
        .upl-ex-pg__txt span {
          font-family: var(--font-mono);
          font-size: 11px;
          color: var(--text-faint);
        }
        .upl-ex-pg__loading {
          padding: var(--space-3);
          text-align: center;
          font-family: var(--font-mono);
          font-size: 11px;
          color: var(--text-muted);
        }
        .upl-ex-pg__footer {
          padding: var(--space-4);
          text-align: center;
          font-family: var(--font-mono);
          font-size: 11px;
          background: var(--surface-muted);
        }
        .upl-ex-pg__footer[data-reachable="true"] { color: var(--text-muted); }
        .upl-ex-pg__footer[data-reachable="false"] { color: var(--text-faint); opacity: 0.7; }
        .upl-ex-pg__pager {
          display: flex;
          align-items: center;
          gap: 4px;
          justify-content: center;
          padding: var(--space-3);
          background: var(--surface);
          border-top: 1px solid var(--border);
        }
        .upl-ex-pg__pager button {
          font-family: var(--font-mono);
          font-size: 11px;
          min-width: 26px;
          padding: 5px 8px;
          border: 1px solid var(--border);
          background: var(--surface);
          color: var(--text-muted);
          border-radius: var(--radius-sm);
          cursor: pointer;
        }
        .upl-ex-pg__pager button[data-on="true"] {
          border-color: var(--accent);
          background: var(--accent-soft);
          color: var(--accent);
        }
        .upl-ex-pg__pager button:disabled { opacity: 0.4; cursor: not-allowed; }
        .upl-ex-pg__note {
          margin-top: var(--space-3);
          font-size: var(--text-sm);
          line-height: 1.55;
          color: var(--text-muted);
          padding: var(--space-3);
          border-left: 2px solid var(--accent);
          background: var(--accent-soft);
          border-radius: var(--radius-sm);
        }
        /* Self-contained controls — no reliance on a sibling example. */
        .upl-ex-pg__seg {
          display: inline-flex;
          border: 1px solid var(--border-strong);
          border-radius: var(--radius-md);
          overflow: hidden;
        }
        .upl-ex-pg__seg button {
          font-family: var(--font-mono);
          font-size: 11px;
          padding: 6px 11px;
          border: none;
          background: var(--surface);
          color: var(--text-muted);
          cursor: pointer;
        }
        .upl-ex-pg__seg button[data-on="true"] {
          background: var(--accent-soft);
          color: var(--accent);
        }
        .upl-ex-pg__seg button + button { border-left: 1px solid var(--border-strong); }
        .upl-ex-pg__btn {
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
        .upl-ex-pg__btn:hover { border-color: var(--accent); }
      `}</style>

      <div className="upl-ex-pg__bar">
        <div className="upl-ex-pg__seg" role="group" aria-label="Reveal mode">
          <button
            type="button"
            data-on={mode === 'pagination'}
            onClick={() => switchMode('pagination')}
            data-testid="ex-pg-mode-pagination"
          >
            pagination
          </button>
          <button
            type="button"
            data-on={mode === 'infinite'}
            onClick={() => switchMode('infinite')}
            data-testid="ex-pg-mode-infinite"
          >
            infinite scroll
          </button>
        </div>
        <button
          type="button"
          className="upl-ex-pg__btn"
          onClick={goToTarget}
          data-testid="ex-pg-restore"
        >
          take me back to result #{TARGET}
        </button>
      </div>

      <p className="upl-ex-pg__addr" data-testid="ex-pg-addr">
        position:{' '}
        {mode === 'pagination' ? (
          <b>?page={page}</b>
        ) : (
          <b>(not addressable)</b>
        )}
      </p>

      <div
        className="upl-ex-pg__scroll"
        ref={scrollRef}
        onScroll={onScroll}
        data-testid="ex-pg-scroll"
      >
        {visible.map((r) => (
          <div
            key={r.n}
            className="upl-ex-pg__item"
            data-hl={highlight === r.n}
            data-testid={`ex-pg-item-${r.n}`}
          >
            <span className="upl-ex-pg__n">#{r.n}</span>
            <span className="upl-ex-pg__txt">
              <b>{r.title}</b>
              <span>{r.meta}</span>
            </span>
          </div>
        ))}

        {mode === 'infinite' && loadingMore && (
          <div className="upl-ex-pg__loading" data-testid="ex-pg-loading">
            loading more…
          </div>
        )}

        {mode === 'pagination' && (
          <div className="upl-ex-pg__pager" data-testid="ex-pg-pager">
            <button
              type="button"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              aria-label="Previous page"
            >
              ‹
            </button>
            {Array.from({ length: PAGES }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                type="button"
                data-on={p === page}
                onClick={() => setPage(p)}
                data-testid={`ex-pg-page-${p}`}
              >
                {p}
              </button>
            ))}
            <button
              type="button"
              onClick={() => setPage((p) => Math.min(PAGES, p + 1))}
              disabled={page === PAGES}
              aria-label="Next page"
            >
              ›
            </button>
          </div>
        )}

        <div
          className="upl-ex-pg__footer"
          data-reachable={footerReachable}
          data-testid="ex-pg-footer"
        >
          {footerReachable
            ? 'End of results · 30 results · Terms · Privacy'
            : 'footer is down here somewhere — keep scrolling (it moves)'}
        </div>
      </div>

      {note && (
        <p className="upl-ex-pg__note" data-testid="ex-pg-note">
          {note}
        </p>
      )}
    </div>
  );
}
