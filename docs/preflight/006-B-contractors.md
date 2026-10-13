# GREENLIGHT 006-B — sampayo: rewrite for general contractors, logo, photos, videos

**Written:** October 13, 2026 (updated with Jose's answers) · **Architect:** Claude (chat) ·
**Builder:** Mateo (Claude Code)
**Place in repo:** `docs/preflight/006-B-contractors.md`. Branch: `build/v1`.
**Read first:** the current `CLAUDE.md` standard (Jose copies it in; commit it first).

## Why

Sampayo Construction LLP is a **roofing subcontractor**. Its customers are **general contractors and
builders in the Twin Cities**, not homeowners. Every line of the site should speak to a GC deciding
whether to put Sampayo's crew on a job. The copy below comes from Sampayo's current Squarespace site
(sampayoconstruction.com), tightened. Don't invent numbers, licenses, brands, areas or response
times.

## Decisions (Jose, Oct 13)

| Item | Decision |
|---|---|
| Default language | **English** at `/`, Spanish one tap away. A single content setting |
| Headline | Option **A** (below) |
| Service area | **Twin Cities** |
| License | **Not shown.** Don't claim a license or registration anywhere |
| Insurance | Insured: general liability and workers' compensation |
| Drones | **None.** Remove all drone wording |
| Email | **None.** Omar prefers calls: call and text only, no email, no Copy button. Mark email as intentionally none (explicit marker, not a placeholder) so the gate passes |
| Logo | The **navy/copper logo with the compass and Philippians 4:13** (the one on the live site) |
| Photos | Real photos of Omar's team from his gallery; stock only as a stand-in |
| Videos | Stock HeyGen presenter with voice-over. Never captioned as Omar or a team member |

## Step 0 — report before code (short)

1. Current hero, services, process, FAQ and contact copy, and who it's written for.
2. Photo slots (file + line); current default language and how the switch works.
3. Security baseline status (headers, `_blank` helper); port from alc-site if missing.
4. PRODUCTION_GATES output.

Proceed after reporting unless something conflicts with this greenlight.

## Copy (English; write the Spanish drafts too, for Omar's review)

### Hero
- Headline: "Roofing crews Minnesota contractors can count on."
- Subline: "Sampayo Construction is a roofing subcontractor for general contractors and builders
  across the Twin Cities: tear-offs, new installs, repairs and storm-volume work, residential and
  commercial."
- Buttons: "Request a bid" (→ `#contact`) and "Call Omar" (`tel:`).

### About
"For more than five years, Sampayo Construction has worked as a roofing subcontractor for general
contractors and builders across the Twin Cities. Our installers, foremen and project leads bring
specialized training and on-site experience, so your projects finish safely, on schedule and built
to withstand Minnesota winters."

### Why contractors work with us
- "Insured and covered by workers' compensation: no liability gaps on your job."
- "Crews that show up on schedule and hold to your project timeline."
- "Clean, safety-first job sites: daily cleanup, magnetic nail sweep, protected landscaping."
- "Tear-offs, new installs, repairs and storm-volume work, on residential and commercial decks."
- "Bilingual crew and communication (English / Español)."

### What we offer
Intro: "From ice dams to hail season, we bring craftsmanship and materials built for northern
climates to the general contractors and builders we work under. Have a specialized scope? We'll
build a custom bid with you."

| Service | Line |
|---|---|
| Roof replacement | "Full tear-off and new installation to manufacturer standards, residential and commercial." |
| Roof repair | "Leaks, storm damage and worn sections, scoped and fixed so the rest of your project keeps moving." |
| Storm volume | "Extra crews for post-storm demand, when your schedule fills up after hail or wind." |
| Gutter systems | "Gutters and downspouts installed alongside the roof, so the job is finished in one visit." |

### How we work (process)
1. **Inspection.** "We assess the roof and document conditions with hands-on checks and photos,
   with a report you can pass to the owner."
2. **Line-item bid.** "A clear, itemized bid with material recommendations for the Minnesota
   climate, ready to fold into your project."
3. **Build.** "We protect the property and install the roof system to manufacturer standards, start
   to finish, on your schedule."
4. **Final walkthrough.** "A magnetic nail sweep and a joint walkthrough, so the job is clean and
   ready for your sign-off."

(Step 4 was "Final Certification" on the old site; renamed so it doesn't suggest a formal credential.)

### FAQ
- **Do you work directly with homeowners?** "No. We work as a roofing subcontractor. We partner with
  general contractors and builders who hold the contract with the property owner: you manage the
  project and permits, and we deliver the roofing scope."
- **What roofing work do you handle?** "Tear-offs, new installs, repairs, storm-volume work and
  gutter systems, on residential and commercial decks."
- **Are you insured?** "Yes. We carry general liability and workers' compensation, and we can send a
  certificate of insurance on request."
- **What areas do you cover?** "The Twin Cities metro. For projects farther out, call and ask."
- **How do we get a crew on our project?** "Call or text Omar with the project address, scope and
  timeline. We'll come back with a line-item bid."

### Contact ("Let's work together")
"Have a project that needs a roofing crew? Call or text with the scope, address and timeline and
we'll put together a bid." Then: Omar Sampayo · call / text `612-840-7865` (report if content has a
different number). No email, no form.

## Photos

- **Do not use the four process photos from the old site.** They are AI-generated and show invented
  people, a branded shirt, a fake priced proposal and a "certified" family. Process steps render
  without photos (`{ kind: "none" }`) until real job photos arrive.
- **Real team photos first.** Jose supplies photos of Omar's crew from the old site's gallery
  (`kind: "real"`); those may say "our crew". Report each photo's size; anything under 1200px goes in
  small slots only.
- The gutter stock photo uses A1's photo source tracking (`kind: "stock"`, `sourceUrl`, non-failing
  `STOCK_IN_USE`); alt text describes the photo. **Don't use the stock roofer-with-shingles photo**
  (a shingle brand is on the bundles); a real crew photo replaces it.

## Logo

Use the **navy/copper logo with the compass and Philippians 4:13**. Because it includes the verse,
propose whether the header uses a cropped mark (houses + SAMPAYO, no verse) with the full logo
larger in About or the footer. Propose a transparent cut before committing. The black "LLP" mark is
not used.

## Videos

English video on English pages, Spanish on Spanish. A short section ("See how we work" / "Conozca
cómo trabajamos") near About. No autoplay, `preload="none"`, poster frame, controls, captions track
when a subtitle file exists, works at 390px. Labels in `content/`. Report each video's length,
resolution and size, and propose hosting: in the repo if about 10 MB or less after compression,
otherwise Vercel Blob. Not HeyGen embeds. Say what CSP each option needs.

## Language

**English is the default** at `/`, Spanish under one path segment, with the switch. If the build is
Spanish-default today, flip it (routes, hreflang `x-default`, sitemap, JSON-LD).

## Commits (one concern each, push after each)

1. `chore: update CLAUDE.md to current standard` (+ security baseline port if missing)
2. `feat: English default` (if needed)
3. `content: contractor copy` (all sections above, EN + ES drafts)
4. `content: call and text only` (email intentionally none)
5. `content: process steps without photos`
6. `docs: REVIEW.md for Omar` (path | English | Español), like sa-creations
7. **Only when Jose adds files to `public/incoming/`:** `content: logo` · `content: crew photos` ·
   `feat: video section`. Don't wait on these to do 1–6.

## Gates

BUILD_CLEAN · PRODUCTION_GATES (report output) · CONTACT_LINKS, CSP_CLEAN, PHONE_PASS (Jose, on the
preview).
