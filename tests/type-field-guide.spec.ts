import { test, expect } from '@playwright/test';
import { watchConsoleErrors, realConsoleErrors } from './helpers/console-errors';

const ROUTE = '/tools/type-field-guide';

// Reads the resolved line-height / font-size ratio of the demo paragraph.
// The paragraph sets an inline unitless line-height; getComputedStyle
// reports it in px, so we divide back out to compare against the presets.
async function paragraphRatio(page: import('@playwright/test').Page) {
  return page.getByTestId('lh-paragraph').evaluate((el) => {
    const cs = getComputedStyle(el);
    return parseFloat(cs.lineHeight) / parseFloat(cs.fontSize);
  });
}

test.describe('The Type Field Guide', () => {
  test('renders without console errors', async ({ page }) => {
    const { errors } = watchConsoleErrors(page);
    await page.goto(ROUTE);
    await page.waitForLoadState('networkidle');
    expect(realConsoleErrors(errors)).toEqual([]);
  });

  test('route loads without 404', async ({ page }) => {
    const res = await page.goto(ROUTE);
    expect(res?.status()).toBeLessThan(400);
  });

  test('the old /tools/type-scale route no longer exists', async ({ page }) => {
    const res = await page.goto('/tools/type-scale');
    expect(res?.status()).toBe(404);
  });

  test('renders header with new title and category', async ({ page }) => {
    await page.goto(ROUTE);
    await expect(page.locator('.tool-page__title')).toHaveText('The Type Field Guide');
    await expect(page.locator('.tool-page__eyebrow')).toContainText('learning_tools');
    await expect(page.locator('.tool-page__eyebrow')).toContainText('cargo/05');
    await expect(page.locator('.tool-page__desc')).toContainText(
      'Six things worth knowing about type on the web'
    );
  });

  test('topbar Tools link is active on this tool route', async ({ page }) => {
    await page.goto(ROUTE);
    const toolsLink = page.locator('.topbar__nav a').first();
    await expect(toolsLink).toHaveClass(/is-active/);
  });

  test('intro section renders the framing copy', async ({ page }) => {
    await page.goto(ROUTE);
    const intro = page.locator('.tfg-intro');
    await expect(intro).toContainText('Typography is a deep subject');
    await expect(intro).toContainText('20 percent that fixes 80 percent');
  });

  test('closing section renders with both real external links', async ({ page }) => {
    await page.goto(ROUTE);
    const closer = page.locator('.tfg-closer');
    await expect(closer).toContainText('That is the essentials.');
    const better = closer.getByRole('link', { name: 'Better Web Type' });
    const practical = closer.getByRole('link', { name: 'Practical Typography' });
    await expect(better).toHaveAttribute('href', 'https://betterwebtype.com/');
    await expect(practical).toHaveAttribute('href', 'https://practicaltypography.com/');
  });

  test('metadata title uses the em dash separator', async ({ page }) => {
    await page.goto(ROUTE);
    await expect(page).toHaveTitle('The Type Field Guide — Cargo');
  });

  // M3 (final): the guide is now complete. This test has tracked the concept
  // count across milestones (1 → 3 → 6); it now asserts all six concepts and
  // their full reading order.
  test('all six concepts render in reading order, then the closer', async ({ page }) => {
    await page.goto(ROUTE);
    const concepts = page.locator('.tfg-concept');
    await expect(concepts).toHaveCount(6);

    const eyebrows = page.locator('.tfg-concept__eyebrow');
    await expect(eyebrows.nth(0)).toHaveText('// type scale');
    await expect(eyebrows.nth(1)).toHaveText('// line height');
    await expect(eyebrows.nth(2)).toHaveText('// line length');
    await expect(eyebrows.nth(3)).toHaveText('// hierarchy');
    await expect(eyebrows.nth(4)).toHaveText('// letter spacing');
    await expect(eyebrows.nth(5)).toHaveText('// web fonts');

    const headings = page.locator('.tfg-concept__heading');
    await expect(headings.nth(0)).toHaveText('The type scale');
    await expect(headings.nth(1)).toHaveText('Line height');
    await expect(headings.nth(2)).toHaveText('Line length');
    await expect(headings.nth(3)).toHaveText('Hierarchy');
    await expect(headings.nth(4)).toHaveText('Letter spacing');
    await expect(headings.nth(5)).toHaveText('Web fonts');

    // Web fonts is the final concept, directly above the closer.
    await expect(page.locator('.tfg-closer')).toContainText('That is the essentials.');
  });

  // M2's guard test asserted hierarchy / letter spacing / web fonts were
  // absent. M3 builds them, so it is inverted: they must now be present.
  test('the final three concepts are present (M2 absence guard inverted)', async ({ page }) => {
    await page.goto(ROUTE);
    const text = (await page.locator('.tfg-concept__eyebrow').allTextContents()).join(' ');
    expect(text).toContain('hierarchy');
    expect(text).toContain('letter spacing');
    expect(text).toContain('web fonts');
  });

  test('line-height demo renders a real multi-sentence paragraph', async ({ page }) => {
    await page.goto(ROUTE);
    const para = page.getByTestId('lh-paragraph');
    await expect(para).toBeVisible();
    await expect(para).toContainText('Good typography is mostly invisible.');
  });

  test('default state is the comfortable judgment', async ({ page }) => {
    await page.goto(ROUTE);
    await expect(page.getByTestId('lh-judgment')).toHaveText('comfortable');
    await expect(page.getByTestId('lh-value')).toContainText('1.50');
  });

  test('the three labeled states are all present and labeled', async ({ page }) => {
    await page.goto(ROUTE);
    await expect(page.getByTestId('lh-state-tight')).toHaveText('too tight');
    await expect(page.getByTestId('lh-state-comfortable')).toHaveText('comfortable');
    await expect(page.getByTestId('lh-state-loose')).toHaveText('too loose');
  });

  test('moving between the three states visibly changes the paragraph', async ({ page }) => {
    await page.goto(ROUTE);

    await page.getByTestId('lh-state-tight').click();
    await expect(page.getByTestId('lh-judgment')).toHaveText('too tight');
    await expect(page.getByTestId('lh-value')).toContainText('1.15');
    const tight = await paragraphRatio(page);
    expect(tight).toBeCloseTo(1.15, 1);

    await page.getByTestId('lh-state-comfortable').click();
    await expect(page.getByTestId('lh-judgment')).toHaveText('comfortable');
    await expect(page.getByTestId('lh-value')).toContainText('1.50');
    const comfortable = await paragraphRatio(page);
    expect(comfortable).toBeCloseTo(1.5, 1);

    await page.getByTestId('lh-state-loose').click();
    await expect(page.getByTestId('lh-judgment')).toHaveText('too loose');
    await expect(page.getByTestId('lh-value')).toContainText('2.20');
    const loose = await paragraphRatio(page);
    expect(loose).toBeCloseTo(2.2, 1);

    // The aha: the wrong states sit visibly on either side of the right one.
    expect(tight).toBeLessThan(comfortable);
    expect(comfortable).toBeLessThan(loose);
  });

  test('the slider moves freely and the judgment follows the value', async ({ page }) => {
    await page.goto(ROUTE);
    const slider = page.getByTestId('lh-slider');
    await expect(slider).toBeVisible();

    await slider.fill('1');
    await expect(page.getByTestId('lh-judgment')).toHaveText('too tight');

    await slider.fill('1.55');
    await expect(page.getByTestId('lh-judgment')).toHaveText('comfortable');

    await slider.fill('2.4');
    await expect(page.getByTestId('lh-judgment')).toHaveText('too loose');
  });

  // — Type scale concept (M2) —

  test('type-scale demo renders the mock page fragment', async ({ page }) => {
    await page.goto(ROUTE);
    const stage = page.getByTestId('ts-stage');
    await expect(stage).toBeVisible();
    await expect(page.getByTestId('ts-headline')).toHaveText(
      'Build the thing you wish existed.'
    );
  });

  test('type-scale aha: tight vs wide change the page character, body stays fixed', async ({ page }) => {
    await page.goto(ROUTE);

    const fontSize = (testId: string) =>
      page.getByTestId(testId).evaluate((el) => parseFloat(getComputedStyle(el).fontSize));

    await page.getByTestId('ts-state-tight').click();
    await expect(page.getByTestId('ts-judgment')).toContainText('dense UI');
    const tightHeadline = await fontSize('ts-headline');
    const tightBody = await fontSize('ts-body');

    await page.getByTestId('ts-state-wide').click();
    await expect(page.getByTestId('ts-judgment')).toContainText('landing page');
    const wideHeadline = await fontSize('ts-headline');
    const wideBody = await fontSize('ts-body');

    // The aha: same content, the headline grows dramatically with a wider
    // ratio while the body you actually read does not move at all.
    expect(wideHeadline).toBeGreaterThan(tightHeadline + 10);
    expect(tightBody).toBeCloseTo(16, 0);
    expect(wideBody).toBeCloseTo(16, 0);
  });

  test('type-scale free ratio control re-renders the value live', async ({ page }) => {
    await page.goto(ROUTE);
    const slider = page.getByTestId('ts-slider');
    await slider.fill('0');
    await expect(page.getByTestId('ts-value')).toContainText('Major Second');
    await slider.fill('8');
    await expect(page.getByTestId('ts-value')).toContainText('Major Sixth');
  });

  test('type-scale copy button is secondary and confirms on click', async ({ page }) => {
    await page.goto(ROUTE);
    const btn = page.getByTestId('ts-copy');
    await expect(btn).toHaveText('copy CSS');
    await btn.click();
    await expect(btn).toHaveText('copied');
  });

  // — Line length concept (M2) —

  const cpl = (page: import('@playwright/test').Page) =>
    page.getByTestId('ll-count').evaluate((el) => Number(el.getAttribute('data-cpl')));

  test('line-length demo renders a long real paragraph', async ({ page }) => {
    await page.goto(ROUTE);
    const para = page.getByTestId('ll-paragraph');
    await expect(para).toBeVisible();
    await expect(para).toContainText('Reading is a physical act.');
  });

  test('line-length aha: the character count is central and the judgment flips at the band edges', async ({ page }) => {
    await page.goto(ROUTE);

    await page.getByTestId('ll-state-narrow').click();
    await expect(page.getByTestId('ll-judgment')).toContainText('too narrow');
    const narrow = await cpl(page);
    expect(narrow).toBeLessThan(45);

    await page.getByTestId('ll-state-comfortable').click();
    await expect(page.getByTestId('ll-judgment')).toHaveText('comfortable');
    const comfortable = await cpl(page);
    expect(comfortable).toBeGreaterThanOrEqual(45);
    expect(comfortable).toBeLessThanOrEqual(75);

    await page.getByTestId('ll-state-wide').click();
    await expect(page.getByTestId('ll-judgment')).toContainText('too wide');
    const wide = await cpl(page);
    expect(wide).toBeGreaterThan(75);

    // The count moves monotonically with width: narrow < comfortable < wide.
    expect(narrow).toBeLessThan(comfortable);
    expect(comfortable).toBeLessThan(wide);
  });

  test('line-length slider moves freely and the judgment follows the width', async ({ page }) => {
    await page.goto(ROUTE);
    const slider = page.getByTestId('ll-slider');
    await expect(slider).toBeVisible();

    await slider.fill('220');
    await expect(page.getByTestId('ll-judgment')).toContainText('too narrow');

    await slider.fill('940');
    await expect(page.getByTestId('ll-judgment')).toContainText('too wide');
  });

  // — Hierarchy concept (M3) —

  test('hierarchy demo renders the mock block', async ({ page }) => {
    await page.goto(ROUTE);
    await expect(page.getByTestId('hi-demo')).toBeVisible();
    await expect(page.getByTestId('hi-heading')).toHaveText('How people read a page');
  });

  test('hierarchy aha: both failure modes are labeled, and the squint test blurs the block', async ({ page }) => {
    await page.goto(ROUTE);

    const headingFont = () =>
      page.getByTestId('hi-heading').evaluate((el) => {
        const cs = getComputedStyle(el);
        return { size: parseFloat(cs.fontSize), weight: Number(cs.fontWeight) };
      });

    await page.getByTestId('hi-state-flat').click();
    await expect(page.getByTestId('hi-judgment')).toContainText('nothing leads the eye');
    const flat = await headingFont();

    await page.getByTestId('hi-state-shouting').click();
    await expect(page.getByTestId('hi-judgment')).toContainText('everything competes');
    const shouting = await headingFont();

    await page.getByTestId('hi-state-balanced').click();
    await expect(page.getByTestId('hi-judgment')).toContainText('the eye knows where to go');

    // The aha: the failure modes are real, not just labels. Flat collapses
    // the heading toward body size/weight; shouting blows it up.
    expect(shouting.size).toBeGreaterThan(flat.size + 20);
    expect(flat.weight).toBeLessThanOrEqual(shouting.weight - 100);

    // The squint test: blur is the payoff. Off → none, on → blurred.
    const filterNow = () =>
      page.getByTestId('hi-stage').evaluate((el) => getComputedStyle(el).filter);
    expect(await filterNow()).toBe('none');
    await page.getByTestId('hi-squint').click();
    expect(await filterNow()).toContain('blur');
    await page.getByTestId('hi-squint').click();
    expect(await filterNow()).toBe('none');
  });

  test('hierarchy size and weight sliders move freely', async ({ page }) => {
    await page.goto(ROUTE);
    await page.getByTestId('hi-size-slider').fill('2.1');
    await page.getByTestId('hi-weight-slider').fill('300');
    await expect(page.getByTestId('hi-judgment')).toContainText('everything competes');
    await page.getByTestId('hi-size-slider').fill('1');
    await page.getByTestId('hi-weight-slider').fill('0');
    await expect(page.getByTestId('hi-judgment')).toContainText('nothing leads the eye');
  });

  // — Letter spacing concept (M3) —

  test('letter-spacing demo renders both samples', async ({ page }) => {
    await page.goto(ROUTE);
    await expect(page.getByTestId('ls-heading-sample')).toHaveText('Tighten this headline');
    await expect(page.getByTestId('ls-label-sample')).toHaveText('Filed under typography');
  });

  test('letter-spacing aha: heading tightens negative, label loosens positive (opposite directions)', async ({ page }) => {
    await page.goto(ROUTE);

    const ls = (testId: string) =>
      page.getByTestId(testId).evaluate((el) => parseFloat(getComputedStyle(el).letterSpacing) || 0);

    // Defaults sit at zero.
    await page.getByTestId('ls-heading-default').click();
    await page.getByTestId('ls-label-default').click();
    expect(await ls('ls-heading-sample')).toBeCloseTo(0, 1);
    expect(await ls('ls-label-sample')).toBeCloseTo(0, 1);

    // Improved pulls the two opposite ways: heading tighter (negative),
    // small label looser (positive). That opposite sign is the whole lesson.
    await page.getByTestId('ls-heading-improved').click();
    await page.getByTestId('ls-label-improved').click();
    const headingLS = await ls('ls-heading-sample');
    const labelLS = await ls('ls-label-sample');
    expect(headingLS).toBeLessThan(0);
    expect(labelLS).toBeGreaterThan(0);
    expect(headingLS).toBeLessThan(labelLS);
  });

  test('letter-spacing sliders move freely in both directions', async ({ page }) => {
    await page.goto(ROUTE);
    await page.getByTestId('ls-heading-slider').fill('-0.06');
    await expect(page.getByTestId('ls-heading-value')).toContainText('-0.060em');
    await page.getByTestId('ls-label-slider').fill('0.22');
    await expect(page.getByTestId('ls-label-value')).toContainText('0.220em');
  });

  // — Web fonts concept (M3, the load-replay simulation) —

  test('web-fonts demo renders two panels at rest in the real font', async ({ page }) => {
    await page.goto(ROUTE);
    await expect(page.getByTestId('wf-demo')).toHaveAttribute('data-loading', 'false');
    await expect(page.getByTestId('wf-swap-text')).toBeVisible();
    await expect(page.getByTestId('wf-block-text')).toBeVisible();
    await expect(page.getByTestId('wf-swap')).toHaveAttribute('data-state', 'real');
    await expect(page.getByTestId('wf-block')).toHaveAttribute('data-state', 'real');
  });

  test('web-fonts aha: during the load window swap is readable and block is a blank gap, then both settle', async ({ page }) => {
    await page.goto(ROUTE);

    await page.getByTestId('wf-reload').click();

    // During the simulated load window.
    await expect(page.getByTestId('wf-demo')).toHaveAttribute('data-loading', 'true');
    await expect(page.getByTestId('wf-swap-text')).toBeVisible();
    await expect(page.getByTestId('wf-block-text')).toBeHidden();
    await expect(page.getByTestId('wf-swap')).toHaveAttribute('data-state', 'fallback');
    await expect(page.getByTestId('wf-block')).toHaveAttribute('data-state', 'blank');

    // It settles: both panels end identical, in the real font.
    await expect(page.getByTestId('wf-demo')).toHaveAttribute('data-loading', 'false');
    await expect(page.getByTestId('wf-swap-text')).toBeVisible();
    await expect(page.getByTestId('wf-block-text')).toBeVisible();
    await expect(page.getByTestId('wf-swap')).toHaveAttribute('data-state', 'real');
    await expect(page.getByTestId('wf-block')).toHaveAttribute('data-state', 'real');
  });

  test('web-fonts reload replays the load every time', async ({ page }) => {
    await page.goto(ROUTE);
    for (let i = 0; i < 2; i++) {
      await page.getByTestId('wf-reload').click();
      await expect(page.getByTestId('wf-block-text')).toBeHidden();
      await expect(page.getByTestId('wf-demo')).toHaveAttribute('data-loading', 'false');
      await expect(page.getByTestId('wf-block-text')).toBeVisible();
    }
  });

  test('back link returns to the hub', async ({ page }) => {
    await page.goto(ROUTE);
    await page.waitForLoadState('networkidle');
    await page.locator('.tool-page__back').click();
    await page.waitForURL('/');
    await expect(page.locator('.hero__title')).toBeVisible();
  });

  test('screenshot the completed guide and the three new demos', async ({ page }, testInfo) => {
    await page.goto(ROUTE);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(500);
    await page.screenshot({
      path: `./screenshots/tool-type-field-guide-m3-${testInfo.project.name}.png`,
      fullPage: true,
    });
    for (const id of ['hi-demo', 'ls-demo', 'wf-demo']) {
      await page.getByTestId(id).scrollIntoViewIfNeeded();
      await page.waitForTimeout(200);
      await page.getByTestId(id).screenshot({
        path: `./screenshots/tfg-${id}-m3-${testInfo.project.name}.png`,
      });
    }
  });
});
