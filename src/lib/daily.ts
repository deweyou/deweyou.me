import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const DAILY_DIR = path.join(process.cwd(), 'content', 'daily');
const DEFAULT_DAILY_FEED_LIMIT = 20;
const MAX_DAILY_FEED_LIMIT = 50;

export interface DailyEntry {
  id: string;
  slug: string;
  title: string;
  date: string;
  tags: string[];
  content: string;
}

export interface DailyYearGroup {
  year: string;
  entries: DailyEntry[];
}

export interface DailyFeedBatch {
  entries: DailyEntry[];
  nextCursor: string | null;
}

function getSlugFromFile(file: string): string {
  return file.replace(/\.mdx$/, '');
}

function normalizeDate(value: unknown, file: string): string {
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value)) return value;
  throw new Error(`Daily entry ${file} must include date as YYYY-MM-DD`);
}

function normalizeTags(value: unknown, file: string): string[] {
  if (value == null) return [];
  if (Array.isArray(value) && value.every((item) => typeof item === 'string')) return value;
  throw new Error(`Daily entry ${file} tags must be a string array`);
}

function normalizeId(value: unknown, file: string): string {
  if (typeof value === 'string' && /^daily-\d{8}-\d{2}$/.test(value)) return value;
  throw new Error(`Daily entry ${file} must include id as daily-YYYYMMDD-NN`);
}

function readEntry(file: string): DailyEntry {
  const raw = fs.readFileSync(path.join(DAILY_DIR, file), 'utf8');
  const { data, content } = matter(raw);
  if (typeof data.title !== 'string' || data.title.trim() === '') {
    throw new Error(`Daily entry ${file} must include title`);
  }
  const slug = getSlugFromFile(file);
  const date = normalizeDate(data.date, file);
  const id = normalizeId(data.id, file);
  if (!slug.startsWith(`${date}-`)) {
    throw new Error(`Daily entry ${file} must be named ${date}-title.mdx`);
  }

  return {
    id,
    slug,
    title: data.title,
    date,
    tags: normalizeTags(data.tags, file),
    content,
  };
}

export function getAllDailyEntries(): DailyEntry[] {
  if (!fs.existsSync(DAILY_DIR)) return [];
  const entries = fs.readdirSync(DAILY_DIR)
    .filter((file) => file.endsWith('.mdx'))
    .map(readEntry)
    .sort((a, b) => {
      if (a.date !== b.date) return a.date < b.date ? 1 : -1;
      return a.slug.localeCompare(b.slug);
    });
  const ids = new Set<string>();
  for (const entry of entries) {
    if (ids.has(entry.id)) {
      throw new Error(`Duplicate daily id: ${entry.id}`);
    }
    ids.add(entry.id);
  }
  return entries;
}

export function getDailyEntryById(id: string): DailyEntry {
  const decodedId = decodeURIComponent(id);
  if (decodedId.includes('/') || decodedId.includes('\\')) {
    throw new Error(`Invalid daily id: ${decodedId}`);
  }
  const entry = getAllDailyEntries().find((dailyEntry) => dailyEntry.id === decodedId);
  if (!entry) {
    throw new Error(`Daily entry not found: ${decodedId}`);
  }
  return entry;
}

export function getDailyFeedBatch({
  cursor,
  limit = DEFAULT_DAILY_FEED_LIMIT,
}: {
  cursor?: string | null;
  limit?: number;
} = {}): DailyFeedBatch {
  const entries = getAllDailyEntries();
  const batchLimit = Math.min(MAX_DAILY_FEED_LIMIT, Math.max(1, Math.floor(limit)));
  let startIndex = 0;

  if (cursor) {
    const decodedCursor = decodeURIComponent(cursor);
    const cursorIndex = entries.findIndex((entry) => entry.id === decodedCursor);
    if (cursorIndex === -1) {
      throw new Error(`Daily cursor not found: ${decodedCursor}`);
    }
    startIndex = cursorIndex + 1;
  }

  const batchEntries = entries.slice(startIndex, startIndex + batchLimit);
  const nextCursor = startIndex + batchLimit < entries.length
    ? batchEntries.at(-1)?.id ?? null
    : null;

  return {
    entries: batchEntries,
    nextCursor,
  };
}

export function groupDailyEntriesByYear(entries: DailyEntry[]): DailyYearGroup[] {
  const groups = new Map<string, DailyEntry[]>();
  for (const entry of entries) {
    const year = entry.date.slice(0, 4);
    groups.set(year, [...(groups.get(year) ?? []), entry]);
  }
  return Array.from(groups, ([year, yearEntries]) => ({ year, entries: yearEntries }));
}
