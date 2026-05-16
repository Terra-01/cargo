import type { BrowserContext } from '@playwright/test';

// Grant clipboard access in a browser-agnostic way.
//
// Chromium uses the `clipboard-read`/`clipboard-write` context permissions.
// Playwright-Firefox does NOT recognise those names and throws
// "Unknown permission: clipboard-read" if you try to grant them — Firefox
// clipboard in automation is enabled instead via firefoxUserPrefs
// (dom.events.testing.asyncClipboard etc.) set in playwright.config.ts.
// So: attempt the grant (no-op-safe for Chromium) and swallow only the
// Firefox "unknown permission" rejection.
export async function grantClipboard(context: BrowserContext): Promise<void> {
  try {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  } catch {
    // Firefox: permission names unsupported; clipboard comes from prefs.
  }
}
