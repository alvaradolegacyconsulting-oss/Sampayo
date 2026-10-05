# PREFLIGHT 006 — Sampayo Construction website (v1)

**Written:** October 5, 2026 · **Architect:** Claude (chat) · **Builder:** Mateo (Claude Code)
**Place in repo:** `docs/preflight/006-sampayo.md`. Read `CLAUDE.md` first.

## What we're building

A clean, bilingual site for Sampayo Construction, LLP, a **roofing subcontractor for general contractors
and builders in Minnesota** (not homeowners). Jobs: show the work, build trust (insured, on time, clean
sites, bilingual crews), and get project requests from contractors. Replaces sampayoconstruction.com
(Squarespace renews Apr 29, 2027).

Approved direction: concept PDFs in `docs/concept/`.

## Reuse (read only)

Port from `alc-site` (tooling, seo, gates, redirects, components, tokens pattern), and the **bilingual
routing from Casa del Cordero** once it's greenlit there; if Casa isn't that far yet, propose the same
approach in Step 0 so both sites match.

## Step 0 — report before code

File tree, content types, port list, bilingual routing, ambiguities. Wait for a greenlight.

## Decisions already made

| Decision | Choice |
|---|---|
| Language | **Spanish at `/`, English at `/en`** for now (matches the current site); one config value switches the default if Omar prefers English. `{ es, en }` both required; `TRANSLATIONS_COMPLETE` gate |
| Audience | Contractors only. No homeowner language ("upgrade your roof", free consultation) |
| Contact | Project request form → `/api/contact` → email. **Build the UI; stop before the API/email commit** |
| Photos | The current gallery has real job photos: use them. Process-step images on the current site are generated: don't reuse |
| Footer | Philippians 4:13 + "Developed by Alvarado Legacy Consulting" |

## Home sections

1. Header: logo, Servicios, Por qué nosotros, Trabajos, Preguntas, ES | EN, button "Consultar disponibilidad".
2. Hero: "Techos bien hechos, siempre." / "Roofing done right, every time." Phone 612-840-7865 + project
   details button.
3. Trust row: insured with workers' comp · 5+ years · bilingual crews · residential and commercial.
4. Services: roof replacement, roof repair, storm volume work, custom scopes, with the ice dams/hail line.
5. Why contractors work with us (five points from the current site).
6. Gallery: "Protecting Minnesota homes, one roof at a time" / Twin Cities and beyond. Real photos.
7. Process: inspection, clear proposal, precision build, final walkthrough. **No drone claim** until confirmed.
8. FAQ: the five questions from the current site (both languages).
9. Contact: Omar Sampayo, phone, form (company, name, phone, email, project location, target dates,
   scope and roof type, honeypot).

## Tokens

navy #1B2A47 · navyDeep #121D33 · copper #94582A (text-safe) · copperLight #E3B98E (on dark) ·
paper #F6F4EF. Font: Archivo (400–800).

## Open questions

- [ ] Default language (Omar)
- [ ] Areas covered; Minnesota license number if applicable; drone inspections yes/no
- [ ] Email for project requests; social and video links
- [ ] Logo file; team photo; crew-at-work photos

## Gates

`BUILD_CLEAN` · `CONTENT_ONLY` · `PLACEHOLDERS_RESOLVED` · `TRANSLATIONS_COMPLETE` · `LANG_SWITCH` ·
`FORM_UI` · `PHONE_PASS` · `A11Y` · `SEO` (RoofingContractor JSON-LD, hreflang) · `README_REPLAYS` ·
`UPDATING_DOC`

## Commit order

1. Scaffold + tooling · 2. Content + types (es + en) · 3. Bilingual routing + layout · 4. Hero, trust,
services · 5. Why us, gallery · 6. Process, FAQ · 7. Contact UI · 8. SEO + gates · 9. README, UPDATING.
**Stop before `/api/contact`.**
