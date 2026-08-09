#!/usr/bin/env node
// Renders cv.html and cv-de.html to PDF via headless Chromium's native print-to-PDF, so the
// output is real, selectable, ATS-parseable text — not a screenshot or a rasterized image.
//
// Requires `playwright-core` (not committed — install locally: `npm install playwright-core`)
// and a Chromium binary. Pass its path as CHROMIUM_PATH, e.g.:
//   CHROMIUM_PATH=/opt/pw-browsers/chromium-1194/chrome-linux/chrome node tools/build-cv-pdf.mjs
import { chromium } from 'playwright-core';
import path from 'path';
import { fileURLToPath } from 'url';
import { mkdirSync } from 'fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const OUT_DIR = path.join(ROOT, 'assets', 'cv');
mkdirSync(OUT_DIR, { recursive: true });

const executablePath = process.env.CHROMIUM_PATH;
if (!executablePath) {
  console.error('Set CHROMIUM_PATH to a Chromium executable, e.g.:');
  console.error('  CHROMIUM_PATH=/opt/pw-browsers/chromium-1194/chrome-linux/chrome node tools/build-cv-pdf.mjs');
  process.exit(1);
}

const jobs = [
  { src: 'cv.html', out: 'Ursila_Pradeep_Vadakkumpuram_CV_EN.pdf' },
  { src: 'cv-de.html', out: 'Ursila_Pradeep_Vadakkumpuram_Lebenslauf_DE.pdf' },
];

const browser = await chromium.launch({ executablePath });
const page = await browser.newPage();

for (const job of jobs) {
  const srcPath = path.join(ROOT, job.src);
  await page.goto('file://' + srcPath, { waitUntil: 'networkidle' });
  const outPath = path.join(OUT_DIR, job.out);
  await page.pdf({
    path: outPath,
    format: 'A4',
    printBackground: true,
    margin: { top: '0', bottom: '0', left: '0', right: '0' },
  });
  console.log('wrote', path.relative(ROOT, outPath));
}

await browser.close();
