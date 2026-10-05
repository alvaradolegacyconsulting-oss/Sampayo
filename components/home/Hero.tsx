import { buttonClasses } from "@/components/ButtonLink";
import { Container } from "@/components/Section";
import { SitePhoto } from "@/components/SitePhoto";
import { home } from "@/content/home";
import { site } from "@/content/site";
import type { Locale } from "@/content/types";
import { fill, t } from "@/lib/i18n";
import { href } from "@/lib/routes";

export function Hero({ locale }: { locale: Locale }) {
  const { hero } = home;

  return (
    <section aria-labelledby="hero-heading" className="on-dark bg-navy text-white">
      <Container className="grid items-center gap-10 py-12 sm:py-16 lg:grid-cols-[1.1fr_1fr] lg:gap-14 lg:py-24">
        <div>
          <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-copper-light">{t(hero.eyebrow, locale)}</p>
          <h1 id="hero-heading" className="mt-4 text-[2.5rem] font-extrabold leading-[1.02] tracking-tight sm:text-6xl">
            {t(hero.heading, locale)}
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-white/80">{t(hero.intro, locale)}</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a href={`tel:${site.phone.tel}`} className={`${buttonClasses("light")} whitespace-nowrap`}>
              {fill(t(hero.call, locale), { phone: site.phone.display })}
            </a>
            <a href={href("home", locale, "contact")} className={buttonClasses("outlineLight")}>
              {t(hero.details, locale)}
            </a>
          </div>
        </div>
        <SitePhoto photo={hero.photo} locale={locale} sizes="(min-width: 1024px) 34rem, 100vw" priority />
      </Container>
    </section>
  );
}
