import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import test from 'node:test';

test('blog and daily tag filters share the content tag filter bar', () => {
  const componentPath = 'src/components/content/tag-filter-bar.tsx';
  const stylesPath = 'src/components/content/tag-filter-bar.module.css';

  assert.equal(existsSync(componentPath), true);
  assert.equal(existsSync(stylesPath), true);

  const component = readFileSync(componentPath, 'utf8');
  const styles = readFileSync(stylesPath, 'utf8');
  const blogList = readFileSync('src/components/blog/blog-list.tsx', 'utf8');
  const dailyTagFilters = readFileSync('src/components/daily/daily-tag-filters.tsx', 'utf8');
  const dailyCss = readFileSync('src/app/daily/page.module.css', 'utf8');

  assert.match(component, /export function TagFilterBar/);
  assert.match(component, /onItemClick\?:/);
  assert.match(component, /href\?: string/);
  assert.match(component, /item\.href/);
  assert.match(component, /onItemClick\?\.\(item\)/);
  assert.match(styles, /\.bar\s*{/);
  assert.match(styles, /\.item\[data-active="true"\]\s*{/);

  assert.match(blogList, /TagFilterBar/);
  assert.match(blogList, /onItemClick=\{\(item\) => setActiveTag\(item\.id\)\}/);
  assert.doesNotMatch(blogList, /className="dy-tag"/);

  assert.match(dailyTagFilters, /TagFilterBar/);
  assert.match(dailyTagFilters, /onItemClick=\{handleItemClick\}/);
  assert.match(dailyTagFilters, /prefetch:\s*true/);
  assert.doesNotMatch(dailyTagFilters, /styles\.tagFilter/);

  assert.doesNotMatch(dailyCss, /\.tagFilters\s*{/);
  assert.doesNotMatch(dailyCss, /\.tagFilter\s*{/);
});
