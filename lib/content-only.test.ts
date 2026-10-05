import { readdirSync, readFileSync } from "node:fs";
import { join, relative } from "node:path";
import { describe, expect, it } from "vitest";
import { site } from "@/content/site";

// CONTENT_ONLY: components/, app/ and lib/ hold no client facts or hex values; those live in content/ and theme/.
const root = new URL("../", import.meta.url).pathname;

function sourceFiles(dir: string): string[] {
  return readdirSync(join(root, dir), { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) return sourceFiles(path);
    return /\.(ts|tsx|css)$/.test(entry.name) && !/\.test\.tsx?$/.test(entry.name) ? [path] : [];
  });
}

const files = ["components", "app", "lib"].flatMap(sourceFiles);

// Facts taken from content itself, so this keeps working for the next client.
const facts = [site.name, site.legalName, site.wordmark.main, site.contactName, site.phone.display, site.phone.tel, "Minnesota", "Minneapolis"];

describe("CONTENT_ONLY", () => {
  it("scans a real set of files", () => {
    expect(files.length).toBeGreaterThan(30);
  });

  it.each(files)("%s has no client facts, phone numbers, emails or hex colors", (file) => {
    const source = readFileSync(join(root, file), "utf8");
    const found = [
      ...facts.filter((fact) => source.includes(fact)),
      ...(source.match(/#[0-9a-f]{6}\b|#[0-9a-f]{3}\b(?![-\w])/gi) ?? []).filter((hex) => !/^#(main|business)/.test(hex)),
      ...(source.match(/\b\d{3}[-.\s]\d{3}[-.\s]\d{4}\b/g) ?? []),
      ...(source.match(/[\w.+-]+@[\w-]+\.[\w.]+/g) ?? []),
    ];
    expect(found, relative(root, join(root, file))).toEqual([]);
  });
});
