import { test, expect } from '@playwright/test';

test.describe('Type & Spacing Scale tool', () => {
  test('renders without console errors', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') errors.push(msg.text());
    });
    page.on('pageerror', (err) => errors.push(err.message));

    await page.goto('/tools/type-scale');
    await page.waitForLoadState('networkidle');

    expect(errors).toEqual([]);
  });

  test('renders header with title and category', async ({ page }) => {
    await page.goto('/tools/type-scale');
    await expect(page.locator('.tool-page__title')).toContainText('Type & Spacing Scale');
    await expect(page.locator('.tool-page__eyebrow')).toContainText('visual_creator');
    await expect(page.locator('.tool-page__eyebrow')).toContainText('cargo/05');
  });

  test('topbar Tools link is active on this tool route', async ({ page }) => {
    await page.goto('/tools/type-scale');
    const toolsLink = page.locator('.topbar__nav a').first();
    await expect(toolsLink).toHaveClass(/is-active/);
  });

  test('renders all controls', async ({ page }) => {
    await page.goto('/tools/type-scale');
    await expect(page.getByTestId('base-slider')).toBeVisible();
    await expect(page.getByTestId('ratio-select')).toBeVisible();
    await expect(page.getByTestId('steps-up-slider')).toBeVisible();
    await expect(page.getByTestId('space-base-4')).toBeVisible();
    await expect(page.getByTestId('space-base-8')).toBeVisible();
  });

  test('default state generates expected rows (6 up + 1 base + 2 down = 9 type rows)', async ({ page }) => {
    await page.goto('/tools/type-scale');
    const typeRows = page.locator('[data-testid="type-specimen"] .ts-type-row');
    await expect(typeRows).toHaveCount(9);
  });

  test('spacing specimen renders 8 rows by default', async ({ page }) => {
    await page.goto('/tools/type-scale');
    const spaceRows = page.locator('[data-testid="spacing-specimen"] .ts-space-row');
    await expect(spaceRows).toHaveCount(8);
  });

  test('default CSS contains text-base and space-1', async ({ page }) => {
    await page.goto('/tools/type-scale');
    const output = page.getByTestId('ts-css-output');
    await expect(output).toContainText('--text-base');
    // Names are right-padded so colons align — short names get a space before the colon.
    await expect(output).toContainText('--space-1 :');
    await expect(output).toContainText('16px');
  });

  test('changing base size updates the CSS output', async ({ page }) => {
    await page.goto('/tools/type-scale');
    const slider = page.getByTestId('base-slider');
    await slider.fill('20');
    await expect(page.getByTestId('base-value')).toHaveText('20px');
    const output = page.getByTestId('ts-css-output');
    await expect(output).toContainText('--text-base: 20px');
  });

  test('changing ratio updates the scale (golden ratio yields larger steps)', async ({ page }) => {
    await page.goto('/tools/type-scale');
    await page.getByTestId('ratio-select').selectOption('1.618');
    // With base 16 + golden ratio, text-2xl = round(16 * 1.618^3) = 68.
    // Names are right-padded; text-base is the widest at 9 chars, so text-2xl gets a space.
    const output = page.getByTestId('ts-css-output');
    await expect(output).toContainText('--text-2xl : 68px');
  });

  test('reducing steps up shrinks the type-row count', async ({ page }) => {
    await page.goto('/tools/type-scale');
    const slider = page.getByTestId('steps-up-slider');
    await slider.fill('4');
    // 4 up + 1 base + 2 down = 7
    const typeRows = page.locator('[data-testid="type-specimen"] .ts-type-row');
    await expect(typeRows).toHaveCount(7);
  });

  test('switching spacing base to 8px doubles spacing values in CSS', async ({ page }) => {
    await page.goto('/tools/type-scale');
    await page.getByTestId('space-base-8').click();
    const output = page.getByTestId('ts-css-output');
    // Names are right-padded; space-16 is widest at 8 chars, so space-1 gets a space.
    await expect(output).toContainText('--space-1 : 8px');
    await expect(output).toContainText('--space-16: 128px');
  });

  test('copy button shows confirmation after click', async ({ page, context }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    await page.goto('/tools/type-scale');
    const btn = page.getByTestId('copy-btn');
    await expect(btn).toHaveText('copy');
    await btn.click();
    await expect(btn).toHaveText('copied');
  });

  test('back link returns to the hub', async ({ page }) => {
    await page.goto('/tools/type-scale');
    await page.locator('.tool-page__back').click();
    await page.waitForURL('/');
    await expect(page.locator('.hero__title')).toBeVisible();
  });

  test('screenshot the tool page', async ({ page }, testInfo) => {
    await page.goto('/tools/type-scale');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(500);
    await page.screenshot({
      path: `./screenshots/tool-type-scale-phase7-${testInfo.project.name}.png`,
      fullPage: true,
    });
  });
});
