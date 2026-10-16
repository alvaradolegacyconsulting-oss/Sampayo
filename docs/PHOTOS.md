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

Never use AI or generative upscaling or retouching. Blur only what isn't Sampayo's to show (house
numbers, plates, other businesses' names), never Sampayo's crew or work.
