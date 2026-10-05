import { ImageResponse } from "next/og";
import { home } from "@/content/home";
import { site } from "@/content/site";
import type { Locale } from "@/content/types";
import { t } from "@/lib/i18n";
import { theme } from "@/theme/tokens";

export const ogSize = { width: 1200, height: 630 };

/** Generated share card, one per language; swap for a designed image later if wanted. */
export function renderOgImage(locale: Locale) {
  // The OG renderer collapses spaces between elements, so lay the headline out word by word.
  const words = t(home.hero.heading, locale).split(" ");

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background: theme.color.navy,
          color: theme.color.white,
        }}
      >
        <div style={{ fontSize: 28, fontWeight: 700, letterSpacing: 4, textTransform: "uppercase", color: theme.color.copperLight }}>
          {t(home.hero.eyebrow, locale)}
        </div>
        <div style={{ marginTop: 28, fontSize: 88, fontWeight: 800, lineHeight: 1.02, display: "flex", flexWrap: "wrap" }}>
          {words.map((word, index) => (
            <span key={index} style={{ marginRight: 24 }}>
              {word}
            </span>
          ))}
        </div>
        <div style={{ marginTop: 48, display: "flex", alignItems: "center", fontSize: 32 }}>
          <div style={{ width: 56, height: 4, marginRight: 24, background: theme.color.copperLight }} />
          {`${site.legalName} · ${site.phone.display}`}
        </div>
      </div>
    ),
    ogSize,
  );
}
