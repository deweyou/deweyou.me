import type { MDXComponents } from 'mdx/types';
import { Text } from '@deweyou-design/react/text';

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
  h2: ({ children }) => {
    const id = String(children)
      .toLowerCase()
      .replace(/[\s\u4e00-\u9fff\u3400-\u4dbf`'"]+/g, '-')
      .replace(/[^\w-]/g, '')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
    return (
      <Text variant="h2" id={id} style={{ margin: '3rem 0 1.25rem', lineHeight: 1.3, letterSpacing: '-0.01em', scrollMarginTop: 80 }}>
        {children}
      </Text>
    );
  },
  h3: ({ children }) => {
    const id = String(children)
      .toLowerCase()
      .replace(/[\s\u4e00-\u9fff\u3400-\u4dbf`'"]+/g, '-')
      .replace(/[^\w-]/g, '')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
    return (
      <Text variant="h3" id={id} style={{ margin: '2.5rem 0 1rem', lineHeight: 1.4, scrollMarginTop: 80 }}>
        {children}
      </Text>
    );
  },
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
