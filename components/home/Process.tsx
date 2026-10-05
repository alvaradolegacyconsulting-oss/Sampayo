import { Section } from "@/components/Section";
import { home } from "@/content/home";
import type { Locale } from "@/content/types";
import { t } from "@/lib/i18n";
import { sectionId } from "@/lib/routes";

const stepNumber = (index: number) => String(index + 1).padStart(2, "0");

export function Process({ locale }: { locale: Locale }) {
  const { process } = home;

  return (
    <Section id={sectionId("process", locale)} tone="navy" heading={t(process.heading, locale)}>
      <ol className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
        {process.steps.map((step, index) => (
          <li key={step.title.en} className="border-t-2 border-copper-light/50 pt-4">
            <p aria-hidden="true" className="text-3xl font-extrabold text-copper-light">
              {stepNumber(index)}
            </p>
            <h3 className="mt-2 text-lg font-bold text-white">{t(step.title, locale)}</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-white/80">{t(step.body, locale)}</p>
          </li>
        ))}
      </ol>
    </Section>
  );
}
