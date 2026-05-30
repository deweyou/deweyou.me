import Image from 'next/image';
import { LogoAuto } from '##/components/logo';
import { HOME } from '##/content/home';
import styles from './hero.module.css';

function renderSummaryLine(line: string) {
  const [prefix, rest] = line.split(' ');

  if (!rest) {
    return line;
  }

  return (
    <>
      <span className={styles.summaryPrefix}>{prefix}</span>
      {rest}
    </>
  );
}

export function Hero() {
  return (
    <section className={styles.hero} aria-label="个人简介">
      <div className={styles.backgroundLogo} aria-hidden="true">
        <LogoAuto height={360} />
      </div>
      <div className={styles.profile}>
        <div className={styles.mobileIntro}>
          <div className={styles.mobileAvatarWrap}>
            <Image
              src="/avatar.jpg"
              alt={HOME.hero.nameEn}
              fill
              className={styles.avatarImage}
              priority
              sizes="136px"
            />
          </div>
        </div>

        <div className={styles.labelRow}>
          <span className={styles.labelRule} />
          <span>PROFILE</span>
        </div>

        <div className={styles.nameBlock}>
          <p className={styles.nameZh}>{HOME.hero.nameZh}</p>
          <h1 className={styles.nameEn}>
            <span>Dewey</span>
            <span>Ou</span>
          </h1>
        </div>

        <div className={styles.summaryZh}>
          {HOME.hero.summaryZh.map((line, index) => (
            <p key={line} data-muted={index === HOME.hero.summaryZh.length - 1}>
              {renderSummaryLine(line)}
            </p>
          ))}
        </div>

        <div className={styles.metaRow}>
          <div className={styles.tags} aria-label="关键词">
            {HOME.hero.tags.map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
          </div>
          <div className={styles.summaryEn}>
            {HOME.hero.summaryEn.map((line) => (
              <p key={line}>{line}</p>
            ))}
          </div>
        </div>
      </div>

      <div className={styles.portraitColumn}>
        <div className={styles.avatarWrap}>
          <Image
            src="/avatar.jpg"
            alt={HOME.hero.nameEn}
            fill
            className={styles.avatarImage}
            priority
            sizes="(max-width: 768px) 128px, 210px"
          />
          <span className={styles.avatarNote}>SELF 01</span>
        </div>
      </div>
    </section>
  );
}
