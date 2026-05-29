# Daily Tag Filter Design

## Goal

Add URL-addressable tag filters to the daily feed so readers can narrow the feed
without loading every daily entry up front.

## Requirements

- `/daily?tag=AI` filters the feed to entries whose frontmatter `tags` include
  `AI`.
- `/api/daily?tag=AI&cursor=<id>&limit=20` returns cursor batches from the
  filtered list.
- `/daily/[id]?tag=AI` keeps the feed panel and close action in the same filter
  context.
- Changing the tag resets the feed list and cursor.
- Clicking an entry from a filtered feed preserves the tag query in the detail
  URL.
- The "全部" filter clears the query string.
- Unknown tags are allowed as empty filters rather than hard 404s.

## Boundaries

- `src/lib/daily.ts` owns tag extraction, filtering, and cursor slicing.
- `src/app/api/daily/route.ts` owns parsing `tag`.
- `src/app/daily/page.tsx` and `src/app/daily/[id]/page.tsx` own reading
  `searchParams`.
- Daily feed components own filter links and preserving `tag` in client loads.

## Verification

- TypeScript and targeted ESLint must pass.
- `pnpm build` must compile the API and SSG detail pages.
- API smoke checks should cover unfiltered and filtered batch requests.
