import { test, expect } from '@playwright/test';
import { grantClipboard } from './helpers/clipboard';
import { watchConsoleErrors, realConsoleErrors } from './helpers/console-errors';

test.describe('Easing Cookbook tool', () => {
  test('renders without console errors', async ({ page }) => {
    const { errors } = watchConsoleErrors(page);

    await page.goto('/tools/easing-cookbook');
    await page.waitForLoadState('networkidle');

    expect(realConsoleErrors(errors)).toEqual([]);
  });

  test('renders header with title and category', async ({ page }) => {
    await page.goto('/tools/easing-cookbook');
    await expect(page.locator('.tool-page__title')).toContainText('Easing Cookbook');
    await expect(page.locator('.tool-page__eyebrow')).toContainText('learning_tools');
    await expect(page.locator('.tool-page__eyebrow')).toContainText('cargo/02');
  });

  test('topbar Tools link is active on this tool route', async ({ page }) => {
    await page.goto('/tools/easing-cookbook');
    const toolsLink = page.locator('.topbar__nav a').first();
    await expect(toolsLink).toHaveClass(/is-active/);
  });

  test('renders all 16 easing cards', async ({ page }) => {
    await page.goto('/tools/easing-cookbook');
    const cards = page.locator('.easing-card');
    await expect(cards).toHaveCount(16);
  });

  test('first card is ease-out-quart-style name format (mono)', async ({ page }) => {
    await page.goto('/tools/easing-cookbook');
    // First easing in the list is "linear"
    const firstCard = page.locator('.easing-card').first();
    await expect(firstCard.locator('.easing-card__name')).toHaveText('linear');
  });

  test('each card shows a cubic-bezier value', async ({ page }) => {
    await page.goto('/tools/easing-cookbook');
    const valueTexts = await page.locator('.easing-card__value-text').allTextContents();
    expect(valueTexts.length).toBe(16);
    valueTexts.forEach((text) => {
      expect(text).toMatch(/^cubic-bezier\(/);
    });
  });

  test('each card renders an SVG curve path', async ({ page }) => {
    await page.goto('/tools/easing-cookbook');
    const paths = page.locator('.easing-card__curve-path');
    await expect(paths).toHaveCount(16);
    // sanity: each path has a d attribute
    const firstD = await paths.first().getAttribute('d');
    expect(firstD).toBeTruthy();
    expect(firstD).toMatch(/^M 0 100 C/);
  });

  test('clicking a card flips its copied state', async ({ page, context }) => {
    await grantClipboard(context);
    await page.goto('/tools/easing-cookbook');
    const card = page.getByTestId('easing-card-ease-out-quart');
    const hint = card.locator('.easing-card__copy-hint');
    await expect(hint).toHaveText('copy');
    await card.click();
    await expect(hint).toHaveText('copied');
    await expect(card).toHaveAttribute('data-copied', 'true');
  });

  test('copied state reverts after timeout', async ({ page, context }) => {
    await grantClipboard(context);
    await page.goto('/tools/easing-cookbook');
    const card = page.getByTestId('easing-card-linear');
    const hint = card.locator('.easing-card__copy-hint');
    await card.click();
    await expect(hint).toHaveText('copied');
    // The implementation reverts after 1500ms; wait a bit longer
    await page.waitForTimeout(1700);
    await expect(hint).toHaveText('copy');
  });

  test('demo dot uses each easing as its animation-timing-function', async ({ page }) => {
    await page.goto('/tools/easing-cookbook');
    const dot = page.locator('.easing-card').first().locator('.easing-card__demo-dot');
    const easeVar = await dot.evaluate((el) => getComputedStyle(el).getPropertyValue('--ease').trim());
    expect(easeVar).toContain('cubic-bezier');
  });

  test('back link returns to the hub', async ({ page }) => {
    await page.goto('/tools/easing-cookbook');
    await page.waitForLoadState('networkidle');
    await page.locator('.tool-page__back').click();
    await page.waitForURL('/');
    await expect(page.locator('.hero__title')).toBeVisible();
  });

  test('screenshot the tool page', async ({ page }, testInfo) => {
    await page.goto('/tools/easing-cookbook');
    await page.waitForLoadState('networkidle');
    // Pause animations so screenshots are deterministic
    await page.addStyleTag({ content: '* { animation-play-state: paused !important; }' });
    await page.waitForTimeout(500);
    await page.screenshot({
      path: `./screenshots/tool-easing-cookbook-phase4-${testInfo.project.name}.png`,
      fullPage: true,
    });
  });
});
