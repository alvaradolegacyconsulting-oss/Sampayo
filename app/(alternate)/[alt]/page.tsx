import { HomePage } from "@/components/pages/HomePage";
import { alternateLocale } from "@/lib/routes";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("home", alternateLocale);

export default function Page() {
  return <HomePage locale={alternateLocale} />;
}
