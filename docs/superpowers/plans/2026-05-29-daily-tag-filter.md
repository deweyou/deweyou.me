# Daily Tag Filter Implementation Plan

**Goal:** Add URL and API backed daily tag filtering.

## Tasks

- [ ] Extend `src/lib/daily.ts` with tag filtering and all-tag extraction.
- [ ] Parse and pass `tag` in `/daily`, `/daily/[id]`, and `/api/daily`.
- [ ] Add filter links and preserve active tag in feed/detail links.
- [ ] Reset client-loaded entries when active tag or cursor changes.
- [ ] Style the filter row to match the quiet daily page UI.
- [ ] Verify with TypeScript, targeted ESLint, build, and API smoke checks.
