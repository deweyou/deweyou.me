import Link from 'next/link';
import { DailyVirtualTimeline } from '##/components/daily/virtual-timeline';
import type { DailyEntry, DailyFeedBatch } from '##/lib/daily';
import styles from '##/app/daily/page.module.css';
import { DailyDetail } from './daily-detail';
import { DailyDetailLayout, FEED_PANEL_ID } from './daily-detail-layout';
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
  const filterBaseHref = activeId ? `/daily/${activeId}` : '/daily';
  const navigationKey = `${activeId ?? 'index'}:${activeTag ?? 'all'}`;
  const filterContent = (
    <nav className={styles.tagFilters} aria-label="笔记标签筛选">
      <Link
        href={filterBaseHref}
        scroll={false}
        className={styles.tagFilter}
        data-active={!activeTag}
      >
        全部
      </Link>
      {availableTags.map((tag) => (
        <Link
          key={tag}
          href={`${filterBaseHref}?tag=${encodeURIComponent(tag)}`}
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
        一些碎片化的小知识点，慢慢拼成对世界的理解。
      </p>
      <div className={styles.meta}>
        <span>{visibleEntries.length} 条记录</span>
        {latestDate && <span>最近更新 {latestDate}</span>}
      </div>
      {filterContent}
    </>
  );

  if (selectedEntry) {
    const feed = (
      <DailyFeedPane id={FEED_PANEL_ID} resetKey={navigationKey}>
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
    );

    return (
      <div className="page">
        <section className={`${styles.timelineWide} ${styles.timelineSplitMode}`} aria-label="笔记列表">
          <DailyDetailLayout
            detail={<DailyDetail closeHref={`/daily${activeTagQuery}`} entry={selectedEntry} />}
            feed={feed}
            navigationKey={navigationKey}
          />
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
            <DailyFeedPane resetKey={navigationKey}>
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
