# Photo System

## Data Source

All photo data lives in `src/content/photos.ts`. This is the **single source of truth** — both the photos pages and the portfolio page derive from it.

```ts
export interface PhotoSeries {
  id: string;          // used as route param: /photos/[id]
  title: string;
  subtitle?: string;
  year: number;
  location: string;
  camera?: string;
  lens?: string;
  film?: string;
  desc?: string;       // optional — portfolio card will be empty if omitted
  cover: string;       // full Qiniu CDN URL
  photos: PhotoItem[]; // each has src, alt, width, height
}
```

## Portfolio Derivation

`src/content/portfolio.ts` derives portfolio items from `PHOTO_SERIES` — do not add entries manually:

```ts
export const PORTFOLIO_ITEMS = [...PHOTO_SERIES].reverse().map((s) => ({ ... }));
```

`reverse()` gives newest-first order. The `PHOTO_SERIES` array in `photos.ts` should be ordered oldest-first (append new series at the end).

## Qiniu CDN

Photos are hosted on Qiniu CDN. The `qiniuThumb(url, width, quality?)` helper in `photos.ts` appends `?imageView2/2/w/N/q/85` to a CDN URL.

Credentials are in `.env.local` (not committed). The Qiniu bucket is configured for public read.

## Uploading New Photos

```bash
node scripts/upload-photos.mjs
```

Interactive: prompts for series ID, selects local images, uploads to Qiniu, and outputs the `PhotoSeries` object to paste into `photos.ts`.

## Resizing Already-Uploaded Photos

If photos were uploaded at full resolution and need cloud-side resizing:

```bash
node scripts/resize-uploaded-photos.mjs
```

Uses Qiniu's `pfop` (persistent fop) API. Status codes: 0/1/2 = still processing, 3 = done, 4 = failed. The script polls until all jobs finish.

*Last updated: 2026-05-07 | Reason: photo upload and CDN pipeline established during redesign*
