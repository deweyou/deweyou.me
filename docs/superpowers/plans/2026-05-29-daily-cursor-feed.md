# Daily Cursor Feed Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make `/daily` load only the newest batch initially, then fetch older entries through a cursor API.

**Architecture:** `src/lib/daily.ts` owns cursor slicing over the sorted daily entries. `/daily` server-renders the first batch and passes it to `DailyVirtualTimeline`, while `src/app/api/daily/route.ts` returns older batches as JSON. The detail route remains `/daily/[id]`.

**Tech Stack:** Next.js 16 App Router, React Client Component, TypeScript, `@deweyou-design/react` VirtualList, MDX content read from the filesystem.

---

### Task 1: Daily Reader Cursor Slicing

**Files:**
- Modify: `src/lib/daily.ts`

- [ ] Add `DailyFeedBatch` and `getDailyFeedBatch({ cursor, limit })`.
- [ ] Clamp `limit` to `1..50`, defaulting callers to 20.
- [ ] Return newest entries when cursor is absent.
- [ ] Return entries after the cursor when cursor is present.
- [ ] Throw a clear error for an unknown cursor.

### Task 2: API Route

**Files:**
- Create: `src/lib/daily-feed.ts`
- Create: `src/app/api/daily/route.ts`

- [ ] Add `serializeDailyFeedBatch()` to convert raw entries into serialized MDX
  feed entries.
- [ ] Parse `cursor` and `limit` from `request.nextUrl.searchParams`.
- [ ] Return `{ entries, nextCursor }` with status 200.
- [ ] Return status 400 for invalid cursors.
- [ ] Return status 500 for unexpected errors.

### Task 3: Server Page First Batch

**Files:**
- Modify: `src/app/daily/page.tsx`

- [ ] Read the first batch with `getDailyFeedBatch({ limit: 20 })`.
- [ ] Serialize the first batch before passing it to the Client Component.
- [ ] Keep hero metadata based on all entries.
- [ ] Pass `initialEntries`, `initialNextCursor`, and `totalCount` to the client timeline.
- [ ] Render initial entry nodes from the first batch only.

### Task 4: Client Timeline Fetching

**Files:**
- Modify: `src/components/daily/virtual-timeline.tsx`

- [ ] Replace client reveal state with appended entry state.
- [ ] Fetch `/api/daily?cursor=<id>&limit=20` near the visible range end.
- [ ] Append returned entries and update `nextCursor`.
- [ ] Show loading, end, and retry states without removing existing entries.
- [ ] Keep virtual rendering keyed by stable `id`.

### Task 5: Verification

**Commands:**
- `pnpm exec tsc --noEmit`
- `pnpm exec eslint src/lib/daily.ts src/app/daily/page.tsx 'src/app/daily/[id]/page.tsx' src/components/daily/virtual-timeline.tsx src/app/api/daily/route.ts`
- `pnpm build`

**Smoke checks:**
- `/api/daily?limit=5` returns 5 entries and a cursor.
- `/api/daily?limit=5&cursor=<cursor>` returns the next batch.
- `/daily/daily-20260528-01` returns 200.
