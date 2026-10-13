import { describe, expect, it } from "vitest";
import { content } from "@/content";
import { drafted, placeholder } from "@/content/types";
import { collectPhotos, findPlaceholders, findStockPhotos, findUntranslated, runGates } from "@/lib/gates";

describe("PLACEHOLDERS_RESOLVED", () => {
  it("finds placeholder strings at any depth, with their path", () => {
    expect(findPlaceholders({ a: { b: ["ok", "[PLACEHOLDER: x]"] } }, "c")).toEqual(["c.a.b[1]: [PLACEHOLDER: x]"]);
    expect(findPlaceholders({ a: "fine", n: null, x: 3 })).toEqual([]);
  });

  it("fails today, listing the open questions (expected until Omar answers)", () => {
    const [placeholders] = runGates(content);
    expect(placeholders.problems.length).toBeGreaterThan(0);
    expect(placeholders.problems.join("\n")).toContain("openQuestions");
  });
});

describe("STOCK_IN_USE", () => {
  const alt = drafted("x", "x");
  const photo = (kind: "real" | "stock", src: string, sourceUrl?: string) => ({ src, alt, width: 1, height: 1, kind, ...(sourceUrl ? { sourceUrl } : {}) });

  it("lists stock photos on the page with their source, and nothing else", () => {
    const sample = {
      a: { hero: photo("stock", "/images/a.jpg", "https://stock.example/1"), crew: photo("real", "/images/b.jpg") },
      b: [photo("stock", "/images/c.jpg"), photo("stock", placeholder("gutter photo").en), { kind: "none" }],
    };
    expect(findStockPhotos(sample)).toEqual([
      "a.hero: /images/a.jpg (source: https://stock.example/1)",
      "b[0]: /images/c.jpg (source: not recorded)",
    ]);
  });

  it("finds every photo in the real content, and none without a kind", () => {
    const photos = Object.entries(content).flatMap(([name, value]) => collectPhotos(value, name));
    expect(photos.length).toBeGreaterThanOrEqual(11);
    expect(photos.every(({ photo }) => photo.kind === "real" || photo.kind === "stock")).toBe(true);
  });
});

describe("TRANSLATIONS_COMPLETE", () => {
  it("passes the real content: every string exists in both languages", () => {
    expect(findUntranslated(content)).toEqual([]);
  });

  it("fails on an empty string or a [TRANSLATE] marker, in either language", () => {
    expect(findUntranslated({ a: { x: drafted("", "Hello") } })).toEqual(["a.x.es is empty"]);
    expect(findUntranslated({ a: [drafted("Hola", "  ")] })).toEqual(["a[0].en is empty"]);
    expect(findUntranslated({ a: drafted("[TRANSLATE] Hola", "Hello") })).toEqual(["a.es: [TRANSLATE] Hola"]);
  });

  it("doesn't count a placeholder as a missing translation (that's the other gate)", () => {
    expect(findUntranslated({ a: placeholder("photo") })).toEqual([]);
  });
});
