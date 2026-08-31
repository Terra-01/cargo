import type { Page } from '@playwright/test';

// Allowlist of KNOWN-BENIGN external console messages that must NOT fail a
// "renders without console errors" test. Keep each entry a SPECIFIC message
// signature — never a broad substring like "error"/"warning" — so a real
// Cargo error is still caught.
//
// Every font is now loaded by next/font/google and served from our own origin,
// so Cargo makes no third-party requests at runtime at all — the cross-site
// cookie errors these patterns cover (first from api.fontshare.com, later from
// the Google Fonts @import) are gone at the source. The allowlist is kept as
// hardening in case a future third-party CDN reintroduces the Firefox-only
// variant, which is browser/CDN behaviour rather than a Cargo bug.
export const BENIGN_CONSOLE_PATTERNS: RegExp[] = [
  // Firefox logs third-party cross-site cookie SameSite rejections as errors.
  /Cookie .* has been rejected because it is in a cross-site context/i,
  /Cookie .* has been rejected for invalid domain/i,
];

export interface ConsoleErrorWatcher {
  errors: string[];
}

/** Attach console.error + pageerror collectors to a page. */
export function watchConsoleErrors(page: Page): ConsoleErrorWatcher {
  const w: ConsoleErrorWatcher = { errors: [] };
  page.on('console', (msg) => {
    if (msg.type() === 'error') w.errors.push(msg.text());
  });
  page.on('pageerror', (err) => w.errors.push(err.message));
  return w;
}

/**
 * Return only the messages that should fail a test — i.e. drop the benign
 * allowlist plus any per-suite `extra` patterns (e.g. `/webgl/i` for the
 * shader tool, whose WebGL warnings are environment-dependent).
 */
export function realConsoleErrors(
  errors: string[],
  extra: RegExp[] = []
): string[] {
  const patterns = [...BENIGN_CONSOLE_PATTERNS, ...extra];
  return errors.filter((e) => !patterns.some((p) => p.test(e)));
}
