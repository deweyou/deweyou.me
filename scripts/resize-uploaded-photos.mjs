#!/usr/bin/env node
/**
 * Batch-resize photos already uploaded to Qiniu Kodo using pfop (persistent fop).
 * Overwrites each original file with a resized version (max 2400px wide, JPEG q90).
 * No local files needed — everything happens on the Qiniu side.
 *
 * Usage:
 *   node scripts/resize-uploaded-photos.mjs [--dry-run]
 *
 * --dry-run  Print what would be processed without calling the API.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import qiniu from 'qiniu';

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

const DRY_RUN = process.argv.includes('--dry-run');

// ── Extract all CDN URLs from photos.ts ──────────────────────────────────────
function extractKeys() {
  const photosTs = fs.readFileSync(path.join(root, 'src/content/photos.ts'), 'utf8');
  const urlRe = new RegExp(`${escapeRe(CDN)}/([^']+)`, 'g');
  const keys = new Set();
  let m;
  while ((m = urlRe.exec(photosTs)) !== null) {
    keys.add(m[1]); // everything after CDN/
  }
  return [...keys];
}

function escapeRe(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// ── Qiniu pfop ───────────────────────────────────────────────────────────────
const mac = new qiniu.auth.digest.Mac(ACCESS_KEY, SECRET_KEY);
const config = new qiniu.conf.Config();
config.zone = qiniu.zone.Zone_as0;
const operationManager = new qiniu.fop.OperationManager(mac, config);

function encodedEntry(bucket, key) {
  return Buffer.from(`${bucket}:${key}`).toString('base64url');
}

async function pfopResize(key) {
  // Resize to max 2400px wide, save as JPEG q90, overwrite original key
  const fop = `imageView2/2/w/2400/q/90/format/jpg|saveas/${encodedEntry(BUCKET, key)}`;
  return new Promise((resolve, reject) => {
    operationManager.pfop(BUCKET, key, [fop], null, { force: true }, (err, body, info) => {
      if (err) return reject(err);
      if (info.statusCode !== 200) return reject(new Error(`pfop failed (${info.statusCode}): ${JSON.stringify(body)}`));
      resolve(body.persistentId);
    });
  });
}

// Poll pfop status until done
// Top-level code: 0=pending, 1=waiting, 2=processing, 3=success, 4=failed
async function waitForPfop(persistentId) {
  const statusUrl = `https://api.qiniu.com/status/get/prefop?id=${persistentId}`;
  for (let i = 0; i < 90; i++) {
    await new Promise(r => setTimeout(r, 2000));
    let data;
    try {
      const res = await fetch(statusUrl);
      data = await res.json();
    } catch { continue; } // transient network error — retry
    if (data.code === 3) return 'done';
    if (data.code === 4) throw new Error(`pfop failed: ${JSON.stringify(data)}`);
    // codes 0/1/2 = still processing — keep polling
  }
  throw new Error('pfop timed out');
}

// ── Main ─────────────────────────────────────────────────────────────────────
async function main() {
  const keys = extractKeys();
  console.log(`\nFound ${keys.length} files in photos.ts\n`);

  if (DRY_RUN) {
    keys.forEach(k => console.log(`  ${k}`));
    console.log('\n(dry run — no API calls made)\n');
    return;
  }

  let ok = 0, fail = 0;
  for (const key of keys) {
    process.stdout.write(`  ${key} ... `);
    try {
      const pid = await pfopResize(key);
      await waitForPfop(pid);
      console.log('✓');
      ok++;
    } catch (e) {
      console.log(`✗  ${e.message}`);
      fail++;
    }
  }

  console.log(`\n✅ Done — ${ok} resized, ${fail} failed\n`);
}

main().catch(err => { console.error(err); process.exit(1); });
