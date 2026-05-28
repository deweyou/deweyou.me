import { MDXRemote } from 'next-mdx-remote/rsc';
import { mdxComponents } from '##/components/blog/mdx-components';
import { DailyVirtualTimeline } from '##/components/daily/virtual-timeline';
import type { DailyEntry } from '##/lib/daily';
import { getAllDailyEntries, groupDailyEntriesByYear } from '##/lib/daily';
import styles from './page.module.css';

export const metadata = {
  title: '笔记 — Dewey Ou',
  description: 'Dewey Ou 的笔记归档。',
};

function estimateDailyEntrySize(entry: DailyEntry) {
  return Math.min(920, Math.max(360, 260 + Math.ceil(entry.content.length / 3)));
}

export default function DailyPage() {
  const entries = getAllDailyEntries();
  const groups = groupDailyEntriesByYear(entries);
  const latestDate = entries[0]?.date;
  const firstSlugByYear = new Map(groups.map((group) => [group.year, group.entries[0]?.slug]));

  return (
    <div className="page">
      <section className={`container ${styles.hero}`}>
        <div className={styles.readingColumn}>
          <div className="eyebrow">
            <span className={styles.eyebrowRule} />
            NOTE
          </div>
          <h1 className={styles.title}>笔记</h1>
          <p className={styles.description}>
            随手记录一些概念、方法和观察，留给之后的自己回看。
          </p>
          <div className={styles.meta}>
            <span>{entries.length} 条记录</span>
            {latestDate && <span>最近更新 {latestDate}</span>}
          </div>
        </div>
      </section>

      <section className={`container ${styles.timeline}`} aria-label="笔记列表">
        {entries.length === 0 ? (
          <p className={`${styles.readingColumn} ${styles.empty}`}>还没有发布笔记。</p>
        ) : (
          <DailyVirtualTimeline
            entries={entries.map((entry) => ({
              estimatedSize: estimateDailyEntrySize(entry),
              slug: entry.slug,
            }))}
          >
            {entries.map((entry) => {
              const year = entry.date.slice(0, 4);
              const shouldShowYear = firstSlugByYear.get(year) === entry.slug;

              return (
                <article key={entry.slug} className={styles.entry} id={entry.slug}>
                  {shouldShowYear && <div className={styles.yearLabel}>{year}</div>}
                  <header className={styles.entryHeader}>
                    <time dateTime={entry.date} className={styles.date}>
                      {entry.date.slice(5)}
                    </time>
                    <h2 className={styles.entryTitle}>
                      <a href={`#${entry.slug}`} className={styles.entryAnchor}>
                        {entry.title}
                      </a>
                    </h2>
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
            })}
          </DailyVirtualTimeline>
        )}
      </section>
    </div>
  );
}
