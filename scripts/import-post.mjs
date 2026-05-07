#!/usr/bin/env node
/**
 * Import a .md file as a blog post.
 *
 * Usage:
 *   node scripts/import-post.mjs <file.md>
 *
 * What it does:
 *   1. Strips lines that look like internal notes (> skill：... links)
 *   2. Infers title / date from filename (YYYY-MM-DD-标题 or just 标题)
 *   3. Prompts for tag, readTime, excerpt, and output slug
 *   4. Writes content/posts/<slug>.mdx with frontmatter
 *   5. Deletes the original .md file
 */

import fs from 'fs';
import path from 'path';
import readline from 'readline';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const POSTS_DIR = path.resolve(__dirname, '..', 'content', 'posts');

// ── Helpers ──────────────────────────────────────────────────────────────────

function ask(rl, question) {
  return new Promise((resolve) => rl.question(question, resolve));
}

function parseName(filename) {
  const stem = path.parse(filename).name;
  const dateMatch = stem.match(/^(\d{4}-\d{2}-\d{2})[_\-\s](.+)$/);
  if (dateMatch) return { date: dateMatch[1], title: dateMatch[2] };
  return { date: new Date().toISOString().slice(0, 10), title: stem };
}

function stripInternalLines(content) {
  return content
    .split('\n')
    .filter((line) => {
      // Drop blockquote lines that are just internal skill/link references
      if (/^>\s*(skill|技巧|内部)[：:]/i.test(line)) return false;
      return true;
    })
    .join('\n')
    .replace(/^\n+/, ''); // trim leading blank lines
}

function estimateReadTime(content) {
  // ~400 Chinese chars/min reading speed
  const chars = content.replace(/\s+/g, '').length;
  const mins = Math.max(1, Math.round(chars / 400));
  return `${mins} min`;
}

function slugify(str) {
  return str
    .toLowerCase()
    .replace(/[\s\u4e00-\u9fff\u3400-\u4dbf]+/g, '-') // Chinese chars → dash
    .replace(/[^\w-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

// ── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  const inputPath = path.resolve(process.argv[2] ?? '');
  if (!inputPath || !fs.existsSync(inputPath)) {
    console.error('Usage: node scripts/import-post.mjs <file.md>');
    process.exit(1);
  }

  const raw = fs.readFileSync(inputPath, 'utf8');

  // Check if frontmatter already exists
  if (raw.startsWith('---')) {
    console.log('⚠  File already has frontmatter. Skipping frontmatter generation.');
    console.log('   Rename to .mdx manually if needed.');
    process.exit(0);
  }

  const { date, title } = parseName(path.basename(inputPath));
  const body = stripInternalLines(raw);
  const estimatedRead = estimateReadTime(body);

  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

  console.log(`\n→ Title:    ${title}`);
  console.log(`→ Date:     ${date}`);
  console.log(`→ Est. read: ${estimatedRead}\n`);

  const tag      = (await ask(rl, `Tag (e.g. AI / 前端设计 / 产品思考 / 生活随笔 / 读书笔记) [AI]: `)).trim() || 'AI';
  const readTime = (await ask(rl, `Read time [${estimatedRead}]: `)).trim() || estimatedRead;
  const excerpt  = (await ask(rl, `Excerpt (one sentence): `)).trim();

  const defaultSlug = `${date}-${slugify(title) || 'post'}`;
  const slugInput   = (await ask(rl, `Output slug [${defaultSlug}]: `)).trim();
  const slug        = slugInput || defaultSlug;

  rl.close();

  const frontmatter = `---
title: ${title}
date: ${date}
tag: ${tag}
readTime: ${readTime}
excerpt: ${excerpt}
---`;

  const output = `${frontmatter}\n\n${body}`;
  const outPath = path.join(POSTS_DIR, `${slug}.mdx`);

  if (fs.existsSync(outPath)) {
    console.error(`\n✗ ${outPath} already exists. Aborting.`);
    process.exit(1);
  }

  fs.writeFileSync(outPath, output, 'utf8');
  fs.unlinkSync(inputPath);

  console.log(`\n✅ Created: content/posts/${slug}.mdx`);
  console.log(`   Deleted: ${path.basename(inputPath)}\n`);
  console.log('Run `pnpm dev` to preview.\n');
}

main().catch((err) => { console.error(err); process.exit(1); });
