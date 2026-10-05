import { buttonClasses } from "@/components/ButtonLink";
import { CopyButton } from "@/components/CopyButton";
import { Container, headingClasses } from "@/components/Section";
import { home } from "@/content/home";
import { site, type SiteContent } from "@/content/site";
import type { Locale } from "@/content/types";
import { t } from "@/lib/i18n";
import { sectionId } from "@/lib/routes";

/**
 * How contractors reach Omar: call, text and (once content/site.ts has it) email with a Copy button.
 * No form on this site. `content` is only overridden by tests.
 */
export function Contact({ locale, content = site }: { locale: Locale; content?: SiteContent }) {
  const { contact } = home;
  const id = sectionId("contact", locale);
  const { phone, email } = content;
  const mailto = email ? `mailto:${email}?subject=${encodeURIComponent(t(contact.mailSubject, locale))}` : null;

  return (
    <section id={id} aria-labelledby={`${id}-heading`} className="bg-white py-14 text-ink sm:py-20">
      <Container className="grid gap-10 lg:grid-cols-[1fr_1.25fr] lg:gap-16">
        <div>
          <h2 id={`${id}-heading`} className={headingClasses(false)}>
            {t(contact.heading, locale)}
          </h2>
          <p className="mt-4 max-w-md leading-relaxed text-muted">{t(contact.intro, locale)}</p>
        </div>

        <div className="rounded-lg border border-line bg-paper p-5 sm:p-7">
          <p className="font-bold text-navy">{content.contactName}</p>
          <p className="mt-1 text-2xl font-extrabold text-navy sm:text-3xl">{phone.display}</p>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <a
              href={`tel:${phone.tel}`}
              aria-label={`${t(contact.call, locale)} ${phone.display}`}
              className={`${buttonClasses("primary")} whitespace-nowrap`}
            >
              {t(contact.call, locale)}
            </a>
            <a
              href={`sms:${phone.tel}`}
              aria-label={`${t(contact.text, locale)} ${phone.display}`}
              className={`${buttonClasses("outline")} whitespace-nowrap`}
            >
              {t(contact.text, locale)}
            </a>
          </div>

          {email && mailto && (
            <div className="mt-6 border-t border-line pt-5">
              <p className="text-sm font-semibold text-muted">{t(contact.email, locale)}</p>
              <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-2">
                <a href={mailto} className="min-h-11 break-all py-2 text-lg font-bold text-navy underline underline-offset-4 hover:text-copper">
                  {email}
                </a>
                <CopyButton
                  value={email}
                  label={t(contact.copy, locale)}
                  copiedLabel={t(contact.copied, locale)}
                  failedLabel={t(contact.copyFailed, locale)}
                  className={`${buttonClasses("outline")} min-h-11 px-4 text-sm`}
                />
              </div>
            </div>
          )}
        </div>
      </Container>
    </section>
  );
}
