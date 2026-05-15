import { test, expect } from '@playwright/test';

test.describe('Moodboard Library tool', () => {
  test('renders without console errors', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') errors.push(msg.text());
    });
    page.on('pageerror', (err) => errors.push(err.message));

    await page.goto('/tools/moodboard-library');
    await page.waitForLoadState('networkidle');

    expect(errors).toEqual([]);
  });

  test('renders header with title and category', async ({ page }) => {
    await page.goto('/tools/moodboard-library');
    await expect(page.locator('.tool-page__title')).toContainText('Moodboard Library');
    await expect(page.locator('.tool-page__eyebrow')).toContainText('reference');
    await expect(page.locator('.tool-page__eyebrow')).toContainText('cargo/07');
  });

  test('topbar Tools link is active on this tool route', async ({ page }) => {
    await page.goto('/tools/moodboard-library');
    const toolsLink = page.locator('.topbar__nav a').first();
    await expect(toolsLink).toHaveClass(/is-active/);
  });

  test('renders all 6 moodboard cards', async ({ page }) => {
    await page.goto('/tools/moodboard-library');
    const cards = page.locator('.mb-card');
    await expect(cards).toHaveCount(6);
  });

  test('each card has exactly 4 swatches', async ({ page }) => {
    await page.goto('/tools/moodboard-library');
    const cards = page.locator('.mb-card');
    const swatchCounts = await cards.evaluateAll((nodes) =>
      nodes.map((n) => n.querySelectorAll('.mb-card__swatch').length)
    );
    swatchCounts.forEach((count) => expect(count).toBe(4));
  });

  test('each card embeds an SVG specimen with the heading font name', async ({ page }) => {
    await page.goto('/tools/moodboard-library');
    const specimens = page.locator('.mb-card__specimen');
    await expect(specimens).toHaveCount(6);
    // Each specimen is a real <svg>, not an <img>, and has the per-moodboard data attribute
    const tagNames = await specimens.evaluateAll((nodes) =>
      nodes.map((n) => n.tagName.toLowerCase())
    );
    tagNames.forEach((tag) => expect(tag).toBe('svg'));
    // Mediterranean Dusk's specimen should mention its heading font
    const dusk = page.getByTestId('mb-card-mediterranean-dusk');
    await expect(dusk.locator('.mb-card__specimen')).toContainText('INSTRUMENT SERIF');
    await expect(dusk.locator('.mb-card__specimen')).toContainText('General Sans');
  });

  test('each specimen renders the "Aa" sample glyph', async ({ page }) => {
    await page.goto('/tools/moodboard-library');
    const samples = page.locator('.mb-card__specimen [data-testid="specimen-sample"]');
    await expect(samples).toHaveCount(6);
    const texts = await samples.allTextContents();
    texts.forEach((t) => expect(t.trim()).toBe('Aa'));
  });

  test('each card shows an italic-serif tagline', async ({ page }) => {
    await page.goto('/tools/moodboard-library');
    const taglines = page.locator('.mb-card__tagline');
    await expect(taglines).toHaveCount(6);
    const firstTagline = taglines.first();
    const fontStyle = await firstTagline.evaluate((el) => getComputedStyle(el).fontStyle);
    expect(fontStyle).toBe('italic');
  });

  test('each card lists type and texture metadata', async ({ page }) => {
    await page.goto('/tools/moodboard-library');
    const firstCard = page.getByTestId('mb-card-mediterranean-dusk');
    await expect(firstCard).toContainText('Instrument Serif + General Sans');
    await expect(firstCard).toContainText('matte clay, raw linen');
  });

  test('all four categories appear across the grid', async ({ page }) => {
    await page.goto('/tools/moodboard-library');
    const categories = await page.locator('.mb-card__category').allTextContents();
    const unique = Array.from(new Set(categories.map((s) => s.trim().toLowerCase())));
    expect(unique.sort()).toEqual(['cool', 'high-contrast', 'soft', 'warm']);
  });

  test('clicking a card flips its copied state', async ({ page, context }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    await page.goto('/tools/moodboard-library');
    const card = page.getByTestId('mb-card-tokyo-at-3am');
    const hint = card.locator('.mb-card__copy-hint');
    await expect(hint).toHaveText('copy');
    await card.click();
    await expect(hint).toHaveText('copied');
    await expect(card).toHaveAttribute('data-copied', 'true');
  });

  test('copied state reverts after timeout', async ({ page, context }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    await page.goto('/tools/moodboard-library');
    const card = page.getByTestId('mb-card-soft-lab');
    const hint = card.locator('.mb-card__copy-hint');
    await card.click();
    await expect(hint).toHaveText('copied');
    await page.waitForTimeout(1700);
    await expect(hint).toHaveText('copy');
  });

  test('palette swatches use the correct hex values for Mediterranean Dusk', async ({ page }) => {
    await page.goto('/tools/moodboard-library');
    const card = page.getByTestId('mb-card-mediterranean-dusk');
    const swatches = card.locator('.mb-card__swatch');
    const bgs = await swatches.evaluateAll((nodes) =>
      nodes.map((n) => (n as HTMLElement).style.background.toLowerCase())
    );
    // Browser may serialize as rgb() or keep the hex — accept either by checking for known terracotta
    const joined = bgs.join(' ');
    expect(joined).toMatch(/#c2410c|rgb\(194,\s*65,\s*12\)/);
  });

  test('back link returns to the hub', async ({ page }) => {
    await page.goto('/tools/moodboard-library');
    await page.waitForLoadState('networkidle');
    await page.locator('.tool-page__back').click();
    await page.waitForURL('/');
    await expect(page.locator('.hero__title')).toBeVisible();
  });

  test('screenshot the tool page', async ({ page }, testInfo) => {
    await page.goto('/tools/moodboard-library');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(500);
    await page.screenshot({
      path: `./screenshots/tool-moodboard-library-phase8-${testInfo.project.name}.png`,
      fullPage: true,
    });
  });
});
