import { test, expect } from '@playwright/test';
import { grantClipboard } from './helpers/clipboard';
import { watchConsoleErrors, realConsoleErrors } from './helpers/console-errors';

test.describe('Text Animation Library tool', () => {
  test('renders without console errors', async ({ page }) => {
    const { errors } = watchConsoleErrors(page);

    await page.goto('/tools/text-animations');
    await page.waitForLoadState('networkidle');

    expect(realConsoleErrors(errors)).toEqual([]);
  });

  test('renders header with title and category', async ({ page }) => {
    await page.goto('/tools/text-animations');
    await expect(page.locator('.tool-page__title')).toContainText('Text Animation Library');
    await expect(page.locator('.tool-page__eyebrow')).toContainText('learning_tools');
    await expect(page.locator('.tool-page__eyebrow')).toContainText('cargo/08');
  });

  test('topbar Tools link is active on this tool route', async ({ page }) => {
    await page.goto('/tools/text-animations');
    const toolsLink = page.locator('.topbar__nav a').first();
    await expect(toolsLink).toHaveClass(/is-active/);
  });

  test('renders all 100 animation cards by default', async ({ page }) => {
    await page.goto('/tools/text-animations');
    const cards = page.locator('.ta-card');
    await expect(cards).toHaveCount(100);
  });

  test('result count reads 100 / 100', async ({ page }) => {
    await page.goto('/tools/text-animations');
    await expect(page.getByTestId('ta-result-count')).toHaveText('100 / 100');
  });

  test('all six categories are represented', async ({ page }) => {
    await page.goto('/tools/text-animations');
    const categories = await page.locator('.ta-card__category').allTextContents();
    // category cells may also contain badge text concatenated without whitespace
    // (e.g., "specialty3D", "hoverhover") — match the leading known category word
    const KNOWN = ['decorative', 'entrance', 'hover', 'loop', 'specialty', 'stagger'];
    const unique = Array.from(
      new Set(
        categories.map((s) => {
          const lower = s.trim().toLowerCase();
          return KNOWN.find((k) => lower.startsWith(k)) ?? lower;
        })
      )
    );
    expect(unique.sort()).toEqual(KNOWN);
  });

  test('search filters by name', async ({ page }) => {
    await page.goto('/tools/text-animations');
    await page.getByTestId('ta-search-input').fill('fade');
    const cards = page.locator('.ta-card');
    const count = await cards.count();
    expect(count).toBeGreaterThanOrEqual(5);
    expect(count).toBeLessThan(100);
  });

  test('search filters by category', async ({ page }) => {
    await page.goto('/tools/text-animations');
    await page.getByTestId('ta-search-input').fill('loop');
    // Should narrow to exactly the loop-category animations
    const cards = page.locator('.ta-card');
    await expect(cards).toHaveCount(15);
  });

  test('search filters by category — hover', async ({ page }) => {
    await page.goto('/tools/text-animations');
    await page.getByTestId('ta-search-input').fill('hover');
    const cards = page.locator('.ta-card');
    await expect(cards).toHaveCount(15);
  });

  test('search with no matches shows zero cards', async ({ page }) => {
    await page.goto('/tools/text-animations');
    await page.getByTestId('ta-search-input').fill('zzznotreal');
    await expect(page.locator('.ta-card')).toHaveCount(0);
    await expect(page.getByTestId('ta-result-count')).toHaveText('0 / 100');
  });

  test('picker tray starts empty', async ({ page }) => {
    await page.goto('/tools/text-animations');
    await expect(page.getByTestId('picker-count')).toHaveText('0');
    await expect(page.getByTestId('picker-tray')).toHaveAttribute('data-empty', 'true');
  });

  test('clicking a card adds it to the picker', async ({ page }) => {
    await page.goto('/tools/text-animations');
    const card = page.getByTestId('ta-card-ta-fade-in');
    await card.click();
    await expect(card).toHaveAttribute('data-picked', 'true');
    await expect(page.getByTestId('picker-count')).toHaveText('1');
    await expect(page.getByTestId('picker-chip-ta-fade-in')).toBeVisible();
  });

  test('clicking a picked card unpicks it', async ({ page }) => {
    await page.goto('/tools/text-animations');
    const card = page.getByTestId('ta-card-ta-fade-in');
    await card.click();
    await card.click();
    await expect(card).not.toHaveAttribute('data-picked', /.+/);
    await expect(page.getByTestId('picker-count')).toHaveText('0');
  });

  test('clicking a chip removes that animation from picks', async ({ page }) => {
    await page.goto('/tools/text-animations');
    await page.getByTestId('ta-card-ta-fade-in').click();
    await page.getByTestId('ta-card-ta-zoom-in').click();
    await expect(page.getByTestId('picker-count')).toHaveText('2');
    await page.getByTestId('picker-chip-ta-fade-in').click();
    await expect(page.getByTestId('picker-count')).toHaveText('1');
    await expect(page.getByTestId('picker-chip-ta-fade-in')).toHaveCount(0);
  });

  test('clear button empties the picker', async ({ page }) => {
    await page.goto('/tools/text-animations');
    await page.getByTestId('ta-card-ta-fade-in').click();
    await page.getByTestId('ta-card-ta-zoom-in').click();
    await page.getByTestId('picker-clear').click();
    await expect(page.getByTestId('picker-count')).toHaveText('0');
  });

  test('copy bundle button is disabled when picker is empty', async ({ page }) => {
    await page.goto('/tools/text-animations');
    await expect(page.getByTestId('picker-copy')).toBeDisabled();
  });

  test('copy bundle reflects pick count in label', async ({ page }) => {
    await page.goto('/tools/text-animations');
    await page.getByTestId('ta-card-ta-fade-in').click();
    await page.getByTestId('ta-card-ta-zoom-in').click();
    await page.getByTestId('ta-card-ta-rotate-in').click();
    await expect(page.getByTestId('picker-copy')).toContainText('copy bundle (3)');
  });

  test('copy bundle confirms after click', async ({ page, context }) => {
    await grantClipboard(context);
    await page.goto('/tools/text-animations');
    await page.getByTestId('ta-card-ta-fade-in').click();
    const copyBtn = page.getByTestId('picker-copy');
    await copyBtn.click();
    await expect(copyBtn).toContainText('copied');
  });

  test('back link returns to the hub', async ({ page }) => {
    await page.goto('/tools/text-animations');
    await page.waitForLoadState('networkidle');
    await page.locator('.tool-page__back').click();
    await page.waitForURL('/');
    await expect(page.locator('.hero__title')).toBeVisible();
  });

  test('hover-trigger cards show "hover" badge', async ({ page }) => {
    await page.goto('/tools/text-animations');
    const badges = page.locator('.ta-card__badge', { hasText: 'hover' });
    await expect(badges).toHaveCount(15);
  });

  test('3D animation cards show "3D" badge', async ({ page }) => {
    await page.goto('/tools/text-animations');
    const badges = page.locator('.ta-card__badge', { hasText: '3D' });
    await expect(badges).toHaveCount(5);
  });

  test('character-split animations render per-character spans in preview', async ({ page }) => {
    await page.goto('/tools/text-animations');
    const card = page.getByTestId('ta-card-ta-stagger-fade-up');
    await card.scrollIntoViewIfNeeded();
    await page.waitForTimeout(400);
    const preview = page.getByTestId('ta-preview-ta-stagger-fade-up');
    const spanCount = await preview.locator('> span').count();
    // 'Hello, Cargo.' is 13 chars including the period and space
    expect(spanCount).toBeGreaterThan(10);
  });

  test('word-split animations render per-word spans in preview', async ({ page }) => {
    await page.goto('/tools/text-animations');
    const card = page.getByTestId('ta-card-ta-stagger-words-fade');
    await card.scrollIntoViewIfNeeded();
    await page.waitForTimeout(400);
    const preview = page.getByTestId('ta-preview-ta-stagger-words-fade');
    const spanCount = await preview.locator('> span').count();
    // 'Hello, Cargo.' has 2 words
    expect(spanCount).toBe(2);
  });

  test('line-split animations render per-line spans in preview', async ({ page }) => {
    await page.goto('/tools/text-animations');
    const card = page.getByTestId('ta-card-ta-stagger-lines-rise');
    await card.scrollIntoViewIfNeeded();
    await page.waitForTimeout(400);
    const preview = page.getByTestId('ta-preview-ta-stagger-lines-rise');
    const spanCount = await preview.locator('> span').count();
    // sample text has 3 explicit lines
    expect(spanCount).toBe(3);
  });

  test('hover-trigger cards have data-trigger="hover"', async ({ page }) => {
    await page.goto('/tools/text-animations');
    const hoverCards = page.locator('.ta-card[data-trigger="hover"]');
    await expect(hoverCards).toHaveCount(15);
  });

  test('bundle copy includes stagger HTML comment when stagger animation picked', async ({ page, context }) => {
    await grantClipboard(context);
    await page.goto('/tools/text-animations');
    await page.getByTestId('ta-card-ta-stagger-fade-up').click();
    await page.getByTestId('picker-copy').click();
    const clipboard = await page.evaluate(() => navigator.clipboard.readText());
    expect(clipboard).toContain('HTML structure for stagger animations');
    expect(clipboard).toContain('--i:');
  });

  test('bundle copy includes JS helper when stagger animation picked', async ({ page, context }) => {
    await grantClipboard(context);
    await page.goto('/tools/text-animations');
    await page.getByTestId('ta-card-ta-stagger-fade-up').click();
    await page.getByTestId('picker-copy').click();
    const clipboard = await page.evaluate(() => navigator.clipboard.readText());
    expect(clipboard).toContain('auto-split helper');
    expect(clipboard).toContain('staggerSplit');
  });

  test('bundle copy does NOT include stagger sections when no stagger picked', async ({ page, context }) => {
    await grantClipboard(context);
    await page.goto('/tools/text-animations');
    await page.getByTestId('ta-card-ta-fade-in').click();
    await page.getByTestId('picker-copy').click();
    const clipboard = await page.evaluate(() => navigator.clipboard.readText());
    expect(clipboard).not.toContain('HTML structure for stagger');
    expect(clipboard).not.toContain('staggerSplit');
  });

  test('bundle copy includes 3D perspective note when 3D animation picked', async ({ page, context }) => {
    await grantClipboard(context);
    await page.goto('/tools/text-animations');
    await page.getByTestId('ta-card-ta-3d-rotate-y').click();
    await page.getByTestId('picker-copy').click();
    const clipboard = await page.evaluate(() => navigator.clipboard.readText());
    expect(clipboard).toContain('perspective');
  });

  test('screenshot the tool page', async ({ page }, testInfo) => {
    await page.goto('/tools/text-animations');
    await page.waitForLoadState('networkidle');
    // Pause all animations so screenshots are deterministic
    await page.addStyleTag({ content: '*, *::before, *::after { animation-play-state: paused !important; }' });
    await page.waitForTimeout(500);
    await page.screenshot({
      path: `./screenshots/tool-text-animations-phase10b-${testInfo.project.name}.png`,
      fullPage: true,
    });
  });
});
