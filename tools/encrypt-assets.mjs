#!/usr/bin/env node
// Encrypts the private assets (photos + CV PDFs) so the published site ships only ciphertext.
//
// Why encryption rather than a JavaScript password check: this is a static site with no
// backend, so any "if (input === password)" check has the password sitting in the source, and
// obfuscating it doesn't help — a breakpoint reveals it at runtime. Here the password never
// appears anywhere in the repo. It's fed in via env var at build time, used to derive a key,
// and the browser re-derives that same key from whatever the visitor types. A wrong key fails
// the AES-GCM authentication tag, so it can't reveal partial or garbled plaintext.
//
// Usage:
//   PORTFOLIO_KEY='...' node tools/encrypt-assets.mjs
//
// Output: assets/private/<name>.enc  — layout: salt(16) ‖ iv(12) ‖ ciphertext ‖ authTag(16)
//         assets/private/manifest.json — logical name → { file, type }
//
// Must stay in sync with js/unlock.js (same KDF, iteration count, and byte layout).
import { webcrypto as crypto } from 'node:crypto';
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const OUT = path.join(ROOT, 'assets', 'private');

// Shared with js/unlock.js — changing either side alone breaks decryption.
export const KDF = { iterations: 600000, hash: 'SHA-256', saltBytes: 16, ivBytes: 12 };

const password = process.env.PORTFOLIO_KEY;
if (!password) {
  console.error("Set PORTFOLIO_KEY, e.g.  PORTFOLIO_KEY='...' node tools/encrypt-assets.mjs");
  process.exit(1);
}

// Logical name → source file (relative to repo root) + MIME type the browser should get back.
// Keys are deliberately generic (asset-1, asset-2, ...) rather than "photo-hiking" etc. —
// manifest.json is a plain fetchable file, and descriptive keys would tell a visitor exactly
// what's hidden even though the content itself stays encrypted. See the comment above each
// <img data-private="..."> in index.html for which asset-N is which.
// `alt` is the real accessible description, restored on the <img> only after a successful
// decrypt (see js/unlock.js). It deliberately lives here, not in index.html — manifest.json
// is only fetched once someone actually opens the unlock form and submits a key (see
// loadManifest() in js/unlock.js), never on a plain page load, so this keeps the description
// out of View Source, the easiest way anyone would casually discover a photo exists.
const assets = {
  'asset-1': { src: 'assets/photos/profile.jpg', type: 'image/jpeg', alt: 'Portrait of Ursila Pradeep Vadakkumpuram' },
  'asset-2': { src: 'assets/photos/profile-400.jpg', type: 'image/jpeg', alt: 'Portrait of Ursila Pradeep Vadakkumpuram' },
  'asset-3': { src: 'assets/photos/hiking-600.jpg', type: 'image/jpeg', alt: 'Ursila hiking a mountain trail, with a snow-capped peak in the background' },
  'asset-4': { src: 'assets/photos/animals-600.jpg', type: 'image/jpeg', alt: 'Ursila feeding deer at an animal park' },
  'asset-5': { src: 'assets/photos/travel-600.jpg', type: 'image/jpeg', alt: 'Ursila standing above coastal cliffs overlooking the ocean' },
  'asset-6': { src: 'assets/photos/reading-600.jpg', type: 'image/jpeg', alt: 'Illustrated cover art for two books: Ikigai, and Men Are From Mars, Women Are From Venus' },
  'asset-7': {
    src: 'assets/cv/Ursila_Pradeep_Vadakkumpuram_CV_EN.pdf',
    type: 'application/pdf',
    download: 'Ursila_Pradeep_Vadakkumpuram_CV_EN.pdf', // only set on the <a> after unlock
  },
  'asset-8': {
    src: 'assets/cv/Ursila_Pradeep_Vadakkumpuram_Lebenslauf_DE.pdf',
    type: 'application/pdf',
    download: 'Ursila_Pradeep_Vadakkumpuram_Lebenslauf_DE.pdf',
  },
};

mkdirSync(OUT, { recursive: true });

async function deriveKey(salt) {
  const material = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(password),
    'PBKDF2',
    false,
    ['deriveKey']
  );
  return crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt, iterations: KDF.iterations, hash: KDF.hash },
    material,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt']
  );
}

const manifest = {};

for (const [name, meta] of Object.entries(assets)) {
  const srcPath = path.join(ROOT, meta.src);
  if (!existsSync(srcPath)) {
    console.error(`missing source: ${meta.src}`);
    process.exit(1);
  }
  const plaintext = readFileSync(srcPath);

  // Fresh salt and IV per file: reusing an AES-GCM IV across files under one key is a
  // real break, and a per-file salt means the derived keys differ too.
  const salt = crypto.getRandomValues(new Uint8Array(KDF.saltBytes));
  const iv = crypto.getRandomValues(new Uint8Array(KDF.ivBytes));
  const key = await deriveKey(salt);
  const ciphertext = new Uint8Array(
    await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, plaintext)
  );

  const blob = Buffer.concat([Buffer.from(salt), Buffer.from(iv), Buffer.from(ciphertext)]);
  writeFileSync(path.join(OUT, `${name}.enc`), blob);

  manifest[name] = { file: `${name}.enc`, type: meta.type };
  if (meta.download) manifest[name].download = meta.download;
  if (meta.alt) manifest[name].alt = meta.alt;

  console.log(`${name}.enc  ${(blob.length / 1024).toFixed(0)}KB  (from ${meta.src})`);
}

writeFileSync(
  path.join(OUT, 'manifest.json'),
  JSON.stringify({ kdf: KDF, assets: manifest }, null, 2) + '\n'
);
console.log(`\nwrote manifest.json with ${Object.keys(manifest).length} entries`);
console.log('Reminder: delete the plaintext assets/photos/* and assets/cv/*.pdf before committing.');
