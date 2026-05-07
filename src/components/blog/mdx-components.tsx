import type { MDXComponents } from 'mdx/types';
import React from 'react';
import { Text } from '@deweyou-design/react/text';

function extractText(node: React.ReactNode): string {
  if (typeof node === 'string' || typeof node === 'number') return String(node);
  if (Array.isArray(node)) return node.map(extractText).join('');
  if (React.isValidElement(node)) return extractText((node.props as { children?: React.ReactNode }).children);
  return '';
}

function slugify(children: React.ReactNode): string {
  return extractText(children)
    .toLowerCase()
    .replace(/[`'"]+/g, '')
    .replace(/[\s\p{P}]+/gu, '-')
    .replace(/[^\w\u4e00-\u9fff\u3400-\u4dbf-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

export const mdxComponents: MDXComponents = {
  a: ({ href, children }) => (
    <a
      href={href}
      target={href?.startsWith('http') ? '_blank' : undefined}
      rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
      style={{ color: 'var(--ui-color-brand-text)', textDecoration: 'underline', textUnderlineOffset: 3 }}
    >
      {children}
    </a>
  ),
  h1: ({ children }) => (
    <Text variant="h2" id={slugify(children)} style={{ margin: '3.5rem 0 1.25rem', lineHeight: 1.2, letterSpacing: '-0.02em', scrollMarginTop: 88 }}>
      {children}
    </Text>
  ),
  h2: ({ children }) => (
    <Text variant="h3" id={slugify(children)} style={{ margin: '3rem 0 1rem', lineHeight: 1.3, letterSpacing: '-0.01em', scrollMarginTop: 88 }}>
      {children}
    </Text>
  ),
  h3: ({ children }) => (
    <Text variant="h4" id={slugify(children)} style={{ margin: '2.5rem 0 0.875rem', lineHeight: 1.4, scrollMarginTop: 88 }}>
      {children}
    </Text>
  ),
  p: ({ children }) => (
    <Text variant="body" style={{ fontSize: 17, lineHeight: 1.85, margin: '0 0 1.4rem', textWrap: 'pretty' } as React.CSSProperties}>
      {children}
    </Text>
  ),
  strong: ({ children }) => <Text bold>{children}</Text>,
  em: ({ children }) => <Text italic>{children}</Text>,
  blockquote: ({ children }) => (
    <blockquote style={{ borderLeft: '3px solid var(--ui-color-brand-bg)', paddingLeft: '1.25rem',
      margin: '2rem 0', color: 'var(--ui-color-text-muted)', fontStyle: 'italic' }}>
      {children}
    </blockquote>
  ),
  pre: ({ children }) => <pre className="dy-code" style={{ margin: '1.5rem 0' }}>{children}</pre>,
  code: ({ children }) => (
    <code style={{
      fontFamily: 'var(--ui-font-mono)',
      fontSize: '0.85em',
      padding: '2px 6px',
      background: 'color-mix(in srgb, var(--ui-color-text) 6%, transparent)',
      borderRadius: 4,
    }}>
      {children}
    </code>
  ),
};
