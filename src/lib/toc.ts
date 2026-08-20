export const BLOG_NAV_HEIGHT = 80;
export const BLOG_ANCHOR_OFFSET = BLOG_NAV_HEIGHT + 24;

export function getRelativeTocTier(depth: number, observedDepths: readonly number[]) {
  const sortedDepths = [...new Set(observedDepths)].sort((left, right) => left - right);
  const depthIndex = sortedDepths.indexOf(depth);

  if (depthIndex === -1) return 0;
  return sortedDepths.length - depthIndex - 1;
}
