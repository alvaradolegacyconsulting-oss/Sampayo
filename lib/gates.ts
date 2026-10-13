// Relative imports only: scripts/check-production-gates.ts runs this under tsx without the "@/" alias.
import { PLACEHOLDER, TRANSLATE, isPlaceholder, locales, type Photo } from "../content/types";
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

/** Every Photo (an object with src, alt and a real/stock kind) under `value`, with its path. */
export function collectPhotos(value: unknown, path = "content"): { path: string; photo: Photo }[] {
  if (Array.isArray(value)) return value.flatMap((item, index) => collectPhotos(item, `${path}[${index}]`));
  if (!value || typeof value !== "object") return [];

  const record = value as Record<string, unknown>;
  if ("src" in record && "alt" in record && (record.kind === "real" || record.kind === "stock")) {
    return [{ path, photo: record as Photo }];
  }
  return Object.entries(record).flatMap(([key, item]) => collectPhotos(item, `${path}.${key}`));
}

/**
 * STOCK_IN_USE (never fails): every stock photo that is on the page, as "path: src (source)", so the
 * stand-ins stay visible until real photos replace them. A stock slot still waiting on its file is a placeholder.
 */
export function findStockPhotos(content: Record<string, unknown>): string[] {
  return Object.entries(content)
    .flatMap(([name, value]) => collectPhotos(value, name))
    .filter(({ photo }) => photo.kind === "stock" && !isPlaceholder(photo.src))
    .map(({ path, photo }) => `${path}: ${photo.src} (source: ${photo.sourceUrl ?? "not recorded"})`);
}

export type Gate = { name: string; problems: string[] };

export function runGates(content: Record<string, unknown>): Gate[] {
  return [
    { name: "PLACEHOLDERS_RESOLVED", problems: Object.entries(content).flatMap(([name, value]) => findPlaceholders(value, name)) },
    { name: "TRANSLATIONS_COMPLETE", problems: findUntranslated(content) },
  ];
}
