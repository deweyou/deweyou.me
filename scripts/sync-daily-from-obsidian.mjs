#!/usr/bin/env node

import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '..');
const sourceRoot = process.env.OBSIDIAN_DAILY_DIR
  ?? '/Users/deweyou/Library/Mobile Documents/iCloud~md~obsidian/Documents/Dewey Ou/学习/每日分享';
const contentDailyDir = path.join(repoRoot, 'content', 'daily');
const publicDailyDir = path.join(repoRoot, 'public', 'daily');

function walkMarkdownFiles(dir, results = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walkMarkdownFiles(fullPath, results);
      continue;
    }
    if (entry.isFile() && entry.name.endsWith('.md') && entry.name !== '索引.md') {
      results.push(fullPath);
    }
  }
  return results;
}

function toPosixPath(value) {
  return value.split(path.sep).join(path.posix.sep);
}

function relativeSourcePath(filePath) {
  return toPosixPath(path.relative(sourceRoot, filePath));
}

function basenameTitle(filePath) {
  return path.basename(filePath).replace(/^\d{4}-\d{2}-\d{2}\s*-\s*/, '').replace(/\.md$/, '');
}

function basenameDate(filePath) {
  return path.basename(filePath).match(/^(\d{4}-\d{2}-\d{2})/)?.[1] ?? null;
}

function fallbackType(filePath) {
  return path.basename(filePath).includes('深度分享') ? 'deep-share' : 'daily-share';
}

function fallbackId({ filePath, title, date, type }) {
  const stem = path.basename(filePath, '.md');
  const asciiSlug = title
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-+/g, '-');

  if (asciiSlug) {
    return `${type}-${date}-${asciiSlug}`;
  }

  const digest = crypto.createHash('sha1').update(stem).digest('hex').slice(0, 12);
  return `${type}-${date}-${digest}`;
}

function sortFrontmatter(data) {
  const ordered = {};
  for (const key of ['id', 'title', 'date', 'type', 'tags']) {
    if (data[key] != null) ordered[key] = data[key];
  }

  for (const [key, value] of Object.entries(data)) {
    if (ordered[key] != null || key === 'source_path') continue;
    ordered[key] = value;
  }

  ordered.source_path = data.source_path;
  return ordered;
}

function extractFrontmatterOrder(raw) {
  if (!raw.startsWith('---\n') && !raw.startsWith('---\r\n')) return [];
  const lines = raw.replace(/\r\n/g, '\n').split('\n');
  const order = [];
  for (let index = 1; index < lines.length; index += 1) {
    const line = lines[index];
    if (line === '---') break;
    const match = line.match(/^([A-Za-z0-9_]+):/);
    if (match) order.push(match[1]);
  }
  return order;
}

function normalizeScalar(value) {
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  return value;
}

function isSimpleToken(value) {
  return /^[\p{Letter}\p{Number}_./:%@+-]+$/u.test(value);
}

function formatScalar(key, value) {
  const normalized = normalizeScalar(value);
  if (typeof normalized !== 'string') return String(normalized);
  if (key === 'source_path') return JSON.stringify(normalized);
  if (normalized === '') return '""';
  if (isSimpleToken(normalized)) return normalized;
  return JSON.stringify(normalized);
}

function serializeFrontmatter(data, preferredOrder = []) {
  const lines = ['---'];
  const orderedKeys = [
    ...preferredOrder.filter((key) => Object.prototype.hasOwnProperty.call(data, key)),
    ...Object.keys(data).filter((key) => !preferredOrder.includes(key)),
  ];

  for (const key of orderedKeys) {
    const rawValue = data[key];
    const value = normalizeScalar(rawValue);
    if (Array.isArray(value)) {
      if (value.length === 0) {
        lines.push(`${key}: []`);
        continue;
      }
      if (key === 'tags' && value.every((item) => typeof item === 'string' && isSimpleToken(item))) {
        lines.push(`${key}: [${value.join(', ')}]`);
        continue;
      }
      lines.push(`${key}:`);
      for (const item of value) {
        lines.push(`  - ${formatScalar(key, item)}`);
      }
      continue;
    }
    lines.push(`${key}: ${formatScalar(key, value)}`);
  }
  lines.push('---');
  return lines.join('\n');
}

function normalizeMarkdown(sourcePath, repoPath) {
  const sourceRaw = fs.readFileSync(sourcePath, 'utf8');
  const sourceParsed = matter(sourceRaw);
  const repoParsed = repoPath && fs.existsSync(repoPath)
    ? matter(fs.readFileSync(repoPath, 'utf8'))
    : null;

  const title = sourceParsed.data.title || repoParsed?.data.title || basenameTitle(sourcePath);
  const date = sourceParsed.data.date || repoParsed?.data.date || basenameDate(sourcePath);
  const type = sourceParsed.data.type || repoParsed?.data.type || fallbackType(sourcePath);
  const id = sourceParsed.data.id || repoParsed?.data.id || fallbackId({ filePath: sourcePath, title, date, type });

  if (!date) {
    throw new Error(`Missing date for ${sourcePath}`);
  }

  const data = sortFrontmatter({
    ...sourceParsed.data,
    ...(repoParsed?.data ?? {}),
    ...sourceParsed.data,
    id,
    title,
    date,
    type,
    source_path: sourcePath,
  });

  const preferredOrder = repoParsed
    ? extractFrontmatterOrder(fs.readFileSync(repoPath, 'utf8'))
    : extractFrontmatterOrder(sourceRaw);
  const body = sourceParsed.content.replace(/\r\n/g, '\n').trim();
  const frontmatter = serializeFrontmatter(data, preferredOrder);
  return `${frontmatter}\n\n${body ? `${body}\n` : ''}`;
}

function isLocalAssetReference(ref) {
  if (!ref) return false;
  if (ref.startsWith('#') || ref.startsWith('/')) return false;
  if (/^(?:[a-z]+:)?\/\//i.test(ref)) return false;
  if (/^(?:data|mailto|tel):/i.test(ref)) return false;
  return true;
}

function extractAssetReferences(markdown) {
  const refs = new Set();
  const patterns = [
    /!\[[^\]]*]\(([^)]+)\)/g,
    /\[[^\]]+]\(([^)]+)\)/g,
    /<img[^>]+src=["']([^"']+)["'][^>]*>/gi,
  ];

  for (const pattern of patterns) {
    for (const match of markdown.matchAll(pattern)) {
      let ref = match[1]?.trim();
      if (!ref) continue;
      if (ref.startsWith('<') && ref.endsWith('>')) ref = ref.slice(1, -1);
      ref = ref.replace(/^['"]|['"]$/g, '');
      ref = ref.split('#')[0].split('?')[0];
      if (!isLocalAssetReference(ref)) continue;
      refs.add(ref);
    }
  }

  return [...refs];
}

function sameFileContent(a, b) {
  if (!fs.existsSync(a) || !fs.existsSync(b)) return false;
  const aStat = fs.statSync(a);
  const bStat = fs.statSync(b);
  if (aStat.size !== bStat.size) return false;
  return fs.readFileSync(a).equals(fs.readFileSync(b));
}

function ensureParentDir(filePath) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
}

function copyAsset(sourcePath, relativeRef, counters) {
  const normalizedRef = path.posix.normalize(relativeRef.replace(/\\/g, '/')).replace(/^\.\/+/, '');
  if (!normalizedRef || normalizedRef.startsWith('../')) {
    throw new Error(`Asset path escapes daily root: ${relativeRef} in ${sourcePath}`);
  }

  const absoluteSource = path.resolve(path.dirname(sourcePath), normalizedRef);
  if (!fs.existsSync(absoluteSource) || !fs.statSync(absoluteSource).isFile()) {
    throw new Error(`Missing asset ${relativeRef} referenced by ${sourcePath}`);
  }

  for (const baseDir of [contentDailyDir, publicDailyDir]) {
    const destination = path.join(baseDir, ...normalizedRef.split('/'));
    ensureParentDir(destination);
    if (!sameFileContent(absoluteSource, destination)) {
      fs.copyFileSync(absoluteSource, destination);
      counters.assetWrites += 1;
    } else {
      counters.assetUnchanged += 1;
    }
  }

  counters.assetRefs += 1;
}

function main() {
  if (!fs.existsSync(sourceRoot)) {
    throw new Error(`Source directory does not exist: ${sourceRoot}`);
  }

  const repoFiles = new Map(
    fs.readdirSync(contentDailyDir)
      .filter((name) => /\.(md|mdx)$/.test(name))
      .map((name) => [path.basename(name), path.join(contentDailyDir, name)]),
  );

  const counters = {
    addedDocs: 0,
    updatedDocs: 0,
    unchangedDocs: 0,
    assetRefs: 0,
    assetWrites: 0,
    assetUnchanged: 0,
  };

  const changedDocs = [];
  const markdownFiles = walkMarkdownFiles(sourceRoot).sort((a, b) => a.localeCompare(b, 'zh-CN'));

  for (const sourcePath of markdownFiles) {
    const fileName = path.basename(sourcePath);
    const repoPath = repoFiles.get(fileName) ?? path.join(contentDailyDir, fileName);
    const next = normalizeMarkdown(sourcePath, repoFiles.get(fileName));
    const current = fs.existsSync(repoPath) ? fs.readFileSync(repoPath, 'utf8').replace(/\r\n/g, '\n') : null;

    if (current !== next) {
      ensureParentDir(repoPath);
      fs.writeFileSync(repoPath, next, 'utf8');
      changedDocs.push(relativeSourcePath(sourcePath));
      if (current == null) counters.addedDocs += 1;
      else counters.updatedDocs += 1;
    } else {
      counters.unchangedDocs += 1;
    }

    const body = matter(next).content;
    for (const ref of extractAssetReferences(body)) {
      copyAsset(sourcePath, ref, counters);
    }
  }

  process.stdout.write(`${JSON.stringify({
    sourceRoot,
    scannedDocs: markdownFiles.length,
    ...counters,
    changedDocs,
  }, null, 2)}\n`);
}

main();
