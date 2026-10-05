import type { Metadata } from "next";
import { site, type SiteContent } from "@/content/site";
import { defaultLocale, type Locale, type Text } from "@/content/types";
import { ui } from "@/content/ui";
import { localeTag, t } from "@/lib/i18n";
import { otherLocale, routes, type RouteKey } from "@/lib/routes";

type VercelEnv = Partial<Record<"VERCEL_ENV" | "VERCEL_BRANCH_URL" | "VERCEL_URL", string>> & Record<string, string | undefined>;

/**
 * The origin this build is served from. Production uses site.url; a preview uses its own Vercel URL
 * so share images and links resolve on the preview itself; a local build uses localhost.
 */
export function siteOrigin(content: Pick<SiteContent, "url"> = site, env: VercelEnv = process.env): string {
  if (env.VERCEL_ENV === "production") return content.url;
  const host = env.VERCEL_BRANCH_URL ?? env.VERCEL_URL;
  return host ? `https://${host}` : "http://localhost:3000";
}

export function absoluteUrl(origin: string, path: string): string {
  return new URL(path, `${origin}/`).toString();
}

/** Title and description for each page. The home page title is the site name plus a tagline. */
const pageText: Record<RouteKey, { title: Text; description: Text }> = {
  home: { title: ui.homePage.title, description: site.description },
};

/** hreflang alternates for a page: both languages, with the default language for everyone else. */
export function languageAlternates(route: RouteKey): Record<string, string> {
  return { es: routes[route].es, en: routes[route].en, "x-default": routes[route][defaultLocale] };
}

/** Base metadata for a root layout; each page adds its own with pageMetadata(). */
export function rootMetadata(locale: Locale): Metadata {
  return {
    metadataBase: new URL(siteOrigin()),
    title: { default: `${site.name} | ${t(ui.homePage.title, locale)}`, template: `%s | ${site.name}` },
    description: t(site.description, locale),
  };
}

const ogLocale = (locale: Locale) => localeTag[locale].replace("-", "_");

/**
 * Metadata for one page in one language: title, description, canonical, hreflang and Open Graph locale.
 * Next.js replaces (not merges) a parent's openGraph object, so every page sets all of it here.
 */
export function pageMetadata(route: RouteKey, locale: Locale): Metadata {
  const { title, description } = pageText[route];
  const fullTitle = `${site.name} | ${t(title, locale)}`;

  return {
    title: { absolute: fullTitle },
    description: t(description, locale),
    alternates: { canonical: routes[route][locale], languages: languageAlternates(route) },
    openGraph: {
      title: fullTitle,
      description: t(description, locale),
      url: routes[route][locale],
      siteName: site.name,
      type: "website",
      locale: ogLocale(locale),
      alternateLocale: [ogLocale(otherLocale(locale))],
    },
  };
}
