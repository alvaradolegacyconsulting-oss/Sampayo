import type { Locale } from "@/content/types";
import { renderOgImage } from "@/lib/og";
import { builtLocales } from "@/lib/routes";

// Share images at fixed URLs (/og/es, /og/en), one per language this build serves, built at deploy time. Not the opengraph-image file
// convention: inside a route group its URL gets a hash, and a page's openGraph object replaces it.
export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
  return builtLocales.map((locale) => ({ locale }));
}

export async function GET(_request: Request, { params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!builtLocales.includes(locale as Locale)) return new Response("Not found", { status: 404 });
  return renderOgImage(locale as Locale);
}
