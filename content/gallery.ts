import { drafted, type Photo } from "./types";

/**
 * Real job photos for "Our work", in display order. Files are in public/images/gallery/, resized
 * to 1600x1200 with EXIF removed. `source` is the original file on sampayoconstruction.com/gallery-1,
 * so a swap can find the full-size original.
 */
export type GalleryPhoto = Photo & { source: string };

const photo = (file: string, source: string, es: string, en: string): GalleryPhoto => ({
  src: `/images/gallery/${file}`,
  alt: drafted(es, en, "Photo description"),
  width: 1600,
  height: 1200,
  source,
});

export const gallery: GalleryPhoto[] = [
  photo(
    "finished-ridge-vents.jpg",
    "PHOTO-2026-05-05-23-12-52+16.jpg",
    "Techo de tejas terminado con ventilas a lo largo de la cumbrera",
    "Finished shingle roof with vents along the ridge",
  ),
  photo(
    "underlayment-crew.jpg",
    "PHOTO-2026-05-05-23-12-52+15.jpg",
    "Instalador colocando membrana con paquetes de tejas listos en el techo",
    "Installer laying underlayment with shingle bundles staged on the roof",
  ),
  photo(
    "finished-ridge-evening.jpg",
    "PHOTO-2026-05-05-23-12-52+6.jpg",
    "Cumbrera terminada al atardecer",
    "Finished ridge line at sunset",
  ),
  photo(
    "boom-delivery.jpg",
    "PHOTO-2026-05-05-23-12-52+14.jpg",
    "Camión grúa entregando material mientras la cuadrilla trabaja en el techo",
    "Boom truck delivering materials while the crew works on the roof",
  ),
  photo(
    "finished-shingles-eave.jpg",
    "PHOTO-2026-05-05-23-12-52+13.jpg",
    "Tejas nuevas terminadas con un instalador en el alero",
    "New shingles finished, with an installer at the eave",
  ),
  photo(
    "decking-crew.jpg",
    "PHOTO-2026-05-05-23-12-52+3.jpg",
    "Cuadrilla instalando membrana sobre la cubierta nueva",
    "Crew installing underlayment over new decking",
  ),
];
