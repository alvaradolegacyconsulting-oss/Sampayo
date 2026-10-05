# Updating the site

Plain-English steps for the edits that come up from time to time. Written for whoever holds the Care Plan.
You don't need to know React: every edit below is a change to one file in `content/` (or a photo in
`public/images/`).

**Every edit is in both languages.** Each piece of text looks like this, Spanish first:

```ts
given("Reemplazo de techo", "Roof replacement")
```

- `given(...)`: Omar sent you both languages. Use this when you can.
- `drafted(...)`: you wrote or translated it yourself. It gets listed in `docs/TRANSLATIONS.md` for review.
- Never leave one language empty, and never paste the same English into both. A missing language stops the
  production deploy; the site never quietly shows the other language.

## How every edit works

Run these one at a time in the terminal (zsh). Use **single quotes** around a commit message.

1. **Get the latest code and make a branch:**
   ```zsh
   git checkout main
   git pull
   git checkout -b content/short-description
   ```
2. **Make the edit** described below, in VS Code. Keep the quotes, commas and brackets exactly as in the examples.
3. **Update the review list:** `npm run translations` (rewrites `docs/TRANSLATIONS.md`).
4. **Check it:** `npm test`, then `npm run build`. If something is wrong, the build stops and says what to fix.
   For a look first, run `npm run dev` and open http://localhost:3000 (Spanish) and http://localhost:3000/en.
5. **Commit and push:**
   ```zsh
   git add -A
   git commit -m 'content: add new gallery photos'
   git push -u origin HEAD
   ```
6. **Check the preview:** Vercel builds the branch and shows a preview URL (Vercel → Deployments, or on the
   GitHub commit). Open it **on a phone**, in **both languages** (ES | EN in the header).
7. **Publish:** open a pull request into `main` on GitHub and merge it. Vercel deploys production in a minute
   or two. Check the live site on a phone.

Before merging to `main`, run `npm run gates`: it lists anything that would stop the production deploy.

If a production deploy goes wrong: Vercel → Deployments → the previous good production deployment →
**Promote to Production**. Then fix it calmly on a branch.

Never type a fact you haven't confirmed with Omar (areas, license numbers, prices, claims like drone
inspections). If you don't know, leave the `placeholder("...")` or `null` in place.

---

## Swap or add a gallery photo

File: `content/gallery.ts`. Photos go in `public/images/gallery/`.

Each photo looks like this:

```ts
photo(
  "finished-ridge-vents.jpg",
  "PHOTO-2026-05-05-23-12-52+16.jpg",
  "Techo de tejas terminado con ventilas a lo largo de la cumbrera",
  "Finished shingle roof with vents along the ridge",
),
```

The four parts: the file name in `public/images/gallery/`, where the original came from (the old site's file
name, or `"Omar, 2026-11"`), then what the picture shows in Spanish and in English.

1. Crop to landscape **4:3** and resize to **1600 × 1200** (on a Mac: Preview → Tools → Adjust Size).
   Save as `.jpg` with a short lower-case name, no spaces or accents: `hail-job-edina.jpg`.
2. Put it in `public/images/gallery/`.
3. Add or replace a `photo(...)` block. The gallery shows them in this order; six fill two rows on a laptop.
4. Write the description for someone who can't see the picture ("Crew installing underlayment over new
   decking"), not "photo" or "image".
5. Delete the old file from `public/images/gallery/` if nothing uses it any more.

If a file name is mistyped, the build stops and names the missing file.

## Swap a service-card or hero photo

File: `content/home.ts`. Photos go in `public/images/services/`.

| Photo | Field | Shape |
|---|---|---|
| Hero (crew on a roof) | `hero.photo` | 4:3 |
| Each service card | `services.items[…].photo` | 4:3 |

For a service card, change the file name in `servicePhoto("roof-repair.jpg", "Spanish description", "English description")`.
For the hero or the gutter card (both placeholders today), replace the whole `photo: { ... }` block with:

```ts
photo: {
  src: "/images/services/your-file.jpg",
  alt: drafted("Descripción en español", "English description"),
  width: 1600,
  height: 1200,
},
```

`width` and `height` are the photo's real size in pixels. Until a real photo is set, the page shows a
labelled box saying which photo is missing.

## Add social links or the videos link

File: `content/site.ts`

```ts
social: { facebook: "https://www.facebook.com/…", instagram: null, youtube: "https://www.youtube.com/@…", tiktok: null },
videosUrl: "https://www.youtube.com/@…",
```

- Each link must start with `https://`. Leave `null` for any network Omar doesn't use.
- Social links appear in the footer and in the Google listing data. `videosUrl` adds "Watch project videos →"
  above the gallery.
- Then delete the matching line in `content/pending.ts`.

## Change the phone number

File: `content/site.ts`

```ts
phone: { display: "612-840-7865", tel: "+16128407865" },
```

Change **both**: `display` is what people see, `tel` is what the phone dials (`+1` then ten digits). The build
stops if the two don't match. The new number appears everywhere at once: hero button, contact section,
footer, the form's error message, the share image and the Google listing data.

## Set the email for project requests

When Omar confirms the inbox: in `content/site.ts` set `email: "…",` and put the same address in Vercel →
Project → Settings → Environment Variables → `CONTACT_TO_EMAIL` (once `/api/contact` is built). Delete the
matching line in `content/pending.ts`.

## Edit a service, a reason, a process step or an FAQ

File: `content/home.ts`. Find the text in the section (`services`, `whyUs`, `process`, `faq`) and change both
languages. To add an FAQ, copy one `{ question: …, answer: … },` block and edit it. Keep it to contractors:
no homeowner offers ("free consultation", "upgrade your roof").

## Switch which language comes first

File: `content/types.ts`. Change `export const defaultLocale: Locale = "es";` to `"en"`. English moves to `/`
and Spanish to `/es`; links, the language switch and the old-URL redirects follow by themselves. Delete the
default-language line in `content/pending.ts`.

## Answer an open question

Each line in `content/pending.ts` blocks the production deploy. Put the answer where it belongs in `content/`
(the line names the file), then delete the line. When Omar has checked `docs/TRANSLATIONS.md`, apply the
corrections in the files it names, run `npm run translations`, and delete that line too.
