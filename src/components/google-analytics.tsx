'use client';

import { useSyncExternalStore } from 'react';
import { GoogleAnalytics as NextGoogleAnalytics } from '@next/third-parties/google';
import { shouldReportAnalytics } from '##/lib/analytics';

function subscribeToStaticHostname() {
  return () => {};
}

function getClientAnalyticsSnapshot() {
  return shouldReportAnalytics(window.location.hostname);
}

function getServerAnalyticsSnapshot() {
  return false;
}

export function GoogleAnalytics({ gaId }: { gaId: string }) {
  const canReportAnalytics = useSyncExternalStore(
    subscribeToStaticHostname,
    getClientAnalyticsSnapshot,
    getServerAnalyticsSnapshot,
  );

  if (!canReportAnalytics) return null;

  return <NextGoogleAnalytics gaId={gaId} />;
}
