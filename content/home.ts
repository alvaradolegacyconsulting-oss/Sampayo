import { drafted, fromLiveSite, given, placeholder, type Photo, type Text } from "./types";

// Every home-page section in order. Pages on the live site: "/" and "/services-1" are Spanish,
// "/home" and "/services" are English. Copy that speaks to homeowners was dropped (contractors only).

const HOME = "/ (es), /home (en)";
const SERVICES = "/services-1 (es), /services (en)";

export type TrustItem = { title: Text; body: Text };
export type ServiceId = "replacement" | "repair" | "storm" | "gutters";
export type ServiceItem = { id: ServiceId; title: Text; body: Text; photo: Photo };
export type Point = { title: Text; body: Text };
export type Step = { title: Text; body: Text };
export type FaqItem = { question: Text; answer: Text };

const servicePhoto = (file: string, es: string, en: string): Photo => ({
  src: `/images/services/${file}`,
  alt: drafted(es, en, "Photo description"),
  width: 1600,
  height: 1200,
});

export const home = {
  hero: {
    eyebrow: drafted("Subcontratista de techado · Minnesota", "Roofing subcontractor · Minnesota"),
    heading: given("Techos bien hechos, siempre.", "Roofing done right, every time."),
    intro: drafted(
      "Cuadrillas de techado capacitadas para contratistas generales y constructores en todo Minnesota, listas cuando su cronograma lo necesite.",
      "Trained roofing crews for general contractors and builders across Minnesota, ready when your schedule needs them.",
      "Expanded from the live site's hero line.",
    ),
    /** "{phone}" is filled in from content/site.ts. */
    call: drafted("Llamar al {phone}", "Call {phone}"),
    details: drafted("Enviar detalles del proyecto", "Send project details"),
    photo: {
      src: placeholder("crew-at-work photo on a roof").en,
      alt: drafted("Cuadrilla de Sampayo trabajando en un techo", "Sampayo crew working on a roof"),
      width: 1600,
      height: 1200,
    } satisfies Photo,
  },

  trust: {
    label: drafted("Lo esencial", "At a glance"),
    items: [
      {
        title: drafted("Asegurados", "Insured"),
        body: drafted("Responsabilidad civil y compensación laboral", "Liability and workers' comp coverage"),
      },
      {
        title: drafted("Más de 5 años", "5+ years"),
        body: drafted("Techado para contratistas de Minnesota", "Roofing for Minnesota contractors"),
      },
      {
        title: drafted("Cuadrillas bilingües", "Bilingual crews"),
        body: drafted("Comunicación en inglés y español", "English and Spanish communication"),
      },
      {
        title: drafted("Residencial y comercial", "Residential & commercial"),
        body: drafted("De remociones a volumen de tormentas", "Tear-offs to storm volume"),
      },
    ] satisfies TrustItem[],
  },

  services: {
    eyebrow: drafted("Lo que hacemos", "What we do"),
    heading: drafted("Hechos para climas del norte, según su cronograma.", "Built for northern climates, on your schedule."),
    intro: fromLiveSite(
      SERVICES,
      "Desde represas de hielo hasta la temporada de granizo, aportamos mano de obra experta y materiales diseñados para climas del norte a los contratistas generales y constructores para quienes trabajamos.",
      "From ice dams to hail season, we bring expert craftsmanship and materials built for northern climates to the general contractors and builders we work under.",
    ),
    /** Greenlight 006 decision 4: custom scopes is a line under the intro, not a card. */
    customScopes: fromLiveSite(
      SERVICES,
      "¿Tiene un trabajo especializado en mente? Preparamos una cotización personalizada con usted.",
      "Have a specialized scope in mind? We'll build a custom bid with you.",
    ),
    items: [
      {
        id: "replacement",
        title: fromLiveSite(SERVICES, "Reemplazo de techo", "Roof replacement"),
        body: drafted("Remociones completas e instalaciones nuevas, residenciales y comerciales.", "Full tear-offs and new installs, residential and commercial."),
        photo: servicePhoto("roof-replacement.jpg", "Techo de tejas terminado con ventilas a lo largo de la cumbrera, junto a un lago", "Finished shingle roof with vents along the ridge, beside a lake"),
      },
      {
        id: "repair",
        title: fromLiveSite(SERVICES, "Reparación de techo", "Roof repair"),
        body: drafted("Reparaciones puntuales que mantienen su proyecto a tiempo.", "Targeted repairs that keep your project on schedule."),
        photo: servicePhoto("roof-repair.jpg", "Instalador trabajando junto a una ventila sobre la membrana del techo", "Installer working beside a roof vent over new underlayment"),
      },
      {
        id: "storm",
        title: drafted("Trabajo por volumen de tormentas", "Storm volume work"),
        body: drafted("Cuadrillas que crecen después de la temporada de granizo y viento.", "Crews that scale up after hail and wind season."),
        photo: servicePhoto("storm-volume.jpg", "Cuadrilla subiendo paquetes de tejas a lo largo de la cumbrera", "Crew staging shingle bundles along the ridge"),
      },
      {
        id: "gutters",
        title: fromLiveSite(SERVICES, "Sistemas de canaletas", "Gutter systems"),
        body: fromLiveSite(
          SERVICES,
          "Instalación de canaletas sin costuras con protección de hojas para completar el trabajo de techado.",
          "Seamless gutter and leaf-guard installation to round out the roofing scope.",
        ),
        photo: {
          src: placeholder("gutter photo (none in the live gallery)").en,
          alt: drafted("Canaletas sin costuras instaladas por Sampayo", "Seamless gutters installed by Sampayo"),
          width: 1600,
          height: 1200,
        },
      },
    ] satisfies ServiceItem[],
  },

  whyUs: {
    eyebrow: fromLiveSite(HOME, "Por qué los contratistas trabajan con nosotros", "Why contractors work with us"),
    heading: drafted("Más de cinco años como subcontratista de confianza.", "Five-plus years as a trusted roofing sub."),
    intro: fromLiveSite(
      HOME,
      "Nuestros instaladores, capataces y líderes de proyecto aportan capacitación especializada y experiencia en obra para que sus proyectos se terminen con seguridad, a tiempo y listos para soportar los inviernos de Minnesota.",
      "Our installers, foremen and project leads bring specialized training and on-site experience, so your projects finish safely, on schedule and ready for Minnesota winters.",
    ),
    points: [
      {
        title: drafted("Totalmente asegurados", "Fully insured"),
        body: fromLiveSite(
          HOME,
          "Asegurados y con cobertura de compensación laboral, sin vacíos de responsabilidad en su obra.",
          "Insured and covered by workers' compensation, so there are no liability gaps on your job.",
        ),
      },
      {
        title: drafted("A tiempo", "On time"),
        body: fromLiveSite(
          HOME,
          "Cuadrillas que llegan a tiempo y cumplen con su cronograma de proyecto.",
          "Crews that show up on schedule and hold to your project timeline.",
        ),
      },
      {
        title: drafted("Obras limpias, con la seguridad primero", "Clean, safety-first sites"),
        body: fromLiveSite(
          HOME,
          "Limpieza diaria, barrido magnético de clavos y protección del paisaje.",
          "Daily cleanup, magnetic nail sweeps and landscape protection.",
        ),
      },
      {
        title: drafted("Residencial y comercial", "Residential and commercial"),
        body: fromLiveSite(
          HOME,
          "Remoción, instalación nueva, reparaciones y trabajo por volumen de tormentas.",
          "Tear-offs, new installs, repairs and storm volume work.",
        ),
      },
      {
        title: drafted("Cuadrilla y comunicación bilingüe", "Bilingual crew and communication"),
        body: drafted("Inglés y español, de la oficina al techo.", "English and Spanish, from the office to the roof."),
      },
    ] satisfies Point[],
  },

  gallery: {
    heading: {
      es: "Protegiendo hogares de Minnesota, un techo a la vez",
      en: "Protecting Minnesota homes, one roof at a time",
      source: "drafted",
      note: "English given in the preflight; Spanish drafted.",
    } satisfies Text,
    intro: drafted("Proyectos recientes en las Ciudades Gemelas y más allá.", "Recent projects across the Twin Cities and beyond."),
    /** Shown only once content/site.ts videosUrl is set. */
    videos: drafted("Ver videos de proyectos", "Watch project videos"),
  },

  process: {
    heading: fromLiveSite(SERVICES, "Nuestro proceso", "Our process"),
    steps: [
      {
        title: fromLiveSite(SERVICES, "Inspección", "Inspection"),
        body: fromLiveSite(
          `${SERVICES}. Drone imagery removed until Omar confirms it.`,
          "Evaluamos el techo y documentamos las condiciones, con reportes que usted puede entregar al dueño.",
          "We assess the roof and document conditions, with reporting you can pass to the owner.",
        ),
      },
      {
        title: drafted("Propuesta clara", "Clear proposal"),
        body: fromLiveSite(
          SERVICES,
          "Una cotización clara y desglosada, con recomendaciones de materiales para el clima de Minnesota, lista para integrar a su proyecto.",
          "A clear, line-itemed bid with material recommendations for the Minnesota climate, ready to fold into your project.",
        ),
      },
      {
        title: fromLiveSite(SERVICES, "Construcción de precisión", "Precision build"),
        body: fromLiveSite(
          SERVICES,
          "Nuestra cuadrilla protege la propiedad e instala el sistema de techado según los estándares del fabricante, de principio a fin y según su cronograma.",
          "Our crew protects the property and installs the roof system to manufacturer standards, start to finish, on your schedule.",
        ),
      },
      {
        title: drafted("Recorrido final", "Final walkthrough"),
        body: fromLiveSite(
          SERVICES,
          "Terminamos con un barrido magnético de clavos y un recorrido conjunto, para que la obra quede limpia y lista para su aprobación.",
          "We finish with a magnetic nail sweep and a joint walkthrough, so the job is clean and ready for your sign-off.",
        ),
      },
    ] satisfies Step[],
  },

  faq: {
    heading: drafted("Preguntas frecuentes", "Common questions"),
    items: [
      {
        question: fromLiveSite(
          HOME,
          "¿Trabajan directamente con dueños de casa, o solo como subcontratista?",
          "Do you work directly with homeowners, or only as a subcontractor?",
        ),
        answer: fromLiveSite(
          HOME,
          "Trabajamos como subcontratista de techado. Colaboramos con contratistas generales y constructores que tienen el contrato con el dueño de la propiedad: usted maneja el proyecto y los permisos, y nosotros entregamos el trabajo de techado.",
          "We work as a roofing subcontractor. We partner with general contractors and builders who hold the contract with the property owner: you manage the project and permits, and we deliver the roofing scope.",
        ),
      },
      {
        question: fromLiveSite(HOME, "¿Qué tipo de trabajo de techado realizan?", "What roofing work do you handle?"),
        answer: fromLiveSite(
          HOME,
          "Remoción, instalación nueva, retechado, reparaciones y trabajo por volumen de tormentas en cubiertas residenciales y comerciales. Indíquenos el sistema y el cronograma y confirmamos la disponibilidad de cuadrilla.",
          "Tear-offs, new installs, re-roofs, repairs and storm volume work on both residential and commercial decks. Tell us the system and timeline and we'll confirm crew fit.",
        ),
      },
      {
        question: fromLiveSite(
          `${HOME}. "and registered" dropped until the license question is answered.`,
          "¿Están asegurados?",
          "Are you insured?",
        ),
        answer: fromLiveSite(
          HOME,
          "Sí. Contamos con seguro de responsabilidad civil y cobertura de compensación laboral. Con gusto entregamos los certificados vigentes para sus archivos.",
          "Yes. We carry liability insurance and workers' compensation coverage. We'll provide current certificates for your files on request.",
        ),
      },
      {
        question: fromLiveSite(HOME, "¿Qué áreas cubren?", "What areas do you cover?"),
        answer: fromLiveSite(
          `${HOME}. Omar to confirm the areas covered.`,
          "Contratistas generales y constructores en el área metropolitana de Minneapolis–St. Paul y el resto de Minnesota. Contáctenos con su ubicación y confirmamos disponibilidad.",
          "General contractors and builders across the Minneapolis–St. Paul metro and greater Minnesota. Reach out with your location and we'll confirm availability.",
        ),
      },
      {
        question: fromLiveSite(HOME, "¿Cómo conseguimos una cuadrilla para nuestro proyecto?", "How do we get a crew on our project?"),
        answer: fromLiveSite(
          HOME,
          "Llame o envíe los detalles del proyecto (ubicación, alcance, tipo de cubierta y fechas objetivo) y confirmamos disponibilidad y le damos una cotización.",
          "Call or send your project details (location, scope, deck type and target dates) and we'll confirm availability and provide a bid.",
        ),
      },
    ] satisfies FaqItem[],
  },

  contact: {
    heading: fromLiveSite(HOME, "Trabajemos juntos.", "Let's work together."),
    intro: drafted(
      "Llame o envíe un mensaje de texto con el alcance, el tipo de techo, la ubicación y las fechas objetivo. Confirmamos la disponibilidad de cuadrilla y le enviamos una cotización.",
      "Call or text with the scope, roof type, location and target dates. We'll confirm crew availability and send a quote.",
      "Adapted from the live site's contact line; lists what contractors should include.",
    ),
    /** Labels for screen readers and the buttons; the number itself comes from content/site.ts. */
    call: drafted("Llamar", "Call"),
    text: drafted("Enviar mensaje de texto", "Text"),
    email: drafted("Correo electrónico", "Email"),
    copy: drafted("Copiar", "Copy"),
    copied: drafted("Copiado", "Copied"),
    /** The browser blocked the clipboard; the address is still on screen to copy by hand. */
    copyFailed: drafted("No se pudo copiar. Seleccione el correo para copiarlo.", "Couldn't copy. Select the address to copy it."),
    /** Subject line pre-filled when someone taps the email address. */
    mailSubject: given("Solicitud de proyecto", "Project request"),
  },
};
