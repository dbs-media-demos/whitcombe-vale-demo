/**
 * Renders the hero scales as separate layers for /v2, the homepage without 3D: the light on the wall,
 * the moving parts' shadow, the stand, the beam and each pan, all from the live three.js scene
 * (src/components/fx/scales/scene.ts) and its desktop camera. HeroScales2D stacks them and swings the
 * beam and pans with CSS transforms, so the balance moves without a byte of three.js.
 *
 *   PLAYWRIGHT=<path to the playwright package> node scripts/render-scales-layers.mjs
 *
 * Writes public/images/scales/layers/*.avif + *.webp (cropped, with alpha) and
 * src/components/home/scales-layers.json (where each layer sits and the pivots, in % of the frame).
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
const OUT = path.join(ROOT, "public/images/scales/layers");
const W = 1160;
const H = 870;
const INK = [0x0f, 0x2a, 0x22];

const src = fs.readFileSync(path.join(ROOT, "src/components/fx/scales/scene.ts"), "utf8");
const js = ts.transpileModule(src, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } }).outputText;

const html = `<!doctype html><html><head><style>html,body{margin:0;background:transparent}canvas{width:${W}px;height:${H}px;display:block}</style>
<script type="importmap">{"imports":{"three":"http://still.local/three.module.js"}}</script></head><body><canvas id=c></canvas>
<script type="module">
import * as THREE from "three";
import { createScales } from "http://still.local/scene.js";
const c = document.getElementById("c");
const sc = await createScales(c, { still: true });
const { renderer, scene, camera, balance, beam, pans, pin, wall, floor, key, PIVOT_Y, ARM } = sc.parts;
const ghost = new THREE.MeshBasicMaterial({ colorWrite: false, depthWrite: false });
const meshes = (o) => { const out = []; o.traverse((m) => m.isMesh && out.push(m)); return out; };
const groups = {
  stand: balance.children.filter((m) => m.isMesh && m !== pin),
  beam: [...beam.children.filter((m) => m.isMesh), pin],
  pan0: meshes(pans[0]),
  pan1: meshes(pans[1]),
  catch: [wall, floor],
};
for (const g of Object.values(groups)) for (const m of g) { m.userData.mat = m.material; m.userData.cast = m.castShadow; }
// show: drawn; ghost: casts its shadow but isn't drawn; off: neither
const set = (modes) => {
  for (const [name, g] of Object.entries(groups)) {
    const mode = modes[name] || "off";
    for (const m of g) {
      m.visible = mode !== "off";
      m.material = mode === "ghost" ? ghost : m.userData.mat;
      m.castShadow = m.userData.cast;
    }
  }
};
const shot = (modes) => { set(modes); renderer.render(scene, camera); return c.toDataURL("image/png"); };
const out = {};
out.wallA = shot({ catch: "show", stand: "ghost" });
out.wallB = shot({ catch: "show", stand: "ghost", beam: "ghost", pan0: "ghost", pan1: "ghost" });
out.stand = shot({ stand: "show" });
out.beam = shot({ beam: "show", stand: "ghost", pan0: "ghost", pan1: "ghost" });
out.pan0 = shot({ pan0: "show", stand: "ghost", beam: "ghost", pan1: "ghost" });
out.pan1 = shot({ pan1: "show", stand: "ghost", beam: "ghost", pan0: "ghost" });

// Pivots on screen, in px of the frame
camera.updateMatrixWorld();
const px = (v) => { const p = v.clone().project(camera); return [(p.x + 1) / 2 * ${W}, (1 - p.y) / 2 * ${H}]; };
const pivot = new THREE.Vector3(0, PIVOT_Y, 0);
const hang = (side) => new THREE.Vector3(side * ARM, PIVOT_Y - 0.092, 0);
// The shadow's pivot: the pivot seen from the key light, on the wall (z = -1.5)
const L = key.position.clone();
const dir = pivot.clone().sub(L);
const shadowPivot = L.clone().add(dir.multiplyScalar((-1.5 - L.z) / dir.z));
// How far the beam turns on screen for a turn in the scene (yaw and perspective)
const end = (th) => px(new THREE.Vector3(Math.cos(th) * ARM, PIVOT_Y + Math.sin(th) * ARM, 0));
const p0 = px(pivot), e0 = end(0), e1 = end(0.05);
const ang = (e) => Math.atan2(-(e[1] - p0[1]), e[0] - p0[0]);
out.meta = { pivot: p0, hang0: px(hang(-1)), hang1: px(hang(1)), shadowPivot: px(shadowPivot), gain: (ang(e1) - ang(e0)) / 0.05 };
window.out = out;
</script></body></html>`;

const browser = await chromium.launch({ channel: process.env.CHROME ? undefined : "chrome", executablePath: process.env.CHROME || undefined, headless: true });
const page = await browser.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: 1 });
page.on("pageerror", (e) => console.error(e.message));
await page.route("http://still.local/**", (route) => {
  const f = new URL(route.request().url()).pathname.slice(1);
  if (f === "index.html") return route.fulfill({ body: html, contentType: "text/html" });
  if (f === "scene.js") return route.fulfill({ body: js, contentType: "text/javascript" });
  return route.fulfill({ path: path.join(ROOT, "node_modules/three/build", f), contentType: "text/javascript" });
});
await page.goto("http://still.local/index.html");
const out = await page.waitForFunction(() => window.out, null, { timeout: 180000 }).then((h) => h.jsonValue());
await browser.close();

const raw = async (url) => sharp(Buffer.from(url.split(",")[1], "base64")).ensureAlpha().raw().toBuffer();
const layers = {};
for (const k of ["wallA", "wallB", "stand", "beam", "pan0", "pan1"]) layers[k] = await raw(out[k]);

// The moving parts' shadow: the light they take off the wall, as ink laid over it
const A = layers.wallA;
const B = layers.wallB;
const shadow = Buffer.alloc(W * H * 4);
for (let i = 0; i < W * H; i++) {
  const a = A[i * 4 + 3];
  const d = Math.max(0, a - B[i * 4 + 3]);
  shadow[i * 4] = INK[0];
  shadow[i * 4 + 1] = INK[1];
  shadow[i * 4 + 2] = INK[2];
  shadow[i * 4 + 3] = a > 0 ? Math.min(255, Math.round((d / a) * 255 * Math.min(1, a / 6))) : 0;
}

const files = { wall: A, shadow, stand: layers.stand, beam: layers.beam, pan0: layers.pan0, pan1: layers.pan1 };
fs.mkdirSync(OUT, { recursive: true });
const pct = (x, total) => +((x / total) * 100).toFixed(3);
const json = { frame: [W, H], layers: {} };
let total = 0;
for (const [name, buf] of Object.entries(files)) {
  // Crop to what's drawn, plus a little air
  let x0 = W, y0 = H, x1 = 0, y1 = 0;
  for (let y = 0; y < H; y++)
    for (let x = 0; x < W; x++)
      if (buf[(y * W + x) * 4 + 3] > 1) {
        if (x < x0) x0 = x;
        if (x > x1) x1 = x;
        if (y < y0) y0 = y;
        if (y > y1) y1 = y;
      }
  x0 = Math.max(0, x0 - 4);
  y0 = Math.max(0, y0 - 4);
  x1 = Math.min(W - 1, x1 + 4);
  y1 = Math.min(H - 1, y1 + 4);
  const w = x1 - x0 + 1;
  const h = y1 - y0 + 1;
  const img = sharp(buf, { raw: { width: W, height: H, channels: 4 } }).extract({ left: x0, top: y0, width: w, height: h });
  const base = path.join(OUT, name);
  const soft = name === "wall" || name === "shadow";
  await img.clone().avif({ quality: soft ? 40 : 56, effort: 7 }).toFile(`${base}.avif`);
  await img.clone().webp({ quality: soft ? 60 : 78, alphaQuality: soft ? 60 : 80, effort: 6, smartSubsample: true }).toFile(`${base}.webp`);
  const kb = fs.statSync(`${base}.avif`).size / 1024;
  total += kb;
  console.log(name, `${w}x${h}`, `${kb.toFixed(1)} KB avif`, `${(fs.statSync(`${base}.webp`).size / 1024).toFixed(1)} KB webp`);
  json.layers[name] = { left: pct(x0, W), top: pct(y0, H), width: pct(w, W), height: pct(h, H), w, h };
}
const m = out.meta;
const P = (p) => [pct(p[0], W), pct(p[1], H)];
json.pivot = P(m.pivot);
json.hang = [P(m.hang0), P(m.hang1)];
json.shadowPivot = P(m.shadowPivot);
json.gain = +m.gain.toFixed(4);
fs.writeFileSync(path.join(ROOT, "src/components/home/scales-layers.json"), JSON.stringify(json, null, 2) + "\n");
console.log("total avif", total.toFixed(1), "KB", json);
