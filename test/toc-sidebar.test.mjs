import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

test('blog fixed toc keeps its own scrollbar visible', () => {
  const css = readFileSync('src/styles/site.css', 'utf8');

  assert.match(css, /\.toc-fixed\s*{[\s\S]*overflow-y:\s*auto;/);
  assert.match(css, /\.toc-fixed\s*{[\s\S]*scrollbar-width:\s*thin;/);
  assert.match(css, /\.toc-fixed::-webkit-scrollbar\s*{[\s\S]*width:\s*6px;/);
  assert.match(css, /\.toc-fixed::-webkit-scrollbar-thumb\s*{/);
});

test('blog fixed toc starts below the global nav instead of centering behind it', () => {
  const css = readFileSync('src/styles/site.css', 'utf8');

  assert.match(css, /\.toc-fixed\s*{[\s\S]*top:\s*112px;/);
  assert.match(css, /\.toc-fixed\s*{[\s\S]*bottom:\s*32px;/);
  assert.match(css, /\.toc-fixed\s*{[\s\S]*max-height:\s*none;/);
  assert.doesNotMatch(css, /\.toc-fixed\s*{[\s\S]*transform:\s*translateY\(-50%\);/);
});
