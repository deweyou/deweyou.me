'use client';

import { usePathname } from 'next/navigation';
import { useLayoutEffect, useRef, type ReactNode } from 'react';
import styles from '##/app/daily/page.module.css';

const DAILY_FEED_SCROLL_KEY = 'daily-feed-scroll-top';

export function DailyFeedPane({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const paneRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const pane = paneRef.current;
    if (!pane) return;

    const scrollTop = Number(sessionStorage.getItem(DAILY_FEED_SCROLL_KEY) ?? 0);
    if (Number.isFinite(scrollTop) && scrollTop > 0) {
      pane.scrollTop = scrollTop;
    }
  }, [pathname]);

  function handleScroll() {
    const pane = paneRef.current;
    if (!pane) return;
    sessionStorage.setItem(DAILY_FEED_SCROLL_KEY, String(pane.scrollTop));
  }

  return (
    <div ref={paneRef} className={styles.feedPane} onScroll={handleScroll}>
      {children}
    </div>
  );
}
