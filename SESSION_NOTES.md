# Session Notes — 2026-07-12 (script-quality session)

## ⭐ First thing next session (user's explicit request)

**Keep working on the scripts.** They sound good now but the user says
they're **almost too salesy — tone them down a notch.** The key reframe:
the real user is an **everyday person selling an everyday car with normal
wear and tear**, who wants to **sell fast and for the best price** — not
a dealership moving pristine luxury inventory. Keep the luxury-brand
elevation (correct when a Porsche/Mercedes is entered), but bring the
*default* tone down to a sharp, trustworthy, still-persuasive pitch a
regular owner would be comfortable putting on their own car — credible
over glossy, more believable-value/quick-sale, less showroom shine.
Honesty guardrails stay. (Detail: `PRODUCT_PLAN.md` "Open tone-calibration
feedback" + `skills/dealership-closer.md` "Real-world tone calibration".)

**Also remind the user of their social-media idea:** letting sellers post
their generated tour to social media with the **script actually playing**.
Likely needs a short auto-generated share video (waveform + vehicle info
+ narrated audio → MP4, since audio-only doesn't autoplay in feeds); also
free VIN Voice branding on every share. (In `PRODUCT_PLAN.md` upgrade
ideas.)

## What was done this session

Rewrote the `generate-script` system prompt (`app/api/generate-script/
route.ts`) from the old casual "owner telling a friend, mention the
flaws" voice into a **brand-aware dealership closer**, per the user's
direction:

- **Hook-first**: never opens with year/make/model; opens with an
  aspirational/sensory line to survive the first ~5 seconds.
- **Brand-character matching, no hardcoded list**: Claude's own brand
  knowledge shifts the register — luxury makes (Mercedes/Porsche/Lexus/…)
  get prestige/craftsmanship language, performance gets adrenaline,
  mainstream (Honda/Toyota/…) gets smart-money confidence, trucks get
  capability. Verified with real generations that Mercedes, Porsche, and
  Civic produce three distinctly-registered scripts.
- **Model-reputation selling points**: pulls what that make/model/year is
  genuinely known for (reliability, resale, awards) even if the seller
  didn't type it — this is the "use that model's perks" ask, via built-in
  knowledge (a live comps/past-sales data feed was considered and
  deferred).
- **Price framed as "the easy part."**
- **Honesty guardrails kept**: no invented specifics about the exact car,
  disclosed flaws never contradicted, no fabricated market comparisons.
- **Length tuned empirically**: target lowered to ~140 words after
  measuring real ElevenLabs audio — lands ~50–65s (voice pace varies
  143–174 wpm run-to-run; exact-60 isn't achievable, the band is the
  spec).

Verification was done by generating real scripts + measuring real audio
duration via a headless-browser `audio.duration` read (Playwright in the
scratchpad dir, not a repo dependency). Mercedes E 350 = 140 words /
50.5s; Porsche 911, Civic all 143–147 words / 50–66s.

**Committed + pushed**: `8f9e441` "Rewrite script generation as brand-aware
dealership closer" (prompt + PRODUCT_PLAN.md). This session's doc/skill
updates (tone-down feedback, social idea) are a separate commit — see
below.

## State

- Git: `origin/main` in sync (through `8f9e441` + the doc-update commit).
- Dev server: **stopped** (was running during testing; stop it before
  breaking is normal — restart with `npm run dev`, ~localhost:3000).
- Vercel/Blob/API keys: all working, verified last session. One real test
  listing (fake 2019 Honda Civic) sits in the Blob store — harmless.

## Decisions locked this session

- Script voice = **dialed-up dealership closer with brand-tier awareness**,
  NOT the original "blend private-seller + dealer" plan. Private-seller
  persona retained in `skills/` only as a possible future user-selectable
  tone. (PRODUCT_PLAN.md script section rewritten to reflect this.)
- Brand recognition is **prompt-driven, not a hardcoded brand list** —
  deliberate, so typos/synonyms/new brands all work.

## Open / carried over (unchanged)

- Background music (high-end-showroom, mixed under voice): still unbuilt,
  needs a licensed track (Suno licensing unconfirmed) + mixing work.
- Site is still thin: dead nav `#` links (How it works, Log in), no FAQ or
  "For Sale Sign Kit" page yet. Not deployed (deliberate — QR codes would
  point at localhost; deploy only when ready to test on real phones).
- Band section placeholder gradient (no real `/bmw-citylights.jpg`); hero
  repeats "Scan the tag / hear the car" twice.
- Key-rotation recommendation from earlier sessions still stands if not
  already done.

## Next steps, in order

1. **Tone down the scripts** (see top of file) — the active task.
2. **Social-media share** exploration (see top of file).
3. **Background music** — the remaining piece of the script/audio phase.
4. Then per PRODUCT_PLAN sequence: physical For Sale Sign → marketing site
   → pricing.
