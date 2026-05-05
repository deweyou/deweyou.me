# Content Constants Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Extract all hardcoded user-visible text into typed `src/content/` files, then delete `src/lib/data.ts`.

**Architecture:** Six content files (one per page/scope) export `as const` objects. Components swap their `##/lib/data` imports for `##/content/*`. Final task deletes `data.ts`.

**Tech Stack:** TypeScript `as const`, Next.js 16.2.4 App Router, path alias `##/*` → `src/*`, build tool: `bun run build`

---

## File Map

**Create:**
- `src/content/common.ts` — NAV_LINKS, PROFILE, FOOTER
- `src/content/home.ts` — HOME (all hero text + bio segments)
- `src/content/blog.ts` — BLOG, TAGS
- `src/content/portfolio.ts` — PORTFOLIO, PORTFOLIO_TAGS, PORTFOLIO_ITEMS
- `src/content/about.ts` — ABOUT, ABOUT_SECTIONS

**Modify:**
- `src/components/nav.tsx` — import NAV_LINKS from content/common (replace local const)
- `src/components/footer.tsx` — import PROFILE, FOOTER from content/common
- `src/components/home/hero.tsx` — import HOME from content/home; PROFILE from content/common; replace inline text
- `src/components/blog/blog-list.tsx` — import BLOG, TAGS from content/blog
- `src/app/portfolio/page.tsx` — import PORTFOLIO from content/portfolio
- `src/components/portfolio/portfolio-grid.tsx` — import PORTFOLIO_TAGS, PORTFOLIO_ITEMS from content/portfolio
- `src/app/about/page.tsx` — import ABOUT, ABOUT_SECTIONS from content/about; PROFILE from content/common

**Delete:**
- `src/lib/data.ts`

---

### Task 1: common.ts + nav + footer

**Files:**
- Create: `src/content/common.ts`
- Modify: `src/components/nav.tsx`
- Modify: `src/components/footer.tsx`

- [ ] **Step 1: Create `src/content/common.ts`**

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
    { label: 'GitHub',  handle: '@deweyou',      href: 'https://github.com/deweyou',  icon: 'ti-brand-github' },
    { label: '小红书',  handle: '欧怼怼',         href: '#',                           iconSrc: '/icons/xiaohongshu.svg' },
    { label: 'Email',   handle: 'hi@deweyou.me', href: 'mailto:hi@deweyou.me',        icon: 'ti-mail' },
  ],
} as const;

export const FOOTER = {
  copyright: '© 2026 · DEWEY OU',
} as const;
```

- [ ] **Step 2: Update `src/components/nav.tsx`**

Replace the local `LINKS` constant and its usages with `NAV_LINKS` from `##/content/common`. The file currently has:

```tsx
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Logo, LogoAnimated } from './logo';
import { useTheme } from './theme-provider';
import styles from './nav.module.css';

const LINKS = [
  { href: '/',           label: '主页' },
  { href: '/blog',       label: '文章' },
  { href: '/portfolio',  label: '作品集' },
  { href: '/about',      label: '关于' },
];
```

Replace with:

```tsx
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Logo, LogoAnimated } from './logo';
import { useTheme } from './theme-provider';
import { NAV_LINKS } from '##/content/common';
import styles from './nav.module.css';
```

Then replace all three occurrences of `LINKS` in JSX with `NAV_LINKS`:
- `{LINKS.length.toString()...}` → `{NAV_LINKS.length.toString()...}`
- `{LINKS.map(...)` (overlay) → `{NAV_LINKS.map(...)`
- `{LINKS.map(...)` (desktop) → `{NAV_LINKS.map(...)`

- [ ] **Step 3: Update `src/components/footer.tsx`**

Change import line from:
```tsx
import { PROFILE } from '##/lib/data';
```
to:
```tsx
import { PROFILE, FOOTER } from '##/content/common';
```

Change the copyright string from hardcoded:
```tsx
<span className={styles.copyright}>© 2026 · DEWEY OU</span>
```
to:
```tsx
<span className={styles.copyright}>{FOOTER.copyright}</span>
```

- [ ] **Step 4: Verify build passes**

```bash
bun run build
```

Expected: `✓ Compiled successfully` with no TypeScript errors.

- [ ] **Step 5: Commit**

```bash
git add src/content/common.ts src/components/nav.tsx src/components/footer.tsx
git commit -m "feat: extract common content (nav links, profile, footer) to src/content/common.ts"
```

---

### Task 2: home.ts + hero

**Files:**
- Create: `src/content/home.ts`
- Modify: `src/components/home/hero.tsx`

- [ ] **Step 1: Create `src/content/home.ts`**

```ts
export const HOME = {
  hero: {
    location: 'SHENZHEN',
    timezone: 'CST',
    figLabel: 'FIG. 01',
    selfLabel: 'SELF',
    nameEn: 'Dewey Ou',
    nameSep: '·',
    nameZh: '欧怼怼',
    pronunciation: 'ŌU · /oʊ/',
    estLabel: 'EST · 2018',
    headlinePre: '做',
    headlineHighlight: '有意思',
    headlinePost: '的产品',
    subline: '—— 也，过有意思的生活。',
    bio: [
      { text: '字节跳动的' },
      { text: '前端工程师', variant: 'underline' as const },
      { text: '，住在深圳。喜欢有设计感、人性化、新颖的东西，也想成为做这类产品的人。最近在和 ' },
      { text: 'AI', variant: 'chip' as const },
      { text: ' 交朋友，让它陪我学习、做有意思的产品。工作之余，看书、玩魔方、变魔术、拍照。' },
    ],
    cta: '读我写的文章',
  },
} as const;
```

- [ ] **Step 2: Update `src/components/home/hero.tsx`**

Change the imports block from:
```tsx
import { PROFILE } from '##/lib/data';
```
to:
```tsx
import { PROFILE } from '##/content/common';
import { HOME } from '##/content/home';
```

Replace every hardcoded string in the JSX. Full updated JSX for the hero section (keep all CSS, svg, Image, and logic unchanged — only text values change):

**Time row** (currently `SHENZHEN — {time} CST`):
```tsx
<span className={styles.timeText}>{HOME.hero.location} — {time} {HOME.hero.timezone}</span>
```

**figLabel / selfLabel** (currently `FIG. 01` and `SELF`):
```tsx
<div className={styles.figLabel}>
  <span>{HOME.hero.figLabel}</span>
  <span style={{ width: 16, height: 1, background: 'var(--ui-color-canvas)', opacity: 0.5 }} />
  <span>{HOME.hero.selfLabel}</span>
</div>
```

**Annotation** (currently `ŌU · /oʊ/`):
```tsx
<span className={styles.avatarAnnotation}>{HOME.hero.pronunciation}</span>
```

**Name row** (currently `Dewey Ou · 欧怼怼`):
```tsx
<div className={styles.nameRow}>
  <span className={styles.nameEn}>{HOME.hero.nameEn}</span>
  <span className={styles.nameSep}>{HOME.hero.nameSep}</span>
  {HOME.hero.nameZh}
</div>
```

**Est label** (currently `EST · 2018`):
```tsx
<span className={styles.estText}>{HOME.hero.estLabel}</span>
```

**Headline** (currently inline `做 / 有意思 / 的产品 / ——也，过有意思的生活`):
```tsx
<div className={styles.headline}>
  {HOME.hero.headlinePre}
  <span className={styles.highlight}>
    <span className={styles.highlightText}>{HOME.hero.headlineHighlight}</span>
    <span className={styles.highlightBg} aria-hidden="true" />
  </span>
  {HOME.hero.headlinePost}<br />
  <span style={{ color: 'var(--ui-color-text-muted)' }}>{HOME.hero.subline}</span>
</div>
```

**Bio paragraph** (currently inline JSX with `<span>` children):
```tsx
<p className={styles.bio}>
  {HOME.hero.bio.map((seg, i) =>
    seg.variant === 'underline' ? (
      <span key={i} className={styles.bioUnderline}>{seg.text}</span>
    ) : seg.variant === 'chip' ? (
      <span key={i} className={styles.aiChip}>{seg.text}</span>
    ) : (
      <span key={i}>{seg.text}</span>
    )
  )}
</p>
```

**CTA** (currently `读我写的文章`):
```tsx
<Link href="/blog" className={styles.cta}>
  <span>{HOME.hero.cta}</span>
  <i className={`ti ti-arrow-up-right ${styles.ctaArrow}`} />
</Link>
```

- [ ] **Step 3: Verify build passes**

```bash
bun run build
```

Expected: `✓ Compiled successfully` with no TypeScript errors.

- [ ] **Step 4: Commit**

```bash
git add src/content/home.ts src/components/home/hero.tsx
git commit -m "feat: extract hero text to src/content/home.ts"
```

---

### Task 3: blog.ts + blog-list

**Files:**
- Create: `src/content/blog.ts`
- Modify: `src/components/blog/blog-list.tsx`

- [ ] **Step 1: Create `src/content/blog.ts`**

```ts
export const BLOG = {
  eyebrow: 'INDEX',
  entriesLabel: 'ENTRIES',
  heading: '文章',
  description: '关于前端、设计、AI、产品和生活的一些思考。慢慢写。',
  postsPerYearSuffix: '篇',
} as const;

export const TAGS = ['全部', 'AI', '前端设计', '产品思考', '生活随笔', '读书笔记'] as const;
```

- [ ] **Step 2: Update `src/components/blog/blog-list.tsx`**

Change import line from:
```tsx
import { TAGS } from '##/lib/data';
```
to:
```tsx
import { BLOG, TAGS } from '##/content/blog';
```

Replace hardcoded strings in the JSX:

**Eyebrow** (currently `INDEX · {posts.length} ENTRIES`):
```tsx
<div className="eyebrow" style={{ marginBottom: 20, display: 'inline-flex', alignItems: 'center', gap: 10 }}>
  <span style={{ width: 24, height: 1, background: 'currentColor' }} />
  {BLOG.eyebrow} · {posts.length} {BLOG.entriesLabel}
</div>
```

**Heading** (currently `文章`):
```tsx
<h1 style={{ fontSize: '4rem', fontWeight: 700, lineHeight: 1.05, marginBottom: 24, letterSpacing: '-0.015em' }}>
  {BLOG.heading}
</h1>
```

**Description** (currently inline Chinese string):
```tsx
<p style={{ fontSize: 17, color: 'var(--ui-color-text-muted)', maxWidth: 540, lineHeight: 1.7 }}>
  {BLOG.description}
</p>
```

**Posts per year suffix** (currently `{byYear[year].length} 篇`):
```tsx
<span style={{ fontSize: 12, color: 'var(--ui-color-text-muted)' }}>{byYear[year].length} {BLOG.postsPerYearSuffix}</span>
```

- [ ] **Step 3: Verify build passes**

```bash
bun run build
```

Expected: `✓ Compiled successfully` with no TypeScript errors.

- [ ] **Step 4: Commit**

```bash
git add src/content/blog.ts src/components/blog/blog-list.tsx
git commit -m "feat: extract blog page text to src/content/blog.ts"
```

---

### Task 4: portfolio.ts + portfolio page + grid

**Files:**
- Create: `src/content/portfolio.ts`
- Modify: `src/app/portfolio/page.tsx`
- Modify: `src/components/portfolio/portfolio-grid.tsx`

- [ ] **Step 1: Create `src/content/portfolio.ts`**

```ts
export const PORTFOLIO = {
  eyebrow: 'PORTFOLIO',
  heading: '作品集',
  description: 'GitHub 项目、设计稿、摄影作品。',
} as const;

export const PORTFOLIO_TAGS = ['全部', 'GitHub', '设计', '摄影'] as const;

export const PORTFOLIO_ITEMS = [
  { id: 'gh-deweyou-design', tag: 'GitHub',  title: 'Deweyou Design',    subtitle: '我的个人设计系统',      year: '2026', desc: '一套写给自己的 React 组件库 + 设计 token。强调宋体、留白与 mint 高亮三件套。',         meta: 'TypeScript · React · CSS', stars: 128, accent: 'mint',  href: 'https://github.com/deweyou/design' },
  { id: 'gh-claude-coder',   tag: 'GitHub',  title: 'claude-coder',      subtitle: 'AI 协作的命令行工具',   year: '2025', desc: '一个把 Claude 接入本地代码库的 CLI——支持上下文索引、任务拆分、增量 diff review。',    meta: 'TypeScript · Node',        stars: 412, accent: 'plain', href: '#' },
  { id: 'gh-cube-timer',     tag: 'GitHub',  title: 'cube-timer',        subtitle: '魔方计时器（PWA）',     year: '2024', desc: '为速拧爱好者写的极简计时器，支持 Stackmat 协议、平均值统计、CSV 导出。',              meta: 'TypeScript · PWA',         stars: 56,  accent: 'plain', href: '#' },
  { id: 'de-personal-site',  tag: '设计',    title: '个人主页 v3',       subtitle: '从模板到有审美',        year: '2026', desc: '为自己写的网站。用宋体做主字体，用一抹 mint 做高亮，用等高线做背景纹理。',              meta: 'Figma · React',            accent: 'mint' },
  { id: 'de-bytedance-form', tag: '设计',    title: 'B 端表单引擎',      subtitle: '设计稿 + 组件落地',    year: '2025', desc: '抽象 30+ 个内部表单的共性，重新设计了一套从 schema 到组件的渲染流水线。',              meta: 'Internal · ByteDance',     accent: 'plain' },
  { id: 'de-poster-2024',    tag: '设计',    title: '2024 海报合集',     subtitle: '一年一张周回',          year: '2024', desc: '52 张周报海报。从极简版式到实验排版，记录我那一年对字体的执着。',                        meta: 'Figma · 印刷',             accent: 'plain' },
  { id: 'ph-shenzhen-night', tag: '摄影',    title: '深圳夜',            subtitle: '城市与人',              year: '2026', desc: '富士 X-T5 + XF23 F2，加班晚归路上的杂记。',                                         meta: 'Fujifilm · 28 张',         accent: 'plain' },
  { id: 'ph-kyoto',          tag: '摄影',    title: '京都八日',          subtitle: '游记 · 银盐',           year: '2025', desc: '一台胶片机 + 八卷柯达 Gold 200，关于光、阴影与寺庙的午后。',                          meta: 'Canonet · 36 张',          accent: 'mint' },
  { id: 'ph-cube-moments',   tag: '摄影',    title: '魔方时刻',          subtitle: '微距系列',              year: '2024', desc: '90mm 微距镜头下的 26 个色块，关于秩序与混乱的小宇宙。',                              meta: 'Fujifilm · 12 张',         accent: 'plain' },
];
```

- [ ] **Step 2: Update `src/app/portfolio/page.tsx`**

Add import at the top:
```tsx
import { PORTFOLIO } from '##/content/portfolio';
```

Replace hardcoded strings in JSX:

**Eyebrow** (currently `PORTFOLIO`):
```tsx
<div className="eyebrow" style={{ marginBottom: 20, display: 'inline-flex', alignItems: 'center', gap: 10 }}>
  <span style={{ width: 24, height: 1, background: 'currentColor' }} />
  {PORTFOLIO.eyebrow}
</div>
```

**Heading** (currently `作品集`):
```tsx
<h1 style={{ fontSize: '3.5rem', fontWeight: 700, lineHeight: 1.05, marginBottom: 16, letterSpacing: '-0.015em' }}>
  {PORTFOLIO.heading}
</h1>
```

**Description** (currently inline Chinese string):
```tsx
<p style={{ fontSize: 17, color: 'var(--ui-color-text-muted)', maxWidth: 540, lineHeight: 1.7, marginBottom: 56 }}>
  {PORTFOLIO.description}
</p>
```

- [ ] **Step 3: Update `src/components/portfolio/portfolio-grid.tsx`**

Change import line from:
```tsx
import { PORTFOLIO_ITEMS, PORTFOLIO_TAGS } from '##/lib/data';
```
to:
```tsx
import { PORTFOLIO_ITEMS, PORTFOLIO_TAGS } from '##/content/portfolio';
```

No other changes needed — variable names are identical.

- [ ] **Step 4: Verify build passes**

```bash
bun run build
```

Expected: `✓ Compiled successfully` with no TypeScript errors.

- [ ] **Step 5: Commit**

```bash
git add src/content/portfolio.ts src/app/portfolio/page.tsx src/components/portfolio/portfolio-grid.tsx
git commit -m "feat: extract portfolio content to src/content/portfolio.ts"
```

---

### Task 5: about.ts + about page

**Files:**
- Create: `src/content/about.ts`
- Modify: `src/app/about/page.tsx`

- [ ] **Step 1: Create `src/content/about.ts`**

```ts
export const ABOUT = {
  eyebrow: 'ABOUT · 关于',
  headingLine1: '一份不那么严肃的',
  headingLine2: '「自我说明」',
  tocLabel: '目录',
} as const;

export const ABOUT_SECTIONS = [
  {
    id: 'intro', label: '简介', kind: 'prose' as const,
    body: [
      '我是欧怼怼，英文名 Dewey Ou，目前在深圳，是字节跳动的一名前端工程师。',
      '工作之外，我把自己当成产品的"作者"——喜欢有设计感、人性化、新颖、有意思的东西，也希望成为做这类产品的人。最近一段时间，我在和 AI 交朋友，让它陪我学习、陪我做有意思的小工具。',
      '这个网站记录我写的文章、做的项目，以及生活里那些不那么严肃的瞬间。',
    ],
  },
  {
    id: 'now', label: '近况', kind: 'list' as const,
    items: [
      { k: '正在做', v: '把工作中的设计沉淀整理成 Deweyou Design 系统' },
      { k: '正在写', v: '一篇关于 AI Coding 协作方式的长文' },
      { k: '正在读', v: '原研哉《设计中的设计》' },
      { k: '正在练', v: '三阶魔方平均 28 秒' },
      { k: '想去',   v: '京都 · 直岛 · 冰岛' },
    ],
  },
  {
    id: 'work', label: '工作经历', kind: 'timeline' as const,
    items: [
      { from: '2022', to: '至今', org: '字节跳动 ByteDance', role: '前端工程师', detail: 'B 端业务前端，负责设计系统沉淀、复杂表单引擎、AI 辅助开发工具链。' },
      { from: '2020', to: '2022', org: '某初创公司', role: '高级前端', detail: '参与 0→1 移动端业务，搭建组件库与设计协作流程。' },
      { from: '2018', to: '2020', org: '广州某互联网公司', role: '前端工程师', detail: '电商业务前端，负责 H5 营销活动、性能优化。' },
    ],
  },
  {
    id: 'skills', label: '能力', kind: 'tags' as const,
    groups: [
      { name: '前端', items: ['React', 'TypeScript', 'CSS / Less', '动画 / 交互', '设计系统'] },
      { name: '设计', items: ['Figma', '排版与字体', '色彩系统', '产品 sense'] },
      { name: 'AI',   items: ['Prompt 工程', 'Claude / GPT', 'Agent 开发', 'AI Coding'] },
      { name: '兴趣', items: ['摄影', '魔方', '近景魔术', '阅读'] },
    ],
  },
  {
    id: 'philosophy', label: '一些想法', kind: 'quotes' as const,
    items: [
      '做有意思的产品，过有意思的生活。',
      '所谓 sense，不是直觉，而是被无数次验证过的判断。',
      '人最值钱的部分，是品味。',
      '对自己温柔一点，对作品狠一点。',
    ],
  },
  {
    id: 'contact', label: '联系', kind: 'prose' as const,
    body: [
      '想聊聊产品、设计、AI 协作或者只是说一声 hi——任何渠道都欢迎，我会回复每一封像样的来信。',
    ],
  },
] as const;
```

- [ ] **Step 2: Update `src/app/about/page.tsx`**

Change import line from:
```tsx
import { ABOUT_SECTIONS, PROFILE } from '##/lib/data';
```
to:
```tsx
import { PROFILE } from '##/content/common';
import { ABOUT, ABOUT_SECTIONS } from '##/content/about';
```

Replace hardcoded strings in JSX:

**Eyebrow** (currently `ABOUT · 关于`):
```tsx
<div className="eyebrow" style={{ marginBottom: 18 }}>
  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
    <span style={{ width: 12, height: 1, background: 'currentColor' }} />
    {ABOUT.eyebrow}
  </span>
</div>
```

**Heading** (currently `一份不那么严肃的` / `「自我说明」`):
```tsx
<h1 style={{ fontFamily: 'var(--ui-font-display)', fontSize: '3rem', fontWeight: 600,
  lineHeight: 1.15, margin: 0, letterSpacing: '-0.01em' }}>
  {ABOUT.headingLine1}<br />
  <em style={{ fontStyle: 'italic', fontWeight: 500, color: 'var(--ui-color-text-muted)' }}>{ABOUT.headingLine2}</em>。
</h1>
```

**TOC label** (currently `目录`):
```tsx
<div className="eyebrow" style={{ marginBottom: 14 }}>{ABOUT.tocLabel}</div>
```

- [ ] **Step 3: Verify build passes**

```bash
bun run build
```

Expected: `✓ Compiled successfully` with no TypeScript errors.

- [ ] **Step 4: Commit**

```bash
git add src/content/about.ts src/app/about/page.tsx
git commit -m "feat: extract about page content to src/content/about.ts"
```

---

### Task 6: Delete data.ts

**Files:**
- Delete: `src/lib/data.ts`

- [ ] **Step 1: Check no remaining imports of `##/lib/data`**

```bash
grep -r "lib/data" src/
```

Expected output: nothing (empty). If any files still import from `##/lib/data`, fix them before proceeding.

- [ ] **Step 2: Delete `src/lib/data.ts`**

```bash
rm src/lib/data.ts
```

- [ ] **Step 3: Check if `src/lib/` is now empty**

```bash
ls src/lib/
```

If `src/lib/` only contained `data.ts` and is now empty, remove the directory:

```bash
rmdir src/lib/
```

If `src/lib/` has other files (e.g. `posts.ts`), leave the directory in place.

- [ ] **Step 4: Verify build passes**

```bash
bun run build
```

Expected: `✓ Compiled successfully` with no TypeScript errors.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "chore: delete src/lib/data.ts — all content migrated to src/content/"
```
