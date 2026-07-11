# Session Notes — 2026-07-11

## ⚠️ First thing next session: set up the Vercel Blob token

Nothing in the new save/QR flow can actually run until `BLOB_READ_WRITE_TOKEN`
is a real value in `.env.local`. Right now `/api/save-listing` fails closed
with a 500 at the very first check. Steps (also detailed further down):

1. `npx vercel login` (interactive — opens a browser confirmation)
2. `npx vercel link` (creates/links the Vercel project — none exists yet)
3. Vercel dashboard → project → **Storage** → **Create Database** → **Blob**
   → enable for Development + Production
4. Vercel dashboard → **Settings → Environment Variables** → add
   `ANTHROPIC_API_KEY` and `ELEVENLABS_API_KEY` too (needed for a real
   deploy anyway, and makes step 5 safe)
5. `npx vercel env pull .env.local`

Once that's done: run the builder → review → "Save & Get QR Code" flow for
real, confirm the QR image renders, confirm `/listing/<uuid>` actually plays
audio from a `*.public.blob.vercel-storage.com` URL. That's the real
end-to-end proof this feature works — nothing before that point has been
verified against a live Blob store.

## Decisions so far (see CLAUDE.md + PRODUCT_PLAN.md)

- `CLAUDE.md`: stack/architecture/commands (Next.js 16.2.10, Tailwind v4, no
  test runner). Also documents two rendering bugs worth knowing if touching
  the hero again (gradient color-space issue, missing stacking context).
- `PRODUCT_PLAN.md` (new this session): full product vision — accounts,
  vehicle categories beyond cars (motorcycle/RV/boat), a physical "For Sale
  Sign" product (leaning hang-tag form factor, ~4"×7", brand-consistent
  black/blue/silver), two-audience pricing model (one-time private sellers
  vs. recurring dealers), slogan bank, and the agreed build sequence:
  **(1) core software loop → (2) script/audio quality → (3) physical sign →
  (4) marketing site → (5) pricing.** This session was #1.
- `skills/private-seller.md` / `skills/dealership-closer.md`: the two sales
  personas the script generator should eventually blend. **Written but not
  yet wired into `app/api/generate-script/route.ts`** — that's a real next
  step, not done yet.

## What was done this session

Closed the core product loop — previously, script + audio generation worked
but nothing persisted and there was no QR code output at all. Now:

1. **`app/api/save-listing/route.ts`** (new) — takes the already-generated
   audio bytes (reuses what the client already fetched for preview, no
   second ElevenLabs call) + form/script/voice as multipart FormData,
   uploads audio + a generated QR PNG + a JSON metadata file to **Vercel
   Blob** at deterministic per-listing paths (`listings/{uuid}/...`).
   **Deliberately no database** — the only access pattern needed is "look
   up one listing by ID," which Blob's `head()`+`fetch()` handles; a real
   DB is deferred until accounts/dashboards create an actual relational
   need.
2. **`app/listing/[id]/page.tsx` + `not-found.tsx`** (new) — the public
   page a QR scan lands on: vehicle summary, script text, `<audio>` player.
   404s cleanly on invalid/missing IDs.
3. **`app/builder/review/page.tsx`** — added the "Save & Get QR Code" step
   after audio generation: shows the QR image, a copyable/shareable link,
   a download-QR link, and a print button. Correctly invalidates the saved
   state whenever script or audio is regenerated.
4. **Consolidation**: `isFormState` moved into `app/builder/types.ts`,
   `VALID_VOICE_IDS` added to `app/builder/voices.ts`, `formatMileage`/
   `formatPrice` extracted to `app/lib/format.ts` — all now shared across
   the three existing API routes plus the two new files, instead of each
   reimplementing them.
5. New deps: `@vercel/blob`, `qrcode`, `@types/qrcode`.
6. `app/components/SiteHeader.tsx`, `app/page.tsx`, `app/components/HeroDemo.tsx`,
   `app/globals.css` — carried over from **last** session (hero restructure
   to match hearmyhome.com's pattern, logo crop, nav-behind-hamburger).
   Already committed last session; no changes to these this session.

**Commands run:** `npx tsc --noEmit`, `npm run lint` (both clean),
`git log`/`git show` for archaeology, `sips` for the earlier logo crop.
Attempted `npm install -g vercel` and `npx vercel login` — both blocked by
a root-owned `/usr/local` and a root-owned `~/.npm` cache respectively (see
below). Reviewed every new/changed file by hand this session per explicit
request ("run through all the files, does everything look ok") — see the
security note below for the one real finding.

**All work is committed locally** (5 commits, `main` is 5 commits ahead of
`origin/main`, **not pushed** — push only if explicitly asked):
- `bb87b71` hero/header restructure (from last session)
- `e857e1c` QR code + Blob persistence feature
- `703df9e` PRODUCT_PLAN.md + persona skills
- `e5a1cc4` run skill

## Security note — already fixed, but worth knowing

`.env.local.example` briefly contained **real, live** `ANTHROPIC_API_KEY`
and `ELEVENLABS_API_KEY` values instead of blank placeholders (an
implementation mistake, not something the user did). It was **never
committed** — `.gitignore`'s broad `.env*` pattern accidentally caught it
too — but the values were displayed in this session's tool output when the
file was read during review, which counts as exposure. **Recommended:
rotate both keys** next session if not already done (regenerate in the
Anthropic and ElevenLabs dashboards, update `.env.local`). The example file
now has blank placeholders, and `.gitignore` was updated with a
`!.env.local.example` exception so it can be committed as a real template
going forward (confirmed the real `.env.local` is still fully ignored).
Also added `.claude/settings.local.json` to `.gitignore` (local-only tool
permissions, not meant to be shared).

## Open issues / things hit along the way

- **No Vercel project linked yet** — `.vercel/` doesn't exist locally.
  This blocks Blob store creation, which blocks any real verification of
  the save/QR flow. See the top of this file for the exact steps.
- **Global npm installs are broken on this machine**: `/usr/local/lib/node_modules`
  is root-owned (blocks `npm install -g`), and `~/.npm` cache is also
  root-owned (blocks even `npx` from installing packages on demand — fails
  with `EACCES` on cache writes). Worked around mid-session with a
  scratchpad-local npm cache for one-off tasks (Playwright for screenshots),
  but **`npx vercel login`/`vercel link` will hit the same wall** unless
  fixed first. Fix: `sudo chown -R 501:20 "/Users/kevingutow/.npm"` — not run
  yet, needs the user's password, offered but not executed.
- Local end-to-end testing of `/api/save-listing` is **entirely blocked**
  until the Blob token exists — this isn't a bug, just unstarted work.
- Carried over from last session, still open: Band section's background is
  still a placeholder gradient (real `/bmw-citylights.jpg` never sourced);
  hero repeats "Scan the tag / hear the car" phrasing twice in a row
  (explicit user choice, flagged as worth a second look).

## Next steps, in order

1. **Fix the npm cache ownership** (`sudo chown -R 501:20 ~/.npm`) so
   `npx vercel ...` commands stop failing.
2. **Get the Blob token** — see the walkthrough at the top of this file.
3. **Run a real end-to-end verification**: builder → review → generate
   script → generate audio → Save & Get QR Code → open `/listing/<uuid>` →
   confirm audio actually plays from a Blob URL. Confirm 404 behavior on a
   bogus UUID.
4. Consider rotating `ANTHROPIC_API_KEY`/`ELEVENLABS_API_KEY` (see security
   note above) — not urgent, but recommended.
5. Once the core loop is verified live, per `PRODUCT_PLAN.md`'s agreed
   sequence, move to **script/audio quality**: wire the two persona skills
   (`skills/private-seller.md`, `skills/dealership-closer.md`) into
   `app/api/generate-script/route.ts`'s system prompt, and calibrate for
   ~150 words / ~60 seconds spoken.
6. Decide whether to `git push` — 5 commits are sitting local-only right now.
