import { MDXRemote } from 'next-mdx-remote/rsc';
import { mdxComponents } from '##/components/blog/mdx-components';
import type { DailyEntry } from '##/lib/daily';
import styles from '##/app/daily/page.module.css';
import { DailyDetailShell } from './daily-detail-shell';

export function DailyDetail({ closeHref, entry }: { closeHref: string; entry: DailyEntry }) {
  return (
    <DailyDetailShell closeHref={closeHref}>
      <header className={styles.detailHeader}>
        <time dateTime={entry.date} className={styles.date}>
          {entry.date}
        </time>
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
        <MDXRemote source={entry.content} components={mdxComponents} />
      </div>
    </DailyDetailShell>
  );
}
