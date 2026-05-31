# Daily Responsive Detail Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Render `/daily` and `/daily/[id]` through a shared responsive feed/detail experience with animated desktop panel and mobile full-screen detail.

**Architecture:** Add focused Daily Experience and Daily Detail components. Keep route files as data loaders and metadata owners. The feed continues to own cursor loading and receives the active id for styling.

**Tech Stack:** Next.js 16 App Router, React Server/Client Components, TypeScript, CSS Modules, next-mdx-remote.

---

### Task 1: Detail Component

**Files:**
- Create: `src/components/daily/daily-detail.tsx`

- [ ] Render selected daily entry title, date, tags, and MDX body.
- [ ] Support a compact back link for narrow screens.

### Task 2: Shared Experience Shell

**Files:**
- Create: `src/components/daily/daily-experience.tsx`
- Modify: `src/app/daily/page.module.css`

- [ ] Render feed and optional detail in a responsive shell.
- [ ] Desktop uses two columns when a selected detail exists.
- [ ] Mobile shows feed-only for `/daily` and detail-only for `/daily/[id]`.
- [ ] Add restrained slide/fade animation and reduced-motion handling.

### Task 3: Route Integration

**Files:**
- Modify: `src/app/daily/page.tsx`
- Modify: `src/app/daily/[id]/page.tsx`

- [ ] Move repeated feed/detail markup into shared components.
- [ ] `/daily` passes no selected entry.
- [ ] `/daily/[id]` passes selected entry.

### Task 4: Feed Active Item

**Files:**
- Modify: `src/components/daily/virtual-timeline.tsx`
- Modify: `src/app/daily/page.module.css`

- [ ] Accept `activeId`.
- [ ] Mark matching feed item.
- [ ] Use `scroll={false}` on feed detail links.

### Task 5: Verification

**Commands:**
- `pnpm exec tsc --noEmit`
- `pnpm exec eslint src/app/daily/page.tsx 'src/app/daily/[id]/page.tsx' src/components/daily/daily-experience.tsx src/components/daily/daily-detail.tsx src/components/daily/virtual-timeline.tsx src/app/api/daily/route.ts src/lib/daily.ts src/lib/daily-feed.ts`
- `pnpm build`

**Smoke checks:**
- `/daily` returns 200.
- `/daily/daily-20260528-01` returns 200.
- `/api/daily?limit=5` returns 5 entries.
