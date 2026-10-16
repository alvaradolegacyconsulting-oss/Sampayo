import type { ReactNode } from "react";
import { RootDocument } from "@/components/RootDocument";
import { alternateLocale, hasAlternate } from "@/lib/routes";
import { rootMetadata } from "@/lib/seo";
import "../../globals.css";

// The other language, served at "/<code>" ("/es" while English is the default) when this build serves it
// (lib/routes.ts publishedLanguages: always on previews, on production once translationsReviewed is true).
// Otherwise there are no params and "/es" is a 404. Anything else ("/fr", "/xyz") is always a 404
// from app/global-not-found.tsx.
export const dynamicParams = false;

export function generateStaticParams() {
  return hasAlternate() ? [{ alt: alternateLocale }] : [];
}

export const metadata = rootMetadata(alternateLocale);

export default function Layout({ children }: Readonly<{ children: ReactNode }>) {
  return <RootDocument locale={alternateLocale}>{children}</RootDocument>;
}
