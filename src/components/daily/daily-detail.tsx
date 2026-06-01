import { Badge } from '@deweyou-design/react/badge';
import { MarkdownContent } from '##/components/markdown-content';
import { ReadingProgress } from '##/components/blog/reading-progress';
import type { DailyEntry } from '##/lib/daily';
import styles from '##/app/daily/page.module.css';
import { DailyDetailShell } from './daily-detail-shell';

export function DailyDetail({ closeHref, entry }: { closeHref: string; entry: DailyEntry }) {
  return (
    <DailyDetailShell closeHref={closeHref}>
      <ReadingProgress
        contentId={entry.id}
        contentType="daily"
        scrollContainerSelector="[aria-label='笔记详情']"
        showIndicator={false}
      />
      <header className={styles.detailHeader}>
        <div className={styles.entryMetaLine}>
          <time dateTime={entry.date} className={styles.date}>
            {entry.date}
          </time>
          {entry.type === 'deep-share' && (
            <Badge className={styles.entryTypeLabel} color="primary" shape="pill" variant="soft">
              深度分享
            </Badge>
          )}
        </div>
        <h1 className={styles.detailTitle}>{entry.title}</h1>
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
    </DailyDetailShell>
  );
}
