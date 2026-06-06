import { gzipSync } from 'zlib';
import { getAllDailyEntries } from './daily.ts';
import { getAllPosts, getPost } from './posts.ts';
import {
  buildSearchPayload,
  cleanMarkdownForSearch,
  createSearchSnippet,
  shouldIgnoreSearchNavigationKey,
  splitHighlightText,
  type SearchDocument,
  type SearchPayload,
} from './search-core.ts';

export {
  buildSearchPayload,
  cleanMarkdownForSearch,
  createSearchSnippet,
  shouldIgnoreSearchNavigationKey,
  splitHighlightText,
};
export type { SearchDocument, SearchPayload } from './search-core.ts';

export interface SearchPayloadStats {
  bytes: number;
  gzipBytes: number;
  warn: boolean;
}

export type SearchSourceAdapter = () => SearchDocument[];

export const SEARCH_PAYLOAD_WARN_BYTES = 2 * 1024 * 1024;
export const SEARCH_PAYLOAD_WARN_GZIP_BYTES = 700 * 1024;

export function getPostSearchDocuments(): SearchDocument[] {
  return getAllPosts().map((post) => {
    const fullPost = getPost(post.slug);
    return {
      id: `post:${post.slug}`,
      source: 'post',
      title: post.title,
      href: `/blog/${post.slug}`,
      date: post.date,
      tags: [post.tag].filter(Boolean),
      excerpt: post.excerpt,
      body: cleanMarkdownForSearch(fullPost.content),
    };
  });
}

export function getDailySearchDocuments(): SearchDocument[] {
  return getAllDailyEntries().map((entry) => ({
    id: `daily:${entry.id}`,
    source: 'daily',
    title: entry.title,
    href: `/daily/${entry.id}`,
    date: entry.date,
    tags: entry.tags,
    body: cleanMarkdownForSearch(entry.content),
  }));
}

export const SEARCH_SOURCE_ADAPTERS: SearchSourceAdapter[] = [
  getPostSearchDocuments,
  getDailySearchDocuments,
];

export function getSearchDocuments(): SearchDocument[] {
  return SEARCH_SOURCE_ADAPTERS.flatMap((adapter) => adapter())
    .sort((a, b) => {
      if (a.date !== b.date) return a.date < b.date ? 1 : -1;
      return a.title.localeCompare(b.title);
    });
}

export function getSearchPayload(): SearchPayload {
  return buildSearchPayload(getSearchDocuments());
}

export function getSearchPayloadStats(payload: SearchPayload): SearchPayloadStats {
  const serialized = JSON.stringify(payload);
  const bytes = Buffer.byteLength(serialized, 'utf8');
  const gzipBytes = gzipSync(serialized).byteLength;
  return {
    bytes,
    gzipBytes,
    warn: bytes > SEARCH_PAYLOAD_WARN_BYTES || gzipBytes > SEARCH_PAYLOAD_WARN_GZIP_BYTES,
  };
}
