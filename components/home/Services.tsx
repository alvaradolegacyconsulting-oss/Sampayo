import { Section } from "@/components/Section";
import { SitePhoto } from "@/components/SitePhoto";
import { home } from "@/content/home";
import type { Locale } from "@/content/types";
import { t } from "@/lib/i18n";
import { sectionId } from "@/lib/routes";

export function Services({ locale }: { locale: Locale }) {
  const { services } = home;

  return (
    <Section
      id={sectionId("services", locale)}
      tone="paper"
      eyebrow={t(services.eyebrow, locale)}
      heading={t(services.heading, locale)}
      intro={
        <>
          <p>{t(services.intro, locale)}</p>
          <p className="mt-3 font-semibold text-navy">{t(services.customScopes, locale)}</p>
        </>
      }
    >
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {services.items.map((service) => (
          <li key={service.id} className="flex flex-col overflow-hidden rounded-lg border border-line bg-white">
            <SitePhoto
              photo={service.photo}
              locale={locale}
              sizes="(min-width: 1024px) 17rem, (min-width: 640px) 50vw, 100vw"
              rounded={false}
            />
            <div className="p-5">
              <h3 className="text-lg font-bold text-navy">{t(service.title, locale)}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted">{t(service.body, locale)}</p>
            </div>
          </li>
        ))}
      </ul>
    </Section>
  );
}
