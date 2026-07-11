---
name: run
description: Launch and drive the VIN Voice Next.js dev server to see homepage/UI changes rendered. Use for this project (/Users/kevingutow/Desktop/VIN-Voice) whenever asked to run, start, or screenshot the app, or to confirm a UI change works before reporting it done.
---

# Running VIN Voice

Next.js 16.2.10 App Router app, Turbopack dev server, no auth and no
database yet (builder flow round-trips through `sessionStorage` only —
see `PRODUCT_PLAN.md` for what's missing).

## Dev server

```bash
(npm run dev > /tmp/vinvoice-dev.log 2>&1 &)
for i in $(seq 1 30); do curl -sf http://localhost:3000 >/dev/null && echo READY && break; sleep 1; done
```

Serves at `http://localhost:3000`. Stop with:

```bash
pkill -f "next dev"
```

**Gotcha:** macOS's default shell has no `timeout` command — don't use
`timeout 30 bash -c '...'` to poll for readiness, it'll fail with
`command not found`. Use the `seq`/`curl`/`sleep` polling loop above
instead.

**Remember to leave it running (or restart it) before the user checks
the site in their own browser** — a prior session stopped the dev server
after taking verification screenshots and the user hit a "site not up"
error when they tried to load it themselves.

## Drive it — no `chromium-cli` in this environment

This environment does not have `chromium-cli` installed. Cached
Chromium browser binaries exist (`~/Library/Caches/ms-playwright`), but
the `playwright` npm package itself isn't available via `npx --no-install`.

Don't add `playwright` to this project's `package.json` just to take a
screenshot — install it standalone in the scratchpad directory instead,
so it never touches the repo's dependencies:

```bash
cd <scratchpad-dir>
npm init -y >/dev/null 2>&1
npm install playwright@1.61.1
```

Then drive it with a small `.mjs` script, e.g.:

```js
import { chromium } from "playwright";

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
const errors = [];
page.on("console", (msg) => { if (msg.type() === "error") errors.push(msg.text()); });

await page.goto("http://localhost:3000", { waitUntil: "networkidle" });
await page.screenshot({ path: "<scratchpad-dir>/screenshot.png", fullPage: true });

console.log("Console errors:", errors);
await browser.close();
```

Run with `node <script>.mjs` from the scratchpad dir (needs
`node_modules/playwright` installed there, per above).

## One representative interaction

Homepage header has a hamburger menu (all breakpoints, not just mobile)
containing How it works / Pricing / Log in:

```js
await page.goto("http://localhost:3000", { waitUntil: "networkidle" });
await page.screenshot({ path: ".../header-collapsed.png", clip: { x: 0, y: 0, width: 1280, height: 90 } });
await page.click('button[aria-label="Toggle menu"]');
await page.waitForTimeout(300);
await page.screenshot({ path: ".../header-expanded.png", clip: { x: 0, y: 0, width: 1280, height: 300 } });
```

## Routes that exist today

- `/` — homepage (hero photo → HeroDemo section → how it works → band → closing CTA)
- `/pricing`
- `/builder`, `/builder/review` — vehicle info → script/audio generation flow
- `/api/generate-script`, `/api/generate-audio`, `/api/voice-preview` — server routes (Claude + ElevenLabs)

No `/login`, `/signup`, or QR-code output route exist yet.
