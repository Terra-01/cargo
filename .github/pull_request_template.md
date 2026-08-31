<!-- Thanks for contributing. Please read CONTRIBUTING.md if you have not. -->

## What and why

<!-- What changed, and what problem it solves. Link an issue if there is one. -->

## Screenshots

<!-- Required for anything visual. Before and after if you changed existing UI. -->

## Checklist

- [ ] `npm run typecheck` passes
- [ ] `npm run lint` passes
- [ ] `npm run build` passes
- [ ] `npx playwright test` passes (all three projects: chromium light, chromium dark, firefox)
- [ ] I extended the relevant spec rather than rewriting it, and existing `data-testid`s still work
- [ ] Styling uses design tokens from `globals.css` — no new framework, no CSS-in-JS
- [ ] No new runtime dependency (or the PR explains why one is needed)
- [ ] If this includes third-party work, it is recorded in `THIRD-PARTY-NOTICES.md`
- [ ] If this changes exportable output, I ran the exported result and it works
