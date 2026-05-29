# Daily Responsive Detail Design

## Goal

Upgrade daily from a separate list/detail navigation into a responsive continuous
reading experience:

- Wide screens show a feed on the left and an animated detail panel on the right.
- Narrow screens show either the feed or a full-screen detail view.
- URLs remain canonical and shareable: `/daily` and `/daily/[id]`.

## Routing

Keep two public routes:

```text
/daily
/daily/[id]
```

`/daily/[id]` is the canonical permalink for a daily entry. The visual experience
can feel like a panel transition, but URL semantics should stay durable.

## Layout Behavior

### Wide Screens

Use a shared daily experience shell:

- Left column: feed list with cursor loading.
- Right column: selected detail panel.
- `/daily` shows the feed and an empty or quiet latest-detail state.
- `/daily/[id]` shows the feed and the selected detail.
- Clicking a feed item pushes `/daily/[id]` with `scroll: false`.
- The feed should not jump to the top when detail changes.
- The active feed item should be visually marked when it is present in the loaded
  feed batch.

Animation:

- Detail panel opens from the right with a small translate/opacity transition.
- Switching selected entries crossfades or gently slides content.
- Motion must respect `prefers-reduced-motion`.

### Narrow Screens

- `/daily` shows the feed full width.
- `/daily/[id]` shows the detail full width.
- Opening a detail should feel like a light fade/slide transition.
- Detail view includes a clear return link to `/daily`.

## Data Loading

- Feed keeps the cursor API implemented in the previous spec.
- Detail content for `/daily/[id]` is server-read through `getDailyEntryById`.
- The detail panel should not require the selected entry to already be loaded in
  the feed.

## Component Boundaries

- `src/app/daily/page.tsx`
  - Builds the `/daily` feed entry state and passes no selected entry.
- `src/app/daily/[id]/page.tsx`
  - Reads selected entry by id and passes it to the same daily experience shell.
- `src/components/daily/daily-experience.tsx`
  - Owns responsive shell layout and selected-detail placement.
- `src/components/daily/virtual-timeline.tsx`
  - Owns feed rendering, cursor loading, and active item styling.
- `src/components/daily/daily-detail.tsx`
  - Owns detail rendering.

## Accessibility

- Feed links remain real links to canonical detail URLs.
- Focus styles remain visible.
- Detail panel should have an accessible heading and readable structure.
- Animations must not be required to understand state.

## Verification

- `/daily` returns 200 and renders feed content.
- `/daily/daily-20260528-01` returns 200 and renders detail content.
- Wide-screen manual/browser check: feed and detail appear together.
- Narrow-screen manual/browser check: detail uses full width.
- Run TypeScript, targeted ESLint, and `pnpm build`.

## What Can Wait

- Perfect scroll restoration when navigating back from mobile detail.
- Keyboard shortcuts for previous/next entries.
- Split-pane resizing.
- Server rendering a default latest detail on `/daily`.
