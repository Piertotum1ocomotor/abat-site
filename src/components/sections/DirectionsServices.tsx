import Image from "next/image";
import Link from "next/link";

import type {
  DirectionCard,
  DirectionsServicesContent,
  ServiceCard,
} from "@/types/home";

import styles from "./DirectionsServices.module.css";

type DirectionsServicesProps = {
  content: DirectionsServicesContent;
};

function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 16" fill="none" aria-hidden="true" focusable="false">
      <path
        d="M2 8h18M15 3l5 5-5 5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function DirectionCardContent({ item }: { item: DirectionCard }) {
  return (
    <>
      {item.imageSrc ? (
        <div className={styles.directionImage}>
          <Image
            src={item.imageSrc}
            alt=""
            fill
            sizes={
              item.variant === "primary"
                ? "(max-width: 767px) 100vw, 60vw"
                : "(max-width: 767px) 100vw, 40vw"
            }
          />
        </div>
      ) : null}

      <div className={styles.directionOverlay} aria-hidden="true" />

      <div className={styles.directionContent}>
        <div className={styles.directionIconCircle}>
          <Image
            src={item.iconSrc}
            alt=""
            width={32}
            height={32}
            aria-hidden="true"
          />
        </div>

        <h3 className={styles.directionTitle}>{item.title}</h3>

        <p className={styles.directionDescription}>{item.description}</p>

        {!item.isPlaceholder ? (
          <span className={styles.directionLinkText}>
            Подробнее
            <span className={styles.directionArrow}>
              <ArrowIcon />
            </span>
          </span>
        ) : null}
      </div>
    </>
  );
}

function DirectionItem({ item }: { item: DirectionCard }) {
  const className = [
    styles.directionCard,
    styles[`directionCard_${item.variant}`],
    item.isPlaceholder ? styles.directionCardPlaceholder : "",
  ]
    .filter(Boolean)
    .join(" ");

  if (item.isPlaceholder) {
    return (
      <article className={className}>
        <DirectionCardContent item={item} />
      </article>
    );
  }

  return (
    <Link href={item.href} className={className}>
      <DirectionCardContent item={item} />
    </Link>
  );
}

function ServiceIcon({ item }: { item: ServiceCard }) {
  if (item.iconMode === "mask") {
    return (
      <span
        className={styles.serviceMaskIcon}
        style={{
          maskImage: `url("${item.iconSrc}")`,
          WebkitMaskImage: `url("${item.iconSrc}")`,
        }}
        aria-hidden="true"
      />
    );
  }

  return (
    <Image
      src={item.iconSrc}
      alt=""
      width={40}
      height={40}
      className={styles.serviceImageIcon}
      aria-hidden="true"
    />
  );
}

export function DirectionsServices({ content }: DirectionsServicesProps) {
  return (
    <section className={styles.section} aria-labelledby="directions-title">
      <div className="container">
        <div className={styles.heading}>
          <span className={styles.headingAccent} aria-hidden="true" />

          <h2 id="directions-title" className={styles.title}>
            {content.title}
          </h2>

          {content.description ? (
            <p className={styles.description}>{content.description}</p>
          ) : null}
        </div>

        <div className={styles.directionsGrid}>
          {content.directions.map((item) => (
            <DirectionItem key={item.title} item={item} />
          ))}
        </div>

        <section
          className={styles.servicesBlock}
          id="uslugi"
          aria-labelledby="services-title"
        >
          <div className={styles.servicesHeading}>
            <span className={styles.servicesAccent} aria-hidden="true" />

            <h3 id="services-title" className={styles.servicesTitle}>
              {content.servicesTitle}
            </h3>
          </div>

          <div className={styles.servicesGrid}>
            {content.services.map((item) => (
              <Link
                href={item.href}
                className={styles.serviceCard}
                key={item.title}
              >
                <ServiceIcon item={item} />

                <span className={styles.serviceTitle}>{item.title}</span>

                <span className={styles.serviceArrow}>
                  <ArrowIcon />
                </span>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </section>
  );
}
