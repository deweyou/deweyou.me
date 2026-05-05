import { Nav } from '##/components/nav';
import { Footer } from '##/components/footer';
import { PortfolioGrid } from '##/components/portfolio/portfolio-grid';
import { PORTFOLIO } from '##/content/portfolio';

export default function PortfolioPage() {
  return (
    <div className="page">
      <Nav />
      <section className="container container-lg" style={{ paddingTop: 80, paddingBottom: 40 }}>
        <div className="eyebrow" style={{ marginBottom: 20, display: 'inline-flex', alignItems: 'center', gap: 10 }}>
          <span style={{ width: 24, height: 1, background: 'currentColor' }} />
          {PORTFOLIO.eyebrow}
        </div>
        <h1 style={{ fontSize: '3.5rem', fontWeight: 700, lineHeight: 1.05, marginBottom: 16, letterSpacing: '-0.015em' }}>
          {PORTFOLIO.heading}
        </h1>
        <p style={{ fontSize: 17, color: 'var(--ui-color-text-muted)', maxWidth: 540, lineHeight: 1.7, marginBottom: 56 }}>
          {PORTFOLIO.description}
        </p>
        <PortfolioGrid />
      </section>
      <Footer />
    </div>
  );
}
