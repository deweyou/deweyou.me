'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { DailyTagFilters } from './daily-tag-filters';
import { DailyFeedEntry } from './daily-feed-entry';
import { DailyFeedPane } from './daily-feed-pane';
import type { DailyFeedBatch } from '##/lib/daily';
import type { DailySerializedFeedBatch, DailySerializedFeedEntry } from '##/lib/daily-feed';
import styles from '##/app/daily/page.module.css';

const DAILY_BATCH_SIZE = 20;

interface DailyFeedSummary {
  date: string;
  tags: string[];
}

function getActiveId(pathname: string) {
  const match = pathname.match(/^\/daily\/([^/?#]+)/);
  return match ? decodeURIComponent(match[1]) : undefined;
}

function normalizeTag(value: string | null) {
  return value && value.trim() !== '' ? value.trim() : null;
}

function serializeInitialBatch(batch: DailyFeedBatch): DailySerializedFeedBatch {
  return {
    entries: batch.entries.map((entry) => ({
      id: entry.id,
      slug: entry.slug,
      title: entry.title,
      date: entry.date,
      type: entry.type,
      tags: entry.tags,
      estimatedSize: 0,
      content: entry.content,
    })),
    nextCursor: batch.nextCursor,
  };
}

async function fetchDailyBatch({
  cursor,
  signal,
  tag,
}: {
  cursor?: string | null;
  signal?: AbortSignal;
  tag: string | null;
}) {
  const params = new URLSearchParams({ limit: String(DAILY_BATCH_SIZE) });
  if (cursor) params.set('cursor', cursor);
  if (tag) params.set('tag', tag);

  const response = await fetch(`/api/daily?${params.toString()}`, { signal });
  if (!response.ok) {
    throw new Error('加载失败，请稍后重试。');
  }
  return response.json() as Promise<DailySerializedFeedBatch>;
}

export function DailyPersistentFeed({
  availableTags,
  feedPanelId,
  initialBatch,
  summaries,
}: {
  availableTags: string[];
  feedPanelId: string;
  initialBatch: DailyFeedBatch;
  summaries: DailyFeedSummary[];
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const activeId = getActiveId(pathname);
  const activeTag = normalizeTag(searchParams.get('tag'));
  const initialSerializedBatch = useMemo(() => serializeInitialBatch(initialBatch), [initialBatch]);
  const visibleSummaries = useMemo(() => (
    activeTag
      ? summaries.filter((entry) => entry.tags.includes(activeTag))
      : summaries
  ), [activeTag, summaries]);

  return (
    <DailyPersistentFeedContent
      activeId={activeId}
      activeTag={activeTag}
      availableTags={availableTags}
      feedPanelId={feedPanelId}
      initialSerializedBatch={initialSerializedBatch}
      key={activeTag ?? 'all'}
      visibleSummaries={visibleSummaries}
    />
  );
}

function DailyPersistentFeedContent({
  activeId,
  activeTag,
  availableTags,
  feedPanelId,
  initialSerializedBatch,
  visibleSummaries,
}: {
  activeId?: string;
  activeTag: string | null;
  availableTags: string[];
  feedPanelId: string;
  initialSerializedBatch: DailySerializedFeedBatch;
  visibleSummaries: DailyFeedSummary[];
}) {
  const [entries, setEntries] = useState<DailySerializedFeedEntry[]>(
    activeTag ? [] : initialSerializedBatch.entries,
  );
  const [nextCursor, setNextCursor] = useState<string | null>(
    activeTag ? null : initialSerializedBatch.nextCursor,
  );
  const [isLoading, setIsLoading] = useState(activeTag !== null);
  const [error, setError] = useState<string | null>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const latestDate = visibleSummaries[0]?.date;
  const filterBaseHref = activeId ? `/daily/${activeId}` : '/daily';
  const resetKey = activeTag ?? 'all';

  const loadInitialTaggedBatch = useCallback(async ({
    signal,
    showPending = true,
  }: {
    signal?: AbortSignal;
    showPending?: boolean;
  } = {}) => {
    if (showPending) {
      setIsLoading(true);
      setError(null);
    }

    try {
      const batch = await fetchDailyBatch({ signal, tag: activeTag });
      setEntries(batch.entries);
      setNextCursor(batch.nextCursor);
    } catch (loadError) {
      if (signal?.aborted) return;
      setError(loadError instanceof Error ? loadError.message : '加载失败，请稍后重试。');
    } finally {
      if (!signal?.aborted) setIsLoading(false);
    }
  }, [activeTag]);

  useEffect(() => {
    if (activeTag === null) return;

    const controller = new AbortController();
    async function loadTaggedBatch() {
      try {
        const batch = await fetchDailyBatch({ signal: controller.signal, tag: activeTag });
        setEntries(batch.entries);
        setNextCursor(batch.nextCursor);
      } catch (loadError) {
        if (controller.signal.aborted) return;
        setError(loadError instanceof Error ? loadError.message : '加载失败，请稍后重试。');
      } finally {
        if (!controller.signal.aborted) setIsLoading(false);
      }
    }

    void loadTaggedBatch();
    return () => controller.abort();
  }, [activeTag]);

  const loadMore = useCallback(async () => {
    if (!nextCursor || isLoading) return;
    setIsLoading(true);
    setError(null);

    try {
      const batch = await fetchDailyBatch({ cursor: nextCursor, tag: activeTag });
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

  return (
    <DailyFeedPane id={feedPanelId} resetKey={resetKey}>
      <header className={styles.feedHero}>
        <div className="eyebrow">
          <span className={styles.eyebrowRule} />
          NOTE
        </div>
        <h1 className={styles.title}>笔记</h1>
        <p className={styles.description}>
          一些碎片化的小知识点，慢慢拼成对世界的理解。
        </p>
        <div className={styles.meta}>
          <span>{visibleSummaries.length} 条记录</span>
          {latestDate && <span>最近更新 {latestDate}</span>}
        </div>
        <DailyTagFilters
          activeTag={activeTag}
          availableTags={availableTags}
          baseHref={filterBaseHref}
        />
      </header>

      {entries.length === 0 && !isLoading && !error ? (
        <p className={styles.empty}>
          {activeTag ? `还没有「${activeTag}」标签的笔记。` : '还没有发布笔记。'}
        </p>
      ) : (
        entries.map((entry, index) => {
          const year = entry.date.slice(0, 4);
          const previousYear = entries[index - 1]?.date.slice(0, 4);

          return (
            <DailyFeedEntry
              activeId={activeId}
              activeTag={activeTag}
              entry={entry}
              key={entry.id}
              shouldShowYear={previousYear !== year}
            />
          );
        })
      )}

      <div ref={sentinelRef} className={styles.feedSentinel} aria-hidden="true" />
      {isLoading && <p className={styles.feedStatus}>加载中...</p>}
      {error && (
        <div className={styles.feedStatus}>
          <p>{error}</p>
          <button
            className={styles.retryButton}
            type="button"
            onClick={() => {
              if (entries.length === 0) {
                void loadInitialTaggedBatch();
                return;
              }
              void loadMore();
            }}
          >
            重试
          </button>
        </div>
      )}
      {!nextCursor && entries.length > 0 && !isLoading && !error && (
        <p className={styles.feedStatus}>没有更早的笔记了。</p>
      )}
    </DailyFeedPane>
  );
}
