import { defineConfig, devices } from '@playwright/test';

// Default 3000, override with PORT. Locally `reuseExistingServer` will happily
// adopt whatever is already on 3000 — including an unrelated project's dev
// server — and then every spec fails with "element(s) not found" for reasons
// that have nothing to do with this repo. `PORT=3100 npx playwright test` gets
// you out of that without stopping the other server.
const PORT = process.env.PORT ?? '3000';
const BASE_URL = `http://localhost:${PORT}`;

export default defineConfig({
  testDir: './tests',
  fullyParallel: false,
  reporter: 'list',
  retries: 1,
  timeout: 60_000,
  use: {
    baseURL: BASE_URL,
    trace: 'on-first-retry',
    navigationTimeout: 60_000,
  },
  webServer: {
    // CI runs the suite against a production build; locally it uses the dev
    // server (fast edit-and-rerun). Dev-mode hot-reload was the root cause of
    // the known `back link returns to the hub` and dials-modal flakes — a
    // static build removes that whole class, so CI deliberately avoids it.
    command: process.env.CI
      ? `npm run start -- --port ${PORT}`
      : `npm run dev -- --port ${PORT}`,
    url: BASE_URL,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
  projects: [
    {
      name: 'chromium-light',
      use: {
        colorScheme: 'light',
        viewport: { width: 1280, height: 800 },
        permissions: ['clipboard-read', 'clipboard-write'],
      },
    },
    {
      name: 'chromium-dark',
      use: {
        colorScheme: 'dark',
        viewport: { width: 1280, height: 800 },
        permissions: ['clipboard-read', 'clipboard-write'],
      },
    },
    {
      name: 'firefox',
      use: {
        ...devices['Desktop Firefox'],
        viewport: { width: 1280, height: 800 },
        // Headless Firefox supports no WebGL whatsoever — not a blocklist we
        // can override with a pref, simply unimplemented (Mozilla bug 1375585).
        // Without a real display every Shader Gradient Lab spec fails, because
        // the tool renders its error state instead of the canvas. So on CI,
        // where there is no GPU, Firefox runs HEADED against the Xvfb display
        // the workflow provides; llvmpipe then gives it a software WebGL2
        // context. Locally, headless Firefox has a real GPU behind it and works
        // fine, so it stays headless for speed.
        headless: !process.env.CI,
        // Playwright-Firefox does not grant clipboard by default AND it
        // rejects the Chromium-only `clipboard-read`/`clipboard-write`
        // permission names ("Unknown permission"). Firefox clipboard in
        // automation is enabled purely via these async-clipboard prefs —
        // no `permissions` entry here.
        launchOptions: {
          firefoxUserPrefs: {
            'dom.events.asyncClipboard.clipboardItem': true,
            'dom.events.asyncClipboard.readText': true,
            'dom.events.testing.asyncClipboard': true,
            // Headless Firefox on a GPU-less CI runner refuses a WebGL2
            // context, which makes Shader Gradient Lab render its error state
            // instead of the canvas and fails every spec in that file. These
            // two prefs are the Firefox equivalent of Chromium's swiftshader
            // flags: the first bypasses the graphics blocklist, the second
            // stops Firefox rejecting the context merely because the renderer
            // is software. Keep them — the Firefox project exists precisely to
            // catch WebGL and GLSL precision bugs Chromium misses.
            'webgl.force-enabled': true,
            'webgl.disable-fail-if-major-performance-caveat': true,
          },
        },
      },
    },
  ],
});
