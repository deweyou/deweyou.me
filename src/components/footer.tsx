import { Logo } from './logo';
import { SocialIcon } from './social-icon';
import { PROFILE } from '##/lib/data';
import styles from './footer.module.css';

interface FooterProps {
  compact?: boolean;
}

export function Footer({ compact = false }: FooterProps) {
  return (
    <footer className={`${styles.footer} ${compact ? styles.footerMobile : ''}`}>
      <div className={styles.brand}>
        <Logo height={14} />
        <span className={styles.copyright}>© 2026 · DEWEY OU</span>
      </div>
      <div className={styles.socials}>
        {PROFILE.socials.map((s) => (
          <SocialIcon key={s.label} s={s} />
        ))}
      </div>
    </footer>
  );
}
