import { test, expect } from '@playwright/test';

test.describe('Component Prompt Builder tool', () => {
  test('renders without console errors', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') errors.push(msg.text());
    });
    page.on('pageerror', (err) => errors.push(err.message));

    await page.goto('/tools/prompt-builder');
    await page.waitForLoadState('networkidle');

    expect(errors).toEqual([]);
  });

  test('renders header with title and category', async ({ page }) => {
    await page.goto('/tools/prompt-builder');
    await expect(page.locator('.tool-page__title')).toContainText('Component Prompt Builder');
    await expect(page.locator('.tool-page__eyebrow')).toContainText('generator');
    await expect(page.locator('.tool-page__eyebrow')).toContainText('cargo/06');
  });

  test('topbar Tools link is active on this tool route', async ({ page }) => {
    await page.goto('/tools/prompt-builder');
    const toolsLink = page.locator('.topbar__nav a').first();
    await expect(toolsLink).toHaveClass(/is-active/);
  });

  test('renders all form controls', async ({ page }) => {
    await page.goto('/tools/prompt-builder');
    await expect(page.getByTestId('component-select')).toBeVisible();
    await expect(page.getByTestId('style-select')).toBeVisible();
    await expect(page.getByTestId('framework-select')).toBeVisible();
    await expect(page.getByTestId('dark-mode-toggle')).toBeVisible();
    await expect(page.getByTestId('notes-field')).toBeVisible();
  });

  test('default state produces a card + minimal + React/Tailwind prompt', async ({ page }) => {
    await page.goto('/tools/prompt-builder');
    const output = page.getByTestId('prompt-output');
    await expect(output).toContainText('Build a card using React + Tailwind CSS');
    await expect(output).toContainText('Visual style: Minimal');
  });

  test('changing component type updates the prompt', async ({ page }) => {
    await page.goto('/tools/prompt-builder');
    await page.getByTestId('component-select').selectOption('hero');
    const output = page.getByTestId('prompt-output');
    await expect(output).toContainText('Build a hero section using React + Tailwind CSS');
  });

  test('changing style swaps in the style-specific descriptor', async ({ page }) => {
    await page.goto('/tools/prompt-builder');
    await page.getByTestId('style-select').selectOption('brutalist');
    const output = page.getByTestId('prompt-output');
    await expect(output).toContainText('Visual style: Brutalist');
    await expect(output).toContainText('thick borders');
    await expect(output).not.toContainText('Visual style: Minimal');
  });

  test('changing framework updates the prompt', async ({ page }) => {
    await page.goto('/tools/prompt-builder');
    await page.getByTestId('framework-select').selectOption('svelte');
    const output = page.getByTestId('prompt-output');
    await expect(output).toContainText('using Svelte 5');
  });

  test('toggling dark mode adds a dark-mode requirement line', async ({ page }) => {
    await page.goto('/tools/prompt-builder');
    const output = page.getByTestId('prompt-output');
    await expect(output).not.toContainText('Support both light and dark color schemes');
    await page.getByTestId('dark-mode-toggle').click();
    await expect(output).toContainText('Support both light and dark color schemes');
  });

  test('typing into notes appends them under "Additional context"', async ({ page }) => {
    await page.goto('/tools/prompt-builder');
    await page.getByTestId('notes-field').fill('show 3 tiers with the middle one highlighted');
    const output = page.getByTestId('prompt-output');
    await expect(output).toContainText('Additional context:');
    await expect(output).toContainText('show 3 tiers with the middle one highlighted');
  });

  test('copy button shows confirmation after click', async ({ page, context }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    await page.goto('/tools/prompt-builder');
    const btn = page.getByTestId('copy-btn');
    await expect(btn).toHaveText('copy prompt');
    await btn.click();
    await expect(btn).toHaveText('copied');
  });

  test('back link returns to the hub', async ({ page }) => {
    await page.goto('/tools/prompt-builder');
    await page.locator('.tool-page__back').click();
    await page.waitForURL('/');
    await expect(page.locator('.hero__title')).toBeVisible();
  });

  test('screenshot the tool page', async ({ page }, testInfo) => {
    await page.goto('/tools/prompt-builder');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(500);
    await page.screenshot({
      path: `./screenshots/tool-prompt-builder-phase6-${testInfo.project.name}.png`,
      fullPage: true,
    });
  });
});
