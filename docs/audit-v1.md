> **Historical document — do not treat as current.**
> This is a snapshot of Cargo as it stood on 2026-05-16, kept for context on how
> the project got here. It describes seven tools and a `prompt-builder` route
> that was later cut; the project now ships ten tools across fifteen routes. For
> the current state, read the [README](../README.md) and `src/lib/tools.ts`.

# Cargo v1 — read-only audit

Generated 2026-05-16. Captures the v1 state for the v2 architect.

> Note: The brief stated "208 Playwright tests passing." The actual count is **224** (112 unique × 2 projects). All 224 pass; 2 flaked once and passed on retry. Details in §4 and §9.

---

## 1. Project metadata

**`package.json`**

- `name`: `cargo`
- `version`: `0.1.0`
- `private`: `true`

**Scripts**

| script | command |
|---|---|
| `dev` | `next dev --webpack` |
| `build` | `next build --webpack` |
| `start` | `next start` |
| `lint` | `eslint` |
| `test` | `playwright test` |

**Dependencies**

- `next`: `16.2.6`
- `react`: `19.2.4`
- `react-dom`: `19.2.4`

**devDependencies**

- `@playwright/test`: `^1.60.0` (resolved: 1.60.0)
- `@types/node`: `^20`
- `@types/react`: `^19`
- `@types/react-dom`: `^19`
- `eslint`: `^9`
- `eslint-config-next`: `16.2.6`
- `typescript`: `^5`

**Runtime versions**

- Node: `v22.16.0`
- Next.js: `16.2.6` (App Router, **webpack** bundler — not turbopack)
- React: `19.2.4`
- Playwright: `1.60.0`

No CSS framework, no CSS-in-JS, no state library, no animation library, no ORM. Stack is intentionally minimal: Next + React + plain CSS + Playwright.

---

## 2. File tree

```
.
|-- .gitignore
|-- README.md
|-- eslint.config.mjs
|-- next.config.ts
|-- package-lock.json
|-- package.json
|-- playwright.config.ts
|-- public
|   `-- favicon.svg
|-- src
|   |-- app
|   |   |-- globals.css
|   |   |-- layout.tsx
|   |   |-- page.tsx
|   |   `-- tools
|   |       |-- css-effect-lab
|   |       |-- easing-cookbook
|   |       |-- loading-states
|   |       |-- mockup-wrapper
|   |       |-- moodboard-library
|   |       |-- prompt-builder
|   |       `-- type-scale
|   |-- components
|   |   |-- Footer.tsx
|   |   |-- ManifestStrip.tsx
|   |   |-- ThemeToggle.tsx
|   |   |-- ToolCard.tsx
|   |   |-- Topbar.tsx
|   |   |-- TopbarNav.tsx
|   |   `-- previews
|   |       |-- CssEffectLabPreview.tsx
|   |       |-- EasingCookbookPreview.tsx
|   |       |-- LoadingStatesPreview.tsx
|   |       |-- MockupWrapperPreview.tsx
|   |       |-- MoodboardPreview.tsx
|   |       |-- PromptBuilderPreview.tsx
|   |       `-- TypeScalePreview.tsx
|   `-- lib
|       |-- easings.ts
|       |-- loading-states.ts
|       |-- mockup-frames.ts
|       |-- moodboards.ts
|       |-- prompt-builder.ts
|       |-- tools.ts
|       `-- type-scale.ts
|-- tests
|   |-- css-effect-lab.spec.ts
|   |-- easing-cookbook.spec.ts
|   |-- hub.spec.ts
|   |-- loading-states.spec.ts
|   |-- mockup-wrapper.spec.ts
|   |-- moodboard-library.spec.ts
|   |-- prompt-builder.spec.ts
|   `-- type-scale.spec.ts
`-- tsconfig.json

16 directories, 40 files
```

Each tool route has the convention `tools/<tool>/page.tsx` (server entry) + `tools/<tool>/<ToolName>.tsx` (client component) plus per-tool helper components in the same folder. Hub previews live in `src/components/previews/` (one per tool).

---

## 3. Build baseline

**`npm run build`** — full output verbatim:

```
> cargo@0.1.0 build
> next build --webpack

⚠ Warning: Next.js inferred your workspace root, but it may not be correct.
 We detected multiple lockfiles and selected the directory of /Users/terra/Developer/cargo/package-lock.json as the root directory.
 To silence this warning, set `outputFileTracingRoot` in your Next.js config, or consider removing one of the lockfiles if it's not needed.
   See https://nextjs.org/docs/app/api-reference/config/next-config-js/output#caveats for more information.
 Detected additional lockfiles:
   * /Users/terra/Developer/cargo/.claude/worktrees/interesting-hypatia-f808cf/package-lock.json

▲ Next.js 16.2.6 (webpack)

  Creating an optimized production build ...
✓ Compiled successfully in 1896ms
  Running TypeScript ...
  Finished TypeScript in 1101ms ...
  Collecting page data using 11 workers ...
  Generating static pages using 11 workers (0/10) ...
  Generating static pages using 11 workers (2/10)
  Generating static pages using 11 workers (4/10)
  Generating static pages using 11 workers (7/10)
✓ Generating static pages using 11 workers (10/10) in 294ms
  Finalizing page optimization ...
  Collecting build traces ...

Route (app)
┌ ○ /
├ ○ /_not-found
├ ○ /tools/css-effect-lab
├ ○ /tools/easing-cookbook
├ ○ /tools/loading-states
├ ○ /tools/mockup-wrapper
├ ○ /tools/moodboard-library
├ ○ /tools/prompt-builder
└ ○ /tools/type-scale


○  (Static)  prerendered as static content
```

**Note:** Next.js 16 with `--webpack` does **not** print per-route sizes (this is by design for the webpack bundler in v16; turbopack mode prints them but the project pins webpack via `--webpack` in both `dev` and `build`). Route weights are derived from `.next/static/chunks` instead:

**Per-route chunk sizes** (from `.next/static/chunks/app/tools/*/page-*.js`):

| route | chunk size (bytes) |
|---|---|
| `/` (hub) | 183 |
| `/tools/css-effect-lab` | 4,657 |
| `/tools/easing-cookbook` | 3,127 |
| `/tools/loading-states` | 13,106 |
| `/tools/mockup-wrapper` | 10,564 |
| `/tools/moodboard-library` | 11,164 |
| `/tools/prompt-builder` | 6,036 |
| `/tools/type-scale` | 10,262 |

**Shared chunks** in `.next/static/chunks/`:

- `framework-*.js`: 189,667 B
- `main-*.js`: 137,322 B
- `polyfills-*.js`: 112,594 B
- `0937d497-*.js`: 199,863 B (vendor)
- `858-*.js`: 222,186 B (vendor)
- `202-*.js`: 8,696 B
- `webpack-*.js`: 3,326 B
- `main-app-*.js`: 512 B

**CSS bundle:** `.next/static/css/bad87a88abcf7341.css` — **20,002 B** (single file, all globals.css served on every page).

**Total `.next` directory size:** `70M` (`du -sh .next`).

---

## 4. Test baseline

**Command:** `npx playwright test`

- **Total tests:** 224 (112 unique × 2 projects: `chromium-light` + `chromium-dark`)
- **First run:** 222 passed / 2 failed / **runtime 1.3m** (6 workers, `fullyParallel: false`)
- **Failures (run 1):**
  1. `chromium-light › tests/loading-states.spec.ts:85 › back link returns to the hub` — `page.waitForURL('/')` timeout after 60s; logs show page re-navigated to `/tools/loading-states` four times instead of going home.
  2. `chromium-light › tests/mockup-wrapper.spec.ts:97 › back link returns to the hub` — same failure mode.
- **Retry 1** (all 7 light-mode `back link returns to the hub` tests, isolated): all 7 passed in 7.6s.
- **Retry 2** (same set): all 7 passed in 5.5s.
- **Verdict:** Confirmed **flaky**, not a regression. The brief named `moodboard-library` as the suspected flake; in this run `moodboard-library` passed and `loading-states` + `mockup-wrapper` failed instead — i.e. **the flake is generic to all `back link returns to the hub` assertions**, not specific to one tool. Pattern: dev-mode webServer occasionally hot-reloads the page during the test, causing repeated re-navigation. See §9 for the root-cause hypothesis.

**Per-spec test counts** (single-project; ×2 for the full run):

| spec file | test() count |
|---|---|
| `tests/css-effect-lab.spec.ts` | 10 |
| `tests/easing-cookbook.spec.ts` | 12 |
| `tests/hub.spec.ts` | 19 |
| `tests/loading-states.spec.ts` | 11 |
| `tests/mockup-wrapper.spec.ts` | 13 |
| `tests/moodboard-library.spec.ts` | 15 |
| `tests/prompt-builder.spec.ts` | 13 |
| `tests/type-scale.spec.ts` | 19 |
| **total** | **112** unique → 224 with both projects |

Playwright config: `fullyParallel: false`, `timeout: 60_000`, `navigationTimeout: 60_000`, both projects at viewport `1280×800`, dev server (`npm run dev`) reused if running.

---

## 5. `globals.css` inventory

File: [`src/app/globals.css`](src/app/globals.css), 1073 lines, ~20 KB minified.

Two web fonts are loaded via `@import` at the top: **Instrument Serif** + **IBM Plex Mono** (Google Fonts) and **General Sans** 400/500/600 (Fontshare).

### (a) CSS custom properties

**Type stacks** (`:root`, no dark override)

| variable | value |
|---|---|
| `--font-sans` | `'General Sans', -apple-system, BlinkMacSystemFont, 'Helvetica Neue', sans-serif` |
| `--font-serif` | `'Instrument Serif', Georgia, 'Times New Roman', serif` |
| `--font-mono` | `'IBM Plex Mono', ui-monospace, 'SF Mono', Menlo, monospace` |

**Type scale**

| variable | value |
|---|---|
| `--text-xs` | `11px` |
| `--text-sm` | `13px` |
| `--text-base` | `14px` |
| `--text-md` | `16px` |
| `--text-lg` | `18px` |
| `--text-xl` | `22px` |
| `--text-2xl` | `28px` |
| `--text-3xl` | `40px` (clamped to 32px below 720px) |
| `--text-4xl` | `56px` (clamped to 40px below 720px) |

**Spacing**

| variable | value |
|---|---|
| `--space-1` | `4px` |
| `--space-2` | `8px` |
| `--space-3` | `12px` |
| `--space-4` | `16px` |
| `--space-5` | `20px` |
| `--space-6` | `24px` |
| `--space-8` | `32px` |
| `--space-10` | `40px` |
| `--space-12` | `48px` |
| `--space-16` | `64px` |
| `--space-20` | `80px` |
| `--space-24` | `96px` |

**Radii**

| variable | value |
|---|---|
| `--radius-sm` | `3px` |
| `--radius-md` | `6px` |
| `--radius-lg` | `10px` |
| `--radius-xl` | `16px` |
| `--radius-pill` | `999px` |

**Colors** (all theme-aware; values shown as `light → dark`)

| variable | light | dark |
|---|---|---|
| `--bg` | `#FAFAF7` | `#0F0F0E` |
| `--surface` | `#FFFFFF` | `#1A1A18` |
| `--surface-muted` | `#F0EFE9` | `#232220` |
| `--border` | `rgba(24, 24, 27, 0.09)` | `rgba(244, 244, 240, 0.10)` |
| `--border-strong` | `rgba(24, 24, 27, 0.18)` | `rgba(244, 244, 240, 0.22)` |
| `--text` | `#18181B` | `#F4F4F0` |
| `--text-muted` | `#57534E` | `#A8A29E` |
| `--text-faint` | `#A8A29E` | `#57534E` |
| `--accent` | `#C2410C` (burnt orange) | `#FB923C` (light orange) |
| `--accent-hover` | `#9A3412` | `#FDBA74` |
| `--accent-soft` | `#FDEDD8` | `rgba(251, 146, 60, 0.14)` |

Dark mode applies via both `@media (prefers-color-scheme: dark) :root:not([data-theme="light"])` and explicit `:root[data-theme="dark"]`. `ThemeToggle.tsx` cycles `auto → light → dark → auto` by setting `data-theme` on `<html>`.

**Motion**

| variable | value |
|---|---|
| `--t-fast` | `120ms` |
| `--t-base` | `220ms` |
| `--t-slow` | `400ms` |
| `--ease` | `cubic-bezier(0.4, 0, 0.2, 1)` |
| `--ease-out` | `cubic-bezier(0.16, 1, 0.3, 1)` |

### (b) Class selectors

**Reset / base** (element selectors only)
- `*, *::before, *::after` — box-sizing reset
- `html` — font smoothing, text-rendering
- `body` — applies `--font-sans`, base color/bg, theme transition
- `a` — `color: inherit; text-decoration: none`
- `::selection` — accent background

**Layout containers**
- `.container` — max 1040px, centered, horizontal `--space-6` padding
- `.topbar` — sticky top, blur backdrop, semi-transparent bg
- `.topbar__inner` — flex row, brand left, nav + theme-toggle right
- `.topbar__brand` — flex row with logo mark + word "cargo"
- `.topbar__mark` — 16×16 SVG-like wordmark drawn with `::before`/`::after`
- `.topbar__nav` — mono caps nav links
- `.topbar__nav a` — link transitions, hover/active state
- `.topbar__nav a.is-active` — accent underline
- `.hero` — 80px top / 48px bottom padding section
- `.hero__eyebrow` — pre-title eyebrow margin
- `.hero__title` — display heading, 56px, sans
- `.hero__title em` — italic-serif accent inline
- `.hero__lead` — 18px muted intro paragraph
- `.hero__actions` — button row below hero
- `.manifest` — 4-column manifest strip (top/bottom border)
- `.manifest__item`, `.manifest__label`, `.manifest__value` — manifest cells
- `.hub-section`, `.hub-section__header` — hub list section + heading
- `.tool-list` — flex column of tool cards
- `.principle` — pull-quote section with top border
- `.principle__eyebrow`, `.principle__quote`, `.principle__attribution` — pull-quote parts
- `.footer` — border-top, mono caps, justify-between

**Tool card (hub)**
- `.tool-card` — grid `1fr 140px`, padded card, hover transitions
- `.tool-card:hover .tool-card__title` — accent color on hover
- `.tool-card__manifest` — abs-positioned mono manifest number top-right
- `.tool-card__category` — mono caps category label
- `.tool-card__title` — 22px sans tool name
- `.tool-card__desc` — 13px muted description
- `.tool-card__preview` — 120px-tall preview slot (surface-muted bg)
- `.tool-card--coming-soon` — dimmed/disabled variant (not currently used; all 7 shipped)

**Buttons**
- `.btn` — default sans button, surface bg, border
- `.btn:hover`, `.btn:active` — hover border, active press
- `.btn--primary` — inverted (text bg, bg text)
- `.btn--ghost` — transparent borderless variant
- `.btn--sm` — smaller padding/font

**Form controls**
- `.field` — flex column with label-on-top spacing
- `.field__label` — mono caps label, with right-side `.field__value`
- `.field__value` — tabular-numerics value display
- `.input`, `.select` — text/select input, accent focus ring
- `.slider` — range input, 2px track, 16px round thumb
- `.textarea` — multi-line input with `min-height: 88px`, `resize: vertical`

**Panels**
- `.panel` — surface bg, border, `--radius-lg`, padded
- `.panel__title` — mono caps with horizontal rule via `::after`

**Tags**
- `.tag` — mono inline label, `+` prefix in accent
- `.tag-group` — flex-wrap row of tags
- `.tag--soon` — dashed-border pill variant for coming-soon tools (no `+`)

**Code blocks**
- `.code` — surface-muted bg, mono, padded, scroll-x for long lines, with copy button slot
- `.code__copy` — abs-positioned copy button top-right
- `.code .k`, `.code .c`, `.code .s` — keyword/comment/string syntax-highlight hooks (unused in v1; available for v2)
- `.code--prose` — variant that wraps long lines (used by prompt-builder)

**Theme toggle**
- `.theme-toggle` — small bordered button, mono label

**Typography utilities**
- `.eyebrow` — mono caps preamble label (also `.eyebrow--accent`)
- `.heading` — sans bold display heading base
- `.heading--xl`, `.heading--lg`, `.heading--md` — heading sizes
- `.heading--serif` — italic-serif variant
- `.lead` — 16px muted paragraph, max 62ch
- `.serif-flourish` — italic-serif inline accent

**Tool page chrome**
- `.tool-page` — 48px top / 64px bottom padding
- `.tool-page__back` — back-arrow Link to `/`, mono caps
- `.tool-page__header` — header block
- `.tool-page__eyebrow` — eyebrow above title
- `.tool-page__title` — 40px sans tool title
- `.tool-page__desc` — 16px muted description

**`.lab` system** (CSS Effect Lab, Type & Spacing Scale, Mockup Wrapper)
- `.lab` — CSS Grid `320px 1fr` / areas `'panel preview' / 'code code'`
- `.lab__panel`, `.lab__preview-wrap`, `.lab__code-wrap` — grid areas
- `.lab__preview` — visual surface inside preview-wrap (used by CSS Effect Lab; mockup-wrapper and type-scale supply their own bordered surface inside `.lab__preview-wrap`)
- `.lab__backdrop` — gradient backdrop used inside CSS Effect Lab preview
- `.lab__glass`, `.lab__glass-label`, `.lab__glass-value`, `.lab__glass-meta` — glass-card sample contents
- `.lab__panel .field { margin-bottom: var(--space-5); }` — auto-spacing of fields stacked in the panel

**`.tint-toggle`** (segmented control — the closest thing v1 has to a tab pattern)
- `.tint-toggle` — flex row with 1px border, rounded
- `.tint-toggle__option` — flex-1 option button, mono caps
- `.tint-toggle__option--active` — inverted (text bg)

**`.bool-toggle`** (on/off chip)
- `.bool-toggle` — label-left, button-right flex row
- `.bool-toggle__btn` — pill button with mono caps
- `.bool-toggle__btn--on` — accent-filled active state

**`.catalog` system** (Easing Cookbook, Loading States — note Moodboard uses its own `.mb-catalog`)
- `.catalog` — 4-col grid → 2-col @ 980px → 1-col @ 520px
- `.easing-card`, `.easing-card__head`, `.easing-card__name`, `.easing-card__category` — card structure
- `.easing-card__curve`, `.easing-card__curve svg`, `.easing-card__curve-path`, `.easing-card__curve-axis`, `.easing-card__curve-endpoint` — SVG curve preview area
- `.easing-card__demo`, `.easing-card__demo-dot` — looping dot demo
- `.easing-card__value`, `.easing-card__value-text`, `.easing-card__copy-hint` — footer with bezier value + copy hint
- `.easing-card[data-copied="true"]` — copy-confirmation state
- `.loader-card__preview` — variant of the card preview area for loading-states (extends `.easing-card` styling)

**`.builder` system** (Prompt Builder)
- `.builder` — flex column, gap `--space-5`
- `.builder__form` — surface bg, border, padded form panel
- `.builder__form-grid` — 4-col grid → 2-col @ 860px → 1-col @ 480px
- `.builder__notes-field` — bottom-margin spacing for the freeform notes textarea

### (c) Global `@keyframes`

- `fade-up` — translateY(8px → 0) + opacity 0 → 1; applied to direct children of `.hero` with staggered delays.
- `cargo-ease-slide` — left: 4px ↔ calc(100% - 12px), used by `.easing-card__demo-dot` (2.4s loop).

That's **2** global keyframes. All other animations (`ls-shimmer`, `ls-rotate`, `ls-pulse`, `ls-bounce`, `ls-progress`, `ls-wave`) live in tool-scoped `<style>` blocks — see §6.

---

## 6. Tool-scoped CSS inventory

Three tools the brief named, plus a fourth (Mockup Wrapper) that follows the same architecture but wasn't called out.

### Loading States Gallery — `ls-*`
File: [`src/app/tools/loading-states/LoadingStates.tsx`](src/app/tools/loading-states/LoadingStates.tsx) (lines 8–145)

| class | description |
|---|---|
| `.ls-skeleton` | flex column with `8px` gap (3 shimmering bar children) |
| `.ls-skeleton__line` | 10px-tall shimmer bar; `nth-child` controls widths (100/80/60%) |
| `.ls-card-skeleton` | bordered card stack with multiple shimmer pieces |
| `.ls-card-skeleton > *` | shared shimmer animation for children |
| `.ls-card-skeleton__title` | 55% width title placeholder |
| `.ls-card-skeleton__line` | 100% width line placeholder |
| `.ls-card-skeleton__button` | small button placeholder |
| `.ls-spinner` | 28px classic border-spinner |
| `.ls-spinner-conic` | 32px conic-gradient + radial-mask spinner |
| `.ls-pulse-dots` | flex row of three opacity-pulsing dots |
| `.ls-bouncing-dots` | flex row of three vertical-bouncing dots |
| `.ls-progress` | 4px bar with 30%-wide moving fill |
| `.ls-progress__fill` | the moving fill element |
| `.ls-wave` | flex row of five scaleY-pulsing bars |

Scoped keyframes: `ls-shimmer`, `ls-rotate`, `ls-pulse`, `ls-bounce`, `ls-progress`, `ls-wave` (six).

### Type & Spacing Scale — `ts-*`
File: [`src/app/tools/type-scale/TypeScale.tsx`](src/app/tools/type-scale/TypeScale.tsx) (lines 55–144)

| class | description |
|---|---|
| `.ts-preview-wrap` | bordered surface panel for the two specimens |
| `.ts-section__title` | mono caps section heading with horizontal rule after |
| `.ts-type-row` | 3-col grid `90px / 56px / 1fr` (name / size / sample) |
| `.ts-type-row__name` | mono row label |
| `.ts-type-row__size` | mono tabular-nums size column |
| `.ts-type-row__sample` | sans live-rendered sample (truncates with ellipsis) |
| `.ts-space-row` | 3-col grid `90px / 1fr / 56px` (name / bar / value) |
| `.ts-space-row__name` | mono row label |
| `.ts-space-row__bar-wrap` | 14px-tall bar container |
| `.ts-space-row__bar` | accent-filled bar; width set inline |
| `.ts-space-row__value` | right-aligned mono px value |

No scoped keyframes.

### Moodboard Library — `mb-*`
File: [`src/app/tools/moodboard-library/MoodboardLibrary.tsx`](src/app/tools/moodboard-library/MoodboardLibrary.tsx) (lines 8–136)

| class | description |
|---|---|
| `.mb-catalog` | 3-col grid → 2-col @ 860px → 1-col @ 520px (note: this is wider than `.catalog`'s default 4-col) |
| `.mb-card` | full moodboard card (cursor pointer, hover transition) |
| `.mb-card[data-copied="true"]` | copy-confirmation accent border |
| `.mb-card__head` | head row with name + category |
| `.mb-card__name` | sans card title |
| `.mb-card__category` | mono caps category tag |
| `.mb-card__specimen` | aspect-ratio 280:140 SVG specimen wrapper |
| `.mb-card__palette` | 56px-tall horizontal swatch strip |
| `.mb-card__swatch` | flex-1 color swatch (inline `background` style) |
| `.mb-card__tagline` | italic-serif tagline below specimen |
| `.mb-card__meta` | flex column of metadata rows |
| `.mb-card__meta-row`, `.mb-card__meta-label`, `.mb-card__meta-value` | label-value pairs |
| `.mb-card__footer` | bottom row with copy hint |
| `.mb-card__copy-hint` | mono caps "copy css" text, accent on copied state |

No scoped keyframes.

### Mockup Wrapper — `mw-*` (not called out in brief but follows the same pattern)
File: [`src/app/tools/mockup-wrapper/MockupWrapper.tsx`](src/app/tools/mockup-wrapper/MockupWrapper.tsx) (lines 207–277)

| class | description |
|---|---|
| `.mw-drop` | dashed file-drop zone (hover/drag-over states) |
| `.mw-drop__filename` | filename caption below drop zone |
| `.mw-canvas-wrap` | bordered surface holding the rendered canvas |
| `.mw-canvas` | 8×8 checkerboard background, rounded |
| `.mw-bg-grid` | 4-col grid for background swatches |
| `.mw-bg-swatch` | aspect-ratio 1.4 background-preset button |
| `.mw-bg-swatch[data-active="true"]` | accent border on active |
| `.mw-bg-swatch--transparent` | checkerboard variant for transparent option |

**Prefix safety for v2:** `ls-`, `ts-`, `mb-`, `mw-` are all claimed. New tools should pick a 2-letter prefix not in `{ls, ts, mb, mw}` to avoid collisions.

---

## 7. Tools manifest

From [`src/lib/tools.ts`](src/lib/tools.ts):

| # | id | category | title | href | status |
|---|---|---|---|---|---|
| 01 | `css-effect-lab` | `production_tools` | CSS Effect Lab | `/tools/css-effect-lab` | shipped |
| 02 | `easing-cookbook` | `learning_tools` | Easing Cookbook | `/tools/easing-cookbook` | shipped |
| 03 | `loading-states` | `inspiration` | Loading States Gallery | `/tools/loading-states` | shipped |
| 04 | `mockup-wrapper` | `visual_creator` | Mockup Wrapper | `/tools/mockup-wrapper` | shipped |
| 05 | `type-scale` | `visual_creator` | Type & Spacing Scale | `/tools/type-scale` | shipped |
| 06 | `prompt-builder` | `generator` | Component Prompt Builder | `/tools/prompt-builder` | shipped |
| 07 | `moodboard-library` | `reference` | Moodboard Library | `/tools/moodboard-library` | shipped |

`shippedCount()` filters `t.status === 'shipped'` → returns **7**.
`plannedCount()` returns `tools.length` → returns **7**.
Both derive correctly. The hub renders the `01..07` manifest numbers (verified by `tests/hub.spec.ts:49` "tool cards show manifest numbers 01 through 07"), and `tests/hub.spec.ts:63` confirms no coming-soon cards remain.

---

## 8. Layout patterns

### `.lab` — control panel + visual preview + code block
Three-cell grid: 320px-wide `.lab__panel` on the left and a `.lab__preview-wrap` on the right (same row), with `.lab__code-wrap` spanning the full width below. Below 860px it collapses to a single column with order `preview → panel → code`. Used by **CSS Effect Lab** ([`CssEffectLab.tsx:51`](src/app/tools/css-effect-lab/CssEffectLab.tsx:51)), **Type & Spacing Scale** ([`TypeScale.tsx:145`](src/app/tools/type-scale/TypeScale.tsx:145)), and **Mockup Wrapper** ([`MockupWrapper.tsx:278`](src/app/tools/mockup-wrapper/MockupWrapper.tsx:278)). Inner structure: `<div class="lab__panel panel">` (form controls — `panel` adds the surface chrome), `<div class="lab__preview-wrap">` (visual; either `.lab__preview` for built-in surface or a tool-specific wrap like `.ts-preview-wrap`/`.mw-canvas-wrap`), and `<div class="lab__code-wrap">` (output block — usually `.code`, or a button in Mockup Wrapper).

### `.catalog` — grid of cards
Responsive 4 / 2 / 1 column grid at breakpoints 980px and 520px. Used by **Easing Cookbook** ([`EasingCookbook.tsx:7`](src/app/tools/easing-cookbook/EasingCookbook.tsx:7)) and **Loading States Gallery** ([`LoadingStates.tsx:146`](src/app/tools/loading-states/LoadingStates.tsx:146)) — both wrap a `<div class="catalog">` around per-item card components. Cards use the shared `.easing-card` styling (loading-states reuses `.easing-card` plus an override `.loader-card__preview` to swap the SVG curve for the loader preview area). **Moodboard Library** does **not** use `.catalog`; it ships its own `.mb-catalog` with a 3-column layout because moodboard cards are wider.

### `.builder` — full-width stacked form + output
Vertical flex column with `--space-5` gap. Top section is `.builder__form panel` containing a `.builder__form-grid` (4 / 2 / 1 columns at 860px and 480px) of selects/toggles, plus a `.builder__notes-field` textarea spanning the full width. The output sits below as a single `.code.code--prose` block with `white-space: pre-wrap` so generated prompts wrap. Used by **Component Prompt Builder** only ([`PromptBuilder.tsx:34`](src/app/tools/prompt-builder/PromptBuilder.tsx:34)).

---

## 9. Known issues + technical debt

**1. Multiple-lockfile workspace warning.** Build/test output begins with a Next.js warning that two `package-lock.json` files exist (one at `/Users/terra/Developer/cargo/package-lock.json` from the parent checkout, one inside this worktree). Next infers the parent as the workspace root, which is wrong. Suggested fix: either remove the stale parent lockfile or set `outputFileTracingRoot` in `next.config.ts` — but this is a worktree-environment artifact rather than a repo-level bug. Worth confirming with the parent checkout before deciding.

**2. Flaky "back link returns to the hub" tests.** Two of 14 instances (`loading-states.spec.ts:85` and `mockup-wrapper.spec.ts:97`, both `chromium-light`) timed out in the first full run; both passed on retries 2 and 3. The brief named `moodboard-library` as the suspected flake, but in this audit `moodboard-library` passed and a different pair failed — confirming this is a **generic** flake across all `back link returns to the hub` tests, not tool-specific. Failure logs show the page re-navigating to the tool URL four times during the 60s window, which suggests the dev-server's hot-reload occasionally intercepts the click. Worth fixing in v2 by either (a) waiting for `networkidle` before clicking, (b) building with `npm run build && npm start` for tests to skip dev HMR, or (c) adding a retry budget in `playwright.config.ts`.

**3. Loading States Gallery — dataset CSS vs. preview CSS divergence.** [`src/lib/loading-states.ts`](src/lib/loading-states.ts) contains the *copyable* HTML+CSS strings the user takes away (hardcoded hex colors like `#e5e5e5`, `#C2410C`, class names like `.skeleton`, `.spinner`, `.spinner-conic`, larger dimensions). The *displayed preview* is rendered by the scoped `ls-*` CSS in [`LoadingStates.tsx`](src/app/tools/loading-states/LoadingStates.tsx) using `var(--accent)`, `var(--surface-muted)`, and slightly different sizing. So what the user sees in the preview is not byte-for-byte what they copy — the preview adapts to the theme and uses smaller dimensions for grid layout, but the copy is portable standalone CSS. This is the **intentional Phase 5 architecture**, not a bug, but it does mean v2 must keep the two in sync if it adds new loaders. Flagging because the brief asked.

**4. Test count discrepancy with brief.** The brief states "208 Playwright tests passing." Actual count is **224** (112 unique × 2 projects). Possibly outdated — Phase 9.1 added the `phone removed` and other tests that pushed the count up. Not a bug, just a stale number.

**5. Build output lacks per-route sizes.** `next build --webpack` in Next 16 prints only the route list, not the `First Load JS` size column that turbopack-mode shows. v2 might want to either switch to turbopack for `next build` (just `next build` without `--webpack`) to get richer build telemetry, or compute sizes manually from `.next/static/chunks/app/tools/*/page-*.js`. The numbers in §3 are derived from the chunk filesystem.

**6. No LSP/TypeScript warnings detected.** TypeScript ran for 1101ms during build with no warnings. No unused imports, no missing types flagged. Clean.

**7. The hub's `tool-card--coming-soon` and `tag--soon` styles are unused in v1.** All 7 tools are `status: 'shipped'`, so the CSS is dead. Leave as-is for v2 — if v2 introduces new tools that ship later, the styling is already there. (No action recommended.)

---

## 10. v2-relevant signals

**Is `three` or any WebGL helper already a dependency?**
**No.** `three`, `@react-three/*`, `webgl`, `WebGL`, `GLSL`, `glsl` — zero matches in `package.json`, `package-lock.json`, and source. Mockup Wrapper uses raw 2D `<canvas>` via `getContext('2d')` ([`MockupWrapper.tsx:52-186`](src/app/tools/mockup-wrapper/MockupWrapper.tsx:52)) — no 3D engine. Adding `three` to v2 will be a fresh dependency.

**Are there any utilities for URL search-param reading/writing in the codebase?**
**No.** Only `usePathname` from `next/navigation` is used (in [`TopbarNav.tsx:3`](src/components/TopbarNav.tsx:3) to mark the active nav link). No `useSearchParams`, no `URLSearchParams`, no `useRouter`. The cross-tool "Send to" system will need to be built from scratch.

**Is there any tab-control pattern in `globals.css` or any existing tool?**
**No native tabs.** Zero matches for `role="tab"`, `role="tablist"`, or `aria-selected`. The closest analog is **`.tint-toggle`** (a segmented control used in CSS Effect Lab, Type Scale, and Mockup Wrapper for `light/dark`, `4px/8px`, and `browser/card` choices). It's `flex` with `.tint-toggle__option` children where `.tint-toggle__option--active` is the inverted variant. Good base shape but lacks ARIA roles and keyboard navigation needed for a true tab control — v2's tabs should add roving-tabindex and `role="tab"`/`role="tablist"` semantics rather than reuse `.tint-toggle` directly.

**What's the largest existing client-component file by line count?**
[`src/app/tools/mockup-wrapper/MockupWrapper.tsx`](src/app/tools/mockup-wrapper/MockupWrapper.tsx) — **433 lines** including a ~70-line scoped `<style>` block and ~140 lines of canvas-rendering logic. Next-largest is [`TypeScale.tsx`](src/app/tools/type-scale/TypeScale.tsx) at 314 lines, then [`CssEffectLab.tsx`](src/app/tools/css-effect-lab/CssEffectLab.tsx) at 190. For "too big" budget reference: v1's max single client file is ~430 lines. A shader-lab v2 should probably split shader code, panel UI, and canvas binding into separate files if it would otherwise exceed ~500 lines.

**Are there any existing patterns for multi-selection?**
**No.** Zero checkbox inputs, no `multiple` attributes, no `Set<>` state. All selection in v1 is single-value `useState` (string or boolean). The v2 text-animations multi-pick tray will need a new pattern — `Set<string>` in state plus a `.tint-toggle`-style chip group could work, but ARIA-wise it should be `role="group"` with each chip an `aria-pressed` toggle button (which v1 already uses for `.bool-toggle__btn`, so the styling vocabulary exists).

**What does the current `<link>` between sibling tools look like?**
Every tool page uses `import Link from 'next/link'` and `<Link href="/" className="tool-page__back">back to the workshop</Link>` (8 occurrences — 7 tool `page.tsx` files + the hub's `ToolCard` and `Topbar` brand link). [`ToolCard.tsx:48`](src/components/ToolCard.tsx:48) wraps each hub card in `<Link href={tool.href}>`. There is **no** raw `<a href>` navigation between hub/tool routes. Convention is firm: **always use `<Link>` from `next/link`**. v2's cross-tool "Send to" buttons should follow the same pattern (with query-string state read by `useSearchParams` on landing).

---

*End of audit.*
