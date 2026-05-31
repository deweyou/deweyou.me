import { DailyExperience } from '##/components/daily/daily-experience';
import {
  filterDailyEntriesByTag,
  getAllDailyEntries,
  getAllDailyTags,
  getDailyFeedBatch,
  normalizeDailyTagParam,
} from '##/lib/daily';

export const metadata = {
  title: '笔记 — Dewey Ou',
  description: 'Dewey Ou 的笔记归档。',
};

export default async function DailyPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const activeTag = normalizeDailyTagParam((await searchParams)?.tag);
  const entries = getAllDailyEntries();
  const initialBatch = getDailyFeedBatch({ tag: activeTag });

  return (
    <DailyExperience
      activeTag={activeTag}
      availableTags={getAllDailyTags(entries)}
      visibleEntries={filterDailyEntriesByTag(entries, activeTag)}
      initialBatch={initialBatch}
    />
  );
}
