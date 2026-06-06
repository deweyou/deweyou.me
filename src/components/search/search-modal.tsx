'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { forwardRef, useEffect, useId, useMemo, useRef, useState } from 'react';
import { Dialog } from '@deweyou-design/react/dialog';
import { Input } from '@deweyou-design/react/input';
import {
  createSearchSnippet,
  loadMiniSearch,
  shouldIgnoreSearchNavigationKey,
  splitHighlightText,
  type SearchDocument,
  type SearchPayload,
} from '##/lib/search-core';
import styles from './search-modal.module.css';

type SearchStatus = 'idle' | 'loading' | 'ready' | 'error';

interface SearchModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SearchModal({ open, onOpenChange }: SearchModalProps) {
  const inputId = useId();
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [payload, setPayload] = useState<SearchPayload | null>(null);
  const [loadFailed, setLoadFailed] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const resultRefs = useRef<Array<HTMLAnchorElement | null>>([]);

  useEffect(() => {
    if (!open || payload) return;
    const controller = new AbortController();

    fetch('/search-index.json', { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error(`Failed to load search index: ${response.status}`);
        return response.json() as Promise<SearchPayload>;
      })
      .then((nextPayload) => {
        setPayload(nextPayload);
        setLoadFailed(false);
      })
      .catch((error: unknown) => {
        if ((error as { name?: string }).name === 'AbortError') return;
        setLoadFailed(true);
      });

    return () => controller.abort();
  }, [open, payload]);

  const miniSearch = useMemo(() => {
    if (!payload) return null;
    return loadMiniSearch(payload.index);
  }, [payload]);

  const trimmedQuery = query.trim();
  const results = useMemo(() => {
    if (!miniSearch || !payload || trimmedQuery.length === 0) return [];
    return miniSearch.search(trimmedQuery)
      .slice(0, 12)
      .map((result) => payload.documents[String(result.id)])
      .filter((document): document is SearchDocument => Boolean(document));
  }, [miniSearch, payload, trimmedQuery]);

  const status: SearchStatus = !open
    ? 'idle'
    : payload
      ? 'ready'
      : loadFailed
        ? 'error'
        : 'loading';

  const handleQueryChange = (nextQuery: string) => {
    setQuery(nextQuery);
    setActiveIndex(0);
  };

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      setQuery('');
      setActiveIndex(0);
    }
    onOpenChange(nextOpen);
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (shouldIgnoreSearchNavigationKey({
      key: event.key,
      isComposing: event.nativeEvent.isComposing,
      keyCode: event.nativeEvent.keyCode,
    })) {
      return;
    }

    if (results.length === 0) return;

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setActiveIndex((index) => Math.min(results.length - 1, index + 1));
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault();
      setActiveIndex((index) => Math.max(0, index - 1));
    }

    if (event.key === 'Enter') {
      event.preventDefault();
      const activeResult = results[activeIndex];
      if (!activeResult) return;
      handleOpenChange(false);
      router.push(activeResult.href);
    }
  };

  useEffect(() => {
    const activeResult = resultRefs.current[activeIndex];
    const resultsList = activeResult?.closest('[role="listbox"]');
    if (!activeResult || !resultsList) return;

    const activeRect = activeResult.getBoundingClientRect();
    const listRect = resultsList.getBoundingClientRect();
    const isFullyVisible = activeRect.top >= listRect.top && activeRect.bottom <= listRect.bottom;
    if (isFullyVisible) return;

    activeResult.scrollIntoView({
      block: 'nearest',
      inline: 'nearest',
    });
  }, [activeIndex]);

  return (
    <Dialog.Root open={open} onOpenChange={handleOpenChange}>
      <Dialog.Content aria-label="站内搜索" className={styles.panel}>
        <div className={styles.shell} onKeyDown={handleKeyDown}>
          <Dialog.Title className={styles.visuallyHidden}>站内搜索</Dialog.Title>
          <div className={styles.searchBar}>
            <i className={`ti ti-search ${styles.searchIcon}`} aria-hidden="true" />
            <Input
              aria-label="搜索文章和笔记"
              autoComplete="off"
              autoFocus
              className={styles.input}
              id={inputId}
              onChange={(event) => handleQueryChange(event.currentTarget.value)}
              placeholder="搜索..."
              size="lg"
              value={query}
              variant="ghost"
            />
            <Dialog.CloseButton aria-label="关闭搜索" className={styles.closeBtn} />
          </div>

          {renderBody({
            onOpenChange: handleOpenChange,
            query: trimmedQuery,
            results,
            status,
            activeIndex,
            resultRefs,
            setActiveIndex,
          })}

          <div className={styles.footer} aria-hidden="true">
            <span>↑↓ 选择</span>
            <span>Enter 打开 · Esc 关闭</span>
          </div>
        </div>
      </Dialog.Content>
    </Dialog.Root>
  );
}

function renderBody({
  activeIndex,
  onOpenChange,
  query,
  results,
  resultRefs,
  setActiveIndex,
  status,
}: {
  activeIndex: number;
  onOpenChange: (open: boolean) => void;
  query: string;
  results: SearchDocument[];
  resultRefs: React.MutableRefObject<Array<HTMLAnchorElement | null>>;
  setActiveIndex: (index: number) => void;
  status: SearchStatus;
}) {
  if (status === 'loading') {
    return <div className={styles.state}>正在加载搜索索引...</div>;
  }

  if (status === 'error') {
    return <div className={styles.state}>搜索索引加载失败。请稍后重试。</div>;
  }

  if (query.length === 0) {
    return <div className={styles.state}>输入关键词开始查找。</div>;
  }

  if (results.length === 0) {
    return <div className={styles.state}>没有找到匹配内容。</div>;
  }

  return (
    <div className={styles.results} role="listbox" aria-label="搜索结果">
      {results.map((result, index) => (
        <SearchResultRow
          active={index === activeIndex}
          document={result}
          key={result.id}
          onActivate={() => setActiveIndex(index)}
          onOpen={() => onOpenChange(false)}
          query={query}
          ref={(node) => {
            resultRefs.current[index] = node;
          }}
        />
      ))}
    </div>
  );
}

const SearchResultRow = forwardRef<HTMLAnchorElement, {
  active: boolean;
  document: SearchDocument;
  onActivate: () => void;
  onOpen: () => void;
  query: string;
}>(function SearchResultRow({
  active,
  document,
  onActivate,
  onOpen,
  query,
}, ref) {
  const snippet = createSearchSnippet(`${document.excerpt ?? ''} ${document.body}`.trim() || document.title, query, 108);

  return (
    <Link
      className={styles.result}
      data-active={active}
      href={document.href}
      onClick={onOpen}
      onFocus={onActivate}
      onMouseEnter={onActivate}
      role="option"
      aria-selected={active}
      ref={ref}
    >
      <div className={styles.meta}>
        <span>{getSourceLabel(document.source)}</span>
        <span>{document.date}</span>
        {document.tags.slice(0, 2).map((tag) => (
          <span key={tag}>{tag}</span>
        ))}
      </div>
      <p className={styles.title}>{document.title}</p>
      <p className={styles.snippet}>
        {snippet.hasPrefix && <span>...</span>}
        {splitHighlightText(snippet.text, query).map((part, index) => (
          part.highlight ? <mark key={`${part.text}-${index}`}>{part.text}</mark> : <span key={`${part.text}-${index}`}>{part.text}</span>
        ))}
        {snippet.hasSuffix && <span>...</span>}
      </p>
    </Link>
  );
});

function getSourceLabel(source: string): string {
  if (source === 'post') return '文章';
  if (source === 'daily') return '笔记';
  return source;
}
