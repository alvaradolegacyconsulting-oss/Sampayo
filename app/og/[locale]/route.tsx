import { locales, type Locale } from "@/content/types";
import { renderOgImage } from "@/lib/og";

// Share images at fixed URLs (/og/es, /og/en), built at deploy time. Not the opengraph-image file
// convention: inside a route group its URL gets a hash, and a page's openGraph object replaces it.
export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function GET(_request: Request, { params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!locales.includes(locale as Locale)) return new Response("Not found", { status: 404 });
  return renderOgImage(locale as Locale);
}
