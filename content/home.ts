import { drafted, fromLiveSite, given, placeholder, type NoPhoto, type Photo, type Text } from "./types";

// Every home-page section in order. Pages on the live site: "/" and "/services-1" are Spanish,
// "/home" and "/services" are English. Copy that speaks to homeowners was dropped (contractors only).
// Greenlight 006-B (Oct 13) rewrote most of it for general contractors in the Twin Cities.

const HOME = "/ (es), /home (en)";
const SERVICES = "/services-1 (es), /services (en)";

export type TrustItem = { title: Text; body: Text };
export type ServiceId = "replacement" | "repair" | "storm" | "gutters";
export type ServiceItem = { id: ServiceId; title: Text; body: Text; photo: Photo };
export type Point = { title: Text; body: Text };
/**
 * `photo: { kind: "none" }` renders the step without one, on purpose. The old site's four process photos
 * are AI-generated (invented people, a fake proposal) and are never used; real job photos replace "none".
 */
export type Step = { title: Text; body: Text; photo: Photo | NoPhoto };

const noPhoto: NoPhoto = { kind: "none" };
export type FaqItem = { question: Text; answer: Text };

const servicePhoto = (file: string, es: string, en: string): Photo => ({
  src: `/images/services/${file}`,
  alt: drafted(es, en, "Photo description"),
  width: 1600,
  height: 1200,
  kind: "real",
});

// Greenlight 006-B gives the English for most sections; the Spanish is drafted for Omar's review.
const GL = "English from greenlight 006-B; Spanish drafted for Omar's review.";

export const home = {
  hero: {
    eyebrow: drafted("Subcontratista de techado · Ciudades Gemelas", "Roofing subcontractor · Twin Cities"),
    heading: drafted("Cuadrillas de techado con las que los contratistas de Minnesota pueden contar.", "Roofing crews Minnesota contractors can count on.", GL),
    intro: drafted(
      "Sampayo Construction es un subcontratista de techado para contratistas generales y constructores en las Ciudades Gemelas: remociones, instalaciones nuevas, reparaciones y trabajo por volumen de tormentas, residencial y comercial.",
      "Sampayo Construction is a roofing subcontractor for general contractors and builders across the Twin Cities: tear-offs, new installs, repairs and storm-volume work, residential and commercial.",
      GL,
    ),
    /** "{phone}" is filled in from content/site.ts if the label uses it. */
    call: drafted("Llamar a Omar", "Call Omar", GL),
    details: drafted("Solicitar cotización", "Request a bid", GL),
    /** Omar's crew (Jose, Oct 16). docs/PHOTOS.md has how it was prepared. */
    photo: {
      src: "/images/crew/crew-roof-deck.jpg",
      alt: drafted(
        "Nuestra cuadrilla retirando el techo viejo en el alero, sobre cubierta nueva de OSB, con un lago al fondo",
        "Our crew tearing off old roofing at the eave over new OSB decking, with a lake behind",
        "Photo description",
      ),
      width: 1600,
      height: 1200,
      kind: "real",
    } satisfies Photo,
  },

  trust: {
    label: drafted("Lo esencial", "At a glance"),
    items: [
      {
        title: drafted("Asegurados", "Insured"),
        body: drafted("Responsabilidad civil general y compensación laboral", "General liability and workers' comp"),
      },
      {
        title: drafted("Más de 5 años", "5+ years"),
        body: drafted("Techado para contratistas de las Ciudades Gemelas", "Roofing for Twin Cities contractors"),
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
    eyebrow: drafted("Lo que ofrecemos", "What we offer"),
    heading: drafted("Hechos para climas del norte, según su cronograma.", "Built for northern climates, on your schedule."),
    intro: drafted(
      "Desde las represas de hielo hasta la temporada de granizo, aportamos mano de obra y materiales diseñados para climas del norte a los contratistas generales y constructores para quienes trabajamos.",
      "From ice dams to hail season, we bring craftsmanship and materials built for northern climates to the general contractors and builders we work under.",
      GL,
    ),
    /** Greenlight 006 decision 4: custom scopes is a line under the intro, not a card. */
    customScopes: drafted(
      "¿Tiene un trabajo especializado? Preparamos una cotización personalizada con usted.",
      "Have a specialized scope? We'll build a custom bid with you.",
      GL,
    ),
    items: [
      {
        id: "replacement",
        title: fromLiveSite(SERVICES, "Reemplazo de techo", "Roof replacement"),
        body: drafted(
          "Remoción completa e instalación nueva según los estándares del fabricante, residencial y comercial.",
          "Full tear-off and new installation to manufacturer standards, residential and commercial.",
          GL,
        ),
        photo: servicePhoto("roof-replacement.jpg", "Techo de tejas terminado con ventilas a lo largo de la cumbrera, junto a un lago", "Finished shingle roof with vents along the ridge, beside a lake"),
      },
      {
        id: "repair",
        title: fromLiveSite(SERVICES, "Reparación de techo", "Roof repair"),
        body: drafted(
          "Goteras, daños por tormenta y secciones desgastadas, evaluadas y reparadas para que el resto de su proyecto siga avanzando.",
          "Leaks, storm damage and worn sections, scoped and fixed so the rest of your project keeps moving.",
          GL,
        ),
        photo: servicePhoto("roof-repair.jpg", "Instalador trabajando junto a una ventila sobre la membrana del techo", "Installer working beside a roof vent over new underlayment"),
      },
      {
        id: "storm",
        title: drafted("Volumen por tormentas", "Storm volume", GL),
        body: drafted(
          "Cuadrillas adicionales para la demanda después de una tormenta, cuando su cronograma se llena tras el granizo o el viento.",
          "Extra crews for post-storm demand, when your schedule fills up after hail or wind.",
          GL,
        ),
        photo: servicePhoto("storm-volume.jpg", "Cuadrilla subiendo paquetes de tejas a lo largo de la cumbrera", "Crew staging shingle bundles along the ridge"),
      },
      {
        id: "gutters",
        title: fromLiveSite(SERVICES, "Sistemas de canaletas", "Gutter systems"),
        body: drafted(
          "Canaletas y bajantes instaladas junto con el techo, para terminar el trabajo en una sola visita.",
          "Gutters and downspouts installed alongside the roof, so the job is finished in one visit.",
          GL,
        ),
        photo: {
          src: placeholder("gutter photo (none in the live gallery)").en,
          // A licensed stock photo stands in here (greenlight 006-B), so the alt describes the photo, not Sampayo's work.
          alt: drafted("Canaletas y bajantes en el alero de una casa", "Gutters and downspouts along the eave of a house"),
          width: 1600,
          height: 1200,
          kind: "stock",
        },
      },
    ] satisfies ServiceItem[],
  },

  whyUs: {
    eyebrow: fromLiveSite(HOME, "Por qué los contratistas trabajan con nosotros", "Why contractors work with us"),
    heading: drafted("Más de cinco años como subcontratista de confianza.", "Five-plus years as a trusted roofing sub."),
    /** The About paragraph. */
    intro: drafted(
      "Desde hace más de cinco años, Sampayo Construction trabaja como subcontratista de techado para contratistas generales y constructores en las Ciudades Gemelas. Nuestros instaladores, capataces y líderes de proyecto aportan capacitación especializada y experiencia en obra, para que sus proyectos se terminen con seguridad, a tiempo y preparados para resistir los inviernos de Minnesota.",
      "For more than five years, Sampayo Construction has worked as a roofing subcontractor for general contractors and builders across the Twin Cities. Our installers, foremen and project leads bring specialized training and on-site experience, so your projects finish safely, on schedule and built to withstand Minnesota winters.",
      GL,
    ),
    /** Under the About paragraph: a real Sampayo job site (Jose, Oct 16), house number blurred (docs/PHOTOS.md). */
    photo: {
      src: "/images/crew/tearoff-jobsite.jpg",
      alt: drafted(
        "Una de nuestras obras: paquetes de tejas sobre la membrana nueva, lonas protegiendo el jardín y un contenedor de escombros en la entrada",
        "One of our tear-offs: shingle bundles staged on new underlayment, tarps protecting the landscaping and a dumpster in the driveway",
        "Photo description",
      ),
      width: 1600,
      height: 1200,
      kind: "real",
    } as Photo | NoPhoto,
    points: [
      {
        title: drafted("Totalmente asegurados", "Fully insured"),
        body: drafted(
          "Asegurados y con cobertura de compensación laboral: sin vacíos de responsabilidad en su obra.",
          "Insured and covered by workers' compensation: no liability gaps on your job.",
          GL,
        ),
      },
      {
        title: drafted("A tiempo", "On time"),
        body: drafted(
          "Cuadrillas que llegan a tiempo y cumplen con el cronograma de su proyecto.",
          "Crews that show up on schedule and hold to your project timeline.",
          GL,
        ),
      },
      {
        title: drafted("Obras limpias, con la seguridad primero", "Clean, safety-first sites"),
        body: drafted(
          "Obras limpias y con la seguridad primero: limpieza diaria, barrido magnético de clavos y protección del paisaje.",
          "Clean, safety-first job sites: daily cleanup, magnetic nail sweep, protected landscaping.",
          GL,
        ),
      },
      {
        title: drafted("Residencial y comercial", "Residential and commercial"),
        body: drafted(
          "Remociones, instalaciones nuevas, reparaciones y trabajo por volumen de tormentas, en cubiertas residenciales y comerciales.",
          "Tear-offs, new installs, repairs and storm-volume work, on residential and commercial decks.",
          GL,
        ),
      },
      {
        title: drafted("Cuadrilla bilingüe", "Bilingual crew"),
        body: drafted(
          "Cuadrilla y comunicación bilingüe (English / Español).",
          "Bilingual crew and communication (English / Español).",
          GL,
        ),
      },
    ] satisfies Point[],
  },

  gallery: {
    heading: drafted("Trabajos recientes", "Recent work", "Replaces the homeowner-facing heading from preflight 006 (greenlight 006-B: every line speaks to contractors)."),
    intro: drafted("Fotos de obra de nuestras cuadrillas.", "Job photos from our crews."),
    /** Shown only once content/site.ts videosUrl is set. */
    videos: drafted("Ver videos de proyectos", "Watch project videos"),
  },

  process: {
    heading: drafted("Cómo trabajamos", "How we work", GL),
    steps: [
      {
        title: fromLiveSite(SERVICES, "Inspección", "Inspection"),
        body: drafted(
          "Evaluamos el techo y documentamos las condiciones con revisiones en sitio y fotos, con un reporte que usted puede entregar al dueño.",
          "We assess the roof and document conditions with hands-on checks and photos, with a report you can pass to the owner.",
          GL,
        ),
        photo: noPhoto,
      },
      {
        title: drafted("Cotización desglosada", "Line-item bid", GL),
        body: drafted(
          "Una cotización clara y detallada, con recomendaciones de materiales para el clima de Minnesota, lista para integrar a su proyecto.",
          "A clear, itemized bid with material recommendations for the Minnesota climate, ready to fold into your project.",
          GL,
        ),
        photo: noPhoto,
      },
      {
        title: drafted("Construcción", "Build", GL),
        body: drafted(
          "Protegemos la propiedad e instalamos el sistema de techado según los estándares del fabricante, de principio a fin y según su cronograma.",
          "We protect the property and install the roof system to manufacturer standards, start to finish, on your schedule.",
          GL,
        ),
        photo: noPhoto,
      },
      {
        /** Was "Final Certification" on the old site; renamed so it doesn't suggest a formal credential. */
        title: drafted("Recorrido final", "Final walkthrough", GL),
        body: drafted(
          "Un barrido magnético de clavos y un recorrido conjunto, para que la obra quede limpia y lista para su aprobación.",
          "A magnetic nail sweep and a joint walkthrough, so the job is clean and ready for your sign-off.",
          GL,
        ),
        photo: noPhoto,
      },
    ] satisfies Step[],
  },

  faq: {
    heading: drafted("Preguntas frecuentes", "Common questions"),
    items: [
      {
        question: drafted("¿Trabajan directamente con dueños de casa?", "Do you work directly with homeowners?", GL),
        answer: drafted(
          "No. Trabajamos como subcontratista de techado. Colaboramos con contratistas generales y constructores que tienen el contrato con el dueño de la propiedad: usted maneja el proyecto y los permisos, y nosotros entregamos el trabajo de techado.",
          "No. We work as a roofing subcontractor. We partner with general contractors and builders who hold the contract with the property owner: you manage the project and permits, and we deliver the roofing scope.",
          GL,
        ),
      },
      {
        question: fromLiveSite(HOME, "¿Qué trabajos de techado realizan?", "What roofing work do you handle?"),
        answer: drafted(
          "Remociones, instalaciones nuevas, reparaciones, trabajo por volumen de tormentas y sistemas de canaletas, en cubiertas residenciales y comerciales.",
          "Tear-offs, new installs, repairs, storm-volume work and gutter systems, on residential and commercial decks.",
          GL,
        ),
      },
      {
        // No license or registration is claimed anywhere (Jose, Oct 13).
        question: drafted("¿Están asegurados?", "Are you insured?", GL),
        answer: drafted(
          "Sí. Tenemos seguro de responsabilidad civil general y de compensación laboral, y podemos enviarle un certificado de seguro si lo solicita.",
          "Yes. We carry general liability and workers' compensation, and we can send a certificate of insurance on request.",
          GL,
        ),
      },
      {
        question: fromLiveSite(HOME, "¿Qué áreas cubren?", "What areas do you cover?"),
        answer: drafted(
          "El área metropolitana de las Ciudades Gemelas. Para proyectos más lejos, llame y pregunte.",
          "The Twin Cities metro. For projects farther out, call and ask.",
          GL,
        ),
      },
      {
        question: fromLiveSite(HOME, "¿Cómo conseguimos una cuadrilla para nuestro proyecto?", "How do we get a crew on our project?"),
        answer: drafted(
          "Llame o envíe un mensaje de texto a Omar con la dirección, el alcance y el cronograma del proyecto. Le responderemos con una cotización desglosada.",
          "Call or text Omar with the project address, scope and timeline. We'll come back with a line-item bid.",
          GL,
        ),
      },
    ] satisfies FaqItem[],
  },

  contact: {
    heading: fromLiveSite(HOME, "Trabajemos juntos.", "Let's work together."),
    intro: drafted(
      "¿Tiene un proyecto que necesita una cuadrilla de techado? Llame o envíe un mensaje de texto con el alcance, la dirección y el cronograma, y le preparamos una cotización.",
      "Have a project that needs a roofing crew? Call or text with the scope, address and timeline and we'll put together a bid.",
      GL,
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
