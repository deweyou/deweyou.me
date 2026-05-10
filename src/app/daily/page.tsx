import { MDXRemote } from 'next-mdx-remote/rsc';
import { mdxComponents } from '##/components/blog/mdx-components';
import { getAllDailyEntries, groupDailyEntriesByYear } from '##/lib/daily';
import styles from './page.module.css';

export const metadata = {
  title: '笔记 — Dewey Ou',
  description: 'Dewey Ou 的笔记归档。',
};

export default function DailyPage() {
  const entries = getAllDailyEntries();
  const groups = groupDailyEntriesByYear(entries);
  const latestDate = entries[0]?.date;

  return (
    <div className="page">
      <section className={`container container-sm ${styles.hero}`}>
        <div className="eyebrow">
          <span className={styles.eyebrowRule} />
          AI DAILY
        </div>
        <h1 className={styles.title}>笔记</h1>
        <p className={styles.description}>
          随手记录一些概念、方法和观察，留给之后的自己回看。
        </p>
        <div className={styles.meta}>
          <span>{entries.length} 条记录</span>
          {latestDate && <span>最近更新 {latestDate}</span>}
        </div>
      </section>

      <section className={`container container-sm ${styles.timeline}`} aria-label="笔记列表">
        {entries.length === 0 ? (
          <p className={styles.empty}>还没有发布笔记。</p>
        ) : (
          groups.map((group) => (
            <div key={group.year} className={styles.yearGroup}>
              <div className={styles.yearLabel}>{group.year}</div>
              <div className={styles.entries}>
                {group.entries.map((entry) => (
                  <article key={entry.slug} className={styles.entry} id={entry.slug}>
                    <header className={styles.entryHeader}>
                      <time dateTime={entry.date} className={styles.date}>
                        {entry.date.slice(5)}
                      </time>
                      <h2 className={styles.entryTitle}>
                        <a href={`#${entry.slug}`} className={styles.entryAnchor} aria-label={`定位到 ${entry.title}`}>
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
                ))}
              </div>
            </div>
          ))
        )}
      </section>
    </div>
  );
}
