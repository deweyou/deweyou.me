import { Nav } from '##/components/nav';
import { Footer } from '##/components/footer';
import { PortfolioGrid } from '##/components/portfolio/portfolio-grid';

export default function PortfolioPage() {
  return (
    <div className="page" style={{ minHeight: '100vh' }}>
      <Nav />
      <section style={{ padding: '80px 64px 40px', maxWidth: 1100, margin: '0 auto' }}>
        <div className="eyebrow" style={{ marginBottom: 20, display: 'inline-flex', alignItems: 'center', gap: 10 }}>
          <span style={{ width: 24, height: 1, background: 'currentColor' }} />
          PORTFOLIO
        </div>
        <h1 style={{ fontSize: '3.5rem', fontWeight: 700, lineHeight: 1.05, marginBottom: 16, letterSpacing: '-0.015em' }}>
          作品集
        </h1>
        <p style={{ fontSize: 17, color: 'var(--ui-color-text-muted)', maxWidth: 540, lineHeight: 1.7, marginBottom: 56 }}>
          GitHub 项目、设计稿、摄影作品。
        </p>
        <PortfolioGrid />
      </section>
      <Footer />
    </div>
  );
}
