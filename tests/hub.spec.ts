import { test, expect } from '@playwright/test';
import { watchConsoleErrors, realConsoleErrors } from './helpers/console-errors';

test.describe('Hub page foundation', () => {
  test('renders without console errors', async ({ page }) => {
    const { errors } = watchConsoleErrors(page);

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    expect(realConsoleErrors(errors)).toEqual([]);
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

  test('renders all 9 tool cards', async ({ page }) => {
    await page.goto('/');
    const cards = page.locator('.tool-card');
    await expect(cards).toHaveCount(9);
  });

  // The Component Prompt Builder (cargo/06) was cut. Surviving tools keep
  // their original catalogue numbers as stable identities, so 06 is absent
  // by design rather than the list being renumbered.
  test('tool cards show the catalogue numbers, 06 cut', async ({ page }) => {
    await page.goto('/');
    const manifests = await page.locator('.tool-card__manifest').allTextContents();
    expect(manifests).toEqual([
      'CARGO/01',
      'CARGO/02',
      'CARGO/03',
      'CARGO/04',
      'CARGO/05',
      'CARGO/07',
      'CARGO/08',
      'CARGO/09',
      'CARGO/10',
    ]);
  });

  test('hub shows 9 shipped + 0 coming-soon tool cards', async ({ page }) => {
    await page.goto('/');
    const shippedCards = page.locator('.tool-card[data-status="shipped"]');
    const soonCards = page.locator('.tool-card[data-status="coming_soon"]');
    await expect(shippedCards).toHaveCount(9);
    await expect(soonCards).toHaveCount(0);
  });

  test('shipped tool card (css-effect-lab) is a navigable link', async ({ page }) => {
    await page.goto('/');
    const card = page.locator('.tool-card[data-tool-id="css-effect-lab"]');
    const tagName = await card.evaluate((el) => el.tagName.toLowerCase());
    expect(tagName).toBe('a');
    await expect(card).toHaveAttribute('href', '/tools/css-effect-lab');
  });

  test('shipped tool card (easing-cookbook) is a navigable link', async ({ page }) => {
    await page.goto('/');
    const card = page.locator('.tool-card[data-tool-id="easing-cookbook"]');
    const tagName = await card.evaluate((el) => el.tagName.toLowerCase());
    expect(tagName).toBe('a');
    await expect(card).toHaveAttribute('href', '/tools/easing-cookbook');
  });

  test('shipped tool card (loading-states) is a navigable link', async ({ page }) => {
    await page.goto('/');
    const card = page.locator('.tool-card[data-tool-id="loading-states"]');
    const tagName = await card.evaluate((el) => el.tagName.toLowerCase());
    expect(tagName).toBe('a');
    await expect(card).toHaveAttribute('href', '/tools/loading-states');
  });

  test('Component Prompt Builder was cut: no card, no route', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('.tool-card[data-tool-id="prompt-builder"]')).toHaveCount(0);
    const res = await page.goto('/tools/prompt-builder');
    expect(res?.status()).toBe(404);
  });

  test('shipped tool card (type-field-guide) is a navigable link', async ({ page }) => {
    await page.goto('/');
    const card = page.locator('.tool-card[data-tool-id="type-field-guide"]');
    const tagName = await card.evaluate((el) => el.tagName.toLowerCase());
    expect(tagName).toBe('a');
    await expect(card).toHaveAttribute('href', '/tools/type-field-guide');
    await expect(card).toContainText('The Type Field Guide');
  });

  test('shipped tool card (moodboard-library) is a navigable link', async ({ page }) => {
    await page.goto('/');
    const card = page.locator('.tool-card[data-tool-id="moodboard-library"]');
    const tagName = await card.evaluate((el) => el.tagName.toLowerCase());
    expect(tagName).toBe('a');
    await expect(card).toHaveAttribute('href', '/tools/moodboard-library');
  });

  test('shipped tool card (mockup-wrapper) is a navigable link', async ({ page }) => {
    await page.goto('/');
    const card = page.locator('.tool-card[data-tool-id="mockup-wrapper"]');
    const tagName = await card.evaluate((el) => el.tagName.toLowerCase());
    expect(tagName).toBe('a');
    await expect(card).toHaveAttribute('href', '/tools/mockup-wrapper');
  });

  test('shipped tool card (text-animations) is a navigable link', async ({ page }) => {
    await page.goto('/');
    const card = page.locator('.tool-card[data-tool-id="text-animations"]');
    const tagName = await card.evaluate((el) => el.tagName.toLowerCase());
    expect(tagName).toBe('a');
    await expect(card).toHaveAttribute('href', '/tools/text-animations');
  });

  test('shipped tool card (shader-gradient-lab) is a navigable link', async ({ page }) => {
    await page.goto('/');
    const card = page.locator('.tool-card[data-tool-id="shader-gradient-lab"]');
    const tagName = await card.evaluate((el) => el.tagName.toLowerCase());
    expect(tagName).toBe('a');
    await expect(card).toHaveAttribute('href', '/tools/shader-gradient-lab');
  });

  test('all tool cards are navigable links (every tool shipped)', async ({ page }) => {
    await page.goto('/');
    const shippedCards = page.locator('.tool-card[data-status="shipped"]');
    const tagNames = await shippedCards.evaluateAll((nodes) => nodes.map((n) => n.tagName.toLowerCase()));
    expect(tagNames.length).toBe(9);
    tagNames.forEach((t) => expect(t).toBe('a'));
  });

  test('no coming-soon cards remain on the hub', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('.tool-card[data-status="coming_soon"]')).toHaveCount(0);
  });

  test('UI Pattern Library is now a shipped, navigable card', async ({ page }) => {
    await page.goto('/');
    const card = page.locator('.tool-card[data-tool-id="ui-pattern-library"]');
    await expect(card).toHaveCount(1);
    await expect(card).toHaveAttribute('data-status', 'shipped');
    await expect(card).toContainText('UI Pattern Library');
    await expect(card).not.toContainText('Dictionary');
    const tagName = await card.evaluate((el) => el.tagName.toLowerCase());
    expect(tagName).toBe('a');
    await expect(card).toHaveAttribute('href', '/tools/ui-pattern-library');
  });

  test('no "soon" tag appears on the hub', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('.tool-card .tag--soon')).toHaveCount(0);
  });

  test('manifest derives counts from the tool array', async ({ page }) => {
    await page.goto('/');
    const toolsShipped = page.locator('.manifest__item').nth(1).locator('.manifest__value');
    await expect(toolsShipped).toContainText('9 / 9 planned');
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
      path: `./screenshots/hub-phase11d-6-${testInfo.project.name}.png`,
      fullPage: true,
    });
  });
});
