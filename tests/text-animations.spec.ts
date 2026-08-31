import { writeFileSync } from 'node:fs';
import { test, expect } from '@playwright/test';
import { grantClipboard } from './helpers/clipboard';
import { watchConsoleErrors, realConsoleErrors } from './helpers/console-errors';
import { TOUCH_FLOOR_MIN } from './helpers/touch-target';

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
    await expect(page.locator('.tool-page__eyebrow')).toContainText('cargo/02');
  });

  test('topbar Tools link is active on this tool route', async ({ page }) => {
    await page.goto('/tools/text-animations');
    const toolsLink = page.locator('.topbar__nav a').first();
    await expect(toolsLink).toHaveClass(/is-active/);
  });

  test('renders all 146 animation cards by default', async ({ page }) => {
    await page.goto('/tools/text-animations');
    const cards = page.locator('.ta-card');
    await expect(cards).toHaveCount(146);
  });

  test('result count reads 146 / 146', async ({ page }) => {
    await page.goto('/tools/text-animations');
    await expect(page.getByTestId('ta-result-count')).toHaveText('146 / 146');
  });

  // This used to assert the catalogue rendered "99 kw- then 47 ta-". The kw-
  // prefix is gone (see THIRD-PARTY-NOTICES.md) so there are no longer two
  // groups to order — every entry shares the one ta- namespace. What is worth
  // holding is that the catalogue is complete and every id is unique, since the
  // id doubles as the animation's CSS class and keyframes name.
  test('catalogue renders all 146 entries with unique ids', async ({ page }) => {
    await page.goto('/tools/text-animations');
    const ids = await page.locator('.ta-card').evaluateAll((els) =>
      els.map((el) => el.getAttribute('data-animation-id') || '')
    );
    expect(ids).toHaveLength(146);
    expect(new Set(ids).size).toBe(146);
    expect(ids.every((id) => id.startsWith('ta-'))).toBe(true);
  });

  test('cards render no plain-text category — classification is badge-only', async ({ page }) => {
    await page.goto('/tools/text-animations');
    // The card rework removed the bare category string entirely; the
    // `.ta-card__category` element no longer exists. Only 3D/hover badges
    // convey classification now (verified by the badge tests below).
    await expect(page.locator('.ta-card__category')).toHaveCount(0);
  });

  test('search filters by name', async ({ page }) => {
    await page.goto('/tools/text-animations');
    await page.getByTestId('ta-search-input').fill('fade');
    const cards = page.locator('.ta-card');
    const count = await cards.count();
    expect(count).toBeGreaterThanOrEqual(5);
    expect(count).toBeLessThan(146);
  });

  test('search filters by category', async ({ page }) => {
    await page.goto('/tools/text-animations');
    await page.getByTestId('ta-search-input').fill('loop');
    // Should narrow to exactly the loop-category animations
    const cards = page.locator('.ta-card');
    await expect(cards).toHaveCount(13);
  });

  test('search filters by category — hover', async ({ page }) => {
    await page.goto('/tools/text-animations');
    await page.getByTestId('ta-search-input').fill('hover');
    const cards = page.locator('.ta-card');
    await expect(cards).toHaveCount(13);
  });

  test('search with no matches shows zero cards', async ({ page }) => {
    await page.goto('/tools/text-animations');
    await page.getByTestId('ta-search-input').fill('zzznotreal');
    await expect(page.locator('.ta-card')).toHaveCount(0);
    await expect(page.getByTestId('ta-result-count')).toHaveText('0 / 146');
  });

  test('picker tray starts empty', async ({ page }) => {
    await page.goto('/tools/text-animations');
    await expect(page.getByTestId('picker-count')).toHaveText('0');
    await expect(page.getByTestId('picker-tray')).toHaveAttribute('data-empty', 'true');
  });

  test('clicking a card adds it to the picker', async ({ page }) => {
    await page.goto('/tools/text-animations');
    const card = page.getByTestId('ta-card-ta-fade-in-up');
    await card.click();
    await expect(card).toHaveAttribute('data-picked', 'true');
    await expect(page.getByTestId('picker-count')).toHaveText('1');
    // Tray is collapsed by default — the chip exists only once expanded.
    await expect(page.getByTestId('picker-chip-ta-fade-in-up')).toHaveCount(0);
    await page.getByTestId('picker-toggle').click();
    await expect(page.getByTestId('picker-chip-ta-fade-in-up')).toBeVisible();
  });

  test('clicking a picked card unpicks it', async ({ page }) => {
    await page.goto('/tools/text-animations');
    const card = page.getByTestId('ta-card-ta-fade-in-up');
    await card.click();
    await card.click();
    await expect(card).not.toHaveAttribute('data-picked', /.+/);
    await expect(page.getByTestId('picker-count')).toHaveText('0');
  });

  test('clicking a chip removes that animation from picks', async ({ page }) => {
    await page.goto('/tools/text-animations');
    await page.getByTestId('ta-card-ta-fade-in-up').click();
    await page.getByTestId('ta-card-ta-zoom-in').click();
    await expect(page.getByTestId('picker-count')).toHaveText('2');
    await page.getByTestId('picker-toggle').click();
    await page.getByTestId('picker-chip-ta-fade-in-up').click();
    await expect(page.getByTestId('picker-count')).toHaveText('1');
    await expect(page.getByTestId('picker-chip-ta-fade-in-up')).toHaveCount(0);
  });

  test('clear button empties the picker', async ({ page }) => {
    await page.goto('/tools/text-animations');
    await page.getByTestId('ta-card-ta-fade-in-up').click();
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
    await page.getByTestId('ta-card-ta-fade-in-up').click();
    await page.getByTestId('ta-card-ta-zoom-in').click();
    await page.getByTestId('ta-card-ta-slide-in-up').click();
    await expect(page.getByTestId('picker-copy')).toContainText('copy bundle (3)');
  });

  test('copy bundle confirms after click', async ({ page, context }) => {
    await grantClipboard(context);
    await page.goto('/tools/text-animations');
    await page.getByTestId('ta-card-ta-fade-in-up').click();
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

  test('hover-trigger cards show the "hover / tap" badge', async ({ page }) => {
    await page.goto('/tools/text-animations');
    const badges = page.locator('.ta-card__badge', { hasText: 'hover' });
    await expect(badges).toHaveCount(13);
    // The copy must be honest on touch too, not hover-only.
    await expect(badges.first()).toHaveText('hover / tap');
  });

  test('3D animation cards show "3D" badge', async ({ page }) => {
    await page.goto('/tools/text-animations');
    const badges = page.locator('.ta-card__badge', { hasText: '3D' });
    await expect(badges).toHaveCount(8);
  });

  test('character-split animations render per-character spans in preview', async ({ page }) => {
    await page.goto('/tools/text-animations');
    const card = page.getByTestId('ta-card-ta-stagger-fade-up');
    await card.scrollIntoViewIfNeeded();
    await page.waitForTimeout(400);
    const preview = page.getByTestId('ta-preview-ta-stagger-fade-up');
    const spanCount = await preview.locator('> span').count();
    // The card now animates its own name. 'Stagger fade up' is 15 chars
    // including spaces, so it splits into > 10 per-character spans.
    expect(spanCount).toBeGreaterThan(10);
  });

  test('word-split animations render per-word spans in preview', async ({ page }) => {
    await page.goto('/tools/text-animations');
    const card = page.getByTestId('ta-card-ta-stagger-words-rise');
    await card.scrollIntoViewIfNeeded();
    await page.waitForTimeout(400);
    const preview = page.getByTestId('ta-preview-ta-stagger-words-rise');
    const spanCount = await preview.locator('> span').count();
    // The card animates its own name. 'Stagger words — rise' is 4 words.
    expect(spanCount).toBe(4);
  });

  test('line-split animations render the name as a single-line span', async ({ page }) => {
    await page.goto('/tools/text-animations');
    const card = page.getByTestId('ta-card-ta-stagger-lines-rise');
    await card.scrollIntoViewIfNeeded();
    await page.waitForTimeout(400);
    const preview = page.getByTestId('ta-preview-ta-stagger-lines-rise');
    const spanCount = await preview.locator('> span').count();
    // The card animates its own name, which has no line breaks, so a
    // line-split renders exactly one span. (The 3-line sampleText is still
    // used by the snippet/bundle export, unchanged.)
    expect(spanCount).toBe(1);
  });

  test('hover-trigger cards have data-trigger="hover"', async ({ page }) => {
    await page.goto('/tools/text-animations');
    const hoverCards = page.locator('.ta-card[data-trigger="hover"]');
    await expect(hoverCards).toHaveCount(13);
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
    await page.getByTestId('ta-card-ta-fade-in-up').click();
    await page.getByTestId('picker-copy').click();
    const clipboard = await page.evaluate(() => navigator.clipboard.readText());
    expect(clipboard).not.toContain('HTML structure for stagger');
    expect(clipboard).not.toContain('staggerSplit');
  });

  test('bundle copy includes 3D perspective note when 3D animation picked', async ({ page, context }) => {
    await grantClipboard(context);
    await page.goto('/tools/text-animations');
    await page.getByTestId('ta-card-ta-rotate-in-y').click();
    await page.getByTestId('picker-copy').click();
    const clipboard = await page.evaluate(() => navigator.clipboard.readText());
    expect(clipboard).toContain('perspective');
  });

  test('card title is the human name; id is secondary metadata', async ({ page }) => {
    await page.goto('/tools/text-animations');
    const card = page.getByTestId('ta-card-ta-fade-in-up');
    await expect(card.locator('.ta-card__name')).toHaveText('Fade in up');
    await expect(card.locator('.ta-card__id')).toHaveText('ta-fade-in-up');
  });

  // — JS-driven animations (engine: 'js', Milestone 2a) —

  const JS_ANIMATION_IDS = [
    'ta-typewriter',
    'ta-terminal-type',
    'ta-shuffle-text',
    'ta-binary-decode',
    'ta-random-reveal',
    'ta-spotlight',
  ];

  test('the 6 JS-engine animations exist as specialty cards', async ({ page }) => {
    await page.goto('/tools/text-animations');
    for (const id of JS_ANIMATION_IDS) {
      await expect(page.getByTestId(`ta-card-${id}`)).toHaveCount(1);
    }
  });

  test('each JS driver populates its preview element when scrolled into view', async ({ page }) => {
    await page.goto('/tools/text-animations');
    for (const id of JS_ANIMATION_IDS) {
      const card = page.getByTestId(`ta-card-${id}`);
      await card.scrollIntoViewIfNeeded();
      const preview = page.getByTestId(`ta-preview-${id}`);
      // The driver owns the element's content — the span starts empty and is
      // filled with text and/or child spans by the driver's own loop.
      await expect(preview).not.toBeEmpty();
    }
  });

  test('Typewriter driver types out the animation name', async ({ page }) => {
    await page.goto('/tools/text-animations');
    const card = page.getByTestId('ta-card-ta-typewriter');
    await card.scrollIntoViewIfNeeded();
    await expect(page.getByTestId('ta-preview-ta-typewriter')).toContainText('Typewriter', {
      timeout: 8000,
    });
  });

  test('Terminal Type driver renders the blinking cursor element + sample text', async ({ page }) => {
    await page.goto('/tools/text-animations');
    const card = page.getByTestId('ta-card-ta-terminal-type');
    await card.scrollIntoViewIfNeeded();
    const preview = page.getByTestId('ta-preview-ta-terminal-type');
    await expect(preview.locator('.ta-terminal-cursor')).toHaveCount(1);
    await expect(preview).toContainText('init system...', { timeout: 8000 });
  });

  test('Binary Decode driver resolves to its sample text', async ({ page }) => {
    await page.goto('/tools/text-animations');
    const card = page.getByTestId('ta-card-ta-binary-decode');
    await card.scrollIntoViewIfNeeded();
    // Binary Decode carries a sampleText (not its name); it flickers 0/1 then
    // resolves each character. 'Decode' is the stable resolved suffix.
    await expect(page.getByTestId('ta-preview-ta-binary-decode')).toContainText('Decode', {
      timeout: 9000,
    });
  });

  test('Spotlight driver sets the text immediately with a clipped gradient', async ({ page }) => {
    await page.goto('/tools/text-animations');
    const card = page.getByTestId('ta-card-ta-spotlight');
    await card.scrollIntoViewIfNeeded();
    const preview = page.getByTestId('ta-preview-ta-spotlight');
    await expect(preview).toHaveText('Spotlight');
    // The driver clips a sweeping gradient to the text — assert the inline
    // style the driver set directly (avoids cross-browser computed-value
    // quirks for background-clip: text).
    const bg = await preview.evaluate((el) => (el as HTMLElement).style.backgroundImage);
    expect(bg).toContain('linear-gradient');
  });

  test('JS-engine cards replay on the shared cadence (driver re-runs on remount)', async ({ page }) => {
    await page.goto('/tools/text-animations');
    const preview = page.getByTestId('ta-preview-ta-typewriter');
    await page.getByTestId('ta-card-ta-typewriter').scrollIntoViewIfNeeded();
    // Full text appears (typewriter completes ~1.7s)…
    await expect(preview).toHaveText('Typewriter', { timeout: 8000 });
    // …then the shared replayKey cadence (durationMs + 400) remounts the span
    // and the driver restarts from empty, so it re-types again.
    await expect(preview).not.toHaveText('Typewriter', { timeout: 4000 });
    await expect(preview).toHaveText('Typewriter', { timeout: 8000 });
  });

  // — JS bundle export (getBundleSnippet JS section, Milestone 2b) —

  const ALL_DRIVER_FNS = [
    'taDriverTypewriter',
    'taDriverTerminal',
    'taDriverShuffle',
    'taDriverBinaryDecode',
    'taDriverRandomReveal',
    'taDriverSpotlight',
  ];

  /** Pick the given card ids, copy the bundle, return the clipboard text. */
  async function copyBundle(page: import('@playwright/test').Page, ids: string[]) {
    await page.goto('/tools/text-animations');
    for (const id of ids) {
      await page.getByTestId(`ta-card-${id}`).click();
    }
    await page.getByTestId('picker-copy').click();
    return page.evaluate(() => navigator.clipboard.readText());
  }

  test('JS-only pick emits a JS section and no CSS section / no `undefined`', async ({
    page,
    context,
  }) => {
    await grantClipboard(context);
    const bundle = await copyBundle(page, ['ta-typewriter']);

    // JS section present
    expect(bundle).toContain('<script>');
    expect(bundle).toContain('</script>');
    expect(bundle).toContain('/* Cargo Text Animations — JS drivers (picked: typewriter) */');
    expect(bundle).toContain('var taDriverTypewriter = function');
    expect(bundle).toContain('var __taDrivers = {');
    expect(bundle).toContain('"typewriter": taDriverTypewriter,');
    expect(bundle).toContain("document.querySelectorAll('[data-ta-anim]')");
    // Markup note, listing the picked kind
    expect(bundle).toContain('/* JS animations — markup:');
    expect(bundle).toContain('data-ta-anim = the animation kind (picked: typewriter)');

    // Part 1: a JS-only pick has NO CSS section and never ships `undefined`
    expect(bundle).not.toContain('/* Keyframes */');
    expect(bundle).not.toContain('/* Classes */');
    expect(bundle).not.toContain('undefined');
    expect(bundle).not.toMatch(/\.ta-typewriter\s*\{\s*\}/);

    // Only the picked driver is emitted
    for (const fn of ALL_DRIVER_FNS.filter((f) => f !== 'taDriverTypewriter')) {
      expect(bundle).not.toContain(fn);
    }
  });

  test('2-JS pick emits exactly the two picked drivers, in one IIFE', async ({
    page,
    context,
  }) => {
    await grantClipboard(context);
    const bundle = await copyBundle(page, ['ta-typewriter', 'ta-binary-decode']);

    expect(bundle).toContain('var taDriverTypewriter = function');
    expect(bundle).toContain('var taDriverBinaryDecode = function');
    expect(bundle).toContain('"typewriter": taDriverTypewriter,');
    expect(bundle).toContain('"binary-decode": taDriverBinaryDecode,');
    expect(bundle).toContain('(picked: typewriter, binary-decode)');

    // None of the other four drivers
    for (const fn of ['taDriverTerminal', 'taDriverShuffle', 'taDriverRandomReveal', 'taDriverSpotlight']) {
      expect(bundle).not.toContain(fn);
    }
    // One single <script> / IIFE
    expect(bundle.match(/<script>/g) || []).toHaveLength(1);
    expect(bundle.match(/\(function\(\)\{/g) || []).toHaveLength(1);
  });

  test('mixed pick (CSS + JS) emits both a CSS section and a JS section', async ({
    page,
    context,
  }) => {
    await grantClipboard(context);
    const bundle = await copyBundle(page, ['ta-fade-in-up', 'ta-typewriter']);

    // CSS section for the CSS animation
    expect(bundle).toContain('/* Keyframes */');
    expect(bundle).toContain('/* Classes */');
    expect(bundle).toContain('.ta-fade-in-up');
    // JS section for the JS animation
    expect(bundle).toContain('<script>');
    expect(bundle).toContain('var taDriverTypewriter = function');
    // No undefined leaked into the CSS section
    expect(bundle).not.toContain('undefined');
  });

  test('CSS-only pick emits no JS section (unchanged from before 2b)', async ({
    page,
    context,
  }) => {
    await grantClipboard(context);
    const bundle = await copyBundle(page, ['ta-fade-in-up']);

    expect(bundle).toContain('/* Keyframes */');
    expect(bundle).toContain('/* Classes */');
    expect(bundle).not.toContain('<script>');
    expect(bundle).not.toContain('data-ta-anim');
    expect(bundle).not.toContain('JS drivers');
  });

  // The exported <script> must actually run. Paste a JS-only bundle's script +
  // sample markup into a standalone HTML file, open it via file://, and confirm
  // the driver animates the element with no console errors. Covers a typing
  // driver (Typewriter) and a frame-based driver (Binary Decode).
  async function runnableCheck(
    page: import('@playwright/test').Page,
    context: import('@playwright/test').BrowserContext,
    testInfo: import('@playwright/test').TestInfo,
    cardId: string,
    kind: string,
    text: string
  ) {
    await grantClipboard(context);
    const bundle = await copyBundle(page, [cardId]);
    const scriptMatch = bundle.match(/<script>[\s\S]*?<\/script>/);
    expect(scriptMatch, 'bundle should contain a <script> block').not.toBeNull();
    const scriptBlock = scriptMatch![0];

    const html = `<!DOCTYPE html>
<html><head><meta charset="utf-8"></head><body>
<span data-ta-anim="${kind}" data-ta-text="${text}"></span>
${scriptBlock}
</body></html>`;
    const file = testInfo.outputPath(`runnable-${kind}.html`);
    writeFileSync(file, html, 'utf-8');

    const { errors } = watchConsoleErrors(page);
    await page.goto('file://' + file);
    const el = page.locator(`[data-ta-anim="${kind}"]`);
    await expect(el).toContainText(text.includes(' ') ? text.split(' ').pop()! : text, {
      timeout: 9000,
    });
    expect(realConsoleErrors(errors)).toEqual([]);
  }

  test('exported Typewriter script runs in a standalone file (typing driver)', async ({
    page,
    context,
  }, testInfo) => {
    await runnableCheck(page, context, testInfo, 'ta-typewriter', 'typewriter', 'Hello Cargo');
  });

  test('exported Binary Decode script runs in a standalone file (frame driver)', async ({
    page,
    context,
  }, testInfo) => {
    await runnableCheck(page, context, testInfo, 'ta-binary-decode', 'binary-decode', 'Run Decode');
  });

  // — Category filter (Milestone 3, Part 1) —

  test('category filter control is visible and discoverable in the toolbar', async ({ page }) => {
    await page.goto('/tools/text-animations');
    for (const cat of ['all', 'entrance', 'loop', 'stagger', 'hover', 'decorative', 'specialty']) {
      await expect(page.getByTestId(`ta-cat-${cat}`)).toBeVisible();
    }
    // "all" is the default selection; full catalogue shown.
    await expect(page.getByTestId('ta-cat-all')).toHaveAttribute('aria-pressed', 'true');
    await expect(page.locator('.ta-card')).toHaveCount(146);
    // Per-category counts are rendered from the data.
    await expect(page.getByTestId('ta-cat-all')).toContainText('146');
    await expect(page.getByTestId('ta-cat-loop')).toContainText('13');
  });

  test('selecting a category narrows the grid; "all" restores 146', async ({ page }) => {
    await page.goto('/tools/text-animations');
    await page.getByTestId('ta-cat-loop').click();
    await expect(page.getByTestId('ta-cat-loop')).toHaveAttribute('aria-pressed', 'true');
    await expect(page.locator('.ta-card')).toHaveCount(13);
    await expect(page.getByTestId('ta-result-count')).toHaveText('13 / 146');

    await page.getByTestId('ta-cat-hover').click();
    await expect(page.locator('.ta-card')).toHaveCount(13);
    await expect(page.getByTestId('ta-result-count')).toHaveText('13 / 146');

    await page.getByTestId('ta-cat-all').click();
    await expect(page.locator('.ta-card')).toHaveCount(146);
    await expect(page.getByTestId('ta-result-count')).toHaveText('146 / 146');
  });

  test('category filter combines with text search', async ({ page }) => {
    await page.goto('/tools/text-animations');
    await page.getByTestId('ta-cat-loop').click();
    await expect(page.locator('.ta-card')).toHaveCount(13);

    // Category (loop) AND a search term no loop animation matches → 0.
    await page.getByTestId('ta-search-input').fill('entrance');
    await expect(page.locator('.ta-card')).toHaveCount(0);
    await expect(page.getByTestId('ta-result-count')).toHaveText('0 / 146');

    // Clearing the text restores the category-only result.
    await page.getByTestId('ta-search-input').fill('');
    await expect(page.locator('.ta-card')).toHaveCount(13);

    // Searching the category's own name keeps all of its animations.
    await page.getByTestId('ta-search-input').fill('loop');
    await expect(page.locator('.ta-card')).toHaveCount(13);
  });

  // — Picker redesign (Milestone 3, Part 2) —

  test('picker is collapsed by default when picks exist (one fixed row)', async ({ page }) => {
    await page.goto('/tools/text-animations');
    await page.getByTestId('ta-card-ta-fade-in-up').click();
    await expect(page.getByTestId('picker-count')).toHaveText('1');
    // Collapsed: a toggle is offered, the chip list is not rendered.
    await expect(page.getByTestId('picker-toggle')).toBeVisible();
    await expect(page.getByTestId('picker-chips')).toHaveCount(0);
    await expect(page.getByTestId('picker-chip-ta-fade-in-up')).toHaveCount(0);
    // Actions stay reachable while collapsed.
    await expect(page.getByTestId('picker-clear')).toBeVisible();
    await expect(page.getByTestId('picker-copy')).toBeVisible();
  });

  test('expanding reveals chips; collapsing hides them again', async ({ page }) => {
    await page.goto('/tools/text-animations');
    await page.getByTestId('ta-card-ta-fade-in-up').click();
    const toggle = page.getByTestId('picker-toggle');
    await toggle.click();
    await expect(page.getByTestId('picker-chips')).toBeVisible();
    await expect(page.getByTestId('picker-chip-ta-fade-in-up')).toBeVisible();
    await toggle.click();
    await expect(page.getByTestId('picker-chips')).toHaveCount(0);
  });

  test('chips show the human name, not the kebab id', async ({ page }) => {
    await page.goto('/tools/text-animations');
    await page.getByTestId('ta-card-ta-fade-in-up').click();
    await page.getByTestId('picker-toggle').click();
    const chip = page.getByTestId('picker-chip-ta-fade-in-up');
    await expect(chip).toContainText('Fade in up');
    await expect(chip).not.toContainText('ta-fade-in-up');
  });

  test('picker stays bounded with many picks (collapsed and expanded)', async ({ page }) => {
    await page.goto('/tools/text-animations');
    const cards = page.locator('.ta-card');
    for (let i = 0; i < 60; i++) {
      await cards.nth(i).click();
    }
    await expect(page.getByTestId('picker-count')).toHaveText('60');

    // Collapsed: a single short row regardless of how many are picked.
    const collapsedBox = await page.getByTestId('picker-tray').boundingBox();
    expect(collapsedBox).not.toBeNull();
    expect(collapsedBox!.height).toBeLessThan(120);

    // Expanded: the chip area is hard-capped (max-height honored) so the tray
    // can never grow unbounded — it scrolls internally instead.
    await page.getByTestId('picker-toggle').click();
    await expect(page.getByTestId('picker-chips')).toBeVisible();
    const { clientH, scrollH } = await page
      .getByTestId('picker-chips')
      .evaluate((el) => ({ clientH: el.clientHeight, scrollH: el.scrollHeight }));
    // Cap enforced regardless of pick count.
    expect(clientH).toBeLessThanOrEqual(180);
    // 60 chips exceed the cap → content overflows and scrolls internally.
    expect(scrollH).toBeGreaterThan(clientH + 1);
    // Whole tray stays bounded.
    const expandedBox = await page.getByTestId('picker-tray').boundingBox();
    expect(expandedBox!.height).toBeLessThan(360);
  });

  test('screenshot the tool page', async ({ page }, testInfo) => {
    await page.goto('/tools/text-animations');
    await page.waitForLoadState('networkidle');
    // Pause all animations so screenshots are deterministic
    await page.addStyleTag({ content: '*, *::before, *::after { animation-play-state: paused !important; }' });
    await page.waitForTimeout(500);
    await page.screenshot({
      path: `./screenshots/tool-text-animations-m1-${testInfo.project.name}.png`,
      fullPage: true,
    });
  });

  test('screenshot the category filter and picker states', async ({ page }, testInfo) => {
    await page.goto('/tools/text-animations');
    await page.waitForLoadState('networkidle');
    await page.addStyleTag({ content: '*, *::before, *::after { animation-play-state: paused !important; }' });

    // Toolbar with the category filter.
    await page.locator('.ta-toolbar').screenshot({
      path: `./screenshots/tool-text-animations-m3-toolbar-${testInfo.project.name}.png`,
    });

    // Picker collapsed (default) with several picks.
    const cards = page.locator('.ta-card');
    for (let i = 0; i < 12; i++) await cards.nth(i).click();
    await page.getByTestId('picker-tray').scrollIntoViewIfNeeded();
    await page.getByTestId('picker-tray').screenshot({
      path: `./screenshots/tool-text-animations-m3-picker-collapsed-${testInfo.project.name}.png`,
    });

    // Picker expanded — capped, scrolling chip list.
    await page.getByTestId('picker-toggle').click();
    await expect(page.getByTestId('picker-chips')).toBeVisible();
    await page.getByTestId('picker-tray').screenshot({
      path: `./screenshots/tool-text-animations-m3-picker-expanded-${testInfo.project.name}.png`,
    });
  });
});

test.describe('Text Animation Library — touch and control polish', () => {
  test.use({ viewport: { width: 375, height: 812 } });

  test('hover-trigger cards are playable by tap, and hover CSS is preserved', async ({ page }) => {
    await page.goto('/tools/text-animations');
    const card = page.locator('.ta-card[data-trigger="hover"]').first();
    await card.scrollIntoViewIfNeeded();
    await card.click();
    // Tap sets the one-shot play state...
    await expect(card).toHaveAttribute('data-playing', 'true');
    // ...which clears itself after the animation duration.
    await expect(card).not.toHaveAttribute('data-playing', 'true', { timeout: 6000 });

    const css = await page.evaluate(() => {
      let hoverRule = false;
      let playRule = false;
      for (const s of Array.from(document.styleSheets)) {
        let rules: CSSRuleList;
        try {
          rules = s.cssRules;
        } catch {
          continue;
        }
        for (const r of Array.from(rules)) {
          const sel = (r as CSSStyleRule).selectorText;
          if (!sel) continue;
          if (sel.includes('.ta-underline-grow:hover')) hoverRule = true;
          if (sel.includes('[data-playing="true"]') && sel.includes('ta-underline-grow'))
            playRule = true;
        }
      }
      return { hoverRule, playRule };
    });
    expect(css.hoverRule).toBe(true); // desktop hover-to-play unchanged
    expect(css.playRule).toBe(true); // touch path wired in parallel
  });

  test('filter chips meet the 44px touch floor', async ({ page }) => {
    await page.goto('/tools/text-animations');
    for (const cat of ['all', 'hover', 'specialty']) {
      const box = await page.getByTestId(`ta-cat-${cat}`).boundingBox();
      expect(box!.height).toBeGreaterThanOrEqual(TOUCH_FLOOR_MIN);
    }
  });

  test('the PickerTray .btn--sm buttons meet the 44px touch floor', async ({ page }) => {
    await page.goto('/tools/text-animations');
    // Pick a card so the shared .btn--sm clear/copy buttons are live.
    await page.getByTestId('ta-card-ta-fade-in-up').click();
    const clear = await page.getByTestId('picker-clear').boundingBox();
    const copy = await page.getByTestId('picker-copy').boundingBox();
    expect(clear!.height).toBeGreaterThanOrEqual(TOUCH_FLOOR_MIN);
    expect(copy!.height).toBeGreaterThanOrEqual(TOUCH_FLOOR_MIN);
  });

  test('the PickerTray show toggle and chips meet the 44px touch floor', async ({ page }) => {
    await page.goto('/tools/text-animations');
    await page.getByTestId('ta-card-ta-fade-in-up').click();
    // The show/hide toggle.
    const toggle = page.getByTestId('picker-toggle');
    await expect(toggle).toBeVisible();
    expect((await toggle.boundingBox())!.height).toBeGreaterThanOrEqual(TOUCH_FLOOR_MIN);
    // Expand so the chips render; the chip IS the remove control (the inner
    // "x" is an aria-hidden span), so a 44px chip is a 44px remove target.
    await toggle.click();
    const chip = page.getByTestId('picker-chip-ta-fade-in-up');
    await expect(chip).toBeVisible();
    expect((await chip.boundingBox())!.height).toBeGreaterThanOrEqual(TOUCH_FLOOR_MIN);
  });

  test('screenshot the PickerTray .btn--sm fix at mobile', async ({ page }, testInfo) => {
    await page.goto('/tools/text-animations');
    await page.getByTestId('ta-card-ta-fade-in-up').click();
    await page.getByTestId('picker-toggle').click();
    await page.getByTestId('picker-tray').screenshot({
      path: `./screenshots/d2b-picker-tray-btnsm-${testInfo.project.name}.png`,
    });
  });
});
