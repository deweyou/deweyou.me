# Daily Collapsible Feed Design

## Goal

Improve the daily detail reading experience after an entry is open:

- Wide screens can collapse the left feed so the detail has more reading space.
- Wide screens can expand the feed again without leaving the detail URL.
- Narrow screens keep the detail as the primary surface and expose the feed as a temporary drawer.

## Behavior

### Wide Screens

- `/daily/[id]` keeps the existing two-column layout by default.
- A compact fixed icon button toggles the feed and stays pinned while the detail scrolls.
- When the feed is visible, the toggle sits near the feed's lower-right edge and shows the collapse icon.
- When the feed is collapsed, the toggle shifts to the detail's lower-left edge and shows the expand icon.
- The toggle uses simple left/right chevron icons and should not straddle the vertical split line.
- The toggle stays background-free but uses moderate default opacity so it is discoverable without competing with the article.
- Hover and keyboard focus make the toggle clearer through stronger opacity.
- Icon-button hover states stay background-free; visibility changes through color and opacity.
- Collapsing the feed is local UI state, not route state.
- The selected article remains on the same canonical URL.
- The detail pane expands into the available layout space.
- The feed can be restored without losing its scroll position.

### Narrow Screens

- `/daily/[id]` keeps the current detail-first layout.
- A compact fixed "list" icon opens the feed as an overlay drawer and stays pinned while the detail scrolls.
- The fixed list icon is visible only while the mobile drawer is closed.
- The drawer does not navigate away from the current detail.
- Selecting a feed item navigates to that entry and closes the drawer.
- The visible close affordance is removed because the detail is a canonical page, not a modal.
- Mobile edge-swipe back can still return to `/daily`.

## Component Boundaries

- `src/components/daily/daily-detail-layout.tsx`
  - Client component that owns feed collapsed state and mobile drawer state.
  - Receives feed and detail React nodes from the server experience.
- `src/components/daily/daily-experience.tsx`
  - Keeps data composition and route-derived props.
  - Uses the client layout only when `selectedEntry` exists.
- `src/components/daily/daily-feed-pane.tsx`
  - Accepts an optional id so controls can target the feed with `aria-controls`.
- `src/app/daily/page.module.css`
  - Owns desktop collapsed layout, mobile drawer presentation, and control placement.

## Accessibility

- Toggle buttons use icon buttons with explicit `aria-label`.
- Desktop toggle exposes `aria-expanded` and `aria-controls`.
- Mobile drawer can be dismissed by overlay click, close button, or Escape.
- The drawer is labeled as the note list and does not replace the canonical close link.

## Verification

- Source-level test checks the interactive shell contract.
- TypeScript passes.
- `/daily/[id]` returns 200.
- Browser check confirms desktop collapse/expand changes layout.
- Browser check confirms mobile list opens as a drawer and can close.

## What Can Wait

- User-resizable split panes.
- Remembering collapsed state across browser sessions beyond the current session.
- Animated drag gestures for the mobile drawer.
