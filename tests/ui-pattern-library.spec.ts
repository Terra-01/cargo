import { test, expect } from '@playwright/test';
import { watchConsoleErrors, realConsoleErrors } from './helpers/console-errors';

const ROUTE = '/tools/ui-pattern-library';

test.describe('UI Pattern Library tool', () => {
  test('renders without console errors', async ({ page }) => {
    const { errors } = watchConsoleErrors(page);
    await page.goto(ROUTE);
    await page.waitForLoadState('networkidle');
    expect(realConsoleErrors(errors)).toEqual([]);
  });

  test('renders header with title and category', async ({ page }) => {
    await page.goto(ROUTE);
    await expect(page.locator('.tool-page__title')).toContainText('UI Pattern Library');
    await expect(page.locator('.tool-page__eyebrow')).toContainText('reference');
    await expect(page.locator('.tool-page__eyebrow')).toContainText('cargo/06');
  });

  test('topbar Tools link is active on this tool route', async ({ page }) => {
    await page.goto(ROUTE);
    await expect(page.locator('.topbar__nav a').first()).toHaveClass(/is-active/);
  });

  test('renders all 18 entries — the tool is complete', async ({ page }) => {
    await page.goto(ROUTE);
    await expect(page.locator('.upl-card')).toHaveCount(18);
    for (const id of [
      'modal-dialog',
      'pagination-vs-infinite-scroll',
      'optimistic-vs-pessimistic-ui',
      'toast-notification',
      'tooltip',
      'accordion',
      'inline-validation',
      'skeleton-vs-spinner',
      'popover',
      'dropdown-menu',
      'segmented-control-vs-dropdown',
      'multi-step-form',
      'confirmation-vs-undo',
      'progressive-disclosure',
      'tabs',
      'search-as-you-type',
      'empty-state',
      'drag-and-drop',
    ]) {
      await expect(page.getByTestId(`upl-card-${id}`)).toBeVisible();
    }
    await expect(page.getByTestId('upl-result-count')).toHaveText('18 / 18');
  });

  test('each entry shows its full anatomy', async ({ page }) => {
    await page.goto(ROUTE);
    const card = page.getByTestId('upl-card-modal-dialog');
    await expect(card.locator('.upl-card__name')).toHaveText('Modal dialog');
    await expect(card.locator('.upl-card__eyebrow')).toContainText('overlays');
    await expect(card.locator('.upl-card__what')).not.toBeEmpty();
    await expect(card.locator('.upl-anat[data-kind="use"] p')).not.toBeEmpty();
    await expect(card.locator('.upl-anat[data-kind="avoid"] p')).not.toBeEmpty();
    await expect(card.locator('.upl-anat[data-kind="instead"] p')).not.toBeEmpty();
  });

  test('each entry has a live example present', async ({ page }) => {
    await page.goto(ROUTE);
    await expect(page.getByTestId('ex-modal-dialog')).toBeVisible();
    await expect(page.getByTestId('ex-pagination')).toBeVisible();
    await expect(page.getByTestId('ex-optimistic')).toBeVisible();
  });

  // — search —

  test('search narrows by name', async ({ page }) => {
    await page.goto(ROUTE);
    await page.getByTestId('upl-search-input').fill('modal');
    await expect(page.locator('.upl-card')).toHaveCount(1);
    await expect(page.getByTestId('upl-card-modal-dialog')).toBeVisible();

    await page.getByTestId('upl-search-input').fill('scroll');
    await expect(page.locator('.upl-card')).toHaveCount(1);
    await expect(page.getByTestId('upl-card-pagination-vs-infinite-scroll')).toBeVisible();
  });

  test('search with no matches shows the empty state', async ({ page }) => {
    await page.goto(ROUTE);
    await page.getByTestId('upl-search-input').fill('zzznotreal');
    await expect(page.locator('.upl-card')).toHaveCount(0);
    await expect(page.getByTestId('upl-empty')).toBeVisible();
    await expect(page.getByTestId('upl-result-count')).toHaveText('0 / 18');
  });

  // — category filter —

  test('filter renders all five chips with data-derived counts', async ({ page }) => {
    await page.goto(ROUTE);
    for (const cat of ['all', 'overlays', 'disclosure', 'input', 'content']) {
      await expect(page.getByTestId(`upl-cat-${cat}`)).toBeVisible();
    }
    await expect(page.getByTestId('upl-cat-all')).toHaveAttribute('aria-pressed', 'true');
    await expect(page.getByTestId('upl-cat-all')).toContainText('18');
    await expect(page.getByTestId('upl-cat-overlays')).toContainText('4');
    await expect(page.getByTestId('upl-cat-content')).toContainText('6');
    await expect(page.getByTestId('upl-cat-disclosure')).toContainText('4');
    await expect(page.getByTestId('upl-cat-input')).toContainText('4');
  });

  test('selecting a category narrows the grid; all restores', async ({ page }) => {
    await page.goto(ROUTE);
    await page.getByTestId('upl-cat-content').click();
    await expect(page.getByTestId('upl-cat-content')).toHaveAttribute('data-active', 'true');
    await expect(page.locator('.upl-card')).toHaveCount(6);
    await expect(page.getByTestId('upl-result-count')).toHaveText('6 / 18');
    await expect(page.getByTestId('upl-card-empty-state')).toBeVisible();
    await expect(page.getByTestId('upl-card-drag-and-drop')).toBeVisible();

    await page.getByTestId('upl-cat-overlays').click();
    await expect(page.locator('.upl-card')).toHaveCount(4);
    await expect(page.getByTestId('upl-card-modal-dialog')).toBeVisible();
    await expect(page.getByTestId('upl-card-popover')).toBeVisible();

    await page.getByTestId('upl-cat-disclosure').click();
    await expect(page.locator('.upl-card')).toHaveCount(4);
    await expect(page.getByTestId('upl-card-accordion')).toBeVisible();
    await expect(page.getByTestId('upl-card-tabs')).toBeVisible();
    await expect(page.getByTestId('upl-card-progressive-disclosure')).toBeVisible();

    await page.getByTestId('upl-cat-input').click();
    await expect(page.locator('.upl-card')).toHaveCount(4);
    await expect(page.getByTestId('upl-card-inline-validation')).toBeVisible();
    await expect(page.getByTestId('upl-card-search-as-you-type')).toBeVisible();

    await page.getByTestId('upl-cat-all').click();
    await expect(page.locator('.upl-card')).toHaveCount(18);
  });

  test('category filter combines with text search', async ({ page }) => {
    await page.goto(ROUTE);
    await page.getByTestId('upl-cat-content').click();
    await expect(page.locator('.upl-card')).toHaveCount(6);
    // content + a term only the overlays entry matches → 0.
    await page.getByTestId('upl-search-input').fill('modal');
    await expect(page.locator('.upl-card')).toHaveCount(0);
    await expect(page.getByTestId('upl-empty')).toBeVisible();
    // clearing the text restores the category-only result.
    await page.getByTestId('upl-search-input').fill('');
    await expect(page.locator('.upl-card')).toHaveCount(6);
    // a term that only the skeleton entry matches, still within content.
    await page.getByTestId('upl-search-input').fill('skeleton');
    await expect(page.locator('.upl-card')).toHaveCount(1);
    await expect(page.getByTestId('upl-card-skeleton-vs-spinner')).toBeVisible();
  });

  // — live example: Modal dialog (right vs wrong) —

  test('modal example: destructive confirm is a real blocking modal', async ({ page }) => {
    await page.goto(ROUTE);
    await expect(page.getByTestId('ex-modal-confirm-dialog')).toHaveCount(0);
    await page.getByTestId('ex-modal-delete-trigger').click();
    await expect(page.getByTestId('ex-modal-confirm-dialog')).toBeVisible();
    await page.getByTestId('ex-modal-confirm-cancel').click();
    await expect(page.getByTestId('ex-modal-confirm-dialog')).toHaveCount(0);
    // confirming resolves the destructive action
    await page.getByTestId('ex-modal-delete-trigger').click();
    await page.getByTestId('ex-modal-confirm-delete').click();
    await expect(page.getByTestId('ex-modal-deleted')).toBeVisible();
  });

  test('modal example: the same "saved" message as modal (wrong) vs toast (right)', async ({ page }) => {
    await page.goto(ROUTE);
    // default = modal feedback → a blocking dialog for a transient message
    await page.getByTestId('ex-modal-save-trigger').click();
    await expect(page.getByTestId('ex-modal-saved-dialog')).toBeVisible();
    await page.getByTestId('ex-modal-saved-ok').click();
    await expect(page.getByTestId('ex-modal-saved-dialog')).toHaveCount(0);
    // switch to toast → non-blocking, no dialog
    await page.getByTestId('ex-modal-fb-toast').click();
    await page.getByTestId('ex-modal-save-trigger').click();
    await expect(page.getByTestId('ex-modal-saved-dialog')).toHaveCount(0);
    await expect(page.getByTestId('ex-modal-toast')).toHaveAttribute('data-up', 'true');
  });

  // — live example: Pagination vs infinite scroll —

  test('pagination example: position is addressable, infinite is not', async ({ page }) => {
    await page.goto(ROUTE);
    const addr = page.getByTestId('ex-pg-addr');
    await expect(addr).toContainText('?page=1');
    // jump back to result #19 — pagination has an address
    await page.getByTestId('ex-pg-restore').click();
    await expect(addr).toContainText('?page=4');
    await expect(page.getByTestId('ex-pg-item-19')).toHaveAttribute('data-hl', 'true');
    await expect(page.getByTestId('ex-pg-note')).toBeVisible();
    // infinite scroll has no address
    await page.getByTestId('ex-pg-mode-infinite').click();
    await expect(addr).toContainText('(not addressable)');
    await expect(page.getByTestId('ex-pg-footer')).toHaveAttribute('data-reachable', 'false');
  });

  test('pagination example: page controls move through pages', async ({ page }) => {
    await page.goto(ROUTE);
    await expect(page.getByTestId('ex-pg-item-1')).toBeVisible();
    await page.getByTestId('ex-pg-page-3').click();
    await expect(page.getByTestId('ex-pg-addr')).toContainText('?page=3');
    await expect(page.getByTestId('ex-pg-item-13')).toBeVisible();
  });

  // — live example: Optimistic vs pessimistic (failure case is the point) —

  test('optimistic example: snaps instantly then reverts on failure', async ({ page }) => {
    await page.goto(ROUTE);
    // defaults: optimistic + network fails
    const count = page.getByTestId('ex-op-count');
    await expect(count).toHaveText('128');
    await page.getByTestId('ex-op-like').click();
    // optimistic → instant update
    await expect(count).toHaveText('129');
    // … then the server fails and it awkwardly reverts
    await expect(count).toHaveText('128', { timeout: 4000 });
    await expect(page.getByTestId('ex-op-log')).toContainText('reverted');
  });

  test('pessimistic example: waits, never lies, reports failure honestly', async ({ page }) => {
    await page.goto(ROUTE);
    await page.getByTestId('ex-op-mode-pessimistic').click();
    const count = page.getByTestId('ex-op-count');
    await page.getByTestId('ex-op-like').click();
    // pessimistic → spinner, no change yet
    await expect(page.getByTestId('ex-op-spinner')).toBeVisible();
    await expect(count).toHaveText('128');
    // server fails → still 128, honest error (never showed 129)
    await expect(page.getByTestId('ex-op-error')).toBeVisible({ timeout: 4000 });
    await expect(count).toHaveText('128');
  });

  test('optimistic example: succeeds cleanly when the network is ok', async ({ page }) => {
    await page.goto(ROUTE);
    await page.getByTestId('ex-op-net-ok').click();
    const count = page.getByTestId('ex-op-count');
    await page.getByTestId('ex-op-like').click();
    await expect(count).toHaveText('129');
    // stays — no revert
    await page.waitForTimeout(1300);
    await expect(count).toHaveText('129');
  });

  // ——————————————————————————————————————————————
  //  M2 entries — anatomy + a real, interactive example
  // ——————————————————————————————————————————————

  test('M2 anatomy: every new entry renders its full anatomy', async ({ page }) => {
    await page.goto(ROUTE);
    const expected: Array<[string, string, string]> = [
      ['toast-notification', 'Toast / notification', 'overlays'],
      ['tooltip', 'Tooltip', 'overlays'],
      ['accordion', 'Accordion', 'disclosure'],
      ['inline-validation', 'Inline validation', 'input'],
      ['skeleton-vs-spinner', 'Skeleton vs spinner', 'content'],
    ];
    for (const [id, name, cat] of expected) {
      const card = page.getByTestId(`upl-card-${id}`);
      await expect(card.locator('.upl-card__name')).toHaveText(name);
      await expect(card.locator('.upl-card__eyebrow')).toContainText(cat);
      await expect(card.locator('.upl-card__what')).not.toBeEmpty();
      await expect(card.locator('.upl-anat[data-kind="use"] p')).not.toBeEmpty();
      await expect(card.locator('.upl-anat[data-kind="avoid"] p')).not.toBeEmpty();
      await expect(card.locator('.upl-anat[data-kind="instead"] p')).not.toBeEmpty();
    }
  });

  test('M2 examples: all five are present', async ({ page }) => {
    await page.goto(ROUTE);
    for (const id of [
      'ex-toast-notification',
      'ex-tooltip',
      'ex-accordion',
      'ex-inline-validation',
      'ex-skeleton-vs-spinner',
    ]) {
      await expect(page.getByTestId(id)).toBeVisible();
    }
  });

  // Toast: low-stakes is fine, but an actionable message in a toast can be missed.
  test('toast example: undo in a toast can be missed; in a banner it persists', async ({ page }) => {
    await page.goto(ROUTE);
    // low-stakes confirm — the toast doing its job
    await page.getByTestId('ex-toast-copy').click();
    await expect(page.getByTestId('ex-toast-copied')).toHaveAttribute('data-up', 'true');

    // banner mode: the undo persists until acted on
    await page.getByTestId('ex-toast-mode-banner').click();
    await page.getByTestId('ex-toast-delete').click();
    await expect(page.getByTestId('ex-toast-banner')).toBeVisible();
    await page.getByTestId('ex-toast-undo-banner').click();
    await expect(page.getByTestId('ex-toast-outcome')).toHaveAttribute('data-kind', 'restored');

    // toast mode: the undo lives only as long as the toast — miss it and it is gone
    await page.getByTestId('ex-toast-mode-toast').click();
    await page.getByTestId('ex-toast-delete').click();
    await expect(page.getByTestId('ex-toast-undo-toast')).toHaveAttribute('data-up', 'true');
    await expect(page.getByTestId('ex-toast-outcome')).toHaveAttribute('data-kind', 'missed', {
      timeout: 5000,
    });
  });

  // Tooltip: a hint works on hover; an action inside a tooltip is unreachable.
  test('tooltip example: hint on hover; action needs a popover, not a tooltip', async ({ page }) => {
    await page.goto(ROUTE);
    const tip = page.getByTestId('ex-tip-tooltip');
    await expect(tip).toHaveAttribute('data-on', 'false');
    await page.getByTestId('ex-tip-icon').hover();
    await expect(tip).toHaveAttribute('data-on', 'true');

    // tooltip mode: reaching for the button inside closes it — unreachable
    await page.getByTestId('ex-tip-reach').click();
    await expect(page.getByTestId('ex-tip-missed')).toBeVisible();

    // popover mode: it stays open and the action works
    await page.getByTestId('ex-tip-mode-popover').click();
    await page.getByTestId('ex-tip-share').click();
    await expect(page.getByTestId('ex-tip-popover')).toBeVisible();
    await page.getByTestId('ex-tip-copy').click();
    await expect(page.getByTestId('ex-tip-copied')).toBeVisible();
  });

  // Accordion (watch-list): the misuse — comparison content you cannot compare.
  test('accordion example: comparison is sabotaged by accordion/tabs, fixed by show-all', async ({ page }) => {
    await page.goto(ROUTE);
    const panels = page.locator('[data-testid^="ex-acc-panel-"]');
    // accordion default: nothing expanded — 0 plans comparable at once
    await expect(panels).toHaveCount(0);
    await expect(page.getByTestId('ex-acc-visible-count')).toHaveText('0');
    await page.getByTestId('ex-acc-head-pro').click();
    await expect(page.getByTestId('ex-acc-panel-pro')).toBeVisible();
    await expect(panels).toHaveCount(1);
    await expect(page.getByTestId('ex-acc-visible-count')).toHaveText('1');

    // tabs: still one at a time
    await page.getByTestId('ex-acc-mode-tabs').click();
    await expect(panels).toHaveCount(1);
    await expect(page.getByTestId('ex-acc-visible-count')).toHaveText('1');

    // show all: all three on screen — the comparison is finally answerable
    await page.getByTestId('ex-acc-mode-showall').click();
    await expect(panels).toHaveCount(3);
    await expect(page.getByTestId('ex-acc-visible-count')).toHaveText('3');
  });

  // Inline validation: hostile on keystroke, helpful on blur — same keystrokes.
  test('inline-validation example: keystroke nags mid-typing; blur waits', async ({ page }) => {
    await page.goto(ROUTE);
    const email = page.getByTestId('ex-iv-email');
    const msg = page.getByTestId('ex-iv-email-msg');

    // keystroke mode (default): one character in and it already errors
    await email.fill('j');
    await expect(msg).toHaveAttribute('data-kind', 'bad');
    await expect(msg).not.toBeEmpty();

    // blur mode: quiet while typing, speaks once you leave the field
    await page.getByTestId('ex-iv-mode-blur').click();
    await email.fill('jo');
    await expect(msg).toHaveText('');
    await email.blur();
    await expect(msg).toHaveAttribute('data-kind', 'bad');
    await expect(msg).not.toBeEmpty();
    // a valid value, on blur, is confirmed
    await email.fill('jo@example.com');
    await email.blur();
    await expect(msg).toHaveAttribute('data-kind', 'good');
  });

  // Skeleton vs spinner: structured load both ways; skeleton flashes when too short.
  test('skeleton-vs-spinner example: both loaders run; skeleton flashes on a 200ms wait', async ({ page }) => {
    await page.goto(ROUTE);
    // skeleton mode (default)
    await page.getByTestId('ex-ss-reload').click();
    await expect(page.getByTestId('ex-ss-skeleton')).toBeVisible();
    await expect(page.getByTestId('ex-ss-content')).toBeVisible({ timeout: 4000 });

    // spinner mode
    await page.getByTestId('ex-ss-mode-spinner').click();
    await page.getByTestId('ex-ss-reload').click();
    await expect(page.getByTestId('ex-ss-spinner')).toBeVisible();
    await expect(page.getByTestId('ex-ss-content')).toBeVisible({ timeout: 4000 });

    // the misuse: a skeleton for a 200ms wait flashes
    await page.getByTestId('ex-ss-mode-skeleton').click();
    await page.getByTestId('ex-ss-short').click();
    await expect(page.getByTestId('ex-ss-flash-note')).toBeVisible({ timeout: 4000 });

    // cross-reference to the Loading States tool
    await expect(page.getByTestId('ex-ss-link')).toHaveAttribute('href', '/tools/loading-states');
  });

  // ——————————————————————————————————————————————
  //  Part 0 regression guard — the two M1 examples must keep their
  //  control styling when the modal entry is filtered off the page
  // ——————————————————————————————————————————————

  test('M1 examples stay styled when the modal entry is not rendered', async ({ page }) => {
    await page.goto(ROUTE);

    // The bug: pagination/optimistic borrowed .upl-ex-seg/.upl-ex-btn from
    // ModalDialogExample. Filter to `content` (modal excluded) and the seg
    // controls must still be styled from the example's OWN scoped classes.
    await page.getByTestId('upl-cat-content').click();
    await expect(page.getByTestId('ex-modal-dialog')).toHaveCount(0);
    await expect(page.getByTestId('ex-pagination')).toBeVisible();
    await expect(page.getByTestId('ex-optimistic')).toBeVisible();

    // An unstyled div (the bug) blockifies to "block" with 0 border; the
    // scoped class makes it a flex container with a real border. (A flex item
    // declared inline-flex computes as "flex" — both are the styled state.)
    const pgSeg = await page.locator('.upl-ex-pg__seg').first().evaluate((el) => {
      const s = getComputedStyle(el);
      return { display: s.display, border: parseFloat(s.borderTopWidth) };
    });
    expect(pgSeg.display).toMatch(/flex/);
    expect(pgSeg.border).toBeGreaterThan(0);

    const opSeg = await page.locator('.upl-ex-op__seg').first().evaluate((el) => {
      const s = getComputedStyle(el);
      return { display: s.display, border: parseFloat(s.borderTopWidth) };
    });
    expect(opSeg.display).toMatch(/flex/);
    expect(opSeg.border).toBeGreaterThan(0);

    // Same guard via search (only the pagination card; modal absent).
    await page.getByTestId('upl-cat-all').click();
    await page.getByTestId('upl-search-input').fill('scroll');
    await expect(page.locator('.upl-card')).toHaveCount(1);
    await expect(page.getByTestId('ex-modal-dialog')).toHaveCount(0);
    const pgBtn = await page.locator('.upl-ex-pg__btn').first().evaluate((el) => {
      const s = getComputedStyle(el);
      return { radius: parseFloat(s.borderTopLeftRadius), border: parseFloat(s.borderTopWidth) };
    });
    expect(pgBtn.border).toBeGreaterThan(0);
    expect(pgBtn.radius).toBeGreaterThan(0);
  });

  // ——————————————————————————————————————————————
  //  M3 entries — anatomy + a real, interactive example
  // ——————————————————————————————————————————————

  test('M3 anatomy: every new entry renders its full anatomy', async ({ page }) => {
    await page.goto(ROUTE);
    const expected: Array<[string, string, string]> = [
      ['popover', 'Popover', 'overlays'],
      ['dropdown-menu', 'Dropdown menu', 'disclosure'],
      ['segmented-control-vs-dropdown', 'Segmented control vs dropdown', 'input'],
      ['multi-step-form', 'Multi-step form / wizard', 'input'],
      ['confirmation-vs-undo', 'Confirmation dialog vs undo', 'content'],
    ];
    for (const [id, name, cat] of expected) {
      const card = page.getByTestId(`upl-card-${id}`);
      await expect(card.locator('.upl-card__name')).toHaveText(name);
      await expect(card.locator('.upl-card__eyebrow')).toContainText(cat);
      await expect(card.locator('.upl-card__what')).not.toBeEmpty();
      await expect(card.locator('.upl-anat[data-kind="use"] p')).not.toBeEmpty();
      await expect(card.locator('.upl-anat[data-kind="avoid"] p')).not.toBeEmpty();
      await expect(card.locator('.upl-anat[data-kind="instead"] p')).not.toBeEmpty();
    }
  });

  test('M3 examples: all five are present', async ({ page }) => {
    await page.goto(ROUTE);
    for (const id of [
      'ex-popover',
      'ex-dropdown-menu',
      'ex-segmented-vs-dropdown',
      'ex-multi-step-form',
      'ex-confirmation-vs-undo',
    ]) {
      await expect(page.getByTestId(id)).toBeVisible();
    }
  });

  // Popover: compact interactive cluster is right; overstuffed wants a panel.
  test('popover example: compact works; overstuffed overflows and wants a panel', async ({ page }) => {
    await page.goto(ROUTE);
    // compact (default): click the trigger, a real interactive popover opens
    await expect(page.getByTestId('ex-pop-popover')).toHaveCount(0);
    await page.getByTestId('ex-pop-trigger').click();
    await expect(page.getByTestId('ex-pop-popover')).toBeVisible();

    // overstuffed: the same bubble is crammed and flags it should be a panel
    await page.getByTestId('ex-pop-mode-overstuffed').click();
    await page.getByTestId('ex-pop-trigger').click();
    await expect(page.getByTestId('ex-pop-popover')).toBeVisible();
    await expect(page.getByTestId('ex-pop-overflow-note')).toBeVisible();
    await page.getByTestId('ex-pop-open-panel').click();
    await expect(page.getByTestId('ex-pop-panel')).toHaveAttribute('data-open', 'true');
  });

  // Dropdown menu (watch-list): wrong for a small primary set, right for many.
  test('dropdown example: hides a 3-option choice (wrong), collapses 200 (right)', async ({ page }) => {
    await page.goto(ROUTE);
    // few + dropdown (default): options hidden until a click; verdict is bad
    await expect(page.getByTestId('ex-dd-few-list')).toHaveCount(0);
    await expect(page.getByTestId('ex-dd-note-few')).toHaveAttribute('data-kind', 'bad');
    await page.getByTestId('ex-dd-few-trigger').click();
    await expect(page.getByTestId('ex-dd-few-list')).toBeVisible();
    // segmented: all three visible without a click; verdict flips to good
    await page.getByTestId('ex-dd-fewmode-segmented').click();
    await expect(page.getByTestId('ex-dd-few-segmented')).toBeVisible();
    await expect(page.getByTestId('ex-dd-note-few')).toHaveAttribute('data-kind', 'good');

    // many + dropdown (default): collapsing ~200 is correct
    await expect(page.getByTestId('ex-dd-note-many')).toHaveAttribute('data-kind', 'good');
    await page.getByTestId('ex-dd-manymode-visible').click();
    await expect(page.getByTestId('ex-dd-many-wall')).toBeVisible();
    await expect(page.getByTestId('ex-dd-note-many')).toHaveAttribute('data-kind', 'bad');
  });

  // Segmented vs dropdown: the threshold is felt by moving the option count.
  test('segmented-vs-dropdown example: segmented wins at 3, breaks at 12', async ({ page }) => {
    await page.goto(ROUTE);
    await expect(page.getByTestId('ex-sd-note')).toHaveAttribute('data-kind', 'good');
    await expect(page.getByTestId('ex-sd-segmented').locator('button')).toHaveCount(3);
    await page.getByTestId('ex-sd-count-12').click();
    await expect(page.getByTestId('ex-sd-segmented').locator('button')).toHaveCount(12);
    await expect(page.getByTestId('ex-sd-note')).toHaveAttribute('data-kind', 'bad');
    // the dropdown stays compact regardless
    await page.getByTestId('ex-sd-dropdown').click();
    await expect(page.getByTestId('ex-sd-dropdown-list')).toBeVisible();
  });

  // Multi-step form: one page is one click; the wizard adds clicks, hides the end.
  test('multi-step-form example: one page = 1 click; needless wizard costs more', async ({ page }) => {
    await page.goto(ROUTE);
    // one page (default)
    await page.getByTestId('ex-msf-submit').click();
    await expect(page.getByTestId('ex-msf-done')).toBeVisible();
    await expect(page.getByTestId('ex-msf-clicks')).toContainText('1');

    // wizard: same four fields, more clicks, the finish line hidden
    await page.getByTestId('ex-msf-mode-wizard').click();
    await expect(page.getByTestId('ex-msf-step')).toHaveText('step 1 of 3');
    await page.getByTestId('ex-msf-next').click();
    await expect(page.getByTestId('ex-msf-step')).toHaveText('step 2 of 3');
    await page.getByTestId('ex-msf-next').click();
    await page.getByTestId('ex-msf-submit').click();
    await expect(page.getByTestId('ex-msf-done')).toBeVisible();
    await expect(page.getByTestId('ex-msf-clicks')).toContainText('3');
  });

  // Confirmation vs undo: repeated confirms train the dismissal; undo is reversible.
  test('confirmation-vs-undo example: routine confirms train the reflex; undo restores', async ({ page }) => {
    await page.goto(ROUTE);
    // confirm mode (default): three routine confirms → the failure-mode note
    for (let i = 0; i < 3; i++) {
      await page.locator('[data-testid^="ex-cu-del-"]').first().click();
      await expect(page.getByTestId('ex-cu-dialog')).toBeVisible();
      await page.getByTestId('ex-cu-confirm').click();
    }
    await expect(page.getByTestId('ex-cu-habit')).toBeVisible();

    // undo mode: delete is instant + reversible
    await page.getByTestId('ex-cu-mode-undo').click();
    const firstDelete = page.locator('[data-testid^="ex-cu-del-"]').first();
    await firstDelete.click();
    await expect(page.getByTestId('ex-cu-toast')).toHaveAttribute('data-up', 'true');
    const itemsAfterDelete = await page.locator('[data-testid^="ex-cu-item-"]').count();
    await page.getByTestId('ex-cu-undo').click();
    await expect(page.locator('[data-testid^="ex-cu-item-"]')).toHaveCount(itemsAfterDelete + 1);
  });

  // ——————————————————————————————————————————————
  //  M4 entries — anatomy + a real, interactive example
  // ——————————————————————————————————————————————

  test('M4 anatomy: every new entry renders its full anatomy', async ({ page }) => {
    await page.goto(ROUTE);
    const expected: Array<[string, string, string]> = [
      ['progressive-disclosure', 'Progressive disclosure / "show more"', 'disclosure'],
      ['tabs', 'Tabs', 'disclosure'],
      ['search-as-you-type', 'Search-as-you-type', 'input'],
      ['empty-state', 'Empty state', 'content'],
      ['drag-and-drop', 'Drag-and-drop', 'content'],
    ];
    for (const [id, name, cat] of expected) {
      const card = page.getByTestId(`upl-card-${id}`);
      await expect(card.locator('.upl-card__name')).toHaveText(name);
      await expect(card.locator('.upl-card__eyebrow')).toContainText(cat);
      await expect(card.locator('.upl-card__what')).not.toBeEmpty();
      await expect(card.locator('.upl-anat[data-kind="use"] p')).not.toBeEmpty();
      await expect(card.locator('.upl-anat[data-kind="avoid"] p')).not.toBeEmpty();
      await expect(card.locator('.upl-anat[data-kind="instead"] p')).not.toBeEmpty();
    }
  });

  test('M4 examples: all five are present', async ({ page }) => {
    await page.goto(ROUTE);
    for (const id of [
      'ex-progressive-disclosure',
      'ex-tabs',
      'ex-search-as-you-type',
      'ex-empty-state',
      'ex-drag-and-drop',
    ]) {
      await expect(page.getByTestId(id)).toBeVisible();
    }
  });

  // Progressive disclosure: a sensible default vs an essential field buried.
  test('progressive-disclosure example: good hides advanced; bad buries the essential', async ({ page }) => {
    await page.goto(ROUTE);
    // good (default): the essential Email field is visible, advanced is hidden
    await expect(page.getByTestId('ex-pd-essential')).toBeVisible();
    await expect(page.getByTestId('ex-pd-advanced')).toHaveCount(0);
    await page.getByTestId('ex-pd-toggle').click();
    await expect(page.getByTestId('ex-pd-advanced')).toBeVisible();
    // bad: the essential field is now behind "show more" — friction every time
    await page.getByTestId('ex-pd-mode-bad').click();
    await expect(page.getByTestId('ex-pd-essential')).toHaveCount(0);
    await page.getByTestId('ex-pd-toggle').click();
    await expect(page.getByTestId('ex-pd-essential')).toBeVisible();
    await expect(page.getByTestId('ex-pd-note')).toContainText('buried');
  });

  // Tabs: peer sections right; comparison content is the accordion problem.
  test('tabs example: peer sections switch; comparison needs both shown', async ({ page }) => {
    await page.goto(ROUTE);
    // peer mode (default): switching tabs swaps the single panel
    await page.getByTestId('ex-tab-tab-Specs').click();
    await expect(page.getByTestId('ex-tab-panel')).toContainText('512GB');
    // compare mode: one plan at a time, then show both side by side
    await page.getByTestId('ex-tab-mode-compare').click();
    await expect(page.getByTestId('ex-tab-note')).toHaveAttribute('data-kind', 'bad');
    await page.getByTestId('ex-tab-showboth').click();
    await expect(page.getByTestId('ex-tab-both')).toBeVisible();
    await expect(page.getByTestId('ex-tab-note')).not.toHaveAttribute('data-kind', 'bad');
  });

  // Search-as-you-type: instant local vs a request per keystroke vs debounced.
  test('search-as-you-type example: instant is free; per-keystroke is costly; debounced is one', async ({ page }) => {
    await page.goto(ROUTE);
    // instant (default): filters with zero requests
    await page.getByTestId('ex-sat-input').fill('set');
    await expect(page.getByTestId('ex-sat-reqcount')).toHaveText('0');
    await expect(page.getByTestId('ex-sat-results')).toContainText('Settings');

    // costly: a request per keystroke — 4 chars → 4 requests
    await page.getByTestId('ex-sat-mode-costly').click();
    await page.getByTestId('ex-sat-input').pressSequentially('keys', { delay: 60 });
    await expect(page.getByTestId('ex-sat-reqcount')).toHaveText('4');

    // debounced: the same 4 chars settle into a single request
    await page.getByTestId('ex-sat-mode-debounced').click();
    await page.getByTestId('ex-sat-input').pressSequentially('keys', { delay: 60 });
    await expect(page.getByTestId('ex-sat-reqcount')).toHaveText('1', { timeout: 4000 });
  });

  // Empty state (watch-list): blank/bare are dead ends; designed is a doorway.
  test('empty-state example: the designed state is a working doorway', async ({ page }) => {
    await page.goto(ROUTE);
    // blank (default): a literal empty box, nothing actionable
    await expect(page.getByTestId('ex-es-blank')).toBeVisible();
    await expect(page.getByTestId('ex-es-cta')).toHaveCount(0);
    // bare: explains nothing, still no way forward
    await page.getByTestId('ex-es-mode-bare').click();
    await expect(page.getByTestId('ex-es-bare')).toBeVisible();
    await expect(page.getByTestId('ex-es-cta')).toHaveCount(0);
    // designed: orients, explains, and the CTA actually populates the view
    await page.getByTestId('ex-es-mode-designed').click();
    await expect(page.getByTestId('ex-es-designed')).toBeVisible();
    await page.getByTestId('ex-es-cta').click();
    await expect(page.getByTestId('ex-es-populated')).toBeVisible();
  });

  // Drag-and-drop: the fallback controls (deterministic) reorder the list.
  test('drag-and-drop example: drag-only lacks controls; fallback has up/down that work', async ({ page }) => {
    await page.goto(ROUTE);
    // drag-only (default): no up/down controls, a discoverability warning
    await expect(page.getByTestId('ex-dnd-up-alpha')).toHaveCount(0);
    await expect(page.getByTestId('ex-dnd-note')).toHaveAttribute('data-kind', 'bad');

    // fallback: same drag, plus visible controls that perform the reorder
    await page.getByTestId('ex-dnd-mode-fallback').click();
    await expect(page.getByTestId('ex-dnd-list')).toHaveAttribute('data-order', 'alpha,beta,gamma,delta');
    await page.getByTestId('ex-dnd-down-alpha').click();
    await expect(page.getByTestId('ex-dnd-list')).toHaveAttribute('data-order', 'beta,alpha,gamma,delta');
    await page.getByTestId('ex-dnd-up-delta').click();
    await expect(page.getByTestId('ex-dnd-list')).toHaveAttribute('data-order', 'beta,alpha,delta,gamma');
  });

  // The hard one: a REAL pointer drag, exercised the same way on both browsers.
  test('drag-and-drop example: a real pointer drag reorders the list', async ({ page }) => {
    await page.goto(ROUTE);
    await page.getByTestId('upl-card-drag-and-drop').scrollIntoViewIfNeeded();
    const list = page.getByTestId('ex-dnd-list');
    await expect(list).toHaveAttribute('data-order', 'alpha,beta,gamma,delta');

    const handle = page.getByTestId('ex-dnd-handle-alpha');
    const delta = page.getByTestId('ex-dnd-item-delta');
    const h = await handle.boundingBox();
    const d = await delta.boundingBox();
    if (!h || !d) throw new Error('drag targets not measurable');

    // Real pointer input: Playwright dispatches pointerdown/move/up on both
    // Chromium and Firefox. Drag the first row down past the last.
    await page.mouse.move(h.x + h.width / 2, h.y + h.height / 2);
    await page.mouse.down();
    await page.mouse.move(h.x + h.width / 2, h.y + h.height / 2 + 12, { steps: 4 });
    await page.mouse.move(d.x + d.width / 2, d.y + d.height + 8, { steps: 16 });
    await page.mouse.up();

    // 'alpha' dragged to the bottom; the others keep their relative order.
    await expect(list).toHaveAttribute('data-order', 'beta,gamma,delta,alpha');
  });

  // — navigation —

  test('back link returns to the hub', async ({ page }) => {
    await page.goto(ROUTE);
    await page.waitForLoadState('networkidle');
    await page.locator('.tool-page__back').click();
    await page.waitForURL('/');
    await expect(page.locator('.hero__title')).toBeVisible();
  });

  // — screenshots —

  test('screenshot the page, filter and the three entries', async ({ page }, testInfo) => {
    await page.goto(ROUTE);
    await page.waitForLoadState('networkidle');
    await page.addStyleTag({
      content: '*, *::before, *::after { animation-play-state: paused !important; transition: none !important; }',
    });
    await page.waitForTimeout(400);
    await page.screenshot({
      path: `./screenshots/tool-ui-pattern-library-m1-${testInfo.project.name}.png`,
      fullPage: true,
    });
    await page.locator('.upl-toolbar').screenshot({
      path: `./screenshots/tool-ui-pattern-library-m1-toolbar-${testInfo.project.name}.png`,
    });
    for (const id of [
      'modal-dialog',
      'pagination-vs-infinite-scroll',
      'optimistic-vs-pessimistic-ui',
    ]) {
      await page.getByTestId(`upl-card-${id}`).screenshot({
        path: `./screenshots/tool-ui-pattern-library-m1-${id}-${testInfo.project.name}.png`,
      });
    }
  });

  test('screenshot the M2 page and the five new entries', async ({ page }, testInfo) => {
    await page.goto(ROUTE);
    await page.waitForLoadState('networkidle');
    await page.addStyleTag({
      content: '*, *::before, *::after { animation-play-state: paused !important; transition: none !important; }',
    });
    await page.waitForTimeout(400);
    await page.screenshot({
      path: `./screenshots/tool-ui-pattern-library-m2-${testInfo.project.name}.png`,
      fullPage: true,
    });
    for (const id of [
      'toast-notification',
      'tooltip',
      'accordion',
      'inline-validation',
      'skeleton-vs-spinner',
    ]) {
      await page.getByTestId(`upl-card-${id}`).scrollIntoViewIfNeeded();
      await page.getByTestId(`upl-card-${id}`).screenshot({
        path: `./screenshots/tool-ui-pattern-library-m2-${id}-${testInfo.project.name}.png`,
      });
    }
  });

  test('screenshot the M3 page and the five new entries', async ({ page }, testInfo) => {
    await page.goto(ROUTE);
    await page.waitForLoadState('networkidle');
    await page.addStyleTag({
      content: '*, *::before, *::after { animation-play-state: paused !important; transition: none !important; }',
    });
    await page.waitForTimeout(400);
    await page.screenshot({
      path: `./screenshots/tool-ui-pattern-library-m3-${testInfo.project.name}.png`,
      fullPage: true,
    });
    for (const id of [
      'popover',
      'dropdown-menu',
      'segmented-control-vs-dropdown',
      'multi-step-form',
      'confirmation-vs-undo',
    ]) {
      await page.getByTestId(`upl-card-${id}`).scrollIntoViewIfNeeded();
      await page.getByTestId(`upl-card-${id}`).screenshot({
        path: `./screenshots/tool-ui-pattern-library-m3-${id}-${testInfo.project.name}.png`,
      });
    }
  });

  test('screenshot the completed M4 tool and the five new entries', async ({ page }, testInfo) => {
    await page.goto(ROUTE);
    await page.waitForLoadState('networkidle');
    await page.addStyleTag({
      content: '*, *::before, *::after { animation-play-state: paused !important; transition: none !important; }',
    });
    await page.waitForTimeout(400);
    await page.screenshot({
      path: `./screenshots/tool-ui-pattern-library-m4-${testInfo.project.name}.png`,
      fullPage: true,
    });
    for (const id of [
      'progressive-disclosure',
      'tabs',
      'search-as-you-type',
      'empty-state',
      'drag-and-drop',
    ]) {
      await page.getByTestId(`upl-card-${id}`).scrollIntoViewIfNeeded();
      await page.getByTestId(`upl-card-${id}`).screenshot({
        path: `./screenshots/tool-ui-pattern-library-m4-${id}-${testInfo.project.name}.png`,
      });
    }
  });
});

test.describe('UI Pattern Library — D1 card shell (no page scroll)', () => {
  test.use({ viewport: { width: 375, height: 812 } });

  test('the card shell does not scroll the page sideways at mobile', async ({ page }) => {
    await page.goto('/tools/ui-pattern-library');
    await page.waitForLoadState('networkidle');
    const r = await page.evaluate(() => {
      const de = document.documentElement;
      // No card-shell element (card, body, anatomy, catalog, page) overflows.
      let shellOverflow = 0;
      document
        .querySelectorAll(
          '.upl-card, .upl-card__body, .upl-card__anatomy, .upl-catalog, .tool-page'
        )
        .forEach((el) => {
          shellOverflow = Math.max(shellOverflow, el.scrollWidth - el.clientWidth);
        });
      return {
        pageOverflow: de.scrollWidth - de.clientWidth,
        shellOverflow,
      };
    });
    expect(r.pageOverflow).toBeLessThanOrEqual(1);
    expect(r.shellOverflow).toBeLessThanOrEqual(1);
  });

  test('the page does not scroll and every demo has its scroll-containment box', async ({ page }) => {
    await page.goto('/tools/ui-pattern-library');
    const r = await page.evaluate(() => {
      const de = document.documentElement;
      const scrollers = [
        ...document.querySelectorAll('.upl-card__example-scroll'),
      ];
      // The D1 guarantee is the containment mechanism, not that a demo
      // is currently wide. D2a contained the six hard demos, so none may
      // overflow now; the box must still be present and able to contain.
      const allHaveScrollBox = scrollers.every(
        (s) => getComputedStyle(s).overflowX === 'auto'
      );
      return {
        pageOverflow: de.scrollWidth - de.clientWidth,
        count: scrollers.length,
        allHaveScrollBox,
      };
    });
    expect(r.pageOverflow).toBeLessThanOrEqual(1);
    expect(r.count).toBeGreaterThan(0);
    expect(r.allHaveScrollBox).toBe(true);
  });
});

test.describe('UI Pattern Library — D2a-1 (popover, modal, tooltip + chips)', () => {
  test.use({ viewport: { width: 375, height: 812 } });

  test('the .upl-cat filter chips meet the 44px touch floor', async ({ page }) => {
    await page.goto('/tools/ui-pattern-library');
    const chips = page.locator('.upl-cat');
    const n = await chips.count();
    expect(n).toBeGreaterThan(0);
    for (let i = 0; i < n; i++) {
      const b = await chips.nth(i).boundingBox();
      expect(b!.height).toBeGreaterThanOrEqual(44);
    }
  });

  test('the three demos have no internal overflow at rest on mobile', async ({ page }) => {
    await page.goto('/tools/ui-pattern-library');
    const over = await page.evaluate(() =>
      ['popover', 'modal-dialog', 'tooltip'].map((id) => {
        const sc = document.querySelector(
          `[data-testid="upl-card-${id}"] .upl-card__example-scroll`
        );
        return sc ? sc.scrollWidth - sc.clientWidth : -1;
      })
    );
    expect(over).toEqual([0, 0, 0]);
  });

  test('popover, modal and tooltip-popover open without scrolling the page', async ({ page }) => {
    await page.goto('/tools/ui-pattern-library');

    await page.getByTestId('ex-pop-trigger').click();
    await expect(page.getByTestId('ex-pop-popover')).toBeVisible();
    let over = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth
    );
    expect(over).toBeLessThanOrEqual(1);

    await page.getByTestId('ex-modal-delete-trigger').click();
    await expect(page.getByTestId('ex-modal-confirm-dialog')).toBeVisible();
    over = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth
    );
    expect(over).toBeLessThanOrEqual(1);
    await page.getByTestId('ex-modal-confirm-cancel').click();

    await page.getByTestId('ex-tip-mode-popover').click();
    await page.getByTestId('ex-tip-share').click();
    await expect(page.getByTestId('ex-tip-popover')).toBeVisible();
    over = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth
    );
    expect(over).toBeLessThanOrEqual(1);
  });

  test('tooltip hint is reachable by tap, and hover still works', async ({ page }) => {
    await page.goto('/tools/ui-pattern-library');
    const tip = page.getByTestId('ex-tip-tooltip');
    const icon = page.getByTestId('ex-tip-icon');
    await expect(tip).toHaveAttribute('data-on', 'false');

    // Touch path: a tap (click) shows the hint and exposes it via aria.
    await icon.click();
    await expect(tip).toHaveAttribute('data-on', 'true');
    await expect(icon).toHaveAttribute('aria-expanded', 'true');

    // Tapping away (blur) dismisses it, the honest tooltip model.
    await page.getByTestId('ex-tip-share').focus();
    await expect(tip).toHaveAttribute('data-on', 'false');

    // Desktop path unchanged: hover still shows it. Move the pointer away
    // first so hovering the icon fires a fresh mouseenter.
    await page.mouse.move(0, 0);
    await icon.hover();
    await expect(tip).toHaveAttribute('data-on', 'true');

    // The icon itself is a 44px target.
    const box = await icon.boundingBox();
    expect(box!.width).toBeGreaterThanOrEqual(44);
    expect(box!.height).toBeGreaterThanOrEqual(44);
  });
});

test.describe('UI Pattern Library — D2a-2 (toast, tabs, dropdown)', () => {
  test.use({ viewport: { width: 375, height: 812 } });

  // Clip-signature scan: an element that hides overflow while its content
  // is wider than its box is clipping (the D2a-1 lesson, made deterministic).
  const clipScan = (testId: string) =>
    `(() => { const card = document.querySelector('[data-testid="upl-card-${testId}"]'); if (!card) return -1; let n = 0; card.querySelectorAll('*').forEach((el) => { const cs = getComputedStyle(el); if (/hidden|clip/.test(cs.overflowX) && el.scrollWidth > el.clientWidth + 1) n++; }); const sc = card.querySelector('.upl-card__example-scroll'); return n + (sc && sc.scrollWidth > sc.clientWidth + 1 ? 100 : 0); })()`;

  test('toast, tabs and dropdown have no clipped or overflowing content at rest', async ({ page }) => {
    await page.goto('/tools/ui-pattern-library');
    for (const id of ['toast-notification', 'tabs', 'dropdown-menu']) {
      const score = await page.evaluate(clipScan(id));
      expect(score, `${id} clip/overflow score`).toBe(0);
    }
    const over = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth
    );
    expect(over).toBeLessThanOrEqual(1);
  });

  test('the tabs mode toggle stacks on mobile with its labels not clipped', async ({ page }) => {
    await page.goto('/tools/ui-pattern-library');
    const r = await page.evaluate(() => {
      const seg = document.querySelector('[data-testid="upl-card-tabs"] .upl-ex-tb__seg');
      if (!seg) return null;
      const dir = getComputedStyle(seg).flexDirection;
      const btns = [...seg.querySelectorAll('button')];
      const anyClipped = btns.some((b) => b.scrollWidth > b.clientWidth + 1);
      const minH = Math.min(...btns.map((b) => b.getBoundingClientRect().height));
      return { dir, anyClipped, minH };
    });
    expect(r!.dir).toBe('column');
    expect(r!.anyClipped).toBe(false);
    expect(r!.minH).toBeGreaterThanOrEqual(44);
  });

  test('the country dropdown opens within the viewport with 44px options', async ({ page }) => {
    await page.goto('/tools/ui-pattern-library');
    await page.getByTestId('ex-dd-many-trigger').click();
    await expect(page.getByTestId('ex-dd-many-list')).toBeVisible();
    const r = await page.evaluate(() => {
      const de = document.documentElement;
      const list = document.querySelector('[data-testid="ex-dd-many-list"]');
      const lr = list!.getBoundingClientRect();
      const opt = list!.querySelector('button')!.getBoundingClientRect();
      return {
        within: lr.left >= 0 && lr.right <= de.clientWidth + 1,
        pageOver: de.scrollWidth - de.clientWidth,
        optH: opt.height,
      };
    });
    expect(r.within).toBe(true);
    expect(r.pageOver).toBeLessThanOrEqual(1);
    expect(r.optH).toBeGreaterThanOrEqual(44);
  });

  test('the undo toast slides in within the stage, not the page', async ({ page }) => {
    await page.goto('/tools/ui-pattern-library');
    await page.getByTestId('ex-toast-mode-toast').click();
    await page.getByTestId('ex-toast-delete').click();
    await expect(page.getByTestId('ex-toast-undo-toast')).toHaveAttribute('data-up', 'true');
    const r = await page.evaluate(() => {
      const de = document.documentElement;
      const toast = document.querySelector('[data-testid="ex-toast-undo-toast"]')!.getBoundingClientRect();
      const stage = document.querySelector(
        '[data-testid="upl-card-toast-notification"] .upl-ex-tn__stage'
      )!.getBoundingClientRect();
      return {
        within: toast.left >= stage.left - 1 && toast.right <= stage.right + 1,
        pageOver: de.scrollWidth - de.clientWidth,
      };
    });
    expect(r.within).toBe(true);
    expect(r.pageOver).toBeLessThanOrEqual(1);
    const undoH = (await page.getByTestId('ex-toast-undo-toast-btn').boundingBox())!.height;
    expect(undoH).toBeGreaterThanOrEqual(44);
  });
});

test.describe('UI Pattern Library — D2b (the remaining twelve demos)', () => {
  test.use({ viewport: { width: 375, height: 812 } });

  // The twelve lighter-pass demos, by card id.
  const TWELVE = [
    'accordion',
    'confirmation-vs-undo',
    'drag-and-drop',
    'empty-state',
    'inline-validation',
    'multi-step-form',
    'optimistic-vs-pessimistic-ui',
    'pagination-vs-infinite-scroll',
    'progressive-disclosure',
    'search-as-you-type',
    'segmented-control-vs-dropdown',
    'skeleton-vs-spinner',
  ];

  // Effective tappable area = the visible box plus any ::after hit-expander's
  // negative insets (the established shared-class technique). Returns the
  // smallest control found in the card, or null if the card is absent.
  const scanCard = (id: string) =>
    `(() => {
      const card = document.querySelector('[data-testid="upl-card-${id}"]');
      if (!card) return null;
      let minH = Infinity, minW = Infinity, worst = '';
      card.querySelectorAll('button, input, select, textarea').forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.width === 0 || r.height === 0) return;
        const a = getComputedStyle(el, '::after');
        let exX = 0, exY = 0;
        if (a.position === 'absolute') {
          const t = Math.abs(parseFloat(a.top) || 0);
          const b = Math.abs(parseFloat(a.bottom) || 0);
          const l = Math.abs(parseFloat(a.left) || 0);
          const ri = Math.abs(parseFloat(a.right) || 0);
          exY = (parseFloat(a.top) < 0 ? t : 0) + (parseFloat(a.bottom) < 0 ? b : 0);
          exX = (parseFloat(a.left) < 0 ? l : 0) + (parseFloat(a.right) < 0 ? ri : 0);
        }
        const h = r.height + exY, w = r.width + exX;
        if (h < minH) { minH = h; }
        if (w < minW) { minW = w; worst = el.className + '|' + el.tagName; }
      });
      return { minH, minW, worst };
    })()`;

  test('every control in the twelve demos meets the 44px floor at rest', async ({ page }) => {
    await page.goto('/tools/ui-pattern-library');
    await page.waitForLoadState('networkidle');
    for (const id of TWELVE) {
      const r = (await page.evaluate(scanCard(id))) as
        | { minH: number; minW: number; worst: string }
        | null;
      expect(r, `${id} card present`).not.toBeNull();
      expect(r!.minH, `${id} min control height (${r!.worst})`).toBeGreaterThanOrEqual(44);
      expect(r!.minW, `${id} min control width (${r!.worst})`).toBeGreaterThanOrEqual(44);
    }
    const over = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth
    );
    expect(over).toBeLessThanOrEqual(1);
  });

  test('controls revealed only after interaction also meet the 44px floor', async ({ page }) => {
    await page.goto('/tools/ui-pattern-library');

    // Empty-state: the CTA only exists in "designed" mode.
    await page.getByTestId('ex-es-mode-designed').click();
    const cta = page.getByTestId('ex-es-cta');
    await expect(cta).toBeVisible();
    expect((await cta.boundingBox())!.height).toBeGreaterThanOrEqual(44);

    // Accordion: tab-mode tabs and an expanded accordion head.
    await page.getByTestId('ex-acc-mode-tabs').click();
    const accTab = page.getByTestId('ex-acc-tab-pro');
    await expect(accTab).toBeVisible();
    expect((await accTab.boundingBox())!.height).toBeGreaterThanOrEqual(44);
    await page.getByTestId('ex-acc-mode-accordion').click();
    const accHead = page.getByTestId('ex-acc-head-team');
    await expect(accHead).toBeVisible();
    expect((await accHead.boundingBox())!.height).toBeGreaterThanOrEqual(44);

    // Multi-step wizard: back/next/submit chrome.
    await page.getByTestId('ex-msf-mode-wizard').click();
    const msfNext = page.getByTestId('ex-msf-next');
    await expect(msfNext).toBeVisible();
    expect((await msfNext.boundingBox())!.height).toBeGreaterThanOrEqual(44);

    // Confirmation dialog buttons.
    await page.getByTestId('ex-cu-del-notes.md').click();
    const cuConfirm = page.getByTestId('ex-cu-confirm');
    await expect(cuConfirm).toBeVisible();
    expect((await cuConfirm.boundingBox())!.height).toBeGreaterThanOrEqual(44);
    await page.getByTestId('ex-cu-cancel').click();

    // Segmented-vs-dropdown: 12-option pills and the open dropdown list.
    await page.getByTestId('ex-sd-count-12').click();
    const pill = page.getByTestId('ex-sd-seg-Decade');
    await expect(pill).toBeVisible();
    expect((await pill.boundingBox())!.height).toBeGreaterThanOrEqual(44);
    await page.getByTestId('ex-sd-dropdown').click();
    const ddList = page.getByTestId('ex-sd-dropdown-list');
    await expect(ddList).toBeVisible();
    const optH = await page.evaluate(() => {
      const b = document.querySelector('[data-testid="ex-sd-dropdown-list"] button');
      return b ? b.getBoundingClientRect().height : -1;
    });
    expect(optH).toBeGreaterThanOrEqual(44);
  });

  test('the drag-and-drop demo is operable by touch, not mouse-only', async ({ page }) => {
    await page.goto('/tools/ui-pattern-library');
    // The drag is wired with Pointer Events (which fire for touch) and the row
    // sets touch-action:none — that is the property that lets a finger drag
    // instead of the page scrolling. Without it the drag path is touch-broken.
    const ta = await page.evaluate(() => {
      const row = document.querySelector('[data-testid="ex-dnd-item-alpha"]');
      return row ? getComputedStyle(row).touchAction : '';
    });
    expect(ta).toBe('none');

    // The decisive proof of touch-operability: the fallback up/down controls
    // reorder on a plain click (a tap), no drag needed at all.
    await page.getByTestId('ex-dnd-mode-fallback').click();
    const before = await page.getByTestId('ex-dnd-list').getAttribute('data-order');
    await page.getByTestId('ex-dnd-down-alpha').click();
    const after = await page.getByTestId('ex-dnd-list').getAttribute('data-order');
    expect(after).not.toBe(before);

    // Those controls keep their 26px look but expand to a 44px tap area.
    const tap = await page.evaluate(() => {
      const el = document.querySelector('[data-testid="ex-dnd-down-beta"]');
      if (!el) return 0;
      const r = el.getBoundingClientRect();
      const a = getComputedStyle(el, '::after');
      const y = Math.abs(parseFloat(a.top) || 0) + Math.abs(parseFloat(a.bottom) || 0);
      const x = Math.abs(parseFloat(a.left) || 0) + Math.abs(parseFloat(a.right) || 0);
      return Math.min(r.height + y, r.width + x);
    });
    expect(tap).toBeGreaterThanOrEqual(44);
  });

  test('the migrated Accordion and Segmented breakpoints reflow on the canonical bands', async ({ page }) => {
    const trackCount = (sel: string) =>
      `(() => { const el = document.querySelector('${sel}'); if (!el) return -1; return getComputedStyle(el).gridTemplateColumns.split(' ').length; })()`;

    // Mobile (375): both collapse to a single column.
    await page.goto('/tools/ui-pattern-library');
    await page.setViewportSize({ width: 375, height: 812 });
    await page.getByTestId('ex-acc-mode-showall').click();
    expect(await page.evaluate(trackCount('[data-testid="upl-card-accordion"] .upl-ex-ac__grid'))).toBe(1);
    expect(
      await page.evaluate(
        trackCount('[data-testid="upl-card-segmented-control-vs-dropdown"] .upl-ex-sd__grid')
      )
    ).toBe(1);

    // Tablet (768): the audited multi-column layout is preserved.
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.getByTestId('ex-acc-mode-showall').click();
    expect(await page.evaluate(trackCount('[data-testid="upl-card-accordion"] .upl-ex-ac__grid'))).toBe(3);
    expect(
      await page.evaluate(
        trackCount('[data-testid="upl-card-segmented-control-vs-dropdown"] .upl-ex-sd__grid')
      )
    ).toBe(2);
  });

  test('screenshot a representative sample of the twelve demos at mobile', async ({ page }, testInfo) => {
    await page.goto('/tools/ui-pattern-library');
    await page.waitForLoadState('networkidle');
    await page.addStyleTag({
      content: '*, *::before, *::after { animation-play-state: paused !important; transition: none !important; }',
    });
    await page.waitForTimeout(300);
    for (const id of [
      'accordion',
      'confirmation-vs-undo',
      'drag-and-drop',
      'multi-step-form',
      'pagination-vs-infinite-scroll',
      'segmented-control-vs-dropdown',
    ]) {
      await page.getByTestId(`upl-card-${id}`).scrollIntoViewIfNeeded();
      await page.getByTestId(`upl-card-${id}`).screenshot({
        path: `./screenshots/d2b-${id}-${testInfo.project.name}.png`,
      });
    }
  });
});
