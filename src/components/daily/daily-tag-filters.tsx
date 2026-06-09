'use client';

import Link, { useLinkStatus } from 'next/link';
import { useState } from 'react';
import styles from '##/app/daily/page.module.css';

interface PendingTag {
  from: string | null;
  to: string | null;
}

function TagFilterPendingHint() {
  const { pending } = useLinkStatus();
  return <span aria-hidden="true" className={styles.tagFilterPendingHint} data-link-pending={pending} />;
}

function getTagFilterHref(baseHref: string, tag: string | null) {
  return tag ? `${baseHref}?tag=${encodeURIComponent(tag)}` : baseHref;
}

export function DailyTagFilters({
  activeTag,
  availableTags,
  baseHref,
}: {
  activeTag?: string | null;
  availableTags: string[];
  baseHref: string;
}) {
  const [pendingTag, setPendingTag] = useState<PendingTag | null>(null);
  const currentTag = activeTag ?? null;
  const hasActivePendingTag = pendingTag?.from === currentTag;
  const optimisticActiveTag = hasActivePendingTag ? pendingTag.to : currentTag;

  function renderFilter(tag: string | null, label: string) {
    const isActive = optimisticActiveTag === tag;
    const isPending = hasActivePendingTag && pendingTag.to === tag;

    return (
      <Link
        key={tag ?? 'all'}
        href={getTagFilterHref(baseHref, tag)}
        scroll={false}
        prefetch={true}
        className={styles.tagFilter}
        aria-current={isActive ? 'page' : undefined}
        data-active={isActive}
        data-pending={isPending}
        onNavigate={() => {
          if (currentTag !== tag) setPendingTag({ from: currentTag, to: tag });
        }}
      >
        <span>{label}</span>
        <TagFilterPendingHint />
      </Link>
    );
  }

  return (
    <nav className={styles.tagFilters} aria-label="笔记标签筛选">
      {renderFilter(null, '全部')}
      {availableTags.map((tag) => renderFilter(tag, tag))}
    </nav>
  );
}
