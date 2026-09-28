import sharp from "sharp";
import { readdir } from "node:fs/promises";
const dir = process.argv[2], out = process.argv[3];
const files = (await readdir(dir)).filter(f=>f.endsWith(".jpg"));
const W=240,H=170,cols=8; const rows=Math.ceil(files.length/cols);
const comps = await Promise.all(files.map(async (f,i)=>{
  const buf = await sharp(`${dir}/${f}`).resize(W,H-18,{fit:"cover"}).toBuffer();
  const label = Buffer.from(`<svg width="${W}" height="18"><rect width="100%" height="100%" fill="#000"/><text x="3" y="13" font-size="12" fill="#ff0" font-family="sans-serif">${f.replace('.jpg','')}</text></svg>`);
  const tile = await sharp({create:{width:W,height:H,channels:3,background:"#000"}}).composite([{input:label,top:0,left:0},{input:buf,top:18,left:0}]).png().toBuffer();
  return {input:tile, top:Math.floor(i/cols)*H, left:(i%cols)*W};
}));
await sharp({create:{width:W*cols,height:H*rows,channels:3,background:"#111"}}).composite(comps).jpeg({quality:75}).toFile(out);
