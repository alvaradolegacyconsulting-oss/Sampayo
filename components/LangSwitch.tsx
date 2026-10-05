import { locales, type Locale } from "@/content/types";
import { ui } from "@/content/ui";
import { t } from "@/lib/i18n";
import { otherLocale, routes, type RouteKey } from "@/lib/routes";

/** ES | EN: the current language in bold, the other as a link to this same page in it. */
export function LangSwitch({ route, locale }: { route: RouteKey; locale: Locale }) {
  const other = otherLocale(locale);

  return (
    <nav aria-label={t(ui.languageSwitch.label, locale)}>
      <ul className="flex items-center rounded-md border border-line bg-white px-1 text-xs font-extrabold">
        {locales.map((code, index) => (
          <li key={code} className="flex items-center">
            {index > 0 && (
              <span aria-hidden="true" className="text-line">
                |
              </span>
            )}
            {code === locale ? (
              <span aria-current="true" className="flex min-h-9 items-center px-2 text-navy">
                {code.toUpperCase()}
              </span>
            ) : (
              <a
                href={routes[route][other]}
                hrefLang={other}
                lang={other}
                aria-label={t(ui.languageSwitch.switchTo, other)}
                className="flex min-h-9 items-center px-2 text-muted underline-offset-4 hover:text-navy hover:underline"
              >
                {code.toUpperCase()}
              </a>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
}
