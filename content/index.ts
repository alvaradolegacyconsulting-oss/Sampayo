// Every content export, in one object. The production gates and docs/TRANSLATIONS.md walk all of it,
// so a new content file only needs adding here. Relative imports only (loaded under tsx).
import { contact } from "./contact";
import { gallery } from "./gallery";
import { home } from "./home";
import { openQuestions } from "./pending";
import { pendingRedirects, redirects } from "./redirects";
import { site } from "./site";
import { ui } from "./ui";

export const content = {
  site,
  ui,
  home,
  gallery,
  contact,
  redirects,
  pendingRedirects,
  openQuestions,
};
