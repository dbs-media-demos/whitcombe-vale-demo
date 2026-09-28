// One consistent "archival" grade for every photo on the site:
// low saturation, slightly warm highlights, lifted blacks. Output goes to
// src/assets/photos so pages can import them statically (width, height and
// blur placeholder come for free from next/image).
//
//   node scripts/grade.mjs            (reads scripts/raw/*.jpg)
import sharp from "sharp";
import { readdir, mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const rawDir = path.join(root, "scripts/raw");
const outDir = path.join(root, "src/assets/photos");
await mkdir(outDir, { recursive: true });

// A few images are graded fully monochrome for rhythm; the rest keep a whisper of colour.
const MONO = new Set(["portrait-catherine", "portrait-julian", "portrait-sofia", "hands-child", "rings-bw", "elderly-hands", "spiral", "columns", "columns-angle", "contract-bw", "two-talk", "old-keys", "window-light"]);

for (const file of (await readdir(rawDir)).filter((f) => f.endsWith(".jpg"))) {
  const slug = file.replace(/\.jpg$/, "");
  const mono = MONO.has(slug);
  const img = sharp(path.join(rawDir, file))
    .rotate()
    .resize({ width: 2200, height: 2200, fit: "inside", withoutEnlargement: true })
    .modulate({ saturation: mono ? 0 : 0.24 })
    // Warm the highlights a touch (red up, blue down) and lift the blacks for a printed feel.
    .recomb([
      [1.03, 0.02, 0],
      [0.01, 1.0, 0.0],
      [0, 0.03, 0.9],
    ])
    .linear(0.93, 9)
    .jpeg({ quality: 80, mozjpeg: true, progressive: true });
  await img.toFile(path.join(outDir, `${slug}.jpg`));
}

// SOURCES.md (brief requirement: file → source → photographer).
const rows = (await readFile(path.join(root, "scripts/photos.txt"), "utf8"))
  .trim()
  .split("\n")
  .map((l) => l.split("|"));
const md = [
  "# Photo sources",
  "",
  "All photos are from Unsplash under the Unsplash License (free for commercial use, no attribution required; credited here anyway).",
  "Every file is re-graded by `scripts/grade.mjs` and lives in `src/assets/photos/` (statically imported by the pages).",
  "",
  "| File | Source | Photographer |",
  "|---|---|---|",
  ...rows.map(([slug, id, , , user]) => `| ${slug}.jpg | https://unsplash.com/photos/${id} | ${user} |`),
  "",
].join("\n");
await mkdir(path.join(root, "public/images"), { recursive: true });
await writeFile(path.join(root, "public/images/SOURCES.md"), md);
console.log("graded", rows.length);
