/**
 * Open questions with no field of their own yet. Each line keeps the production build from passing
 * (PLACEHOLDERS_RESOLVED). Delete a line once it's answered and the answer is in content/.
 *
 * Omar's review of docs/REVIEW.md (including the Spanish verse version) isn't listed: it gates Spanish
 * on production through content/site.ts translationsReviewed instead, so English can launch first.
 */
export const openQuestions: string[] = [
  "[PLACEHOLDER: social links: Facebook, Instagram, YouTube, TikTok (content/site.ts social)]",
  "[PLACEHOLDER: project video link (content/site.ts videosUrl)]",
  "[PLACEHOLDER: logo file: is Logo+Verse+English.jpg from the live site the logo? (text wordmark until then)]",
];
