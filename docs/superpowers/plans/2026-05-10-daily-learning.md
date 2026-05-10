# Notes Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a `/daily` "笔记" archive page backed by one MDX file per day.

**Architecture:** Add a focused daily content reader in `src/lib/daily.ts`, render MDX inline on a Server Component page, and keep page-specific layout in a CSS module. The daily page reuses the blog MDX renderer for reading style and adds only timeline-specific structure around it.

**Tech Stack:** Next.js 16 App Router, TypeScript, `gray-matter`, `next-mdx-remote/rsc`, existing `@deweyou-design` typography via blog `mdxComponents`, CSS modules.

---

## File Structure

- Create `content/daily/2026-05-10.mdx`: sample daily learning note from the user-provided content.
- Create `src/lib/daily.ts`: read `content/daily/*.mdx`, validate frontmatter, normalize dates/tags, sort descending, and group entries by year.
- Create `src/app/daily/page.tsx`: Server Component for the daily archive page.
- Create `src/app/daily/page.module.css`: timeline layout, blog-compatible reading column, H5 responsive behavior.
- Modify `src/content/common.ts`: add nav item `{ href: '/daily', label: '笔记' }`.

## Task 1: Daily Content Reader

**Files:**
- Create: `src/lib/daily.ts`
- Create: `content/daily/2026-05-10.mdx`

- [ ] **Step 1: Write the sample MDX entry**

Create `content/daily/2026-05-10.mdx`:

```md
---
title: 长上下文不等于长记忆
date: 2026-05-10
tags: [LLM, Agent]
---

一句话结论：把更多内容塞进上下文窗口，不会自动让模型更会用信息；上下文越长，检索和组织越重要。

这是什么：上下文窗口只表示模型一次最多能看到多少 token，不代表它会均匀关注每一段内容。长输入里常出现“中间信息被忽略”、关键信号被噪声稀释的问题，所以可见不等于可用。真正有效的是让相关信息以清晰结构和短路径出现。

为什么重要：很多团队以为升级到更长上下文模型，就能少做检索、摘要和状态管理，结果成本升了，回答却更飘。

例子：给客服 Agent 一次塞进 200 页手册，不如先检索出 3 段最相关条款，再附上当前工单状态，回答通常更稳。

边界/误区：长上下文不是没用，它适合保留原文和跨段引用；但不能替代重排、摘要和记忆设计。
```

- [ ] **Step 2: Write a temporary failing smoke check for the missing reader**

Run:

```bash
pnpm exec tsc --noEmit
```

Expected: `tsc` still passes or fails for existing reasons, because `src/lib/daily.ts` does not exist yet. The real red check happens when the page imports the reader in Task 2; this repo has no test runner configured, so TypeScript/build checks are the available automated checks.

- [ ] **Step 3: Implement the daily reader**

Create `src/lib/daily.ts`:

```ts
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const DAILY_DIR = path.join(process.cwd(), 'content', 'daily');

export interface DailyEntry {
  slug: string;
  title: string;
  date: string;
  tags: string[];
  content: string;
}

export interface DailyYearGroup {
  year: string;
  entries: DailyEntry[];
}

function normalizeDate(value: unknown, file: string): string {
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value)) return value;
  throw new Error(`Daily entry ${file} must include date as YYYY-MM-DD`);
}

function normalizeTags(value: unknown, file: string): string[] {
  if (value == null) return [];
  if (Array.isArray(value) && value.every((item) => typeof item === 'string')) return value;
  throw new Error(`Daily entry ${file} tags must be a string array`);
}

function readEntry(file: string): DailyEntry {
  const raw = fs.readFileSync(path.join(DAILY_DIR, file), 'utf8');
  const { data, content } = matter(raw);
  if (typeof data.title !== 'string' || data.title.trim() === '') {
    throw new Error(`Daily entry ${file} must include title`);
  }

  return {
    slug: file.replace(/\.mdx$/, ''),
    title: data.title,
    date: normalizeDate(data.date, file),
    tags: normalizeTags(data.tags, file),
    content,
  };
}

export function getAllDailyEntries(): DailyEntry[] {
  if (!fs.existsSync(DAILY_DIR)) return [];
  return fs.readdirSync(DAILY_DIR)
    .filter((file) => file.endsWith('.mdx'))
    .map(readEntry)
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function groupDailyEntriesByYear(entries: DailyEntry[]): DailyYearGroup[] {
  const groups = new Map<string, DailyEntry[]>();
  for (const entry of entries) {
    const year = entry.date.slice(0, 4);
    groups.set(year, [...(groups.get(year) ?? []), entry]);
  }
  return Array.from(groups, ([year, yearEntries]) => ({ year, entries: yearEntries }));
}
```

- [ ] **Step 4: Verify TypeScript**

Run:

```bash
pnpm exec tsc --noEmit
```

Expected: no TypeScript errors from `src/lib/daily.ts`.

## Task 2: Daily Archive Page

**Files:**
- Create: `src/app/daily/page.tsx`
- Create: `src/app/daily/page.module.css`

- [ ] **Step 1: Write the page importing the daily reader and MDX renderer**

Create `src/app/daily/page.tsx`:

```tsx
import { MDXRemote } from 'next-mdx-remote/rsc';
import { mdxComponents } from '##/components/blog/mdx-components';
import { getAllDailyEntries, groupDailyEntriesByYear } from '##/lib/daily';
import styles from './page.module.css';

export const metadata = {
  title: '笔记 — Dewey Ou',
  description: 'Dewey Ou 的笔记归档。',
};

export default function DailyPage() {
  const entries = getAllDailyEntries();
  const groups = groupDailyEntriesByYear(entries);
  const latestDate = entries[0]?.date;

  return (
    <div className="page">
      <section className={`container container-sm ${styles.hero}`}>
        <div className="eyebrow">
          <span className={styles.eyebrowRule} />
          AI DAILY
        </div>
        <h1 className={styles.title}>笔记</h1>
        <p className={styles.description}>随手记录一些概念、方法和观察，留给之后的自己回看。</p>
        <div className={styles.meta}>
          <span>{entries.length} 条记录</span>
          {latestDate && <span>最近更新 {latestDate}</span>}
        </div>
      </section>

      <section className={`container container-sm ${styles.timeline}`} aria-label="笔记列表">
        {entries.length === 0 ? (
          <p className={styles.empty}>还没有发布笔记。</p>
        ) : (
          groups.map((group) => (
            <div key={group.year} className={styles.yearGroup}>
              <div className={styles.yearLabel}>{group.year}</div>
              <div className={styles.entries}>
                {group.entries.map((entry) => (
                  <article key={entry.slug} className={styles.entry} id={entry.slug}>
                    <header className={styles.entryHeader}>
                      <time dateTime={entry.date} className={styles.date}>{entry.date.slice(5)}</time>
                      <h2 className={styles.entryTitle}>{entry.title}</h2>
                      {entry.tags.length > 0 && (
                        <div className={styles.tags}>
                          {entry.tags.map((tag) => (
                            <span key={tag} className="dy-tag">{tag}</span>
                          ))}
                        </div>
                      )}
                    </header>
                    <div className={styles.body}>
                      <MDXRemote source={entry.content} components={mdxComponents} />
                    </div>
                  </article>
                ))}
              </div>
            </div>
          ))
        )}
      </section>
    </div>
  );
}
```

- [ ] **Step 2: Add responsive timeline CSS**

Create `src/app/daily/page.module.css`:

```css
.hero {
  padding-top: 96px;
  padding-bottom: 48px;
}

.hero :global(.eyebrow) {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
}

.eyebrowRule {
  width: 24px;
  height: 1px;
  background: currentColor;
}

.title {
  font-family: var(--ui-font-display);
  font-size: clamp(2.25rem, 6vw, 4rem);
  font-weight: 700;
  line-height: 1.05;
  margin: 0 0 24px;
  letter-spacing: 0;
}

.description {
  font-size: 17px;
  color: var(--ui-color-text-muted);
  max-width: 620px;
  line-height: 1.75;
  margin: 0;
}

.meta {
  display: flex;
  flex-wrap: wrap;
  gap: 12px 20px;
  margin-top: 28px;
  font-family: var(--ui-font-mono);
  font-size: 12px;
  color: var(--ui-color-text-muted);
  letter-spacing: 0.05em;
}

.timeline {
  padding-bottom: 120px;
}

.empty {
  color: var(--ui-color-text-muted);
  font-size: 16px;
  line-height: 1.7;
}

.yearGroup {
  display: grid;
  grid-template-columns: 72px minmax(0, 1fr);
  gap: 32px;
  margin-bottom: 72px;
}

.yearLabel {
  position: sticky;
  top: 96px;
  align-self: start;
  font-family: var(--ui-font-mono);
  font-size: 12px;
  color: var(--ui-color-text-muted);
  letter-spacing: 0.1em;
}

.entries {
  min-width: 0;
}

.entry {
  padding: 0 0 44px;
  margin-bottom: 44px;
  border-bottom: 1px solid var(--ui-color-border);
}

.entry:last-child {
  margin-bottom: 0;
}

.entryHeader {
  margin-bottom: 22px;
}

.date {
  display: block;
  margin-bottom: 10px;
  font-family: var(--ui-font-mono);
  font-size: 12px;
  color: var(--ui-color-brand-text);
  letter-spacing: 0.08em;
}

.entryTitle {
  font-family: var(--ui-font-display);
  font-size: clamp(1.45rem, 4vw, 2rem);
  line-height: 1.2;
  font-weight: 700;
  margin: 0 0 14px;
  letter-spacing: 0;
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.body {
  min-width: 0;
}

.body :global(.dy-code) {
  max-width: 100%;
}

@media (max-width: 768px) {
  .hero {
    padding-top: 72px;
    padding-bottom: 40px;
  }

  .title {
    font-size: 2.35rem;
  }

  .description {
    font-size: 16px;
  }

  .timeline {
    padding-bottom: 88px;
  }

  .yearGroup {
    display: block;
    margin-bottom: 56px;
  }

  .yearLabel {
    position: static;
    margin-bottom: 24px;
  }

  .entry {
    padding-bottom: 36px;
    margin-bottom: 36px;
  }

  .entryTitle {
    font-size: 1.55rem;
  }
}
```

- [ ] **Step 3: Verify TypeScript and build**

Run:

```bash
pnpm exec tsc --noEmit
pnpm build
```

Expected: both commands complete without errors.

## Task 3: Navigation Integration

**Files:**
- Modify: `src/content/common.ts`

- [ ] **Step 1: Add the nav item**

Modify `src/content/common.ts`:

```ts
export const NAV_LINKS = [
  { href: '/',      label: '主页' },
  { href: '/blog',  label: '文章' },
  { href: '/daily', label: '笔记' },
  // { href: '/portfolio', label: '作品集' },
  // { href: '/about',     label: '关于' },
] as const;
```

- [ ] **Step 2: Verify lint/build**

Run:

```bash
pnpm lint
pnpm build
```

Expected: no lint or build errors from the nav change.

## Task 4: Browser And H5 Verification

**Files:**
- Inspect visually: `/daily`

- [ ] **Step 1: Start the dev server**

Run:

```bash
pnpm dev
```

Expected: Next.js dev server prints a local URL, normally `http://localhost:3000`.

- [ ] **Step 2: Desktop visual check**

Open `/daily` in the browser at desktop width. Confirm:

- Nav includes `笔记`.
- Hero metadata shows `1 条记录` and `最近更新 2026-05-10`.
- Entry body uses the same paragraph rhythm and typography as blog posts.
- Timeline has year label on the left and entry content on the right.

- [ ] **Step 3: H5 visual check**

Open `/daily` at about 390px width. Confirm:

- No horizontal page overflow.
- The timeline is single-column.
- Date, title, tags, and body wrap without clipping.
- Code block behavior matches blog style if inline/code content is present.
- Text remains readable and touch targets are comfortable.

- [ ] **Step 4: Final status check**

Run:

```bash
git status --short
```

Expected: only intended implementation files are modified or added.
