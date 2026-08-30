import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: false,
  reporter: 'list',
  retries: 1,
  timeout: 60_000,
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    navigationTimeout: 60_000,
  },
  webServer: {
    // CI runs the suite against a production build; locally it uses the dev
    // server (fast edit-and-rerun). Dev-mode hot-reload was the root cause of
    // the known `back link returns to the hub` and dials-modal flakes — a
    // static build removes that whole class, so CI deliberately avoids it.
    command: process.env.CI ? 'npm run start' : 'npm run dev',
    url: 'http://localhost:3000',
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
