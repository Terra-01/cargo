import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: false,
  reporter: 'list',
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
      use: { colorScheme: 'light', viewport: { width: 1280, height: 800 } },
    },
    {
      name: 'chromium-dark',
      use: { colorScheme: 'dark', viewport: { width: 1280, height: 800 } },
    },
  ],
});
