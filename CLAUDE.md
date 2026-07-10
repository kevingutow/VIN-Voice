# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Important: Next.js version

This project uses **Next.js 16.2.10**, a version newer than your training data. APIs, conventions, and file structure may differ from what you expect. Before writing or modifying Next.js code, consult the bundled docs in `node_modules/next/dist/docs/` (organized into `01-app/`, `02-pages/`, `03-architecture/`, `04-community/`) rather than relying on memorized Next.js behavior, and heed any deprecation notices you encounter.

## Commands

- `npm run dev` — start the dev server (Turbopack) at http://localhost:3000
- `npm run build` — production build
- `npm run start` — run the production build
- `npm run lint` — run ESLint
- `npx tsc --noEmit` — type-check (no dedicated `typecheck` script defined)

There is no test runner configured in this project yet.

## Architecture

Standard `create-next-app` App Router layout:

- `app/layout.tsx` — root layout (fonts, global `<html>`/`<body>`)
- `app/page.tsx` — home route (`/`)
- `app/globals.css` — Tailwind entry point and global styles
- Path alias `@/*` maps to the repo root (see `tsconfig.json`)

Styling is Tailwind CSS v4, configured via the `@tailwindcss/postcss` PostCSS plugin (`postcss.config.mjs`) rather than a `tailwind.config.js` file.

The codebase is currently just the unmodified scaffold — no custom routes, components, or data layer have been added yet.

## Recent Session Notes

Rebuilt the homepage (`app/page.tsx`) with a Kero-template-inspired layout, built natively in React/Tailwind (no animation libraries):

- **Hero**: full-width cinematic background using the BMW/Porsche dealership-lot photo (`public/ivan-kazlouskij-euFJPwObDWI-unsplash.jpg`), dark gradient overlay for text legibility, and a floating QR code graphic positioned over roughly the driver's-side window with a gentle continuous bob (pure CSS `@keyframes`, see `float-bob` in `app/globals.css`).
- **How it works**: restyled into a 3-column icon/heading/description feature grid (same copy as before).
- **Band section**: bold statement + expansion tag labels (Cars/Motorcycles/Boats/RVs) over a full-width background. Uses a CSS radial-gradient placeholder — `/bmw-citylights.jpg` was referenced in the original spec but never added to `public/`; swap in the real photo when available.
- **Pricing**: initially added as a homepage section, then split out into its own route at `app/pricing/page.tsx` (Free/Pro/Dealer tiers) so the nav's "Pricing" link has a real destination.
- Extracted shared chrome into `app/components/`: `SiteHeader.tsx` (nav + mobile menu), `GetStartedButton.tsx`, `ClosingCta.tsx` — used by both the homepage and the pricing page. Footer stays inlined per-page (trivial, not worth extracting).

Two real bugs hit and fixed during this work, worth knowing if editing the hero again: (1) Tailwind's `from-x via-x/70 to-x/40` gradient shorthand can mix `lab()`/`oklab()` color spaces and render as solid opaque black in Chromium — use explicit `rgba()` gradients instead; (2) a `position: relative` section with no `z-index` doesn't establish its own stacking context, so negative-`z-index` children (background image/overlay layers) can escape and paint behind the page's root background — give the section an explicit `z-0` alongside `relative`.

## Future Features (Not Yet Built)

- Multi-language support: Spanish and Polish voice options using ElevenLabs' multilingual model, with translated scripts generated via Claude
- Multiple voice presets: male/female options across calm, energetic, and friendly tones (6 total combinations) via ElevenLabs Voice Library
- Background music mixed under the generated voice track (source: Suno, pending confirmation of commercial licensing terms for whichever Suno plan is used)
