'use client';

import { Button } from '@deweyou-design/react/button';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  XIcon,
} from '@deweyou-design/react-icons';
import { useEffect, useLayoutEffect, useRef, useState, type MouseEvent, type ReactNode } from 'react';
import styles from '##/app/daily/page.module.css';

const FEED_PANEL_ID = 'daily-feed-panel';
const FEED_COLLAPSED_KEY = 'daily-detail-feed-collapsed';
const DAILY_ENTRY_LINK_SELECTOR = '[data-daily-entry-link="true"]';

export function DailyDetailLayout({
  detail,
  feed,
  navigationKey,
}: {
  detail: ReactNode;
  feed: ReactNode;
  navigationKey: string;
}) {
  const detailPaneRef = useRef<HTMLElement>(null);
  const [isFeedCollapsed, setIsFeedCollapsed] = useState(false);
  const [isFeedDrawerOpen, setIsFeedDrawerOpen] = useState(false);
  const [hasLoadedFeedPreference, setHasLoadedFeedPreference] = useState(false);

  useLayoutEffect(() => {
    detailPaneRef.current?.scrollTo(0, 0);
    window.scrollTo(0, 0);
  }, [navigationKey]);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      setIsFeedCollapsed(window.sessionStorage.getItem(FEED_COLLAPSED_KEY) === 'true');
      setHasLoadedFeedPreference(true);
    });

    return () => window.cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    if (!hasLoadedFeedPreference) return;
    window.sessionStorage.setItem(FEED_COLLAPSED_KEY, String(isFeedCollapsed));
  }, [hasLoadedFeedPreference, isFeedCollapsed]);

  useEffect(() => {
    if (!isFeedDrawerOpen) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsFeedDrawerOpen(false);
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFeedDrawerOpen]);

  function handleSplitClick(event: MouseEvent<HTMLDivElement>) {
    if (!isFeedDrawerOpen) return;
    const target = event.target;
    if (!(target instanceof Element)) return;

    const entryLink = target.closest(DAILY_ENTRY_LINK_SELECTOR);
    if (entryLink) {
      setIsFeedDrawerOpen(false);
    }
  }

  return (
    <div
      className={styles.experienceSplit}
      data-feed-collapsed={isFeedCollapsed}
      data-feed-drawer-open={isFeedDrawerOpen}
      onClick={handleSplitClick}
    >
      <div className={styles.feedSlot}>
        <div className={styles.feedDrawerHeader}>
          <span className={styles.feedDrawerTitle}>笔记列表</span>
          <Button.Icon
            aria-label="关闭笔记列表"
            className={styles.feedDrawerCloseButton}
            icon={<XIcon size={18} aria-hidden="true" />}
            onClick={() => setIsFeedDrawerOpen(false)}
            size="sm"
            variant="ghost"
          />
        </div>
        {feed}
      </div>

      <aside ref={detailPaneRef} className={styles.detailPane} aria-label="笔记详情">
        {detail}
      </aside>

      <button
        type="button"
        aria-hidden="true"
        className={styles.feedDrawerScrim}
        onClick={() => setIsFeedDrawerOpen(false)}
        tabIndex={-1}
      />

      <Button.Icon
        aria-controls={FEED_PANEL_ID}
        aria-expanded={!isFeedCollapsed}
        aria-label={isFeedCollapsed ? '展开笔记列表' : '收起笔记列表'}
        className={`${styles.feedToggleButton} ${styles.floatingFeedToggle} ${styles.desktopFloatingFeedToggle}`}
        icon={
          isFeedCollapsed ? (
            <ChevronRightIcon size={18} aria-hidden="true" />
          ) : (
            <ChevronLeftIcon size={18} aria-hidden="true" />
          )
        }
        onClick={() => setIsFeedCollapsed((current) => !current)}
        size="sm"
        variant="ghost"
      />
      <Button.Icon
        aria-controls={FEED_PANEL_ID}
        aria-expanded={isFeedDrawerOpen}
        aria-label="打开笔记列表"
        className={`${styles.feedToggleButton} ${styles.floatingFeedToggle} ${styles.mobileFloatingFeedToggle}`}
        icon={<ChevronRightIcon size={18} aria-hidden="true" />}
        onClick={() => setIsFeedDrawerOpen(true)}
        size="sm"
        variant="ghost"
      />
    </div>
  );
}

export { FEED_PANEL_ID };
