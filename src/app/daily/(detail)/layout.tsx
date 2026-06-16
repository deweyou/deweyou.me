import { Suspense, type ReactNode } from 'react';
import { DailyDetailLayout, FEED_PANEL_ID } from '##/components/daily/daily-detail-layout';
import { DailyFeedPane } from '##/components/daily/daily-feed-pane';
import { DailyPersistentFeed } from '##/components/daily/daily-persistent-feed';
import {
  getAllDailyEntries,
  getAllDailyTags,
  getDailyFeedBatch,
} from '##/lib/daily';
import styles from '##/app/daily/page.module.css';

export default function DailyDetailSharedLayout({ children }: { children: ReactNode }) {
  const entries = getAllDailyEntries();
  const feed = (
    <Suspense
      fallback={(
        <DailyFeedPane id={FEED_PANEL_ID} resetKey="all">
          <p className={styles.feedStatus}>加载中...</p>
        </DailyFeedPane>
      )}
    >
      <DailyPersistentFeed
        availableTags={getAllDailyTags(entries)}
        feedPanelId={FEED_PANEL_ID}
        initialBatch={getDailyFeedBatch()}
        summaries={entries.map((entry) => ({
          date: entry.date,
          tags: entry.tags,
        }))}
      />
    </Suspense>
  );

  return (
    <div className="page">
      <section className={`${styles.timelineWide} ${styles.timelineSplitMode}`} aria-label="笔记列表">
        <DailyDetailLayout
          detail={children}
          feed={feed}
        />
      </section>
    </div>
  );
}
