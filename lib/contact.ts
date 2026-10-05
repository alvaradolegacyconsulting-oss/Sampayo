import type { ContactFieldName } from "@/content/contact";

/** What the project request form POSTs to /api/contact as JSON: every field, trimmed, plus the honeypot. */
export type ContactPayload = Record<ContactFieldName, string> & {
  /** Which page language the request came from, so the reply can match it. */
  locale: string;
  /** Honeypot: hidden from people, so anything here means a bot. */
  website: string;
};

/** /api/contact's reply. `ok: true` is sent only after the email API reports success. */
export type ContactResponse = { ok: true } | { ok: false; error: string };

export const HONEYPOT_FIELD = "website";

export function payloadFromForm(form: HTMLFormElement, fields: readonly ContactFieldName[], locale: string): ContactPayload {
  const data = new FormData(form);
  const text = (name: string) => String(data.get(name) ?? "").trim();

  return {
    ...(Object.fromEntries(fields.map((name) => [name, text(name)])) as Record<ContactFieldName, string>),
    locale,
    website: text(HONEYPOT_FIELD),
  };
}

/** True only for a 2xx reply whose body is exactly { ok: true }. Anything else is a failure. */
export async function isConfirmedSent(response: Response): Promise<boolean> {
  if (!response.ok) return false;
  try {
    const body: unknown = await response.json();
    return typeof body === "object" && body !== null && (body as { ok?: unknown }).ok === true;
  } catch {
    return false;
  }
}
