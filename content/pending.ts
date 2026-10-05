/**
 * Open questions with no field of their own yet. Each line keeps the production build from passing
 * (PLACEHOLDERS_RESOLVED). Delete a line once it's answered and the answer is in content/.
 */
export const openQuestions: string[] = [
  "[PLACEHOLDER: default language: keep Spanish at /, or English? (content/types.ts defaultLocale)]",
  "[PLACEHOLDER: areas covered: confirm the live-site wording (content/site.ts areaServed and the FAQ)]",
  "[PLACEHOLDER: Minnesota contractor license number, if any (content/site.ts licenseNumber)]",
  "[PLACEHOLDER: drone inspections yes/no (left out of the process until confirmed)]",
  "[PLACEHOLDER: email for project requests (content/site.ts email and CONTACT_TO_EMAIL)]",
  "[PLACEHOLDER: social links: Facebook, Instagram, YouTube, TikTok (content/site.ts social)]",
  "[PLACEHOLDER: project video link (content/site.ts videosUrl)]",
  "[PLACEHOLDER: logo file: is Logo+Verse+English.jpg from the live site the logo? (text wordmark until then)]",
  "[PLACEHOLDER: team photo]",
  "[PLACEHOLDER: /api/contact route and email sending (next preflight); until then the form shows its error state]",
  "[PLACEHOLDER: Spanish and English reviewed by Omar (docs/TRANSLATIONS.md)]",
  "[PLACEHOLDER: Philippians 4:13 in Spanish: confirm Reina-Valera 1960 (content/ui.ts footer.verse)]",
];
