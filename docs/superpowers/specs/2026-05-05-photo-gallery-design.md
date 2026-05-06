# Photography Gallery Design

**Date:** 2026-05-05
**Status:** Approved

---

## Goal

Add a photography section to deweyou.me where individual photo series are displayed on dedicated pages (`/photos/[id]`) with rich metadata and masonry photo grids.

---

## Routes

- `/photos/[id]` — Individual series page (e.g., `/photos/shenzhen-night`)
- Portfolio cards for photo series point to these pages

No top-level `/photos` index page in initial scope (YAGNI).

---

## Data Model

**`src/content/photos.ts`** — All photo series data as `as const`.

```ts
export interface PhotoSeries {
  id: string;           // URL slug, e.g. "shenzhen-night"
  title: string;        // Display title, e.g. "深夜深圳"
  subtitle?: string;    // Optional one-liner
  year: number;
  location: string;
  camera?: string;      // e.g. "Fujifilm X-T5"
  lens?: string;        // e.g. "XF 23mm f/1.4"
  film?: string;        // e.g. "Kodak Gold 200" (or simulation name)
  count: number;        // Auto-derived from photos array length, but also stored for display
  desc: string;         // 1–3 sentence description
  cover: string;        // URL of cover image (used in portfolio card)
  photos: PhotoItem[];
}

export interface PhotoItem {
  src: string;          // 七牛云 CDN URL
  alt: string;          // Alt text / caption
  width: number;        // Original width (for aspect ratio in masonry)
  height: number;       // Original height
}

export const PHOTO_SERIES: PhotoSeries[] = [ /* ... */ ];
```

---

## Pages and Components

### `/photos/[id]` — Series Page

**File:** `src/app/photos/[id]/page.tsx` (Server Component)

Sections:
1. **Hero** — Series title, subtitle, metadata row (year · location · camera · lens · film · N photos)
2. **Description** — `desc` field, styled as body text
3. **Masonry grid** — All photos in `photos[]`

**Static generation:** `generateStaticParams` exports all `id` values from `PHOTO_SERIES`.

### Masonry Grid Component

**File:** `src/components/photos/masonry-grid.tsx` (Client Component)

- CSS columns-based masonry (no JS layout libraries)
- 3 columns on desktop, 2 on tablet (≤768px), 1 on mobile (≤480px)
- Each photo: `<img>` tag (not Next.js `<Image>` — external CDN, no optimization needed)
- Lazy loading via `loading="lazy"`
- No lightbox in initial scope (YAGNI)

### Portfolio Card Update

**File:** `src/components/portfolio/portfolio-grid.tsx`

Photo series cards get `href="/photos/{id}"` and `cover` as background/thumbnail image. Non-photo cards keep `href="#"` (or are marked as coming soon).

---

## Image Hosting

**七牛云 Kodo** (S3-compatible)

- Images uploaded manually or via upload script
- CDN URLs stored directly in `src/content/photos.ts`
- No Next.js Image optimization (external domain, no remotePatterns needed)
- Upload script: `scripts/upload-photos.sh` or `scripts/upload-photos.py` — accepts a directory, uploads all images, prints CDN URLs for pasting into content file

---

## Styling

- Hero metadata: monospace font (`--ui-font-mono`), muted color, small size
- Masonry: `column-count` CSS, `break-inside: avoid` on each photo item
- Photos: `width: 100%`, `display: block`, small gap between items
- Page max-width: consistent with rest of site (matches blog/portfolio layout)

---

## Font Subsetting

`scripts/subset-fonts.sh` already scans `src/content/*.ts` — photo captions in `alt` fields will be picked up automatically.

---

## Out of Scope (YAGNI)

- Lightbox / full-screen viewer
- `/photos` index listing page
- EXIF metadata auto-extraction
- Image upload UI
- Pagination / infinite scroll
- Series filtering or tagging
