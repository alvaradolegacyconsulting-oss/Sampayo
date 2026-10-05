import type { ReactNode } from "react";
import { RootDocument } from "@/components/RootDocument";
import { defaultLocale } from "@/content/types";
import { rootMetadata } from "@/lib/seo";
import "../globals.css";

// The default language, served at "/". Which language that is: content/types.ts defaultLocale.
export const metadata = rootMetadata(defaultLocale);

export default function Layout({ children }: Readonly<{ children: ReactNode }>) {
  return <RootDocument locale={defaultLocale}>{children}</RootDocument>;
}
