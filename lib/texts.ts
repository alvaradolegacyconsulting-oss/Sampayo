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
