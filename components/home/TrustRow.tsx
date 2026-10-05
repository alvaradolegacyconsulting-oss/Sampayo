import { Container } from "@/components/Section";
import { home } from "@/content/home";
import type { Locale } from "@/content/types";
import { t } from "@/lib/i18n";

/** Four short facts under the hero: two by two on phones, one row from lg up. */
export function TrustRow({ locale }: { locale: Locale }) {
  const { trust } = home;

  return (
    <section aria-label={t(trust.label, locale)} className="border-b border-line bg-white">
      <Container>
        <ul className="grid grid-cols-2 gap-x-6 gap-y-6 py-8 lg:grid-cols-4">
          {trust.items.map((item) => (
            <li key={item.title.en}>
              <p className="text-base font-bold text-navy">{t(item.title, locale)}</p>
              <p className="mt-1 text-sm leading-snug text-muted">{t(item.body, locale)}</p>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
