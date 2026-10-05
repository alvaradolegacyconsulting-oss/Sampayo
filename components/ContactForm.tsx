"use client";

import { useState, type FormEvent, type ReactNode } from "react";
import { buttonClasses } from "@/components/ButtonLink";
import { contact, type ContactField } from "@/content/contact";
import { site } from "@/content/site";
import type { Locale } from "@/content/types";
import { HONEYPOT_FIELD, isConfirmedSent, payloadFromForm } from "@/lib/contact";
import { t } from "@/lib/i18n";

type FormStatus = "idle" | "pending" | "sent" | "failed";

const inputClasses =
  "w-full rounded-sm border border-muted/70 bg-white px-3 text-ink focus:border-navy focus:outline-none focus-visible:outline-3 focus-visible:outline-offset-1 focus-visible:outline-copper";

const fieldNames = contact.fields.map((field) => field.name);

/**
 * Project request form. Ported from alc-site's status logic: "sent" only after /api/contact confirms
 * the email went out; any other outcome (including the route not existing yet) shows the error with
 * a tap-to-call link, and the fields stay filled.
 */
export function ContactForm({ locale }: { locale: Locale }) {
  const [status, setStatus] = useState<FormStatus>("idle");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.reportValidity()) return;

    setStatus("pending");
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payloadFromForm(form, fieldNames, locale)),
      });
      const sent = await isConfirmedSent(response);
      setStatus(sent ? "sent" : "failed");
      if (sent) form.reset();
    } catch {
      setStatus("failed");
    }
  }

  return (
    <form
      aria-label={t(contact.label, locale)}
      className="relative space-y-5 rounded-lg border border-line bg-paper p-5 text-ink sm:p-7"
      onSubmit={handleSubmit}
    >
      <div className="grid gap-4 sm:grid-cols-2">
        {contact.fields.map((field) => (
          <Field key={field.name} field={field} locale={locale} />
        ))}
      </div>

      <div className="absolute -left-[10000px] top-auto size-px overflow-hidden" aria-hidden="true">
        <label htmlFor={`contact-${HONEYPOT_FIELD}`}>{t(contact.honeypot, locale)}</label>
        <input id={`contact-${HONEYPOT_FIELD}`} name={HONEYPOT_FIELD} tabIndex={-1} autoComplete="off" />
      </div>

      <button
        className={`${buttonClasses("primary")} w-full disabled:cursor-wait disabled:opacity-80`}
        type="submit"
        disabled={status === "pending"}
      >
        {t(status === "pending" ? contact.pending : contact.submit, locale)}
      </button>

      <div aria-live="polite">
        {status === "sent" && <StatusMessage tone="success">{t(contact.success, locale)}</StatusMessage>}
        {status === "failed" && (
          <StatusMessage tone="failure">
            {t(contact.failure, locale)}{" "}
            <a className="font-bold whitespace-nowrap underline underline-offset-4" href={`tel:${site.phone.tel}`}>
              {site.phone.display}
            </a>
            .
          </StatusMessage>
        )}
      </div>
    </form>
  );
}

function StatusMessage({ tone, children }: { tone: "success" | "failure"; children: ReactNode }) {
  const success = tone === "success";
  return (
    <p
      role={success ? "status" : "alert"}
      className={`flex gap-2.5 rounded-sm border-l-4 bg-white px-4 py-3 text-sm leading-relaxed ${
        success ? "border-navy text-navy" : "border-alert text-alert"
      }`}
    >
      <span aria-hidden="true" className="font-bold">
        {success ? "✓" : "!"}
      </span>
      <span>{children}</span>
    </p>
  );
}

function Field({ field, locale }: { field: ContactField; locale: Locale }) {
  const id = `contact-${field.name}`;
  const wide = field.type === "textarea";

  return (
    <div className={wide ? "sm:col-span-2" : ""}>
      <label className="mb-1.5 block text-sm font-semibold text-navy" htmlFor={id}>
        {t(field.label, locale)}
        {!field.required && <span className="font-normal text-muted"> ({t(contact.optional, locale)})</span>}
      </label>
      {wide ? (
        <textarea className={`${inputClasses} min-h-32 resize-y py-2`} id={id} name={field.name} rows={5} required={field.required} />
      ) : (
        <input
          className={`${inputClasses} min-h-12`}
          id={id}
          name={field.name}
          type={field.type}
          autoComplete={field.autoComplete}
          required={field.required}
        />
      )}
    </div>
  );
}
