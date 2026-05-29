import { DailyExperience } from '##/components/daily/daily-experience';
import { getAllDailyEntries, getDailyFeedBatch } from '##/lib/daily';

export const metadata = {
  title: '笔记 — Dewey Ou',
  description: 'Dewey Ou 的笔记归档。',
};

export default async function DailyPage() {
  const entries = getAllDailyEntries();
  const initialBatch = getDailyFeedBatch();

  return (
    <DailyExperience
      allEntries={entries}
      initialBatch={initialBatch}
    />
  );
}
