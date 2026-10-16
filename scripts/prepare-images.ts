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
//   npm run images -- logo <original logo.jpg>
//     Cuts the transparent PNG content/site.ts points at from Sampayo's 976x976 navy/copper logo: the
//     full logo with Philippians 4:13, for the About section. (The header uses the text wordmark.)
//
// Originals never go in the repo: they live in ~/Documents/Clients/sampayo-originals/.
// Relative imports only: runs under tsx, which doesn't resolve the "@/" alias.
import { mkdirSync, statSync } from "node:fs";
import { dirname } from "node:path";
import sharp, { type Sharp } from "sharp";

const PHOTO_LONG_EDGE = 2400;
const JPEG = { quality: 82, mozjpeg: true } as const;

// Crop boxes measured on the 976x976 source: SAMPAYO spans x=80-900, compass "N" starts y=115, the star rule under SAMPAYO
// ends y=620, the verse's last line ("Philippians 4:13") ends y=780.
const LOGO_SOURCE_SIZE = 976;
const LOGO_OUTPUTS = {
  full: { file: "public/images/logo/sampayo-logo-full.png", crop: { left: 50, top: 105, width: 880, height: 690 } },
};
// The house fronts and highlights are the paper's own white, so they key out too: the file is for
// light backgrounds only (the white About section), never navy.
// The paper isn't flat white: it has texture and darker corners. Each pixel is compared with the
// paper around it (brightest value within PAPER_RADIUS, smoothed), so shading doesn't turn into a smudge.
const PAPER_RADIUS = 24;
// Darker than the local paper by less than KEY_START reads as paper texture (transparent); by more than
// KEY_START + KEY_RANGE, fully ink. In between is the anti-aliased edge.
const KEY_START = 14;
const KEY_RANGE = 46;

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

/** One channel, filtered along rows then columns with `step` (a sliding max or mean over 2r+1 pixels). */
function separable(plane: Float32Array, width: number, height: number, r: number, step: (values: number[]) => number) {
  const pass = (src: Float32Array, horizontal: boolean) => {
    const out = new Float32Array(src.length);
    const [outer, inner] = horizontal ? [height, width] : [width, height];
    for (let o = 0; o < outer; o++) {
      for (let i = 0; i < inner; i++) {
        const values: number[] = [];
        for (let k = Math.max(0, i - r); k <= Math.min(inner - 1, i + r); k++) {
          values.push(src[horizontal ? o * width + k : k * width + o]);
        }
        out[horizontal ? o * width + i : i * width + o] = step(values);
      }
    }
    return out;
  };
  return pass(pass(plane, true), false);
}

/**
 * The logo on a transparent background. Alpha comes from how much darker each pixel is than the paper
 * around it; the ink color is then un-mixed from the paper (C = a·F + (1 − a)·P, solved for F) so the
 * edges carry no white halo on any background.
 */
async function keyOutPaper(input: string) {
  const { data, info } = await sharp(input).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width, height } = info;
  const n = width * height;
  const channel = (c: number) => Float32Array.from({ length: n }, (_, i) => data[i * 3 + c]);
  const max = (values: number[]) => Math.max(...values);
  const mean = (values: number[]) => values.reduce((sum, v) => sum + v, 0) / values.length;
  const paper = [0, 1, 2].map((c) => separable(separable(channel(c), width, height, PAPER_RADIUS, max), width, height, PAPER_RADIUS, mean));
  const lum = (r: number, g: number, b: number) => 0.299 * r + 0.587 * g + 0.114 * b;

  const out = Buffer.alloc(n * 4);
  for (let i = 0; i < n; i++) {
    const [r, g, b] = [data[i * 3], data[i * 3 + 1], data[i * 3 + 2]];
    const p = [paper[0][i], paper[1][i], paper[2][i]];
    const alpha = Math.max(0, Math.min(1, (lum(p[0], p[1], p[2]) - lum(r, g, b) - KEY_START) / KEY_RANGE));
    [r, g, b].forEach((value, c) => {
      out[i * 4 + c] = alpha > 0 ? Math.round(Math.max(0, Math.min(255, (value - (1 - alpha) * p[c]) / alpha))) : 0;
    });
    out[i * 4 + 3] = Math.round(alpha * 255);
  }
  return sharp(out, { raw: { width, height, channels: 4 } }).png().toBuffer();
}

async function logo(input: string) {
  const meta = await sharp(input).metadata();
  if (meta.width !== LOGO_SOURCE_SIZE || meta.height !== LOGO_SOURCE_SIZE) {
    throw new Error(`Expected a ${LOGO_SOURCE_SIZE}x${LOGO_SOURCE_SIZE} logo, got ${meta.width}x${meta.height}. Re-measure the crop boxes.`);
  }
  const keyed = await keyOutPaper(input);
  for (const { file, crop } of Object.values(LOGO_OUTPUTS)) {
    ensureDir(file);
    // Never enlarged: the source is 976px, and the site shows these smaller than their crop.
    await sharp(keyed).extract(crop).png({ compressionLevel: 9, palette: false }).toFile(file);
    await report(file);
  }
}

async function main() {
  const [command, ...args] = process.argv.slice(2);
  if (command === "photo" && args.length >= 2) return photo(args[0], args[1], parsePhotoOptions(args.slice(2)));
  if (command === "logo" && args.length === 1) return logo(args[0]);
  console.error("Usage:\n  npm run images -- photo <original> <public/images/name.jpg> [--blur l,t,w,h]... [--crop l,t,w,h] [--min-width N] [--quality N]\n  npm run images -- logo <original logo>");
  process.exitCode = 1;
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
