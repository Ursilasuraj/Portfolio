#!/usr/bin/env node
// Regenerates favicon.ico, apple-touch-icon.png, and icon-512.png from assets/favicon.svg.
// Requires `sharp` and `to-ico` — install locally with `npm install sharp to-ico`.
//
// The mark (a serif "U") is a single transparent-background SVG used at every size — unlike
// the earlier winged version, this letterform holds its shape fine down to 16px, so there's
// no separate simplified favicon variant to maintain.
import sharp from 'sharp';
import toIco from 'to-ico';
import { writeFileSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const ASSETS = path.join(ROOT, 'assets');
const svg = path.join(ASSETS, 'favicon.svg');

const buf16 = await sharp(svg, { density: 384 }).resize(16, 16).png().toBuffer();
const buf32 = await sharp(svg, { density: 384 }).resize(32, 32).png().toBuffer();
const buf48 = await sharp(svg, { density: 384 }).resize(48, 48).png().toBuffer();
writeFileSync(path.join(ASSETS, 'favicon.ico'), await toIco([buf16, buf32, buf48]));

// apple-touch-icon can't be transparent (iOS composites onto black), so flatten onto the
// site's dark navy — the gold mark reads clearly against it.
await sharp(svg, { density: 384 }).resize(180, 180).flatten({ background: '#07111F' }).png()
  .toFile(path.join(ASSETS, 'apple-touch-icon.png'));
await sharp(svg, { density: 384 }).resize(512, 512).png()
  .toFile(path.join(ASSETS, 'icon-512.png'));

console.log('wrote favicon.ico, apple-touch-icon.png, icon-512.png');
