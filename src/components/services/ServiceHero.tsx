import Image from "next/image";

import styles from "./ServiceHero.module.css";

type ServiceHeroProps = {
  eyebrow: string;
  title: string;
  lead: string;
  image: {
    src: string;
    alt: string;
  };
  compactTitle?: boolean;
  note?: string;
};

export function ServiceHero({
  eyebrow,
  title,
  lead,
  image,
  compactTitle = false,
  note,
}: ServiceHeroProps) {
  return (
    <section className={styles.hero}>
      <div className={`container ${styles.layout}`}>
        <div className={styles.content}>
          <span className={styles.eyebrow}>{eyebrow}</span>
          <h1
            className={`${styles.title} ${compactTitle ? styles.compactTitle : ""}`}
          >
            {title}
          </h1>
          <p className={styles.lead}>{lead}</p>
          <a className={styles.cta} href="#contacts">
            Обсудить задачу
          </a>
          {note ? <p className={styles.note}>{note}</p> : null}
        </div>

        <div className={styles.media}>
          <Image
            src={image.src}
            alt={image.alt}
            fill
            sizes="(max-width: 899px) calc(100vw - 32px), (max-width: 1360px) 52vw, 700px"
            className={styles.image}
            priority
          />
          <span className={styles.mediaMark} aria-hidden="true">
            АБАТ
          </span>
        </div>
      </div>
    </section>
  );
}
