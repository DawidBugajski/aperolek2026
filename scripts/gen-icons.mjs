import sharp from "sharp";
import { readFileSync, mkdirSync } from "node:fs";

const svg = readFileSync("src/app/icon.svg");
mkdirSync("public/icons", { recursive: true });

await sharp(svg, { density: 384 }).resize(192, 192).png().toFile("public/icons/icon-192.png");
await sharp(svg, { density: 512 }).resize(512, 512).png().toFile("public/icons/icon-512.png");

// Maskable: full-bleed terracotta background, icon in ~80% safe zone
const innerMask = await sharp(svg, { density: 512 }).resize(410, 410).png().toBuffer();
await sharp({ create: { width: 512, height: 512, channels: 4, background: "#bf5a34" } })
  .composite([{ input: innerMask, gravity: "center" }])
  .png()
  .toFile("public/icons/icon-maskable-512.png");

// Apple touch icon: solid background (iOS dislikes transparency), 180x180
const innerApple = await sharp(svg, { density: 256 }).resize(150, 150).png().toBuffer();
await sharp({ create: { width: 180, height: 180, channels: 4, background: "#bf5a34" } })
  .composite([{ input: innerApple, gravity: "center" }])
  .png()
  .toFile("src/app/apple-icon.png");

console.log("icons generated");
