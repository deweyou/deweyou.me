# Daily Learning Page Design

## Goal

Add a new "每日学习" section for short daily AI learning notes. The experience should feel like a clean long-form timeline: easy to scan like a social feed, but structured enough to become a durable personal knowledge archive.

## User-Facing Scope

- Add a top-level route at `/daily`.
- Add a nav item named `每日学习`.
- Show daily entries in a date-grouped timeline list.
- Use one MDX file per day for the first version.
- Preserve a path for future support of multiple entries per day.

Out of scope for the first version:

- AI-generated card images.
- A writing or generation UI.
- Per-entry comments, likes, or social metrics.
- A required detail page for every entry.

## Content Model

Daily content lives under:

```text
content/daily/YYYY-MM-DD.mdx
```

Each file represents one daily note in v1:

```md
---
title: 长上下文不等于长记忆
date: 2026-05-10
tags: [LLM, Agent]
---

一句话结论：把更多内容塞进上下文窗口，不会自动让模型更会用信息；上下文越长，检索和组织越重要。

这是什么：上下文窗口只表示模型一次最多能看到多少 token，不代表它会均匀关注每一段内容。
```

The reading layer should be isolated in `src/lib/daily.ts`, so a future migration from one-entry-per-file to one-day-with-many-entries does not force page or component rewrites. The first version only needs to read one entry per file, but type names should avoid implying that a day can never contain multiple entries.

## Page Design

`/daily` uses the same root layout as the rest of the site. The page starts with a compact hero:

- Eyebrow: `AI DAILY` or similar.
- Title: `每日学习`.
- Description: one sentence explaining that this is a daily archive of AI notes.
- Metadata: total entry count and latest entry date.

Below the hero, entries render as a clean timeline:

- Group by year, then sort entries descending by date.
- Show the date in a mono style near the left edge of each entry.
- Show the note card content on the right.
- Keep the card visually restrained: no nested card shells, no social-media chrome, no reaction UI.
- Tags appear as small `dy-tag`-style chips.

The visual reference is the selected "A" direction from brainstorming: date-grouped archive timeline, not a Twitter clone. It should still read smoothly as a feed when scrolling.

## Entry Rendering

Each entry card displays:

- Date.
- Title.
- Optional tags.
- MDX body rendered inline.

The body should support ordinary Markdown/MDX content used in short notes:

- Paragraphs.
- Links.
- Lists.
- Inline code.
- Strong/emphasis.

Because the current content format is concise, v1 should render the full entry inline instead of requiring a detail click. If entries become much longer, a later version can add a collapse control or detail route without changing the content source.

## Routing And Next.js Notes

This project uses Next.js 16 App Router. Page files should follow the App Router conventions documented under `node_modules/next/dist/docs/`.

The `/daily` page can be a Server Component. If a future expand/collapse control is added, isolate that interactivity in a small Client Component rather than converting the full page unnecessarily.

## Integration With Existing Site

- Add `每日学习` to `NAV_LINKS` in `src/content/common.ts`.
- Reuse existing shared styles from `src/styles/site.css` where possible.
- Use CSS modules for page-specific timeline styling if inline styles become hard to maintain.
- Do not change portfolio/about nav behavior.
- Do not alter the blog heading slug invariant.

## Empty And Error States

If there are no daily entries, `/daily` should render the hero and a quiet empty state explaining that no notes have been published yet.

Malformed frontmatter should fail during build or development with a clear error from `src/lib/daily.ts`; silently dropping invalid entries would make content mistakes harder to notice.

## Verification

Implementation should be verified with:

- TypeScript/build check.
- Lint if available and practical.
- Browser check of `/daily` on desktop and mobile widths.
- A sample MDX entry matching the provided "长上下文不等于长记忆" content.

## Open Decisions Resolved

- Content source: one MDX file per day under `content/daily/`.
- Page style: date-grouped timeline list.
- Nav: visible top-level nav item named `每日学习`.
- First version cardinality: one entry per day, with reader boundaries prepared for future multiple entries per day.
