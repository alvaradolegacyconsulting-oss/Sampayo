// Relative imports only: the gate and docs scripts run this under tsx without the "@/" alias.
import type { Text } from "../content/types";

export type FoundText = { path: string; text: Text };

const isText = (value: object): value is Text =>
  "es" in value && "en" in value && "source" in value && typeof (value as Text).source === "string";

/** Every Text under `value`, depth first, with its path (e.g. "beliefs.summary[0].title"). */
export function findTexts(value: unknown, path: string): FoundText[] {
  if (Array.isArray(value)) return value.flatMap((item, index) => findTexts(item, `${path}[${index}]`));
  if (!value || typeof value !== "object") return [];
  if (isText(value)) return [{ path, text: value }];
  return Object.entries(value).flatMap(([key, item]) => findTexts(item, `${path}.${key}`));
}

/** Same text appearing at several paths is listed once, at its first path. */
function dedupe(found: FoundText[]): FoundText[] {
  const seen = new Set<string>();
  return found.filter(({ text }) => {
    const key = `${text.source}|${text.es}|${text.en}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

const escapeCell = (value: string) => value.replace(/\|/g, "\\|").replace(/\n/g, " ");

const sections: { source: Text["source"]; heading: string; intro: string }[] = [
  {
    source: "live-site",
    heading: "From the live site (both languages)",
    intro: "Both languages come from sampayoconstruction.com (pages in the last column), lightly edited as noted above. Please confirm they still read right.",
  },
  {
    source: "drafted",
    heading: "Drafted for this site (both languages)",
    intro: "Written for the new site from the approved concept. Please check both languages; notes say what needs sign-off.",
  },
  {
    source: "bible",
    heading: "Bible verse",
    intro: "Please confirm the Spanish version you want quoted (the site uses Reina-Valera 1960).",
  },
  {
    source: "given",
    heading: "Supplied by the preflight or greenlight",
    intro: "Both languages were given to us; listed so nothing is missed.",
  },
];

/** docs/TRANSLATIONS.md, generated from content/ by `npm run translations`. */
export function translationsDoc(content: Record<string, unknown>, notes: string[] = []): string {
  const all = dedupe(Object.entries(content).flatMap(([key, value]) => findTexts(value, key)));
  const lines = [
    "# Translations for review (Omar)",
    "",
    "Generated from `content/` by `npm run translations`; don't edit by hand (a test fails if it's out of date).",
    "To change a string, edit the file named in the first column, then run `npm run translations`.",
    "",
    ...notes,
    "Proper names and addresses (the same in both languages) and `[PLACEHOLDER]` items are not listed.",
  ];

  for (const { source, heading, intro } of sections) {
    const rows = all.filter(({ text }) => text.source === source);
    lines.push("", `## ${heading} (${rows.length})`, "", intro, "", "| Where | Español | English | Note |", "|---|---|---|---|");
    for (const { path, text } of rows) {
      lines.push(`| \`${path}\` | ${escapeCell(text.es)} | ${escapeCell(text.en)} | ${escapeCell(text.note ?? "")} |`);
    }
  }

  return `${lines.join("\n")}\n`;
}
