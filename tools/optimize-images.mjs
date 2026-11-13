#!/usr/bin/env node
// Resizes and re-encodes source photos, stripping ALL metadata (including GPS EXIF).
// Requires `sharp` — install locally with `npm install sharp` before running (sharp is not
// committed to the repo; see package.json "optionalDependencies" / README for setup).
//
// Raw source photos aren't committed to the repo either (they're multi-MB phone originals —
// see README "Regenerating assets"). Point SOURCE_DIR at a local folder containing them:
//   SOURCE_DIR=/path/to/your/photos node tools/optimize-images.mjs
import sharp from 'sharp';
import { mkdirSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const SRC = process.env.SOURCE_DIR || path.join(ROOT, 'images');
const OUT = path.join(ROOT, 'assets', 'photos');

mkdirSync(OUT, { recursive: true });

// [sourceFile, outBaseName, {width, height, fit, crop?}]
// `crop` (left/top/width/height, in source pixels post-EXIF-rotation) takes an explicit
// rectangle instead of letting sharp's saliency detector ('attention') guess one — needed for
// hiking.heic and animal_lover.jpg, where auto-detection picked the mountain peak / her face
// as the "most interesting" region and cropped the actual subject (her, the deer) out of frame.
const jobs = [
  ['Profile_pic.jpg', 'profile', { width: 800, height: 800, fit: 'cover' }],
  ['Hiking.heic', 'hiking', { width: 1000, height: 750, fit: 'cover', crop: { left: 0, top: 1483, width: 2252, height: 1689 } }],
  ['Animal_lover.jpg', 'animals', { width: 1000, height: 750, fit: 'cover', crop: { left: 0, top: 1300, width: 1848, height: 1386 } }],
  ['Travel2.jpg', 'travel', { width: 1000, height: 750, fit: 'cover' }],
];

const sizes = {
  profile: [{ suffix: '', w: 800 }, { suffix: '-400', w: 400 }],
  default: [{ suffix: '', w: 1000 }, { suffix: '-600', w: 600 }],
};

let totalBytes = 0;

for (const [srcFile, base, opts] of jobs) {
  const srcPath = path.join(SRC, srcFile);
  const variants = sizes[base] || sizes.default;
  for (const v of variants) {
    const scale = v.w / opts.width;
    const h = Math.round(opts.height * scale);
    const pipeline = () => {
      let img = sharp(srcPath, { failOn: 'none' }).rotate(); // apply EXIF orientation, then...
      if (opts.crop) img = img.extract(opts.crop);
      return img.resize({ width: v.w, height: h, fit: opts.fit, position: 'attention' });
    };
    // toBuffer() output from sharp carries NO metadata unless .withMetadata() is called,
    // so this also strips all EXIF/GPS by default.
    const webpPath = path.join(OUT, `${base}${v.suffix}.webp`);
    const jpgPath = path.join(OUT, `${base}${v.suffix}.jpg`);
    const webpInfo = await pipeline().webp({ quality: 78 }).toFile(webpPath);
    const jpgInfo = await pipeline().jpeg({ quality: 76, mozjpeg: true }).toFile(jpgPath);
    totalBytes += webpInfo.size;
    console.log(
      `${base}${v.suffix}: ${webpInfo.width}x${webpInfo.height}  webp ${(webpInfo.size / 1024).toFixed(0)}KB  jpg ${(jpgInfo.size / 1024).toFixed(0)}KB`
    );
  }
}

console.log(`\nTotal (webp, largest variants only counted once per job): ~${(totalBytes / 1024).toFixed(0)}KB`);
console.log('Run a metadata check afterward, e.g.:');
console.log('  node -e "require(\'sharp\')(\'assets/photos/profile.jpg\').metadata().then(m=>console.log(m.exif?\'EXIF PRESENT\':\'clean\'))"');
