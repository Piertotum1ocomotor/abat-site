import Image from "next/image";

import styles from "./DirectionHero.module.css";

type DirectionHeroProps = {
  eyebrow: string;
  title: string;
  lead: string;
  cta?: {
    label: string;
    href: string;
  };
  image: {
    src: string;
    alt: string;
    width: number;
    height: number;
  };
};

export function DirectionHero({
  eyebrow,
  title,
  lead,
  cta,
  image,
}: DirectionHeroProps) {
  return (
    <section className={styles.hero}>
      <div className={`container ${styles.layout}`}>
        <div className={styles.content}>
          <span className={styles.eyebrow}>{eyebrow}</span>
          <h1 className={styles.title}>{title}</h1>
          <p className={styles.lead}>{lead}</p>
          {cta ? (
            <a className={`${styles.cta} ${styles.mobileCta}`} href={cta.href}>
              {cta.label}
            </a>
          ) : null}
        </div>

        <div className={styles.media}>
          <Image
            src={image.src}
            alt={image.alt}
            width={image.width}
            height={image.height}
            sizes="(max-width: 899px) calc(100vw - 32px), (max-width: 1199px) 52vw, 720px"
            className={styles.image}
            priority
          />
          {cta ? (
            <a className={`${styles.cta} ${styles.mediaCta}`} href={cta.href}>
              {cta.label}
            </a>
          ) : null}
        </div>
      </div>
    </section>
  );
}
