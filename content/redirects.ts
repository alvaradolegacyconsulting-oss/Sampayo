// Relative imports only: next.config.ts loads this file.
import { servedHref } from "../lib/routes";

export type Redirect = {
  /** Old Squarespace path, starting with "/". */
  from: string;
  /** New path on this site, starting with "/". Must be a real page (tests check it). */
  to: string;
};

/**
 * Old sampayoconstruction.com URLs that should keep working after cutover, each a 308 (next.config.ts).
 * Paths from the live site's menu on 2026-10-05. Targets come from lib/routes.ts, so they follow the
 * default-language switch: the old English pages always land on the English page, and the old Spanish
 * ones land on the Spanish page when this build serves it (English while production is English-only).
 */
export const redirects: Redirect[] = [
  // "About" (English home page).
  { from: "/home", to: servedHref("home", "en") },
  // "Services" (English).
  { from: "/services", to: servedHref("home", "en", "services") },
  // "Servicios" (Spanish).
  { from: "/services-1", to: servedHref("home", "es", "services") },
  { from: "/gallery-1", to: servedHref("home", "es", "work") },
  // "Videos": no videos embedded today, so it lands on the gallery.
  { from: "/sampayo-construction", to: servedHref("home", "es", "work") },
];

/** Redirects still waiting on Jose. Delete each line once it's handled. */
export const pendingRedirects: string[] = [
  "[PLACEHOLDER: any other old URLs still shared (business cards, QR codes, Google Business profile)]",
];
