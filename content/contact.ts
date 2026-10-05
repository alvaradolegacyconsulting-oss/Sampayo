import { drafted, fromLiveSite, type Text } from "./types";

/** Every field on the project request form, in order. The name is what /api/contact receives. */
export type ContactFieldName = "company" | "name" | "phone" | "email" | "location" | "dates" | "scope";

export type ContactField = {
  name: ContactFieldName;
  label: Text;
  required: boolean;
  type: "text" | "tel" | "email" | "textarea";
  autoComplete?: string;
};

export type ContactContent = {
  fields: ContactField[];
  optional: Text;
  /** Label on the hidden spam-trap field; only bots ever fill it in. */
  honeypot: Text;
  submit: Text;
  pending: Text;
  /** Shown only after /api/contact confirms the email was sent. */
  success: Text;
  /** Shown on any failure; the phone number is appended as a tap-to-call link. */
  failure: Text;
  /** Label for the form as a whole. */
  label: Text;
};

export const contact: ContactContent = {
  label: drafted("Solicitud de proyecto", "Project request"),
  fields: [
    { name: "company", label: drafted("Empresa", "Company"), required: true, type: "text", autoComplete: "organization" },
    { name: "name", label: drafted("Su nombre", "Your name"), required: true, type: "text", autoComplete: "name" },
    { name: "phone", label: fromLiveSite("/ (es), /home (en)", "Teléfono", "Phone"), required: true, type: "tel", autoComplete: "tel" },
    { name: "email", label: drafted("Correo electrónico", "Email"), required: false, type: "email", autoComplete: "email" },
    { name: "location", label: drafted("Ubicación del proyecto", "Project location"), required: false, type: "text" },
    { name: "dates", label: drafted("Fechas objetivo", "Target dates"), required: false, type: "text" },
    { name: "scope", label: drafted("Alcance y tipo de techo", "Scope and roof type"), required: true, type: "textarea" },
  ],
  optional: drafted("opcional", "optional"),
  honeypot: drafted("Deje este campo vacío", "Leave this field empty"),
  submit: drafted("Solicitar disponibilidad", "Request availability"),
  pending: drafted("Enviando...", "Sending..."),
  success: drafted(
    "Solicitud enviada. Le confirmaremos la disponibilidad de cuadrilla y le enviaremos una cotización.",
    "Request sent. We'll confirm crew availability and send a quote.",
  ),
  failure: drafted("No pudimos enviar su solicitud. Llámenos al", "We couldn't send your request. Please call us at"),
};
