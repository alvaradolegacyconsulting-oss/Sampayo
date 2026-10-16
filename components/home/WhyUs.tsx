import { CheckIcon } from "@/components/CheckIcon";
import { Container, Eyebrow, headingClasses } from "@/components/Section";
import Image from "next/image";
import { SitePhoto } from "@/components/SitePhoto";
import { home } from "@/content/home";
import { site } from "@/content/site";
import { hasPhoto, type Locale } from "@/content/types";
import { t } from "@/lib/i18n";
import { sectionId } from "@/lib/routes";

/**
 * Heading, intro and job-site photo (when set) on the left; the full logo, with its verse, above the
 * five points on the right (stacked on phones).
 */
export function WhyUs({ locale }: { locale: Locale }) {
  const { whyUs } = home;
  const id = sectionId("whyUs", locale);
  const logo = site.logo.full.image[locale];

  return (
    <section id={id} aria-labelledby={`${id}-heading`} className="bg-white py-14 text-ink sm:py-20">
      <Container className="grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
        <div>
          <Eyebrow>{t(whyUs.eyebrow, locale)}</Eyebrow>
          <h2 id={`${id}-heading`} className={`mt-2 ${headingClasses(false)}`}>
            {t(whyUs.heading, locale)}
          </h2>
          <p className="mt-4 max-w-xl leading-relaxed text-muted">{t(whyUs.intro, locale)}</p>
          {hasPhoto(whyUs.photo) && (
            <SitePhoto photo={whyUs.photo} locale={locale} sizes="(min-width: 1024px) 34rem, 100vw" className="mt-8" />
          )}
        </div>
        <div>
          <Image
            src={logo.src}
            alt={t(site.logo.full.alt, locale)}
            width={logo.width}
            height={logo.height}
            sizes="(min-width: 640px) 20rem, 80vw"
            className="mx-auto mb-8 h-auto w-4/5 max-w-xs"
          />
          <ul className="divide-y divide-line border-y border-line">
            {whyUs.points.map((point) => (
              <li key={point.title.en} className="flex gap-3 py-4">
                <CheckIcon className="mt-0.5 size-5 shrink-0 text-copper" />
                <div>
                  <p className="font-bold text-navy">{t(point.title, locale)}</p>
                  <p className="mt-1 text-sm leading-relaxed text-muted">{t(point.body, locale)}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  );
}
