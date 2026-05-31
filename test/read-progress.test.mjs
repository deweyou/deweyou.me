import assert from 'node:assert/strict';
import test from 'node:test';
import {
  calculateScrollProgressPercent,
  getReachedReadProgressThresholds,
} from '../src/lib/read-progress.ts';

test('calculates scroll progress as a clamped percentage', () => {
  assert.equal(calculateScrollProgressPercent({ scrollTop: 250, scrollHeight: 1000, clientHeight: 500 }), 50);
  assert.equal(calculateScrollProgressPercent({ scrollTop: -10, scrollHeight: 1000, clientHeight: 500 }), 0);
  assert.equal(calculateScrollProgressPercent({ scrollTop: 800, scrollHeight: 1000, clientHeight: 500 }), 100);
  assert.equal(calculateScrollProgressPercent({ scrollTop: 0, scrollHeight: 500, clientHeight: 500 }), 0);
});

test('returns newly reached read progress thresholds only once', () => {
  assert.deepEqual(getReachedReadProgressThresholds(24, new Set()), []);
  assert.deepEqual(getReachedReadProgressThresholds(50, new Set()), [25, 50]);
  assert.deepEqual(getReachedReadProgressThresholds(76, new Set([25, 50])), [75]);
  assert.deepEqual(getReachedReadProgressThresholds(100, new Set([25, 50, 75])), [100]);
});
