import { notFound } from 'next/navigation';
import { DailyExperience } from '##/components/daily/daily-experience';
import { getAllDailyEntries, getDailyEntryById, getDailyFeedBatch } from '##/lib/daily';

export function generateStaticParams() {
  return getAllDailyEntries().map((entry) => ({ id: entry.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const entry = getDailyEntryById(id);
    return {
      title: `${entry.title} - Dewey Ou`,
      description: `Dewey Ou 的笔记：${entry.title}`,
    };
  } catch {
    return {};
  }
}

export default async function DailyDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  let entry;
  try {
    entry = getDailyEntryById(id);
  } catch {
    notFound();
  }

  return (
    <DailyExperience
      activeId={entry.id}
      allEntries={getAllDailyEntries()}
      initialBatch={getDailyFeedBatch()}
      selectedEntry={entry}
    />
  );
}
