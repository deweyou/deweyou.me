import type { MDXComponents } from 'mdx/types';

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
  h2: ({ children }) => (
    <h2 style={{ fontFamily: 'var(--ui-font-display)', fontSize: '1.85rem', fontWeight: 600,
      lineHeight: 1.14, margin: '2.5rem 0 1rem', letterSpacing: '-0.01em' }}>
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3 style={{ fontFamily: 'var(--ui-font-display)', fontSize: '1.45rem', fontWeight: 600,
      lineHeight: 1.22, margin: '2rem 0 0.75rem' }}>
      {children}
    </h3>
  ),
  p: ({ children }) => (
    <p style={{ fontSize: 17, lineHeight: 1.85, margin: '0 0 1.4rem', textWrap: 'pretty' } as React.CSSProperties}>
      {children}
    </p>
  ),
  blockquote: ({ children }) => (
    <blockquote style={{ borderLeft: '3px solid var(--ui-color-brand-bg)', paddingLeft: '1.25rem',
      margin: '2rem 0', color: 'var(--ui-color-text-muted)', fontStyle: 'italic' }}>
      {children}
    </blockquote>
  ),
  pre: ({ children }) => <pre className="dy-code" style={{ margin: '1.5rem 0' }}>{children}</pre>,
  code: ({ children }) => (
    <code style={{ fontFamily: 'var(--ui-font-mono)', fontSize: '0.875em',
      padding: '1px 6px', background: 'var(--ui-color-surface)',
      border: '1px solid var(--ui-color-border)', borderRadius: 3 }}>
      {children}
    </code>
  ),
};
