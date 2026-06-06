import MiniSearch from 'minisearch';

export interface SearchDocument {
  id: string;
  source: 'post' | 'daily' | string;
  title: string;
  href: string;
  date: string;
  tags: string[];
  excerpt?: string;
  body: string;
}

export type SearchDocumentStore = Record<string, SearchDocument>;

export interface SearchPayload {
  index: unknown;
  documents: SearchDocumentStore;
}

export interface SearchSnippet {
  text: string;
  hasMatch: boolean;
  hasPrefix: boolean;
  hasSuffix: boolean;
}

export interface HighlightPart {
  text: string;
  highlight: boolean;
}

export interface SearchNavigationKey {
  key: string;
  isComposing?: boolean;
  keyCode?: number;
}

export const SEARCH_FIELDS = ['title', 'excerpt', 'tags', 'body'] as const;
export const SEARCH_STORE_FIELDS = ['id', 'source', 'title', 'href', 'date', 'tags', 'excerpt', 'body'] as const;

export function createMiniSearch() {
  return new MiniSearch<SearchDocument>({
    fields: [...SEARCH_FIELDS],
    storeFields: [...SEARCH_STORE_FIELDS],
    searchOptions: {
      boost: {
        title: 5,
        excerpt: 2,
        tags: 2,
        body: 1,
      },
      fuzzy: 0.12,
      prefix: true,
    },
  });
}

export function buildSearchPayload(documents: SearchDocument[]): SearchPayload {
  const miniSearch = createMiniSearch();
  miniSearch.addAll(documents);
  return {
    index: miniSearch.toJSON(),
    documents: Object.fromEntries(documents.map((document) => [document.id, document])),
  };
}

export function loadMiniSearch(index: unknown) {
  return MiniSearch.loadJSON<SearchDocument>(JSON.stringify(index), {
    fields: [...SEARCH_FIELDS],
    storeFields: [...SEARCH_STORE_FIELDS],
    searchOptions: {
      boost: {
        title: 5,
        excerpt: 2,
        tags: 2,
        body: 1,
      },
      fuzzy: 0.12,
      prefix: true,
    },
  });
}

export function cleanMarkdownForSearch(markdown: string): string {
  return markdown
    .replace(/^---[\s\S]*?---\s*/m, '')
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/^\s{0,3}#{1,6}\s+/gm, '')
    .replace(/^\s{0,3}>\s?/gm, '')
    .replace(/[*_~]{1,3}([^*_~]+)[*_~]{1,3}/g, '$1')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function createSearchSnippet(text: string, query: string, maxLength = 96): SearchSnippet {
  const normalizedText = text.replace(/\s+/g, ' ').trim();
  const terms = getQueryTerms(query);
  const firstMatch = terms
    .map((term) => normalizedText.toLocaleLowerCase().indexOf(term.toLocaleLowerCase()))
    .filter((index) => index >= 0)
    .sort((a, b) => a - b)[0];

  if (!normalizedText) {
    return { text: '', hasMatch: false, hasPrefix: false, hasSuffix: false };
  }

  if (firstMatch == null) {
    const textSlice = normalizedText.slice(0, maxLength);
    return {
      text: textSlice,
      hasMatch: false,
      hasPrefix: false,
      hasSuffix: normalizedText.length > textSlice.length,
    };
  }

  const halfWindow = Math.max(0, Math.floor((maxLength - terms[0].length) / 2));
  const start = Math.max(0, firstMatch - halfWindow);
  const end = Math.min(normalizedText.length, start + maxLength);
  return {
    text: normalizedText.slice(start, end),
    hasMatch: true,
    hasPrefix: start > 0,
    hasSuffix: end < normalizedText.length,
  };
}

export function splitHighlightText(text: string, query: string): HighlightPart[] {
  const terms = getQueryTerms(query);
  if (terms.length === 0 || text === '') return [{ text, highlight: false }];

  const pattern = terms.map(escapeRegExp).join('|');
  const re = new RegExp(`(${pattern})`, 'giu');
  const parts: HighlightPart[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = re.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push({ text: text.slice(lastIndex, match.index), highlight: false });
    }
    parts.push({ text: match[0], highlight: true });
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    parts.push({ text: text.slice(lastIndex), highlight: false });
  }

  return parts.length > 0 ? parts : [{ text, highlight: false }];
}

export function shouldIgnoreSearchNavigationKey(event: SearchNavigationKey): boolean {
  return event.isComposing === true || event.keyCode === 229 || event.key === 'Process';
}

function getQueryTerms(query: string): string[] {
  return Array.from(new Set(query.trim().split(/\s+/).filter(Boolean)))
    .sort((a, b) => b.length - a.length);
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
