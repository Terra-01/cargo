# Cargo

A workshop of small tools for designers and vibe coders. Free, forever. Built one Saturday at a time.

## What's inside

Seven single-purpose utilities:

- **CSS Effect Lab** — live glassmorphism playground
- **Easing Cookbook** — sixteen cubic-bezier easings, drawn and animated
- **Loading States Gallery** — eight curated CSS loaders, copyable as HTML + CSS
- **Mockup Wrapper** — frame screenshots in browser, phone, or card chromes
- **Type & Spacing Scale** — modular type and spacing system designer
- **Component Prompt Builder** — sharp AI-coding prompts from a few choices
- **Moodboard Library** — six hand-curated vibes with palette, fonts, textures

## Stack

- Next.js 16 (App Router, webpack)
- TypeScript
- Plain CSS with design tokens — no Tailwind, no CSS-in-JS
- Playwright for tests

## Running locally

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Testing

```bash
npx playwright test
```

Runs the full suite across light and dark color schemes, with full-page screenshots saved to `./screenshots/`.

## Design language

Workshop + editorial flourish. Workshop = monospace labels, sharp geometry, the shipping-manifest aesthetic. Editorial flourish = one italic-serif moment per page (the `make things` in the hero, taglines on moodboard cards). Auto light/dark via `prefers-color-scheme`.

## License

Free, forever. No warranty.
