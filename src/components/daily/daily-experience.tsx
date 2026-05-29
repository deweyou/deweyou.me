import { DailyVirtualTimeline } from '##/components/daily/virtual-timeline';
import type { DailyEntry, DailyFeedBatch } from '##/lib/daily';
import styles from '##/app/daily/page.module.css';
import { DailyDetail } from './daily-detail';
import { DailyFeedPane } from './daily-feed-pane';
import { DailyServerFeed } from './daily-server-feed';

export function DailyExperience({
  activeId,
  allEntries,
  initialBatch,
  selectedEntry,
}: {
  activeId?: string;
  allEntries: DailyEntry[];
  initialBatch: DailyFeedBatch;
  selectedEntry?: DailyEntry;
}) {
  const latestDate = allEntries[0]?.date;
  const initialLastYear = initialBatch.entries.at(-1)?.date.slice(0, 4) ?? null;
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
        <span>{allEntries.length} 条记录</span>
        {latestDate && <span>最近更新 {latestDate}</span>}
      </div>
    </>
  );

  if (selectedEntry) {
    return (
      <div className="page">
        <section className={`${styles.timelineWide} ${styles.timelineSplitMode}`} aria-label="笔记列表">
          <div className={styles.experienceSplit}>
            <DailyFeedPane>
              <header className={styles.feedHero}>{heroContent}</header>
              <DailyServerFeed entries={initialBatch.entries} activeId={activeId} />
              <DailyVirtualTimeline
                activeId={activeId}
                initialNextCursor={initialBatch.nextCursor}
                initialPreviousYear={initialLastYear}
              />
            </DailyFeedPane>
            <aside className={styles.detailPane} aria-label="笔记详情">
              <DailyDetail entry={selectedEntry} />
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
        {allEntries.length === 0 ? (
          <p className={`${styles.readingColumn} ${styles.empty}`}>还没有发布笔记。</p>
        ) : (
          <div className={styles.experienceFeedOnly}>
            <DailyFeedPane>
              <DailyServerFeed entries={initialBatch.entries} activeId={activeId} />
              <DailyVirtualTimeline
                activeId={activeId}
                initialNextCursor={initialBatch.nextCursor}
                initialPreviousYear={initialLastYear}
              />
            </DailyFeedPane>
          </div>
        )}
      </section>
    </div>
  );
}
