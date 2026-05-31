# Daily Collapsible Feed Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a responsive feed toggle to `/daily/[id]`: desktop collapses the left feed, mobile opens the feed as a drawer, and the primary toggle stays pinned while reading.

**Architecture:** Keep `DailyExperience` as the server-side composition layer and add one client layout component for UI-only state. Preserve canonical routing and feed scroll restoration by keeping `DailyFeedPane` mounted in both desktop states and by using a mobile overlay drawer rather than route navigation.

**Tech Stack:** Next.js 16 App Router, React Server/Client Components, TypeScript, CSS Modules, `@deweyou-design/react` Button/Icon primitives.

---

### Task 1: Contract Test

**Files:**
- Create: `test/daily-collapsible-feed.test.mjs`

- [x] **Step 1: Write the failing test**

```js
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import test from 'node:test';

test('daily detail layout exposes desktop collapse and mobile drawer contracts', () => {
  assert.equal(existsSync('src/components/daily/daily-detail-layout.tsx'), true);

  const layout = readFileSync('src/components/daily/daily-detail-layout.tsx', 'utf8');
  const experience = readFileSync('src/components/daily/daily-experience.tsx', 'utf8');
  const feedPane = readFileSync('src/components/daily/daily-feed-pane.tsx', 'utf8');
  const css = readFileSync('src/app/daily/page.module.css', 'utf8');

  assert.match(layout, /data-feed-collapsed/);
  assert.match(layout, /data-feed-drawer-open/);
  assert.match(layout, /daily-feed-panel/);
  assert.match(layout, /sessionStorage/);
  assert.match(experience, /DailyDetailLayout/);
  assert.match(feedPane, /id\\?: string/);
  assert.match(css, /experienceSplit\\[data-feed-collapsed="true"\\]/);
  assert.match(css, /experienceSplit\\[data-feed-drawer-open="true"\\]/);
});
```

- [x] **Step 2: Run test to verify it fails**

Run: `node --test test/daily-collapsible-feed.test.mjs`

Expected: FAIL because `src/components/daily/daily-detail-layout.tsx` does not exist yet.

### Task 2: Client Layout Shell

**Files:**
- Create: `src/components/daily/daily-detail-layout.tsx`
- Modify: `src/components/daily/daily-feed-pane.tsx`
- Modify: `src/components/daily/daily-experience.tsx`

- [x] **Step 1: Create `DailyDetailLayout`**

It should accept `feed` and `detail` React nodes, manage `isFeedCollapsed` and
`isFeedDrawerOpen`, persist desktop collapsed state in `sessionStorage`, and
close the mobile drawer on Escape, overlay click, close button, or feed link click.

- [x] **Step 2: Add optional `id` to `DailyFeedPane`**

Pass the id to its root `<div>` so toggle buttons can use `aria-controls`.

- [x] **Step 3: Wrap selected-entry layout**

In `DailyExperience`, replace the direct split markup with `DailyDetailLayout`
and pass the feed node plus detail node into it.

### Task 3: Responsive Styling

**Files:**
- Modify: `src/app/daily/page.module.css`

- [x] Add fixed floating toggle styles with background-free presentation, moderate default opacity, and stronger hover/focus opacity.
- [x] Position the desktop floating toggle near the feed's lower-right edge when expanded and move it to the detail's lower-left edge when collapsed.
- [x] Keep the expanded desktop toggle inside the feed side instead of crossing the split divider.
- [x] Use simple left/right chevron icons for feed collapse and expansion.
- [x] Remove the visible detail close button while preserving mobile edge-swipe back behavior.
- [x] Remove icon-button hover backgrounds for the feed toggle, drawer close control, and theme toggle.
- [x] Show the mobile floating list toggle only while the drawer is closed.
- [x] Add collapsed grid styles that keep the feed mounted but invisible and non-interactive.
- [x] Add mobile drawer and scrim styles.
- [x] Preserve reduced-motion behavior.

### Task 4: Verification

**Commands:**
- `node --test test/daily-collapsible-feed.test.mjs`
- `node --test test/daily.test.mjs`
- `pnpm exec tsc --noEmit`
- `pnpm lint`

**Browser checks:**
- Desktop `/daily/ai-share-2026-05-30-agent-session-principal-boundary`: toggle collapses and expands the feed.
- Mobile viewport on the same URL: list button opens the feed drawer and the close control hides it.
