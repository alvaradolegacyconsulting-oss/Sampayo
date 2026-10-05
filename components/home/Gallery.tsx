import { Section } from "@/components/Section";
import { SitePhoto } from "@/components/SitePhoto";
import { gallery } from "@/content/gallery";
import { home } from "@/content/home";
import { site } from "@/content/site";
import type { Locale } from "@/content/types";
import { ui } from "@/content/ui";
import { t } from "@/lib/i18n";
import { sectionId } from "@/lib/routes";

/** Real job photos. The videos link appears only once content/site.ts has videosUrl. */
export function Gallery({ locale }: { locale: Locale }) {
  const text = home.gallery;

  return (
    <Section
      id={sectionId("work", locale)}
      tone="paper"
      heading={t(text.heading, locale)}
      intro={<p>{t(text.intro, locale)}</p>}
      aside={
        site.videosUrl && (
          <a
            href={site.videosUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex min-h-11 items-center gap-1 text-navy underline underline-offset-4 hover:text-copper"
          >
            {t(text.videos, locale)}
            <span aria-hidden="true">→</span>
            <span className="sr-only"> {t(ui.common.opensInNewTab, locale)}</span>
          </a>
        )
      }
    >
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {gallery.map((photo) => (
          <li key={photo.src}>
            <SitePhoto photo={photo} locale={locale} sizes="(min-width: 1024px) 23rem, (min-width: 640px) 50vw, 100vw" />
          </li>
        ))}
      </ul>
    </Section>
  );
}
