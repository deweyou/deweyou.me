# Blog System

## Overview

Blog posts live in `content/posts/*.mdx` and are rendered via Next.js App Router (SSG). The file extension is `.mdx` for historical compatibility, but post bodies are rendered as Markdown/GFM rather than executable MDX. The pipeline:

1. `src/lib/posts.ts` — reads `.mdx` files from disk, parses frontmatter via `gray-matter`
2. `src/app/blog/[slug]/page.tsx` — renders the page shell and passes content to `MarkdownContent`
3. `src/components/markdown-content.tsx` — renders CommonMark/GFM with `@deweyou-design/react/markdown-render`

Daily note bodies use the same `MarkdownContent` renderer in detail and feed views, so tables, task lists, fenced code, and `mermaid` code fences behave consistently across blog and daily surfaces.

## Adding a Post

Use the import script:

```bash
node scripts/import-post.mjs path/to/file.md
```

The script strips internal notes (blockquote lines matching `skill:` / `技巧:`), infers title and date from the filename, prompts for `tag`, `readTime`, `excerpt`, and output slug, then writes `content/posts/<slug>.mdx` with frontmatter.

Frontmatter required fields:
```yaml
---
title: '...'
date: YYYY-MM-DD
tag: '...'
readTime: 'N min'
excerpt: '...'
---
```

## Heading Levels in Content

Markdown `#` (h1) in post content is **not** the page title — the page title is rendered separately in `page.tsx`. Content headings map down by one:

| Markdown | Renders as |
|----------|-----------|
| `#`      | `Text variant="h2"` (h2 DOM element) |
| `##`     | `Text variant="h3"` |
| `###`    | `Text variant="h4"` |

Do not use `Text variant="h1"` in `MarkdownContent` for content headings — it produces oversized section headings.

## Heading IDs and Slugify — CRITICAL

Heading IDs are generated in **two separate places** and must stay in sync:

- `src/lib/posts.ts` → `extractToc()` — generates IDs from raw Markdown text (server-side)
- `src/components/markdown-content.tsx` → `slugify()` — generates IDs for rendered headings (client-side)

**The algorithm** (both use the same logic):
1. Strip markdown inline syntax (`` `code` ``, `**bold**`, `_italic_`) to get plain text
2. Lowercase
3. Remove backticks/quotes: `/[`'"]+/g`
4. Punctuation → dash: `/[\s\p{P}]+/gu` (Unicode property, requires `u` flag)
5. Remove remaining non-word non-CJK: `/[^\w\u4e00-\u9fff\u3400-\u4dbf-]/g`
6. Collapse and trim dashes

**Key design decision**: CJK characters are **preserved** in IDs (not replaced with dashes). If they were stripped, headings sharing the same English prefix (e.g. "docs 怎么拆..." and "docs 的维护...") would produce duplicate IDs, breaking active-state detection in the TOC.

If you change the slugify logic in one place, change it in both.

## TOC Sidebar

- Component: `src/components/blog/toc-sidebar.tsx` (`'use client'`)
- CSS: `.toc-fixed` in `src/styles/site.css`
- Position: `position: fixed; right: 32px; top: 50%; transform: translateY(-50%)`
- Visibility: hidden via `@media (max-width: 1199px)` — only shown when there's room beside the 720px article
- Active state: scroll listener, sets `activeId` to the last heading whose `getBoundingClientRect().top ≤ NAV_HEIGHT + 16`
- Hash routing: clicking a TOC item calls `history.pushState` to update URL; on mount, reads `window.location.hash` and scrolls to it via `requestAnimationFrame`

## Font Subsetting

Source Han Serif CN is subsetted for performance. After adding new posts, rebuild:

```bash
bash scripts/subset-fonts.sh
```

The script scans `content/posts/*.mdx`, `content/daily/*.mdx`, and site UI source files, then rebuilds `src/app/fonts/*.woff2`. A tracked pre-commit hook in `.githooks/pre-commit` runs this script and stages updated woff2 files automatically. **Do not add this to `prebuild`** — `pyftsubset` is not available on Vercel.

*Last updated: 2026-06-01 | Reason: blog and daily bodies now share the design-system Markdown renderer*
