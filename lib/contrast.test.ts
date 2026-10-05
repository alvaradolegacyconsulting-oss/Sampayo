import { readdirSync, readFileSync } from "node:fs";
import { join, relative } from "node:path";
import { describe, expect, it } from "vitest";
import { blend, contrastRatio } from "@/lib/contrast";
import { theme } from "@/theme/tokens";

const { color } = theme;

// Every text/background pair the site uses. Add a row when a component introduces a new one.
const textPairs: [string, string, string][] = [
  ["ink on paper", color.ink, color.paper],
  ["ink on white", color.ink, color.white],
  ["navy on paper", color.navy, color.paper],
  ["navy on white", color.navy, color.white],
  ["navy on stone (photo stand-ins)", color.navy, color.stone],
  ["muted on paper", color.muted, color.paper],
  ["muted on white", color.muted, color.white],
  ["muted on stone", color.muted, color.stone],
  ["copper on paper", color.copper, color.paper],
  ["copper on white", color.copper, color.white],
  ["alert on white", color.alert, color.white],
  ["white on navy", color.white, color.navy],
  ["white on navy deep", color.white, color.navyDeep],
  ["copper light on navy", color.copperLight, color.navy],
  ["copper light on navy deep", color.copperLight, color.navyDeep],
  // Translucent text (Tailwind's text-white/80), blended over its background.
  ["white/80 on navy", blend(color.white, color.navy, 0.8), color.navy],
  ["white/80 on navy deep", blend(color.white, color.navyDeep, 0.8), color.navyDeep],
];

describe("theme contrast", () => {
  it("matches known WCAG values", () => {
    expect(contrastRatio("#000000", "#FFFFFF")).toBeCloseTo(21, 5);
    expect(contrastRatio("#FFFFFF", "#FFFFFF")).toBeCloseTo(1, 5);
    expect(blend("#000000", "#FFFFFF", 0.5)).toBe("#808080");
  });

  it.each(textPairs)("%s meets 4.5:1", (_name, foreground, background) => {
    expect(contrastRatio(foreground, background)).toBeGreaterThanOrEqual(4.5);
  });

  // Non-text (WCAG 1.4.11): form field borders must stand out 3:1 from the field and the form behind it.
  it.each([
    ["input border (muted/70) on white", blend(color.muted, color.white, 0.7), color.white],
    ["input border (muted/70) against the paper form", blend(color.muted, color.white, 0.7), color.paper],
  ])("%s meets 3:1", (_name, border, background) => {
    expect(contrastRatio(border, background)).toBeGreaterThanOrEqual(3);
  });
});

// Copper is text-safe only on light backgrounds (2.5:1 on navy). On dark sections use copper-light.
describe("copper never used as text on navy", () => {
  const root = new URL("../", import.meta.url).pathname;

  function sourceFiles(dir: string): string[] {
    let entries;
    try {
      entries = readdirSync(join(root, dir), { withFileTypes: true });
    } catch {
      return [];
    }
    return entries.flatMap((entry) => {
      const path = join(dir, entry.name);
      if (entry.isDirectory()) return sourceFiles(path);
      return /\.tsx$/.test(entry.name) && !/\.test\.tsx$/.test(entry.name) ? [path] : [];
    });
  }

  it("copper on navy really fails, so this check is needed", () => {
    expect(contrastRatio(color.copper, color.navy)).toBeLessThan(4.5);
    expect(contrastRatio(color.copper, color.navyDeep)).toBeLessThan(4.5);
  });

  it.each(["components", "app"].flatMap(sourceFiles).map((file) => [file]))(
    "%s has no class list mixing a navy background with text-copper",
    (file) => {
      const source = readFileSync(join(root, file), "utf8");
      // Each string or template literal is one class list; flag any that puts copper text on navy.
      const classLists = source.match(/"[^"\n]*"|`[^`]*`/g) ?? [];
      const bad = classLists.filter(
        (list) => /\b(bg-navy|bg-navy-deep|on-dark)\b/.test(list) && /\btext-copper\b(?!-)/.test(list),
      );
      expect(bad, relative(root, join(root, file))).toEqual([]);
    },
  );
});
