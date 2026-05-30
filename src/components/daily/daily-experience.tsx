import Link from 'next/link';
import { DailyVirtualTimeline } from '##/components/daily/virtual-timeline';
import type { DailyEntry, DailyFeedBatch } from '##/lib/daily';
import styles from '##/app/daily/page.module.css';
import { DailyDetail } from './daily-detail';
import { DailyFeedPane } from './daily-feed-pane';
import { DailyServerFeed } from './daily-server-feed';

export function DailyExperience({
  activeId,
  activeTag,
  availableTags,
  initialBatch,
  selectedEntry,
  visibleEntries,
}: {
  activeId?: string;
  activeTag?: string | null;
  availableTags: string[];
  initialBatch: DailyFeedBatch;
  selectedEntry?: DailyEntry;
  visibleEntries: DailyEntry[];
}) {
  const latestDate = visibleEntries[0]?.date;
  const initialLastYear = initialBatch.entries.at(-1)?.date.slice(0, 4) ?? null;
  const activeTagQuery = activeTag ? `?tag=${encodeURIComponent(activeTag)}` : '';
  const filterContent = (
    <nav className={styles.tagFilters} aria-label="笔记标签筛选">
      <Link
        href="/daily"
        scroll={false}
        className={styles.tagFilter}
        data-active={!activeTag}
      >
        全部
      </Link>
      {availableTags.map((tag) => (
        <Link
          key={tag}
          href={`/daily?tag=${encodeURIComponent(tag)}`}
          scroll={false}
          className={styles.tagFilter}
          data-active={activeTag === tag}
        >
          {tag}
        </Link>
      ))}
    </nav>
  );
  const heroContent = (
    <>
      <div className="eyebrow">
        <span className={styles.eyebrowRule} />
        NOTE
      </div>
      <h1 className={styles.title}>笔记</h1>
      <p className={styles.description}>
        随手记录一些概念、方法和观察，留给之后的自己回看。
      </p>
      <div className={styles.meta}>
        <span>{visibleEntries.length} 条记录</span>
        {latestDate && <span>最近更新 {latestDate}</span>}
      </div>
      {filterContent}
    </>
  );

  if (selectedEntry) {
    return (
      <div className="page">
        <section className={`${styles.timelineWide} ${styles.timelineSplitMode}`} aria-label="笔记列表">
          <div className={styles.experienceSplit}>
            <DailyFeedPane activeTag={activeTag}>
              <header className={styles.feedHero}>{heroContent}</header>
              <DailyServerFeed
                activeId={activeId}
                activeTag={activeTag}
                entries={initialBatch.entries}
              />
              <DailyVirtualTimeline
                activeId={activeId}
                activeTag={activeTag}
                initialNextCursor={initialBatch.nextCursor}
                initialPreviousYear={initialLastYear}
                key={`daily-timeline-${activeTag ?? 'all'}-${initialBatch.nextCursor ?? 'end'}`}
              />
            </DailyFeedPane>
            <aside className={styles.detailPane} aria-label="笔记详情">
              <DailyDetail closeHref={`/daily${activeTagQuery}`} entry={selectedEntry} />
            </aside>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="page">
      <section className={`container ${styles.hero}`}>
        <div className={styles.readingColumn}>{heroContent}</div>
      </section>

      <section className={`container ${styles.timeline}`} aria-label="笔记列表">
        {visibleEntries.length === 0 ? (
          <p className={`${styles.readingColumn} ${styles.empty}`}>
            {activeTag ? `还没有「${activeTag}」标签的笔记。` : '还没有发布笔记。'}
          </p>
        ) : (
          <div className={styles.experienceFeedOnly}>
            <DailyFeedPane activeTag={activeTag}>
              <DailyServerFeed
                activeId={activeId}
                activeTag={activeTag}
                entries={initialBatch.entries}
              />
              <DailyVirtualTimeline
                activeId={activeId}
                activeTag={activeTag}
                initialNextCursor={initialBatch.nextCursor}
                initialPreviousYear={initialLastYear}
                key={`daily-timeline-${activeTag ?? 'all'}-${initialBatch.nextCursor ?? 'end'}`}
              />
            </DailyFeedPane>
          </div>
        )}
      </section>
    </div>
  );
}
