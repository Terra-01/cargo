import { test, expect } from '@playwright/test';
import { watchConsoleErrors, realConsoleErrors } from './helpers/console-errors';

test.describe('Static content pages (About + Notes)', () => {
  test('/about loads without 404', async ({ page }) => {
    const res = await page.goto('/about');
    expect(res?.status()).toBeLessThan(400);
    await expect(page.locator('.tool-page__title')).toContainText(
      'A workshop, not a product.'
    );
  });

  test('/about renders without console errors', async ({ page }) => {
    const { errors } = watchConsoleErrors(page);
    await page.goto('/about');
    await page.waitForLoadState('networkidle');
    expect(realConsoleErrors(errors)).toEqual([]);
  });

  test('/about: topbar About link is active', async ({ page }) => {
    await page.goto('/about');
    const aboutLink = page.locator('.topbar__nav a', { hasText: 'About' });
    await expect(aboutLink).toHaveClass(/is-active/);
  });

  test('/about: attribution + principle render', async ({ page }) => {
    await page.goto('/about');
    await expect(
      page.getByRole('heading', { name: "Built on other people's work" })
    ).toBeVisible();
    const quote = page.locator('.principle__quote');
    await expect(quote).toBeVisible();
    await expect(quote).toContainText('ship it on a Saturday');
  });

  test('/notes loads without 404', async ({ page }) => {
    const res = await page.goto('/notes');
    expect(res?.status()).toBeLessThan(400);
    await expect(page.locator('.tool-page__title')).toContainText(
      'Notes from the workshop.'
    );
  });

  test('/notes renders without console errors', async ({ page }) => {
    const { errors } = watchConsoleErrors(page);
    await page.goto('/notes');
    await page.waitForLoadState('networkidle');
    expect(realConsoleErrors(errors)).toEqual([]);
  });

  test('/notes: topbar Notes link is active', async ({ page }) => {
    await page.goto('/notes');
    const notesLink = page.locator('.topbar__nav a', { hasText: 'Notes' });
    await expect(notesLink).toHaveClass(/is-active/);
  });

  test('/notes: Saturday One, its parts, and the roadmap render', async ({ page }) => {
    await page.goto('/notes');
    await expect(
      page.getByRole('heading', { name: 'Saturday One' })
    ).toBeVisible();
    await expect(
      page.getByRole('heading', { name: 'Tearing down the gradient tool' })
    ).toBeVisible();
    await expect(
      page.getByRole('heading', { name: 'On doing this one Saturday at a time' })
    ).toBeVisible();
    await expect(
      page.getByRole('heading', { name: 'The roadmap, loosely' })
    ).toBeVisible();
  });

  test('screenshot /about', async ({ page }, testInfo) => {
    await page.goto('/about');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(500);
    await page.screenshot({
      path: `./screenshots/static-about-${testInfo.project.name}.png`,
      fullPage: true,
    });
  });

  test('screenshot /notes', async ({ page }, testInfo) => {
    await page.goto('/notes');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(500);
    await page.screenshot({
      path: `./screenshots/static-notes-${testInfo.project.name}.png`,
      fullPage: true,
    });
  });
});
