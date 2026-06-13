'use client';

import { useCallback, useEffect, useLayoutEffect, useRef, type ReactNode } from 'react';
import styles from '##/app/daily/page.module.css';

const FEED_SCROLL_STORAGE_PREFIX = 'daily-feed-scroll:';

function getSavedScrollTop(storageKey: string) {
  const savedScrollTop = Number(window.sessionStorage.getItem(storageKey) ?? 0);
  return Number.isFinite(savedScrollTop) ? savedScrollTop : 0;
}

export function DailyFeedPane({
  children,
  id,
  resetKey,
}: {
  children: ReactNode;
  id?: string;
  resetKey: string;
}) {
  const paneRef = useRef<HTMLDivElement>(null);
  const storageKey = `${FEED_SCROLL_STORAGE_PREFIX}${resetKey}`;

  const saveScrollTopNow = useCallback(() => {
    const pane = paneRef.current;
    if (!pane) return;

    window.sessionStorage.setItem(storageKey, String(pane.scrollTop));
  }, [storageKey]);

  const restorePaneRef = useCallback((pane: HTMLDivElement | null) => {
    paneRef.current = pane;
    if (!pane) return;

    pane.scrollTop = getSavedScrollTop(storageKey);
  }, [storageKey]);

  useLayoutEffect(() => {
    restorePaneRef(paneRef.current);
  }, [restorePaneRef]);

  useEffect(() => {
    const pane = paneRef.current;
    if (!pane) return;
    const currentPane = pane;

    let frame = 0;

    function saveScrollTop() {
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(() => {
        window.sessionStorage.setItem(storageKey, String(currentPane.scrollTop));
      });
    }

    currentPane.addEventListener('scroll', saveScrollTop, { passive: true });
    return () => {
      window.cancelAnimationFrame(frame);
      currentPane.removeEventListener('scroll', saveScrollTop);
    };
  }, [storageKey]);

  return (
    <div
      id={id}
      ref={restorePaneRef}
      className={styles.feedPane}
      onPointerDownCapture={saveScrollTopNow}
      onClickCapture={saveScrollTopNow}
    >
      {children}
    </div>
  );
}
