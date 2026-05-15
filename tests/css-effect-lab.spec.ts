import { test, expect } from '@playwright/test';

test.describe('CSS Effect Lab tool', () => {
  test('renders without console errors', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') errors.push(msg.text());
    });
    page.on('pageerror', (err) => errors.push(err.message));

    await page.goto('/tools/css-effect-lab');
    await page.waitForLoadState('networkidle');

    expect(errors).toEqual([]);
  });

  test('renders header with title, eyebrow, and back link', async ({ page }) => {
    await page.goto('/tools/css-effect-lab');
    await expect(page.locator('.tool-page__title')).toContainText('CSS Effect Lab');
    await expect(page.locator('.tool-page__eyebrow')).toContainText('production_tools');
    await expect(page.locator('.tool-page__eyebrow')).toContainText('cargo/01');
    await expect(page.locator('.tool-page__back')).toBeVisible();
  });

  test('topbar Tools link is active on tool route', async ({ page }) => {
    await page.goto('/tools/css-effect-lab');
    const toolsLink = page.locator('.topbar__nav a').first();
    await expect(toolsLink).toHaveClass(/is-active/);
  });

  test('back link returns to the hub', async ({ page }) => {
    await page.goto('/tools/css-effect-lab');
    await page.waitForLoadState('networkidle');
    await page.locator('.tool-page__back').click();
    await page.waitForURL('/');
    await expect(page.locator('.hero__title')).toBeVisible();
  });

  test('panel renders all 6 controls', async ({ page }) => {
    await page.goto('/tools/css-effect-lab');
    const sliders = page.locator('.lab__panel .slider');
    await expect(sliders).toHaveCount(4); // blur, bg opacity, border opacity, radius
    await expect(page.getByTestId('tint-light')).toBeVisible();
    await expect(page.getByTestId('tint-dark')).toBeVisible();
    await expect(page.getByTestId('saturate-toggle')).toBeVisible();
  });

  test('adjusting blur updates live preview and code output', async ({ page }) => {
    await page.goto('/tools/css-effect-lab');
    const slider = page.getByTestId('blur-slider');
    const value = page.getByTestId('blur-value');
    const code = page.getByTestId('lab-code');

    await expect(value).toHaveText('14px');
    await expect(code).toContainText('blur(14px)');

    // Move slider to 28 — fill() is React-friendly for native range inputs
    await slider.fill('28');

    await expect(value).toHaveText('28px');
    await expect(code).toContainText('blur(28px)');

    const glass = page.getByTestId('lab-glass');
    const filter = await glass.evaluate((el) => getComputedStyle(el).backdropFilter || (el.style as CSSStyleDeclaration).backdropFilter);
    expect(filter).toContain('blur(28px)');
  });

  test('tint toggle switches active state and code rgb base', async ({ page }) => {
    await page.goto('/tools/css-effect-lab');
    const lightBtn = page.getByTestId('tint-light');
    const darkBtn = page.getByTestId('tint-dark');
    const code = page.getByTestId('lab-code');

    await expect(lightBtn).toHaveClass(/tint-toggle__option--active/);
    await expect(code).toContainText('255, 255, 255');

    await darkBtn.click();
    await expect(darkBtn).toHaveClass(/tint-toggle__option--active/);
    await expect(lightBtn).not.toHaveClass(/tint-toggle__option--active/);
    await expect(code).toContainText('0, 0, 0');
  });

  test('saturate toggle adds/removes saturate() in code', async ({ page }) => {
    await page.goto('/tools/css-effect-lab');
    const toggle = page.getByTestId('saturate-toggle');
    const code = page.getByTestId('lab-code');

    await expect(toggle).toHaveText('on');
    await expect(code).toContainText('saturate(180%)');

    await toggle.click();
    await expect(toggle).toHaveText('off');
    await expect(code).not.toContainText('saturate(180%)');
  });

  test('copy button shows confirmation after click', async ({ page, context }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    await page.goto('/tools/css-effect-lab');
    const btn = page.getByTestId('copy-btn');
    await expect(btn).toHaveText('copy');
    await btn.click();
    await expect(btn).toHaveText('copied');
  });

  test('screenshot the tool page', async ({ page }, testInfo) => {
    await page.goto('/tools/css-effect-lab');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(800);
    await page.screenshot({
      path: `./screenshots/tool-css-effect-lab-phase3-${testInfo.project.name}.png`,
      fullPage: true,
    });
  });
});
