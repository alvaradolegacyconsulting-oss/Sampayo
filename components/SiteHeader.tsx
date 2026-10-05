import { buttonClasses } from "@/components/ButtonLink";
import { LangSwitch } from "@/components/LangSwitch";
import { Logo } from "@/components/Logo";
import { MobileMenu } from "@/components/MobileMenu";
import type { Locale } from "@/content/types";
import { ui } from "@/content/ui";
import { t } from "@/lib/i18n";
import { ctaLink, navLinks } from "@/lib/nav";
import { href, type RouteKey } from "@/lib/routes";

/** `route` is the current page, so the ES | EN switch lands on its translation. */
export function SiteHeader({ route, locale }: { route: RouteKey; locale: Locale }) {
  const links = navLinks(locale);
  const cta = ctaLink(locale);

  return (
    <header className="sticky top-0 z-30 border-b border-line bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/90">
      <div className="relative mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
        <a href={href(route, locale)} aria-label={t(ui.common.homeLink, locale)} className="rounded-md">
          <Logo />
        </a>

        <div className="flex items-center gap-2 lg:gap-6">
          <nav aria-label={t(ui.nav.label, locale)} className="hidden lg:block">
            <ul className="flex items-center gap-6">
              {links.map((link) => (
                <li key={link.href}>
                  <a href={link.href} className="py-2 text-sm font-semibold text-ink hover:text-copper">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <LangSwitch route={route} locale={locale} />
          {/* Wrapped so "hidden" isn't overridden by the button's own display class; phones get it in the menu. */}
          <div className="hidden lg:block">
            <a href={cta.href} className={`${buttonClasses("primary")} min-h-11 px-5 text-sm`}>
              {cta.label}
            </a>
          </div>
          <MobileMenu links={links} cta={cta} label={t(ui.nav.menu, locale)} navLabel={t(ui.nav.label, locale)} />
        </div>
      </div>
    </header>
  );
}
