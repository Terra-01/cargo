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

  test('renders all 7 tool cards', async ({ page }) => {
    await page.goto('/');
    const cards = page.locator('.tool-card');
    await expect(cards).toHaveCount(7);
  });

  test('tool cards show manifest numbers 01 through 07', async ({ page }) => {
    await page.goto('/');
    const manifests = await page.locator('.tool-card__manifest').allTextContents();
    expect(manifests).toEqual([
      'CARGO/01',
      'CARGO/02',
      'CARGO/03',
      'CARGO/04',
      'CARGO/05',
      'CARGO/06',
      'CARGO/07',
    ]);
  });

  test('all tool cards are currently coming soon (none shipped)', async ({ page }) => {
    await page.goto('/');
    const shippedCards = page.locator('.tool-card[data-status="shipped"]');
    const soonCards = page.locator('.tool-card[data-status="coming_soon"]');
    await expect(shippedCards).toHaveCount(0);
    await expect(soonCards).toHaveCount(7);
  });

  test('coming-soon cards are not links', async ({ page }) => {
    await page.goto('/');
    const firstCard = page.locator('.tool-card').first();
    const tagName = await firstCard.evaluate((el) => el.tagName.toLowerCase());
    expect(tagName).toBe('div');
    await expect(firstCard).toHaveAttribute('aria-disabled', 'true');
  });

  test('each coming-soon card has a "soon" tag', async ({ page }) => {
    await page.goto('/');
    const soonTags = page.locator('.tool-card .tag--soon');
    await expect(soonTags).toHaveCount(7);
  });

  test('manifest derives counts from the tool array', async ({ page }) => {
    await page.goto('/');
    const toolsShipped = page.locator('.manifest__item').nth(1).locator('.manifest__value');
    await expect(toolsShipped).toContainText('00 / 7 planned');
  });

  test('cargo principle pull quote renders', async ({ page }) => {
    await page.goto('/');
    const quote = page.locator('.principle__quote');
    await expect(quote).toBeVisible();
    await expect(quote).toContainText('ship it on a Saturday');
  });

  test('screenshot the full hub page', async ({ page }, testInfo) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    // Wait an extra moment for fonts and animations to settle
    await page.waitForTimeout(800);
    await page.screenshot({
      path: `./screenshots/hub-phase2-polished-${testInfo.project.name}.png`,
      fullPage: true,
    });
  });
});
