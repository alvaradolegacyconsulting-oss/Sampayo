import Image from "next/image";
import { PhotoPlaceholder } from "@/components/PhotoPlaceholder";
import { isPlaceholder, type Locale, type Photo } from "@/content/types";
import { t } from "@/lib/i18n";

/** A content photo, or a labelled placeholder box of the same shape until the real one arrives. */
export function SitePhoto({
  photo,
  locale,
  sizes,
  className = "",
  priority = false,
  rounded = true,
}: {
  photo: Photo;
  locale: Locale;
  /** next/image sizes, e.g. "(min-width: 768px) 50vw, 100vw". */
  sizes: string;
  className?: string;
  priority?: boolean;
  /** false inside a card that already clips its corners. */
  rounded?: boolean;
}) {
  const aspectRatio = `${photo.width} / ${photo.height}`;

  if (isPlaceholder(photo.src)) {
    return <PhotoPlaceholder label={photo.src} description={t(photo.alt, locale)} rounded={rounded} className={className} style={{ aspectRatio }} />;
  }

  return (
    <Image
      src={photo.src}
      alt={t(photo.alt, locale)}
      width={photo.width}
      height={photo.height}
      sizes={sizes}
      priority={priority}
      className={`h-auto w-full object-cover ${rounded ? "rounded-lg" : ""} ${className}`}
      style={{ aspectRatio }}
    />
  );
}
