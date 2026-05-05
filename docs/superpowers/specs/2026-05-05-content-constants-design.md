# Content Constants Design

**Goal:** Extract all hardcoded user-visible text from pages and components into typed `src/content/` files, making all copy maintainable from one place.

**Architecture:** Create `src/content/` with one file per page/scope. Delete `src/lib/data.ts` and migrate all its text content into the appropriate content files. Each file exports a single named `as const` object. Components import from `src/content/` directly.

**Tech Stack:** TypeScript `as const`, Next.js App Router, path alias `##/*` → `src/*`

---

## File Structure

```
src/content/
  common.ts      ← nav links, footer copyright, PROFILE (name, title, socials)
  home.ts        ← hero text: headline, bio segments, CTA, annotations
  blog.ts        ← blog page headings, description, TAGS array
  portfolio.ts   ← portfolio page headings, PORTFOLIO_TAGS, PORTFOLIO_ITEMS
  about.ts       ← about page headings, ABOUT_SECTIONS
```

`src/lib/data.ts` is deleted after migration.

---

## Content File Contracts

### `common.ts`

```ts
export const NAV_LINKS = [
  { href: '/',          label: '主页' },
  { href: '/blog',      label: '文章' },
  { href: '/portfolio', label: '作品集' },
  { href: '/about',     label: '关于' },
] as const;

export const PROFILE = {
  name: '欧怼怼',
  nameEn: 'Dewey Ou',
  title: '前端工程师 · 字节跳动',
  location: '深圳',
  socials: [
    { label: 'GitHub',  handle: '@deweyou',     href: 'https://github.com/deweyou',     icon: 'ti-brand-github' },
    { label: '小红书',  handle: '欧怼怼',        href: 'https://xiaohongshu.com/...',    iconSrc: '/icons/xiaohongshu.svg' },
    { label: 'Email',   handle: 'hi@deweyou.me', href: 'mailto:hi@deweyou.me',           icon: 'ti-mail' },
  ],
} as const;

export const FOOTER = {
  copyright: '© 2026 · DEWEY OU',
} as const;
```

### `home.ts`

```ts
export const HOME = {
  hero: {
    location: 'SHENZHEN',
    timezone: 'CST',
    figLabel: 'FIG. 01',
    selfLabel: 'SELF',
    nameZh: '欧怼怼',
    nameEn: 'Dewey Ou',
    nameSep: '·',
    pronunciation: 'ŌU · /oʊ/',
    estLabel: 'EST · 2018',
    // headline rendered as: "做" + highlight("有意思") + "的产品"
    headlinePre: '做',
    headlineHighlight: '有意思',
    headlinePost: '的产品',
    subline: '—— 也，过有意思的生活。',
    // bio is an array of segments: { text, variant? }
    // variant: 'underline' | 'chip' | undefined
    bio: [
      { text: '字节跳动的' },
      { text: '前端工程师', variant: 'underline' },
      { text: '，住在深圳。喜欢有设计感、人性化、新颖的东西，也想成为做这类产品的人。最近在和 ' },
      { text: 'AI', variant: 'chip' },
      { text: ' 交朋友，让它陪我学习、做有意思的产品。工作之余，看书、玩魔方、变魔术、拍照。' },
    ],
    cta: '读我写的文章',
  },
} as const;
```

### `blog.ts`

```ts
export const BLOG = {
  eyebrow: 'INDEX',          // rendered as "INDEX · N ENTRIES"
  heading: '文章',
  description: '关于前端、设计、AI、产品和生活的一些思考。慢慢写。',
  entriesLabel: 'ENTRIES',
  postsPerYearSuffix: '篇',
} as const;

export const TAGS = ['全部', 'AI', '前端设计', '产品思考', '生活随笔', '读书笔记'] as const;
```

### `portfolio.ts`

```ts
export const PORTFOLIO = {
  eyebrow: 'PORTFOLIO',
  heading: '作品集',
  description: 'GitHub 项目、设计稿、摄影作品。',
} as const;

export const PORTFOLIO_TAGS = ['全部', 'GitHub', '设计', '摄影'] as const;

export const PORTFOLIO_ITEMS = [ /* existing items from data.ts */ ] as const;
```

### `about.ts`

```ts
export const ABOUT = {
  eyebrow: 'ABOUT · 关于',
  headingLine1: '一份不那么严肃的',
  headingLine2: '「自我说明」',
  tocLabel: '目录',
} as const;

export const ABOUT_SECTIONS = [ /* existing sections from data.ts */ ] as const;
```

---

## Components Updated

| File | Imports from |
|------|-------------|
| `src/components/nav.tsx` | `##/content/common` → `NAV_LINKS` |
| `src/components/footer.tsx` | `##/content/common` → `PROFILE`, `FOOTER` |
| `src/components/social-icon.tsx` | `##/content/common` → `PROFILE.socials` (via consumers) |
| `src/components/home/hero.tsx` | `##/content/home` → `HOME`, `##/content/common` → `PROFILE` |
| `src/components/blog/blog-list.tsx` | `##/content/blog` → `BLOG`, `TAGS` |
| `src/app/portfolio/page.tsx` | `##/content/portfolio` → `PORTFOLIO` |
| `src/components/portfolio/portfolio-grid.tsx` | `##/content/portfolio` → `PORTFOLIO_TAGS`, `PORTFOLIO_ITEMS` |
| `src/app/about/page.tsx` | `##/content/about` → `ABOUT`, `ABOUT_SECTIONS` |

---

## Out of Scope

- aria-labels stay in components (UI behaviour, not content)
- Blog post MDX files are untouched (already file-based)
- No i18n runtime — this is static typed constants only
