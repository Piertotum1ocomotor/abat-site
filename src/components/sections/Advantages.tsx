import Image from "next/image";

import type {
  AdvantagesContent,
  DetailAdvantage,
  NumericAdvantage,
} from "@/types/home";

import styles from "./Advantages.module.css";

type AdvantagesProps = {
  content: AdvantagesContent;
};

function NumericCard({ item }: { item: NumericAdvantage }) {
  return (
    <article className={styles.numericCard}>
      <div className={styles.numericArtwork} aria-hidden="true">
        <Image
          src={item.imageSrc}
          alt=""
          fill
          sizes="(max-width: 599px) 100vw, (max-width: 1023px) 50vw, 28vw"
        />
      </div>

      <div className={styles.numericContent}>
        <span className={styles.value}>{item.value}</span>
        <h3 className={styles.numericTitle}>{item.label}</h3>
        <span className={styles.cardAccent} aria-hidden="true" />
        <p className={styles.numericDescription}>{item.description}</p>
      </div>
    </article>
  );
}

function DetailCard({ item }: { item: DetailAdvantage }) {
  return (
    <article className={styles.detailCard}>
      <span className={styles.detailVisual} aria-hidden="true">
        <span
          className={styles.detailIcon}
          style={{
            maskImage: `url("${item.iconSrc}")`,
            WebkitMaskImage: `url("${item.iconSrc}")`,
          }}
        />
      </span>

      <div className={styles.detailContent}>
        <h3 className={styles.detailTitle}>{item.title}</h3>
        <p className={styles.detailDescription}>{item.description}</p>
      </div>
    </article>
  );
}

export function Advantages({ content }: AdvantagesProps) {
  return (
    <section className={styles.section} aria-labelledby="advantages-title">
      <div className="container">
        <div className={styles.heading}>
          <span className={styles.headingAccent} aria-hidden="true" />
          <h2 id="advantages-title" className={styles.title}>
            {content.title}
          </h2>
        </div>

        <div className={styles.grid}>
          {content.numeric.map((item) => (
            <NumericCard key={item.label} item={item} />
          ))}

          {content.details.map((item) => (
            <DetailCard key={item.title} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
}
