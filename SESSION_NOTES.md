# Session Notes — 2026-07-12

## ✅ Core loop is fully working, verified end-to-end

Vercel setup is done and the whole flow has been tested live: builder →
generate script (Anthropic) → generate audio (ElevenLabs) → "Save & Get QR
Code" (Vercel Blob) → public `/listing/[id]` page with a real playable
audio URL. 404 confirmed for bogus/invalid listing IDs. No code changes
this session — this was entirely infra/environment setup, picking up from
last session's "everything's coded, nothing's been run against real infra"
state.

**No repo changes to commit** — `.env.local` and `.vercel/` are both
gitignored, so none of today's setup touches git. Previous session's 6
commits are already pushed to `origin/main`.

## What got fixed this session

1. **Vercel project linked**: `km-atic/vin-voice`, via `vercel link`
   (`.vercel/project.json` has the IDs). Wasn't linked before.
2. **Found and cleaned up a real problem from an earlier setup attempt**:
   someone had run `vercel env add` and pasted an ElevenLabs key into the
   *name* field instead of the value field — it was sitting in the Vercel
   dashboard as a var literally named `sk_4b2f9b...`, visible in plaintext
   to anyone with project access. Removed it. That key should be treated
   as compromised (on top of last session's two other exposures).
3. **Blob store recreated correctly**: the first store existed but was
   only connected to Production/Preview, not Development — meaning
   `vercel env pull` locally got nothing useful. Deleted (it was empty,
   0 files, safe) and recreated with `--environment production --environment
   preview --environment development` in one shot. `BLOB_READ_WRITE_TOKEN`
   now correctly present in all three.
4. **All three required keys now set in all three environments**:
   `ANTHROPIC_API_KEY`, `ELEVENLABS_API_KEY`, `BLOB_READ_WRITE_TOKEN`.
   Fresh keys were generated (not the old exposed ones) and added by the
   user directly via `vercel env add` in their own terminal — never pasted
   into this chat.
5. **Hit and fixed a real ElevenLabs permissions bug**: the first
   replacement ElevenLabs key authenticated fine (not an "invalid key"
   error) but 401'd on the actual `text-to-speech` endpoint with
   `missing_permissions` — it had been created as a restricted key without
   the `text_to_speech` scope enabled. Regenerated as an unrestricted key,
   confirmed working with a direct API call before re-running the full test.
6. **`npm`/`~/.npm` cache ownership issue from last session is resolved**
   (was root-owned, blocked `npx` installs) — confirmed fixed, no longer an
   issue.

**Recurring gotcha worth remembering**: `vercel env add <NAME>` (no
environment argument) kept landing only in Production+Preview in the
interactive multi-select, silently skipping Development, twice in a row.
The reliable fix is `vercel env add <NAME> development` — target it
explicitly rather than trusting the multi-select.

## Verification performed

Full Playwright-driven run against the real dev server + real APIs +
real Blob store (script in the scratchpad dir, not committed): filled the
builder form, generated a script, generated audio, saved the listing,
opened the resulting `/listing/[id]` URL in a fresh browser context, and
confirmed the `<audio>` element's `src` is a real
`*.public.blob.vercel-storage.com` URL that returns `200 audio/mpeg` on a
HEAD request. Also confirmed a syntactically-valid-but-nonexistent UUID
404s correctly. Screenshots confirmed the review page's QR/link/download/
print UI and the public listing page both render as designed. One benign
`net::ERR_ABORTED` on a local `blob:` object URL was logged during the
test (page navigation racing an in-flight preview-audio fetch) — not a
real issue, didn't affect the saved/public audio path.

There's now one real test listing sitting in the Blob store (a fake 2019
Honda Civic EX) — harmless, but worth knowing it's not synthetic/local
data, it's really there if anyone browses the store in the dashboard.

## Decisions so far (see CLAUDE.md + PRODUCT_PLAN.md) — unchanged from last session

- `CLAUDE.md`: stack/architecture/commands (Next.js 16.2.10, Tailwind v4,
  no test runner).
- `PRODUCT_PLAN.md`: full product vision, two-audience pricing model,
  physical For Sale Sign design notes, agreed build sequence — **(1) core
  software loop → (2) script/audio quality → (3) physical sign → (4)
  marketing site → (5) pricing.** #1 is now done and verified.
- `skills/private-seller.md` / `skills/dealership-closer.md`: written,
  **still not wired into `app/api/generate-script/route.ts`** — that's
  next.

## Open issues, carried over (unrelated to this session's work)

- Band section's background is still a placeholder gradient (real
  `/bmw-citylights.jpg` never sourced).
- Hero repeats "Scan the tag / hear the car" phrasing twice in a row
  (explicit user choice from two sessions ago, flagged as worth a second
  look).
- Last session's key-rotation recommendation: the *original* `.env.local.example`
  keys — separate from this session's malformed-var incident — should
  still be rotated if that wasn't already done alongside this session's
  key replacements.

## Next steps, in order

1. **Script/audio quality** (per `PRODUCT_PLAN.md`'s sequence): wire
   `skills/private-seller.md` and `skills/dealership-closer.md` into
   `app/api/generate-script/route.ts`'s system prompt, and calibrate
   output for ~150 words / ~60 seconds spoken.
2. Decide whether to clean up the test listing (`2019 Honda Civic EX`,
   fake data) sitting in the Blob store — low priority, harmless.
3. Physical "For Sale Sign" design work (per `PRODUCT_PLAN.md`) once
   script/audio quality is solid.
