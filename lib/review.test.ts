import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { content } from "@/content";
import { reviewNotes } from "@/content/review-notes";
import { drafted, name, placeholder } from "@/content/types";
import { reviewDoc } from "@/lib/review";

describe("docs/REVIEW.md", () => {
  const doc = reviewDoc(content, reviewNotes);
  const rows = doc.split("\n").filter((line) => line.startsWith("| `"));

  it("is up to date with content/ (run npm run review)", () => {
    expect(readFileSync(new URL("../docs/REVIEW.md", import.meta.url), "utf8")).toBe(doc);
  });

  it("is Where | English | Español, English first", () => {
    expect(doc).toContain("| Where | English | Español |");
    expect(rows.some((row) => row.includes("| Roofing crews Minnesota contractors can count on. | Cuadrillas de techado"))).toBe(true);
  });

  it("follows the page: hero before services before FAQ before footer", () => {
    const at = (heading: string) => doc.indexOf(`## ${heading}`);
    expect(at("Hero (top of the page)")).toBeGreaterThan(-1);
    expect(at("Hero (top of the page)")).toBeLessThan(at("What we offer"));
    expect(at("What we offer")).toBeLessThan(at("Questions"));
    expect(at("Questions")).toBeLessThan(at("Footer"));
    expect(doc).not.toContain("## Other");
  });

  it("leaves out proper names and placeholders, and lists repeated text once", () => {
    expect(rows.filter((row) => row.includes(`| ${name("Facebook").en} |`))).toEqual([]);
    expect(rows.filter((row) => row.includes("[PLACEHOLDER"))).toEqual([]);
    const sample = reviewDoc({ home: { hero: { a: drafted("Hola", "Hi"), b: drafted("Hola", "Hi"), c: placeholder("x") } } });
    expect(sample).toContain("| `home.hero.a` (also `home.hero.b`) | Hi | Hola |");
    expect(sample).not.toContain("home.hero.c");
  });
});
