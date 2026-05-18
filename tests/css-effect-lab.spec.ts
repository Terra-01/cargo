import { test, expect } from '@playwright/test';
import { grantClipboard } from './helpers/clipboard';
import { watchConsoleErrors, realConsoleErrors } from './helpers/console-errors';

// CSS Effect Lab v2 — a recipe tool for hard compositional CSS effects.
// v1's glassmorphism-generator assertions no longer apply; this suite covers
// the M1 architecture (shell + picker, realistic preview + backdrop toggle,
// the shared sectioned export) proven by two deliberately different effects:
// glow border (pseudo-elements + note) and shape-aware drop shadow
// (filter-only). The load-bearing assertion is the honesty guarantee: what
// the preview renders is byte-for-byte what the CSS export shows.

test.describe('CSS Effect Lab tool', () => {
  test('renders without console errors', async ({ page }) => {
    const { errors } = watchConsoleErrors(page);

    await page.goto('/tools/css-effect-lab');
    await page.waitForLoadState('networkidle');

    expect(realConsoleErrors(errors)).toEqual([]);
  });

  test('renders header with title, eyebrow, and back link', async ({ page }) => {
    await page.goto('/tools/css-effect-lab');
    await expect(page.locator('.tool-page__title')).toContainText('CSS Effect Lab');
    await expect(page.locator('.tool-page__eyebrow')).toContainText('production_tools');
    await expect(page.locator('.tool-page__eyebrow')).toContainText('cargo/10');
    await expect(page.locator('.tool-page__back')).toBeVisible();
  });

  test('topbar Tools link is active on tool route', async ({ page }) => {
    await page.goto('/tools/css-effect-lab');
    const toolsLink = page.locator('.topbar__nav a').first();
    await expect(toolsLink).toHaveClass(/is-active/);
  });

  test('back link returns to the hub', async ({ page }) => {
    await page.goto('/tools/css-effect-lab');
    await page.waitForLoadState('networkidle');
    await page.locator('.tool-page__back').click();
    await page.waitForURL('/');
    await expect(page.locator('.hero__title')).toBeVisible();
  });

  // The picker-count test is milestone-bound (M1 set it to 2, M2 to 4); M3
  // is the final milestone and mandates all six effects. Every other M1/M2
  // behavioural test is unchanged.
  test('effect picker offers all six effects and switches between them', async ({ page }) => {
    await page.goto('/tools/css-effect-lab');

    const glowTab = page.getByTestId('fx-tab-glow-border');
    const shadowTab = page.getByTestId('fx-tab-shape-shadow');
    const layeredTab = page.getByTestId('fx-tab-layered-glow');
    const gradientTab = page.getByTestId('fx-tab-gradient-border');
    const spotlightTab = page.getByTestId('fx-tab-spotlight');
    const grainTab = page.getByTestId('fx-tab-grain-gradient');
    await expect(glowTab).toBeVisible();
    await expect(shadowTab).toBeVisible();
    await expect(layeredTab).toBeVisible();
    await expect(gradientTab).toBeVisible();
    await expect(spotlightTab).toBeVisible();
    await expect(grainTab).toBeVisible();
    // Six effects: the tool is complete, there is no seventh.
    await expect(page.locator('.fx-picker__tab')).toHaveCount(6);

    // Glow border is the arrival recipe.
    await expect(glowTab).toHaveClass(/fx-picker__tab--active/);
    await expect(page.getByTestId('fx-target')).toHaveClass(/glow-border/);

    await shadowTab.click();
    await expect(shadowTab).toHaveClass(/fx-picker__tab--active/);
    await expect(glowTab).not.toHaveClass(/fx-picker__tab--active/);
    await expect(page.getByTestId('fx-target')).toHaveClass(/shape-shadow/);

    await layeredTab.click();
    await expect(layeredTab).toHaveClass(/fx-picker__tab--active/);
    await expect(page.getByTestId('fx-target')).toHaveClass(/layered-glow/);

    await gradientTab.click();
    await expect(gradientTab).toHaveClass(/fx-picker__tab--active/);
    await expect(page.getByTestId('fx-target')).toHaveClass(/gradient-border/);

    await spotlightTab.click();
    await expect(spotlightTab).toHaveClass(/fx-picker__tab--active/);
    await expect(page.getByTestId('fx-target')).toHaveClass(/spotlight/);

    await grainTab.click();
    await expect(grainTab).toHaveClass(/fx-picker__tab--active/);
    await expect(page.getByTestId('fx-target')).toHaveClass(/grain-gradient/);
  });

  test('preview backdrop toggles between dark and light', async ({ page }) => {
    await page.goto('/tools/css-effect-lab');
    const stage = page.getByTestId('fx-stage');

    await expect(stage).toHaveAttribute('data-backdrop', 'dark');
    await page.getByTestId('backdrop-light').click();
    await expect(stage).toHaveAttribute('data-backdrop', 'light');
    await page.getByTestId('backdrop-dark').click();
    await expect(stage).toHaveAttribute('data-backdrop', 'dark');
  });

  test('glow border: recipe renders on arrival with the full export model', async ({ page }) => {
    await page.goto('/tools/css-effect-lab');

    await expect(page.getByTestId('fx-target')).toHaveClass(/glow-border/);

    // CSS section: element rule + both pseudo-elements + the baked context.
    const css = page.getByTestId('export-css');
    await expect(css).toContainText('.glow-border');
    await expect(css).toContainText('::before');
    await expect(css).toContainText('::after');
    await expect(css).toContainText('position: relative');

    // HTML section states no markup is needed.
    await expect(page.getByTestId('export-html')).toContainText('No special markup needed');

    // Requirements note: the positioning-context gotcha.
    await expect(page.getByTestId('export-requirements')).toContainText('position: relative');
  });

  test('glow border: knobs change the recipe and the preview tracks it', async ({ page }) => {
    await page.goto('/tools/css-effect-lab');

    await expect(page.getByTestId('export-css')).toContainText('blur(16px)');
    await expect(page.getByTestId('knob-color')).toBeVisible();

    await page.getByTestId('knob-spread').fill('33');

    await expect(page.getByTestId('export-css')).toContainText('blur(33px)');
    // The injected <style> the preview renders must track the same value.
    const styleText = await page
      .getByTestId('fx-style')
      .evaluate((el) => el.textContent ?? '');
    expect(styleText).toContain('blur(33px)');
  });

  test('shape-aware drop shadow: filter-only export, no pseudo-elements', async ({ page }) => {
    await page.goto('/tools/css-effect-lab');
    await page.getByTestId('fx-tab-shape-shadow').click();

    await expect(page.getByTestId('fx-target')).toHaveClass(/shape-shadow/);

    const css = page.getByTestId('export-css');
    await expect(css).toContainText('.shape-shadow');
    await expect(css).toContainText('filter:');
    await expect(css).toContainText('drop-shadow(');
    // The contrast case: no pseudo-element plumbing at all.
    await expect(css).not.toContainText('::before');
    await expect(css).not.toContainText('::after');

    await expect(page.getByTestId('export-html')).toContainText('No special markup needed');
    await expect(page.getByTestId('export-requirements')).toContainText('drop-shadow()');
  });

  test('shape-aware drop shadow: depth knob changes the recipe', async ({ page }) => {
    await page.goto('/tools/css-effect-lab');
    await page.getByTestId('fx-tab-shape-shadow').click();

    await page.getByTestId('knob-depth').fill('40');

    // depth=40 → second drop-shadow layer uses a 40px vertical offset.
    await expect(page.getByTestId('export-css')).toContainText('0 40px');
    const styleText = await page
      .getByTestId('fx-style')
      .evaluate((el) => el.textContent ?? '');
    expect(styleText).toContain('0 40px');
  });

  test('honesty guarantee: the preview renders exactly the exported CSS', async ({ page }) => {
    await page.goto('/tools/css-effect-lab');

    for (const tab of ['fx-tab-glow-border', 'fx-tab-shape-shadow']) {
      await page.getByTestId(tab).click();
      const styleText = await page
        .getByTestId('fx-style')
        .evaluate((el) => el.textContent ?? '');
      const exportText = await page
        .getByTestId('export-css')
        .evaluate((el) => el.firstChild?.textContent ?? '');
      expect(styleText.length).toBeGreaterThan(0);
      // The <style> the browser applies and the code the user copies are
      // the same string — copy/paste reproduces the preview by construction.
      expect(exportText).toBe(styleText);
    }
  });

  // — M2 effects —————————————————————————————————————————————————————

  test('layered glow: recipe renders on arrival with stacked radial-gradients', async ({ page }) => {
    await page.goto('/tools/css-effect-lab');
    await page.getByTestId('fx-tab-layered-glow').click();

    await expect(page.getByTestId('fx-target')).toHaveClass(/layered-glow/);

    const css = page.getByTestId('export-css');
    await expect(css).toContainText('.layered-glow');
    await expect(css).toContainText('::before');
    await expect(css).toContainText('position: relative');
    // Several stacked radial-gradients, not one flat blur.
    const cssText = await css.evaluate((el) => el.firstChild?.textContent ?? '');
    expect((cssText.match(/radial-gradient\(/g) ?? []).length).toBeGreaterThanOrEqual(3);

    await expect(page.getByTestId('export-html')).toContainText('No special markup needed');
    await expect(page.getByTestId('export-requirements')).toContainText('position: relative');
  });

  test('layered glow: knobs change the recipe and the preview tracks it', async ({ page }) => {
    await page.goto('/tools/css-effect-lab');
    await page.getByTestId('fx-tab-layered-glow').click();

    await expect(page.getByTestId('export-css')).toContainText('inset: -60px');
    await page.getByTestId('knob-size').fill('100');

    await expect(page.getByTestId('export-css')).toContainText('inset: -100px');
    const styleText = await page
      .getByTestId('fx-style')
      .evaluate((el) => el.textContent ?? '');
    expect(styleText).toContain('inset: -100px');
  });

  test('animated gradient border: export ships the full @property system', async ({ page }) => {
    await page.goto('/tools/css-effect-lab');
    await page.getByTestId('fx-tab-gradient-border').click();

    await expect(page.getByTestId('fx-target')).toHaveClass(/gradient-border/);

    const css = page.getByTestId('export-css');
    await expect(css).toContainText('.gradient-border');
    await expect(css).toContainText('::before');
    await expect(css).toContainText('conic-gradient(from var(--angle)');
    await expect(css).toContainText('@property --angle');
    await expect(css).toContainText('syntax: "<angle>"');
    await expect(css).toContainText('@keyframes gradient-border-spin');
    // The reduced-motion fallback is part of the baked recipe, not optional.
    await expect(css).toContainText('@media (prefers-reduced-motion: reduce)');

    await expect(page.getByTestId('export-html')).toContainText('No special markup needed');
    await expect(page.getByTestId('export-requirements')).toContainText('@property');
    await expect(page.getByTestId('export-requirements')).toContainText('prefers-reduced-motion');
  });

  test('animated gradient border: knobs change the recipe', async ({ page }) => {
    await page.goto('/tools/css-effect-lab');
    await page.getByTestId('fx-tab-gradient-border').click();

    await expect(page.getByTestId('export-css')).toContainText('inset: -3px');
    await expect(page.getByTestId('export-css')).toContainText('gradient-border-spin 6s');

    await page.getByTestId('knob-thickness').fill('7');
    await page.getByTestId('knob-duration').fill('12');

    const css = page.getByTestId('export-css');
    await expect(css).toContainText('inset: -7px');
    await expect(css).toContainText('gradient-border-spin 12s');
    const styleText = await page
      .getByTestId('fx-style')
      .evaluate((el) => el.textContent ?? '');
    expect(styleText).toContain('inset: -7px');
    expect(styleText).toContain('gradient-border-spin 12s');
  });

  // Static facts only — never a mid-animation frame. The animation is wired
  // when motion is allowed; the recipe's prefers-reduced-motion block stops
  // it (the border stays, just static) when reduced motion is requested.
  test('animated gradient border: respects prefers-reduced-motion', async ({ page }) => {
    await page.goto('/tools/css-effect-lab');
    await page.getByTestId('fx-tab-gradient-border').click();

    const animName = () =>
      page
        .getByTestId('fx-target')
        .evaluate((el) => getComputedStyle(el, '::before').animationName);

    await page.emulateMedia({ reducedMotion: 'no-preference' });
    expect(await animName()).toBe('gradient-border-spin');

    await page.emulateMedia({ reducedMotion: 'reduce' });
    expect(await animName()).toBe('none');
  });

  test('honesty guarantee holds for the M2 effects', async ({ page }) => {
    await page.goto('/tools/css-effect-lab');

    for (const tab of ['fx-tab-layered-glow', 'fx-tab-gradient-border']) {
      await page.getByTestId(tab).click();
      const styleText = await page
        .getByTestId('fx-style')
        .evaluate((el) => el.textContent ?? '');
      const exportText = await page
        .getByTestId('export-css')
        .evaluate((el) => el.firstChild?.textContent ?? '');
      expect(styleText.length).toBeGreaterThan(0);
      expect(exportText).toBe(styleText);
    }
  });

  // — M3 effects —————————————————————————————————————————————————————

  test('spotlight: masked conic beam renders on arrival', async ({ page }) => {
    await page.goto('/tools/css-effect-lab');
    await page.getByTestId('fx-tab-spotlight').click();

    await expect(page.getByTestId('fx-target')).toHaveClass(/spotlight/);

    const css = page.getByTestId('export-css');
    await expect(css).toContainText('.spotlight');
    await expect(css).toContainText('::before');
    await expect(css).toContainText('conic-gradient(');
    await expect(css).toContainText('mask:');
    await expect(css).toContainText('-webkit-mask:');
    await expect(css).toContainText('position: relative');

    // The conic beam and the radial fade mask are actually applied.
    const probe = await page.getByTestId('fx-target').evaluate((el) => {
      const bf = getComputedStyle(el, '::before');
      const mask = bf.getPropertyValue('mask-image');
      const wmask = bf.getPropertyValue('-webkit-mask-image');
      return {
        conic: bf.backgroundImage.includes('conic-gradient'),
        masked: (!!mask && mask !== 'none') || (!!wmask && wmask !== 'none'),
      };
    });
    expect(probe.conic).toBe(true);
    expect(probe.masked).toBe(true);

    await expect(page.getByTestId('export-html')).toContainText('No special markup needed');
    await expect(page.getByTestId('export-requirements')).toContainText('mask');
  });

  test('spotlight: knobs change the recipe and the preview tracks it', async ({ page }) => {
    await page.goto('/tools/css-effect-lab');
    await page.getByTestId('fx-tab-spotlight').click();

    // cone width 80 → half-angle 40deg in the conic stops.
    await expect(page.getByTestId('export-css')).toContainText('transparent 40deg');
    await page.getByTestId('knob-width').fill('120');
    // width 120 → half-angle 60deg.
    await expect(page.getByTestId('export-css')).toContainText('transparent 60deg');
    const styleText = await page
      .getByTestId('fx-style')
      .evaluate((el) => el.textContent ?? '');
    expect(styleText).toContain('transparent 60deg');
  });

  test('grain over gradient: gradient plus encoded SVG-noise data-URI', async ({ page }) => {
    await page.goto('/tools/css-effect-lab');
    await page.getByTestId('fx-tab-grain-gradient').click();

    await expect(page.getByTestId('fx-target')).toHaveClass(/grain-gradient/);

    const css = page.getByTestId('export-css');
    await expect(css).toContainText('.grain-gradient');
    await expect(css).toContainText('linear-gradient(');
    await expect(css).toContainText('data:image/svg+xml,');
    await expect(css).toContainText('feTurbulence');
    // The encoding gotcha: the # of url(#g) MUST be %23, never a raw #.
    const cssText = await css.evaluate((el) => el.firstChild?.textContent ?? '');
    const uriPart = cssText.slice(cssText.indexOf('data:image/svg+xml,'));
    expect(uriPart).toContain('%23g');
    expect(uriPart.split('"')[0]).not.toContain('#');

    await expect(page.getByTestId('export-html')).toContainText('No special markup needed');
    await expect(page.getByTestId('export-requirements')).toContainText('data-URI');
  });

  // Not just "the CSS contains a data-URI" — the SVG must actually decode and
  // render real noise. A silently-broken encoding gives a flat (zero-
  // variance) or non-decoding image; real feTurbulence has high variance.
  test('grain over gradient: the noise actually renders', async ({ page }) => {
    await page.goto('/tools/css-effect-lab');
    await page.getByTestId('fx-tab-grain-gradient').click();
    await expect(page.getByTestId('fx-target')).toHaveClass(/grain-gradient/);

    const result = await page.getByTestId('fx-target').evaluate(async (el) => {
      const raw = getComputedStyle(el, '::before').backgroundImage;
      let uri = raw.trim().replace(/^url\(/, '').replace(/\)$/, '').trim();
      if (
        (uri.startsWith('"') && uri.endsWith('"')) ||
        (uri.startsWith("'") && uri.endsWith("'"))
      )
        uri = uri.slice(1, -1);
      const decoded = await new Promise<{ ok: boolean; w?: number }>((res) => {
        const im = new Image();
        im.onload = () => res({ ok: true, w: im.naturalWidth });
        im.onerror = () => res({ ok: false });
        im.src = uri;
        setTimeout(() => res({ ok: false }), 5000);
      });
      if (!decoded.ok) return { ok: false, variance: -1 };
      const c = document.createElement('canvas');
      c.width = 48;
      c.height = 48;
      const ctx = c.getContext('2d')!;
      const im2 = new Image();
      await new Promise((r) => {
        im2.onload = r;
        im2.onerror = r;
        im2.src = uri;
      });
      ctx.drawImage(im2, 0, 0, 48, 48);
      const d = ctx.getImageData(0, 0, 48, 48).data;
      let s = 0,
        s2 = 0,
        n = 0;
      for (let i = 0; i < d.length; i += 4) {
        s += d[i];
        s2 += d[i] * d[i];
        n++;
      }
      const mean = s / n;
      return { ok: true, variance: Math.round(s2 / n - mean * mean) };
    });

    expect(result.ok).toBe(true);
    // Real turbulence noise has substantial pixel variance (observed ~220).
    expect(result.variance).toBeGreaterThan(20);
  });

  test('grain over gradient: knobs change the recipe and the preview tracks it', async ({ page }) => {
    await page.goto('/tools/css-effect-lab');
    await page.getByTestId('fx-tab-grain-gradient').click();

    const css = page.getByTestId('export-css');
    await expect(css).toContainText('baseFrequency');
    // grain scale 65 → baseFrequency 0.85. encodeURIComponent leaves the
    // single quotes literal and encodes = as %3D, so the URI carries
    // baseFrequency%3D'0.85'. Move the knob and the recipe changes.
    await expect(css).toContainText("baseFrequency%3D'0.85'");
    await page.getByTestId('knob-scale').fill('100');
    await expect(css).toContainText("baseFrequency%3D'1.20'");
    const styleText = await page
      .getByTestId('fx-style')
      .evaluate((el) => el.textContent ?? '');
    expect(styleText).toContain("baseFrequency%3D'1.20'");
  });

  test('honesty guarantee holds for the M3 effects', async ({ page }) => {
    await page.goto('/tools/css-effect-lab');

    for (const tab of ['fx-tab-spotlight', 'fx-tab-grain-gradient']) {
      await page.getByTestId(tab).click();
      const styleText = await page
        .getByTestId('fx-style')
        .evaluate((el) => el.textContent ?? '');
      const exportText = await page
        .getByTestId('export-css')
        .evaluate((el) => el.firstChild?.textContent ?? '');
      expect(styleText.length).toBeGreaterThan(0);
      expect(exportText).toBe(styleText);
    }
  });

  test('every effect declares no separate HTML (single-element, no markup)', async ({ page }) => {
    await page.goto('/tools/css-effect-lab');
    for (const tab of [
      'fx-tab-glow-border',
      'fx-tab-shape-shadow',
      'fx-tab-layered-glow',
      'fx-tab-gradient-border',
      'fx-tab-spotlight',
      'fx-tab-grain-gradient',
    ]) {
      await page.getByTestId(tab).click();
      await expect(page.getByTestId('export-html')).toContainText(
        'No special markup needed'
      );
    }
  });

  test('each export code section copies independently', async ({ page, context }) => {
    await grantClipboard(context);
    await page.goto('/tools/css-effect-lab');

    const btn = page.getByTestId('copy-css');
    await expect(btn).toHaveText('copy');
    await btn.click();
    await expect(btn).toHaveText('copied');

    await page.getByTestId('fx-tab-shape-shadow').click();
    const btn2 = page.getByTestId('copy-css');
    await expect(btn2).toHaveText('copy');
    await btn2.click();
    await expect(btn2).toHaveText('copied');
  });

  test('screenshot the tool page', async ({ page }, testInfo) => {
    await page.goto('/tools/css-effect-lab');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(800);
    await page.screenshot({
      path: `./screenshots/tool-css-effect-lab-m1-${testInfo.project.name}.png`,
      fullPage: true,
    });
  });

  test('screenshot layered glow', async ({ page }, testInfo) => {
    await page.goto('/tools/css-effect-lab');
    await page.getByTestId('fx-tab-layered-glow').click();
    await page.waitForTimeout(600);
    await page.screenshot({
      path: `./screenshots/tool-css-effect-lab-m2-layered-glow-${testInfo.project.name}.png`,
      fullPage: true,
    });
  });

  test('screenshot animated gradient border', async ({ page }, testInfo) => {
    await page.goto('/tools/css-effect-lab');
    await page.getByTestId('fx-tab-gradient-border').click();
    await page.waitForTimeout(600);
    await page.screenshot({
      path: `./screenshots/tool-css-effect-lab-m2-gradient-border-${testInfo.project.name}.png`,
      fullPage: true,
    });
  });

  test('screenshot spotlight', async ({ page }, testInfo) => {
    await page.goto('/tools/css-effect-lab');
    await page.getByTestId('fx-tab-spotlight').click();
    await page.waitForTimeout(600);
    await page.screenshot({
      path: `./screenshots/tool-css-effect-lab-m3-spotlight-${testInfo.project.name}.png`,
      fullPage: true,
    });
  });

  test('screenshot grain over gradient', async ({ page }, testInfo) => {
    await page.goto('/tools/css-effect-lab');
    await page.getByTestId('fx-tab-grain-gradient').click();
    await page.waitForTimeout(600);
    await page.screenshot({
      path: `./screenshots/tool-css-effect-lab-m3-grain-gradient-${testInfo.project.name}.png`,
      fullPage: true,
    });
  });
});

test.describe('CSS Effect Lab — mobile (no horizontal scroll)', () => {
  test.use({ viewport: { width: 375, height: 812 } });

  test('the stacked lab does not scroll the page sideways', async ({ page }) => {
    await page.goto('/tools/css-effect-lab');
    await page.waitForLoadState('networkidle');
    const { sw, cw } = await page.evaluate(() => ({
      sw: document.documentElement.scrollWidth,
      cw: document.documentElement.clientWidth,
    }));
    expect(sw).toBeLessThanOrEqual(cw + 1);
  });

  test('the code export still scrolls internally, not the page', async ({ page }) => {
    await page.goto('/tools/css-effect-lab');
    await page.getByTestId('fx-tab-layered-glow').click();
    await page.waitForTimeout(300);
    const r = await page.evaluate(() => {
      const de = document.documentElement;
      const code = document.querySelector('.lab__code-wrap [data-testid="export-css"], .lab__code-wrap .code, .lab__code-wrap pre');
      return {
        pageOverflow: de.scrollWidth - de.clientWidth,
        codeScrollsInternally: code ? code.scrollWidth > code.clientWidth : false,
      };
    });
    expect(r.pageOverflow).toBeLessThanOrEqual(1);
    expect(r.codeScrollsInternally).toBe(true);
  });
});
