import { test, expect } from '@playwright/test';
import type { Page, Locator } from '@playwright/test';
import { watchConsoleErrors, realConsoleErrors } from './helpers/console-errors';

const ROUTE = '/tools/spec-pressure-test';

// The 8 fixed spec dimensions, in reading order. Every worked example's chain
// eyebrows must render these names in exactly this order.
const DIMENSIONS = [
  'Outcome',
  'Scope boundary',
  'Data and state',
  'Invariants',
  'Constraints',
  'Failure modes',
  'The weakest link',
  'Verification',
];

// The four worked examples, in array (render) order. M1 shipped bookmarks;
// M2 added cancel-subscription (idempotency + partial failure) and
// shared-document (concurrency + contention); M3 adds payment-webhook
// (the trust boundary: an untrusted request from outside).
const EXAMPLES = [
  {
    slug: 'bookmarks',
    heading: 'save and revisit a list of bookmarks',
    briefMarkers: ['Add a bookmarks feature.', 'Save bookmark', 'keep it simple'],
  },
  {
    slug: 'cancel-subscription',
    heading: 'cancel their paid subscription',
    briefMarkers: [
      'Add a way for a user to cancel their subscription.',
      'Cancel subscription',
      'That is the whole thing.',
    ],
  },
  {
    slug: 'shared-document',
    heading: 'Two team members edit the same shared document',
    briefMarkers: [
      'Let team members edit a shared document.',
      'a Save button',
      'Keep it simple: just a title field',
    ],
  },
  {
    slug: 'payment-webhook',
    heading: 'receives a webhook from a payment provider',
    briefMarkers: [
      'Add a POST endpoint at /webhooks/payments',
      'Return 200 so the',
      'That is all we need for now.',
    ],
  },
];

// One example's <section data-testid="spt-example">, by fixed render order.
function exampleAt(page: Page, i: number): Locator {
  return page.getByTestId('spt-example').nth(i);
}

test.describe('The Spec Pressure-Test', () => {
  test('route loads without 404', async ({ page }) => {
    const res = await page.goto(ROUTE);
    expect(res?.status()).toBeLessThan(400);
  });

  test('renders without console errors', async ({ page }) => {
    const { errors } = watchConsoleErrors(page);
    await page.goto(ROUTE);
    await page.waitForLoadState('networkidle');
    expect(realConsoleErrors(errors)).toEqual([]);
  });

  test('renders header with title, category and catalogue number', async ({ page }) => {
    await page.goto(ROUTE);
    await expect(page.locator('.tool-page__title')).toHaveText('The Spec Pressure-Test');
    await expect(page.locator('.tool-page__eyebrow')).toContainText('learning_tools');
    await expect(page.locator('.tool-page__eyebrow')).toContainText('cargo/05');
  });

  test('topbar Tools link is active on this tool route', async ({ page }) => {
    await page.goto(ROUTE);
    const toolsLink = page.locator('.topbar__nav a').first();
    await expect(toolsLink).toHaveClass(/is-active/);
  });

  test('the intro names the lesson: under-specified handoffs, not model failures', async ({ page }) => {
    await page.goto(ROUTE);
    const intro = page.locator('.spt-intro');
    await expect(intro).toContainText('Most AI coding failures are not model failures');
    await expect(intro).toContainText('under-specified handoffs');
    await expect(intro).toContainText('This tool teaches that one skill');
    await expect(intro).toContainText('the gap');
    await expect(intro).toContainText('the assumption');
    await expect(intro).toContainText('the consequence');
  });

  test('four worked examples now render, in fixed order', async ({ page }) => {
    await page.goto(ROUTE);
    const examples = page.getByTestId('spt-example');
    await expect(examples).toHaveCount(4);

    for (let i = 0; i < EXAMPLES.length; i++) {
      await expect(exampleAt(page, i).locator('.spt-example__heading')).toContainText(
        EXAMPLES[i].heading
      );
    }
  });

  test('each worked example renders its under-specified spec brief', async ({ page }) => {
    await page.goto(ROUTE);
    for (let i = 0; i < EXAMPLES.length; i++) {
      const brief = exampleAt(page, i).getByTestId('spt-brief');
      await expect(brief).toContainText('the spec you were handed');
      for (const marker of EXAMPLES[i].briefMarkers) {
        await expect(brief).toContainText(marker);
      }
    }
  });

  test('every example has exactly 8 chains, one per dimension, in order', async ({ page }) => {
    await page.goto(ROUTE);

    // Worked examples (Mode 1) hold 4 examples x 8 chains. The self-check
    // (Mode 2) also renders chains via the same component; those are scoped
    // out here and covered by the self-check tests below.
    await expect(
      page.locator('[data-testid="spt-example"] [data-testid="spt-chain"]')
    ).toHaveCount(32);

    for (let i = 0; i < EXAMPLES.length; i++) {
      const ex = exampleAt(page, i);
      await expect(ex.getByTestId('spt-chain')).toHaveCount(8);

      const eyebrows = await ex.locator('.spt-chain__eyebrow').allTextContents();
      expect(eyebrows).toHaveLength(8);
      DIMENSIONS.forEach((name, d) => {
        expect(eyebrows[d]).toContain(name);
        expect(eyebrows[d]).toContain(String(d + 1).padStart(2, '0'));
      });
    }
  });

  test('every chain in every example shows all three parts with real text', async ({ page }) => {
    await page.goto(ROUTE);

    for (let i = 0; i < EXAMPLES.length; i++) {
      const chains = exampleAt(page, i).getByTestId('spt-chain');
      const count = await chains.count();
      expect(count).toBe(8);

      for (let c = 0; c < count; c++) {
        const chain = chains.nth(c);
        const gap = chain.getByTestId('spt-stage-gap');
        const assumption = chain.getByTestId('spt-stage-assumption');
        const consequence = chain.getByTestId('spt-stage-consequence');

        await expect(gap).toBeVisible();
        await expect(assumption).toBeVisible();
        await expect(consequence).toBeVisible();

        await expect(gap.locator('.spt-stage__tag')).toHaveText('the gap');
        await expect(assumption.locator('.spt-stage__tag')).toHaveText('the assumption');
        await expect(consequence.locator('.spt-stage__tag')).toHaveText('the consequence');

        // The quality bar: every part carries non-trivial, concrete text.
        for (const part of [gap, assumption, consequence]) {
          const txt = (await part.locator('.spt-stage__text').textContent()) ?? '';
          expect(txt.trim().length).toBeGreaterThan(60);
        }
      }
    }
  });

  test('each example reads as cause-and-effect sequences (leads-to connectors)', async ({ page }) => {
    await page.goto(ROUTE);
    // Two connectors per chain x 8 chains = 16 per example, 64 across the
    // four worked examples (self-check connectors scoped out, see below).
    await expect(
      page.locator('[data-testid="spt-example"] .spt-connector__word')
    ).toHaveCount(64);
    for (let i = 0; i < EXAMPLES.length; i++) {
      const connectors = exampleAt(page, i).locator('.spt-connector__word');
      await expect(connectors).toHaveCount(16);
      await expect(connectors.first()).toHaveText('leads to');
    }
  });

  // — Quality-bar content: each example's chains are concrete and named, and
  //   each example teaches its own distinct failure-shape. —

  test('bookmarks teaches CRUD-with-ownership concretely (M1, unchanged)', async ({ page }) => {
    await page.goto(ROUTE);
    const ex = exampleAt(page, 0);

    await expect(
      ex.locator('.spt-chain[data-dimension="invariants"]').getByTestId('spt-stage-consequence')
    ).toContainText('cross-account data leak');

    await expect(
      ex.locator('.spt-chain[data-dimension="weakest-link"]').getByTestId('spt-stage-consequence')
    ).toContainText('Stored XSS');

    await expect(
      ex.locator('.spt-chain[data-dimension="data-and-state"]').getByTestId('spt-stage-consequence')
    ).toContainText('no confirmation and no undo');
  });

  test('cancel-subscription teaches idempotency and partial failure concretely', async ({ page }) => {
    await page.goto(ROUTE);
    const ex = exampleAt(page, 1);

    // Idempotency: the missing "cancel is idempotent" constraint.
    await expect(
      ex.locator('.spt-chain[data-dimension="constraints"]').getByTestId('spt-stage-consequence')
    ).toContainText('missing idempotency constraint');

    // Partial failure: two systems, no reconciliation, guaranteed to diverge.
    const failure = ex
      .locator('.spt-chain[data-dimension="failure-modes"]')
      .getByTestId('spt-stage-consequence');
    await expect(failure).toContainText('guaranteed to diverge');
    await expect(failure).toContainText('chargeback');

    // Weakest link: lost provider response on timeout, double-processed.
    await expect(
      ex.locator('.spt-chain[data-dimension="weakest-link"]').getByTestId('spt-stage-consequence')
    ).toContainText('double-processed');
  });

  test('shared-document teaches concurrency and contention concretely', async ({ page }) => {
    await page.goto(ROUTE);
    const ex = exampleAt(page, 2);

    // Lost update / last-write-wins is the identity of this example.
    const failure = ex
      .locator('.spt-chain[data-dimension="failure-modes"]')
      .getByTestId('spt-stage-consequence');
    await expect(failure).toContainText('Last-write-');
    await expect(failure).toContainText('overwrites the other wholesale');

    // Contention baked into the data model: the missing version column.
    await expect(
      ex.locator('.spt-chain[data-dimension="data-and-state"]').getByTestId('spt-stage-consequence')
    ).toContainText('missing version column');

    // TOCTOU membership invariant: time-of-check, not time-of-use.
    await expect(
      ex.locator('.spt-chain[data-dimension="invariants"]').getByTestId('spt-stage-consequence')
    ).toContainText('time-of-check, not');
  });

  test('payment-webhook teaches the trust-boundary failure-shape concretely', async ({ page }) => {
    await page.goto(ROUTE);
    const ex = exampleAt(page, 3);

    // Authenticity invariant, explicitly NOT ownership.
    await expect(
      ex.locator('.spt-chain[data-dimension="invariants"]').getByTestId('spt-stage-consequence')
    ).toContainText('authenticity failure, not an ownership');

    // Replay framed as a duplicate crossing the trust boundary, not a UI
    // double-click.
    const failure = ex
      .locator('.spt-chain[data-dimension="failure-modes"]')
      .getByTestId('spt-stage-consequence');
    await expect(failure).toContainText('duplicate crossing the trust boundary');
    await expect(failure).toContainText('not a double-click in your UI');

    // Spoofed payload trusted as state; wrong-bytes signature weakest link.
    await expect(
      ex.locator('.spt-chain[data-dimension="data-and-state"]').getByTestId('spt-stage-consequence')
    ).toContainText('attacker-controllable input as its own state');
    await expect(
      ex.locator('.spt-chain[data-dimension="weakest-link"]').getByTestId('spt-stage-consequence')
    ).toContainText('wrong bytes');
  });

  test('all four failure-shapes are distinct, not re-domained', async ({ page }) => {
    await page.goto(ROUTE);
    const failureText = async (i: number) =>
      (await exampleAt(page, i)
        .locator('.spt-chain[data-dimension="failure-modes"]')
        .getByTestId('spt-stage-consequence')
        .textContent()) ?? '';
    const invariantText = async (i: number) =>
      (await exampleAt(page, i)
        .locator('.spt-chain[data-dimension="invariants"]')
        .getByTestId('spt-stage-consequence')
        .textContent()) ?? '';

    const cancelFailure = await failureText(1);
    const docFailure = await failureText(2);
    const webhookFailure = await failureText(3);

    // Idempotency/partial-failure vs contention vs trust-boundary replay:
    // three different failure languages, no bleed.
    expect(cancelFailure).toContain('diverge');
    expect(cancelFailure).not.toContain('Last-write-wins');
    expect(cancelFailure).not.toContain('trust boundary');

    expect(docFailure).toContain('Last-write-wins');
    expect(docFailure).not.toContain('reconciliation');
    expect(docFailure).not.toContain('trust boundary');

    // Replay-vs-idempotency: the webhook replay chain is framed at the
    // boundary (external duplicate), not as a UI double-click.
    expect(webhookFailure).toContain('duplicate crossing the trust boundary');
    expect(webhookFailure).not.toContain('Last-write-wins');

    // Invariants-vs-ownership: the webhook invariant is authenticity of the
    // request, distinct from the three ownership/access invariants.
    expect(await invariantText(3)).toContain('authenticity failure, not an ownership');
    expect(await invariantText(0)).toContain('cross-account');
    expect(await invariantText(3)).not.toContain('cross-account');
  });

  // — Mode 2: the self-check (M4) —

  test('the page presents two modes: worked examples, then the self-check', async ({ page }) => {
    await page.goto(ROUTE);
    await expect(page.getByTestId('spt-mode-examples')).toContainText(
      'mode 01 · worked examples'
    );
    const selfcheck = page.getByTestId('spt-selfcheck');
    await expect(selfcheck).toBeVisible();
    await expect(selfcheck).toContainText('mode 02 · the self-check');
    // The framing makes clear examples teach, the self-check applies it.
    await expect(selfcheck).toContainText('work it against the same eight');
  });

  test('the self-check guides, it does not grade or read the spec', async ({ page }) => {
    await page.goto(ROUTE);
    const selfcheck = page.getByTestId('spt-selfcheck');
    // No AI analysis, no score/tally: stated, and no score element exists.
    await expect(selfcheck).toContainText('The tool does not read your spec');
    await expect(selfcheck).toContainText('There is no score and nothing to submit');
    await expect(page.getByTestId('spt-score')).toHaveCount(0);
    await expect(page.getByTestId('spt-tally')).toHaveCount(0);
  });

  test('the self-check walks all 8 dimensions, each with its causal question', async ({ page }) => {
    await page.goto(ROUTE);
    const dims = page.getByTestId('spt-check-dim');
    await expect(dims).toHaveCount(8);

    const eyebrows = await page
      .locator('[data-testid="spt-selfcheck"] .spt-check__eyebrow')
      .allTextContents();
    expect(eyebrows).toHaveLength(8);
    DIMENSIONS.forEach((name, d) => {
      expect(eyebrows[d]).toContain(name);
      expect(eyebrows[d]).toContain(String(d + 1).padStart(2, '0'));
    });

    const questions = page.getByTestId('spt-check-question');
    await expect(questions).toHaveCount(8);
    for (let i = 0; i < 8; i++) {
      const q = (await questions.nth(i).textContent()) ?? '';
      expect(q.trim().length).toBeGreaterThan(60);
      // The causal question interrogates the user's own spec.
      expect(q).toMatch(/\bHave you\b|\bCan you\b/);
    }
  });

  test('each dimension surfaces the matching chains from all four worked examples', async ({ page }) => {
    await page.goto(ROUTE);

    // Self-check renders one chain per worked example per dimension:
    // 8 dimensions x 4 examples = 32, via the existing CausalChain.
    await expect(
      page.locator('[data-testid="spt-selfcheck"] [data-testid="spt-chain"]')
    ).toHaveCount(32);

    // Invariants is the prompt's worked example of the link: the bookmarks
    // cross-account chain and the webhook forgery chain, side by side.
    const inv = page.locator(
      '[data-testid="spt-selfcheck"] .spt-check__dim[data-dimension="invariants"]'
    );
    const invChains = inv.getByTestId('spt-chain');
    await expect(invChains).toHaveCount(4);
    // Every surfaced chain is the invariants chain (correct dimension).
    for (let i = 0; i < 4; i++) {
      await expect(invChains.nth(i)).toHaveAttribute('data-dimension', 'invariants');
    }
    // Each is attributed to its source spec.
    await expect(inv.locator('.spt-linked__from')).toHaveCount(4);
    // Concrete failures from two different specs, in the self-check.
    await expect(inv).toContainText('cross-account data leak');
    await expect(inv).toContainText('authenticity failure, not an ownership');
  });

  test('global chain total = worked examples (32) + self-check (32)', async ({ page }) => {
    await page.goto(ROUTE);
    await expect(page.getByTestId('spt-chain')).toHaveCount(64);
  });

  test('metadata title uses the house em-dash separator', async ({ page }) => {
    await page.goto(ROUTE);
    await expect(page).toHaveTitle('The Spec Pressure-Test — Cargo');
  });

  test('back link returns to the hub', async ({ page }) => {
    await page.goto(ROUTE);
    await page.waitForLoadState('networkidle');
    await page.locator('.tool-page__back').click();
    await page.waitForURL('/');
    await expect(page.locator('.hero__title')).toBeVisible();
  });

  test('screenshot the page and the new webhook example', async ({ page }, testInfo) => {
    await page.goto(ROUTE);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(400);
    await page.screenshot({
      path: `./screenshots/tool-spec-pressure-test-m3-${testInfo.project.name}.png`,
      fullPage: true,
    });

    // The M3 deliverable: the new example and a couple of its chains.
    const ex = exampleAt(page, 3);
    await ex.scrollIntoViewIfNeeded();
    await page.waitForTimeout(150);
    await ex.screenshot({
      path: `./screenshots/spt-example-payment-webhook-m3-${testInfo.project.name}.png`,
    });

    for (const dim of ['invariants', 'failure-modes', 'weakest-link']) {
      const chain = ex.locator(`.spt-chain[data-dimension="${dim}"]`);
      await chain.scrollIntoViewIfNeeded();
      await page.waitForTimeout(120);
      await chain.screenshot({
        path: `./screenshots/spt-payment-webhook-${dim}-m3-${testInfo.project.name}.png`,
      });
    }
  });

  test('screenshot the self-check and a dimension with its linked chains', async ({ page }, testInfo) => {
    await page.goto(ROUTE);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(300);

    // The completed tool, full page (both modes).
    await page.screenshot({
      path: `./screenshots/tool-spec-pressure-test-m4-${testInfo.project.name}.png`,
      fullPage: true,
    });

    // The self-check mode, collapsed (the 8 questions).
    const selfcheck = page.getByTestId('spt-selfcheck');
    await selfcheck.scrollIntoViewIfNeeded();
    await page.waitForTimeout(150);
    await selfcheck.screenshot({
      path: `./screenshots/spt-selfcheck-m4-${testInfo.project.name}.png`,
    });

    // One dimension with its worked-example link expanded: the user sees the
    // causal question and four concrete failures of that dimension.
    const inv = page.locator(
      '[data-testid="spt-selfcheck"] .spt-check__dim[data-dimension="invariants"]'
    );
    await inv.scrollIntoViewIfNeeded();
    await inv.locator('.spt-disclosure__summary').click();
    await page.waitForTimeout(200);
    await inv.screenshot({
      path: `./screenshots/spt-selfcheck-invariants-open-m4-${testInfo.project.name}.png`,
    });
  });
});

test.describe('The Spec Pressure-Test — mobile (no horizontal scroll)', () => {
  test.use({ viewport: { width: 375, height: 812 } });

  test('does not scroll sideways at a phone width', async ({ page }) => {
    await page.goto(ROUTE);
    await page.waitForLoadState('networkidle');
    const { sw, cw } = await page.evaluate(() => ({
      sw: document.documentElement.scrollWidth,
      cw: document.documentElement.clientWidth,
    }));
    expect(sw).toBeLessThanOrEqual(cw + 1);
  });

  test('the long JSON token in a consequence wraps instead of overflowing', async ({ page }) => {
    await page.goto(ROUTE);
    const widest = await page.evaluate(() =>
      Math.max(
        0,
        ...[...document.querySelectorAll('.spt-stage__text')].map(
          (el) => el.scrollWidth - el.clientWidth
        )
      )
    );
    expect(widest).toBeLessThanOrEqual(1);
  });
});
