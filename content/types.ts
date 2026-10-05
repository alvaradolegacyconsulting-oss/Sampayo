// Relative imports only in content/: the gate scripts load it under tsx without the "@/" alias.

export const locales = ["es", "en"] as const;
export type Locale = (typeof locales)[number];

/**
 * THE language switch. The default language is served at "/", the other one at "/en" (or "/es").
 * Change this one value and routes, hreflang, x-default, the sitemap and the old-URL redirects all follow.
 */
export const defaultLocale: Locale = "es";

/**
 * Where a piece of text came from. docs/TRANSLATIONS.md is generated from this
 * (npm run translations), so Omar can review everything that was drafted.
 */
export type TextSource =
  | "drafted" // both languages written for this site from the approved concept; Omar to review
  | "live-site" // both languages from sampayoconstruction.com (pages in `note`), lightly edited
  | "bible" // published Bible translations (versions in `note`)
  | "given" // both languages supplied by the preflight or greenlight
  | "name" // a proper name, the same in both languages
  | "placeholder"; // waiting on Omar; the production build fails while any remain

/** Every user-facing string. Both languages are required; there is no fallback between them. */
export type Text = { es: string; en: string; source: TextSource; note?: string };

/** Marks a value Jose hasn't confirmed yet. The production build fails while any remain (lib/gates.ts). */
export const PLACEHOLDER = "[PLACEHOLDER";
/** Marks a missing translation. The production build fails while any remain (TRANSLATIONS_COMPLETE). */
export const TRANSLATE = "[TRANSLATE";

export const drafted = (es: string, en: string, note?: string): Text => ({ es, en, source: "drafted", ...(note ? { note } : {}) });

/** Both languages from the live site: Spanish from `/` or `/services-1`, English from `/home` or `/services`. */
export const fromLiveSite = (pages: string, es: string, en: string): Text => ({ es, en, source: "live-site", note: pages });

export const given = (es: string, en: string): Text => ({ es, en, source: "given" });

export const name = (value: string): Text => ({ es: value, en: value, source: "name" });

/** A visible stand-in: "[PLACEHOLDER: what]" in both languages. */
export const placeholder = (what: string): Text => {
  const value = `${PLACEHOLDER}: ${what}]`;
  return { es: value, en: value, source: "placeholder" };
};

/** True for a placeholder string (a photo path, a link) that should render as a stand-in. */
export const isPlaceholder = (value: string): boolean => value.startsWith(PLACEHOLDER);

/**
 * A photo. Until the real one arrives, `src` is a "[PLACEHOLDER: …]" string and the
 * page shows a labelled box instead. Real photos go in public/images/ (src "/images/…").
 */
export type Photo = { src: string; alt: Text; width: number; height: number };
