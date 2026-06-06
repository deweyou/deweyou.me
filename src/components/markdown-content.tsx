'use client';

import { MarkdownRender, type MarkdownRenderComponents } from '@deweyou-design/react/markdown-render';
import { Text, type TextProps } from '@deweyou-design/react/text';

function normalizeAssetUrl(url: string, assetBasePath?: string): string {
  if (!assetBasePath) return url;
  if (
    url.startsWith('http://')
    || url.startsWith('https://')
    || url.startsWith('//')
    || url.startsWith('/')
    || url.startsWith('#')
    || url.startsWith('data:')
  ) {
    return url;
  }
  return `${assetBasePath}${url}`.replace(/(?<!:)\/{2,}/g, '/');
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[`'"]+/g, '')
    .replace(/[\s\p{P}]+/gu, '-')
    .replace(/[^\w\u4e00-\u9fff\u3400-\u4dbf-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

function getHeadingTextProps(props: Record<string, unknown>): TextProps {
  return Object.fromEntries(
    Object.entries(props).filter(([name]) => (
      name === 'id'
        || name === 'className'
        || name === 'title'
        || name === 'role'
        || name === 'tabIndex'
        || name.startsWith('aria-')
        || name.startsWith('data-')
    )),
  ) as TextProps;
}

const headingComponents: MarkdownRenderComponents = {
  h1: ({ children, ...props }) => (
    <Text
      {...getHeadingTextProps(props)}
      variant="h2"
      style={{ margin: '3.5rem 0 1.25rem', lineHeight: 1.2, letterSpacing: '-0.02em', scrollMarginTop: 88 }}
    >
      {children}
    </Text>
  ),
  h2: ({ children, ...props }) => (
    <Text
      {...getHeadingTextProps(props)}
      variant="h3"
      style={{ margin: '3rem 0 1rem', lineHeight: 1.3, letterSpacing: '-0.01em', scrollMarginTop: 88 }}
    >
      {children}
    </Text>
  ),
  h3: ({ children, ...props }) => (
    <Text
      {...getHeadingTextProps(props)}
      variant="h4"
      style={{ margin: '2.5rem 0 0.875rem', lineHeight: 1.4, scrollMarginTop: 88 }}
    >
      {children}
    </Text>
  ),
};

export function MarkdownContent({
  assetBasePath,
  content,
}: {
  assetBasePath?: string;
  content: string;
}) {
  const components: MarkdownRenderComponents = {
    ...headingComponents,
    img: ({ src, ...props }) => (
      // Daily shares keep relative asset refs in markdown; normalize them to the public base path at render time.
      // eslint-disable-next-line @next/next/no-img-element
      <img
        {...props}
        alt={typeof props.alt === 'string' ? props.alt : ''}
        src={typeof src === 'string' ? normalizeAssetUrl(src, assetBasePath) : src}
      />
    ),
  };

  return (
    <MarkdownRender
      components={components}
      resolveNodeAttributes={({ node, text }) => {
        if (node !== 'h1' && node !== 'h2' && node !== 'h3') return undefined;
        return { id: slugify(text) };
      }}
      size="lg"
      value={content}
    />
  );
}
