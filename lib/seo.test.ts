import { describe, expect, it } from "vitest";
import { site } from "@/content/site";
import { defaultLocale } from "@/content/types";
import { alternateLocale, routes } from "@/lib/routes";
import { absoluteUrl, buildBusinessJsonLd, pageMetadata, serializeJsonLd, siteOrigin, sitemapEntries } from "@/lib/seo";

describe("siteOrigin", () => {
  it("uses site.url in production, the preview's own URL on previews, localhost locally", () => {
    expect(siteOrigin(site, { VERCEL_ENV: "production", VERCEL_URL: "x.vercel.app" })).toBe(site.url);
    expect(siteOrigin(site, { VERCEL_ENV: "preview", VERCEL_URL: "a.vercel.app", VERCEL_BRANCH_URL: "b.vercel.app" })).toBe("https://b.vercel.app");
    expect(siteOrigin(site, {})).toBe("http://localhost:3000");
  });
});

describe("pageMetadata", () => {
  it("sets per-language title, canonical, hreflang (x-default = default language) and Open Graph", () => {
    const es = pageMetadata("home", "es");
    const en = pageMetadata("home", "en");

    expect(es.title).toEqual({ absolute: "Sampayo Construction | Subcontratista de techado en Minnesota" });
    expect(en.title).toEqual({ absolute: "Sampayo Construction | Roofing subcontractor in Minnesota" });
    expect(es.alternates).toEqual({
      canonical: routes.home.es,
      languages: { es: routes.home.es, en: routes.home.en, "x-default": routes.home[defaultLocale] },
    });
    expect(en.alternates?.canonical).toBe(routes.home.en);
    expect(es.openGraph).toMatchObject({ locale: "es_US", alternateLocale: ["en_US"], images: [{ url: "/og/es" }] });
    expect(en.openGraph).toMatchObject({ locale: "en_US", images: [{ url: "/og/en" }] });
    expect(en.twitter).toMatchObject({ card: "summary_large_image" });
  });
});

describe("sitemap", () => {
  it("lists the page in both languages, each with its translation", () => {
    const entries = sitemapEntries("https://example.com");
    expect(entries).toHaveLength(2);
    expect(entries).toContainEqual({
      url: absoluteUrl("https://example.com", routes.home[alternateLocale]),
      alternates: { languages: { es: absoluteUrl("https://example.com", routes.home.es), en: absoluteUrl("https://example.com", routes.home.en) } },
    });
  });
});

// SEO gate: RoofingContractor JSON-LD with areaServed only (no street address is published).
describe("RoofingContractor JSON-LD", () => {
  const jsonLd = buildBusinessJsonLd("en", "https://example.com");

  it("is a RoofingContractor with phone, languages and areaServed, and no address", () => {
    expect(jsonLd["@type"]).toBe("RoofingContractor");
    expect(jsonLd.name).toBe(site.legalName);
    expect(jsonLd.telephone).toBe(site.phone.tel);
    expect(jsonLd.areaServed).toEqual([
      { "@type": "City", name: "Minneapolis" },
      { "@type": "City", name: "Saint Paul" },
      { "@type": "State", name: "Minnesota" },
    ]);
    expect(jsonLd.knowsLanguage).toEqual(["es-US", "en-US"]);
    expect("address" in jsonLd).toBe(false);
    expect(jsonLd.url).toBe(absoluteUrl("https://example.com", routes.home.en));
  });

  it("leaves out email, license and sameAs until content has them", () => {
    expect("email" in jsonLd).toBe(false);
    expect("hasCredential" in jsonLd).toBe(false);
    expect("sameAs" in jsonLd).toBe(false);
    const filled = buildBusinessJsonLd("en", "https://example.com", {
      ...site,
      email: "a@example.com",
      social: { ...site.social, facebook: "https://facebook.com/x" },
    });
    expect(filled).toMatchObject({ email: "a@example.com", sameAs: ["https://facebook.com/x"] });
  });

  it("escapes < so content cannot close the script tag", () => {
    expect(serializeJsonLd({ name: "</script>" })).toBe('{"name":"\\u003c/script>"}');
  });
});
