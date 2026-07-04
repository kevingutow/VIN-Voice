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
