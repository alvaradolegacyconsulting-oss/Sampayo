// Prepares client photos for public/images/ (docs/UPDATING.md has the steps). Ported from A1 Wrecker.
//
//   npm run images -- photo <original.jpg> <public/images/name.jpg> [options]
//     Long edge resized to 2400px, rotated upright, and every bit of metadata (GPS, camera, date)
//     stripped. Never enlarged unless --min-width asks for it. Options (pixels of the original):
//       --blur left,top,width,height   blur a region (house numbers, plates, other businesses' signs); repeatable
//       --crop left,top,width,height   keep only this box (applied after --blur)
//       --min-width N                  enlarge to N px wide with plain Lanczos + a mild sharpen.
//                                      No AI or generative upscaling: it adds no detail, only size.
//       --quality N                    JPEG quality (default 82); lower it for a photo over ~500 KB
//     docs/PHOTOS.md records the command used for every photo on the site.
//
// Originals never go in the repo: they live in ~/Documents/Clients/sampayo-originals/.
// Relative imports only: runs under tsx, which doesn't resolve the "@/" alias.
import { mkdirSync, statSync } from "node:fs";
import { dirname } from "node:path";
import sharp, { type Sharp } from "sharp";

const PHOTO_LONG_EDGE = 2400;
const JPEG = { quality: 82, mozjpeg: true } as const;

function ensureDir(file: string) {
  mkdirSync(dirname(file), { recursive: true });
}

async function report(file: string) {
  const meta = await sharp(file).metadata();
  const leftovers = ["exif", "xmp", "iptc"].filter((key) => key in meta && meta[key as keyof typeof meta]);
  const kb = Math.round(statSync(file).size / 1024);
  console.log(`${file}: ${meta.width}x${meta.height}, ${kb} KB, metadata ${leftovers.length ? `LEFT: ${leftovers.join(", ")}` : "stripped"}`);
  if (leftovers.length) process.exitCode = 1;
}

type Box = { left: number; top: number; width: number; height: number };
type PhotoOptions = { blur: Box[]; crop: Box | null; minWidth: number | null; quality: number };

const SHARPEN_AFTER_ENLARGE = { sigma: 0.7 } as const; // mild: softens the Lanczos blur, no halos

function parseBox(flag: string, value: string | undefined): Box {
  const numbers = (value ?? "").split(",").map(Number);
  if (numbers.length !== 4 || numbers.some((n) => !Number.isInteger(n) || n < 0)) {
    throw new Error(`${flag} needs left,top,width,height in whole pixels, got "${value}"`);
  }
  const [left, top, width, height] = numbers;
  return { left, top, width, height };
}

function parsePhotoOptions(args: string[]): PhotoOptions {
  const options: PhotoOptions = { blur: [], crop: null, minWidth: null, quality: JPEG.quality };
  for (let i = 0; i < args.length; i += 2) {
    const [flag, value] = [args[i], args[i + 1]];
    if (flag === "--blur") options.blur.push(parseBox(flag, value));
    else if (flag === "--crop") options.crop = parseBox(flag, value);
    else if (flag === "--min-width" && Number.isInteger(Number(value)) && Number(value) > 0) options.minWidth = Number(value);
    else if (flag === "--quality" && Number.isInteger(Number(value)) && Number(value) >= 50 && Number(value) <= 95) {
      options.quality = Number(value);
    }
    else throw new Error(`Unknown or incomplete option "${flag} ${value ?? ""}"`);
  }
  return options;
}

// Strong enough that numbers and letters can't be read back, scaled to the region.
const blurSigma = (box: Box) => Math.max(6, Math.round(Math.min(box.width, box.height) / 3));

async function photo(input: string, output: string, options: PhotoOptions) {
  ensureDir(output);
  // Steps in between stay lossless (PNG) so the JPEG is compressed once, at the end.
  const lossless = (step: Sharp) => step.png({ compressionLevel: 0 }).toBuffer();
  // rotate() bakes in the EXIF orientation, so --blur and --crop boxes match the picture as seen.
  let image = await lossless(sharp(input).rotate());

  if (options.blur.length > 0) {
    const patches = await Promise.all(
      options.blur.map(async (box) => ({
        input: await lossless(sharp(image).extract(box).blur(blurSigma(box))),
        left: box.left,
        top: box.top,
      })),
    );
    image = await lossless(sharp(image).composite(patches));
  }
  if (options.crop) image = await lossless(sharp(image).extract(options.crop));

  const { width = 0 } = await sharp(image).metadata();
  const enlarge = options.minWidth !== null && width < options.minWidth;
  let pipeline = enlarge
    ? sharp(image).resize({ width: options.minWidth ?? undefined, kernel: "lanczos3" }).sharpen(SHARPEN_AFTER_ENLARGE)
    : sharp(image).resize({
        width: PHOTO_LONG_EDGE,
        height: PHOTO_LONG_EDGE,
        fit: "inside",
        withoutEnlargement: true,
        kernel: "lanczos3",
      });
  // sharp drops all metadata unless asked to keep it.
  pipeline = pipeline.jpeg({ ...JPEG, quality: options.quality });
  await pipeline.toFile(output);
  if (enlarge) console.log(`Enlarged from ${width}px wide (Lanczos + mild sharpen; no added detail).`);
  await report(output);
}

async function main() {
  const [command, ...args] = process.argv.slice(2);
  if (command === "photo" && args.length >= 2) return photo(args[0], args[1], parsePhotoOptions(args.slice(2)));
  console.error("Usage:\n  npm run images -- photo <original> <public/images/name.jpg> [--blur l,t,w,h]... [--crop l,t,w,h] [--min-width N] [--quality N]");
  process.exitCode = 1;
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
