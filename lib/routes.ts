// Relative imports only: next.config.ts loads this file, and it doesn't resolve "@/".
import { site as siteContent, type SiteContent } from "../content/site";
import { defaultLocale, locales, type Locale } from "../content/types";
import { isProductionBuild } from "./env";

export function otherLocale(locale: Locale): Locale {
  return locale === "es" ? "en" : "es";
}

/** The language that isn't the default; it's served under "/<code>" (app/(alternate)/[alt]). */
export const alternateLocale: Locale = otherLocale(defaultLocale);

/**
 * The route table for a given default language: "/" for it, "/<code>" for the other. Exported so tests
 * can check both settings; the site uses `routes` below, built from content/types.ts defaultLocale.
 */
export function routesFor(defaultLanguage: Locale) {
  const homePath = (locale: Locale) => (locale === defaultLanguage ? "/" : `/${locale}`);
  return {
    home: { es: homePath("es"), en: homePath("en") },
  } as const satisfies Record<string, Record<Locale, string>>;
}

/**
 * The single route table. The site is one page per language; the ES | EN switch, hreflang,
 * the sitemap and the redirects all read from here. lib/routes.test.ts checks each entry has its page file.
 */
export const routes = routesFor(defaultLocale);

export type RouteKey = keyof typeof routes;
export const routeKeys = Object.keys(routes) as RouteKey[];

/** In-page anchors on the home page, translated so URLs read naturally in each language. */
export const sections = {
  services: { es: "servicios", en: "services" },
  whyUs: { es: "por-que-nosotros", en: "why-us" },
  work: { es: "trabajos", en: "work" },
  process: { es: "proceso", en: "process" },
  faq: { es: "preguntas", en: "faq" },
  contact: { es: "contacto", en: "contact" },
} as const satisfies Record<string, Record<Locale, string>>;

export type SectionKey = keyof typeof sections;

/**
 * The languages this build serves, default first. The one place "previews on, production off" is
 * decided: both languages are built, except that a production build leaves out the other language
 * until `translationsReviewed` is true. Everything else (the "/<code>" page, the switch, hreflang,
 * the sitemap, share images, the 404, redirect targets) reads this result, so there is no second
 * code path for production.
 */
export function publishedLanguages(
  site: Pick<SiteContent, "translationsReviewed"> = siteContent,
  vercelEnv: string | undefined = process.env.VERCEL_ENV,
): Locale[] {
  const held = isProductionBuild(vercelEnv) && !site.translationsReviewed;
  return [defaultLocale, ...locales.filter((code) => code !== defaultLocale && !held)];
}

/** The languages this build serves. */
export const builtLocales: Locale[] = publishedLanguages();

/** True when this build serves the other language at "/<code>". */
export function hasAlternate(languages: readonly Locale[] = builtLocales): boolean {
  return languages.includes(alternateLocale);
}

/** Every page path in every language the build serves (redirect targets must be one of these). */
export function pagePathsFor(languages: readonly Locale[]): string[] {
  return routeKeys.flatMap((key) => languages.map((locale) => routes[key][locale]));
}

export const pagePaths: string[] = pagePathsFor(builtLocales);

export function href(route: RouteKey, locale: Locale, section?: SectionKey): string {
  const path = routes[route][locale];
  return section ? `${path}#${sections[section][locale]}` : path;
}

/**
 * href() in `locale` when this build serves it, otherwise in the default language. For links that must
 * always land somewhere, like old-URL redirects: a Spanish one goes to the English page while
 * production is English-only.
 */
export function servedHref(route: RouteKey, locale: Locale, section?: SectionKey, languages: readonly Locale[] = builtLocales): string {
  return href(route, languages.includes(locale) ? locale : defaultLocale, section);
}

/** The section's anchor id in this language. */
export function sectionId(section: SectionKey, locale: Locale): string {
  return sections[section][locale];
}
