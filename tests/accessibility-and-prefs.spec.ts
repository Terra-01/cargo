import { test, expect } from '@playwright/test';

// Covers the open-source-readiness pass: the skip link, the persisted theme
// choice, and the reduced-motion contract (tool motion stays available, it just
// stops starting unrequested).

test.describe('Skip link', () => {
  test('is the first tab stop and reveals itself on focus', async ({ page }) => {
    await page.goto('/');
    await page.keyboard.press('Tab');

    const skip = page.locator('.skip-link');
    await expect(skip).toBeFocused();
    // Off-canvas at rest, fully on-screen once focused.
    await expect(skip).toHaveCSS('transform', 'matrix(1, 0, 0, 1, 0, 0)');
    const box = await skip.boundingBox();
    expect(box).not.toBeNull();
    expect(box!.y).toBeGreaterThanOrEqual(0);
  });

  test('points at a real target on every page', async ({ page }) => {
    for (const path of ['/', '/about', '/notes', '/tools/easing-cookbook']) {
      await page.goto(path);
      await expect(page.locator('.skip-link')).toHaveAttribute('href', '#main');
      await expect(page.locator('main#main')).toHaveCount(1);
    }
  });
});

test.describe('Theme persistence', () => {
  test('survives a full page load and applies before paint', async ({ page }) => {
    await page.goto('/');
    const toggle = page.getByTestId('theme-toggle');

    // auto -> light -> dark
    await toggle.click();
    await toggle.click();
    await expect(toggle).toHaveText('dark');
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');

    // A hard navigation to a different route must keep it.
    await page.goto('/about');
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
    await expect(page.getByTestId('theme-toggle')).toHaveText('dark');

    // Cycling back to auto clears the attribute and lets the OS decide again.
    await page.getByTestId('theme-toggle').click();
    await expect(page.locator('html')).not.toHaveAttribute('data-theme', /.*/);
  });

  test('does not break when storage throws', async ({ page }) => {
    // Private-mode / blocked-cookies behaviour: the toggle still works for the
    // session, it just cannot remember.
    await page.addInitScript(() => {
      const boom = () => {
        throw new Error('storage blocked');
      };
      Object.defineProperty(window, 'localStorage', {
        configurable: true,
        get: () => ({ getItem: boom, setItem: boom, removeItem: boom }),
      });
    });
    await page.goto('/');
    const toggle = page.getByTestId('theme-toggle');
    await expect(toggle).toHaveText('auto');
    await toggle.click();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  });
});

test.describe('Reduced motion', () => {
  // Project-level colorScheme/permissions still apply — top-level options take
  // priority over contextOptions, so this only adds the media preference.
  test.use({ contextOptions: { reducedMotion: 'reduce' } });

  test('text animation cards do not auto-play, but still play on tap', async ({
    page,
  }) => {
    await page.goto('/tools/text-animations');

    // Pick a plain auto/CSS card: at rest it renders static, with no animation
    // class and no driver running.
    const preview = page.getByTestId('ta-preview-kw-fade-in');
    await expect(preview).toBeVisible();
    await expect(preview).toHaveAttribute('data-static', 'true');

    // The name is still readable — reduced motion must not empty the card.
    await expect(preview).not.toBeEmpty();

    // Tapping the card plays exactly one pass: the animated span replaces the
    // static one (it carries the animation id as a class).
    await page.getByTestId('ta-card-kw-fade-in').click();
    const animated = page.getByTestId('ta-preview-kw-fade-in');
    await expect(animated).toHaveClass(/kw-fade-in/);
  });

  test('the decorative hub shimmer stops', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('.cargo-shimmer-bar').first()).toHaveCSS(
      'animation-name',
      'none'
    );
  });

  test('the hero entrance does not animate', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('.hero__title')).toHaveCSS('animation-name', 'none');
  });
});

test.describe('Reduced motion off (default)', () => {
  test('text animation cards still auto-play', async ({ page }) => {
    await page.goto('/tools/text-animations');
    const preview = page.getByTestId('ta-preview-kw-fade-in');
    await expect(preview).toBeVisible();
    // No static marker: the animated span is mounted straight away.
    await expect(preview).not.toHaveAttribute('data-static', 'true');
    await expect(preview).toHaveClass(/kw-fade-in/);
  });
});

test.describe('Crawlability', () => {
  test('sitemap lists every shipped tool', async ({ page }) => {
    const res = await page.goto('/sitemap.xml');
    expect(res?.status()).toBe(200);
    const xml = await page.content();
    for (const path of ['/tools/shader-gradient-lab', '/tools/css-effect-lab', '/about']) {
      expect(xml).toContain(path);
    }
  });

  test('robots.txt allows crawling and points at the sitemap', async ({ page }) => {
    const res = await page.goto('/robots.txt');
    expect(res?.status()).toBe(200);
    const body = await page.evaluate(() => document.body.textContent ?? '');
    expect(body).toContain('Allow: /');
    expect(body).toContain('sitemap.xml');
  });
});
