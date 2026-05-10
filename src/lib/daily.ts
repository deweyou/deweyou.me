import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const DAILY_DIR = path.join(process.cwd(), 'content', 'daily');

export interface DailyEntry {
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

function readEntry(file: string): DailyEntry {
  const raw = fs.readFileSync(path.join(DAILY_DIR, file), 'utf8');
  const { data, content } = matter(raw);
  if (typeof data.title !== 'string' || data.title.trim() === '') {
    throw new Error(`Daily entry ${file} must include title`);
  }

  return {
    slug: file.replace(/\.mdx$/, ''),
    title: data.title,
    date: normalizeDate(data.date, file),
    tags: normalizeTags(data.tags, file),
    content,
  };
}

export function getAllDailyEntries(): DailyEntry[] {
  if (!fs.existsSync(DAILY_DIR)) return [];
  return fs.readdirSync(DAILY_DIR)
    .filter((file) => file.endsWith('.mdx'))
    .map(readEntry)
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function groupDailyEntriesByYear(entries: DailyEntry[]): DailyYearGroup[] {
  const groups = new Map<string, DailyEntry[]>();
  for (const entry of entries) {
    const year = entry.date.slice(0, 4);
    groups.set(year, [...(groups.get(year) ?? []), entry]);
  }
  return Array.from(groups, ([year, yearEntries]) => ({ year, entries: yearEntries }));
}
