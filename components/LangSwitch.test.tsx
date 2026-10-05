// @vitest-environment jsdom
import { render, screen } from "@testing-library/react";
import { beforeAll, describe, expect, it } from "vitest";
import { SiteHeader } from "@/components/SiteHeader";
import { locales } from "@/content/types";
import { otherLocale, routeKeys, routes } from "@/lib/routes";

beforeAll(() => {
  // jsdom has no matchMedia (the mobile menu uses it once open).
  window.matchMedia ??= ((query: string) =>
    ({ matches: false, media: query, addEventListener: () => {}, removeEventListener: () => {} }) as unknown as MediaQueryList);
});

// LANG_SWITCH: in both languages, the switch goes to the same page in the other language.
describe("ES | EN switch", () => {
  it.each(routeKeys.flatMap((key) => locales.map((locale) => [key, locale] as const)))("%s (%s)", (key, locale) => {
    render(<SiteHeader route={key} locale={locale} />);
    const other = otherLocale(locale);
    const link = screen.getByRole("link", { name: other === "en" ? "Read this page in English" : "Ver esta página en español" });

    expect(link.getAttribute("href")).toBe(routes[key][other]);
    expect(link.getAttribute("hreflang")).toBe(other);
    expect(link.getAttribute("lang")).toBe(other);
    expect(screen.getByText(locale.toUpperCase()).getAttribute("aria-current")).toBe("true");
  });

  it.each(locales)("header links in %s stay on this language's page", (locale) => {
    render(<SiteHeader route="home" locale={locale} />);
    const nav = screen.getAllByRole("navigation", { name: locale === "es" ? "Navegación principal" : "Main navigation" })[0];
    for (const link of nav.querySelectorAll("a")) {
      expect(link.getAttribute("href")?.startsWith(`${routes.home[locale]}#`)).toBe(true);
    }
  });
});
