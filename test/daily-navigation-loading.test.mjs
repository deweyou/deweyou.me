import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import test from 'node:test';

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
  const detailPagePath = 'src/app/daily/(detail)/[id]/page.tsx';
  const loadingPath = 'src/app/daily/(detail)/[id]/loading.tsx';

  assert.equal(existsSync(layoutPath), true);

  const layout = readFileSync(layoutPath, 'utf8');
  const detailPage = readFileSync(detailPagePath, 'utf8');
  const loading = readFileSync(loadingPath, 'utf8');

  assert.match(layout, /DailyPersistentFeed/);
  assert.match(layout, /DailyDetailLayout/);
  assert.match(layout, /children/);
  assert.doesNotMatch(detailPage, /DailyExperience/);
  assert.doesNotMatch(loading, /DailyExperience/);
});
