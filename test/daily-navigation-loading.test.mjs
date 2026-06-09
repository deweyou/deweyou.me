import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import test from 'node:test';

test('daily detail navigation loading keeps the feed/detail shell visible', () => {
  const loadingPath = 'src/app/daily/[id]/loading.tsx';

  assert.equal(existsSync(loadingPath), true);

  const loading = readFileSync(loadingPath, 'utf8');

  assert.match(loading, /DailyExperience/);
  assert.match(loading, /DailyDetailLoading/);
  assert.match(loading, /getDailyFeedBatch/);
  assert.doesNotMatch(loading, /Loading\.\.\.|加载中\.\.\./);
});
