import { notFound } from 'next/navigation';
import { DailyDetail } from '##/components/daily/daily-detail';
import {
  getAllDailyEntries,
  getDailyEntryById,
  normalizeDailyTagParam,
} from '##/lib/daily';

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

export default async function DailyDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { id } = await params;
  const activeTag = normalizeDailyTagParam((await searchParams)?.tag);
  let entry;
  try {
    entry = getDailyEntryById(id);
  } catch {
    notFound();
  }
  const activeTagQuery = activeTag ? `?tag=${encodeURIComponent(activeTag)}` : '';

  return <DailyDetail closeHref={`/daily${activeTagQuery}`} entry={entry} />;
}
