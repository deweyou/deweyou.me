# @deweyou-design Usage Notes

This project uses `@deweyou-design` — Dewey's own design system. It is NOT a third-party library. Docs are in the package source; there is no external documentation site.

## Key Packages

- `@deweyou-design/styles` — CSS custom properties (design tokens). Import `theme.css` for variables, no JS needed.
- `@deweyou-design/react` — React components. Import per-component: `@deweyou-design/react/text`, `@deweyou-design/react/button`, etc. Not a barrel export.
- `@deweyou-design/react-icons` — Icon components.

## Text Component

`Text` is the primary typography component. Valid variants: `plain | body | caption | h1 | h2 | h3 | h4 | h5`.

```tsx
import { Text } from '@deweyou-design/react/text';
<Text variant="h2" id="my-anchor">Heading</Text>
```

**`id` and other HTML attributes are forwarded** to the underlying DOM element via `...rest` spread. Safe to use for anchor IDs.

**Font**: `h1`–`h5` use `var(--ui-font-display)`; `body`/`plain`/`caption` use `var(--ui-font-body)`.

## Server Component Constraint

Components with `onClick` or other event handlers (e.g. `Button variant="link"`) **cannot be used in Server Components or MDX rendered via `next-mdx-remote/rsc`**. This includes `mdx-components.tsx`.

Use plain `<a>` with inline styles for links in MDX components, not `Button variant="link"`.

## CSS Variables

Design tokens follow the pattern `--ui-color-*`, `--ui-font-*`, `--ui-text-size-*`, etc. Site-level font overrides live in `src/app/globals.css`:

```css
:root {
  --ui-font-body: var(--font-source-han-serif), ...;
  --ui-font-display: var(--font-source-han-serif), ...;
  --ui-font-mono: var(--font-ibm-plex-mono), ...;
}
```

## Tabler Icons

Icons use the Tabler Icons webfont loaded via CDN in `src/app/layout.tsx`. Usage: `<i className="ti ti-brand-github" />`. No React component wrapper needed.

*Last updated: 2026-05-07 | Reason: design system pitfalls discovered during redesign (Server Component, id forwarding)*
