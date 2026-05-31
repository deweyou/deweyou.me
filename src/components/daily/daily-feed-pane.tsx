'use client';

import { useLayoutEffect, useRef, type ReactNode } from 'react';
import styles from '##/app/daily/page.module.css';

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

  useLayoutEffect(() => {
    const pane = paneRef.current;
    if (!pane) return;

    pane.scrollTop = 0;
  }, [resetKey]);

  return (
    <div id={id} ref={paneRef} className={styles.feedPane}>
      {children}
    </div>
  );
}
