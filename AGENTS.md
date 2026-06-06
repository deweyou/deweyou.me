<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

---

# deweyou.me — Agent Guide

Personal website for Dewey Ou. Next.js 16 App Router, TypeScript, `@deweyou-design` (Dewey's own design system), Qiniu CDN for photos, MDX for blog posts.

## Task Routing

If you are **adding or editing a blog post**, read [`docs/blog-system.md`](docs/blog-system.md) first — the heading slugify logic has a critical two-location invariant.

If you are **working with photos or portfolio**, read [`docs/photo-system.md`](docs/photo-system.md) — portfolio is derived from photo data, not managed separately.

If you are **using `@deweyou-design` components**, read [`docs/design-system.md`](docs/design-system.md) — there are Server Component constraints and the library is not third-party.

If you are **modifying nav, layout, or adding pages**, read [`docs/nav-and-layout.md`](docs/nav-and-layout.md) — portfolio and about tabs are intentionally hidden for v1.

If you are **adding, syncing, or rendering daily shares**, read [`docs/daily-system.md`](docs/daily-system.md) — daily entries have required frontmatter invariants and mirrored image-path rules.

## Repository Structure

```
src/
  app/                  Next.js App Router pages
    layout.tsx          Root layout — Nav, Footer, fonts, theme
    blog/[slug]/        Blog post detail (SSG)
    portfolio/          Portfolio page (hidden from nav, v1)
    about/              About page (hidden from nav, v1)
  components/
    blog/               Blog-specific: toc-sidebar, reading-progress
    markdown-content.tsx Shared Markdown/GFM renderer for blog and daily bodies
    home/               Hero section
    photos/             Masonry grid
    portfolio/          Portfolio grid
    nav.tsx / footer.tsx
  content/              Static data (TS files, not MDX)
    photos.ts           Source of truth for all photo series
    common.ts           Nav links, profile, footer
  lib/
    posts.ts            Blog post reading + TOC extraction
  styles/
    site.css            Shared CSS classes (.container, .eyebrow, .toc-fixed, …)
  app/globals.css       Design system token overrides + body/article resets

content/
  posts/*.mdx           Blog posts (frontmatter + MDX body)

scripts/
  import-post.mjs       .md → .mdx conversion wizard
  upload-photos.mjs     Upload photos to Qiniu CDN
  resize-uploaded-photos.mjs  Cloud-side resize via pfop API
  subset-fonts.sh       Rebuild subsetted woff2 after new posts
```

## Key Invariants

- **Heading ID slugify lives in two places**: `src/lib/posts.ts:extractToc` and `src/components/markdown-content.tsx:slugify`. They must stay in sync. See `docs/blog-system.md`.
- **Portfolio is derived**: `src/content/portfolio.ts` builds `PORTFOLIO_ITEMS` by reversing `PHOTO_SERIES` from `photos.ts`. Never add portfolio items manually.
- **Content `#` maps to h2 visually**: post and daily content `#` headings are NOT page-level h1s. `MarkdownContent` maps `h1→variant="h2"`, `h2→variant="h3"`, `h3→variant="h4"`.
- **Nav links are commented out for v1**: uncommenting `portfolio` and `about` in `src/content/common.ts` is all that's needed to re-enable them.
