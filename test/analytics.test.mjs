import assert from 'node:assert/strict';
import test from 'node:test';
import {
  isLocalAnalyticsHostname,
  shouldReportAnalytics,
} from '../src/lib/analytics.ts';

test('detects local analytics hostnames', () => {
  for (const hostname of [
    'localhost',
    'preview.localhost',
    '127.0.0.1',
    '0.0.0.0',
    '::1',
    '[::1]',
    'macbook.local',
    '10.0.0.5',
    '172.16.0.1',
    '172.31.255.255',
    '192.168.31.143',
  ]) {
    assert.equal(isLocalAnalyticsHostname(hostname), true, hostname);
  }
});

test('allows analytics for public hostnames only in production', () => {
  assert.equal(isLocalAnalyticsHostname('deweyou.me'), false);
  assert.equal(shouldReportAnalytics('deweyou.me'), process.env.NODE_ENV === 'production');
  assert.equal(shouldReportAnalytics('localhost'), false);
  assert.equal(shouldReportAnalytics('192.168.31.143'), false);
});
