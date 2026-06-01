'use client';

import { Badge } from '@deweyou-design/react/badge';
import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';
import styles from '##/app/daily/page.module.css';
import { MarkdownContent } from '##/components/markdown-content';
import type { DailySerializedFeedBatch, DailySerializedFeedEntry } from '##/lib/daily-feed';

const DAILY_BATCH_SIZE = 20;

export function DailyVirtualTimeline({
  activeId,
  activeTag,
  initialNextCursor,
  initialPreviousYear,
}: {
  activeId?: string;
  activeTag?: string | null;
  initialNextCursor: string | null;
  initialPreviousYear: string | null;
}) {
  const sentinelRef = useRef<HTMLDivElement>(null);
  const [entries, setEntries] = useState<DailySerializedFeedEntry[]>([]);
  const [nextCursor, setNextCursor] = useState(initialNextCursor);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadMore = useCallback(async () => {
    if (!nextCursor || isLoading) return;
    setIsLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        cursor: nextCursor,
        limit: String(DAILY_BATCH_SIZE),
      });
      if (activeTag) {
        params.set('tag', activeTag);
      }
      const response = await fetch(`/api/daily?${params.toString()}`);
      if (!response.ok) {
        throw new Error('加载失败，请稍后重试。');
      }
      const batch = await response.json() as DailySerializedFeedBatch;
      setEntries((currentEntries) => [...currentEntries, ...batch.entries]);
      setNextCursor(batch.nextCursor);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : '加载失败，请稍后重试。');
    } finally {
      setIsLoading(false);
    }
  }, [activeTag, isLoading, nextCursor]);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || !nextCursor) return;

    const observer = new IntersectionObserver((items) => {
      if (items.some((item) => item.isIntersecting)) {
        void loadMore();
      }
    }, { rootMargin: '600px 0px' });

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [loadMore, nextCursor]);

  function renderEntry(entry: DailySerializedFeedEntry, index: number) {
    const year = entry.date.slice(0, 4);
    const previousYear = entries[index - 1]?.date.slice(0, 4) ?? initialPreviousYear;
    const shouldShowYear = previousYear !== year;
    const tagQuery = activeTag ? `?tag=${encodeURIComponent(activeTag)}` : '';

    return (
      <article key={entry.id} className={`${styles.entry} ${activeId === entry.id ? styles.entryActive : ''}`}>
        <Link
          href={`/daily/${entry.id}${tagQuery}`}
          scroll={false}
          className={styles.entryOverlay}
          data-daily-entry-link="true"
          aria-label={`打开笔记：${entry.title}`}
        />
        {shouldShowYear && <div className={styles.yearLabel}>{year}</div>}
        <header className={styles.entryHeader}>
          <div className={styles.entryMetaLine}>
            <time dateTime={entry.date} className={styles.date}>
              {entry.date.slice(5)}
            </time>
            {entry.type === 'deep-share' && (
              <Badge
                className={styles.entryTypeLabel}
                color="primary"
                shape="pill"
                variant="soft"
              >
                深度分享
              </Badge>
            )}
          </div>
          <h2 className={styles.entryTitle}>{entry.title}</h2>
          {entry.tags.length > 0 && (
            <div className={styles.tags}>
              {entry.tags.map((tag) => (
                <span key={tag} className="dy-tag">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </header>
        <div className={styles.body}>
          <MarkdownContent content={entry.content} />
        </div>
      </article>
    );
  }

  return (
    <>
      {entries.map(renderEntry)}
      <div ref={sentinelRef} className={styles.feedSentinel} aria-hidden="true" />
      {isLoading && <p className={styles.feedStatus}>加载中...</p>}
      {error && (
        <div className={styles.feedStatus}>
          <p>{error}</p>
          <button className={styles.retryButton} type="button" onClick={() => void loadMore()}>
            重试
          </button>
        </div>
      )}
      {!nextCursor && <p className={styles.feedStatus}>没有更早的笔记了。</p>}
    </>
  );
}
