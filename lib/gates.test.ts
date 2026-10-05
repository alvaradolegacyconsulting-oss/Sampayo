import { describe, expect, it } from "vitest";
import { content } from "@/content";
import { drafted, placeholder } from "@/content/types";
import { findPlaceholders, findUntranslated, runGates } from "@/lib/gates";

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
