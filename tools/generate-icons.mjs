#!/usr/bin/env node
// Regenerates favicon.ico, apple-touch-icon.png, and icon-512.png from the brand mark SVGs.
// Requires `sharp` and `to-ico` — install locally with `npm install sharp to-ico`.
//
// assets/brand-mark.svg / assets/favicon.svg — full detail (used at 44px+: nav, hero, social).
// tools/favicon-simple-16px.svg — a bolder, simplified wedge-wing variant used only for the
// 16px favicon.ico frame, where the full feather detail turns to mush at that size.
import sharp from 'sharp';
import toIco from 'to-ico';
import { writeFileSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const ASSETS = path.join(ROOT, 'assets');

const detailSvg = path.join(ASSETS, 'favicon.svg');
const simpleSvg = path.join(__dirname, 'favicon-simple-16px.svg');

const buf16 = await sharp(simpleSvg, { density: 384 }).resize(16, 16).png().toBuffer();
const buf32 = await sharp(detailSvg, { density: 384 }).resize(32, 32).png().toBuffer();
const buf48 = await sharp(detailSvg, { density: 384 }).resize(48, 48).png().toBuffer();
writeFileSync(path.join(ASSETS, 'favicon.ico'), await toIco([buf16, buf32, buf48]));

await sharp(detailSvg, { density: 384 }).resize(180, 180).flatten({ background: '#07111F' }).png()
  .toFile(path.join(ASSETS, 'apple-touch-icon.png'));
await sharp(detailSvg, { density: 384 }).resize(512, 512).png()
  .toFile(path.join(ASSETS, 'icon-512.png'));

console.log('wrote favicon.ico, apple-touch-icon.png, icon-512.png');
