import { fileURLToPath } from "node:url";
import { gallery } from "../content/gallery";
import { home } from "../content/home";
import { site } from "../content/site";
import { hasPhoto } from "../content/types";
import { findPhotoProblems, findSiteProblems } from "../lib/content-checks";

// Runs before every build (npm "prebuild"), previews included: a mistyped phone number or a missing
// photo fails here, with a message, instead of breaking the page for visitors.
const photos = [
  { path: "home.hero.photo", photo: home.hero.photo },
  ...(hasPhoto(home.whyUs.photo) ? [{ path: "home.whyUs.photo", photo: home.whyUs.photo }] : []),
  ...home.services.items.map((item, index) => ({ path: `home.services.items[${index}].photo`, photo: item.photo })),
  ...gallery.map((photo, index) => ({ path: `gallery[${index}]`, photo })),
  ...home.process.steps.flatMap((step, index) => (hasPhoto(step.photo) ? [{ path: `home.process.steps[${index}].photo`, photo: step.photo }] : [])),
];

const logos = Object.entries(site.logo.full.image).map(([locale, image]) => ({ path: `site.logo.full.image.${locale}`, photo: image }));

const problems = [...findSiteProblems(site), ...findPhotoProblems([...photos, ...logos], fileURLToPath(new URL("../public", import.meta.url)))];
if (problems.length > 0) {
  console.error("Content check failed. Fix these in content/:");
  for (const problem of problems) console.error(`- ${problem}`);
  process.exitCode = 1;
}
