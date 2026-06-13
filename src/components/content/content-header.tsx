import { Badge } from '@deweyou-design/react/badge';
import { ArrowLeftIcon } from '@deweyou-design/react-icons';
import Link from 'next/link';
import type { ReactNode } from 'react';
import styles from './content-header.module.css';

export type ContentHeaderMetadataItem = {
  key: string;
  label: ReactNode;
  dateTime?: string;
};

export function ContentHeader({
  backHref,
  backLabel,
  backScroll,
  badge,
  className,
  metadata,
  tags,
  title,
}: {
  backHref: string;
  backLabel: string;
  backScroll?: boolean;
  badge?: string;
  className?: string;
  metadata: ContentHeaderMetadataItem[];
  tags?: string[];
  title: string;
}) {
  return (
    <header className={className ? `${styles.header} ${className}` : styles.header}>
      <div className={styles.metadataLine}>
        <Link href={backHref} scroll={backScroll} className={styles.backLink}>
          <ArrowLeftIcon size={14} aria-hidden="true" />
          <span>{backLabel}</span>
        </Link>
        {metadata.map((item) => {
          if (item.dateTime) {
            return (
              <time key={item.key} dateTime={item.dateTime} className={styles.metadataItem}>
                {item.label}
              </time>
            );
          }

          return (
            <span key={item.key} className={styles.metadataItem}>
              {item.label}
            </span>
          );
        })}
        {badge && (
          <Badge className={styles.badge} color="primary" shape="pill" variant="soft">
            {badge}
          </Badge>
        )}
      </div>
      <h1 className={styles.title}>{title}</h1>
      {tags && tags.length > 0 && (
        <div className={styles.tags}>
          {tags.map((tag) => (
            <span key={tag} className="dy-tag">
              {tag}
            </span>
          ))}
        </div>
      )}
    </header>
  );
}
