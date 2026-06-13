import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import test from 'node:test';

test('blog and daily detail pages share the content detail header component', () => {
  const headerPath = 'src/components/content/content-header.tsx';

  assert.equal(existsSync(headerPath), true);

  const header = readFileSync(headerPath, 'utf8');
  const blogDetail = readFileSync('src/app/blog/[slug]/page.tsx', 'utf8');
  const dailyDetail = readFileSync('src/components/daily/daily-detail.tsx', 'utf8');
  const dailyDetailContent = dailyDetail.match(/export function DailyDetail[\s\S]*?export function DailyDetailLoading/)?.[0] ?? dailyDetail;

  assert.match(header, /export function ContentHeader/);
  assert.match(header, /ArrowLeftIcon/);
  assert.match(header, /Badge/);
  assert.match(header, /backScroll\?: boolean/);
  assert.match(header, /className\?: string/);
  assert.match(header, /metadata:\s*ContentHeaderMetadataItem\[\]/);
  assert.match(header, /tags\?: string\[\]/);

  assert.match(blogDetail, /ContentHeader/);
  assert.match(blogDetail, /metadata=\{\[/);
  assert.doesNotMatch(blogDetail, /<header style=/);
  assert.doesNotMatch(blogDetail, /← 文章/);

  assert.match(dailyDetailContent, /ContentHeader/);
  assert.match(dailyDetailContent, /backScroll=\{false\}/);
  assert.match(dailyDetailContent, /badge=\{/);
  assert.match(dailyDetailContent, /className=\{styles\.detailContentHeader\}/);
  assert.doesNotMatch(dailyDetailContent, /styles\.detailHeader/);
  assert.doesNotMatch(dailyDetailContent, /styles\.detailTitle/);
  assert.doesNotMatch(dailyDetailContent, /styles\.detailBackLink/);
});
