import { Container, headingClasses } from "@/components/Section";
import { home } from "@/content/home";
import type { Locale } from "@/content/types";
import { t } from "@/lib/i18n";
import { sectionId } from "@/lib/routes";

/** Every answer stays visible (no accordion): five short answers read faster than five clicks. */
export function Faq({ locale }: { locale: Locale }) {
  const { faq } = home;
  const id = sectionId("faq", locale);

  return (
    <section id={id} aria-labelledby={`${id}-heading`} className="bg-paper py-14 text-ink sm:py-20">
      <Container className="grid gap-8 lg:grid-cols-[1fr_2fr] lg:gap-16">
        <h2 id={`${id}-heading`} className={headingClasses(false)}>
          {t(faq.heading, locale)}
        </h2>
        <dl className="divide-y divide-line border-y border-line">
          {faq.items.map((item) => (
            <div key={item.question.en} className="py-5">
              <dt className="font-bold text-navy">{t(item.question, locale)}</dt>
              <dd className="mt-1.5 text-sm leading-relaxed text-muted sm:text-base">{t(item.answer, locale)}</dd>
            </div>
          ))}
        </dl>
      </Container>
    </section>
  );
}
