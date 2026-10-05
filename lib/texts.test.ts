import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { content } from "@/content";
import { translationNotes } from "@/content/translation-notes";
import { drafted, name } from "@/content/types";
import { findTexts, translationsDoc } from "@/lib/texts";

describe("findTexts", () => {
  it("finds Text values at any depth, with their path", () => {
    const value = { a: { b: [drafted("uno", "one")] }, n: null, s: "plain string" };
    expect(findTexts(value, "x")).toEqual([{ path: "x.a.b[0]", text: drafted("uno", "one") }]);
  });
});

describe("docs/TRANSLATIONS.md", () => {
  const doc = translationsDoc(content, translationNotes);

  it("is up to date with content/ (run npm run translations)", () => {
    expect(readFileSync(new URL("../docs/TRANSLATIONS.md", import.meta.url), "utf8")).toBe(doc);
  });

  it("lists drafted and live-site strings but not names or placeholders", () => {
    const rows = doc.split("\n").filter((line) => line.startsWith("| `"));
    expect(rows.some((row) => row.includes("Techos bien hechos, siempre."))).toBe(true);
    expect(rows.some((row) => row.includes("¿Qué áreas cubren?"))).toBe(true);
    expect(rows.filter((row) => row.includes(`| ${name("Facebook").es} |`))).toEqual([]);
    expect(rows.filter((row) => row.includes("[PLACEHOLDER"))).toEqual([]);
  });
});
