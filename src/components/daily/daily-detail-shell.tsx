'use client';

import { XIcon } from '@deweyou-design/react-icons';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useRef } from 'react';
import type { ReactNode, TouchEvent } from 'react';
import styles from '##/app/daily/page.module.css';

const EDGE_SWIPE_START = 36;
const SWIPE_DISTANCE = 72;
const SWIPE_MAX_VERTICAL_DRIFT = 48;

export function DailyDetailShell({ children }: { children: ReactNode }) {
  const router = useRouter();
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);
  const isEdgeSwipe = useRef(false);

  function handleTouchStart(event: TouchEvent<HTMLElement>) {
    const touch = event.changedTouches[0];
    if (!touch || window.innerWidth > 768) {
      return;
    }

    touchStartX.current = touch.clientX;
    touchStartY.current = touch.clientY;
    isEdgeSwipe.current = touch.clientX <= EDGE_SWIPE_START;
  }

  function handleTouchEnd(event: TouchEvent<HTMLElement>) {
    if (!isEdgeSwipe.current) {
      return;
    }

    const touch = event.changedTouches[0];
    if (!touch) {
      return;
    }

    const deltaX = touch.clientX - touchStartX.current;
    const deltaY = Math.abs(touch.clientY - touchStartY.current);
    if (deltaX >= SWIPE_DISTANCE && deltaY <= SWIPE_MAX_VERTICAL_DRIFT) {
      router.push('/daily', { scroll: false });
    }
  }

  return (
    <article
      className={styles.detailArticle}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <Link href="/daily" className={styles.closeButton} scroll={false} aria-label="关闭详情">
        <XIcon size={20} aria-hidden="true" />
      </Link>
      {children}
    </article>
  );
}
