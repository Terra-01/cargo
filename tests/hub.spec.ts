import { test, expect } from '@playwright/test';

test.describe('Hub page foundation', () => {
  test('renders without console errors', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') errors.push(msg.text());
    });
    page.on('pageerror', (err) => errors.push(err.message));

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    expect(errors).toEqual([]);
  });

  test('topbar shows brand, nav, theme toggle', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('.topbar__brand')).toContainText('CARGO');
    await expect(page.locator('.topbar__nav a').first()).toBeVisible();
    await expect(page.getByTestId('theme-toggle')).toBeVisible();
  });

  test('theme toggle cycles auto → light → dark → auto', async ({ page }) => {
    await page.goto('/');
    const toggle = page.getByTestId('theme-toggle');
    await expect(toggle).toHaveText('auto');
    await toggle.click();
    await expect(toggle).toHaveText('light');
    await toggle.click();
    await expect(toggle).toHaveText('dark');
    await toggle.click();
    await expect(toggle).toHaveText('auto');
  });

  test('hub renders hero, manifest, placeholder', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('.hero__title')).toBeVisible();
    await expect(page.locator('.manifest')).toBeVisible();
    await expect(page.locator('.hero__title em')).toContainText('make things');
  });

  test('screenshot the full hub page', async ({ page }, testInfo) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    // Wait an extra moment for fonts and animations to settle
    await page.waitForTimeout(800);
    await page.screenshot({
      path: `./screenshots/hub-${testInfo.project.name}.png`,
      fullPage: true,
    });
  });
});
