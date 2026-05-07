# Photography Gallery Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add individual `/photos/[id]` pages for photo series with rich metadata headers and CSS masonry photo grids, and link portfolio cards to these pages.

**Architecture:** Static Server Components using Next.js App Router. Data lives in `src/content/photos.ts` as typed `as const` arrays. The masonry grid is pure CSS `column-count` — no JS layout library. Portfolio cards for photo items get internal `href` pointing to `/photos/[id]` instead of `_blank` external links.

**Tech Stack:** Next.js 16.2.4 App Router, TypeScript, CSS Modules, `@deweyou-design/react` Card component

---

## File Map

| File | Action | Responsibility |
|------|--------|---------------|
| `src/content/photos.ts` | Create | Photo series data + TypeScript interfaces |
| `src/components/photos/masonry-grid.tsx` | Create | CSS columns masonry component |
| `src/components/photos/masonry-grid.module.css` | Create | Masonry layout styles |
| `src/app/photos/[id]/page.tsx` | Create | Series page: hero + metadata + masonry grid |
| `src/content/portfolio.ts` | Modify | Add `href` + `cover` fields to photo items |
| `src/components/portfolio/portfolio-grid.tsx` | Modify | Internal links for photo cards, external for GitHub |

---

### Task 1: Photo content data model

**Files:**
- Create: `src/content/photos.ts`

- [ ] **Step 1: Create `src/content/photos.ts`**

```ts
export interface PhotoItem {
  src: string;
  alt: string;
  width: number;
  height: number;
}

export interface PhotoSeries {
  id: string;
  title: string;
  subtitle?: string;
  year: number;
  location: string;
  camera?: string;
  lens?: string;
  film?: string;
  desc: string;
  cover: string;
  photos: PhotoItem[];
}

export const PHOTO_SERIES: PhotoSeries[] = [
  {
    id: 'shenzhen-night',
    title: '深圳夜',
    subtitle: '城市与人',
    year: 2026,
    location: '深圳',
    camera: 'Fujifilm X-T5',
    lens: 'XF 23mm F2',
    desc: '富士 X-T5 + XF23 F2，加班晚归路上的杂记。霓虹灯的轮廓、马路上的影子、便利店的白光。',
    cover: 'https://cdn.deweyou.me/photos/shenzhen-night/cover.jpg',
    photos: [
      { src: 'https://cdn.deweyou.me/photos/shenzhen-night/001.jpg', alt: '深圳夜 001', width: 1200, height: 800 },
      { src: 'https://cdn.deweyou.me/photos/shenzhen-night/002.jpg', alt: '深圳夜 002', width: 800, height: 1200 },
      { src: 'https://cdn.deweyou.me/photos/shenzhen-night/003.jpg', alt: '深圳夜 003', width: 1200, height: 900 },
      { src: 'https://cdn.deweyou.me/photos/shenzhen-night/004.jpg', alt: '深圳夜 004', width: 900, height: 1200 },
    ],
  },
  {
    id: 'kyoto',
    title: '京都八日',
    subtitle: '游记 · 银盐',
    year: 2025,
    location: '京都',
    camera: 'Canonet QL17',
    film: 'Kodak Gold 200',
    desc: '一台胶片机 + 八卷柯达 Gold 200，关于光、阴影与寺庙的午后。',
    cover: 'https://cdn.deweyou.me/photos/kyoto/cover.jpg',
    photos: [
      { src: 'https://cdn.deweyou.me/photos/kyoto/001.jpg', alt: '京都八日 001', width: 1200, height: 800 },
      { src: 'https://cdn.deweyou.me/photos/kyoto/002.jpg', alt: '京都八日 002', width: 800, height: 1200 },
      { src: 'https://cdn.deweyou.me/photos/kyoto/003.jpg', alt: '京都八日 003', width: 1200, height: 1200 },
      { src: 'https://cdn.deweyou.me/photos/kyoto/004.jpg', alt: '京都八日 004', width: 1200, height: 900 },
    ],
  },
  {
    id: 'cube-moments',
    title: '魔方时刻',
    subtitle: '微距系列',
    year: 2024,
    location: '深圳',
    camera: 'Fujifilm X-T5',
    lens: 'XF 80mm Macro',
    desc: '90mm 微距镜头下的 26 个色块，关于秩序与混乱的小宇宙。',
    cover: 'https://cdn.deweyou.me/photos/cube-moments/cover.jpg',
    photos: [
      { src: 'https://cdn.deweyou.me/photos/cube-moments/001.jpg', alt: '魔方时刻 001', width: 1200, height: 1200 },
      { src: 'https://cdn.deweyou.me/photos/cube-moments/002.jpg', alt: '魔方时刻 002', width: 1200, height: 800 },
      { src: 'https://cdn.deweyou.me/photos/cube-moments/003.jpg', alt: '魔方时刻 003', width: 800, height: 1200 },
    ],
  },
] as const satisfies PhotoSeries[];
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `pnpm tsc --noEmit`
Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add src/content/photos.ts
git commit -m "feat: add photo series content data model"
```

---

### Task 2: Masonry grid component

**Files:**
- Create: `src/components/photos/masonry-grid.tsx`
- Create: `src/components/photos/masonry-grid.module.css`

- [ ] **Step 1: Create CSS module `src/components/photos/masonry-grid.module.css`**

```css
.grid {
  columns: 3;
  column-gap: 12px;
}

@media (max-width: 768px) {
  .grid { columns: 2; }
}

@media (max-width: 480px) {
  .grid { columns: 1; }
}

.item {
  break-inside: avoid;
  margin-bottom: 12px;
  display: block;
}

.photo {
  width: 100%;
  display: block;
  border-radius: 4px;
}
```

- [ ] **Step 2: Create `src/components/photos/masonry-grid.tsx`**

```tsx
import type { PhotoItem } from '##/content/photos';
import styles from './masonry-grid.module.css';

interface MasonryGridProps {
  photos: PhotoItem[];
}

export function MasonryGrid({ photos }: MasonryGridProps) {
  return (
    <div className={styles.grid}>
      {photos.map((photo) => (
        <div key={photo.src} className={styles.item}>
          <img
            src={photo.src}
            alt={photo.alt}
            width={photo.width}
            height={photo.height}
            loading="lazy"
            className={styles.photo}
          />
        </div>
      ))}
    </div>
  );
}
```

- [ ] **Step 3: Verify TypeScript compiles**

Run: `pnpm tsc --noEmit`
Expected: No errors

- [ ] **Step 4: Commit**

```bash
git add src/components/photos/masonry-grid.tsx src/components/photos/masonry-grid.module.css
git commit -m "feat: add masonry grid component"
```

---

### Task 3: Photo series page

**Files:**
- Create: `src/app/photos/[id]/page.tsx`

- [ ] **Step 1: Create `src/app/photos/[id]/page.tsx`**

```tsx
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { Nav } from '##/components/nav';
import { Footer } from '##/components/footer';
import { MasonryGrid } from '##/components/photos/masonry-grid';
import { PHOTO_SERIES } from '##/content/photos';

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  return PHOTO_SERIES.map((s) => ({ id: s.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const series = PHOTO_SERIES.find((s) => s.id === id);
  if (!series) return {};
  return {
    title: `${series.title} — Dewey Ou`,
    description: series.desc,
  };
}

export default async function PhotoSeriesPage({ params }: Props) {
  const { id } = await params;
  const series = PHOTO_SERIES.find((s) => s.id === id);
  if (!series) notFound();

  const meta: string[] = [
    String(series.year),
    series.location,
    ...(series.camera ? [series.camera] : []),
    ...(series.lens ? [series.lens] : []),
    ...(series.film ? [series.film] : []),
    `${series.photos.length} 张`,
  ];

  return (
    <div className="page">
      <Nav />
      <section className="container container-lg" style={{ paddingTop: 80, paddingBottom: 80 }}>
        {/* Hero */}
        <div style={{ marginBottom: 64 }}>
          <div className="eyebrow" style={{ marginBottom: 20, display: 'inline-flex', alignItems: 'center', gap: 10 }}>
            <span style={{ width: 24, height: 1, background: 'currentColor' }} />
            PHOTOGRAPHY
          </div>
          <h1 style={{ fontSize: '3.5rem', fontWeight: 700, lineHeight: 1.05, marginBottom: 8, letterSpacing: '-0.015em' }}>
            {series.title}
          </h1>
          {series.subtitle && (
            <p style={{ fontSize: 18, color: 'var(--ui-color-text-muted)', marginBottom: 20 }}>
              {series.subtitle}
            </p>
          )}
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 24 }}>
            {meta.map((m) => (
              <span
                key={m}
                style={{
                  fontFamily: 'var(--ui-font-mono)',
                  fontSize: 12,
                  color: 'var(--ui-color-text-muted)',
                  letterSpacing: '0.06em',
                }}
              >
                {m}
              </span>
            ))}
          </div>
          <p style={{ fontSize: 15, lineHeight: 1.8, color: 'var(--ui-color-text-muted)', maxWidth: 600 }}>
            {series.desc}
          </p>
        </div>

        {/* Masonry grid */}
        <MasonryGrid photos={series.photos} />
      </section>
      <Footer />
    </div>
  );
}
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `pnpm tsc --noEmit`
Expected: No errors

- [ ] **Step 3: Start dev server and verify page renders**

Run: `pnpm dev`

Navigate to `http://localhost:3000/photos/shenzhen-night` — should see:
- Nav + footer
- "PHOTOGRAPHY" eyebrow
- Title "深圳夜" in large serif
- Subtitle "城市与人"
- Metadata row: `2026  深圳  Fujifilm X-T5  XF 23mm F2  4 张`
- Description text
- Masonry grid (images will 404 since no real CDN yet — that's expected)

Navigate to `http://localhost:3000/photos/does-not-exist` — should see Next.js 404 page.

Stop dev server with Ctrl+C.

- [ ] **Step 4: Commit**

```bash
git add src/app/photos/
git commit -m "feat: add photo series page /photos/[id]"
```

---

### Task 4: Wire up portfolio cards

**Files:**
- Modify: `src/content/portfolio.ts` — Add `href` to photo items
- Modify: `src/components/portfolio/portfolio-grid.tsx` — Internal links for photo cards

- [ ] **Step 1: Update photo items in `src/content/portfolio.ts`**

Replace the three photo items (lines starting with `ph-shenzhen-night`, `ph-kyoto`, `ph-cube-moments`) so they have `href` and `cover` fields:

```ts
  { id: 'ph-shenzhen-night', tag: '摄影',    title: '深圳夜',            subtitle: '城市与人',              year: '2026', desc: '富士 X-T5 + XF23 F2，加班晚归路上的杂记。',                                         meta: 'Fujifilm · 28 张',         accent: 'plain', href: '/photos/shenzhen-night', cover: 'https://cdn.deweyou.me/photos/shenzhen-night/cover.jpg' },
  { id: 'ph-kyoto',          tag: '摄影',    title: '京都八日',          subtitle: '游记 · 银盐',           year: '2025', desc: '一台胶片机 + 八卷柯达 Gold 200，关于光、阴影与寺庙的午后。',                          meta: 'Canonet · 36 张',          accent: 'mint',  href: '/photos/kyoto',          cover: 'https://cdn.deweyou.me/photos/kyoto/cover.jpg' },
  { id: 'ph-cube-moments',   tag: '摄影',    title: '魔方时刻',          subtitle: '微距系列',              year: '2024', desc: '90mm 微距镜头下的 26 个色块，关于秩序与混乱的小宇宙。',                              meta: 'Fujifilm · 12 张',         accent: 'plain', href: '/photos/cube-moments',   cover: 'https://cdn.deweyou.me/photos/cube-moments/cover.jpg' },
```

- [ ] **Step 2: Update `src/components/portfolio/portfolio-grid.tsx` — use `Link` for internal hrefs**

The current code passes `target="_blank"` unconditionally to all `Card` components. Photo links are internal (`/photos/...`), so they must NOT open in a new tab. Replace the `Card` usage with conditional target logic:

```tsx
'use client';

import { useState } from 'react';
import { Card } from '@deweyou-design/react/card';
import { PORTFOLIO_ITEMS, PORTFOLIO_TAGS } from '##/content/portfolio';

export function PortfolioGrid() {
  const [activeTag, setActiveTag] = useState<string>('全部');
  const filtered = activeTag === '全部' ? PORTFOLIO_ITEMS : PORTFOLIO_ITEMS.filter((i) => i.tag === activeTag);

  return (
    <div>
      {/* Tag filter */}
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 48 }}>
        {PORTFOLIO_TAGS.map((t) => (
          <button key={t} className="dy-tag" data-active={activeTag === t ? 'true' : 'false'} onClick={() => setActiveTag(t)}>
            {t}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
        {filtered.map((item) => {
          const href = 'href' in item ? (item as { href: string }).href : '#';
          const isExternal = href.startsWith('http');
          const cover = 'cover' in item ? (item as { cover: string }).cover : null;
          return (
            <Card
              key={item.id}
              href={href}
              target={isExternal ? '_blank' : undefined}
              style={{ position: 'relative', overflow: 'hidden', color: 'inherit', textDecoration: 'none' }}
            >
              {cover && (
                <div style={{ margin: '-24px -24px 20px', height: 160, overflow: 'hidden' }}>
                  <img
                    src={cover}
                    alt={item.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                  />
                </div>
              )}
              {!cover && item.accent === 'mint' && (
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3,
                  background: 'linear-gradient(90deg, var(--ui-color-brand-bg), var(--ui-color-palette-emerald-500))' }} />
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 16, marginBottom: 2 }}>{item.title}</div>
                  <div style={{ fontSize: 13, color: 'var(--ui-color-text-muted)' }}>{item.subtitle}</div>
                </div>
                {'year' in item && (
                  <span style={{ fontFamily: 'var(--ui-font-mono)', fontSize: 11, color: 'var(--ui-color-text-muted)' }}>
                    {(item as { year: string }).year}
                  </span>
                )}
              </div>
              <p style={{ fontSize: 14, lineHeight: 1.7, color: 'var(--ui-color-text-muted)', margin: '0 0 16px' }}>
                {item.desc}
              </p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontFamily: 'var(--ui-font-mono)', fontSize: 11, color: 'var(--ui-color-text-muted)' }}>
                  {item.meta}
                </span>
                {'stars' in item && !!(item as { stars?: number }).stars && (
                  <span style={{ fontFamily: 'var(--ui-font-mono)', fontSize: 11, color: 'var(--ui-color-text-muted)', display: 'flex', alignItems: 'center', gap: 4 }}>
                    ★ {String((item as { stars: number }).stars)}
                  </span>
                )}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Verify TypeScript compiles**

Run: `pnpm tsc --noEmit`
Expected: No errors

- [ ] **Step 4: Verify in browser**

Run: `pnpm dev`

- Navigate to `http://localhost:3000/portfolio`
- Click a photo card (e.g. "深圳夜") — should navigate to `/photos/shenzhen-night` in the same tab
- Click a GitHub card (e.g. "Deweyou Design") — should open `https://github.com/deweyou/design` in a new tab

Stop dev server with Ctrl+C.

- [ ] **Step 5: Commit**

```bash
git add src/content/portfolio.ts src/components/portfolio/portfolio-grid.tsx
git commit -m "feat: link portfolio photo cards to /photos/[id] pages"
```
