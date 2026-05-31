'use client';

import { Button } from '@deweyou-design/react/button';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  XIcon,
} from '@deweyou-design/react-icons';
import { useEffect, useState, type MouseEvent, type ReactNode } from 'react';
import styles from '##/app/daily/page.module.css';

const FEED_PANEL_ID = 'daily-feed-panel';
const FEED_COLLAPSED_KEY = 'daily-detail-feed-collapsed';

export function DailyDetailLayout({
  detail,
  feed,
}: {
  detail: ReactNode;
  feed: ReactNode;
}) {
  const [isFeedCollapsed, setIsFeedCollapsed] = useState(false);
  const [isFeedDrawerOpen, setIsFeedDrawerOpen] = useState(false);
  const [hasLoadedFeedPreference, setHasLoadedFeedPreference] = useState(false);

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

    const feedLink = target.closest(`.${styles.feedPane} a`);
    if (feedLink) {
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

      <aside className={styles.detailPane} aria-label="笔记详情">
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
