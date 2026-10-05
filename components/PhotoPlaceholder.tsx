import type { CSSProperties } from "react";

/** Stand-in for a real photo that hasn't been supplied yet; shows what's missing. */
export function PhotoPlaceholder({
  label,
  description,
  className = "",
  style,
  rounded = true,
}: {
  label: string;
  description: string;
  className?: string;
  style?: CSSProperties;
  rounded?: boolean;
}) {
  return (
    <div
      className={`flex items-center justify-center ${rounded ? "rounded-lg border border-dashed border-muted/40" : ""} bg-stone p-4 text-center text-muted ${className}`}
      style={style}
      role="img"
      aria-label={description}
    >
      <span className="max-w-64 text-[0.6875rem] font-extrabold uppercase tracking-[0.12em]">{label}</span>
    </div>
  );
}
