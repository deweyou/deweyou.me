'use client';

import { useEffect, useRef, useState } from 'react';
import {
  calculateScrollProgressPercent,
  getReachedReadProgressThresholds,
  type ReadProgressThreshold,
} from '##/lib/read-progress';

type ReadProgressContentType = 'article' | 'daily';

interface ReadingProgressProps {
  contentId?: string;
  contentType?: ReadProgressContentType;
  scrollContainerSelector?: string;
  showIndicator?: boolean;
}

declare global {
  interface Window {
    gtag?: (
      command: 'event',
      eventName: string,
      params: {
        content_id: string;
        content_type: ReadProgressContentType;
        percent: ReadProgressThreshold;
      },
    ) => void;
  }
}

export function ReadingProgress({
  contentId,
  contentType,
  scrollContainerSelector,
  showIndicator = true,
}: ReadingProgressProps) {
  const [width, setWidth] = useState(0);
  const reportedThresholds = useRef<Set<ReadProgressThreshold>>(new Set());

  useEffect(() => {
    reportedThresholds.current = new Set();

    const reportProgress = (progressPercent: number) => {
      if (!contentId || !contentType || process.env.NODE_ENV !== 'production') return;
      if (typeof window.gtag !== 'function') return;

      const reachedThresholds = getReachedReadProgressThresholds(
        progressPercent,
        reportedThresholds.current,
      );

      for (const percent of reachedThresholds) {
        reportedThresholds.current.add(percent);
        window.gtag('event', 'content_read_progress', {
          content_id: contentId,
          content_type: contentType,
          percent,
        });
      }
    };

    const getScrollRoot = () => {
      if (!scrollContainerSelector) return document.documentElement;
      const scrollRoot = document.querySelector<HTMLElement>(scrollContainerSelector);
      if (!scrollRoot || scrollRoot.scrollHeight <= scrollRoot.clientHeight) return document.documentElement;
      return scrollRoot;
    };

    const update = () => {
      const el = getScrollRoot();
      const scrollTop = el === document.documentElement
        ? window.scrollY || document.documentElement.scrollTop
        : el.scrollTop;
      const clientHeight = el === document.documentElement
        ? window.innerHeight
        : el.clientHeight;
      const scrollHeight = el === document.documentElement
        ? document.documentElement.scrollHeight
        : el.scrollHeight;
      const progressPercent = calculateScrollProgressPercent({
        scrollTop,
        scrollHeight,
        clientHeight,
      });

      if (showIndicator) setWidth(progressPercent);
      reportProgress(progressPercent);
    };

    const scrollRoot = scrollContainerSelector
      ? document.querySelector<HTMLElement>(scrollContainerSelector)
      : null;

    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    scrollRoot?.addEventListener('scroll', update, { passive: true });
    update();

    return () => {
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
      scrollRoot?.removeEventListener('scroll', update);
    };
  }, [contentId, contentType, scrollContainerSelector, showIndicator]);

  if (!showIndicator) return null;
  return <div className="read-progress" style={{ width: `${width}%` }} />;
}
