import { test, expect } from '@playwright/test';

test.describe('Loading States Gallery tool', () => {
  test('renders without console errors', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') errors.push(msg.text());
    });
    page.on('pageerror', (err) => errors.push(err.message));

    await page.goto('/tools/loading-states');
    await page.waitForLoadState('networkidle');

    expect(errors).toEqual([]);
  });

  test('renders header with title and category', async ({ page }) => {
    await page.goto('/tools/loading-states');
    await expect(page.locator('.tool-page__title')).toContainText('Loading States Gallery');
    await expect(page.locator('.tool-page__eyebrow')).toContainText('inspiration');
    await expect(page.locator('.tool-page__eyebrow')).toContainText('cargo/03');
  });

  test('topbar Tools link is active on this tool route', async ({ page }) => {
    await page.goto('/tools/loading-states');
    const toolsLink = page.locator('.topbar__nav a').first();
    await expect(toolsLink).toHaveClass(/is-active/);
  });

  test('renders all 8 loader cards', async ({ page }) => {
    await page.goto('/tools/loading-states');
    const cards = page.locator('.loader-card');
    await expect(cards).toHaveCount(8);
  });

  test('each card shows html + css as the value text', async ({ page }) => {
    await page.goto('/tools/loading-states');
    const valueTexts = await page.locator('.loader-card .easing-card__value-text').allTextContents();
    expect(valueTexts.length).toBe(8);
    valueTexts.forEach((text) => {
      expect(text).toBe('html + css');
    });
  });

  test('every card renders a non-empty preview', async ({ page }) => {
    await page.goto('/tools/loading-states');
    const previews = page.locator('.loader-card__preview');
    await expect(previews).toHaveCount(8);
    // sanity: each preview has at least one child element
    const previewChildCounts = await previews.evaluateAll((nodes) =>
      nodes.map((n) => n.children.length)
    );
    previewChildCounts.forEach((count) => expect(count).toBeGreaterThan(0));
  });

  test('clicking a card flips its copied state', async ({ page, context }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    await page.goto('/tools/loading-states');
    const card = page.getByTestId('loader-card-spinner-classic');
    const hint = card.locator('.easing-card__copy-hint');
    await expect(hint).toHaveText('copy');
    await card.click();
    await expect(hint).toHaveText('copied');
    await expect(card).toHaveAttribute('data-copied', 'true');
  });

  test('copied state reverts after timeout', async ({ page, context }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    await page.goto('/tools/loading-states');
    const card = page.getByTestId('loader-card-pulse-dots');
    const hint = card.locator('.easing-card__copy-hint');
    await card.click();
    await expect(hint).toHaveText('copied');
    await page.waitForTimeout(1700);
    await expect(hint).toHaveText('copy');
  });

  test('all four categories appear in the grid', async ({ page }) => {
    await page.goto('/tools/loading-states');
    const categoryTexts = await page.locator('.loader-card .easing-card__category').allTextContents();
    const unique = Array.from(new Set(categoryTexts.map((s) => s.trim().toLowerCase())));
    expect(unique.sort()).toEqual(['bar', 'dots', 'skeleton', 'spinner']);
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
