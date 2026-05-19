import { test, expect } from '@playwright/test';

// Phase-2 final verify milestone: the six surfaces the mobile audit
// classified "Fine" and no fix milestone touched. Re-checked here against
// the universal floor — by measuring AND (via the screenshot test) by
// looking, since a clipped element measures as zero overflow.

const SIX = [
  { id: 'home', route: '/' },
  { id: 'about', route: '/about' },
  { id: 'notes', route: '/notes' },
  { id: 'moodboard-library', route: '/tools/moodboard-library' },
  { id: 'loading-states', route: '/tools/loading-states' },
  { id: 'easing-cookbook', route: '/tools/easing-cookbook' },
];

// pageOver: horizontal page scroll. clip: elements that hide overflow while
// their content is wider than their box (intentional single-line ellipsis
// excluded — that is not a layout bug). min control box incl. any ::after
// hit-expander, over the unambiguous widget controls (status/progressbar/img
// roles are not tap targets and are excluded).
const floorScan = `(() => {
  const de = document.documentElement;
  let clip = 0;
  document.querySelectorAll('*').forEach((el) => {
    const cs = getComputedStyle(el);
    if (
      /hidden|clip/.test(cs.overflowX) &&
      cs.textOverflow !== 'ellipsis' &&
      el.scrollWidth > el.clientWidth + 1
    ) clip++;
  });
  let minH = Infinity, minW = Infinity, worstH = '', worstW = '';
  const sub = [];
  document
    .querySelectorAll('button, input, select, textarea, [role="button"], [role="tab"]')
    .forEach((el) => {
      const r = el.getBoundingClientRect();
      if (r.width === 0 || r.height === 0) return;
      const a = getComputedStyle(el, '::after');
      let exX = 0, exY = 0;
      if (a.position === 'absolute') {
        const t = parseFloat(a.top) || 0, b = parseFloat(a.bottom) || 0;
        const l = parseFloat(a.left) || 0, ri = parseFloat(a.right) || 0;
        exY = (t < 0 ? -t : 0) + (b < 0 ? -b : 0);
        exX = (l < 0 ? -l : 0) + (ri < 0 ? -ri : 0);
      }
      const h = r.height + exY, w = r.width + exX;
      const name = ((el.getAttribute('data-testid') || el.className || el.tagName) + '').slice(0, 40);
      if (h < minH) { minH = h; worstH = name; }
      if (w < minW) { minW = w; worstW = name; }
      if (h < 44 || w < 44) sub.push(name + ' ' + Math.round(w) + 'x' + Math.round(h));
    });
  return {
    pageOver: de.scrollWidth - de.clientWidth,
    clip,
    minH: minH === Infinity ? 999 : minH,
    minW: minW === Infinity ? 999 : minW,
    worstH,
    worstW,
    sub: [...new Set(sub)].slice(0, 12),
  };
})()`;

test.describe('Mobile verify — the six audit-Fine surfaces', () => {
  for (const { id, route } of SIX) {
    test(`${id} holds the universal floor at mobile (375)`, async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 812 });
      await page.goto(route);
      await page.waitForLoadState('networkidle');
      // Freeze animations: loading-states runs many infinite loader keyframes
      // whose mid-frame transforms transiently trip the clip scan. The floor
      // is a static-layout property, so a frozen frame is the honest check.
      await page.addStyleTag({
        content:
          '*, *::before, *::after { animation-play-state: paused !important; transition: none !important; }',
      });
      await page.waitForTimeout(200);
      const r = (await page.evaluate(floorScan)) as {
        pageOver: number; clip: number; minH: number; minW: number;
        worstH: string; worstW: string; sub: string[];
      };
      expect(r.pageOver, `${id} horizontal scroll`).toBeLessThanOrEqual(1);
      expect(r.clip, `${id} clipped elements`).toBe(0);
      expect(
        r.minH,
        `${id} min control height (${r.worstH}); sub-44: ${r.sub.join(', ')}`
      ).toBeGreaterThanOrEqual(44);
      expect(
        r.minW,
        `${id} min control width (${r.worstW}); sub-44: ${r.sub.join(', ')}`
      ).toBeGreaterThanOrEqual(44);
    });

    test(`${id} holds at tablet (768)`, async ({ page }) => {
      await page.setViewportSize({ width: 768, height: 1024 });
      await page.goto(route);
      await page.waitForLoadState('networkidle');
      await page.addStyleTag({
        content:
          '*, *::before, *::after { animation-play-state: paused !important; transition: none !important; }',
      });
      await page.waitForTimeout(200);
      const r = (await page.evaluate(floorScan)) as {
        pageOver: number; clip: number;
      };
      expect(r.pageOver, `${id} horizontal scroll`).toBeLessThanOrEqual(1);
      expect(r.clip, `${id} clipped elements`).toBe(0);
    });
  }

  test('screenshot the six Fine surfaces at mobile', async ({ page }, testInfo) => {
    await page.setViewportSize({ width: 375, height: 812 });
    for (const { id, route } of SIX) {
      await page.goto(route);
      await page.waitForLoadState('networkidle');
      await page.addStyleTag({
        content:
          '*, *::before, *::after { animation-play-state: paused !important; transition: none !important; }',
      });
      await page.waitForTimeout(250);
      await page.screenshot({
        path: `./screenshots/verify-${id}-${testInfo.project.name}.png`,
        fullPage: true,
      });
    }
  });
});
