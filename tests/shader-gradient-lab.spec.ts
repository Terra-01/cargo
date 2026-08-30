import { test, expect } from '@playwright/test';
import { readFile, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { watchConsoleErrors, realConsoleErrors } from './helpers/console-errors';
import { TOUCH_FLOOR_MIN } from './helpers/touch-target';
import { buildEmbedSnippet } from '../src/lib/standalone-export';
import { DEFAULT_CONFIG } from '../src/lib/shader-types';

const URL = '/tools/shader-gradient-lab';
const CURATED = ['rainbow-warp', 'ether'] as const;

// The look palette is an always-visible swatch grid (no dropdown). This just
// asserts it's present so existing call sites read clearly.
async function openLooks(page: import('@playwright/test').Page) {
  await expect(page.getByTestId('sg-look-grid')).toBeVisible();
}

// Open the dials modal (where ShaderControls now live).
async function openDials(page: import('@playwright/test').Page) {
  await page.getByTestId('sg-edit-dials').click();
  await expect(page.getByTestId('sg-dials-modal')).toBeVisible();
}

test.describe('Shader Gradient Lab tool', () => {
  test('renders without console errors', async ({ page }) => {
    const { errors } = watchConsoleErrors(page);
    await page.goto(URL);
    await page.waitForLoadState('networkidle');
    expect(realConsoleErrors(errors, [/webgl/i])).toEqual([]);
  });

  test('renders header with title and category', async ({ page }) => {
    await page.goto(URL);
    await expect(page.locator('.tool-page__title')).toContainText('Shader Gradient Lab');
    await expect(page.locator('.tool-page__eyebrow')).toContainText('visual_creator');
    await expect(page.locator('.tool-page__eyebrow')).toContainText('cargo/01');
  });

  test('topbar Tools link is active on this tool route', async ({ page }) => {
    await page.goto(URL);
    const toolsLink = page.locator('.topbar__nav a').first();
    await expect(toolsLink).toHaveClass(/is-active/);
  });

  // ---- canvas hero + glass toolbar ----

  test('canvas is the hero and a glass toolbar sits below it', async ({ page }) => {
    await page.goto(URL);
    await expect(page.getByTestId('sg-canvas')).toBeVisible();
    await expect(page.getByTestId('sg-toolbar')).toBeVisible();
    const canvasBox = await page.getByTestId('sg-canvas').boundingBox();
    const barBox = await page.getByTestId('sg-toolbar').boundingBox();
    expect(canvasBox && barBox && barBox.y > canvasBox.y).toBeTruthy();
  });

  test('canvas or fallback message renders', async ({ page }) => {
    await page.goto(URL);
    const hasCanvas = await page.getByTestId('sg-canvas').count();
    const hasError = await page.getByTestId('sg-error').count();
    expect(hasCanvas + hasError).toBeGreaterThan(0);
  });

  // ---- unified look-picker ----

  test('swatch grid marks the active look', async ({ page }) => {
    await page.goto(URL);
    await openLooks(page);
    // default look is Neat — surfaced as the active swatch
    await expect(page.getByTestId('sg-look-preset-neat')).toHaveAttribute(
      'data-active',
      'true'
    );
  });

  test('look-picker has 23 presets, 2 shaders and a divider', async ({ page }) => {
    await page.goto(URL);
    await openLooks(page);
    await expect(
      page.locator('button[data-testid^="sg-look-preset-"]')
    ).toHaveCount(23);
    await expect(page.getByTestId('sg-look-divider')).toBeVisible();
    for (const id of CURATED) {
      await expect(page.getByTestId(`sg-look-shader-${id}`)).toBeVisible();
    }
  });

  test('the grid leads with Rainbow Warp, Ether, Funky, Yex, Virus', async ({
    page,
  }) => {
    await page.goto(URL);
    await openLooks(page);
    const tiles = await page
      .locator('.sg-swatches__strip [data-testid^="sg-look-"]')
      .evaluateAll((els) =>
        els
          .map((e) => (e as HTMLElement).dataset.testid as string)
          .filter(
            (t) =>
              t.startsWith('sg-look-preset-') ||
              t.startsWith('sg-look-shader-')
          )
      );
    expect(tiles.slice(0, 5)).toEqual([
      'sg-look-shader-rainbow-warp',
      'sg-look-shader-ether',
      'sg-look-preset-funky',
      'sg-look-preset-yex',
      'sg-look-preset-virus',
    ]);
  });

  test('the 4 procedural presets are in the look-picker', async ({ page }) => {
    await page.goto(URL);
    await openLooks(page);
    for (const id of ['funky', 'fluid', 'yex', 'virus']) {
      await expect(page.getByTestId(`sg-look-preset-${id}`)).toBeVisible();
    }
  });

  test('picking a procedural preset (Virus) applies it', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (e) => errors.push(e.message));
    await page.goto(URL);
    await openLooks(page);
    await page.getByTestId('sg-look-preset-virus').click();
    await expect(page.getByTestId('sg-look-preset-virus')).toHaveAttribute(
      'data-active',
      'true'
    );
    await page.waitForTimeout(800);
    await expect(page.getByTestId('sg-canvas')).toBeVisible();
    await openDials(page);
    await expect(
      page.getByTestId('sg-enableProceduralTexture-toggle')
    ).toHaveAttribute('data-on', 'true');
    expect(realConsoleErrors(errors, [/webgl/i])).toEqual([]);
  });

  test('picking Ether switches the shader', async ({ page }) => {
    await page.goto(URL);
    await openLooks(page);
    await page.getByTestId('sg-look-shader-ether').click();
    await expect(page.getByTestId('sg-look-shader-ether')).toHaveAttribute(
      'data-active',
      'true'
    );
  });

  test('the preset palette is labelled "// Presets"', async ({ page }) => {
    await page.goto(URL);
    await expect(page.getByTestId('sg-look-grid')).toContainText('// Presets');
    await expect(page.getByTestId('sg-look-grid')).not.toContainText('// looks');
  });

  test('Funky / Yex / Virus / Ether default to resolution 0.70', async ({
    page,
  }) => {
    await page.goto(URL);
    for (const id of ['funky', 'yex', 'virus']) {
      await page.getByTestId(`sg-look-preset-${id}`).click();
      await openDials(page);
      await expect(page.getByTestId('sg-resolution-slider')).toHaveValue('0.7');
      await page.getByTestId('sg-dials-close').click();
    }
    // Rainbow Warp / Ether have no preset config — set on selection
    await page.getByTestId('sg-look-shader-ether').click();
    await openDials(page);
    await expect(page.getByTestId('sg-resolution-slider')).toHaveValue('0.7');
  });

  // ---- dials modal ----

  test('edit dials opens a glass modal over the live canvas', async ({ page }) => {
    await page.goto(URL);
    await openDials(page);
    // canvas still mounted/visible behind the translucent modal
    await expect(page.getByTestId('sg-canvas')).toBeVisible();
    await expect(page.getByTestId('sg-controls')).toBeVisible();
    await page.getByTestId('sg-dials-close').click();
    await expect(page.getByTestId('sg-dials-modal')).toHaveCount(0);
  });

  test('dials modal closes on Escape and on click-outside', async ({ page }) => {
    await page.goto(URL);
    await openDials(page);
    await page.keyboard.press('Escape');
    await expect(page.getByTestId('sg-dials-modal')).toHaveCount(0);
    await openDials(page);
    await page.getByTestId('sg-dials-backdrop').click({ position: { x: 8, y: 8 } });
    await expect(page.getByTestId('sg-dials-modal')).toHaveCount(0);
  });

  test('dial values persist across modal close/reopen', async ({ page }) => {
    await page.goto(URL);
    await openDials(page);
    const slider = page.getByTestId('sg-speed-slider');
    await slider.evaluate((el: HTMLInputElement) => {
      // React tracks the controlled value; use the native setter so the
      // synthetic onChange actually fires and config state updates.
      const desc = Object.getOwnPropertyDescriptor(
        HTMLInputElement.prototype,
        'value'
      );
      desc!.set!.call(el, '7');
      el.dispatchEvent(new Event('input', { bubbles: true }));
    });
    await page.getByTestId('sg-dials-close').click();
    await openDials(page);
    await expect(page.getByTestId('sg-speed-slider')).toHaveValue('7');
  });

  test('union dial model — neat greys only hueShift', async ({ page }) => {
    await page.goto(URL);
    await openDials(page);
    await expect(page.getByTestId('sg-control-hueShift')).toHaveAttribute('data-disabled', 'true');
    await expect(page.getByTestId('sg-control-waveAmplitude')).toHaveAttribute('data-disabled', 'false');
    await expect(page.getByTestId('sg-control-flowScale')).toHaveAttribute('data-disabled', 'false');
    await expect(page.getByTestId('sg-control-colors')).toHaveAttribute('data-disabled', 'false');
    await expect(page.getByTestId('sg-control-enableProceduralTexture')).toHaveAttribute('data-disabled', 'false');
  });

  test('union dial model — Ether greys the Neat-only dials', async ({ page }) => {
    await page.goto(URL);
    await openLooks(page);
    await page.getByTestId('sg-look-shader-ether').click();
    await openDials(page);
    for (const f of ['waveAmplitude', 'flowScale', 'colorBlending', 'enableProceduralTexture', 'textureSeed', 'mouseDecayRate']) {
      await expect(page.getByTestId(`sg-control-${f}`)).toHaveAttribute('data-disabled', 'true');
    }
    for (const f of ['speed', 'hueShift', 'grainIntensity']) {
      await expect(page.getByTestId(`sg-control-${f}`)).toHaveAttribute('data-disabled', 'false');
    }
  });

  test('mouseDecayRate dial lives in the Mouse group', async ({ page }) => {
    await page.goto(URL);
    await openDials(page);
    const mouseGroup = page.locator(
      '.sg-group:has([data-testid="sg-control-mouseDistortionStrength"])'
    );
    await expect(mouseGroup.getByTestId('sg-control-mouseDecayRate')).toBeVisible();
  });

  // ---- text overlay (inline content + styling popover) ----

  test('inline toolbar text input edits the overlay live (no modal)', async ({ page }) => {
    await page.goto(URL);
    await expect(page.getByTestId('sg-text-overlay')).toHaveCount(0);
    await page.getByTestId('sg-text-input').fill('Hello Cargo');
    await expect(page.getByTestId('sg-text-overlay')).toBeVisible();
    await expect(page.getByTestId('sg-text-overlay')).toContainText('Hello Cargo');
  });

  test('Aa popover holds the text styling controls', async ({ page }) => {
    await page.goto(URL);
    await page.getByTestId('sg-text-style-trigger').click();
    await expect(page.getByTestId('sg-text-style-popover')).toBeVisible();
    for (const t of ['sg-text-font', 'sg-text-size-slider', 'sg-text-bold', 'sg-text-italic', 'sg-text-underline', 'sg-text-color', 'sg-text-position', 'sg-text-shadow']) {
      await expect(page.getByTestId(t)).toBeVisible();
    }
    await page.getByTestId('sg-text-bold').click();
    await expect(page.getByTestId('sg-text-bold')).toHaveAttribute('data-on', 'true');
  });

  test('text overlay survives a look switch', async ({ page }) => {
    await page.goto(URL);
    await page.getByTestId('sg-text-input').fill('Persist');
    await openLooks(page);
    await page.getByTestId('sg-look-preset-flame').click();
    await expect(page.getByTestId('sg-text-overlay')).toContainText('Persist');
  });

  // ---- FPS, export ----

  test('FPS counter is a clean read-only live indicator', async ({ page }) => {
    await page.goto(URL);
    await page.waitForTimeout(1300);
    const fps = page.getByTestId('sg-fps');
    await expect(fps).toContainText('fps');
    await expect(fps).toContainText(/\d/);
    // no min/max controls or readout anymore
    await expect(fps).not.toContainText('▲');
    await expect(fps).not.toContainText('▼');
  });

  test('FPS counter is a fixed-width box on the far right of the toolbar', async ({
    page,
  }) => {
    await page.goto(URL);
    await page.waitForTimeout(1200);
    const fpsBox = await page.getByTestId('sg-fps').boundingBox();
    const exportJson = await page.getByTestId('sg-export-json').boundingBox();
    const toolbar = await page.getByTestId('sg-toolbar').boundingBox();
    // sits to the right of the action buttons, near the toolbar's right edge
    expect(fpsBox!.x).toBeGreaterThan(exportJson!.x + exportJson!.width);
    expect(toolbar!.x + toolbar!.width - (fpsBox!.x + fpsBox!.width)).toBeLessThan(
      40
    );
    // 4-digit-optimised: width holds whether the value is 1 or 4 digits
    const minW = await page
      .getByTestId('sg-fps')
      .evaluate((el) => parseFloat(getComputedStyle(el).minWidth));
    expect(minW).toBeGreaterThanOrEqual(88);
  });

  test('the Hide UI control is fully removed', async ({ page }) => {
    await page.goto(URL);
    await expect(page.getByTestId('sg-toolbar')).toBeVisible();
    await expect(page.getByTestId('sg-hide-ui')).toHaveCount(0);
    await expect(page.getByTestId('sg-show-ui')).toHaveCount(0);
  });

  test('export actions are present and Import is fully gone', async ({ page }) => {
    await page.goto(URL);
    await expect(page.getByTestId('sg-download')).toBeVisible();
    await expect(page.getByTestId('sg-export-html')).toBeVisible();
    await expect(page.getByTestId('sg-copy-snippet')).toBeVisible();
    await expect(page.getByTestId('sg-export-json')).toBeVisible();
    // Import removed completely — no button, label, or hidden file input
    await expect(page.getByTestId('sg-import-json')).toHaveCount(0);
    await expect(page.getByTestId('sg-import-json-input')).toHaveCount(0);
    await expect(page.locator('input[type="file"]')).toHaveCount(0);
    // Copy Snippet sits to the LEFT of Export HTML in the action group
    const order = await page
      .locator('[data-testid="sg-copy-snippet"], [data-testid="sg-export-html"]')
      .evaluateAll((els) =>
        els.map((e) => (e as HTMLElement).dataset.testid)
      );
    expect(order).toEqual(['sg-copy-snippet', 'sg-export-html']);
  });

  test('Copy Snippet shows a confirmation', async ({ page }) => {
    await page.goto(URL);
    const btn = page.getByTestId('sg-copy-snippet');
    await expect(btn).toHaveText('Copy Snippet');
    await btn.click();

    // The label and the attribute both flip off the same state and reset
    // together after 1600ms (BottomToolbar.tsx). Asserting them one after the
    // other lets a slow runner spend most of that window on the first
    // assertion and then read the already-reset value in the second — which is
    // exactly how this failed on CI. Read both in a single evaluation so there
    // is no window between them to straddle.
    await expect
      .poll(() =>
        btn.evaluate(
          (el) => `${el.textContent?.trim()}|${el.getAttribute('data-copied')}`
        )
      )
      .toBe('Copied!|true');
  });

  test('embeddable snippet is guest-safe and renders in a host page', async ({ page }, testInfo) => {
    const snippet = buildEmbedSnippet('neat-gradient', DEFAULT_CONFIG);

    // zero-dep / Firefox-safe / attribution markers in the generated text
    expect(snippet).toContain('data-cargo-gradient');
    expect(snippet).toContain('attachShadow');
    expect(snippet).toContain('#version 300 es');
    expect(snippet).toContain('precision highp int;');
    expect(snippet).toContain('Neat'); // attribution
    expect(snippet).not.toContain('fontshare.com');
    expect(snippet).not.toContain('http://');
    expect(snippet).not.toContain('https://cdn');

    const http: string[] = [];
    const cerr: string[] = [];
    page.on('request', (r) => { if (r.url().startsWith('http')) http.push(r.url()); });
    page.on('console', (m) => { if (m.type() === 'error') cerr.push(m.text()); });
    page.on('pageerror', (e) => cerr.push('PAGEERROR ' + e.message));

    // Host page with its OWN content + bare element styles; snippet pasted
    // TWICE. Must be a real navigation (file://) — page.setContent injects
    // scripts via innerHTML which the HTML spec does NOT execute.
    const hostHtml =
      `<!DOCTYPE html><html><head><meta charset="utf-8"><style>` +
      `p{color:rgb(0,128,0)}div{outline:4px solid rgb(255,0,0)}canvas{border:9px solid rgb(0,0,255)}` +
      `</style></head><body><p id="hp">HOST</p><div id="hd">host</div>` +
      `${snippet}<hr>${snippet}</body></html>`;
    const file = join(
      tmpdir(),
      `cargo-embed-${testInfo.project.name}-${Date.now()}.html`
    );
    await writeFile(file, hostHtml);
    await page.goto('file://' + file);
    await page.waitForTimeout(2000);

    const res = await page.evaluate(() => {
      const hosts = Array.from(document.querySelectorAll('[data-cargo-gradient]'));
      const canvases = hosts.map(
        (h) => !!(h as Element & { shadowRoot: ShadowRoot | null }).shadowRoot?.querySelector('canvas')
      );
      return {
        count: hosts.length,
        canvases,
        hostP: getComputedStyle(document.getElementById('hp')!).color,
        hostD: getComputedStyle(document.getElementById('hd')!).outlineColor,
      };
    });
    expect(res.count).toBe(2); // pasted twice, both present
    expect(res.canvases).toEqual([true, true]); // both rendered into their shadow root
    expect(res.hostP).toBe('rgb(0, 128, 0)'); // host CSS undisturbed
    expect(res.hostD).toBe('rgb(255, 0, 0)');
    expect(http).toEqual([]); // zero network
    const real = cerr.filter((e) => !e.toLowerCase().includes('webgl'));
    expect(real).toEqual([]); // zero console errors
  });

  test('look-picker rows use pre-rendered thumbnail images', async ({ page }) => {
    await page.goto(URL);
    await openLooks(page);
    const img = page.locator(
      'button[data-testid="sg-look-preset-virus"] img'
    );
    await expect(img).toHaveAttribute('src', /\/look-thumbnails\/virus\.webp/);
    await expect(img).toHaveAttribute('loading', 'lazy');
  });

  test('Export HTML downloads a self-contained .html', async ({ page }) => {
    await page.goto(URL);
    const [dl] = await Promise.all([
      page.waitForEvent('download'),
      page.getByTestId('sg-export-html').click(),
    ]);
    expect(dl.suggestedFilename()).toMatch(/\.html$/);
    const stream = await dl.createReadStream();
    const chunks: Buffer[] = [];
    for await (const ch of stream) chunks.push(ch as Buffer);
    const html = Buffer.concat(chunks).toString('utf8');
    expect(html).toContain('<!DOCTYPE html>');
    expect(html).toContain('var CONFIG =');
    expect(html).toContain('EXPORTED LOOK'); // editable config block header
    expect(html).toContain('#version 300 es'); // inlined GLSL, Firefox-safe
    expect(html).toContain('precision highp int;');
    expect(html).toContain('Neat'); // attribution header
    expect(html).not.toContain('fontshare.com');
    expect(html).not.toContain('http://');
  });

  test('Export JSON downloads a valid serialised config', async ({ page }) => {
    await page.goto(URL);
    // change a dial so the look is distinct from default
    await openDials(page);
    await page.getByTestId('sg-speed-slider').evaluate((el: HTMLInputElement) => {
      const d = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value');
      d!.set!.call(el, '9');
      el.dispatchEvent(new Event('input', { bubbles: true }));
    });
    await page.keyboard.press('Escape');
    const [dl] = await Promise.all([
      page.waitForEvent('download'),
      page.getByTestId('sg-export-json').click(),
    ]);
    expect(dl.suggestedFilename()).toMatch(/\.json$/);
    const path = await dl.path();
    const data = JSON.parse(await readFile(path!, 'utf8'));
    expect(data.version).toBe(1);
    expect(data.shaderId).toBe('neat-gradient');
    expect(data.config.speed).toBe(9);
    expect(data.config).toHaveProperty('textOverlay');
  });

  test('back link returns to the hub', async ({ page }) => {
    await page.goto(URL);
    await page.waitForLoadState('networkidle');
    await page.locator('.tool-page__back').click();
    await page.waitForURL('/');
    await expect(page.locator('.hero__title')).toBeVisible();
  });

  // ---- no-regression: mouse trail still works ----

  test('neat shader renders without console errors after mouse movement', async ({ page }) => {
    const { errors } = watchConsoleErrors(page);
    await page.goto(URL);
    await page.waitForLoadState('networkidle');
    await openDials(page);
    await page.getByTestId('sg-mouseDistortionStrength-slider').evaluate(
      (el: HTMLInputElement) => {
        el.value = '0.6';
        el.dispatchEvent(new Event('input', { bubbles: true }));
      }
    );
    await page.keyboard.press('Escape'); // close modal so the canvas gets the pointer
    await expect(page.getByTestId('sg-dials-modal')).toHaveCount(0);
    const box = await page.getByTestId('sg-canvas').boundingBox();
    if (box) {
      for (let i = 0; i < 12; i++) {
        await page.mouse.move(
          box.x + (box.width * (i + 1)) / 14,
          box.y + box.height / 2 + Math.sin(i) * 30
        );
        await page.waitForTimeout(20);
      }
    }
    await page.waitForTimeout(700);
    await expect(page.getByTestId('sg-canvas')).toBeVisible();
    await expect(page.getByTestId('sg-error')).toHaveCount(0);
    expect(realConsoleErrors(errors, [/webgl/i])).toEqual([]);
  });

  // ---- screenshots (redesign) ----

  test('screenshot the tool page', async ({ page }, testInfo) => {
    await page.goto(URL);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);
    await page.screenshot({
      path: `./screenshots/tool-shader-gradient-lab-redesign-${testInfo.project.name}.png`,
      fullPage: true,
    });
  });

  test('screenshot the dials modal over the gradient', async ({ page }, testInfo) => {
    await page.goto(URL);
    await page.waitForTimeout(900);
    await openDials(page);
    await page.waitForTimeout(400);
    await page.screenshot({
      path: `./screenshots/shader-dials-modal-redesign-${testInfo.project.name}.png`,
      fullPage: true,
    });
  });

  test('screenshot the swatch grid palette', async ({ page }, testInfo) => {
    await page.goto(URL);
    await page.waitForTimeout(700);
    await openLooks(page);
    await page.waitForTimeout(300);
    await page.screenshot({
      path: `./screenshots/shader-look-picker-redesign-${testInfo.project.name}.png`,
      fullPage: true,
    });
  });

  test('screenshot the clean canvas frame', async ({ page }, testInfo) => {
    await page.goto(URL);
    await page.waitForTimeout(900);
    await page.getByTestId('sg-canvas').screenshot({
      path: `./screenshots/shader-hide-ui-redesign-${testInfo.project.name}.png`,
    });
  });

  test('screenshot a procedural preset (Virus)', async ({ page }, testInfo) => {
    await page.goto(URL);
    await openLooks(page);
    await page.getByTestId('sg-look-preset-virus').click();
    await page.waitForTimeout(1200);
    await page.getByTestId('sg-canvas').screenshot({
      path: `./screenshots/shader-neat-procedural-redesign-${testInfo.project.name}.png`,
    });
  });

  for (const id of ['neat-gradient', ...CURATED] as const) {
    test(`renders ${id} without console errors`, async ({ page }) => {
      const errors: string[] = [];
      page.on('pageerror', (e) => errors.push(e.message));
      await page.goto(URL);
      if (id !== 'neat-gradient') {
        await openLooks(page);
        await page.getByTestId(`sg-look-shader-${id}`).click();
      }
      await page.waitForTimeout(900);
      expect(realConsoleErrors(errors, [/webgl/i])).toEqual([]);
    });

    test(`screenshot ${id} default state`, async ({ page }, testInfo) => {
      await page.goto(URL);
      if (id !== 'neat-gradient') {
        await openLooks(page);
        await page.getByTestId(`sg-look-shader-${id}`).click();
      }
      await page.waitForTimeout(1100);
      await page.getByTestId('sg-canvas').screenshot({
        path: `./screenshots/shader-${id}-redesign-${testInfo.project.name}.png`,
      });
    });
  }
});

test.describe('Shader Gradient Lab — touch-target sizing', () => {
  test.use({ viewport: { width: 375, height: 812 } });

  test('toolbar buttons, text input and back link meet the 44px floor', async ({ page }) => {
    await page.goto('/tools/shader-gradient-lab');
    // The back link keeps its visual size but expands its tap area with an
    // invisible ::after (a min-height would grow very tall pages past
    // Firefox's screenshot limit). Assert the effective tappable area =
    // the visible box plus the ::after's negative top/bottom insets.
    const backTap = await page.evaluate(() => {
      const el = document.querySelector('.tool-page__back');
      if (!el) return 0;
      const r = el.getBoundingClientRect();
      const a = getComputedStyle(el, '::after');
      const top = Math.abs(parseFloat(a.top) || 0);
      const bottom = Math.abs(parseFloat(a.bottom) || 0);
      return r.height + top + bottom;
    });
    expect(backTap).toBeGreaterThanOrEqual(TOUCH_FLOOR_MIN);
    const text = await page.getByTestId('sg-text-input').boundingBox();
    expect(text!.height).toBeGreaterThanOrEqual(TOUCH_FLOOR_MIN);
    const btns = page.locator('.sg-toolbar__btn');
    const n = await btns.count();
    for (let i = 0; i < n; i++) {
      const b = await btns.nth(i).boundingBox();
      expect(b!.height).toBeGreaterThanOrEqual(TOUCH_FLOOR_MIN);
    }
  });

  test('dials-modal controls meet the 44px floor', async ({ page }) => {
    await page.goto('/tools/shader-gradient-lab');
    await page.getByTestId('sg-edit-dials').click();
    await expect(page.getByTestId('sg-dials-modal')).toBeVisible();
    const close = await page.getByTestId('sg-dials-close').boundingBox();
    expect(close!.height).toBeGreaterThanOrEqual(TOUCH_FLOOR_MIN);
    expect(close!.width).toBeGreaterThanOrEqual(TOUCH_FLOOR_MIN);
    const sub = await page.evaluate(() => {
      const modal = document.querySelector('.sg-modal');
      if (!modal) return -1;
      let min = 999;
      modal.querySelectorAll('button, input, select').forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.width > 0 && r.height > 0) min = Math.min(min, r.height);
      });
      return min;
    });
    expect(sub).toBeGreaterThanOrEqual(TOUCH_FLOOR_MIN);
  });
});
