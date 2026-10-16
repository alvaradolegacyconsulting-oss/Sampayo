import { describe, expect, it } from "vitest";
import { content } from "@/content";
import { drafted, placeholder } from "@/content/types";
import { collectPhotos, findPlaceholders, findStockPhotos, findUntranslated, runGates, translationGates, type Gate } from "@/lib/gates";

describe("PLACEHOLDERS_RESOLVED", () => {
  it("finds placeholder strings at any depth, with their path", () => {
    expect(findPlaceholders({ a: { b: ["ok", "[PLACEHOLDER: x]"] } }, "c")).toEqual(["c.a.b[1]: [PLACEHOLDER: x]"]);
    expect(findPlaceholders({ a: "fine", n: null, x: 3 })).toEqual([]);
  });

  it("passes the real content: every open question is answered", () => {
    const [placeholders] = runGates(content);
    expect(placeholders.problems).toEqual([]);
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

describe("TRANSLATIONS_COMPLETE and TRANSLATIONS_REVIEWED for production", () => {
  const gate = (gates: Gate[], name: string) => gates.find((g) => g.name === name)!;
  const missingSpanish = { a: { x: drafted("", "Hello") } };
  const missingEnglish = { a: { x: drafted("Hola", "") } };

  it("hold, not block, while translationsReviewed is false: production builds the default language only", () => {
    const gates = translationGates(missingSpanish, { translationsReviewed: false });
    expect(gate(gates, "TRANSLATIONS_COMPLETE").problems).toEqual([]);
    expect(gate(gates, "TRANSLATIONS_COMPLETE").held).toContain("1 string(s) still missing a language on previews");
    expect(gate(gates, "TRANSLATIONS_REVIEWED").problems).toEqual([]);
    expect(gate(gates, "TRANSLATIONS_REVIEWED").held).toContain("translationsReviewed is false");
  });

  it("still block on missing default-language text", () => {
    expect(gate(translationGates(missingEnglish, { translationsReviewed: false }), "TRANSLATIONS_COMPLETE").problems).toEqual(["a.x.en is empty"]);
  });

  it("block on any missing text once the translations are reviewed", () => {
    const gates = translationGates(missingSpanish, { translationsReviewed: true });
    expect(gate(gates, "TRANSLATIONS_COMPLETE").problems).toEqual(["a.x.es is empty"]);
    expect(gate(gates, "TRANSLATIONS_COMPLETE").held).toBeUndefined();
    expect(gate(gates, "TRANSLATIONS_REVIEWED").held).toBeUndefined();
  });
});
