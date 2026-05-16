'use client';
import { useCallback, useEffect, useRef, useState } from 'react';

// The character-per-line count is the centerpiece, not a footnote. The user
// drags the column and watches a real measured number cross out of the
// comfortable 45-75 band, with the judgment flipping the same way the
// line-height demo flips its three states. The paragraph is long on purpose
// so the wide extreme can actually be felt, not just asserted.
const SAMPLE =
  'Reading is a physical act. Your eyes do not glide smoothly along a line; they jump in small hops and then snap back to the start of the next line, over and over, hundreds of times a page. When the line is a comfortable width that return trip is short and your eye finds the next line without thinking. When the line runs too wide the trip back is long and uncertain, your eye lands on the wrong line, rereads it, and quietly tires you out. When the line is too narrow it snaps back so often that the words arrive in stubs and the rhythm never settles. Drag the column wider and narrower, watch the count, and notice the exact moment reading stops feeling effortless.';

const TEXT_LEN = SAMPLE.length;

const NARROW_MAX = 45;
const WIDE_MIN = 75;

type Verdict = 'narrow' | 'comfortable' | 'wide';

function judge(cpl: number): Verdict {
  if (cpl < NARROW_MAX) return 'narrow';
  if (cpl > WIDE_MIN) return 'wide';
  return 'comfortable';
}

const VERDICT_LABEL: Record<Verdict, string> = {
  narrow: 'too narrow · the text breaks up',
  comfortable: 'comfortable',
  wide: 'too wide · watch your eye lose the line',
};

// Preset widths sit well inside each band so the judgment is unambiguous
// across browsers, not balanced on an edge.
const PRESETS = [
  { id: 'narrow', label: 'too narrow', width: 250 },
  { id: 'comfortable', label: 'comfortable', width: 470 },
  { id: 'wide', label: 'too wide', width: 900 },
] as const;

const MIN_W = 220;
const MAX_W = 940;

export function LineLengthDemo() {
  const [width, setWidth] = useState(470);
  const [cpl, setCpl] = useState(60);
  const paraRef = useRef<HTMLParagraphElement>(null);

  // Average characters per line = total characters / number of rendered
  // lines. Lines are derived from the real rendered height over the real
  // computed line-height, so this is a measurement of the actual layout,
  // not the ch value fed back to itself.
  const measure = useCallback(() => {
    const el = paraRef.current;
    if (!el) return;
    const cs = getComputedStyle(el);
    const lh = parseFloat(cs.lineHeight);
    if (!lh || Number.isNaN(lh)) return;
    const lines = Math.max(1, Math.round(el.scrollHeight / lh));
    setCpl(Math.round(TEXT_LEN / lines));
  }, []);

  useEffect(() => {
    measure();
  }, [width, measure]);

  useEffect(() => {
    // Re-measure once webfonts settle (glyph metrics shift the wrap) and on
    // viewport changes. No ResizeObserver: it can emit loop-notification
    // console noise that would trip the no-console-errors test, and width is
    // the only thing that changes the wrap here anyway.
    const onResize = () => measure();
    window.addEventListener('resize', onResize);
    const fonts = (document as Document & { fonts?: FontFaceSet }).fonts;
    fonts?.ready.then(measure).catch(() => {});
    return () => window.removeEventListener('resize', onResize);
  }, [measure]);

  const verdict = judge(cpl);
  const activePreset = PRESETS.find((p) => p.width === width)?.id ?? null;

  return (
    <div className="tfg-ll" data-testid="ll-demo">
      <style>{`
        .tfg-ll {
          margin-top: var(--space-8);
          border: 1px solid var(--border);
          border-radius: var(--radius-lg);
          background: var(--surface);
          overflow: hidden;
        }
        .tfg-ll__stage {
          padding: var(--space-8);
          display: flex;
          justify-content: center;
        }
        .tfg-ll__sample {
          font-family: var(--font-sans);
          font-size: 17px;
          line-height: 1.6;
          color: var(--text);
          margin: 0;
          padding: 0;
        }
        .tfg-ll__controls {
          border-top: 1px solid var(--border);
          background: var(--surface-muted);
          padding: var(--space-5) var(--space-8) var(--space-6);
          display: flex;
          flex-direction: column;
          gap: var(--space-5);
        }
        .tfg-ll__verdict {
          display: flex;
          align-items: baseline;
          justify-content: space-between;
          gap: var(--space-4);
          flex-wrap: wrap;
        }
        .tfg-ll__count {
          font-family: var(--font-sans);
          font-weight: 600;
          font-size: var(--text-2xl);
          letter-spacing: -0.02em;
          color: var(--text);
          font-variant-numeric: tabular-nums;
        }
        .tfg-ll__count span {
          font-family: var(--font-mono);
          font-weight: 400;
          font-size: var(--text-sm);
          color: var(--text-muted);
          letter-spacing: 0.02em;
          margin-left: var(--space-2);
        }
        .tfg-ll__judgment {
          font-family: var(--font-sans);
          font-weight: 500;
          font-size: var(--text-md);
          letter-spacing: -0.01em;
          color: var(--text-faint);
          text-align: right;
        }
        .tfg-ll__judgment--ok { color: var(--accent); }
        .tfg-ll__segments {
          display: flex;
          border: 1px solid var(--border-strong);
          border-radius: var(--radius-md);
          overflow: hidden;
        }
        .tfg-ll__segment {
          flex: 1;
          padding: 8px 12px;
          font-family: var(--font-mono);
          font-size: var(--text-xs);
          letter-spacing: 0.04em;
          background: transparent;
          border: none;
          border-left: 1px solid var(--border-strong);
          color: var(--text-muted);
          cursor: pointer;
          transition: all var(--t-fast) var(--ease);
        }
        .tfg-ll__segment:first-child { border-left: none; }
        .tfg-ll__segment:hover { color: var(--text); }
        .tfg-ll__segment--active {
          background: var(--text);
          color: var(--bg);
        }
        .tfg-ll__segment--active.tfg-ll__segment--ok {
          background: var(--accent);
          color: #FFFFFF;
        }
        .tfg-ll__slider-row {
          display: flex;
          flex-direction: column;
          gap: var(--space-2);
        }
        .tfg-ll__scale {
          display: flex;
          justify-content: space-between;
          font-family: var(--font-mono);
          font-size: var(--text-xs);
          color: var(--text-faint);
          letter-spacing: 0.04em;
        }
        .tfg-ll__hint {
          font-family: var(--font-mono);
          font-size: var(--text-xs);
          line-height: 1.6;
          letter-spacing: 0.02em;
          color: var(--text-faint);
          margin: 0;
          max-width: 60ch;
        }
      `}</style>

      <div className="tfg-ll__stage">
        <p
          ref={paraRef}
          className="tfg-ll__sample"
          data-testid="ll-paragraph"
          style={{ width: `${width}px` }}
        >
          {SAMPLE}
        </p>
      </div>

      <div className="tfg-ll__controls">
        <div className="tfg-ll__verdict">
          <span className="tfg-ll__count" data-testid="ll-count" data-cpl={cpl}>
            {cpl}
            <span>characters per line</span>
          </span>
          <span
            className={`tfg-ll__judgment ${verdict === 'comfortable' ? 'tfg-ll__judgment--ok' : ''}`}
            data-testid="ll-judgment"
          >
            {VERDICT_LABEL[verdict]}
          </span>
        </div>

        <div
          className="tfg-ll__segments"
          role="group"
          aria-label="Line length presets"
        >
          {PRESETS.map((p) => {
            const active = activePreset === p.id;
            return (
              <button
                key={p.id}
                type="button"
                className={`tfg-ll__segment ${active ? 'tfg-ll__segment--active' : ''} ${
                  p.id === 'comfortable' ? 'tfg-ll__segment--ok' : ''
                }`}
                aria-pressed={active}
                data-testid={`ll-state-${p.id}`}
                onClick={() => setWidth(p.width)}
              >
                {p.label}
              </button>
            );
          })}
        </div>

        <div className="tfg-ll__slider-row">
          <input
            type="range"
            className="slider"
            min={MIN_W}
            max={MAX_W}
            step={10}
            value={width}
            onChange={(e) => setWidth(Number(e.target.value))}
            aria-label="Column width"
            data-testid="ll-slider"
          />
          <div className="tfg-ll__scale" aria-hidden="true">
            <span>narrow</span>
            <span>comfortable</span>
            <span>wide</span>
          </div>
        </div>

        <p className="tfg-ll__hint">
          Wide columns and tight line height are the two that tire readers out,
          and they compound. Fix is one line: max-width on your text in ch
          units, around 65ch.
        </p>
      </div>
    </div>
  );
}
