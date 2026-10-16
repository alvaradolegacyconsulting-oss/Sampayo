import { site } from "@/content/site";

/** The header wordmark, as live text (Jose, Oct 16). The image logo is in the About section only. */
export function Logo({ dark = false }: { dark?: boolean }) {
  return (
    <span className="flex flex-col leading-none">
      <span className={`text-xl font-extrabold uppercase tracking-[0.04em] sm:text-[1.375rem] ${dark ? "text-white" : "text-navy"}`}>
        {site.wordmark.main}
      </span>
      <span className={`mt-1 text-[0.625rem] font-bold uppercase tracking-[0.14em] ${dark ? "text-copper-light" : "text-copper"}`}>
        {site.wordmark.sub}
      </span>
    </span>
  );
}
