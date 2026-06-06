# Search Modal Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a site-wide local search modal for blog posts and daily notes.

**Architecture:** Add a server-safe search data layer that adapts local content into `SearchDocument` records, a client-side MiniSearch-powered modal that loads the generated payload, and a nav entry point. Keep indexing logic source-adapter based so future local data sources only add and register an adapter.

**Tech Stack:** Next.js 16 App Router, React 19 Client Components, TypeScript, CSS Modules, `@deweyou-design/react`, MiniSearch, Node test runner.

---

## File Structure

- Create `src/lib/search.ts`: local source adapters, Markdown cleanup, snippet/highlight helpers, payload size helper, and serialized MiniSearch payload creation.
- Create `src/components/search/search-modal.tsx`: client search modal using `Dialog`, `Input`, `Button.Icon`, MiniSearch loading, keyboard navigation, and result rendering.
- Create `src/components/search/search-modal.module.css`: desktop modal and narrow-screen full overlay styling.
- Modify `src/components/nav.tsx`: add search button before the theme toggle and mount `SearchModal`.
- Modify `package.json` and `pnpm-lock.yaml`: add `minisearch`.
- Create `test/search.test.mjs`: unit tests for source adapters, cleanup, snippets, highlighting, and size stats.

## Task 1: Add Search Core Tests And Dependency

- [ ] **Step 1: Add MiniSearch dependency**

Run:

```bash
corepack pnpm add minisearch
```

Expected: `package.json` and `pnpm-lock.yaml` include `minisearch`.

- [ ] **Step 2: Write failing core tests**

Create `test/search.test.mjs` with tests that import from `src/lib/search.ts`:

```js
import test from 'node:test';
import assert from 'node:assert/strict';
import {
  buildSearchPayload,
  cleanMarkdownForSearch,
  createSearchSnippet,
  getSearchDocuments,
  getSearchPayloadStats,
  splitHighlightText,
} from '../src/lib/search.ts';

test('search documents include posts and daily entries with hrefs', () => {
  const documents = getSearchDocuments();
  assert.ok(documents.some((doc) => doc.source === 'post' && doc.href.startsWith('/blog/')));
  assert.ok(documents.some((doc) => doc.source === 'daily' && doc.href.startsWith('/daily/')));
});

test('cleanMarkdownForSearch removes common markdown syntax noise', () => {
  const cleaned = cleanMarkdownForSearch('---\\ntitle: X\\n---\\n# Heading\\n**Bold** [Link](https://example.com) `code`');
  assert.equal(cleaned.includes('---'), false);
  assert.equal(cleaned.includes('**'), false);
  assert.equal(cleaned.includes('https://example.com'), false);
  assert.match(cleaned, /Heading/);
  assert.match(cleaned, /Bold/);
  assert.match(cleaned, /Link/);
  assert.match(cleaned, /code/);
});

test('createSearchSnippet returns a short query-centered snippet', () => {
  const snippet = createSearchSnippet('前面有很多文字。这里出现动态沙箱，并且后面还有一些用于截断的文字。', '动态沙箱', 18);
  assert.ok(snippet.text.length <= 24);
  assert.ok(snippet.text.includes('动态沙箱'));
  assert.equal(snippet.hasMatch, true);
});

test('splitHighlightText marks Chinese and English query matches', () => {
  const parts = splitHighlightText('MiniSearch 支持中文 search 体验', '中文 search');
  assert.ok(parts.some((part) => part.highlight && part.text === '中文'));
  assert.ok(parts.some((part) => part.highlight && part.text.toLowerCase() === 'search'));
});

test('buildSearchPayload produces serialized index and document store', () => {
  const payload = buildSearchPayload([
    {
      id: 'post:one',
      source: 'post',
      title: 'Search Title',
      href: '/blog/one',
      date: '2026-06-06',
      tags: ['Agent'],
      excerpt: 'Search excerpt',
      body: 'Search body text',
    },
  ]);
  assert.ok(payload.index);
  assert.equal(payload.documents['post:one'].title, 'Search Title');
});

test('getSearchPayloadStats reports byte and gzip sizes', () => {
  const stats = getSearchPayloadStats({ index: { documentCount: 0 }, documents: {} });
  assert.ok(stats.bytes > 0);
  assert.ok(stats.gzipBytes > 0);
});
```

- [ ] **Step 3: Run tests and verify RED**

Run:

```bash
corepack pnpm test -- test/search.test.mjs
```

Expected: FAIL because `src/lib/search.ts` does not exist yet.

## Task 2: Implement Search Core

- [ ] **Step 1: Create `src/lib/search.ts`**

Implement:

- `SearchDocument`, `SearchPayload`, and result display types
- `getPostSearchDocuments()`
- `getDailySearchDocuments()`
- `SEARCH_SOURCE_ADAPTERS`
- `getSearchDocuments()`
- `cleanMarkdownForSearch()`
- `buildSearchPayload()`
- `getSearchPayload()`
- `getSearchPayloadStats()`
- `createSearchSnippet()`
- `splitHighlightText()`

Keep source IDs stable as `${source}:${slugOrId}`. Use `MiniSearch.toJSON()` for serialization.

- [ ] **Step 2: Run tests and verify GREEN**

Run:

```bash
corepack pnpm test -- test/search.test.mjs
```

Expected: PASS.

## Task 3: Add Search Modal UI

- [ ] **Step 1: Create `src/components/search/search-modal.module.css`**

Add styles for:

- modal panel sizing
- input row
- result rows
- active keyboard-selected row
- `<mark>` highlights
- empty/loading/error states
- `@media (max-width: 768px)` full-screen overlay behavior

- [ ] **Step 2: Create `src/components/search/search-modal.tsx`**

Implement a `'use client'` component:

- accepts `payload: SearchPayload`
- lazily reconstructs MiniSearch from serialized payload
- opens via controlled `open` prop
- uses `Dialog.Root`, `Dialog.Content`, `Dialog.CloseButton`
- uses `Input` for query entry
- ranks results with MiniSearch
- renders result rows as `Link`
- uses `createSearchSnippet()` and `splitHighlightText()` for short highlighted snippets
- supports arrow up/down and Enter
- uses `useRouter` only for Enter navigation

- [ ] **Step 3: Modify `src/components/nav.tsx`**

Add:

- import `getSearchPayload` cannot happen directly because `Nav` is client-side; instead create a server wrapper or pass payload from a new server component.
- Preferred minimal structure: keep `Nav` client-side but import a new `SearchProviderMount` client component only if payload is imported from a server parent is impossible.
- If direct server data cannot cross the current `Nav` boundary cleanly, split nav into `NavShell` server component and `NavClient` client component.

Final shape should keep filesystem reads out of client modules.

- [ ] **Step 4: Run lint/build**

Run:

```bash
corepack pnpm lint
corepack pnpm build
```

Expected: both pass.

## Task 4: Browser Verification

- [ ] **Step 1: Start dev server**

Run:

```bash
corepack pnpm dev
```

Expected: local Next app starts.

- [ ] **Step 2: Verify desktop**

Open the app in the in-app browser at the local URL. Check:

- search icon appears before theme toggle
- click opens modal
- input autofocuses
- query returns post and daily results
- snippets highlight matches
- arrow keys and Enter work
- Escape closes modal

- [ ] **Step 3: Verify mobile**

Use a narrow viewport. Check:

- search opens full-screen overlay
- close target remains visible
- results scroll below input
- tapping a result navigates correctly

## Task 5: Documentation And Final Verification

- [ ] **Step 1: Update docs if implementation details differ from spec**

Only update `docs/superpowers/specs/2026-06-06-search-modal-design.md` if the implementation intentionally differs.

- [ ] **Step 2: Run final verification**

Run:

```bash
corepack pnpm test
corepack pnpm lint
corepack pnpm build
```

Expected: all pass.

- [ ] **Step 3: Report delivery state**

Report changed files, verification commands, and whether local changes are committed or left for review.
