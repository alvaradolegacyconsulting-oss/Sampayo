import type { ReactNode } from "react";
import { RootDocument } from "@/components/RootDocument";
import { alternateLocale } from "@/lib/routes";
import { rootMetadata } from "@/lib/seo";
import "../../globals.css";

// The other language, served at "/<code>" ("/en" while Spanish is the default). [alt] has exactly one
// value; anything else ("/fr", "/xyz") is a 404 from app/global-not-found.tsx.
export const dynamicParams = false;

export function generateStaticParams() {
  return [{ alt: alternateLocale }];
}

export const metadata = rootMetadata(alternateLocale);

export default function Layout({ children }: Readonly<{ children: ReactNode }>) {
  return <RootDocument locale={alternateLocale}>{children}</RootDocument>;
}
