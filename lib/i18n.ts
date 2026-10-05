import type { Locale, Text } from "@/content/types";

/** The text in `locale`. Both languages are required by the type, so there is no fallback. */
export function t(text: Text, locale: Locale): string {
  return text[locale];
}

/** Fills "{name}" slots in a template string; an unknown slot is left as is so it shows up in review. */
export function fill(template: string, values: Record<string, string>): string {
  return template.replace(/\{(\w+)\}/g, (slot, key: string) => values[key] ?? slot);
}

/** BCP 47 tag for Intl formatting and og:locale. */
export const localeTag: Record<Locale, string> = { es: "es-US", en: "en-US" };
