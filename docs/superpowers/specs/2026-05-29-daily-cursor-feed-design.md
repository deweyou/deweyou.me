# Daily Cursor Feed Design

## Goal

Turn `/daily` into a real feed: the first screen should render only the newest
batch, then load older entries through a cursor when the reader reaches the end
of the current batch.

## Current State

- Daily content lives in `content/daily/*.mdx`.
- Each file has stable frontmatter `id`, display `title`, `date`, `tags`, and MDX
  body content.
- The filename stem is still exposed as `slug` internally, but public detail URLs
  use `id`: `/daily/[id]`.
- `/daily` currently receives all entries up front and reveals them client-side in
  batches. This keeps DOM size down but does not reduce the initial data payload.

## Requirements

- `/daily` must server-render only the latest 20 entries for the first batch.
- The feed must load older entries when the user scrolls near the end.
- Later batches must be fetched from an app route, not bundled into the initial
  page payload.
- The public detail route remains `/daily/[id]`.
- Cursor identity must use stable `id`, not filename slug or title.
- Content ordering remains newest first by `date`, then stable by file slug for
  same-day entries.
- Each daily `id` remains required and globally unique at build/runtime read time.
- The loading model should scale to roughly 1k entries without sending every MDX
  body to the browser on first load.

## Data Model

`DailyEntry` remains the full content shape:

```ts
interface DailyEntry {
  id: string;
  slug: string;
  title: string;
  date: string;
  tags: string[];
  content: string;
}
```

`DailyFeedEntry` is the browser-renderable feed shape:

```ts
interface DailyFeedEntry {
  id: string;
  slug: string;
  title: string;
  date: string;
  tags: string[];
  mdx: MDXRemoteSerializeResult;
}
```

The feed API returns a batch shape:

```ts
interface DailyFeedBatch {
  entries: DailyFeedEntry[];
  nextCursor: string | null;
}
```

`nextCursor` is the `id` of the last entry in the returned batch. A `null` cursor
means there are no older entries.

## API

Add an app route:

```text
GET /api/daily?cursor=<id>&limit=20
```

Rules:

- `limit` defaults to 20.
- `limit` is clamped to a small maximum, initially 50.
- Without `cursor`, return the newest entries.
- With `cursor`, find that entry and return the next older entries after it.
- Unknown cursors return a 400 JSON error rather than silently restarting.
- The response is JSON with `{ entries, nextCursor }`.

## Page Flow

`/daily` remains a Server Component for the shell and first batch:

1. Read the newest 20 entries on the server.
2. Render the hero and initial feed batch.
3. Pass `initialEntries` and `initialNextCursor` to a small Client Component.
4. The Client Component appends entries from `/api/daily` when the reader nears
   the end of the current rendered list.

The feed should show:

- A quiet loading state while fetching older entries.
- A quiet end state when there are no more entries.
- A retry affordance if the API request fails.

## Component Boundaries

- `src/lib/daily.ts`
  - Owns reading, validating, sorting, unique id checks, single-entry lookup, and
    cursor slicing.
- `src/lib/daily-feed.ts`
  - Owns converting raw `DailyEntry` values into browser-renderable serialized
    MDX feed entries.
- `src/app/daily/page.tsx`
  - Owns page metadata, hero, and first server-rendered batch.
- `src/components/daily/virtual-timeline.tsx`
  - Owns virtual rendering and client-side loading behavior.
- `src/app/api/daily/route.ts`
  - Owns request parsing and JSON response.
- `src/app/daily/[id]/page.tsx`
  - Keeps using `getDailyEntryById`; no behavior change.

## Error Handling

- Invalid frontmatter fails loudly from `src/lib/daily.ts`.
- Duplicate daily ids fail loudly from `src/lib/daily.ts`.
- API invalid cursor returns status 400 with a small JSON message.
- API unexpected errors return status 500 with a generic JSON message.
- Client load failures do not remove existing entries; they show retry.

## Testing And Verification

- Unit-level checks are not currently configured in this repo, so verification is
  command and behavior based.
- Run TypeScript and targeted ESLint for touched files.
- Run `pnpm build` to verify SSG detail pages and route compilation.
- Smoke test:
  - `/daily` returns 200.
  - `/api/daily?limit=5` returns 5 entries and a non-null cursor.
  - `/api/daily?limit=5&cursor=<cursor>` returns the next batch.
  - `/daily/daily-20260528-01` returns 200.

## What Can Wait

- Search, filters, tag pages, and archives.
- Preserving feed scroll position after returning from a detail page.
- Pretty date-group dividers across API batch boundaries beyond the existing year
  label behavior.
- Server-side HTML for page 2+ fallback routes.
