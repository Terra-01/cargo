# Contributing to Cargo

Thanks for looking. Cargo is a side project that moves one Saturday at a time, so
please read this before opening a large PR — it will save you effort.

## What Cargo is

A workshop of small, single-purpose tools for people who make things on the web.
Free, no accounts, no tracking. Every tool does one thing and tries to do it well.

## What gets merged easily

- Bug fixes, with a test that fails before and passes after.
- Accessibility fixes.
- Content corrections in the reference tools (UI Pattern Library, Type Field
  Guide, Spec Pressure-Test) — accuracy matters more than volume.
- New entries in existing catalogues (a text animation, a loader, an easing, a
  moodboard), following the data-file conventions below.

## What to open an issue about first

- **New tools.** A tool is a real commitment and the roadmap is deliberate.
  Please propose before building.
- **Anything that changes the stack.** See the constraints below.
- **Large refactors.** The codebase is small on purpose.

## Ground rules for the stack

These are settled and PRs that change them will be asked to revert:

- **Next.js App Router + TypeScript.** No new frameworks.
- **Plain CSS with design tokens** from `src/app/globals.css`. No Tailwind, no
  CSS-in-JS, no component library.
- **Minimal dependencies.** Cargo ships with three runtime dependencies (next,
  react, react-dom). A PR adding one needs a strong reason.
- **Tool content lives in typed data files** in `src/lib/*` — not MDX, not
  inline JSX. Adding a catalogue entry should be a data change plus, at most, a
  small component.
- **`src/lib/tools.ts` is the single source of truth** for the tool registry.
  Update it when a tool changes.
- **Exports must actually work.** Several tools emit copy-paste code or
  downloadable files. What a user copies must run when pasted — verify by
  running the output, not by reading it.

## Third-party work

Cargo ports and adapts other people's work, and records every instance in
[THIRD-PARTY-NOTICES.md](THIRD-PARTY-NOTICES.md). If your contribution includes
anything derived from another project — a shader, a snippet, an animation, a
font — say so in the PR and add the attribution. Contributions must be your own
work or compatibly licensed; do not paste code whose licence you have not
checked.

## Getting set up

```bash
npm ci
npm run dev
```

Open <http://localhost:3000>.

## Before you open a PR

All four must pass. CI runs exactly these on your pull request (and on every
push to `main` and `dev`):

```bash
npm run typecheck && npm run lint && npm run build && npx playwright test
```

Notes on the test suite:

- Three projects run every time: `chromium-light`, `chromium-dark`, and
  `firefox`. Firefox is not optional — it has caught real WebGL and GLSL bugs.
- Extend the relevant tool's spec rather than rewriting it, and keep existing
  `data-testid` values stable so prior tests keep working.
- Locally the suite runs against the dev server; CI runs it against a
  production build.

## Commits and PRs

- Branch off `dev`, not `main`. PRs target `dev`.
- Conventional, scoped commit messages.
- Say what changed and why. Screenshots for anything visual.

## Code of conduct

By participating you agree to the [Code of Conduct](CODE_OF_CONDUCT.md).
