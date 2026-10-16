import Image from "next/image";
import { site } from "@/content/site";
import type { Locale } from "@/content/types";
import { t } from "@/lib/i18n";

/** The header mark (compass, houses, SAMPAYO). On light backgrounds only: see content/site.ts logo. */
export function Logo({ locale }: { locale: Locale }) {
  const { mark } = site.logo;
  return (
    <Image
      src={mark.src}
      alt={t(mark.alt, locale)}
      width={mark.width}
      height={mark.height}
      sizes="5.5rem"
      priority
      className="h-12 w-auto sm:h-14"
    />
  );
}
