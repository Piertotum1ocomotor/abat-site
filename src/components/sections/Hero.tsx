import Image from "next/image";

import type { HeroContent } from "@/types/home";

import styles from "./Hero.module.css";

type HeroProps = {
  content: HeroContent;
};

export function Hero({ content }: HeroProps) {
  const bannerClassName = content.image
    ? styles.banner
    : `${styles.banner} ${styles.withoutImage}`;

  return (
    <section className={styles.hero} aria-labelledby="hero-title">
      <div className={bannerClassName}>
        {content.image ? (
          <>
            <Image
              src={content.image.src}
              alt={content.image.alt}
              fill
              sizes="100vw"
              className={styles.image}
              priority
            />

            <div className={styles.overlay} aria-hidden="true" />
          </>
        ) : null}

        <div className={`container ${styles.contentContainer}`}>
          <div className={styles.content}>
            {content.eyebrow ? (
              <p className={styles.eyebrow}>{content.eyebrow}</p>
            ) : null}

            <h1 id="hero-title" className={styles.title}>
              {content.title}
            </h1>

            <p className={styles.description}>{content.description}</p>

            {content.highlights?.length ? (
              <ul className={styles.highlights}>
                {content.highlights.map((highlight) => (
                  <li key={highlight} className={styles.highlight}>
                    {highlight}
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
