# Cargo

A workshop of small tools for designers and vibe coders. Free, forever. Built
one Saturday at a time.

No accounts, no tracking, no backend. Every tool runs entirely in your browser —
nothing you type, upload, or generate leaves the page.

## What's inside

Ten single-purpose tools:

| # | Tool | What it does |
|---|---|---|
| 01 | **Shader Gradient Lab** | WebGL2 gradient generator — a faithful Neat port plus curated Shadertoy shaders. Tweak waves, colour, flow and grain live; export PNG, standalone HTML, or an embed. |
| 02 | **Text Animation Library** | 146 curated CSS and JS text animations. Hover to preview, copy one, or pick several and bundle them into a single snippet. See [THIRD-PARTY-NOTICES.md](THIRD-PARTY-NOTICES.md) for what is derived and from where. |
| 03 | **Moodboard Library** | Hand-curated vibes with palette, fonts and texture suggestions. From dusty Tokyo sunset to 90s Memphis. |
| 04 | **Loading States Gallery** | Skeleton loaders, spinners and empty states with copy-pasteable code. |
| 05 | **The Spec Pressure-Test** | Learn to spot the gaps in a feature spec before an AI coding agent fills them in wrongly. |
| 06 | **UI Pattern Library** | A searchable reference of UI patterns — what each one means, when to use it, when not to. Every entry has a live, interactive demo. |
| 07 | **The Type Field Guide** | A short, hands-on guide to web typography. Learn each essential and feel it with a live demo. |
| 08 | **Mockup Wrapper** | Drop in a screenshot, get it framed in browser chrome or a clean card. Export as PNG. |
| 09 | **Easing Cookbook** | Sixteen curated cubic-bezier easings, drawn and animated side by side. Click any card to copy its value. |
| 10 | **CSS Effect Lab** | A lab for hard CSS effects — glow borders, layered glows, animated gradient borders, grain. Tweak a recipe, copy the complete code. |

`src/lib/tools.ts` is the registry and the single source of truth for this list.

## Stack

- **Next.js 16** (App Router, webpack — both `dev` and `build` pass `--webpack`)
- **TypeScript**, `strict` plus `noUnusedLocals` / `noUnusedParameters`
- **Plain CSS with design tokens** in `src/app/globals.css` — no Tailwind, no CSS-in-JS
- **Playwright** for tests
- Three runtime dependencies: `next`, `react`, `react-dom`

Every route is statically prerendered. There is no server, no database, no API.

## Running locally

```bash
npm ci
npm run dev
```

Open <http://localhost:3000>.

## Checks

```bash
npm run typecheck && npm run lint && npm run build && npx playwright test
```

CI runs exactly these four on every push and PR.

The suite runs three projects every time — `chromium-light`, `chromium-dark`
and `firefox`, all at 1280×800. Firefox is not optional; it has caught real
WebGL context and GLSL precision bugs. Locally the tests run against the dev
server; in CI they run against a production build, which removes a class of
hot-reload flakes. Full-page screenshots land in `./screenshots/`.

## Design language

Workshop plus editorial flourish. Workshop = monospace labels, sharp geometry,
the shipping-manifest aesthetic. Editorial flourish = one italic-serif moment
per page (the `make things` in the hero, the taglines on moodboard cards).

Light and dark both ship. The theme follows `prefers-color-scheme` by default
and the topbar toggle cycles auto → light → dark, remembered across visits.
Motion respects `prefers-reduced-motion`: decorative animation stops outright,
and the catalogue tools stop auto-playing — their previews wait for a tap
instead, so the tools stay usable without animating at anyone unasked.

## Dev scripts

`npm run thumbnails` regenerates the Shader Gradient Lab look-picker thumbnails
(`public/look-thumbnails/*.webp`) by capturing real shader output for all 25
looks. It drives the running tool, so start the dev server first:

```bash
npm run dev          # terminal 1
npm run thumbnails   # terminal 2  (BASE_URL=… to override the target)
```

Re-runnable and resumable — it skips already-generated files; set `FORCE=1` to
rebuild all. Re-run it whenever a preset's values change.

## Contributing

Cargo is a side project and moves slowly, but issues and PRs are welcome. Read
[CONTRIBUTING.md](CONTRIBUTING.md) first — it covers the stack constraints, the
data-file conventions, and what gets merged easily. Security reports go through
[SECURITY.md](SECURITY.md), not public issues.

## Docs

- [docs/roadmap.md](docs/roadmap.md) — how the project is built and what is still
  planned. The appendix on working style and settled decisions is the best
  background reading for a contributor.
- [docs/audit-v1.md](docs/audit-v1.md) — a historical snapshot of the v1
  codebase. Kept for context; not current.

## License

Cargo is [MIT licensed](LICENSE), with exceptions.

Some files are ports or adaptations of other people's work and keep their
original licence — including two Shadertoy shaders under CC BY-NC-SA 3.0, which
is **not** an open-source licence and forbids commercial use. Every instance,
with its author, source and terms, is recorded in
[THIRD-PARTY-NOTICES.md](THIRD-PARTY-NOTICES.md).

**Read that file before reusing any part of Cargo.** MIT covers the application;
it does not cover the files listed there.
