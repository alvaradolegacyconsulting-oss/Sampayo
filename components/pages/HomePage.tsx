import { PageShell } from "@/components/PageShell";
import type { Locale } from "@/content/types";

/** The whole site: one page per language. Sections are added in the following commits. */
export function HomePage({ locale }: { locale: Locale }) {
  return <PageShell route="home" locale={locale}>{null}</PageShell>;
}
