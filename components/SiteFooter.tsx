import { Container } from "@/components/Section";
import { site } from "@/content/site";
import type { Locale } from "@/content/types";
import { ui } from "@/content/ui";
import { t } from "@/lib/i18n";

const networks = ["facebook", "instagram", "youtube", "tiktok"] as const;

export function SiteFooter({ locale }: { locale: Locale }) {
  const { footer } = ui;
  // Each network shows up only once content/site.ts has its link.
  const socialLinks = networks
    .filter((network) => site.social[network])
    .map((network) => ({ label: t(footer[network], locale), href: site.social[network] as string }));

  return (
    <footer className="on-dark bg-navy-deep text-white">
      <Container className="grid gap-8 py-12 sm:grid-cols-[1fr_auto] sm:py-14">
        <div>
          <p className="text-lg font-extrabold uppercase tracking-[0.06em]">{site.legalName}</p>
          <figure className="mt-3 max-w-md text-sm text-white/80">
            <blockquote>
              <p className="italic">&ldquo;{t(footer.verse.text, locale)}&rdquo;</p>
            </blockquote>
            <figcaption className="mt-1">{t(footer.verse.reference, locale)}</figcaption>
          </figure>
        </div>

        <div className="flex flex-col gap-3 sm:items-end">
          <a href={`tel:${site.phone.tel}`} className="inline-flex min-h-11 items-center text-base font-bold hover:text-copper-light">
            <span className="sr-only">{t(footer.call, locale)} </span>
            {site.phone.display}
          </a>
          {socialLinks.length > 0 && (
            <nav aria-label={t(footer.social, locale)}>
              <ul className="flex flex-wrap gap-x-5 text-sm font-bold sm:justify-end">
                {socialLinks.map((link) => (
                  <li key={link.href}>
                    <a href={link.href} className="inline-flex min-h-11 items-center underline underline-offset-4 hover:text-copper-light" target="_blank" rel="noreferrer">
                      {link.label}
                      <span className="sr-only"> {t(ui.common.opensInNewTab, locale)}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          )}
        </div>
      </Container>

      <div className="border-t border-white/15">
        <Container className="py-5 text-xs text-white/80">
          <p>
            {t(footer.developedBy, locale)}{" "}
            <a href={footer.developerUrl} className="font-bold text-white underline underline-offset-4 hover:text-copper-light">
              {t(footer.developer, locale)}
            </a>
          </p>
        </Container>
      </div>
    </footer>
  );
}
