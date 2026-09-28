// Builds apple-icon.png (180) and favicon.ico (16/32/48 PNG-in-ICO) from src/app/icon.svg.
import sharp from "sharp";
import { readFile, writeFile } from "node:fs/promises";
const svg = await readFile("src/app/icon.svg");
await sharp(svg, { density: 600 }).resize(180, 180).png().toFile("src/app/apple-icon.png");
await sharp(svg, { density: 600 }).resize(512, 512).png().toFile("public/icon-512.png");
await sharp(svg, { density: 600 }).resize(192, 192).png().toFile("public/icon-192.png");
const sizes = [16, 32, 48];
const pngs = await Promise.all(sizes.map((s) => sharp(svg, { density: 300 }).resize(s, s).png().toBuffer()));
const header = Buffer.alloc(6);
header.writeUInt16LE(0, 0); header.writeUInt16LE(1, 2); header.writeUInt16LE(sizes.length, 4);
let offset = 6 + 16 * sizes.length;
const dirs = pngs.map((png, i) => {
  const d = Buffer.alloc(16);
  d.writeUInt8(sizes[i] % 256, 0); d.writeUInt8(sizes[i] % 256, 1); d.writeUInt8(0, 2); d.writeUInt8(0, 3);
  d.writeUInt16LE(1, 4); d.writeUInt16LE(32, 6); d.writeUInt32LE(png.length, 8); d.writeUInt32LE(offset, 12);
  offset += png.length; return d;
});
await writeFile("src/app/favicon.ico", Buffer.concat([header, ...dirs, ...pngs]));
console.log("icons ok");
