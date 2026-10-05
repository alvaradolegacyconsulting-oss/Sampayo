import type { Locale } from "@/content/types";
import { ui } from "@/content/ui";
import { t } from "@/lib/i18n";
import { href } from "@/lib/routes";

export type NavLink = { label: string; href: string };

/** Header links, in the concept's order. All are sections of the home page. */
export function navLinks(locale: Locale): NavLink[] {
  return [
    { label: t(ui.nav.services, locale), href: href("home", locale, "services") },
    { label: t(ui.nav.whyUs, locale), href: href("home", locale, "whyUs") },
    { label: t(ui.nav.work, locale), href: href("home", locale, "work") },
    { label: t(ui.nav.faq, locale), href: href("home", locale, "faq") },
  ];
}

/** The header button: jumps to the project request form. */
export function ctaLink(locale: Locale): NavLink {
  return { label: t(ui.nav.cta, locale), href: href("home", locale, "contact") };
}
