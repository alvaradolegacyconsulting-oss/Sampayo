import type { Metadata } from "next";
import type { CSSProperties } from "react";
import { buttonClasses } from "@/components/ButtonLink";
import { Logo } from "@/components/Logo";
import { site } from "@/content/site";
import { defaultLocale } from "@/content/types";
import { ui } from "@/content/ui";
import { t } from "@/lib/i18n";
import { alternateLocale, href } from "@/lib/routes";
import { bodyFont } from "@/theme/fonts";
import { themeCssVariables } from "@/theme/tokens";
import "./globals.css";

// With two root layouts there's no single layout to build a 404 from, so this page stands alone
// (next.config.ts: experimental.globalNotFound). It can't know the visitor's language: default language first.
export const metadata: Metadata = {
  title: `${t(ui.notFound.title, defaultLocale)} · ${t(ui.notFound.title, alternateLocale)} | ${site.name}`,
  robots: { index: false },
};

export default function GlobalNotFound() {
  return (
    <html lang={defaultLocale} className={bodyFont.variable} style={themeCssVariables as CSSProperties}>
      <body>
        <main id="main" className="mx-auto flex min-h-screen max-w-2xl flex-col justify-center gap-10 px-4 py-16">
          <Logo />
          {[defaultLocale, alternateLocale].map((locale) => (
            <section key={locale} lang={locale}>
              <h1 className="text-3xl font-extrabold tracking-tight text-navy">{t(ui.notFound.title, locale)}</h1>
              <p className="mt-3 text-muted">{t(ui.notFound.body, locale)}</p>
              <a href={href("home", locale)} className={`${buttonClasses("primary")} mt-5`}>
                {t(ui.notFound.home, locale)}
              </a>
            </section>
          ))}
        </main>
      </body>
    </html>
  );
}
