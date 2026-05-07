import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const POSTS_DIR = path.join(process.cwd(), 'content', 'posts');

export interface PostMeta {
  slug: string;
  title: string;
  date: string;
  tag: string;
  readTime: string;
  excerpt: string;
  pinned?: boolean;
}

export interface Post extends PostMeta {
  content: string;
}

export function getAllPosts(): PostMeta[] {
  const files = fs.readdirSync(POSTS_DIR).filter((f) => f.endsWith('.mdx'));
  return files
    .map((file) => {
      const slug = file.replace(/\.mdx$/, '');
      const raw = fs.readFileSync(path.join(POSTS_DIR, file), 'utf8');
      const { data } = matter(raw);
      return { slug, ...data, date: String(data.date).slice(0, 10) } as PostMeta;
    })
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getPost(slug: string): Post {
  const file = path.join(POSTS_DIR, `${slug}.mdx`);
  const raw = fs.readFileSync(file, 'utf8');
  const { data, content } = matter(raw);
  return { slug, ...data, date: String(data.date).slice(0, 10), content } as Post;
}

export interface TocItem {
  id: string;
  label: string;
  depth: number;
}

export function extractToc(content: string): TocItem[] {
  const re = /^(#{1,3})\s+(.+)$/gm;
  const items: TocItem[] = [];
  let m;
  while ((m = re.exec(content)) !== null) {
    const depth = m[1].length;
    const label = m[2].trim();
    // Strip markdown inline syntax to match what mdx renders as plain text
    const plainLabel = label
      .replace(/`([^`]+)`/g, '$1')
      .replace(/\*\*([^*]+)\*\*/g, '$1')
      .replace(/__([^_]+)__/g, '$1')
      .replace(/\*([^*]+)\*/g, '$1')
      .replace(/_([^_]+)_/g, '$1');
    const id = plainLabel
      .toLowerCase()
      .replace(/[`'"]+/g, '')
      .replace(/[\s\p{P}]+/gu, '-')
      .replace(/[^\w\u4e00-\u9fff\u3400-\u4dbf-]/g, '')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
    items.push({ id, label: plainLabel, depth });
  }
  return items;
}

export function getAllSlugs(): string[] {
  return fs.readdirSync(POSTS_DIR)
    .filter((f) => f.endsWith('.mdx'))
    .map((f) => f.replace(/\.mdx$/, ''));
}
