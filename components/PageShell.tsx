import type { ReactNode } from "react";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import type { Locale } from "@/content/types";
import type { RouteKey } from "@/lib/routes";

/** Header, main and footer for one page. `route` drives the ES | EN switch. */
export function PageShell({ route, locale, children }: { route: RouteKey; locale: Locale; children: ReactNode }) {
  return (
    <>
      <SiteHeader route={route} locale={locale} />
      <main id="main">{children}</main>
      <SiteFooter locale={locale} />
    </>
  );
}
