import type { Locale } from "@/content/types";
import { buildBusinessJsonLd, serializeJsonLd, siteOrigin } from "@/lib/seo";

export function BusinessJsonLd({ locale }: { locale: Locale }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(buildBusinessJsonLd(locale, siteOrigin())) }} />;
}
