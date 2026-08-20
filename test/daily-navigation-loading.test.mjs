import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import test from 'node:test';

test('daily navigation and API routes are disabled', () => {
  const navigation = readFileSync('src/content/common.ts', 'utf8');

  assert.equal(existsSync('src/app/daily/page.tsx'), false);
  assert.equal(existsSync('src/app/daily/(detail)/[id]/page.tsx'), false);
  assert.equal(existsSync('src/app/api/daily/route.ts'), false);
  assert.equal(existsSync('src/app/daily/page.disabled.tsx'), false);
  assert.equal(existsSync('src/app/daily/(detail)/[id]/page.disabled.tsx'), false);
  assert.equal(existsSync('src/app/api/daily/route.disabled.ts'), false);
  assert.doesNotMatch(navigation, /^\s*\{\s*href:\s*['"]\/daily['"]/m);
});

test('daily detail navigation loading keeps the feed/detail shell visible', () => {
  const loadingPath = 'src/app/daily/(detail)/[id]/loading.tsx';

  assert.equal(existsSync(loadingPath), true);

  const loading = readFileSync(loadingPath, 'utf8');

  assert.match(loading, /DailyDetailLoading/);
  assert.doesNotMatch(loading, /DailyExperience/);
  assert.doesNotMatch(loading, /getDailyFeedBatch/);
  assert.doesNotMatch(loading, /Loading\.\.\.|加载中\.\.\./);
});

test('daily detail navigation keeps the feed in the shared daily layout', () => {
  const layoutPath = 'src/app/daily/(detail)/layout.tsx';
  const loadingPath = 'src/app/daily/(detail)/[id]/loading.tsx';

  assert.equal(existsSync(layoutPath), true);

  const layout = readFileSync(layoutPath, 'utf8');
  const loading = readFileSync(loadingPath, 'utf8');

  assert.match(layout, /DailyPersistentFeed/);
  assert.match(layout, /DailyDetailLayout/);
  assert.match(layout, /children/);
  assert.doesNotMatch(loading, /DailyExperience/);
});
