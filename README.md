# Sampayo Construction website

Bilingual website for Sampayo Construction, LLP, a roofing subcontractor for general contractors and builders
in Minnesota. Spanish is the default language at `/`; English is at `/en`. One setting swaps them (see
[Default language](#default-language-the-one-switch)).

Built and maintained by Alvarado Legacy Consulting. Stack: Next.js (App Router), TypeScript, Tailwind CSS,
hosted on Vercel. No database, no CMS. All content is in typed files under `content/`.

- **Everyday edits** (photos, links, text, FAQ): see [`docs/UPDATING.md`](docs/UPDATING.md).
- **Spanish/English review list** for Omar: [`docs/TRANSLATIONS.md`](docs/TRANSLATIONS.md) (generated).
- **Build instructions** for this version: [`docs/preflight/006-sampayo.md`](docs/preflight/006-sampayo.md)
  and its greenlight [`docs/preflight/006-greenlight.md`](docs/preflight/006-greenlight.md).
- **Not built yet:** the `/api/contact` route that emails project requests. Until it exists, the form shows
  its error message with the phone number (it never pretends a request was sent).

## Prerequisites

- **Node.js 22 or newer** (`node -v`). Install from [nodejs.org](https://nodejs.org) (LTS).
- **npm** (comes with Node).
- **Git**, and access to the GitHub repo `alvaradolegacyconsulting-oss/Sampayo`.
- For deploying: access to the Alvarado Legacy Consulting **Pro** team on Vercel.

## Run it locally

One command per line (zsh):

```zsh
git clone https://github.com/alvaradolegacyconsulting-oss/Sampayo.git
cd Sampayo
npm install
npm run dev
```

Open http://localhost:3000 (Spanish) and http://localhost:3000/en (English).

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Local dev server with live reload. |
| `npm run build` | Production build. Runs the content check and the production gates first (see below). |
| `npm start` | Serves the last build locally. |
| `npm test` | All tests (Vitest): routing, language switch, form states, SEO, redirects, gates, contrast, CONTENT_ONLY. |
| `npm run lint` | ESLint. A clean build **and** a clean lint is what `BUILD_CLEAN` means. |
| `npm run gates` | Runs the production gates now and lists everything still missing. |
| `npm run translations` | Rewrites `docs/TRANSLATIONS.md` from `content/`. Run it after changing any text. |

## Environment variables

None are needed today. [`.env.example`](.env.example) lists, with comments, the three the contact form's email
route will need once it's built (`RESEND_API_KEY`, `CONTACT_TO_EMAIL`, `CONTACT_FROM_EMAIL`) and the ones
Vercel sets by itself (`VERCEL_ENV`, `VERCEL_URL`, `VERCEL_BRANCH_URL`). Never commit a real key; `.env*`
files other than `.env.example` are git-ignored.

## Deploy

Vercel project under the ALC **Pro** team, connected to this GitHub repo.

- **Any branch push** → a **preview** deployment (the staging site). Its URL appears in Vercel → Deployments
  and on the GitHub commit. Previews are hidden from search engines (`robots.txt` disallows all).
- **`main`** → **production**.
- Framework preset: Next.js. Build command and output: defaults. No environment variables to set yet.

To publish: push a branch, check its preview **on a phone** in both languages, open a pull request into `main`,
merge. To roll back: Vercel → Deployments → the last good production deployment → **Promote to Production**.

### What blocks a build

1. **Content check** (every build, previews too): `scripts/check-content.ts`. Fails when the phone's display
   and `tel` numbers disagree or `tel` isn't `+1` and ten digits, an email or link is malformed, or a photo
   path points to a file that isn't in `public/`. The message says what to fix.
2. **Production gates** (production only, i.e. `VERCEL_ENV=production`): `scripts/check-production-gates.ts`.
   - `PLACEHOLDERS_RESOLVED`: no `[PLACEHOLDER: …]` left anywhere in `content/`, including the open questions
     in `content/pending.ts`.
   - `TRANSLATIONS_COMPLETE`: every text has real words in **both** languages (no empty string, no `[TRANSLATE]`).
     The site never falls back to the other language.
   - Run `npm run gates` locally to see the list before merging to `main`.
3. **Redirect check** (every build): `next.config.ts` refuses an invalid list in `content/redirects.ts`.

### Going live on sampayoconstruction.com (cutover)

The current Squarespace site renews **April 29, 2027**. Before then:

1. Build and test `/api/contact` (the next preflight) and set its three environment variables in Vercel.
2. Make sure `npm run gates` passes and Omar has reviewed `docs/TRANSLATIONS.md`.
3. Confirm `content/redirects.ts` covers every old URL still in use (business cards, QR codes, Google profile).
4. In Vercel → Project → Settings → Domains, add `www.sampayoconstruction.com` and `sampayoconstruction.com`
   (redirect the apex to `www`, to match `site.url` in `content/site.ts`).
5. At the domain registrar, point DNS to Vercel as the Domains screen instructs. Squarespace stays live
   until DNS switches, so there's no downtime.
6. Check the site on a phone in both languages, send a test project request, then submit
   `https://www.sampayoconstruction.com/sitemap.xml` in Google Search Console.
7. Cancel the Squarespace plan only after the new site has been live and checked.

## How it's put together

```
content/        All business facts and every piece of text, typed. Edit these, not the components.
  types.ts        defaultLocale (the language switch); Text = { es, en, source }; helpers drafted(),
                  fromLiveSite(), given(), name(), placeholder()
  site.ts         Name, wordmark, phone, contact person, email, social and video links, license, areas served
  home.ts         Every home-page section: hero, trust row, services, why us, gallery text, process, FAQ, contact
  gallery.ts      The job photos in "Our work", with the original file name on the old site
  contact.ts      Project request form: fields, labels, required/optional, messages
  ui.ts           Header, language switch, footer (Philippians 4:13, credit), 404, page title
  redirects.ts    Old Squarespace URLs → new sections (301)
  pending.ts      Open questions; each one blocks production until answered
  index.ts        Every export above, in one object, for the gates and the translations doc
theme/          tokens.ts (colors, font, radii: the only place hex values live), fonts.ts (Archivo)
components/     Generic, content-driven; no business facts (a test checks this: CONTENT_ONLY)
  home/           One component per home-page section
app/
  (default)/      The default language at "/", with its own <html lang>
  (alternate)/[alt]/   The other language at "/en" (only that value; anything else is a 404)
  og/[locale]/    Share images (/og/es, /og/en)
  global-not-found.tsx   Bilingual 404
lib/            routes (the one route table), i18n, seo (metadata, sitemap, JSON-LD), contact, gates, redirects
scripts/        check-content.ts, check-production-gates.ts, translations-doc.ts
docs/           UPDATING.md, TRANSLATIONS.md, preflight/, concept/
public/images/  Job photos (services/, gallery/)
```

### Default language: the one switch

`content/types.ts` has `export const defaultLocale: Locale = "es";`. That value decides everything:

- Spanish at `/` and English at `/en` (today), or, with `"en"`, English at `/` and Spanish at `/es`.
- The ES | EN switch, `hreflang` and `x-default`, the sitemap, the 404 page's language order, and the old-URL
  redirects (the old English pages always land on the English page) all follow it.

To switch to English first: change `"es"` to `"en"`, run `npm test` and `npm run build`, check the preview,
merge. Nothing else to edit. (`lib/routes.test.ts` checks the route table for both settings.)

### Bilingual routing

`lib/routes.ts` is the single route table, built from `defaultLocale`. The site is one page per language; the
nav links are sections of that page, with anchors translated per language (`/#servicios`, `/en#services`).
The two route groups are named by **role**, not language: `app/(default)/page.tsx` renders
`<HomePage locale={defaultLocale} />` and `app/(alternate)/[alt]/page.tsx` renders the other language, with
`generateStaticParams` returning only that language and `dynamicParams = false`. This is the same set of
pieces as Casa del Cordero (route table, two root layouts, `t()` with no fallback, `LangSwitch`, the gates),
with role-named folders so the default language is one value.

### Contact form

`components/ContactForm.tsx` posts JSON to `/api/contact` (fields from `content/contact.ts`, the page language,
and a hidden `website` honeypot). It shows "Sending..." while waiting, success **only** when the route answers
2xx with `{ "ok": true }`, and otherwise an error with the tap-to-call phone number, keeping what was typed.
The payload and reply types are in `lib/contact.ts` for whoever builds the route.

### Updating each file in `content/`

The recurring edits are written up step by step in [`docs/UPDATING.md`](docs/UPDATING.md). In general:

- Every visible string is `{ es, en }`; write both. Use `given("Español", "English")` for text Omar supplied
  and `drafted(...)` for text you wrote or translated (it's listed for review).
- After changing text, run `npm run translations` and commit `docs/TRANSLATIONS.md` too (`npm test` checks it).
- Never invent a fact. If you don't know it yet, use `placeholder("what's missing")` or leave the value `null`;
  production won't build while a placeholder remains, and the page shows it so it's obvious on a preview.
