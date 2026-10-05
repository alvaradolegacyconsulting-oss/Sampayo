import type { MetadataRoute } from "next";
import { isProductionBuild } from "@/lib/env";
import { absoluteUrl, siteOrigin } from "@/lib/seo";

// Only production is crawlable; preview deployments are staging and should stay out of search results.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: isProductionBuild() ? { userAgent: "*", allow: "/" } : { userAgent: "*", disallow: "/" },
    sitemap: absoluteUrl(siteOrigin(), "/sitemap.xml"),
  };
}
