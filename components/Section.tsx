import type { ReactNode } from "react";

export type SectionTone = "paper" | "white" | "navy";

const toneClasses: Record<SectionTone, string> = {
  paper: "bg-paper text-ink",
  white: "bg-white text-ink",
  navy: "on-dark bg-navy text-white",
};

/** Page-width container with the standard side gutters (16px on phones). */
export function Container({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8 ${className}`}>{children}</div>;
}

/** Small uppercase label above a heading. Copper on light backgrounds, light copper on navy. */
export function Eyebrow({ children, dark = false }: { children: ReactNode; dark?: boolean }) {
  return (
    <p className={`text-xs font-extrabold uppercase tracking-[0.14em] ${dark ? "text-copper-light" : "text-copper"}`}>{children}</p>
  );
}

export const headingClasses = (dark: boolean) =>
  `text-[2rem] font-extrabold leading-[1.08] tracking-tight sm:text-[2.625rem] ${dark ? "text-white" : "text-navy"}`;

/** A page section: anchor id, eyebrow, h2 and content, on one of the theme backgrounds. */
export function Section({
  id,
  eyebrow,
  heading,
  intro,
  tone = "paper",
  aside,
  children,
}: {
  id: string;
  eyebrow?: string;
  heading: ReactNode;
  intro?: ReactNode;
  tone?: SectionTone;
  /** Link or note beside the heading on desktop, under it on phones. */
  aside?: ReactNode;
  children: ReactNode;
}) {
  const dark = tone === "navy";
  const headingId = `${id}-heading`;

  return (
    <section id={id} aria-labelledby={headingId} className={`${toneClasses[tone]} py-14 sm:py-20`}>
      <Container>
        <div className="sm:flex sm:items-end sm:justify-between sm:gap-8">
          <div className="max-w-3xl">
            {eyebrow && <Eyebrow dark={dark}>{eyebrow}</Eyebrow>}
            <h2 id={headingId} className={`${eyebrow ? "mt-2" : ""} ${headingClasses(dark)}`}>
              {heading}
            </h2>
            {intro && <div className={`mt-4 max-w-2xl text-base leading-relaxed ${dark ? "text-white/80" : "text-muted"}`}>{intro}</div>}
          </div>
          {aside && <div className="mt-4 text-sm font-bold sm:mt-0 sm:shrink-0">{aside}</div>}
        </div>
        <div className="mt-8 sm:mt-10">{children}</div>
      </Container>
    </section>
  );
}
