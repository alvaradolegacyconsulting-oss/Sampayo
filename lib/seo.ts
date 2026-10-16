import type { Metadata } from "next";
import { emailAddress, site, socialLinks, type SiteContent } from "@/content/site";
import { defaultLocale, locales, type Locale, type Text } from "@/content/types";
import { ui } from "@/content/ui";
import { localeTag, t } from "@/lib/i18n";
import { builtLocales, otherLocale, routeKeys, routes, type RouteKey } from "@/lib/routes";

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

/**
 * hreflang alternates for a page: each language the build serves, with the default language for
 * everyone else. None while the build serves one language: there is nothing to point to.
 */
export function languageAlternates(route: RouteKey, languages: readonly Locale[] = builtLocales): Record<string, string> | undefined {
  if (languages.length < 2) return undefined;
  return {
    ...Object.fromEntries(languages.map((locale) => [locale, routes[route][locale]])),
    "x-default": routes[route][defaultLocale],
  };
}

/** Base metadata for a root layout; each page adds its own with pageMetadata(). */
export function rootMetadata(locale: Locale): Metadata {
  return {
    metadataBase: new URL(siteOrigin()),
    title: { default: `${site.name} | ${t(ui.homePage.title, locale)}`, template: `%s | ${site.name}` },
    description: t(site.description, locale),
  };
}

/** Share images, served by app/og/[locale]/route.tsx. */
export const ogImagePath: Record<Locale, string> = { es: "/og/es", en: "/og/en" };

const ogLocale = (locale: Locale) => localeTag[locale].replace("-", "_");

/**
 * Full metadata for one page in one language: title, description, canonical, hreflang, Open Graph and
 * Twitter. Next.js replaces (not merges) a parent's openGraph and twitter objects, so every page sets all of them here.
 */
export function pageMetadata(route: RouteKey, locale: Locale, languages: readonly Locale[] = builtLocales): Metadata {
  const { title, description } = pageText[route];
  const fullTitle = `${site.name} | ${t(title, locale)}`;
  const image = { url: ogImagePath[locale], width: 1200, height: 630, type: "image/png", alt: site.legalName };

  return {
    title: { absolute: fullTitle },
    description: t(description, locale),
    alternates: { canonical: routes[route][locale], languages: languageAlternates(route, languages) },
    openGraph: {
      title: fullTitle,
      description: t(description, locale),
      url: routes[route][locale],
      siteName: site.name,
      type: "website",
      locale: ogLocale(locale),
      alternateLocale: languages.includes(otherLocale(locale)) ? [ogLocale(otherLocale(locale))] : [],
      images: [image],
    },
    twitter: { card: "summary_large_image", title: fullTitle, description: t(description, locale), images: [image] },
  };
}

/** Every page in every language the build serves, each listing its translations, for app/sitemap.ts. */
export function sitemapEntries(origin: string, languages: readonly Locale[] = builtLocales) {
  return routeKeys.flatMap((route) =>
    languages.map((locale) => {
      const alternates = languageAlternates(route, languages);
      return {
        url: absoluteUrl(origin, routes[route][locale]),
        ...(alternates
          ? { alternates: { languages: Object.fromEntries(Object.entries(alternates).map(([code, path]) => [code, absoluteUrl(origin, path)])) } }
          : {}),
      };
    }),
  );
}

/**
 * schema.org RoofingContractor, built only from content. No street address (none is published):
 * areaServed instead. Email, social links and license appear only when content/site.ts has them.
 */
export function buildBusinessJsonLd(locale: Locale, origin: string, content: SiteContent = site) {
  const sameAs = [...Object.values(socialLinks(content.social)), content.videosUrl].filter((link): link is string => Boolean(link));

  return {
    "@context": "https://schema.org",
    "@type": "RoofingContractor",
    "@id": `${absoluteUrl(origin, "/")}#business`,
    name: content.legalName,
    alternateName: content.name,
    description: t(content.description, locale),
    url: absoluteUrl(origin, routes.home[locale]),
    inLanguage: localeTag[locale],
    telephone: content.phone.tel,
    areaServed: content.areaServedPlaces.map((place) => ({ "@type": place.type, name: place.name })),
    knowsLanguage: locales.map((code) => localeTag[code]),
    image: absoluteUrl(origin, ogImagePath[locale]),
    ...(emailAddress(content.email) ? { email: emailAddress(content.email) } : {}),
    ...(content.licenseNumber ? { hasCredential: { "@type": "EducationalOccupationalCredential", credentialCategory: "license", identifier: content.licenseNumber } } : {}),
    ...(sameAs.length > 0 ? { sameAs } : {}),
  };
}

/** JSON for a <script type="application/ld+json">, with `<` escaped so content can't close the tag. */
export function serializeJsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
