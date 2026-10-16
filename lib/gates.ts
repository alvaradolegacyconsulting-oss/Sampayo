// Relative imports only: scripts/check-production-gates.ts runs this under tsx without the "@/" alias.
import type { SiteContent } from "../content/site";
import { PLACEHOLDER, TRANSLATE, defaultLocale, isPlaceholder, locales, type Locale, type Photo } from "../content/types";
import { publishedLanguages } from "./routes";
import { findTexts } from "./texts";

/** PLACEHOLDERS_RESOLVED: every string anywhere in content that still contains "[PLACEHOLDER", as "path: text". */
export function findPlaceholders(value: unknown, path = "content"): string[] {
  if (typeof value === "string") return value.includes(PLACEHOLDER) ? [`${path}: ${value}`] : [];
  if (Array.isArray(value)) return value.flatMap((item, index) => findPlaceholders(item, `${path}[${index}]`));
  if (value && typeof value === "object") {
    return Object.entries(value).flatMap(([key, item]) => findPlaceholders(item, `${path}.${key}`));
  }
  return [];
}

/**
 * TRANSLATIONS_COMPLETE: every Text has real words in each of `languages` (both, by default). The type
 * already requires both keys; this catches an empty string or a "[TRANSLATE" marker. There is no
 * fallback to the other language.
 */
export function findUntranslated(content: Record<string, unknown>, languages: readonly Locale[] = locales): string[] {
  return Object.entries(content).flatMap(([name, value]) =>
    findTexts(value, name).flatMap(({ path, text }) =>
      languages.flatMap((locale) => {
        const value = text[locale];
        if (typeof value !== "string" || value.trim() === "") return [`${path}.${locale} is empty`];
        if (value.includes(TRANSLATE)) return [`${path}.${locale}: ${value}`];
        return [];
      }),
    ),
  );
}

/** Every Photo (an object with src, alt and a real/stock kind) under `value`, with its path. */
export function collectPhotos(value: unknown, path = "content"): { path: string; photo: Photo }[] {
  if (Array.isArray(value)) return value.flatMap((item, index) => collectPhotos(item, `${path}[${index}]`));
  if (!value || typeof value !== "object") return [];

  const record = value as Record<string, unknown>;
  if ("src" in record && "alt" in record && (record.kind === "real" || record.kind === "stock")) {
    return [{ path, photo: record as Photo }];
  }
  return Object.entries(record).flatMap(([key, item]) => collectPhotos(item, `${path}.${key}`));
}

/**
 * STOCK_IN_USE (never fails): every stock photo that is on the page, as "path: src (source)", so the
 * stand-ins stay visible until real photos replace them. A stock slot still waiting on its file is a placeholder.
 */
export function findStockPhotos(content: Record<string, unknown>): string[] {
  return Object.entries(content)
    .flatMap(([name, value]) => collectPhotos(value, name))
    .filter(({ photo }) => photo.kind === "stock" && !isPlaceholder(photo.src))
    .map(({ path, photo }) => `${path}: ${photo.src} (source: ${photo.sourceUrl ?? "not recorded"})`);
}

/** A gate's result. `held` explains a pass that only holds because something is kept off production. */
export type Gate = { name: string; problems: string[]; held?: string };

/**
 * TRANSLATIONS_COMPLETE and TRANSLATIONS_REVIEWED, judged for a production build, using the same
 * lib/routes.ts publishedLanguages the site is built with. While translationsReviewed is false,
 * production leaves the other language out, so it can't block: the default language must still be
 * complete, and the gates say what previews still lack. Once it's true, any missing text blocks.
 */
export function translationGates(content: Record<string, unknown>, site: Pick<SiteContent, "translationsReviewed">): Gate[] {
  const production = publishedLanguages(site, "production");
  const held = production.length < locales.length;
  const missingOnPreviews = findUntranslated(content).length;

  return [
    {
      name: "TRANSLATIONS_COMPLETE",
      problems: findUntranslated(content, production),
      held: held
        ? `only ${defaultLocale} is built for production; ${missingOnPreviews === 0 ? "every string has both languages on previews" : `${missingOnPreviews} string(s) still missing a language on previews`}`
        : undefined,
    },
    {
      name: "TRANSLATIONS_REVIEWED",
      // Guards the mechanism: production must never publish a translation Omar hasn't signed off.
      problems: !held && !site.translationsReviewed ? ["production would publish unreviewed translations"] : [],
      held: held ? "translationsReviewed is false: both languages on previews, production builds the default language only (docs/REVIEW.md)" : undefined,
    },
  ];
}

export function runGates(content: Record<string, unknown> & { site: Pick<SiteContent, "translationsReviewed"> }): Gate[] {
  return [
    { name: "PLACEHOLDERS_RESOLVED", problems: Object.entries(content).flatMap(([name, value]) => findPlaceholders(value, name)) },
    ...translationGates(content, content.site),
  ];
}
