import { LogoAutoCrisp } from './logo';
import { SocialIcon } from './social-icon';
import { PROFILE, FOOTER } from '##/content/common';
import styles from './footer.module.css';

interface FooterProps {
  compact?: boolean;
}

export function Footer({ compact = false }: FooterProps) {
  return (
    <footer className={`${styles.footer} ${compact ? styles.footerMobile : ''}`}>
      <div className={styles.brand}>
        <LogoAutoCrisp height={20} />
        <span className={styles.copyright}>{FOOTER.copyright}</span>
      </div>
      <div className={styles.socials}>
        {PROFILE.socials.map((s) => (
          <SocialIcon key={s.label} s={s} />
        ))}
      </div>
    </footer>
  );
}
