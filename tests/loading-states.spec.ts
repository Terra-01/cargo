import { test, expect } from '@playwright/test';
import { grantClipboard } from './helpers/clipboard';
import { watchConsoleErrors, realConsoleErrors } from './helpers/console-errors';

test.describe('Loading States Gallery tool', () => {
  test('renders without console errors', async ({ page }) => {
    const { errors } = watchConsoleErrors(page);

    await page.goto('/tools/loading-states');
    await page.waitForLoadState('networkidle');

    expect(realConsoleErrors(errors)).toEqual([]);
  });

  test('renders header with title and category', async ({ page }) => {
    await page.goto('/tools/loading-states');
    await expect(page.locator('.tool-page__title')).toContainText('Loading States Gallery');
    await expect(page.locator('.tool-page__eyebrow')).toContainText('inspiration');
    await expect(page.locator('.tool-page__eyebrow')).toContainText('cargo/04');
  });

  test('topbar Tools link is active on this tool route', async ({ page }) => {
    await page.goto('/tools/loading-states');
    const toolsLink = page.locator('.topbar__nav a').first();
    await expect(toolsLink).toHaveClass(/is-active/);
  });

  test('renders all 21 loader cards', async ({ page }) => {
    await page.goto('/tools/loading-states');
    const cards = page.locator('.loader-card');
    await expect(cards).toHaveCount(21);
  });

  test('each card shows html + css as the value text', async ({ page }) => {
    await page.goto('/tools/loading-states');
    const valueTexts = await page.locator('.loader-card .easing-card__value-text').allTextContents();
    expect(valueTexts.length).toBe(21);
    valueTexts.forEach((text) => {
      expect(text).toBe('html + css');
    });
  });

  test('every card renders a non-empty preview', async ({ page }) => {
    await page.goto('/tools/loading-states');
    const previews = page.locator('.loader-card__preview');
    await expect(previews).toHaveCount(21);
    // sanity: each preview has at least one child element
    const previewChildCounts = await previews.evaluateAll((nodes) =>
      nodes.map((n) => n.children.length)
    );
    previewChildCounts.forEach((count) => expect(count).toBeGreaterThan(0));
  });

  test('clicking a card flips its copied state', async ({ page, context }) => {
    await grantClipboard(context);
    await page.goto('/tools/loading-states');
    const card = page.getByTestId('loader-card-spinner-classic');
    const hint = card.locator('.easing-card__copy-hint');
    await expect(hint).toHaveText('copy');
    await card.click();
    await expect(hint).toHaveText('copied');
    await expect(card).toHaveAttribute('data-copied', 'true');
  });

  test('copied state reverts after timeout', async ({ page, context }) => {
    await grantClipboard(context);
    await page.goto('/tools/loading-states');
    const card = page.getByTestId('loader-card-pulse-dots');
    const hint = card.locator('.easing-card__copy-hint');
    await card.click();
    await expect(hint).toHaveText('copied');
    await page.waitForTimeout(1700);
    await expect(hint).toHaveText('copy');
  });

  test('all seven categories appear in the grid', async ({ page }) => {
    await page.goto('/tools/loading-states');
    const categoryTexts = await page.locator('.loader-card .easing-card__category').allTextContents();
    const unique = Array.from(new Set(categoryTexts.map((s) => s.trim().toLowerCase())));
    expect(unique.sort()).toEqual([
      'bar',
      'dots',
      'inline',
      'overlay',
      'progress',
      'skeleton',
      'spinner',
    ]);
  });

  test('category filter renders all chips with data-derived counts', async ({ page }) => {
    await page.goto('/tools/loading-states');
    const chips = page.locator('[data-testid="ls-categories"] .ls-cat');
    await expect(chips).toHaveCount(8);
    await expect(page.getByTestId('ls-cat-all')).toContainText('21');
    await expect(page.getByTestId('ls-cat-skeleton')).toContainText('3');
    await expect(page.getByTestId('ls-cat-spinner')).toContainText('3');
    await expect(page.getByTestId('ls-cat-dots')).toContainText('3');
    await expect(page.getByTestId('ls-cat-bar')).toContainText('3');
    await expect(page.getByTestId('ls-cat-progress')).toContainText('3');
    await expect(page.getByTestId('ls-cat-overlay')).toContainText('3');
    await expect(page.getByTestId('ls-cat-inline')).toContainText('3');
  });

  test('selecting a category chip narrows the grid', async ({ page }) => {
    await page.goto('/tools/loading-states');
    await expect(page.locator('.loader-card')).toHaveCount(21);

    await page.getByTestId('ls-cat-progress').click();
    await expect(page.getByTestId('ls-cat-progress')).toHaveAttribute('data-active', 'true');
    await expect(page.locator('.loader-card')).toHaveCount(3);
    const cats = await page.locator('.loader-card .easing-card__category').allTextContents();
    cats.forEach((c) => expect(c.trim().toLowerCase()).toBe('progress'));

    await page.getByTestId('ls-cat-all').click();
    await expect(page.locator('.loader-card')).toHaveCount(21);
  });

  test('back link returns to the hub', async ({ page }) => {
    await page.goto('/tools/loading-states');
    await page.waitForLoadState('networkidle');
    await page.locator('.tool-page__back').click();
    await page.waitForURL('/');
    await expect(page.locator('.hero__title')).toBeVisible();
  });

  test('screenshot the tool page', async ({ page }, testInfo) => {
    await page.goto('/tools/loading-states');
    await page.waitForLoadState('networkidle');
    // Pause animations so screenshots are deterministic
    await page.addStyleTag({ content: '*, *::before, *::after { animation-play-state: paused !important; }' });
    await page.waitForTimeout(500);
    await page.screenshot({
      path: `./screenshots/tool-loading-states-phase5-${testInfo.project.name}.png`,
      fullPage: true,
    });
  });
});
