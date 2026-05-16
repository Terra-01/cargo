import { test, expect } from '@playwright/test';
import { watchConsoleErrors, realConsoleErrors } from './helpers/console-errors';

test.describe('Mockup Wrapper tool', () => {
  test('renders without console errors', async ({ page }) => {
    const { errors } = watchConsoleErrors(page);
    await page.goto('/tools/mockup-wrapper');
    await page.waitForLoadState('networkidle');
    expect(realConsoleErrors(errors)).toEqual([]);
  });

  test('renders header with title and category', async ({ page }) => {
    await page.goto('/tools/mockup-wrapper');
    await expect(page.locator('.tool-page__title')).toContainText('Mockup Wrapper');
    await expect(page.locator('.tool-page__eyebrow')).toContainText('visual_creator');
    await expect(page.locator('.tool-page__eyebrow')).toContainText('cargo/04');
  });

  test('topbar Tools link is active on this tool route', async ({ page }) => {
    await page.goto('/tools/mockup-wrapper');
    const toolsLink = page.locator('.topbar__nav a').first();
    await expect(toolsLink).toHaveClass(/is-active/);
  });

  test('renders all controls', async ({ page }) => {
    await page.goto('/tools/mockup-wrapper');
    await expect(page.getByTestId('mw-drop')).toBeVisible();
    await expect(page.getByTestId('mw-frame-browser')).toBeVisible();
    await expect(page.getByTestId('mw-frame-card')).toBeVisible();
    await expect(page.getByTestId('mw-bg-dusk')).toBeVisible();
    await expect(page.getByTestId('mw-padding-slider')).toBeVisible();
    await expect(page.getByTestId('mw-shadow-toggle')).toBeVisible();
  });

  test('only browser and card frames are offered (phone removed)', async ({ page }) => {
    await page.goto('/tools/mockup-wrapper');
    await expect(page.locator('[data-testid^="mw-frame-"]')).toHaveCount(2);
    await expect(page.locator('[data-testid="mw-frame-phone"]')).toHaveCount(0);
  });

  test('canvas element is present', async ({ page }) => {
    await page.goto('/tools/mockup-wrapper');
    const canvas = page.getByTestId('mw-canvas');
    await expect(canvas).toBeVisible();
    const dims = await canvas.evaluate((el: HTMLCanvasElement) => ({ w: el.width, h: el.height }));
    expect(dims.w).toBe(1600); // 800 logical × 2 dpr
    expect(dims.h).toBe(1200);
  });

  test('download button is disabled until an image is uploaded', async ({ page }) => {
    await page.goto('/tools/mockup-wrapper');
    const btn = page.getByTestId('mw-download');
    await expect(btn).toBeDisabled();
    await expect(btn).toContainText('Upload a screenshot');
  });

  test('clicking a frame toggle changes the active state', async ({ page }) => {
    await page.goto('/tools/mockup-wrapper');
    const browser = page.getByTestId('mw-frame-browser');
    const card = page.getByTestId('mw-frame-card');
    await expect(browser).toHaveClass(/tint-toggle__option--active/);
    await card.click();
    await expect(card).toHaveClass(/tint-toggle__option--active/);
    await expect(browser).not.toHaveClass(/tint-toggle__option--active/);
  });

  test('clicking a background swatch sets it active', async ({ page }) => {
    await page.goto('/tools/mockup-wrapper');
    const dusk = page.getByTestId('mw-bg-dusk');
    const tokyo = page.getByTestId('mw-bg-tokyo');
    await expect(dusk).toHaveAttribute('data-active', 'true');
    await tokyo.click();
    await expect(tokyo).toHaveAttribute('data-active', 'true');
    await expect(dusk).not.toHaveAttribute('data-active', /.+/);
  });

  test('moving the padding slider updates the displayed value', async ({ page }) => {
    await page.goto('/tools/mockup-wrapper');
    const slider = page.getByTestId('mw-padding-slider');
    const value = page.getByTestId('mw-padding-value');
    await expect(value).toHaveText('48px');
    await slider.fill('96');
    await expect(value).toHaveText('96px');
  });

  test('toggling shadow off hides the shadow-depth slider', async ({ page }) => {
    await page.goto('/tools/mockup-wrapper');
    const toggle = page.getByTestId('mw-shadow-toggle');
    await expect(toggle).toHaveText('on');
    await expect(page.locator('label[for="mw-shadow-depth"]')).toBeVisible();
    await toggle.click();
    await expect(toggle).toHaveText('off');
    await expect(page.locator('label[for="mw-shadow-depth"]')).toHaveCount(0);
  });

  test('back link returns to the hub', async ({ page }) => {
    await page.goto('/tools/mockup-wrapper');
    await page.waitForLoadState('networkidle');
    await page.locator('.tool-page__back').click();
    await page.waitForURL('/');
    await expect(page.locator('.hero__title')).toBeVisible();
  });

  test('screenshot the tool page', async ({ page }, testInfo) => {
    await page.goto('/tools/mockup-wrapper');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(500);
    await page.screenshot({
      path: `./screenshots/tool-mockup-wrapper-phase9-${testInfo.project.name}.png`,
      fullPage: true,
    });
  });
});
