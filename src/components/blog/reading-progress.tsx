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

    const update = () => {
      const el = document.documentElement;
      const progressPercent = calculateScrollProgressPercent({
        scrollTop: el.scrollTop,
        scrollHeight: el.scrollHeight,
        clientHeight: el.clientHeight,
      });

      if (showIndicator) setWidth(progressPercent);
      reportProgress(progressPercent);
    };

    window.addEventListener('scroll', update, { passive: true });
    update();

    return () => window.removeEventListener('scroll', update);
  }, [contentId, contentType, showIndicator]);

  if (!showIndicator) return null;
  return <div className="read-progress" style={{ width: `${width}%` }} />;
}
