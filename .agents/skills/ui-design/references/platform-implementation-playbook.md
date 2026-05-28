# Platform Implementation Playbook

Use this reference when the task targets a specific platform, component library,
prototype, or production implementation.

## Platform Adaptation

The visual language may stay consistent across platforms, but the interaction
model should come from the platform.

### Web

- Prefer the current component library when it is available.
- Use `@design-system/react` components before making custom local UI.
- Use `references/design-tokens.css` for standalone HTML prototypes or
  external web projects.
- Use Ark UI or another headless primitive for complex browser interactions.
- Verify keyboard navigation, focus order, hover/focus/active states, reduced
  motion, responsive breakpoints, and no horizontal overflow.
- For formal Web Interface Guidelines reviews, fetch the latest guidance from
  `https://raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/command.md`
  and apply it to the specified files. If no files are specified, ask which files
  or patterns to review.

### H5 / Mobile Web

- Design for thumb reach, browser chrome, and safe areas.
- Use safe-area insets for fixed headers, bottom bars, sheets, and CTAs.
- Avoid dense desktop tables; convert to grouped rows, filters, or detail
  drill-downs.
- Do not rely on hover. Every primary interaction must work by tap.

### iOS / Android

- Use native platform primitives or the app's design-system components rather
  than web component assumptions.
- Preserve platform navigation expectations: tab bars for top-level mobile
  destinations, predictable back behavior, sheets for transient tasks, and clear
  modal escape routes.
- Translate tokens into native theme values: surface, text, border, primary,
  danger, radius, shadow/elevation, and motion.
- Respect Dynamic Type / font scaling, safe areas, accessibility labels, touch
  targets, and system gestures.
- Use haptics sparingly for confirmations or important state transitions.

### HarmonyOS

- Treat HarmonyOS as a native mobile platform, not H5 with a different shell.
- Use ArkTS/ArkUI or the host app's Harmony components when implementing.
- Translate design tokens into Harmony theme values: surfaces, text, brand/danger
  colors, radius, divider, shadow/elevation, and motion.
- Respect Harmony navigation patterns, window/status areas, back behavior,
  gestures, font scaling, and accessibility labels.
- Keep layouts adaptive across phones, foldables, tablets, and multi-window modes
  where relevant.
- Avoid copying iOS-only or Material-only conventions if Harmony native
  components provide a clearer expected pattern.

### Mini Programs

- Apply this branch for WeChat Mini Programs, Alipay Mini Programs, and similar
  super-app platforms.
- Respect platform constraints: page stack navigation, capsule/menu button safe
  area, limited viewport, subpackage/load performance, and platform component
  availability.
- Use native mini-program components where they improve reliability and
  accessibility; style them with design tokens instead of rebuilding everything.
- Keep interactions tap-first, lightweight, and resilient to slow startup.
- Avoid heavy web effects, large custom font payloads, and desktop-style layouts.
- Design explicit empty, loading, permission-denied, login-required, and
  network-error states.

### macOS / Desktop Apps

- Favor quiet density, clear sidebars/toolbars, keyboard access, and precise
  alignment.
- Use native macOS controls where they improve familiarity; apply design tokens
  through color, typography, spacing, and icon style rather than replacing
  platform behavior.
- Support pointer hover, focus rings, keyboard shortcuts, menu commands,
  resizable windows, and empty/error states.
- Avoid mobile-first spacing inflation. Desktop surfaces can be compact, but must
  remain readable and accessible.

## Production Implementation

For Web / React component-library work:

- Follow the host repository's file conventions. If no convention exists, prefer
  TSX components, CSS Modules or scoped CSS, lowercase kebab-case source units,
  colocated tests, and clear package exports.
- Use Ark UI for non-trivial interactions: Dialog, Popover, Select/Combobox,
  Menu, Tabs, Toast, Switch, Checkbox, Accordion, Tooltip.
- Keep Ark UI data attributes (`data-state`, `data-disabled`,
  `data-highlighted`) as styling hooks.
- Do not duplicate behavior logic that the primitive already owns.
- Use existing public component dimensions: `variant`, `color`, `size`, and
  `shape` should stay orthogonal.
- Add or update colocated tests, stories, and docs according to the host
  repository's delivery rules.

For Web app/page work:

- Prefer existing `@design-system/react` components before making custom local
  UI.
- Use root imports when a file consumes several components; use subpath imports
  for focused examples and docs.
- Keep route navigation and tab semantics distinct. Use `Nav` for navigation
  landmarks and `Tabs` for tabbed content or controlled tab bars.

For prototypes:

- Build the actual usable first screen, not a marketing placeholder.
- Use local HTML/CSS or the target stack.
- Keep the result token-aligned and inspectable.

## Performance And Stability

- Declare image dimensions or aspect ratios to prevent layout shift.
- Use responsive images and modern formats such as WebP/AVIF when available.
- Lazy-load below-the-fold images and non-critical heavy sections.
- Use `font-display: swap` or `optional`; preload only truly critical font
  variants.
- Reserve skeleton or placeholder space for async content.
- Virtualize long lists when item count is large enough to affect scroll
  performance.
- Keep input and tap feedback under roughly 100ms.
- Avoid animating layout properties such as width, height, top, or left; prefer
  transform and opacity.
- Use `min-height: 100dvh` or equivalent mobile viewport units instead of
  relying on `100vh` for mobile full-height screens.

## Verification

For significant frontend changes:

- Start a local dev server when needed.
- Use browser verification when available.
- Check mobile and desktop viewports.
- Check focus, keyboard, hover/focus/active states, reduced motion, loading,
  empty, error, and no horizontal overflow.
- Check layout shift risks, image/font loading behavior, long-list performance,
  dark-mode contrast, and large-text behavior when user-facing.
