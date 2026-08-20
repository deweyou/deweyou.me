import assert from 'node:assert/strict';
import test from 'node:test';

import {
  BLOG_ANCHOR_OFFSET,
  BLOG_NAV_HEIGHT,
  getRelativeTocTier,
} from '../src/lib/toc.ts';

test('blog anchors include reading buffer below the fixed navigation', () => {
  assert.equal(BLOG_NAV_HEIGHT, 80);
  assert.equal(BLOG_ANCHOR_OFFSET, 104);
  assert.ok(BLOG_ANCHOR_OFFSET > BLOG_NAV_HEIGHT);
});

test('a single heading depth always uses the shortest visual tier', () => {
  assert.equal(getRelativeTocTier(1, [1]), 0);
  assert.equal(getRelativeTocTier(2, [2]), 0);
});

test('two heading depths use the middle and shortest visual tiers', () => {
  assert.equal(getRelativeTocTier(1, [1, 2]), 1);
  assert.equal(getRelativeTocTier(2, [1, 2]), 0);
});

test('three heading depths use the longest, middle, and shortest visual tiers', () => {
  assert.equal(getRelativeTocTier(1, [1, 2, 3]), 2);
  assert.equal(getRelativeTocTier(2, [1, 2, 3]), 1);
  assert.equal(getRelativeTocTier(3, [1, 2, 3]), 0);
});

test('relative tiers depend on observed depths rather than absolute markdown depth', () => {
  assert.equal(getRelativeTocTier(1, [1, 3]), 1);
  assert.equal(getRelativeTocTier(3, [1, 3]), 0);
});
