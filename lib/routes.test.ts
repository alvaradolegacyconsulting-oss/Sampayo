import { readdirSync, readFileSync } from "node:fs";
import { join, relative } from "node:path";
import { describe, expect, it } from "vitest";
import { defaultLocale } from "@/content/types";
import { alternateLocale, href, otherLocale, pagePaths, routeKeys, routes, routesFor, sections } from "@/lib/routes";

const appDir = new URL("../app/", import.meta.url).pathname;

function allPageFiles(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) =>
    entry.isDirectory() ? allPageFiles(join(dir, entry.name)) : entry.name === "page.tsx" ? [join(dir, entry.name)] : [],
  );
}

// Role-named groups: (default) renders defaultLocale at "/", (alternate)/[alt] renders the other at "/<code>".
const pageFiles = {
  default: join(appDir, "(default)", "page.tsx"),
  alternate: join(appDir, "(alternate)", "[alt]", "page.tsx"),
};

describe("route table", () => {
  it("has exactly the two page files, one per role", () => {
    expect(allPageFiles(appDir).map((file) => relative(appDir, file)).sort()).toEqual(
      Object.values(pageFiles).map((file) => relative(appDir, file)).sort(),
    );
  });

  it.each(routeKeys)("%s: each page file renders its role's language", (key) => {
    const defaultSource = readFileSync(pageFiles.default, "utf8");
    const alternateSource = readFileSync(pageFiles.alternate, "utf8");
    expect(defaultSource).toContain(`pageMetadata("${key}", defaultLocale)`);
    expect(defaultSource).toContain("locale={defaultLocale}");
    expect(alternateSource).toContain(`pageMetadata("${key}", alternateLocale)`);
    expect(alternateSource).toContain("locale={alternateLocale}");
  });

  it("serves the default language at / and the other at /<code>", () => {
    expect(routes.home[defaultLocale]).toBe("/");
    expect(routes.home[alternateLocale]).toBe(`/${alternateLocale}`);
    expect(alternateLocale).toBe(otherLocale(defaultLocale));
    expect(new Set(pagePaths).size).toBe(pagePaths.length);
  });

  it("flips cleanly when defaultLocale changes (the one-value switch)", () => {
    expect(routesFor("es").home).toEqual({ es: "/", en: "/en" });
    expect(routesFor("en").home).toEqual({ es: "/es", en: "/" });
  });

  it("builds section links in each language", () => {
    expect(href("home", defaultLocale, "contact")).toBe(`/#${sections.contact[defaultLocale]}`);
    expect(href("home", alternateLocale, "faq")).toBe(`/${alternateLocale}#${sections.faq[alternateLocale]}`);
  });

  it("section anchors are unique within each language", () => {
    for (const locale of ["es", "en"] as const) {
      const ids = Object.values(sections).map((section) => section[locale]);
      expect(new Set(ids).size).toBe(ids.length);
    }
  });
});
