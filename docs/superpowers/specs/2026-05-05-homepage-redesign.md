# Homepage Redesign — Design Spec
_Date: 2026-05-05_

## Overview

Complete rebuild of deweyou.me as a personal blog/portfolio site. Source of truth is the Claude Design handoff (`Deweyou blog website-handoff.zip`). Five pages total, all implemented with real MDX-powered blog.

## Tech Stack

| Layer | Choice | Reason |
|---|---|---|
| Framework | Next.js (latest) | SSR/SSG built-in, Vercel deploy, next/font, generateStaticParams |
| Language | TypeScript | Existing project standard |
| Styling | `@deweyou-design/styles` + CSS Modules + global site.css | Design tokens from own component library; component-scoped styles via modules |
| Components | `@deweyou-design/react` + `@deweyou-design/react-icons` | Dogfooding own design system |
| Blog | `next-mdx-remote` + `gray-matter` | Dynamic routing, frontmatter, static generation |
| Fonts | Source Han Serif CN (local OTF) + IBM Plex Mono (Google Fonts) | Per design handoff; loaded via next/font |
| No Tailwind | — | Not needed; all tokens come from @deweyou-design/styles |

## Project Structure

```
deweyou.me/
├── content/
│   └── posts/                  # MDX files (slug.mdx)
├── public/
│   └── assets/                 # Logo SVGs from design handoff
│       ├── logo-black.svg
│       ├── logo-white.svg
│       ├── logo-animated-black.svg
│       └── logo-animated-white.svg
├── src/
│   ├── app/
│   │   ├── layout.tsx          # Root layout: ThemeProvider, globals, font vars
│   │   ├── page.tsx            # Home (Hero B)
│   │   ├── blog/
│   │   │   ├── page.tsx        # Blog list
│   │   │   └── [slug]/page.tsx # Blog detail (next-mdx-remote)
│   │   ├── about/page.tsx
│   │   └── portfolio/page.tsx
│   ├── components/
│   │   ├── nav.tsx + nav.module.css
│   │   ├── footer.tsx + footer.module.css
│   │   ├── logo.tsx + logo.module.css
│   │   ├── social-icon.tsx
│   │   ├── theme-provider.tsx  # 'use client', manages data-theme on <html>
│   │   └── home/
│   │       └── hero.tsx + hero.module.css
│   ├── lib/
│   │   └── posts.ts            # readPostSlugs, getPost, getAllPosts
│   └── styles/
│       ├── globals.css         # @import @deweyou-design/styles/theme.css
│       └── site.css            # Shared: .eyebrow, .dy-rule, .dy-link, .dy-tag, .dy-card, etc.
└── next.config.ts
```

## Pages

### Home (`/`)

Desktop: asymmetric two-column grid (`1fr 1.3fr`), full viewport height, vertical border separator.

**Left column** (padding-top ~220px):
- Live time indicator: green dot + `SHENZHEN — HH:MM CST` (mono)
- Avatar frame: `<Image>` slot (4:5 aspect ratio), corner bracket decoration, mint-colored offset shadow behind, `ŌU · /oʊ/` vertical annotation, `FIG. 01 — SELF` label
- Name row: `Dewey Ou · 欧怼怼` (mono, uppercase)
- Bottom: `EST · 2018` with `dy-rule` horizontal rule

**Right column** (padding-top ~120px):
- Large italic serif headline: `做有意思的产品 —— 也，过有意思的生活。` ("有意思" has mint skewed highlight span)
- Bio paragraph (font-size 17px, line-height 1.85): role, interests, AI note
- Divider + CTA row: "读我写的文章 ↗" animated underline + vertical separator + social icons row

**Backgrounds:**
- Faint topo SVG lines (radial gradient fade, top-left quadrant)
- Massive faded logo wordmark centered at bottom (opacity ~0.05)

Mobile: single column, same elements stacked, headline uses `clamp(1.6rem, 7vw, 2rem)`, avatar max-width 320px.

### Blog List (`/blog`)

- Background: faint vertical lines (`linear-gradient` stripe pattern)
- Header: eyebrow `INDEX · N ENTRIES` + h1 `文章` + subtitle + tag filter chips
- Posts grouped by year descending; each row: date · title · tag (right-aligned)
- Row hover: left `→` indicator slides in

### Blog Detail (`/blog/[slug]`)

- 2px reading progress bar at top of viewport (brand color, position fixed)
- Desktop: two-column — sticky TOC left (160px) + article content right
- Mobile: single column, TOC hidden
- MDX components: h2–h5, p, blockquote (left border), code block (mono, surface bg), inline code
- Related posts at bottom

### About (`/about`)

- Two-column layout (desktop): sticky TOC `§ 01..06` + content sections
- Sections rendered by kind: `prose` (paragraphs), `timeline` (work history), `tags` (skill chips), `quotes` (quote list), `list` (key:value pairs)
- Header: eyebrow + italic serif headline

### Portfolio (`/portfolio`)

- Tag filter row (`全部 / GitHub / 设计 / 摄影`)
- Card grid: each card has title, subtitle, year, description, meta, optional star count
- Cards with `accent: 'mint'` get mint-colored top accent stripe
- GitHub cards show star count

## Navigation

**Desktop nav** (`.nav`):
- Logo wordmark (animated SVG on first visit per session, static after)
- Links: 主页 / 文章 / 作品集 / 关于
- Right: theme toggle icon button

**Mobile nav** (`.nav-h5`):
- Logo + theme toggle + hamburger
- Full-screen overlay on open: blurred backdrop, large serif menu items with index numbers, animated entrance, close button (rotates on hover)

## Theme System

- `ThemeProvider` client component wraps the app
- Reads from `localStorage`, defaults to system preference
- Toggles `data-theme="light"` / `data-theme="dark"` on `<html>`
- All colors are CSS variables; dark theme overrides defined in `@deweyou-design/styles`

## Fonts

Loaded via `next/font/local`:
- `Source Han Serif CN` — Regular (400), Medium (500), SemiBold (600), Bold (700) — local OTF files copied from design handoff
- `IBM Plex Mono` — via `next/font/google`

CSS variables `--ui-font-body`, `--ui-font-display`, `--ui-font-mono` set in `:root` of `globals.css`.

## Logo

- Static wordmark: CSS mask on `currentColor` span (color-aware, works in both themes)
- Animated version: inline SVG with `stroke-dashoffset` animation, plays once per session via `sessionStorage` flag, falls back to static
- Dark theme: `filter: invert(1)` on animated host

## MDX Blog

Frontmatter schema per post:
```yaml
---
title: string
date: YYYY-MM-DD
tag: string
readTime: string   # e.g. "12 min"
excerpt: string
pinned?: boolean
---
```

`lib/posts.ts` exports:
- `getAllPosts()` — reads all `.mdx` from `content/posts/`, parses frontmatter, sorts by date desc
- `getPost(slug)` — returns frontmatter + raw MDX content for detail page

`generateStaticParams` in `[slug]/page.tsx` pre-renders all posts at build time.

## SSR Considerations

- `ThemeProvider`, `Nav` mobile overlay, `LogoAnimated` — `'use client'`
- All page components (`Home`, `BlogList`, etc.) — Server Components by default
- `@deweyou-design/react` portal-based components (`Dialog`, `Toaster`) only used client-side
- Avatar uses `next/image` with placeholder

## Assets to Copy from Design Handoff

- `project/assets/logo-black.svg` → `public/assets/`
- `project/assets/logo-white.svg` → `public/assets/`
- `project/assets/logo-animated-black.svg` → `public/assets/`
- `project/assets/logo-animated-white.svg` → `public/assets/`
- `project/fonts/SourceHanSerifCN-*.otf` → `public/fonts/` (4 weights)

## Data

Sample data from `data.jsx` (PROFILE, POSTS, ABOUT_SECTIONS, PORTFOLIO_ITEMS) is converted to TypeScript constants in `src/lib/data.ts`. Real blog posts will live in `content/posts/*.mdx`.
