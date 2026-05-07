# Nav, Layout, and Content Structure

## Navigation State (v1)

Portfolio and About tabs are **intentionally commented out** for v1 launch. Pages and components exist but are hidden from nav:

```ts
// src/content/common.ts
export const NAV_LINKS = [
  { href: '/',     label: '主页' },
  { href: '/blog', label: '文章' },
  // { href: '/portfolio', label: '作品集' },  ← hidden for v1
  // { href: '/about',     label: '关于' },     ← hidden for v1
];
```

To re-enable, uncomment these lines. The pages (`src/app/portfolio/page.tsx`, `src/app/about/page.tsx`) are complete.

## Root Layout

`src/app/layout.tsx` renders `<Nav>` and `<Footer>` for all pages. Structure:

```tsx
<ThemeProvider>
  <Nav />                         {/* position: sticky, top: 0, z-index: 40 */}
  <main style={{ flex: 1 }}>      {/* fills remaining height */}
    {children}
  </main>
  <Footer />                      {/* scrolls with content */}
</ThemeProvider>
```

Body is `display: flex; flex-direction: column; min-height: 100dvh`. Nav is sticky; Footer scrolls (not fixed). Pages that need the full-bleed layout should use `.page` class.

## Content Data Files

Static content data lives in `src/content/`:

| File | Purpose |
|------|---------|
| `common.ts` | Nav links, profile info, footer text |
| `photos.ts` | All photo series — single source of truth |
| `portfolio.ts` | Derived from `photos.ts` — do not add items manually |
| `home.ts` | Hero section copy |
| `about.ts` | About page copy |
| `blog.ts` | Blog page metadata (heading, description) |

## Shared CSS

`src/styles/site.css` contains shared utility classes (`.container`, `.eyebrow`, `.dy-tag`, `.dy-card`, `.toc-fixed`, etc.). Import it in layout or pages as needed — it is already imported in `src/app/layout.tsx`.

`src/app/globals.css` overrides design system CSS variables with Next.js `localFont` variables, and sets global body/article styles.

*Last updated: 2026-05-07 | Reason: layout refactored during redesign; nav state documented to avoid confusion*
