// Relative imports only: next.config.ts loads this file, and it doesn't resolve "@/".
import { defaultLocale, type Locale } from "../content/types";

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

export const pagePaths: string[] = routeKeys.flatMap((key) => Object.values(routes[key]));

export function href(route: RouteKey, locale: Locale, section?: SectionKey): string {
  const path = routes[route][locale];
  return section ? `${path}#${sections[section][locale]}` : path;
}

/** The section's anchor id in this language. */
export function sectionId(section: SectionKey, locale: Locale): string {
  return sections[section][locale];
}
