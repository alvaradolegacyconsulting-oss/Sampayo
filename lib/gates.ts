// Relative imports only: scripts/check-production-gates.ts runs this under tsx without the "@/" alias.
import { PLACEHOLDER, TRANSLATE, locales } from "../content/types";
import { findTexts } from "./texts";

/** PLACEHOLDERS_RESOLVED: every string anywhere in content that still contains "[PLACEHOLDER", as "path: text". */
export function findPlaceholders(value: unknown, path = "content"): string[] {
  if (typeof value === "string") return value.includes(PLACEHOLDER) ? [`${path}: ${value}`] : [];
  if (Array.isArray(value)) return value.flatMap((item, index) => findPlaceholders(item, `${path}[${index}]`));
  if (value && typeof value === "object") {
    return Object.entries(value).flatMap(([key, item]) => findPlaceholders(item, `${path}.${key}`));
  }
  return [];
}

/**
 * TRANSLATIONS_COMPLETE: every Text has real words in both languages. The type already requires both
 * keys; this catches an empty string or a "[TRANSLATE" marker. There is no fallback to the other language.
 */
export function findUntranslated(content: Record<string, unknown>): string[] {
  return Object.entries(content).flatMap(([name, value]) =>
    findTexts(value, name).flatMap(({ path, text }) =>
      locales.flatMap((locale) => {
        const value = text[locale];
        if (typeof value !== "string" || value.trim() === "") return [`${path}.${locale} is empty`];
        if (value.includes(TRANSLATE)) return [`${path}.${locale}: ${value}`];
        return [];
      }),
    ),
  );
}

export type Gate = { name: string; problems: string[] };

export function runGates(content: Record<string, unknown>): Gate[] {
  return [
    { name: "PLACEHOLDERS_RESOLVED", problems: Object.entries(content).flatMap(([name, value]) => findPlaceholders(value, name)) },
    { name: "TRANSLATIONS_COMPLETE", problems: findUntranslated(content) },
  ];
}
