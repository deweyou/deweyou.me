# Search Modal Design

## Overview

Add site-wide search for local content without introducing a search page or server search endpoint.
The search entry lives in the global nav, opens a modal on desktop, and becomes a full-screen overlay on narrow screens.

The first indexed sources are blog posts and daily notes. Future local sources should plug into the same indexing pipeline through source adapters.

## Goals

- Search blog posts and daily notes from one interface.
- Include body text in matching, not only titles or metadata.
- Show short query-matched snippets with highlighted terms.
- Keep Vercel deployment simple by avoiding runtime search APIs.
- Make future local content sources easy to add.
- Reuse `@deweyou-design/react` primitives where they fit.

## Non-Goals

- No dedicated `/search` page in this version.
- No remote search provider or database.
- No semantic/vector search.
- No long generated summaries in results.

## Content Sources

Create a local search source model:

```ts
interface SearchDocument {
  id: string;
  source: 'post' | 'daily' | string;
  title: string;
  href: string;
  date: string;
  tags: string[];
  excerpt?: string;
  body: string;
}
```

Each source adapter returns `SearchDocument[]`.

Initial adapters:

- `posts`: read from `content/posts/*.mdx` through the existing blog post pipeline.
- `daily`: read from `content/daily/*.md` and `content/daily/*.mdx` through the existing daily pipeline.

Adding new blog posts or daily notes requires no search configuration changes. The adapters scan those directories during the build, so new files are picked up automatically as long as they follow the existing content rules.

Adding a new local source, such as `notes`, requires:

1. Add a source adapter that maps that source into `SearchDocument[]`.
2. Register the adapter in the search source registry.
3. Add the result type label and href rules if the default label/link behavior is not enough.
4. Add a small test fixture or unit test for the new adapter.

## Index Build

Use `MiniSearch` for indexing because it supports weighted fields, prefix/fuzzy matching, and index serialization with no runtime dependencies.

Weighted fields:

- `title`: high weight
- `excerpt`: medium weight
- `tags`: medium weight
- `body`: low weight

The build step should generate or expose:

- serialized MiniSearch index
- compact document store for result display
- size statistics for the index and document store

The document store keeps enough text to generate snippets. Body text should be Markdown-cleaned before indexing and snippet generation.

## Size Budget

Current local Markdown/MDX content is about 208 KB across 71 files, so body search is safe for the current site.

Set guardrails:

- warn when uncompressed search payload exceeds 2 MB
- warn when gzip size exceeds 700 KB
- consider source-level lazy loading if content grows beyond that range

Avoid a Vercel Function search endpoint. Vercel Functions have a 4.5 MB request/response payload limit, while static search assets avoid that constraint and fit the site architecture better.

## UI

Add a search icon button to the global nav, immediately before the theme toggle button.

Use existing design-system primitives:

- `Button.Icon` for the nav entry
- `Dialog` for desktop modal behavior, focus management, escape close, and aria structure
- `Input` for the search field

Desktop behavior:

- centered modal
- input autofocus when opened
- dimmed backdrop
- escape closes the modal
- arrow keys move through results
- enter opens the active result

Narrow-screen behavior:

- same search component becomes a full-screen overlay via responsive CSS
- close affordance remains visible and touch-friendly
- input stays at the top with safe-area padding
- results scroll below the input
- tapping a result opens it and closes the overlay

Result shape:

- source label, date, and tags
- title
- short snippet near the first query match
- highlighted matching terms

## States

Cover these states:

- empty query: show a quiet initial state, not the full index
- index loading: stable loading state
- results available: list ranked results
- no results: explain that nothing matched
- index failed: show a recovery hint and keep the close path available

## Accessibility

- Search button has an accessible label.
- Dialog content has a title or aria label.
- Search input has a visible label or accessible label.
- Keyboard focus starts in the input and remains inside the dialog while open.
- Result rows are keyboard reachable.
- Active result state is not color-only.
- Highlight markup uses semantic `<mark>` styling with sufficient contrast.
- Motion respects reduced-motion preferences through existing dialog behavior and simple CSS transitions.

## Testing

Unit tests:

- source adapters include posts and daily entries
- new post/daily files are discovered without manual registration
- Markdown body cleanup removes frontmatter and common syntax noise
- snippet generation returns a short match-centered fragment
- highlight splitting handles Chinese and English query terms
- size guard reports payload statistics

Manual/browser checks:

- desktop nav button opens and closes the modal
- mobile viewport uses full-screen overlay
- keyboard navigation works on desktop
- result click opens the correct URL
- dark mode remains readable

## What Can Wait

- Search history
- keyboard shortcut such as `/` or `⌘K`
- source filters
- remote or semantic search
- route-backed search state

*Last updated: 2026-06-06 | Reason: define site-wide local search design*
