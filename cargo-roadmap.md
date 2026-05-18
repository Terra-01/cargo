# Cargo — Roadmap for remaining work

**Purpose of this document.** This is a handoff roadmap. It is written so that an agent (or person) with no prior context on Cargo can pick it up and carry the remaining work forward. It covers how the project is built, its current state, and a detailed scoping of the three phases that remain. It does not contain milestone prompts — it contains everything needed to *write* them.

Read sections 1–3 before touching any phase. Sections 4–6 are the phases themselves.

---

## 1. What Cargo is

Cargo is a workshop of small, single-purpose web tools for designers and "vibe coders", free, no accounts, no tracking. It is a side project, built incrementally. The reset is complete: nine tools are shipped, none are planned or coming-soon, and the project is in its finished, cleaned-up state.

**Stack:** Next.js 16 (App Router, webpack — not Turbopack), TypeScript, plain CSS with design tokens (no Tailwind, no CSS-in-JS), Playwright for tests.

**Branding / house style:** a workshop with an editorial flourish. Monospace eyebrow labels prefixed with `//` (e.g. `// production_tools`). Sentence-case headings. A terracotta accent (`#C2410C` light, `#FB923C` dark). Italic display serif for emphasis. Light and dark themes both supported. When building any UI, match this — do not introduce new design languages. Reference `src/app/page.tsx`, any `src/app/tools/*/page.tsx`, and `src/app/globals.css`.

---

## 2. How the work is done — workflow and rules

### The workflow

Work is split between two roles:

- **An architect** (planning) writes detailed, self-contained milestone prompts as markdown documents.
- **A builder** (a separate Claude Code session) executes one milestone prompt at a time against the real repo, then reports back.

The architect reviews the report, then writes the next prompt. The builder's session does not persist — **every milestone prompt must be self-contained**, because the builder starts cold each time.

### The milestone prompt format

Each milestone prompt is a markdown document with this shape, and any new one should follow it:

1. **Standing rules** — repeated at the top of every prompt (see below).
2. **Context** — what shipped before, where this milestone sits in the sequence.
3. **Files to create / files in play** — explicit paths.
4. **The work** — numbered parts, each precisely specified. If a part is large (bulk data, generated code), embed the verified content directly in the prompt.
5. **Verification** — concrete checks: `tsc --noEmit` clean, `npm run build` clean, the dev-server behavior to confirm, the Playwright expectation.
6. **Report back with** — an explicit list of what the builder must report.
7. **Notes for the builder** — scope reminders, "do not do X", clarifications.

### Standing rules — put these at the top of every milestone prompt

- **Cross-browser testing.** The Playwright suite must pass on **both Chromium and Firefox**. The project's Playwright config runs three projects: chromium-light, chromium-dark, firefox. All green, every milestone.
- **Milestone splitting.** If a milestone turns out larger than expected, the builder should stop and flag rather than rush. Splitting is normal.
- **Flag, don't silently fix.** If the builder finds a problem outside the milestone's scope, or something in the prompt that looks wrong, it should surface it in the report — not quietly fix it.
- **No destructive git.** No reset, rebase, force-push, or clean. Commit only if explicitly asked.
- **Report deviations.** Anything changed beyond spec, anything broken, anything the builder was unsure about — in the report.

### Two practical cautions, learned from prior work

- **Verify embedded data.** When a prompt embeds generated code or bulk data, sanity-check it before handing it over (counts, brace-balance, uniqueness, structural validity). A wrong number once shipped in a document that contradicted its own table. Treat verification as a hard gate.
- **The working tree carries uncommitted changes.** Prior milestones were not committed (commits were never requested). `git diff HEAD` currently conflates several milestones' worth of edits. At some point a clean commit pass is worth doing. A builder should not be surprised by a noisy diff.

---

## 3. Current state of the project

### Tools shipped (9)

`css-effect-lab`, `easing-cookbook`, `loading-states`, `mockup-wrapper`, `type-field-guide`, `moodboard-library`, `text-animations`, `shader-gradient-lab`, `ui-pattern-library`.

Two changes from the original list: `type-scale` was reframed and shipped as `type-field-guide`, and the Component Prompt Builder (`prompt-builder`, formerly catalogue number 06) was cut permanently. Surviving tools keep their original catalogue numbers as stable identities, so number 06 is intentionally absent rather than the list being renumbered.

### The tool registry

`src/lib/tools.ts` is the single source of truth for the tool list — id, number, category, title, description, tags, route, status (`shipped` | `coming_soon`), and a preview component. The home page renders from it. **When a tool ships or changes, update its registry entry.**

Note: the tool that was scaffolded as `ui-pattern-dictionary` (number `10`, once `coming_soon`) shipped as the **UI Pattern Library** (`ui-pattern-library`, number `10`, status `shipped`). There is no longer any `coming_soon` entry in the registry.

### Recently completed (the reset)

- **Shader Gradient Lab**, rebuilt from scratch around the open-source Neat gradient library; procedural textures, presets, standalone and snippet export.
- **Text Animation Library refinement**, catalogue rebuilt to 146 animations, a JS-driven animation path added, category filter, picker redesign. Complete.
- **`/notes` and `/about` pages**, built (the two topbar-nav 404s are gone).
- **The Type Field Guide**, shipped (the `type-scale` slot reframed into a hands-on typography guide).
- **CSS Effect Lab v2**, shipped (single glassmorphism panel turned into a multi-effect playground).
- **Loading States scale-up** and **Moodboard scale-up**, both shipped.
- **UI Pattern Library**, shipped (the tool once scaffolded as the UI Pattern Dictionary).
- **Component Prompt Builder**, cut permanently. A planned type-pairing tool was dropped before it ever existed in the codebase.
- **Closing tech-debt cleanup**, done: the repo-wide ESLint fix, `noUnusedLocals` and `noUnusedParameters` enabled, the moodboard italic decision made declarative, a reduced-motion pass, and the remaining lint findings resolved.

### What this roadmap originally covered, three phases

1. **CSS Effect Lab v2**, expand a shipped tool (section 4). **Done.**
2. **Mockup Wrapper v2**, expand a shipped tool (section 5). **Still open, the one piece of roadmap work not yet done.**
3. **UI Pattern Dictionary**, build the tenth tool (section 6). **Done**, shipped as the UI Pattern Library.

Sections 4 and 6 are kept below as historical scoping context for work that is now complete. Section 5 (Mockup Wrapper v2) is the only phase still genuinely open.

---

## 4. Phase — CSS Effect Lab v2

> **Status: done.** CSS Effect Lab v2 shipped. The section below is kept as historical scoping context; it describes the v1 starting point, not the current tool.

### Current state of v1

`src/app/tools/css-effect-lab/CssEffectLab.tsx` (~190 lines). v1 is a **single-effect tool**: a live glassmorphism panel. Controls: blur, tint (light/dark), background opacity, border opacity, corner radius, a saturate toggle. It renders a live preview and a copyable CSS block. One effect, done cleanly, but only one.

### The gap — and a promise already on the page

The tool's own registry description (`src/lib/tools.ts`) reads:

> "A live playground for glassmorphism, mesh gradients, and animated borders."

v1 delivers **only the first of those three.** The hub page is already advertising mesh gradients and animated borders that do not exist. So v2 is not inventing scope from nothing — it is delivering on a promise the tool already makes. That is the cleanest possible justification for a v2: the description is the spec.

### What v2 should be

CSS Effect Lab v2 turns the single glassmorphism panel into a **multi-effect playground** — at minimum the three effects the description already promises:

1. **Glassmorphism** — v1's existing effect, carried over (it works; keep it, possibly refined).
2. **Mesh gradients** — a configurable mesh/blob gradient generator with a copyable CSS output. (Note: the Shader Gradient Lab covers *shader* gradients; this is the pure-CSS, no-WebGL kind — radial-gradient meshes. Keep the two tools distinct: Effect Lab = copyable static CSS, Shader Lab = animated WebGL.)
3. **Animated borders** — gradient-border, conic-spin, and similar animated border effects, with copyable CSS (`@property`, `@keyframes`, conic-gradient).

The structure becomes a **tabbed or switchable tool** — one effect visible at a time, each with its own controls, live preview, and copy-CSS output. The existing copy-to-clipboard pattern carries over per-effect.

### Scoping guidance

- This is a real expansion — a one-effect tool becoming a three-effect tool. **It should be split into milestones**, almost certainly: a milestone to introduce the multi-effect shell + carry glassmorphism into it, then one milestone per new effect (mesh, then animated borders). Three milestones is a reasonable starting estimate; the shell milestone could absorb one effect.
- Each effect must produce **copyable, correct, standalone CSS** — the value of the tool is the copy output. Verify the copied CSS actually works when pasted.
- Match the house style. The tab/switch UI should feel like the workshop, not a generic component library.

### Open decisions a builder must resolve (in a scoping pass)

- Tabs vs a dropdown vs a segmented switch for choosing the effect — pick what fits the house style and the number of effects.
- Whether v2 stops at the three promised effects or adds more (noise textures, shadows, etc.). Recommendation: ship the three promised first; treat anything beyond as a later, separate decision. Do not let scope sprawl.
- Whether glassmorphism's v1 controls get refined or carried over as-is. Default: carry over as-is unless something is visibly wrong.

---

## 5. Phase — Mockup Wrapper v2

### Current state of v1

`src/app/tools/mockup-wrapper/MockupWrapper.tsx` (~433 lines). v1: upload a screenshot, wrap it in a frame, export a PNG. Controls: frame style, background, padding, shadow on/off, shadow depth, corner radius. It renders to a canvas and downloads a PNG at 2× resolution. Drag-and-drop upload is supported.

Frames available (`src/lib/mockup-frames.ts`): **only two** — `browser` (Mac-style window chrome with traffic lights) and `card` (radius + shadow, no chrome). Backgrounds: seven (transparent, paper, ink, dusk, tokyo, soft, memphis).

### The gap

The tool works and is genuinely useful, but it is thin: two frames. The original roadmap note for v2 was "more frames and a cleaner export." That holds up as a justification, but a builder should confirm it against the live tool in a scoping pass — "v2" needs a concrete reason, and "two frames is too few for a tool whose whole job is framing" is a reasonable one.

### What v2 should be

1. **More frames.** The obvious additions: a **phone** frame (the roadmap originally mentioned browser/phone/card), and likely more — a plain "device" frame, a tablet, a window without traffic lights, a polaroid/photo frame. The frame system in `mockup-frames.ts` is already a clean registry (`id`, `label`, `description`); adding frames means extending that registry and the canvas-drawing code in `MockupWrapper.tsx` that branches on `frame === 'browser'` etc. Each new frame is drawing code.
2. **A cleaner export.** v1 downloads a PNG. "Cleaner" could mean: a copy-to-clipboard option (copy the image, not just download), export size/scale options (1×, 2×, 3×), or export format choice. A scoping pass should pin down what "cleaner export" concretely means.

### Scoping guidance

- The frame additions are the substance. Each frame is canvas-drawing work — chrome geometry, proportions, the traffic-light-equivalent details. **Each frame should be visually verified** (a screenshot), because canvas drawing is easy to get subtly wrong.
- This phase **may or may not need splitting** depending on how many frames. Three or four new frames plus an export improvement could be one milestone; a larger frame set should split (e.g. frames milestone, then export milestone).
- The canvas export code already runs at 2× — preserve that quality.

### Open decisions a builder must resolve (in a scoping pass)

- Exactly which frames to add, and how many. Recommendation: decide a concrete list (phone is non-negotiable; pick 2–4 others) rather than "more frames" open-endedly.
- What "cleaner export" means concretely — clipboard copy, scale options, format options, or some combination.
- Whether the phone frame needs to handle portrait vs landscape source images differently (a phone frame around a wide screenshot is awkward — this is a real design question).

---

## 6. Phase — UI Pattern Dictionary

> **Status: done.** Shipped as the **UI Pattern Library** (`ui-pattern-library`, number 10, status `shipped`). The section below is kept as historical scoping context; the tool described as "planned, not built" now exists.

### Current state

This is the **tenth tool — planned, not built.** It already has a registry entry in `src/lib/tools.ts`:

- id `ui-pattern-dictionary`, number `10`, category `reference`, status `coming_soon`
- description: *"A searchable reference of UI patterns — what each one means, when to use it, when not to."*
- route `/tools/ui-pattern-dictionary` (does not exist yet)
- a `UiPatternDictionaryPreview` component is already imported into the registry

So there is a scaffold: a registry slot and a preview component. There is **no route, no tool page, no content.** Building this phase means: creating the route and tool page, building the dictionary UI, and — the substantial part — **writing the pattern content.**

### What the tool is

A **searchable reference** of UI patterns. Not interactive widgets — a *reference*. Each entry is a UI pattern (e.g. modal, toast, breadcrumb, empty state, infinite scroll, skeleton loader, accordion, tooltip, command palette, etc.) with, per the description, **what it means, when to use it, and when not to.**

This is closest in spirit to a content tool — like a well-written reference page — rather than an interactive playground. The "tool" part is the search/filter and the browsing experience.

### What building it involves

1. **The route and page** — `src/app/tools/ui-pattern-dictionary/page.tsx` and the tool component, matching the tool-page pattern (every other tool follows the same `page.tsx` + component shape).
2. **The data model** — a pattern entry. At minimum: name, category/group, "what it is", "when to use", "when not to use". Possibly also: common mistakes, related patterns, a simple visual or diagram. Decide the shape early; it drives everything.
3. **The content** — the actual pattern entries. This is the real work and the real risk. A dictionary with 8 shallow entries is not worth shipping; one with 30+ genuinely useful entries is. The content must be written with care — accurate, opinionated where the description promises opinion ("when not to use it"), and in Cargo's voice (plain, human, not generic).
4. **The browsing UI** — search by name, filter by category, the entry layout. The Text Animation Library's category-filter and the Loading States Gallery are reasonable structural references.
5. **The preview component** — `UiPatternDictionaryPreview` exists; confirm it matches the built tool and update if needed.
6. **Registry flip** — change the registry status from `coming_soon` to `shipped` once it ships.

### Scoping guidance

- **This phase needs a content plan before any building.** Unlike the two v2 phases (which expand working tools), this is content-first. The first step is not a milestone prompt — it is deciding: how many patterns, which patterns, what each entry contains. That is a scoping/assessment step, ideally a written list reviewed before building, the same way the Text Animation Library refinement started with an assessment rather than a prompt.
- **Split content from UI.** A sensible milestone shape: one milestone builds the route, the data model, and the browsing UI with a small set of entries; a second milestone (or the same, if the content is ready) fills in the full content set. Writing 30+ good pattern entries is substantial — treat the content as a real deliverable, not an afterthought.
- The content should be genuinely useful and opinionated. "When not to use it" is in the tool's own description — that means the dictionary takes positions, it does not just describe. Write accordingly.

### Open decisions a builder must resolve (in a scoping pass)

- The pattern entry data model — exact fields.
- The pattern list — which patterns, how many. Recommendation: draft a categorized list (form patterns, navigation patterns, feedback patterns, content patterns, etc.) and aim for a count that feels like a real reference (30+), reviewed before writing.
- Whether each entry has a visual (a small diagram / illustration) or is text-only. Visuals make it much stronger but multiply the work. Decide deliberately.
- Whether the content is authored as data (a TypeScript array, like the other tools' data files) or as MDX/markdown. Recommendation: a data file, consistent with how every other Cargo tool stores its content.

---

## 7. Suggested sequence and closing notes

**Original suggested order:** CSS Effect Lab v2, then Mockup Wrapper v2, then UI Pattern Dictionary. Two of the three are done. The only phase still open is **Mockup Wrapper v2** (more frames, a cleaner export); it can be picked up whenever it is wanted, on its own scoping pass.

**Each phase starts with a scoping pass, not a prompt.** The three phases were sketched well before the recent work. Before writing milestone prompts for any of them, confirm the scope against the live tool / current state and resolve the open decisions listed. For CSS Effect Lab and Mockup Wrapper this is short (the tools exist, the gaps are clear). For the UI Pattern Dictionary it is a real planning step (the content has to be designed).

**Estimated milestone counts** (rough, to be confirmed at scoping):
- CSS Effect Lab v2 — ~3 milestones (shell + glass, mesh gradients, animated borders).
- Mockup Wrapper v2 — ~1–2 milestones (frames, possibly export separately).
- UI Pattern Dictionary — ~2–3 milestones (a content plan, then tool + initial content, then full content) plus the scoping/content-design step.

**Current completion point reached.** The reset is complete: Cargo has nine tools, all shipped, the registry's `coming_soon` is gone, and the closing tech-debt cleanup is done. The Component Prompt Builder was cut along the way, so the count is nine rather than ten. The one optional piece of future work still on the table is Mockup Wrapper v2. Anything beyond that is a fresh planning conversation.

**A reminder carried from section 2:** every milestone prompt is self-contained, opens with the standing rules, and is written for a builder starting cold. Embedded data gets verified before it goes in. The house style is matched, never reinvented. And the project moves one Saturday at a time — milestones should be sized so one is a satisfying, shippable unit of work, not a sprawling one.

---

# Appendix — How this project actually works

This appendix is the operating context a new agent needs that is not captured by the phase descriptions above. It records the working style, the accumulated decisions, the known technical debt, and how testing is done. Read it before writing any milestone prompt.

## A. Working style

**The architect / builder loop.** As described in section 2: one role plans and writes self-contained milestone prompts, a separate cold-start session executes them. The consequences worth internalizing:

- **A milestone is one satisfying unit of work.** Not a sprint, not a single line. The project moves "one Saturday at a time" and milestones are sized to that — a shippable, reviewable chunk. When in doubt, smaller.
- **Splitting is the default reflex, not a fallback.** Across the prior work, almost every milestone that contained two genuinely different *kinds* of work got split (a data change vs a UI change; a tool-side change vs an export change). Splitting was correct nearly every time. Combine two things into one milestone only when they are the same kind of small, contained work and genuinely do not interact — and even then, write them as clearly separated parts with separate verification.
- **Decisions are settled before drafting, not during.** When a milestone needs a real design decision (an architecture choice, a data-model shape), that decision is resolved first — sometimes in a written design note reviewed before the prompt is written — rather than left for the builder to improvise. The builder executes; it does not architect.
- **Honest pushback is part of the job.** The architect role regularly pushed back on scope creep, flagged its own mistakes, and corrected its own errors on the record. A new agent should do the same: if a requested thing is a bad idea, say so with reasons; if you got something wrong, fix it plainly.
- **Verification before handoff.** Anything generated and embedded in a prompt (bulk data, code) is sanity-checked by the architect *before* the prompt goes out — counts, structural validity, uniqueness. This is a hard gate. It exists because a wrong number once shipped in a document that contradicted its own table.

**Reviewing the builder's report.** After each milestone the builder reports back. Read the report critically: confirm the counts, read the deviations section, and treat flagged-but-unfixed items as decisions to make, not noise. The builder is good at flagging real tensions (it has caught genuine spec contradictions) — when it flags something, engage with it.

## B. Decisions and choices already made

These are settled. A new agent should follow them, not relitigate them.

- **Stack is fixed.** Next.js 16 App Router, **webpack not Turbopack** (the `dev` and `build` scripts force `--webpack` explicitly). TypeScript. Plain CSS with design tokens. Playwright. No Tailwind, no CSS-in-JS. Do not introduce new frameworks or styling systems.
- **Plain CSS with tokens.** All styling uses CSS custom properties (design tokens) defined in `src/app/globals.css`. Some tools inject a scoped `<style>` block from their component for tool-specific rules. Shared, multi-tool classes live in `globals.css`. When a size/layout change affects only one tool, scope it to that tool (a tool-specific class) rather than editing a shared global class — a prior milestone correctly scoped a grid change to a new `.ta-catalog` class instead of touching the shared `.catalog` used by three tools.
- **The tool registry is the single source of truth.** `src/lib/tools.ts` — id, number, category, title, description, tags, route, status, preview component. Update it when a tool ships or changes its description.
- **Tool content lives in data files.** Each content-heavy tool keeps its content as a typed array in `src/lib/*` (e.g. the text animations, the shader presets, the mockup frames). New tools follow this — author content as a TypeScript data file, not MDX or inline JSX.
- **Open-source ports keep their attribution.** The Shader Gradient Lab ports Neat (FireCMS, MIT + Commons Clause) and two Shadertoy shaders (CC BY-NC-SA 3.0). `LICENSE-SHADERS.md` records the licenses; exported code carries an attribution header. Any future port preserves origin attribution the same way.
- **Exports must actually work.** Several tools produce copy-paste or downloadable output (CSS snippets, standalone HTML, bundles, PNGs). The rule throughout: what the user copies must run when pasted. Exports are verified by actually running the output, not by eyeballing it. When a tool's runtime code is also emitted to the user, it is authored as a single source that serves both (the JS animation drivers are plain dependency-free `.js` for exactly this reason).
- **The card / preview pattern.** Tools that present a catalogue (animations, loaders) use a card grid; cards use badges, not plain-text labels, for classification; previews auto-play when scrolled into view via `IntersectionObserver` and pause off-screen. Reuse this pattern rather than inventing per-tool.

## C. Technical debt — known, and what to do about it

A new agent should be aware of these. None is urgent; none should be "fixed" silently as a side effect of unrelated work — but they are real.

- **The working tree is uncommitted.** Multiple completed milestones were never committed (commits were never requested, and destructive git is off-limits). `git diff HEAD` currently conflates several milestones' worth of changes. **A clean commit pass is worth doing** — ideally before the next phase starts, so future diffs are legible. This is the single most worthwhile piece of debt to clear.
- **`noUnusedLocals` is now enabled (resolved).** `tsconfig.json` has `strict: true`, and the closing cleanup added `noUnusedLocals: true` and `noUnusedParameters: true`. Both were clean with zero dead symbols (the codebase was already strict), so nothing had to be removed. Dead code now fails `tsc` and `build`; the compiler can be relied on to catch it.
- **ESLint is now clean repo-wide (resolved).** `npm run build` still does not run ESLint, but `npm run lint` is green. The repo-wide `react/jsx-no-comment-textnodes` issue (the bare `// ` eyebrow text) was fixed by wrapping each intentional `// ` label as an explicit string expression, and the four follow-up findings (`react/no-unescaped-entities`, `react-hooks/immutability`, `react-hooks/set-state-in-effect`, `@next/next/no-img-element`) were resolved in the closing cleanup. A real lint error can no longer hide in noise.
- **`next.config.ts` is empty.** It is the default scaffold (no custom config). This is fine today, but note it: if a future need arises (e.g. a webpack rule for raw-file imports), it would go here. A prior milestone deliberately avoided adding a webpack rule because it was out of scope — flagged rather than done.
- **Screenshot filenames carry old milestone tags.** Test screenshot filenames sometimes keep a prior milestone's tag (e.g. an `m1` suffix on a screenshot regenerated in a later milestone). Cosmetic, not worth a dedicated fix, but do not be confused by a filename that names an old milestone.
- **One pre-existing flaky test.** A `search filters by category` test and occasionally a couple of others have flaked on a `.fill()` timing race, then passed on retry — the suite's `retries: 1` absorbs it and the suite exits green. It is a test-harness timing sensitivity, not a product bug. If it becomes more frequent, the proper fix is an explicit wait in that test; until then it is tolerated and known.

## D. Testing — how it actually works

- **Runner:** Playwright. `npm run test` or `npx playwright test`. Config in `playwright_config.ts`.
- **Three projects, every run:** `chromium-light`, `chromium-dark`, `firefox` — all at 1280×800. A milestone is not green until all three pass. Firefox is not optional; it has caught real bugs (a WebGL context issue, GLSL precision issues in the shader work). Cross-browser is a hard requirement.
- **`retries: 1`, `fullyParallel: false`, 60s timeout.** The suite runs serially. A single retry is configured — it absorbs the known flaky test, but a *consistently* failing test is a real failure.
- **The dev server is the test server.** `webServer` runs `npm run dev`; tests hit `localhost:3000`. `reuseExistingServer` is on outside CI.
- **Console-error discipline.** Tests assert pages render "without console errors". The allowlist of benign messages is in `tests/helpers/console-errors.ts` — and it is deliberately built from *specific message signatures*, never broad substrings like "error" or "warning", so a real Cargo error is still caught. If a new genuinely-benign third-party console message appears, add a specific signature for it; never broaden an existing pattern.
- **Clipboard testing has a Firefox quirk.** Chromium projects grant clipboard via `permissions`. Firefox rejects those Chromium-only permission names outright — Firefox clipboard in automation is enabled via async-clipboard prefs in the config instead. `tests/helpers/clipboard.ts` exists for clipboard-related test support. A new agent writing a copy/export feature should reuse the existing clipboard test helper rather than rolling its own.
- **What a milestone's tests should do:** extend the relevant tool's spec, not rewrite it. Keep existing `data-testid`s stable so prior tests keep working (changing markup is fine; keep the testids). Add coverage for the new behavior. For anything that produces exportable output, include a test that the output is actually runnable/valid. Screenshots both projects.
- **`tsc --noEmit` and `npm run build` are part of verification**, separate from Playwright. Both must be clean. They are read-only and safe to run.

## E. The shape of a good milestone — checklist

When writing a milestone prompt for any of the three remaining phases, it should:

1. Open with the standing rules (section 2).
2. State where it sits in its phase's sequence.
3. Name exact file paths — to create and in play.
4. Specify the work as numbered parts; embed any bulk data/code, verified first.
5. Give concrete verification steps — dev-server behavior, `tsc`, `build`, the Playwright expectation across all three projects.
6. List explicitly what the builder reports back.
7. End with scope reminders — what not to touch, what is a later milestone.
8. Be self-contained — the builder starts cold and sees only this document.

If a milestone cannot be specified this completely, it is not ready to hand off — it needs a scoping pass first.
