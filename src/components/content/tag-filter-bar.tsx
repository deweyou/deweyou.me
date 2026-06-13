'use client';

import Link from 'next/link';
import styles from './tag-filter-bar.module.css';

export interface TagFilterBarItem {
  id: string;
  label: string;
  active?: boolean;
  count?: number;
  href?: string;
  prefetch?: boolean;
}

export function TagFilterBar({
  ariaLabel,
  items,
  onItemClick,
}: {
  ariaLabel: string;
  items: TagFilterBarItem[];
  onItemClick?: (item: TagFilterBarItem) => void;
}) {
  function renderContent(item: TagFilterBarItem) {
    return (
      <>
        <span>{item.label}</span>
        {typeof item.count === 'number' && <span className={styles.count}>{item.count}</span>}
      </>
    );
  }

  return (
    <nav className={styles.bar} aria-label={ariaLabel}>
      {items.map((item) => {
        const isActive = item.active === true;

        if (item.href) {
          return (
            <Link
              key={item.id}
              href={item.href}
              scroll={false}
              prefetch={item.prefetch}
              className={styles.item}
              aria-current={isActive ? 'page' : undefined}
              data-active={isActive}
              onClick={() => onItemClick?.(item)}
            >
              {renderContent(item)}
            </Link>
          );
        }

        return (
          <button
            key={item.id}
            type="button"
            className={styles.item}
            aria-pressed={isActive}
            data-active={isActive}
            onClick={() => onItemClick?.(item)}
          >
            {renderContent(item)}
          </button>
        );
      })}
    </nav>
  );
}
