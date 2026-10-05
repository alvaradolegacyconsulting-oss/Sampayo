import { drafted, given, name, type Text } from "./types";

/** Site chrome: header, language switch, footer, 404, page titles. Section copy lives in content/home.ts. */
export const ui = {
  common: {
    skipToContent: drafted("Saltar al contenido", "Skip to content"),
    homeLink: drafted("Sampayo Construction, inicio", "Sampayo Construction home"),
    opensInNewTab: drafted("(se abre en una pestaña nueva)", "(opens in a new tab)"),
  },
  nav: {
    label: drafted("Navegación principal", "Main navigation"),
    menu: drafted("Menú", "Menu"),
    services: given("Servicios", "Services"),
    whyUs: given("Por qué nosotros", "Why us"),
    work: given("Trabajos", "Our work"),
    faq: given("Preguntas", "FAQ"),
    /** Greenlight 006 decision 5: Omar's wording from the live site. */
    cta: given("Solicitar disponibilidad", "Request availability"),
  },
  languageSwitch: {
    label: drafted("Idioma", "Language"),
    /** Read in the language it switches to: the English link says "Read this page in English". */
    switchTo: drafted("Ver esta página en español", "Read this page in English"),
  },
  footer: {
    verse: {
      text: {
        es: "Todo lo puedo en Cristo que me fortalece.",
        en: "I can do all things through Christ who strengthens me.",
        source: "bible",
        note: "es: Reina-Valera 1960 (Omar to confirm). en: NKJV, as in the approved concept.",
      } satisfies Text,
      reference: { es: "Filipenses 4:13", en: "Philippians 4:13", source: "bible", note: "Book names per version." } satisfies Text,
    },
    developedBy: drafted("Desarrollado por", "Developed by"),
    developer: name("Alvarado Legacy Consulting"),
    developerUrl: "https://alvaradolegacyconsultingllc.com",
    social: drafted("Redes sociales", "Social media"),
    facebook: name("Facebook"),
    instagram: name("Instagram"),
    youtube: name("YouTube"),
    tiktok: name("TikTok"),
    call: drafted("Llamar", "Call"),
  },
  homePage: {
    /** "<site name> | <this>" in the browser tab and search results. */
    title: drafted("Subcontratista de techado en Minnesota", "Roofing subcontractor in Minnesota"),
  },
  notFound: {
    title: drafted("No encontramos esta página", "We couldn't find that page"),
    body: drafted("Puede que el enlace sea antiguo. La página principal tiene todo lo que buscaba.", "The link may be out of date. The home page has everything you were looking for."),
    home: drafted("Ir a la página principal", "Go to the home page"),
  },
};
