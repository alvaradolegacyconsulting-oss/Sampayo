// Relative imports only: scripts/check-content.ts loads this under tsx.
import { existsSync } from "node:fs";
import { join } from "node:path";
import type { SiteContent } from "../content/site";
import { isPlaceholder, type Photo } from "../content/types";

/** Everything wrong with content/site.ts that would break a link on the page. */
export function findSiteProblems(site: SiteContent): string[] {
  const problems: string[] = [];
  if (!/^https:\/\/[^/]+$/.test(site.url)) problems.push(`site.url "${site.url}" must be https:// with no trailing slash`);
  if (!/^\+1\d{10}$/.test(site.phone.tel)) problems.push(`site.phone.tel "${site.phone.tel}" must look like +16125550100 (it becomes a tel: link)`);
  if (site.phone.tel.slice(-10) !== site.phone.display.replace(/\D/g, "")) {
    problems.push(`site.phone.display "${site.phone.display}" and site.phone.tel "${site.phone.tel}" are different numbers`);
  }
  if (site.email !== null && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(site.email)) problems.push(`site.email "${site.email}" is not an email address (or null)`);
  const links = { ...site.social, videosUrl: site.videosUrl };
  for (const [key, value] of Object.entries(links)) {
    if (value !== null && !value.startsWith("https://")) problems.push(`site link ${key} "${value}" must start with https:// (or be null)`);
  }
  return problems;
}

/** A photo path that doesn't exist in public/ would show a broken image. Placeholders are fine. */
export function findPhotoProblems(photos: { path: string; photo: Photo }[], publicDir: string): string[] {
  return photos.flatMap(({ path, photo }) => {
    if (isPlaceholder(photo.src)) return [];
    if (!photo.src.startsWith("/images/")) return [`${path}.src "${photo.src}" must start with /images/`];
    return existsSync(join(publicDir, photo.src)) ? [] : [`${path}.src "${photo.src}" is not in public${photo.src}`];
  });
}
