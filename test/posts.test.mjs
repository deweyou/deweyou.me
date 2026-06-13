import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';

test('post reader normalizes YAML dates to YYYY-MM-DD strings', async () => {
  const originalCwd = process.cwd();
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'posts-date-'));
  fs.mkdirSync(path.join(tmp, 'content', 'posts'), { recursive: true });
  fs.writeFileSync(
    path.join(tmp, 'content', 'posts', 'date-normalization.mdx'),
    [
      '---',
      'title: Date normalization',
      'date: 2026-05-17',
      'tag: AI',
      'readTime: 3 min',
      'excerpt: Date excerpt',
      '---',
      'Body',
    ].join('\n'),
  );

  try {
    process.chdir(tmp);
    const posts = await import(`../src/lib/posts.ts?posts-date-${Date.now()}`);
    const post = posts.getPost('date-normalization');

    assert.equal(post.date, '2026-05-17');
    assert.equal(posts.getAllPosts()[0].date, '2026-05-17');
  } finally {
    process.chdir(originalCwd);
    fs.rmSync(tmp, { recursive: true, force: true });
  }
});
