/**
 * Renders the stills of the hero scales from the live three.js scene (src/components/fx/scales/scene.ts),
 * so phones and Serbian pages show exactly what the desktop canvas draws on its first frame.
 *
 *   node scripts/render-scales.mjs
 *
 * Needs Playwright with a Chromium (any install: set PLAYWRIGHT=<path to the playwright package> if it
 * isn't resolvable from here). Writes public/images/scales/*.avif and *.webp (both with alpha; WebP is the fallback).
 */
import { createRequire } from "module";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import sharp from "sharp";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const req = createRequire(path.join(ROOT, "package.json"));
const ts = req("typescript");
const { chromium } = req(process.env.PLAYWRIGHT || "playwright");
const OUT = path.join(ROOT, "public/images/scales");

const src = fs.readFileSync(path.join(ROOT, "src/components/fx/scales/scene.ts"), "utf8");
const js = ts.transpileModule(src, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } }).outputText;

// name, render size, framing, then the WebP sizes to write
const shots = [
  { name: "scales", w: 1160, h: 870, view: {}, sizes: [1160, 680], quality: 76, avif: 52 },
  { name: "scales-phone", w: 720, h: 720, view: { dist: 10.4, lookY: 1.5, lookX: -0.3 }, sizes: [400], quality: 72, avif: 56 },
];

const browser = await chromium.launch({
  executablePath: process.env.CHROME || undefined,
  args: ["--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--ignore-gpu-blocklist"],
});
fs.mkdirSync(OUT, { recursive: true });
for (const shot of shots) {
  const page = await browser.newPage({ viewport: { width: shot.w, height: shot.h }, deviceScaleFactor: 1 });
  page.on("pageerror", (e) => console.error(e.message));
  const html = `<!doctype html><html><head><style>html,body{margin:0;background:transparent}canvas{width:${shot.w}px;height:${shot.h}px;display:block}</style>
<script type="importmap">{"imports":{"three":"http://still.local/three.module.js"}}</script></head><body><canvas id=c></canvas>
<script type="module">
import { createScales } from "http://still.local/scene.js";
await createScales(document.getElementById("c"), { still: true, view: ${JSON.stringify(shot.view)} });
window.png = document.getElementById("c").toDataURL("image/png");
</script></body></html>`;
  await page.route("http://still.local/**", (route) => {
    const f = new URL(route.request().url()).pathname.slice(1);
    if (f === "index.html") return route.fulfill({ body: html, contentType: "text/html" });
    if (f === "scene.js") return route.fulfill({ body: js, contentType: "text/javascript" });
    return route.fulfill({ path: path.join(ROOT, "node_modules/three/build", f), contentType: "text/javascript" });
  });
  await page.goto("http://still.local/index.html");
  const png = Buffer.from((await page.waitForFunction(() => window.png, null, { timeout: 120000 }).then((h) => h.jsonValue())).split(",")[1], "base64");
  for (const size of shot.sizes) {
    const base = path.join(OUT, shot.sizes.length > 1 ? `${shot.name}-${size}` : shot.name);
    await sharp(png).resize(size).avif({ quality: shot.avif, effort: 7 }).toFile(`${base}.avif`);
    await sharp(png).resize(size).webp({ quality: shot.quality, alphaQuality: 75, effort: 6, smartSubsample: true }).toFile(`${base}.webp`);
    for (const ext of ["avif", "webp"]) console.log(path.relative(ROOT, `${base}.${ext}`), `${(fs.statSync(`${base}.${ext}`).size / 1024).toFixed(1)} KB`);
  }
  await page.close();
}
await browser.close();
