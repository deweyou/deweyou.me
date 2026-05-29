import { serialize } from 'next-mdx-remote/serialize';
import type { MDXRemoteSerializeResult } from 'next-mdx-remote';
import type { DailyEntry, DailyFeedBatch } from './daily';

export interface DailySerializedFeedEntry {
  id: string;
  slug: string;
  title: string;
  date: string;
  tags: string[];
  estimatedSize: number;
  mdx: MDXRemoteSerializeResult;
}

export interface DailySerializedFeedBatch {
  entries: DailySerializedFeedEntry[];
  nextCursor: string | null;
}

export function estimateDailyEntrySize(entry: Pick<DailyEntry, 'content'>) {
  return Math.min(920, Math.max(360, 260 + Math.ceil(entry.content.length / 3)));
}

export async function serializeDailyFeedEntry(entry: DailyEntry): Promise<DailySerializedFeedEntry> {
  return {
    id: entry.id,
    slug: entry.slug,
    title: entry.title,
    date: entry.date,
    tags: entry.tags,
    estimatedSize: estimateDailyEntrySize(entry),
    mdx: await serialize(entry.content),
  };
}

export async function serializeDailyFeedBatch(batch: DailyFeedBatch): Promise<DailySerializedFeedBatch> {
  return {
    entries: await Promise.all(batch.entries.map(serializeDailyFeedEntry)),
    nextCursor: batch.nextCursor,
  };
}
