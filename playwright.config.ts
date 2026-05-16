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
    command: 'npm run dev',
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
          },
        },
      },
    },
  ],
});
