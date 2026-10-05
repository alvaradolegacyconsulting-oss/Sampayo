import { Hero } from "@/components/home/Hero";
import { Services } from "@/components/home/Services";
import { TrustRow } from "@/components/home/TrustRow";
import { PageShell } from "@/components/PageShell";
import type { Locale } from "@/content/types";

/** The whole site: one page per language, sections in the concept's order. */
export function HomePage({ locale }: { locale: Locale }) {
  return (
    <PageShell route="home" locale={locale}>
      <Hero locale={locale} />
      <TrustRow locale={locale} />
      <Services locale={locale} />
    </PageShell>
  );
}
