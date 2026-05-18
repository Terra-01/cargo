'use client';
import { useState } from 'react';
import type { ExportSection } from './effects';

// The shared, sectioned export. Build once; every effect feeds it the same
// declarative `sections` array. A code section is independently copyable
// (CSS and HTML go in different files); a note section is a plain statement
// (the "no markup needed" case, the requirements gotcha). An effect with
// pseudo-element blocks plus a note, and a filter-only single-rule effect,
// both render through this component without it knowing which is which.

function CopyButton({ text, testId }: { text: string; testId: string }) {
  const [copied, setCopied] = useState(false);
  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard may be unavailable in some environments; fail silently.
    }
  };
  return (
    <button type="button" className="code__copy" onClick={onCopy} data-testid={testId}>
      {copied ? 'copied' : 'copy'}
    </button>
  );
}

export function ExportPanel({ sections }: { sections: ExportSection[] }) {
  return (
    <div className="fx-export" data-testid="fx-export">
      {sections.map((s) => (
        <section className="fx-section" key={s.slug}>
          <p className="fx-section__label">{'// '}{s.label.toLowerCase()}</p>
          {s.kind === 'code' ? (
            <div className="code" data-testid={`export-${s.slug}`}>
              {s.code}
              <CopyButton text={s.code} testId={`copy-${s.slug}`} />
            </div>
          ) : (
            <p className="fx-note" data-testid={`export-${s.slug}`}>
              {s.text}
            </p>
          )}
        </section>
      ))}
    </div>
  );
}
