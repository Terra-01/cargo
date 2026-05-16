/**
 * Pre-render the 25 look-picker thumbnails (23 Neat presets + Rainbow Warp +
 * Ether) by capturing the REAL shader output, so the picker can be used to
 * pick by sight (raw color-stop CSS swatches all collapse into similar
 * rainbows because Neat's presets share a house palette).
 *
 * It drives the actual tool in a real Chromium WebGL2 context via Playwright
 * (already a dependency) — the runtime's GL code is NOT stubbed. Every look is
 * settled to the SAME fixed wall-clock offset after a fresh page load so the
 * 25 frames form a coherent, reproducible grid. Procedural presets (Funky /
 * Fluid / Yex / Virus) regenerate their Canvas2D texture via the normal
 * live-tool path when the preset is applied.
 *
 * Re-runnable. Requires the dev server up:
 *     npm run dev            # in one terminal
 *     npm run thumbnails     # in another
 * Override the target with BASE_URL=... if needed.
 */
import { chromium } from 'playwright';
import type { Page } from 'playwright';
import { mkdir, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join } from 'node:path';

const BASE_URL = process.env.BASE_URL ?? 'http://localhost:3000';
const TOOL = `${BASE_URL}/tools/shader-gradient-lab`;
const OUT_DIR = join(process.cwd(), 'public', 'look-thumbnails');
const SETTLE_MS = 2600; // identical for every look → coherent set
const THUMB_W = 320;
const THUMB_H = 200;
const CURATED = ['rainbow-warp', 'ether'];

// goto + wait for React hydration. The look palette is an always-visible
// swatch grid now (no popover) — wait for it + at least one rendered tile
// (retry: the grid mounts only after hydration).
async function loadAndOpen(page: Page) {
  await page.goto(TOOL, { waitUntil: 'load' });
  await page.waitForLoadState('networkidle');
  await page.getByTestId('sg-canvas').waitFor();
  const grid = page.getByTestId('sg-look-grid');
  for (let attempt = 0; attempt < 6; attempt++) {
    try {
      await grid.waitFor({ timeout: 2000 });
      await page
        .locator('button[data-testid^="sg-look-preset-"]')
        .first()
        .waitFor({ timeout: 2000 });
      return;
    } catch {
      await page.waitForTimeout(500);
    }
  }
  throw new Error('look swatch grid never appeared');
}

async function main() {
  await mkdir(OUT_DIR, { recursive: true });
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });

  // Discover the preset ids from the running app (no TS/alias import needed).
  await loadAndOpen(page);
  const presetIds: string[] = await page.evaluate(() =>
    Array.from(
      document.querySelectorAll('button[data-testid^="sg-look-preset-"]')
    ).map((e) =>
      (e as HTMLElement).dataset.testid!.replace('sg-look-preset-', '')
    )
  );
  console.log(`discovered ${presetIds.length} presets + ${CURATED.length} shaders`);

  const looks: { id: string; kind: 'preset' | 'shader' }[] = [
    ...presetIds.map((id) => ({ id, kind: 'preset' as const })),
    ...CURATED.map((id) => ({ id, kind: 'shader' as const })),
  ];

  const force = process.env.FORCE === '1';
  for (const look of looks) {
    const outFile = join(OUT_DIR, `${look.id}.webp`);
    if (!force && existsSync(outFile)) {
      console.log(`· ${look.id}.webp (exists, skip — set FORCE=1 to rebuild)`);
      continue;
    }
    // Fresh load so every shader starts from t≈0 and settles by the same
    // fixed offset — deterministic, reproducible set.
    await loadAndOpen(page);
    const testid =
      look.kind === 'preset'
        ? `sg-look-preset-${look.id}`
        : `sg-look-shader-${look.id}`;
    const row = page.getByTestId(testid);
    await row.scrollIntoViewIfNeeded();
    await row.click({ timeout: 15000 });
    await page.waitForTimeout(SETTLE_MS);

    const dataUrl: string = await page.evaluate(
      ({ w, h }) => {
        const gl = document.querySelector(
          '[data-testid="sg-canvas"]'
        ) as HTMLCanvasElement;
        const c = document.createElement('canvas');
        c.width = w;
        c.height = h;
        const ctx = c.getContext('2d')!;
        ctx.drawImage(gl, 0, 0, w, h);
        return c.toDataURL('image/webp', 0.85);
      },
      { w: THUMB_W, h: THUMB_H }
    );
    const b64 = dataUrl.split(',')[1];
    await writeFile(outFile, Buffer.from(b64, 'base64'));
    console.log(`✓ ${look.id}.webp`);
  }

  await browser.close();
  console.log(`\nDone — ${looks.length} thumbnails written to ${OUT_DIR}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
