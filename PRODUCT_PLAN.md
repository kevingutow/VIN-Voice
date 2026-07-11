# VIN Voice — Product Plan

Living document for product direction, brainstorm output, and prioritization.
Started 2026-07-10. Update as decisions get made or superseded — treat this
as the source of truth for "what are we building and why," separate from
`CLAUDE.md` (which documents the codebase/architecture) and
`SESSION_NOTES.md` (which is a per-session work log).

## The vision

A user-friendly, professional SaaS webapp:

1. User creates an account and logs in.
2. Enters information about their vehicle (car, motorcycle, RV, or boat).
3. Optionally uploads photos/documents of service history or mods.
4. AI generates a ~60-second sales script, calibrated to a good speaking
   pace, narrated with soft/energetic background music mixed underneath.
5. Script/audio is attached to a QR code the user can print and place on
   the vehicle.
6. User can optionally **purchase a premade physical "VIN Voice" For Sale
   Sign** — ships with their QR code already on it — to place in the
   vehicle window instead of a printed page.

Success depends on, in the user's stated priority: **ease of use**,
**site freshness/polish**, **quality of the generated script and audio**,
**how good the physical sign looks** (size/shape/color), and **getting
price points right**.

## Business model — the one-time-user problem

Most individual sellers will use this **once** (until their next vehicle,
possibly years later). That doesn't fit a recurring-SaaS pricing model
cleanly. Two distinct audiences, two distinct models:

- **Private sellers** — one-time, pay-per-listing or pay-per-sign
  transaction. Should feel like e-commerce checkout, not a subscription
  signup.
- **Dealerships** — genuinely recurring, high-volume, multi-vehicle.
  This is where a real subscription/seat-based tier belongs — bulk VIN
  upload, multiple signs at once, a management dashboard.

Current pricing page (Free/Pro/Dealer tiers) predates this framing and
should be revisited once the physical-sign COGS + shipping cost are known
(they set the price floor for the private-seller tier).

## Nav / IA target state

Per the user's spec, the toolbar should be:

1. How it works
2. For Sale Sign Kit
3. FAQ
4. Pricing
5. Log in
6. **Get Started Free** (routes to the existing `/builder` flow)

Current nav (`app/components/SiteHeader.tsx`) only has How it
works/Pricing/Log in behind the hamburger menu — **For Sale Sign Kit**
and **FAQ** are new pages/sections that don't exist yet.

## Hero target state

Clean, slick hero image: a **black Mercedes S-Class** with a premade VIN
Voice For Sale Sign visible in the window. Needs a sourced (or
purchased/licensed) photo — same sourcing problem as the current
three-cars Unsplash photo (`public/ivan-kazlouskij-...jpg`), which was a
placeholder pending something more on-brand.

## Vehicle categories

Beyond cars: **motorcycles, RVs, boats**. Already teased in the homepage
"Band" section tags (Cars/Motorcycles/Boats/RVs) — that section is
currently just a placeholder gradient background waiting on real product
support for the other categories.

## Script generation — persona spec

**Built and shipped (2026-07-12), direction chosen by the user:** the
original plan was to blend two personas (private seller + dealership
closer, written up in `skills/private-seller.md` and
`skills/dealership-closer.md`). After hearing the first blended-tone
results, the user explicitly chose the **dealership-closer direction,
dialed up** — a confident, magnetic salesperson hyping the vehicle, with
the price framed as "the easy part." The private-seller persona
(humble, flaw-forward) is retained in `skills/` as reference but is
**not** the shipped voice; it could return later as a user-selectable
"tone" option.

What the shipped prompt (`app/api/generate-script/route.ts`) does:

1. **Hook-first structure** — never opens with year/make/model (the
   buyer can see that); opens with an aspirational/sensory line to
   survive the first five seconds.
2. **Brand-character matching** — recognizes what the make represents
   and shifts register: luxury brands (BMW, Mercedes, Porsche, Lexus,
   Audi, …) get elevated prestige/craftsmanship language; performance
   models get adrenaline; mainstream brands (Honda, Toyota, …) get
   smart-money confidence; trucks/SUVs get capability. **No hardcoded
   brand list in code** — Claude's own brand knowledge does the
   recognition, so typos/synonyms/new brands all work.
3. **Model-reputation selling points** — pulls what that specific
   make/model/year is genuinely known for (reliability, resale, awards)
   even when the seller didn't type it. This covers the "use that
   model's perks" request via Claude's built-in knowledge; a live
   past-sales/comps data feed was considered and deferred — revisit only
   if built-in knowledge proves insufficient.
4. **Price = no big deal** — dropped casually, framed as the easy part.
5. **Honesty guardrails kept** — may hype the model's reputation, may
   never invent specifics (equipment/history/condition) about this exact
   car, never contradicts disclosed flaws, no fabricated market
   comparisons.

Hard constraints:
- Target **~140 words** → lands ~50–65 seconds spoken (measured against
  real ElevenLabs output at 143–174 wpm run-to-run variance; exact-60
  every time isn't achievable, the band is the spec).
- Background music: soft, energetic, high-end-showroom feel, mixed under
  the narration — **still unbuilt**; needs a licensed track (Suno
  licensing unconfirmed — see `CLAUDE.md`) plus audio-mixing work.
  This is the next piece of the script/audio-quality phase.

## Photo/document upload

New builder feature: let users attach photos or documents of service
history and modifications. Two uses:
- Feed into the script generator as source material (proof points the AI
  can reference — "recently replaced timing belt," "aftermarket exhaust,"
  etc.).
- Potential secondary use: surface these on a hosted landing page behind
  the QR code (see upgrade ideas below), not just an audio player.

## Physical "For Sale Sign" — product design notes

Open decisions, not yet finalized:

- **Form factor**: leaning toward a **rearview-mirror hang-tag** (like a
  parking permit or dealer temp tag) over a flat window cling/sign —
  reads more premium, reusable, no adhesive residue, doubles as a bit of
  a collectible. Alternative: traditional flat sign for vehicles where a
  hang-tag doesn't make sense (boats, RVs).
- **Size**: rough starting point ~4"×7" for a mirror hang-tag (legible
  QR from outside the car, doesn't obstruct the driver). Boats/RVs may
  warrant a larger second format since they're viewed from farther away
  and don't have the same windshield-obstruction constraint.
- **Material**: weatherproof — rigid PVC or laminated cardstock,
  UV-resistant. It'll sit in direct sun for weeks at a time.
- **Color**: keep the sign consistent with the existing brand identity
  (black/blue/silver) rather than a different color per vehicle category
  — consistent look builds on-the-road brand recognition rather than
  fragmenting it.
- **QR treatment**: should look designed/branded (logo-framed, like a
  Spotify code), not a plain generic QR square.

Fulfillment (printing, inventory, shipping) is a genuinely different
workstream from the software product — physical goods, not just code —
and should be scoped as its own project rather than bolted on late.

## Slogans / catchphrase bank

**Brand / hero level:**
- "Scan the Tag. Hear the Car." *(already in use on homepage)*
- "Every Vehicle Has a Story." *(already in use, Band section)*
- "Point. Scan. Sold."
- "Don't Just List It — Let It Talk."
- "Hear Before You Buy."

**For Sale Sign product specifically:**
- "The Sign That Talks Back."
- "More Than a Sign — A Sales Pitch in the Window."
- "Your Car's Story, In Your Buyer's Ear."

**Ease-of-use / conversion / onboarding copy:**
- "List it. Voice it. Sell it."
- "From VIN to Voice in Under a Minute." *(already used as a subhead)*
- "Sign up. Scan. Ship. Sold."

## Prioritization — recommended sequence

1. **Core software loop, end-to-end**: account → login → vehicle info →
   script/audio generation → QR code. Everything else depends on this
   existing solidly.
2. **Script + audio quality**: 60-second pacing, seller/dealer persona
   blend, background music mix. Called out as the most important quality
   bar — hardest to retrofit later.
3. **Physical sign**: design finalization + fulfillment/shipping flow.
   Distinct workstream (physical goods/inventory), scope separately.
4. **Marketing site**: new nav (For Sale Sign Kit, FAQ pages), hero
   photo, slogans. Lower technical risk, can iterate continuously
   alongside the above.
5. **Pricing model**: private-seller one-time pricing vs. dealer
   subscription tiers. Needs #1–#3 roughly real first, since sign
   cost + shipping sets the price floor.

## Upgrade ideas (banked for later, not yet prioritized)

- **QR → hosted landing page**, not just an audio player: show the
  uploaded service photos/docs alongside the audio. Turns the sign into
  a mini vehicle-history page and is a real trust signal for buyers.
- **QR scan analytics**: "342 people have listened to your car" — cheap
  to build, strong marketing hook, and a natural repeat-engagement nudge
  for otherwise one-time users.
- **Dealer bulk flow**: spreadsheet/CSV VIN upload, batch script + sign
  generation, multi-vehicle dashboard — the differentiated feature for
  the recurring-revenue dealer tier.
- **Referral / "sell your next one" nudge**: since most users are
  one-time, a light-touch reminder or referral incentive could recapture
  value from an otherwise single-transaction customer.

## Open questions to resolve

- Confirm the two-audience pricing split (private seller one-time vs.
  dealer recurring) before rebuilding the pricing page.
- Source or commission the black Mercedes S-Class hero photo (with a
  mocked-up sign in the window) — same gap as the current placeholder
  hero photo.
- Confirm Suno licensing terms for background music before shipping that
  feature (see `CLAUDE.md`).
- Decide hang-tag vs. flat-sign form factor before ordering samples or
  quoting a print vendor.
