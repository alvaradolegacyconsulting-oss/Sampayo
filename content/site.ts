import { drafted, fromLiveSite, type Text } from "./types";

export type SiteContent = {
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
  /** Inbox for project requests. null until Omar confirms it; nothing shows it yet. */
  email: string | null;
  /** Each link appears in the footer and JSON-LD only once it's set. */
  social: { facebook: string | null; instagram: string | null; youtube: string | null; tiktok: string | null };
  /** "Watch project videos" in the gallery appears only once this is set. */
  videosUrl: string | null;
  /** Minnesota contractor license number, if Omar has one to show. */
  licenseNumber: string | null;
  /** Where Sampayo works, as people read it. */
  areaServed: Text;
  /** The same, as schema.org place names for the RoofingContractor JSON-LD. */
  areaServedPlaces: { type: "City" | "State"; name: string }[];
};

export const site: SiteContent = {
  url: "https://www.sampayoconstruction.com",
  name: "Sampayo Construction",
  legalName: "Sampayo Construction, LLP",
  wordmark: { main: "Sampayo", sub: "Construction, LLP" },
  description: drafted(
    "Subcontratista de techado para contratistas generales y constructores en Minnesota. Remociones, instalaciones nuevas, reparaciones y trabajo por volumen de tormentas, con seguro y a tiempo.",
    "Roofing subcontractor for general contractors and builders in Minnesota. Tear-offs, new installs, repairs and storm volume work, insured and on schedule.",
    "Meta description. Adapted from the live site's; 'registered' dropped until the license question is answered.",
  ),
  phone: { display: "612-840-7865", tel: "+16128407865" },
  contactName: "Omar Sampayo",
  email: null,
  social: { facebook: null, instagram: null, youtube: null, tiktok: null },
  videosUrl: null,
  licenseNumber: null,
  areaServed: fromLiveSite(
    "/, /home (FAQ). Omar to confirm.",
    "El área metropolitana de Minneapolis–St. Paul y el resto de Minnesota",
    "The Minneapolis–St. Paul metro and greater Minnesota",
  ),
  areaServedPlaces: [
    { type: "City", name: "Minneapolis" },
    { type: "City", name: "Saint Paul" },
    { type: "State", name: "Minnesota" },
  ],
};
