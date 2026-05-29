import { MDXRemote } from 'next-mdx-remote/rsc';
import Link from 'next/link';
import { mdxComponents } from '##/components/blog/mdx-components';
import type { DailyEntry } from '##/lib/daily';
import styles from '##/app/daily/page.module.css';

export function DailyServerFeed({
  activeId,
  activeTag,
  entries,
}: {
  activeId?: string;
  activeTag?: string | null;
  entries: DailyEntry[];
}) {
  const tagQuery = activeTag ? `?tag=${encodeURIComponent(activeTag)}` : '';
  return entries.map((entry, index) => {
    const year = entry.date.slice(0, 4);
    const previousYear = entries[index - 1]?.date.slice(0, 4);
    const shouldShowYear = previousYear !== year;

    return (
      <article
        key={entry.id}
        className={`${styles.entry} ${activeId === entry.id ? styles.entryActive : ''}`}
      >
        <Link
          href={`/daily/${entry.id}${tagQuery}`}
          scroll={false}
          className={styles.entryOverlay}
          aria-label={`打开笔记：${entry.title}`}
        />
        {shouldShowYear && <div className={styles.yearLabel}>{year}</div>}
        <header className={styles.entryHeader}>
          <time dateTime={entry.date} className={styles.date}>
            {entry.date.slice(5)}
          </time>
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
          <MDXRemote source={entry.content} components={mdxComponents} />
        </div>
      </article>
    );
  });
}
