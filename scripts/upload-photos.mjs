#!/usr/bin/env node
/**
 * Upload a photo series to Qiniu and auto-update photos.ts + portfolio.ts.
 *
 * Usage:
 *   node scripts/upload-photos.mjs <series-dir>
 *
 * Directory name format: YYYYMMDD-标题  (e.g. 20230408-珠海)
 *
 * Directory structure:
 *   20230408-珠海/
 *     cover.jpg      ← required
 *     001.jpg
 *     002.jpg
 *     ...
 *
 * What this script does:
 *   1. Parses directory name → year, title, series ID
 *   2. Reads EXIF from first photo → camera, lens
 *   3. Uploads cover + all photos to Qiniu Kodo
 *   4. Appends new PhotoSeries to src/content/photos.ts
 *   5. Appends new PortfolioItem to src/content/portfolio.ts
 *
 * If the series ID already exists, it re-uploads and updates both files.
 */

import fs from 'fs';
import os from 'os';
import path from 'path';
import { fileURLToPath } from 'url';
import { imageSize } from 'image-size';
import exifr from 'exifr';
import qiniu from 'qiniu';
import sharp from 'sharp';

const MAX_WIDTH = 2400; // px — keeps files well under Qiniu's sync processing limit

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');

// ── Load .env.local ──────────────────────────────────────────────────────────
const envFile = path.join(root, '.env.local');
for (const line of fs.readFileSync(envFile, 'utf8').split('\n')) {
  const [key, ...rest] = line.split('=');
  if (key?.trim() && rest.length) process.env[key.trim()] = rest.join('=').trim();
}

const ACCESS_KEY = process.env.QINIU_ACCESS_KEY;
const SECRET_KEY = process.env.QINIU_SECRET_KEY;
const BUCKET     = process.env.QINIU_BUCKET;
const CDN        = process.env.QINIU_CDN.replace(/\/$/, '');

// Only these extensions get uploaded to Qiniu
const SUPPORTED = new Set(['.jpg', '.jpeg', '.png', '.webp']);

// ── Qiniu setup ──────────────────────────────────────────────────────────────
const mac = new qiniu.auth.digest.Mac(ACCESS_KEY, SECRET_KEY);
const config = new qiniu.conf.Config();
config.zone = qiniu.zone.Zone_as0; // 亚太-新加坡

async function resizeAndUpload(localPath, key) {
  // Resize to MAX_WIDTH if larger, convert to JPEG for consistent output
  const tmpPath = path.join(os.tmpdir(), `qiniu-upload-${Date.now()}-${path.basename(localPath)}`);
  await sharp(localPath)
    .resize({ width: MAX_WIDTH, withoutEnlargement: true })
    .jpeg({ quality: 90, progressive: true })
    .toFile(tmpPath);

  try {
    const putPolicy = new qiniu.rs.PutPolicy({ scope: `${BUCKET}:${key}` });
    const token = putPolicy.uploadToken(mac);
    const formUploader = new qiniu.form_up.FormUploader(config);
    const putExtra = new qiniu.form_up.PutExtra();
    return await new Promise((resolve, reject) => {
      formUploader.putFile(token, key, tmpPath, putExtra, (err, body, info) => {
        if (err || info.statusCode !== 200) {
          reject(err || new Error(`Upload failed: ${JSON.stringify(body)}`));
        } else {
          resolve(`${CDN}/${key}`);
        }
      });
    });
  } finally {
    fs.unlinkSync(tmpPath);
  }
}

// ── Parse directory name ─────────────────────────────────────────────────────
// Expects: YYYYMMDD-标题  or  标题  (date prefix optional)
function parseDirName(name) {
  const dateMatch = name.match(/^(\d{4})(\d{2})(\d{2})[_\-\s](.+)$/);
  if (dateMatch) {
    const [, yyyy, , , title] = dateMatch;
    return { id: name, title, year: parseInt(yyyy) };
  }
  return { id: name, title: name, year: new Date().getFullYear() };
}

// ── Read metadata (EXIF embedded, then XMP sidecar) ─────────────────────────
async function readMeta(filePath) {
  // 1. Try embedded EXIF/XMP in the image file
  try {
    const data = await exifr.parse(filePath, {
      tiff: true, exif: true, xmp: true,
      pick: ['Make', 'Model', 'LensModel'],
    });
    if (data?.Make || data?.Model || data?.LensModel) {
      const camera = [data.Make, data.Model].filter(Boolean).join(' ') || undefined;
      const lens = data.LensModel || undefined;
      return { camera, lens, source: 'exif' };
    }
  } catch { /* fall through */ }

  // 2. Try XMP sidecar (.xmp next to the image)
  const xmpPath = filePath.replace(/\.[^.]+$/, '.xmp');
  if (fs.existsSync(xmpPath)) {
    try {
      const data = await exifr.parse(xmpPath, {
        xmp: true,
        pick: ['Make', 'Model', 'LensModel'],
      });
      if (data) {
        const camera = [data.Make, data.Model].filter(Boolean).join(' ') || undefined;
        const lens = data.LensModel || undefined;
        return { camera, lens, source: 'xmp' };
      }
    } catch { /* fall through */ }
  }

  return {};
}

// ── Update photos.ts ─────────────────────────────────────────────────────────
function updatePhotosTs(series) {
  const filePath = path.join(root, 'src/content/photos.ts');
  let content = fs.readFileSync(filePath, 'utf8');

  const photosLines = series.photos
    .map(p => `      { src: '${p.src}', alt: '${p.alt}', width: ${p.width}, height: ${p.height} },`)
    .join('\n');

  const cameraLine  = series.camera ? `\n    camera: '${series.camera}',` : '';
  const lensLine    = series.lens   ? `\n    lens: '${series.lens}',`     : '';
  const subtitleLine = '';

  const newEntry = `  {
    id: '${series.id}',
    title: '${series.title}',${subtitleLine}
    year: ${series.year},
    location: '${series.location}',${cameraLine}${lensLine}
    cover: '${series.cover}',
    photos: [
${photosLines}
    ],
  },`;

  const existsRe = new RegExp(`id:\\s*'${escapeRe(series.id)}'`);

  if (existsRe.test(content)) {
    // Update existing entry's cover + photos
    content = content.replace(
      new RegExp(`(id:\\s*'${escapeRe(series.id)}'[\\s\\S]*?cover:\\s*')[^']+'`),
      `$1${series.cover}'`
    );
    content = content.replace(
      new RegExp(`(id:\\s*'${escapeRe(series.id)}'[\\s\\S]*?photos:\\s*)\\[[\\s\\S]*?\\](\\s*,?\\s*\\})`),
      `$1[\n${photosLines}\n    ]$2`
    );
    console.log(`✓ Updated existing series '${series.id}' in photos.ts`);
  } else {
    // Append before closing ] as const satisfies
    content = content.replace(
      /(\] as const satisfies PhotoSeries\[\];)/,
      `${newEntry}\n$1`
    );
    console.log(`✓ Added new series '${series.id}' to photos.ts`);
  }

  fs.writeFileSync(filePath, content, 'utf8');
}

// ── Update portfolio.ts ──────────────────────────────────────────────────────
function updatePortfolioTs(series) {
  const filePath = path.join(root, 'src/content/portfolio.ts');
  let content = fs.readFileSync(filePath, 'utf8');

  const existsRe = new RegExp(`id:\\s*'ph-${escapeRe(series.id)}'`);
  if (existsRe.test(content)) {
    console.log(`✓ Portfolio entry for '${series.id}' already exists — skipped`);
    return;
  }

  const meta = [series.camera, `${series.photos.length} 张`].filter(Boolean).join(' · ');
  const newEntry = `  { id: 'ph-${series.id}', tag: '摄影', title: '${series.title}', subtitle: '', year: '${series.year}', desc: '${series.title}。', meta: '${meta}', accent: 'plain', href: '/photos/${series.id}', cover: '${series.cover}' },`;

  content = content.replace(
    /(\];\s*$)/m,
    `${newEntry}\n$1`
  );

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`✓ Added portfolio entry for '${series.id}'`);
}

function escapeRe(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// ── Main ─────────────────────────────────────────────────────────────────────
async function main() {
  const seriesDir = path.resolve(process.argv[2] ?? '');
  if (!seriesDir || !fs.statSync(seriesDir).isDirectory()) {
    console.error('Usage: node scripts/upload-photos.mjs <series-dir>');
    process.exit(1);
  }

  const dirName = path.basename(seriesDir);
  const { id, title, year } = parseDirName(dirName);
  const location = title; // title is the location for photo series

  console.log(`\n→ Series:   ${title}  (${year})`);
  console.log(`→ ID:       ${id}`);
  console.log(`→ Bucket:   ${BUCKET}`);
  console.log(`→ CDN:      ${CDN}\n`);

  const allFiles = fs.readdirSync(seriesDir)
    .filter(f => SUPPORTED.has(path.extname(f).toLowerCase()))
    .sort();

  const coverName = allFiles.find(f => path.parse(f).name === 'cover') ?? allFiles[0];
  const photoFiles = allFiles.filter(f => path.parse(f).name !== 'cover');

  if (!coverName) {
    console.error('No images found in directory');
    process.exit(1);
  }

  console.log(`Found ${photoFiles.length} photos + cover\n`);

  // Read metadata from first photo (EXIF embedded → XMP sidecar)
  const firstPhoto = path.join(seriesDir, photoFiles[0] ?? coverName);
  const { camera, lens, source } = await readMeta(firstPhoto);
  if (camera) console.log(`Camera: ${camera}${lens ? ` / ${lens}` : ''}  (from ${source})\n`);

  // Upload cover
  const folder = `photos/${year}/${id}`;
  const coverExt = path.extname(coverName);
  const coverKey = `${folder}/cover${coverExt}`;
  process.stdout.write('Uploading cover... ');
  const coverUrl = await resizeAndUpload(path.join(seriesDir, coverName), coverKey);
  console.log('✓');

  // Upload photos
  const photos = [];
  for (const file of photoFiles) {
    const key = `${folder}/${file}`;
    process.stdout.write(`Uploading ${file}... `);
    const url = await resizeAndUpload(path.join(seriesDir, file), key);
    // Read dimensions after resize (sharp resizes proportionally)
    const { width, height } = imageSize(fs.readFileSync(path.join(seriesDir, file)));
    const stem = path.parse(file).name;
    photos.push({ src: url, alt: `${title} ${stem}`, width, height });
    console.log(`✓ ${width}×${height}`);
  }

  console.log(`\n✅ Upload complete — ${photos.length} photos\n`);

  const series = { id, title, year, location, camera, lens, cover: coverUrl, photos };

  updatePhotosTs(series);
  updatePortfolioTs(series);

  // Delete all local files (images + XMP sidecars + any other files)
  for (const file of fs.readdirSync(seriesDir)) {
    fs.unlinkSync(path.join(seriesDir, file));
  }
  fs.rmdirSync(seriesDir);
  console.log(`✓ Deleted local directory: ${path.basename(seriesDir)}`);

  console.log('\n🎉 Done! Run `pnpm dev` to preview.\n');
}

main().catch(err => { console.error(err); process.exit(1); });
