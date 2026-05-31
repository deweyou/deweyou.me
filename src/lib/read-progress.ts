export const READ_PROGRESS_THRESHOLDS = [25, 50, 75, 100] as const;

export type ReadProgressThreshold = (typeof READ_PROGRESS_THRESHOLDS)[number];

interface ScrollProgressMetrics {
  scrollTop: number;
  scrollHeight: number;
  clientHeight: number;
}

export function calculateScrollProgressPercent({
  scrollTop,
  scrollHeight,
  clientHeight,
}: ScrollProgressMetrics): number {
  const scrollableHeight = scrollHeight - clientHeight;
  if (scrollableHeight <= 0) return 0;

  const progress = (scrollTop / scrollableHeight) * 100;
  return Math.min(100, Math.max(0, Math.round(progress)));
}

export function getReachedReadProgressThresholds(
  progressPercent: number,
  reportedThresholds: ReadonlySet<ReadProgressThreshold>,
): ReadProgressThreshold[] {
  return READ_PROGRESS_THRESHOLDS.filter(
    (threshold) => progressPercent >= threshold && !reportedThresholds.has(threshold),
  );
}
