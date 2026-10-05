import type { ReactNode } from "react";

export type ButtonVariant = "primary" | "outline" | "light" | "outlineLight";

const variantClasses: Record<ButtonVariant, string> = {
  primary: "bg-navy text-white hover:bg-navy-deep",
  outline: "border-2 border-navy bg-white text-navy hover:bg-paper",
  // On navy backgrounds.
  light: "bg-white text-navy hover:bg-paper",
  outlineLight: "border-2 border-white/70 text-white hover:border-white hover:bg-white/10",
};

export const buttonClasses = (variant: ButtonVariant) =>
  `inline-flex min-h-12 items-center justify-center rounded-md px-6 text-center text-[0.9375rem] font-bold transition-colors ${variantClasses[variant]}`;

/** A link styled as a button. External links open in a new tab. */
export function ButtonLink({
  href,
  variant = "primary",
  className = "",
  children,
}: {
  href: string;
  variant?: ButtonVariant;
  className?: string;
  children: ReactNode;
}) {
  const external = href.startsWith("http");

  return (
    <a href={href} className={`${buttonClasses(variant)} ${className}`} {...(external ? { target: "_blank", rel: "noreferrer" } : {})}>
      {children}
    </a>
  );
}
