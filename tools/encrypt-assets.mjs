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

// logical name → source file (relative to repo root) + MIME type the browser should get back
const assets = {
  'photo-profile': { src: 'assets/photos/profile.jpg', type: 'image/jpeg' },
  'photo-profile-400': { src: 'assets/photos/profile-400.jpg', type: 'image/jpeg' },
  'photo-hiking': { src: 'assets/photos/hiking-600.jpg', type: 'image/jpeg' },
  'photo-animals': { src: 'assets/photos/animals-600.jpg', type: 'image/jpeg' },
  'photo-travel': { src: 'assets/photos/travel-600.jpg', type: 'image/jpeg' },
  'photo-reading': { src: 'assets/photos/reading-600.jpg', type: 'image/jpeg' },
  'cv-en': {
    src: 'assets/cv/Ursila_Pradeep_Vadakkumpuram_CV_EN.pdf',
    type: 'application/pdf',
    download: 'Ursila_Pradeep_Vadakkumpuram_CV_EN.pdf',
  },
  'cv-de': {
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

  console.log(`${name}.enc  ${(blob.length / 1024).toFixed(0)}KB  (from ${meta.src})`);
}

writeFileSync(
  path.join(OUT, 'manifest.json'),
  JSON.stringify({ kdf: KDF, assets: manifest }, null, 2) + '\n'
);
console.log(`\nwrote manifest.json with ${Object.keys(manifest).length} entries`);
console.log('Reminder: delete the plaintext assets/photos/* and assets/cv/*.pdf before committing.');
