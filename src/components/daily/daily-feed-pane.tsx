'use client';

import { usePathname } from 'next/navigation';
import { useLayoutEffect, useRef, type ReactNode } from 'react';
import styles from '##/app/daily/page.module.css';

const DAILY_FEED_SCROLL_KEY_PREFIX = 'daily-feed-scroll-top';

export function DailyFeedPane({
  activeTag,
  children,
}: {
  activeTag?: string | null;
  children: ReactNode;
}) {
  const pathname = usePathname();
  const paneRef = useRef<HTMLDivElement>(null);
  const storageKey = `${DAILY_FEED_SCROLL_KEY_PREFIX}:${activeTag ?? 'all'}`;

  useLayoutEffect(() => {
    const pane = paneRef.current;
    if (!pane) return;

    const scrollTop = Number(sessionStorage.getItem(storageKey) ?? 0);
    pane.scrollTop = Number.isFinite(scrollTop) ? scrollTop : 0;
  }, [pathname, storageKey]);

  function handleScroll() {
    const pane = paneRef.current;
    if (!pane) return;
    sessionStorage.setItem(storageKey, String(pane.scrollTop));
  }

  return (
    <div ref={paneRef} className={styles.feedPane} onScroll={handleScroll}>
      {children}
    </div>
  );
}
