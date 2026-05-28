# Current Component Library Snapshot

This is a copied standalone snapshot of the current component-library design facts. Use it without reading any external repository files.

## Visual Identity

- Design phrase: simple, clean, clean lines, less is more.
- Controls and dense UI use Source Han Sans.
- Content, Markdown, prose, and display hierarchy use Source Han Serif.
- Neutral surfaces carry content; emerald is restrained emphasis; red is danger.
- Borders establish structure before shadows.
- Typography, whitespace, borders, and radius carry recognition more than illustration.

## Core Tokens

- Semantic colors: `neutral`, `primary`, `danger`; `warning` is feedback-only.
- Light surface model: neutral canvas, white surface, white raised surface.
- Dark surface model: stone-950 canvas, stone-900 surface, stone-800 raised surface.
- Spacing rhythm: 4px base, with `xs`, `sm`, `md`, `lg`, `xl`.
- Radius tiers: `rect`, `float`, `auto`, `pill`.
- Interaction durations: fast 140ms, base 160ms, slow 260ms.
- Focus ring: tokenized emerald ring through `box-shadow`, not layout-changing border.
- Portable token CSS is bundled at `references/design-tokens.css`.

## Component Model

Common component dimensions:

- `variant`: `filled`, `outlined`, `ghost`, `link`
- `color`: `neutral`, `primary`, `danger`
- `size`: `xs`, `sm`, `md`, `lg`, `xl`
- `shape`: `rect`, `float`, `auto`, `pill`

Keep dimensions orthogonal. Do not let `variant="primary"` replace `color="primary"`, and do not let size silently change radius.

## Behavior Layer

Use Ark UI for complex behavior:

- Dialog
- Popover
- Select / Combobox
- Menu
- Tabs
- Toast
- Switch
- Checkbox
- Accordion
- Tooltip

Style Ark UI data attributes instead of duplicating interaction state in custom JavaScript.

## Avoid

- Emoji as icons.
- Decorative gradients, glassmorphism, bokeh, and generic stock atmosphere.
- Cream/beige default canvases.
- Arbitrary raw hex/rgba values in component styles.
- New radius/shadow levels without token and documentation updates.
- Cards inside cards.
- Hero-scale typography inside compact app surfaces.
- Reimplementing focus management, keyboard navigation, or aria contracts by hand.
