import test from 'node:test';
import assert from 'node:assert/strict';
import {
  buildSearchPayload,
  cleanMarkdownForSearch,
  createSearchSnippet,
  getSearchDocuments,
  getSearchPayloadStats,
  shouldIgnoreSearchNavigationKey,
  splitHighlightText,
} from '../src/lib/search.ts';

test('search documents include posts and daily entries with hrefs', () => {
  const documents = getSearchDocuments();
  assert.ok(documents.some((doc) => doc.source === 'post' && doc.href.startsWith('/blog/')));
  assert.ok(documents.some((doc) => doc.source === 'daily' && doc.href.startsWith('/daily/')));
});

test('cleanMarkdownForSearch removes common markdown syntax noise', () => {
  const cleaned = cleanMarkdownForSearch('---\ntitle: X\n---\n# Heading\n**Bold** [Link](https://example.com) `code`');
  assert.equal(cleaned.includes('---'), false);
  assert.equal(cleaned.includes('**'), false);
  assert.equal(cleaned.includes('https://example.com'), false);
  assert.match(cleaned, /Heading/);
  assert.match(cleaned, /Bold/);
  assert.match(cleaned, /Link/);
  assert.match(cleaned, /code/);
});

test('createSearchSnippet returns a short query-centered snippet', () => {
  const snippet = createSearchSnippet('前面有很多文字。这里出现动态沙箱，并且后面还有一些用于截断的文字。', '动态沙箱', 18);
  assert.ok(snippet.text.length <= 24);
  assert.ok(snippet.text.includes('动态沙箱'));
  assert.equal(snippet.hasMatch, true);
});

test('splitHighlightText marks Chinese and English query matches', () => {
  const parts = splitHighlightText('MiniSearch 支持中文 search 体验', '中文 search');
  assert.ok(parts.some((part) => part.highlight && part.text === '中文'));
  assert.ok(parts.some((part) => part.highlight && part.text.toLowerCase() === 'search'));
});

test('buildSearchPayload produces serialized index and document store', () => {
  const payload = buildSearchPayload([
    {
      id: 'post:one',
      source: 'post',
      title: 'Search Title',
      href: '/blog/one',
      date: '2026-06-06',
      tags: ['Agent'],
      excerpt: 'Search excerpt',
      body: 'Search body text',
    },
  ]);
  assert.ok(payload.index);
  assert.equal(payload.documents['post:one'].title, 'Search Title');
});

test('getSearchPayloadStats reports byte and gzip sizes', () => {
  const stats = getSearchPayloadStats({ index: { documentCount: 0 }, documents: {} });
  assert.ok(stats.bytes > 0);
  assert.ok(stats.gzipBytes > 0);
});

test('shouldIgnoreSearchNavigationKey ignores IME composition confirmation keys', () => {
  assert.equal(shouldIgnoreSearchNavigationKey({ key: 'Enter', isComposing: true }), true);
  assert.equal(shouldIgnoreSearchNavigationKey({ key: 'Enter', keyCode: 229 }), true);
  assert.equal(shouldIgnoreSearchNavigationKey({ key: 'Process' }), true);
  assert.equal(shouldIgnoreSearchNavigationKey({ key: 'Enter' }), false);
});
