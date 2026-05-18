import { test, expect } from '@playwright/test';
import { grantClipboard } from './helpers/clipboard';
import { watchConsoleErrors, realConsoleErrors } from './helpers/console-errors';

test.describe('Moodboard Library tool', () => {
  test('renders without console errors', async ({ page }) => {
    const { errors } = watchConsoleErrors(page);

    await page.goto('/tools/moodboard-library');
    await page.waitForLoadState('networkidle');

    expect(realConsoleErrors(errors)).toEqual([]);
  });

  test('renders header with title and category', async ({ page }) => {
    await page.goto('/tools/moodboard-library');
    await expect(page.locator('.tool-page__title')).toContainText('Moodboard Library');
    await expect(page.locator('.tool-page__eyebrow')).toContainText('reference');
    await expect(page.locator('.tool-page__eyebrow')).toContainText('cargo/03');
  });

  test('topbar Tools link is active on this tool route', async ({ page }) => {
    await page.goto('/tools/moodboard-library');
    const toolsLink = page.locator('.topbar__nav a').first();
    await expect(toolsLink).toHaveClass(/is-active/);
  });

  test('renders all 18 moodboard cards', async ({ page }) => {
    await page.goto('/tools/moodboard-library');
    const cards = page.locator('.mb-card');
    await expect(cards).toHaveCount(18);
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
    await expect(specimens).toHaveCount(18);
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
    await expect(samples).toHaveCount(18);
    const texts = await samples.allTextContents();
    texts.forEach((t) => expect(t.trim()).toBe('Aa'));
  });

  test('each card shows an italic-serif tagline', async ({ page }) => {
    await page.goto('/tools/moodboard-library');
    const taglines = page.locator('.mb-card__tagline');
    await expect(taglines).toHaveCount(18);
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

  test('all six families appear across the grid', async ({ page }) => {
    await page.goto('/tools/moodboard-library');
    const categories = await page.locator('.mb-card__category').allTextContents();
    const unique = Array.from(new Set(categories.map((s) => s.trim().toLowerCase())));

    // After B2 every family has boards, including editorial.
    expect(unique.sort()).toEqual([
      'brutalist',
      'editorial',
      'maximal',
      'minimal',
      'organic',
      'retro',
    ]);
  });

  test('category filter renders all family chips with data-derived counts', async ({ page }) => {
    await page.goto('/tools/moodboard-library');
    const chips = page.locator('[data-testid="mb-categories"] .mb-cat');
    await expect(chips).toHaveCount(7);
    await expect(page.getByTestId('mb-cat-all')).toContainText('18');
    await expect(page.getByTestId('mb-cat-editorial')).toContainText('3');
    await expect(page.getByTestId('mb-cat-brutalist')).toContainText('3');
    await expect(page.getByTestId('mb-cat-minimal')).toContainText('3');
    await expect(page.getByTestId('mb-cat-maximal')).toContainText('3');
    await expect(page.getByTestId('mb-cat-retro')).toContainText('3');
    await expect(page.getByTestId('mb-cat-organic')).toContainText('3');
  });

  test('selecting any family chip narrows the grid to that family (3 each)', async ({ page }) => {
    await page.goto('/tools/moodboard-library');
    await expect(page.locator('.mb-card')).toHaveCount(18);

    const families = ['editorial', 'brutalist', 'minimal', 'maximal', 'retro', 'organic'];
    for (const fam of families) {
      await page.getByTestId(`mb-cat-${fam}`).click();
      await expect(page.getByTestId(`mb-cat-${fam}`)).toHaveAttribute('data-active', 'true');
      await expect(page.locator('.mb-card')).toHaveCount(3);
      const cats = await page.locator('.mb-card__category').allTextContents();
      cats.forEach((c) => expect(c.trim().toLowerCase()).toBe(fam));
    }

    await page.getByTestId('mb-cat-all').click();
    await expect(page.locator('.mb-card')).toHaveCount(18);
  });

  test('each specimen accent is keyed to the board family', async ({ page }) => {
    await page.goto('/tools/moodboard-library');

    // Per-board family -> expected accent shape. The family-keyed specimen
    // (milestone B1) must drive the right shape with no per-board code, so the
    // B2 boards below are included to prove a new board only declares a family.
    const expected: Record<string, { family: string; shape: string }> = {
      'mediterranean-dusk': { family: 'organic', shape: 'sun-arc' },
      'scandinavian-quiet': { family: 'minimal', shape: 'soft-circle' },
      'soft-lab': { family: 'minimal', shape: 'soft-circle' },
      'tokyo-at-3am': { family: 'maximal', shape: 'glow-bars' },
      'brutalist-office': { family: 'brutalist', shape: 'checker' },
      // 90s Memphis moved high-contrast -> retro, so it adopts the new shape.
      '90s-memphis': { family: 'retro', shape: 'dot-grid' },
      // B2 boards — one per family, all auto-keyed, no per-board shape code.
      'reading-room': { family: 'editorial', shape: 'column-rule' },
      'default-styles': { family: 'brutalist', shape: 'checker' },
      'gallery-white': { family: 'minimal', shape: 'soft-circle' },
      'carnival': { family: 'maximal', shape: 'glow-bars' },
      'arcade-sunset': { family: 'retro', shape: 'dot-grid' },
      'forest-floor': { family: 'organic', shape: 'sun-arc' },
    };

    for (const [id, { family, shape }] of Object.entries(expected)) {
      const card = page.getByTestId(`mb-card-${id}`);
      const label = (await card.locator('.mb-card__category').textContent())?.trim();
      expect(label).toBe(family);
      const accent = card.locator(`.mb-card__specimen [data-accent-family="${family}"]`);
      await expect(accent).toHaveCount(1);
      await expect(accent).toHaveAttribute('data-accent-shape', shape);
    }

    // No card should still be using the old id-keyed checker on 90s Memphis.
    const memphis = page.getByTestId('mb-card-90s-memphis');
    await expect(
      memphis.locator('.mb-card__specimen [data-accent-shape="checker"]')
    ).toHaveCount(0);
  });

  test('clicking a card flips its copied state', async ({ page, context }) => {
    await grantClipboard(context);
    await page.goto('/tools/moodboard-library');
    const card = page.getByTestId('mb-card-tokyo-at-3am');
    const hint = card.locator('.mb-card__copy-hint');
    await expect(hint).toHaveText('copy');
    await card.click();
    await expect(hint).toHaveText('copied');
    await expect(card).toHaveAttribute('data-copied', 'true');
  });

  test('copied state reverts after timeout', async ({ page, context }) => {
    await grantClipboard(context);
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
