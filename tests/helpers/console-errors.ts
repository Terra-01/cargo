import type { Page } from '@playwright/test';

// Allowlist of KNOWN-BENIGN external console messages that must NOT fail a
// "renders without console errors" test. Keep each entry a SPECIFIC message
// signature — never a broad substring like "error"/"warning" — so a real
// Cargo error is still caught.
//
// Cargo self-hosts General Sans (Phase 11D-3b), so the api.fontshare.com
// cross-site-cookie error is gone at the source. This allowlist remains as
// hardening: other @import'd third-party CDNs (e.g. Google Fonts) can emit
// the same Firefox-only cross-site-cookie console error, which is browser/CDN
// behaviour, not a Cargo bug.
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
