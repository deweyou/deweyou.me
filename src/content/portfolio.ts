import { PHOTO_SERIES, qiniuThumb, type PhotoSeries } from './photos';

export interface PortfolioItem {
  id: string;
  tag: string;
  title: string;
  subtitle: string;
  year?: string;
  desc: string;
  meta: string;
  accent: 'mint' | 'plain';
  href?: string;
  cover?: string;
  stars?: number;
}

export const PORTFOLIO = {
  eyebrow: 'PORTFOLIO',
  heading: '作品集',
  description: '摄影作品。',
} as const;

// Photo series derived from photos.ts — single source of truth, newest first
export const PORTFOLIO_ITEMS: PortfolioItem[] = [...(PHOTO_SERIES as readonly PhotoSeries[])]
  .reverse()
  .map((s) => ({
    id: `ph-${s.id}`,
    tag: '摄影',
    title: s.title,
    subtitle: s.subtitle ?? '',
    year: String(s.year),
    desc: '',
    meta: [s.camera, `${s.photos.length} 张`].filter(Boolean).join(' · '),
    accent: 'plain' as const,
    href: `/photos/${s.id}`,
    cover: qiniuThumb(s.cover, 600),
  }));
