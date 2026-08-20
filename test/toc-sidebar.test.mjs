import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

test('blog toc uses a compact marker rail with per-section custom tooltips', () => {
  const css = readFileSync('src/styles/site.css', 'utf8');
  const component = readFileSync('src/components/blog/toc-sidebar.tsx', 'utf8');
  const markdown = readFileSync('src/components/markdown-content.tsx', 'utf8');

  assert.match(component, /aria-label="\u6587\u7ae0\u76ee\u5f55"/);
  assert.match(component, /aria-current=\{isActive \? 'location' : undefined\}/);
  assert.match(component, /role="tooltip"/);
  assert.match(component, /className="toc-tooltip"/);
  assert.match(component, /onMouseEnter=/);
  assert.match(component, /onFocus=/);
  assert.match(component, /onMouseLeave=/);
  assert.match(component, /onBlur=/);
  assert.match(component, /onPointerMove=/);
  assert.match(component, /onPointerLeave=/);
  assert.match(component, /const easedProximity = proximity \* \(2 - proximity\)/);
  assert.match(component, /if \(visualTier === 2\) return 100;/);
  assert.match(component, /if \(visualTier === 1\) return 82;/);
  assert.match(component, /return 64;/);
  assert.match(component, /baseWidth \+ \(expandedWidth - baseWidth\) \* easedProximity/);
  assert.doesNotMatch(component, /title=\{item\.label\}/);
  assert.match(component, /className="toc-marker"/);
  assert.match(component, /data-tier=\{visualTier\}/);
  assert.match(component, /getRelativeTocTier/);
  assert.match(component, /- BLOG_ANCHOR_OFFSET/);
  assert.equal(markdown.match(/scrollMarginTop: BLOG_ANCHOR_OFFSET/g)?.length, 3);
  assert.doesNotMatch(component, /className="toc-label"/);
  assert.doesNotMatch(css, /\.toc-fixed:hover \.toc-panel/);
  assert.match(css, /\.toc-panel\s*{[\s\S]*overflow-y:\s*auto;/);
  assert.match(css, /\.toc-list\s*{[\s\S]*gap:\s*0;/);
  assert.match(css, /\.toc-link\s*{[\s\S]*min-height:\s*13px;/);
  assert.match(css, /\.toc-tooltip\s*{[\s\S]*position:\s*absolute;/);
  assert.match(css, /\.toc-tooltip\s*{[\s\S]*pointer-events:\s*none;/);
  assert.match(css, /@media \(max-width:\s*1343px\)\s*{[\s\S]*\.toc-fixed\s*{\s*display:\s*none;/);
  assert.match(css, /@media \(prefers-reduced-motion: reduce\)/);
});

test('blog toc marker length communicates relative heading hierarchy', () => {
  const css = readFileSync('src/styles/site.css', 'utf8');

  assert.match(css, /\.toc-item\[data-tier='2'\]\s*{[\s\S]*--toc-marker-width:\s*68%;/);
  assert.match(css, /\.toc-item\[data-tier='1'\]\s*{[\s\S]*--toc-marker-width:\s*46%;/);
  assert.match(css, /\.toc-item\[data-tier='0'\]\s*{[\s\S]*--toc-marker-width:\s*28%;/);
  assert.match(css, /\.toc-marker\s*{[\s\S]*width:\s*var\(--toc-marker-width\);/);
  const hoverRule = css.match(/\.toc-link:is\(:hover, :focus-visible\) \.toc-marker\s*{([^}]*)}/)?.[1] ?? '';
  assert.doesNotMatch(hoverRule, /width:/);
});

test('blog fixed toc is vertically centered within the viewport', () => {
  const css = readFileSync('src/styles/site.css', 'utf8');
  const fixedTocRule = css.match(/\.toc-fixed\s*{([^}]*)}/)?.[1] ?? '';

  assert.match(fixedTocRule, /top:\s*50%;/);
  assert.match(fixedTocRule, /max-height:\s*calc\(100vh - 160px\);/);
  assert.match(fixedTocRule, /transform:\s*translateY\(-50%\);/);
});
