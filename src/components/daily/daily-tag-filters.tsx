'use client';

import { useState } from 'react';
import { TagFilterBar, type TagFilterBarItem } from '##/components/content/tag-filter-bar';

interface PendingTag {
  from: string | null;
  to: string | null;
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
  const filterItems: TagFilterBarItem[] = [
    {
      id: 'all',
      label: '全部',
      active: optimisticActiveTag === null,
      href: getTagFilterHref(baseHref, null),
      prefetch: true,
    },
    ...availableTags.map((tag) => ({
      id: tag,
      label: tag,
      active: optimisticActiveTag === tag,
      href: getTagFilterHref(baseHref, tag),
      prefetch: true,
    })),
  ];

  function handleItemClick(item: TagFilterBarItem) {
    const nextTag = item.id === 'all' ? null : item.id;
    if (currentTag !== nextTag) setPendingTag({ from: currentTag, to: nextTag });
  }

  return (
    <TagFilterBar
      ariaLabel="笔记标签筛选"
      items={filterItems}
      onItemClick={handleItemClick}
    />
  );
}
