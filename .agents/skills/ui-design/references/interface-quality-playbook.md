# Interface Quality Playbook

Use this reference for practical UX/UI quality: flows, states, accessibility,
information hierarchy, interaction correctness, and responsive behavior.

## Quality Gates

Prioritize review and design work in this order:

1. Accessibility: contrast, labels, keyboard/screen reader support, focus, and
   reduced motion.
2. Touch and interaction: target size, spacing, hover-vs-tap, pressed/loading
   feedback, and gesture alternatives.
3. Performance perception: stable layout, reserved image space, fast input
   feedback, progressive loading, and no jank.
4. Layout and responsive behavior: no horizontal overflow, safe areas,
   predictable breakpoints, readable text measure, and stable fixed elements.
5. Forms and feedback: visible labels, inline errors, helper text, retry paths,
   undo, and autosave where data loss matters.
6. Navigation: predictable back behavior, clear current location, deep links or
   shareable routes where useful, and no overloaded hierarchy.
7. Typography, color, motion, and data visualization polish.

## UX Principles

- Reduce the number of things the user must understand before acting.
- Prefer familiar patterns unless the product has a strong reason to differ.
- Make entry points, primary actions, feedback, and escape paths visible.
- Separate primary flow, secondary actions, destructive actions, and recovery.
- Cover real states: empty, loading, error, success, disabled, selected,
  permission denied, login required, offline, and destructive confirmation.
- Do not give only visual advice when the issue is flow, state, or recovery.
- Do not hide critical behavior behind swipe-only, hover-only, or shortcut-only
  interactions.

## Information Hierarchy

- Start from the user's job: scan, compare, edit, select, confirm, recover, or
  remember.
- Choose hierarchy before decoration.
- Make the default action obvious and keep secondary actions available but lower
  emphasis.
- Use stable dimensions for toolbars, tabs, grids, counters, and tiles so state
  changes do not shift layout.
- Avoid nested cards and decorative section framing. Use clear groupings,
  sections, and spacing instead.

## Interaction States

- Touch targets should be at least 44px on mobile.
- Focus must be visible. Do not remove focus outlines without replacing them.
- Hover is never the only affordance.
- Press feedback should be quick and should not move surrounding layout.
- Loading should disable repeat actions, preserve layout width, and show progress
  or skeletons when useful.
- Disabled controls must not look tappable.
- Errors should show cause and recovery near the affected area.
- Empty states should explain what is missing and provide the next useful action.
- Destructive actions should be visually separated and confirmed when risk is
  meaningful.
- Motion should be 140-300ms, cause-and-effect, transform/opacity where possible,
  and respect reduced motion.

## Forms And Feedback

- Use visible labels; do not rely on placeholder-only labels.
- Show field errors near the field; for multiple errors, use an error summary
  with links or focus movement when practical.
- Validate after the user finishes input, not aggressively on every keystroke.
- Preserve long-form or high-cost input with autosave or a discard confirmation.
- Offer undo for destructive or bulk actions when possible.
- Toasts should not steal focus; use polite live regions on the web.
- Error messages should state the cause and the next recovery action.

## Navigation

- Separate primary navigation, secondary navigation, and contextual actions.
- Bottom navigation is for top-level destinations only and should stay at five
  items or fewer with labels.
- Back navigation should restore prior scroll, filter, and input state.
- Modals and sheets need clear close/escape routes and should not replace primary
  navigation flows.
- Dangerous actions such as logout or delete account should be visually and
  spatially separated from ordinary navigation.

## Data And Charts

- Match chart type to the question: trend → line, comparison → bar, proportion
  → donut/pie only for very small category sets, funnel → funnel/step chart.
- Provide legends, labels, units, and tooltips or direct values.
- Do not rely on color alone; use labels, shape, pattern, or text.
- Provide a text summary or table alternative for accessibility when charts carry
  important meaning.
- Show loading, empty, and error states for data visualizations.
- On mobile, simplify axes, reduce tick density, and keep tap targets reachable.

## Responsive And Mobile

- Start from a 375px small-phone viewport and scale up.
- Respect safe areas for fixed headers, tab bars, bottom CTAs, sheets, and
  overlays.
- Avoid horizontal scroll. Long text wraps before it truncates.
- Bottom navigation should stay at five items or fewer and include labels.
- Primary actions should remain reachable without colliding with OS gestures.
- Preserve back behavior and scroll state where relevant.
- Test dark mode, large text, landscape, and reduced motion when user-facing.

## Review Checklist

Lead with concrete issues:

1. Flow clarity: entry, next step, completion, recovery.
2. Accessibility: contrast, focus, labels, keyboard, touch targets, reduced
   motion.
3. Performance perception: layout shift, slow feedback, large media, font
   loading, long lists, and heavy animation.
4. Interaction states: disabled, loading, error, empty, success, destructive.
5. Layout: hierarchy, overflow, unsafe fixed bars, unstable dimensions.
6. Forms, navigation, and chart/data behavior when present.
7. Copy: clear action verbs, recovery guidance, no inflated promises.
8. Implementation: hand-rolled behavior where a native/headless primitive should
   own focus, keyboard, and ARIA behavior.

If there are no material issues, say so and mention remaining verification gaps.
