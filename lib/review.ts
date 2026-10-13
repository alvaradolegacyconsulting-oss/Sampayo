// Relative imports only: scripts/review.ts runs this under tsx without the "@/" alias.
import { findTexts } from "./texts";

/** Headings in page order. A text goes under the first prefix its path starts with; the rest go last. */
const sections: [prefix: string, heading: string][] = [
  ["ui.common", "Menus and labels"],
  ["ui.nav", "Menus and labels"],
  ["ui.languageSwitch", "Menus and labels"],
  ["home.hero", "Hero (top of the page)"],
  ["home.trust", "At a glance"],
  ["home.services", "What we offer"],
  ["home.whyUs", "Why contractors work with us (and About)"],
  ["home.gallery", "Recent work"],
  ["gallery", "Recent work"],
  ["home.process", "How we work"],
  ["home.faq", "Questions"],
  ["home.contact", "Contact"],
  ["ui.footer", "Footer"],
  ["site", "Search results and sharing"],
  ["ui.homePage", "Search results and sharing"],
  ["ui.notFound", "Page not found (404)"],
];

const OTHER = "Other";
const headings = [...new Set(sections.map(([, heading]) => heading)), OTHER];

const headingFor = (path: string) =>
  sections.find(([prefix]) => path === prefix || path.startsWith(`${prefix}.`) || path.startsWith(`${prefix}[`))?.[1] ?? OTHER;

const cell = (value: string) => value.replace(/\|/g, "\\|").replace(/\n/g, " ");

type Row = { paths: string[]; en: string; es: string };

/**
 * docs/REVIEW.md, generated from content/ by `npm run review`: every piece of text as
 * Where | English | Español, in page order, for Omar to mark up. Proper names (the same in both
 * languages) and [PLACEHOLDER] items are left out; the same text used in several places is listed once.
 */
export function reviewDoc(content: Record<string, unknown>, notes: string[] = []): string {
  const rows = new Map<string, Row[]>(headings.map((heading) => [heading, []]));
  const seen = new Map<string, Row>();

  for (const [name, value] of Object.entries(content)) {
    for (const { path, text } of findTexts(value, name)) {
      if (text.source === "name" || text.source === "placeholder") continue;
      const key = `${text.en}|${text.es}`;
      const existing = seen.get(key);
      if (existing) {
        existing.paths.push(path);
        continue;
      }
      const row = { paths: [path], en: text.en, es: text.es };
      seen.set(key, row);
      rows.get(headingFor(path))!.push(row);
    }
  }

  const lines = [
    "# Website text for review (English and Spanish)",
    "",
    "Generated from `content/` by `npm run review`; don't edit this file by hand (a test fails if it's out of date).",
    "",
    "**How to review:** read each row. Mark any change in the Español (or English) column, or write it beside",
    "the row, and send it back. Your edits come back as small content changes, then this page is regenerated.",
    "",
    ...notes,
    "- Text used in more than one place is listed once; the \"Where\" column names the other places.",
    "",
    `${seen.size} pieces of text; every one has both languages.`,
  ];

  for (const heading of headings) {
    const section = rows.get(heading)!;
    if (section.length === 0) continue;
    lines.push("", `## ${heading}`, "", "| Where | English | Español |", "|---|---|---|");
    for (const { paths, en, es } of section) {
      const [first, ...others] = paths;
      const where = `\`${first}\`${others.length > 0 ? ` (also ${others.map((path) => `\`${path}\``).join(", ")})` : ""}`;
      lines.push(`| ${where} | ${cell(en)} | ${cell(es)} |`);
    }
  }

  return `${lines.join("\n")}\n`;
}
