# Photo log

Every image prepared with `npm run images` and the exact command that made it from the original, so any
of them can be redone. Originals live outside the repo in `~/Documents/Clients/sampayo-originals/` (`$O`
below). Box values are pixels of the original: `left,top,width,height`.

The six "Our work" photos and three service-card photos that came first (from the live site's gallery,
resized to 1600×1200 with EXIF removed) are listed in `content/gallery.ts` and `content/home.ts` with
their original file names.

| Site file | Original | Kind | Command |
|---|---|---|---|
| `public/images/crew/crew-roof-deck.jpg` (hero) | `crew-roof-deck.jpg` (Omar's crew, 1600×1200) | real | `npm run images -- photo $O/crew-roof-deck.jpg public/images/crew/crew-roof-deck.jpg` |
| `public/images/crew/tearoff-jobsite.jpg` (Why contractors work with us) | `tearoff-jobsite.jpg` (Sampayo job site, 1600×1200) | real | `npm run images -- photo $O/tearoff-jobsite.jpg public/images/crew/tearoff-jobsite.jpg --blur 890,650,55,105 --blur 728,1008,90,80` (blurs: the house number on the garage trim; the dumpster company's name sticker) |
| `public/images/logo/sampayo-logo-full.png` (About) | `logo.jpg` (navy/copper logo with Philippians 4:13, 976×976) | logo | `npm run images -- logo $O/logo.jpg public/images/logo/sampayo-logo-full.png` (crop box and the paper-keying settings are in `scripts/prepare-images.ts`; transparent PNG, for light backgrounds only) |
| `public/images/logo/sampayo-logo-full-es.png` (About, Spanish pages) | `logo-spanish-v2.png` (the same logo with Filipenses 4:13 in Spanish, Reina-Valera 1960, 976×976; `logo-spanish.jpg` beside it has a garbled verse and is not used) | logo | `npm run images -- logo $O/logo-spanish-v2.png public/images/logo/sampayo-logo-full-es.png` |
| `public/images/stock/gutter-downspout.jpg` (Gutter systems card) | `stock-gutter-zachary-keimig-unsplash.jpg` (Unsplash License, Zachary Keimig, [source](https://unsplash.com/photos/a-blue-house-with-a-red-brick-chimney-gvt-wjGk4S4); 3024×4032 portrait) | stock | `npm run images -- photo $O/stock-gutter-zachary-keimig-unsplash.jpg public/images/stock/gutter-downspout.jpg --crop 0,500,3024,2268 --quality 68` (crop: a 4:3 landscape box around the gutter and downspout; quality 68 keeps the film grain under ~600 KB) |

Never use AI or generative upscaling or retouching. Blur only what isn't Sampayo's to show (house
numbers, plates, other businesses' names), never Sampayo's crew or work.
