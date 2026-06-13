import { ContentHeader } from '##/components/content/content-header';
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
      <ContentHeader
        backHref={closeHref}
        backLabel="笔记"
        backScroll={false}
        badge={entry.type === 'deep-share' ? '深度分享' : undefined}
        className={styles.detailContentHeader}
        metadata={[{ key: 'date', label: entry.date, dateTime: entry.date }]}
        tags={entry.tags}
        title={entry.title}
      />
      <div className={styles.body}>
        <MarkdownContent assetBasePath="/daily/" content={entry.content} />
      </div>
    </DailyDetailShell>
  );
}

export function DailyDetailLoading({ closeHref }: { closeHref: string }) {
  return (
    <DailyDetailShell closeHref={closeHref}>
      <article className={`${styles.detailArticle} ${styles.detailArticleLoading}`} aria-busy="true">
        <header className={styles.detailHeader}>
          <div className={`${styles.loadingLine} ${styles.loadingDate}`} />
          <div className={`${styles.loadingLine} ${styles.loadingTitle}`} />
          <div className={styles.tags}>
            <span className={`${styles.loadingPill} ${styles.loadingLine}`} />
            <span className={`${styles.loadingPill} ${styles.loadingLine}`} />
          </div>
        </header>
        <div className={styles.detailLoadingBody}>
          <div className={`${styles.loadingLine} ${styles.loadingParagraph}`} />
          <div className={`${styles.loadingLine} ${styles.loadingParagraph}`} />
          <div className={`${styles.loadingLine} ${styles.loadingParagraphShort}`} />
        </div>
      </article>
    </DailyDetailShell>
  );
}
