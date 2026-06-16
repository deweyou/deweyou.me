'use client';

import { Button } from '@deweyou-design/react/button';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
} from '@deweyou-design/react-icons';
import { usePathname } from 'next/navigation';
import { useEffect, useLayoutEffect, useRef, useState, type MouseEvent, type ReactNode } from 'react';
import styles from '##/app/daily/page.module.css';

const FEED_PANEL_ID = 'daily-feed-panel';
const FEED_COLLAPSED_KEY = 'daily-detail-feed-collapsed';
const DAILY_ENTRY_LINK_SELECTOR = '[data-daily-entry-link="true"]';
const FEED_COLLAPSE_TRANSITION_MS = 420;

type FeedTransitionState = 'idle' | 'collapsing' | 'expanding';

export function DailyDetailLayout({
  detail,
  feed,
}: {
  detail: ReactNode;
  feed: ReactNode;
}) {
  const pathname = usePathname();
  const navigationKey = pathname;
  const detailPaneRef = useRef<HTMLElement>(null);
  const feedTransitionTimerRef = useRef<number | null>(null);
  const [isFeedCollapsed, setIsFeedCollapsed] = useState(false);
  const [isFeedDrawerOpen, setIsFeedDrawerOpen] = useState(false);
  const [feedTransitionState, setFeedTransitionState] = useState<FeedTransitionState>('idle');
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

  useEffect(() => () => {
    if (feedTransitionTimerRef.current !== null) {
      window.clearTimeout(feedTransitionTimerRef.current);
    }
  }, []);

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

  function clearFeedTransitionTimer() {
    if (feedTransitionTimerRef.current === null) return;
    window.clearTimeout(feedTransitionTimerRef.current);
    feedTransitionTimerRef.current = null;
  }

  function handleFeedToggle() {
    if (feedTransitionState !== 'idle') return;

    clearFeedTransitionTimer();
    if (isFeedCollapsed) {
      setIsFeedCollapsed(false);
      setFeedTransitionState('expanding');
      feedTransitionTimerRef.current = window.setTimeout(() => {
        setFeedTransitionState('idle');
        feedTransitionTimerRef.current = null;
      }, FEED_COLLAPSE_TRANSITION_MS);
      return;
    }

    setFeedTransitionState('collapsing');
    feedTransitionTimerRef.current = window.setTimeout(() => {
      setIsFeedCollapsed(true);
      setFeedTransitionState('idle');
      feedTransitionTimerRef.current = null;
    }, FEED_COLLAPSE_TRANSITION_MS);
  }

  const isFeedVisuallyCollapsed = isFeedCollapsed || feedTransitionState === 'collapsing';

  return (
    <div
      className={styles.experienceSplit}
      data-feed-collapsed={isFeedCollapsed}
      data-feed-drawer-open={isFeedDrawerOpen}
      data-feed-transition-state={feedTransitionState}
      onClick={handleSplitClick}
    >
      <div className={styles.feedSlot}>
        <div className={styles.feedDrawerHeader}>
          <span className={styles.feedDrawerTitle}>笔记列表</span>
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
        aria-expanded={!isFeedVisuallyCollapsed}
        aria-label={isFeedVisuallyCollapsed ? '展开笔记列表' : '收起笔记列表'}
        className={`${styles.feedToggleButton} ${styles.floatingFeedToggle} ${styles.desktopFloatingFeedToggle}`}
        icon={
          isFeedVisuallyCollapsed ? (
            <ChevronRightIcon size={18} aria-hidden="true" />
          ) : (
            <ChevronLeftIcon size={18} aria-hidden="true" />
          )
        }
        onClick={handleFeedToggle}
        size="sm"
        variant="ghost"
      />
      <Button.Icon
        aria-controls={FEED_PANEL_ID}
        aria-expanded={isFeedDrawerOpen}
        aria-label={isFeedDrawerOpen ? '收起笔记列表' : '打开笔记列表'}
        className={`${styles.feedToggleButton} ${styles.floatingFeedToggle} ${styles.mobileFloatingFeedToggle}`}
        icon={
          isFeedDrawerOpen ? (
            <ChevronLeftIcon size={18} aria-hidden="true" />
          ) : (
            <ChevronRightIcon size={18} aria-hidden="true" />
          )
        }
        onClick={() => setIsFeedDrawerOpen((isOpen) => !isOpen)}
        size="sm"
        variant="ghost"
      />
    </div>
  );
}

export { FEED_PANEL_ID };
