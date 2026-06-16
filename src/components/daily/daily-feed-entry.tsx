'use client';

import { Badge } from '@deweyou-design/react/badge';
import Link from 'next/link';
import { MarkdownContent } from '##/components/markdown-content';
import type { DailyEntry } from '##/lib/daily';
import type { DailySerializedFeedEntry } from '##/lib/daily-feed';
import styles from '##/app/daily/page.module.css';

type DailyFeedEntryData = DailyEntry | DailySerializedFeedEntry;

export function DailyFeedEntry({
  activeId,
  activeTag,
  entry,
  shouldShowYear,
}: {
  activeId?: string;
  activeTag?: string | null;
  entry: DailyFeedEntryData;
  shouldShowYear: boolean;
}) {
  const tagQuery = activeTag ? `?tag=${encodeURIComponent(activeTag)}` : '';

  return (
    <article
      className={`${styles.entry} ${activeId === entry.id ? styles.entryActive : ''}`}
    >
      <Link
        href={`/daily/${entry.id}${tagQuery}`}
        scroll={false}
        className={styles.entryOverlay}
        data-daily-entry-link="true"
        aria-label={`打开笔记：${entry.title}`}
      />
      {shouldShowYear && <div className={styles.yearLabel}>{entry.date.slice(0, 4)}</div>}
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
        <MarkdownContent assetBasePath="/daily/" content={entry.content} />
      </div>
    </article>
  );
}
