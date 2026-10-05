import { ContactForm } from "@/components/ContactForm";
import { Container, headingClasses } from "@/components/Section";
import { home } from "@/content/home";
import { site } from "@/content/site";
import type { Locale } from "@/content/types";
import { t } from "@/lib/i18n";
import { sectionId } from "@/lib/routes";

export function Contact({ locale }: { locale: Locale }) {
  const { contact } = home;
  const id = sectionId("contact", locale);

  return (
    <section id={id} aria-labelledby={`${id}-heading`} className="bg-white py-14 text-ink sm:py-20">
      <Container className="grid gap-10 lg:grid-cols-[1fr_1.25fr] lg:gap-16">
        <div>
          <h2 id={`${id}-heading`} className={headingClasses(false)}>
            {t(contact.heading, locale)}
          </h2>
          <p className="mt-4 max-w-md leading-relaxed text-muted">{t(contact.intro, locale)}</p>
          <p className="mt-8 font-bold text-navy">{site.contactName}</p>
          <p className="mt-1">
            <span className="sr-only">{t(contact.phoneLabel, locale)}: </span>
            <a href={`tel:${site.phone.tel}`} className="inline-flex min-h-11 items-center text-2xl font-extrabold text-navy hover:text-copper sm:text-3xl">
              {site.phone.display}
            </a>
          </p>
        </div>
        <ContactForm locale={locale} />
      </Container>
    </section>
  );
}
