import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';

test('daily reader includes markdown files with spaced date-title names and flexible ids', async () => {
  const originalCwd = process.cwd();
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'daily-md-'));
  fs.mkdirSync(path.join(tmp, 'content', 'daily'), { recursive: true });
  fs.writeFileSync(
    path.join(tmp, 'content', 'daily', '2026-05-30 - Agent 会话要绑定主体.md'),
    [
      '---',
      'id: ai-share-2026-05-30-agent-session-principal-boundary',
      'title: Agent 会话要绑定主体',
      'date: 2026-05-30',
      'type: deep-share',
      'tags: [AI]',
      '---',
      '## 一句话结论',
      '',
      'Agent 平台的可靠边界不该只放在 prompt 里。',
    ].join('\n'),
  );

  try {
    process.chdir(tmp);
    const daily = await import(`../src/lib/daily.ts?daily-md-${Date.now()}`);
    const entries = daily.getAllDailyEntries();

    assert.equal(entries.length, 1);
    assert.equal(entries[0].id, 'ai-share-2026-05-30-agent-session-principal-boundary');
    assert.equal(entries[0].slug, '2026-05-30 - Agent 会话要绑定主体');
    assert.equal(entries[0].title, 'Agent 会话要绑定主体');
    assert.equal(entries[0].type, 'deep-share');
    assert.deepEqual(entries[0].tags, ['AI']);
  } finally {
    process.chdir(originalCwd);
    fs.rmSync(tmp, { recursive: true, force: true });
  }
});

test('daily reader ignores non-entry markdown files', async () => {
  const originalCwd = process.cwd();
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'daily-index-'));
  fs.mkdirSync(path.join(tmp, 'content', 'daily'), { recursive: true });
  fs.writeFileSync(path.join(tmp, 'content', 'daily', '索引.md'), '# 笔记索引\n');

  try {
    process.chdir(tmp);
    const daily = await import(`../src/lib/daily.ts?daily-index-${Date.now()}`);
    assert.deepEqual(daily.getAllDailyEntries(), []);
  } finally {
    process.chdir(originalCwd);
    fs.rmSync(tmp, { recursive: true, force: true });
  }
});

test('daily reader removes source comments from rendered content', async () => {
  const originalCwd = process.cwd();
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'daily-source-'));
  fs.mkdirSync(path.join(tmp, 'content', 'daily'), { recursive: true });
  fs.writeFileSync(
    path.join(tmp, 'content', 'daily', '2026-06-05 - 把复杂留到第二步.md'),
    [
      '---',
      'id: design-share-2026-06-05-progressive-disclosure',
      'title: 把复杂留到第二步',
      'date: 2026-06-05',
      'type: daily-share',
      'tags: [设计]',
      '---',
      '<!-- source: /Users/deweyou/Library/Mobile Documents/iCloud~md~obsidian/Documents/Dewey Ou/学习/每日分享/设计/2026-06-05 - 把复杂留到第二步.md -->',
      '',
      '先让用户看到主要路径。',
    ].join('\n'),
  );

  try {
    process.chdir(tmp);
    const daily = await import(`../src/lib/daily.ts?daily-source-${Date.now()}`);
    const [entry] = daily.getAllDailyEntries();

    assert.ok(!entry.content.includes('source:'));
    assert.ok(!entry.content.includes('<!--'));
    assert.equal(entry.content.trim(), '先让用户看到主要路径。');
  } finally {
    process.chdir(originalCwd);
    fs.rmSync(tmp, { recursive: true, force: true });
  }
});
