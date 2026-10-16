import { drafted, type Text } from "./types";

/**
 * No email on purpose. This is an answer, not a pending question, so the production gate passes:
 * the contact section shows call and text only. `reason` is for whoever reads this file next.
 */
export type NoEmail = { kind: "none"; reason: string };

export type SocialNetwork = "facebook" | "instagram" | "youtube" | "tiktok";
export type SocialLinks = Record<SocialNetwork, string | null>;
/** No social accounts on purpose: an answer, not a pending question, so the production gate passes. */
export type NoSocial = { kind: "none"; reason: string };

/** The social links to publish (empty when there are none on purpose). */
export const socialLinks = (social: SocialLinks | NoSocial): Partial<Record<SocialNetwork, string>> =>
  "kind" in social ? {} : Object.fromEntries(Object.entries(social).filter(([, link]) => link !== null));

/** The address to publish, or null when there is none on purpose. */
export const emailAddress = (email: string | NoEmail): string | null => (typeof email === "string" ? email : null);

export type SiteContent = {
  /**
   * Set to true only after Omar signs off the Spanish (docs/REVIEW.md). While false, previews serve both
   * languages for review and production builds only the default language (lib/routes.ts
   * publishedLanguages), so unreviewed drafts never go live and the review doesn't hold up launch.
   */
  translationsReviewed: boolean;
  /** Production origin, https and no trailing slash. */
  url: string;
  /** Short name for titles and the wordmark. */
  name: string;
  legalName: string;
  /** Text logo until the real one arrives: big first line, small second line. */
  wordmark: { main: string; sub: string };
  description: Text;
  phone: { display: string; tel: string };
  /** The person contractors talk to. */
  contactName: string;
  /** Inbox for project requests, shown with a Copy button, or `{ kind: "none" }` for call and text only. */
  email: string | NoEmail;
  /** Each link appears in the footer and JSON-LD only once it's set; `{ kind: "none" }` for no accounts. */
  social: SocialLinks | NoSocial;
  /** "Watch project videos" in the gallery appears only once this is set. */
  videosUrl: string | null;
  /** Minnesota contractor license number. Not shown (Jose, Oct 13): leave null, and claim no license in copy. */
  licenseNumber: string | null;
  /** Where Sampayo works, as people read it. */
  areaServed: Text;
  /** The same, as schema.org place names for the RoofingContractor JSON-LD. */
  areaServedPlaces: { type: "City" | "State"; name: string }[];
};

export const site: SiteContent = {
  translationsReviewed: false,
  url: "https://www.sampayoconstruction.com",
  name: "Sampayo Construction",
  legalName: "Sampayo Construction, LLP",
  wordmark: { main: "Sampayo", sub: "Construction, LLP" },
  description: drafted(
    "Subcontratista de techado para contratistas generales y constructores en las Ciudades Gemelas. Remociones, instalaciones nuevas, reparaciones y trabajo por volumen de tormentas, con seguro y a tiempo.",
    "Roofing subcontractor for general contractors and builders in the Twin Cities. Tear-offs, new installs, repairs and storm volume work, insured and on schedule.",
    "Meta description. Adapted from the live site's; no license or registration is claimed (Jose, Oct 13).",
  ),
  phone: { display: "612-840-7865", tel: "+16128407865" },
  contactName: "Omar Sampayo",
  email: { kind: "none", reason: "Omar prefers calls: contractors call or text (Jose, Oct 13)." },
  social: { kind: "none", reason: "Sampayo has no social accounts to publish (Jose, Oct 16)." },
  // None for launch (Jose, Oct 16): no project videos yet, so the gallery has no videos link.
  videosUrl: null,
  licenseNumber: null,
  areaServed: drafted("El área metropolitana de las Ciudades Gemelas", "The Twin Cities metro", "Jose, Oct 13 (greenlight 006-B)."),
  areaServedPlaces: [
    { type: "City", name: "Minneapolis" },
    { type: "City", name: "Saint Paul" },
  ],
};
