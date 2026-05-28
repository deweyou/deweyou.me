'use client';

import { VirtualList, type VirtualListRange, type VirtualListRef } from '@deweyou-design/react/virtual-list';
import { Children, type ReactNode, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import styles from '##/app/daily/page.module.css';

const ACTIVE_TOP_OFFSET = 112;

export interface DailyVirtualTimelineEntry {
  slug: string;
  estimatedSize: number;
}

export function DailyVirtualTimeline({
  children,
  entries,
}: {
  children: ReactNode;
  entries: DailyVirtualTimelineEntry[];
}) {
  const entryNodes = Children.toArray(children);
  const virtualListRef = useRef<VirtualListRef>(null);
  const aligningHashRef = useRef(true);
  const restoreTimerRef = useRef(0);
  const [hasMounted, setHasMounted] = useState(false);

  const indexBySlug = useMemo(() => {
    return new Map(entries.map((entry, index) => [entry.slug, index]));
  }, [entries]);

  const scrollToHash = useCallback(() => {
    const targetSlug = decodeURIComponent(window.location.hash.slice(1));
    const targetIndex = indexBySlug.get(targetSlug);
    if (targetIndex == null) return false;

    aligningHashRef.current = true;
    virtualListRef.current?.scrollToIndex(targetIndex, { align: 'start' });
    window.clearTimeout(restoreTimerRef.current);
    restoreTimerRef.current = window.setTimeout(() => {
      aligningHashRef.current = false;
    }, 240);
    return true;
  }, [indexBySlug]);

  const estimatedTotalSize = useMemo(() => {
    return entries.reduce((totalSize, entry) => totalSize + entry.estimatedSize, 0);
  }, [entries]);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  const syncHash = useCallback((range: VirtualListRange) => {
    if (aligningHashRef.current) return;

    const virtualListRoot = document.querySelector('[data-testid="virtual-list"]');
    const isBeforeTimeline = virtualListRoot
      ? virtualListRoot.getBoundingClientRect().top > ACTIVE_TOP_OFFSET
      : false;
    const activeSlug = isBeforeTimeline ? null : entries[range.startIndex]?.slug;
    const nextHash = activeSlug ? `#${activeSlug}` : '';
    if (window.location.hash === nextHash) return;
    window.history.replaceState(null, '', `${window.location.pathname}${window.location.search}${nextHash}`);
  }, [entries]);

  useEffect(() => {
    if (!hasMounted || entries.length === 0) return;

    let cancelled = false;

    function alignInitialHash() {
      if (cancelled) return;
      if (!scrollToHash()) {
        aligningHashRef.current = false;
      }
    }

    if (window.location.hash) {
      aligningHashRef.current = true;
      void document.fonts.ready.then(() => {
        window.requestAnimationFrame(() => {
          window.requestAnimationFrame(alignInitialHash);
        });
      });
    } else {
      aligningHashRef.current = false;
    }

    window.addEventListener('hashchange', scrollToHash);

    return () => {
      cancelled = true;
      window.clearTimeout(restoreTimerRef.current);
      window.removeEventListener('hashchange', scrollToHash);
    };
  }, [entries.length, hasMounted, scrollToHash]);

  if (!hasMounted) {
    return (
      <div
        aria-label="笔记列表"
        className={`${styles.readingColumn} ${styles.virtualTimeline}`}
        role="list"
        style={{ height: estimatedTotalSize }}
      />
    );
  }

  return (
    <VirtualList
      ref={virtualListRef}
      aria-label="笔记列表"
      className={`${styles.readingColumn} ${styles.virtualTimeline}`}
      count={entries.length}
      estimateSize={(index) => entries[index]?.estimatedSize ?? 420}
      getItemKey={(index) => entries[index]?.slug ?? index}
      height="auto"
      itemClassName={styles.virtualItem}
      onRangeChange={syncHash}
      overscan={3}
      renderItem={({ index }) => entryNodes[index]}
      scrollElement="window"
      scrollMargin={ACTIVE_TOP_OFFSET}
    />
  );
}
