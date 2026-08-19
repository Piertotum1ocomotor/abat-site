import Image from "next/image";

import { siteConfig } from "@/content/site";

import styles from "./ContactCTA.module.css";

type ContactRowProps = {
  children: React.ReactNode;
  className?: string;
  href?: string;
  showArrow?: boolean;
};

function ContactRow({
  children,
  className,
  href,
  showArrow = false,
}: ContactRowProps) {
  const rowClassName = [styles.contactRow, className]
    .filter(Boolean)
    .join(" ");
  const content = (
    <>
      <span className={styles.rowText}>{children}</span>
      {showArrow ? (
        <span className={styles.arrow} aria-hidden="true">
          →
        </span>
      ) : null}
    </>
  );

  return href ? (
    <a className={`${rowClassName} ${styles.contactLink}`} href={href}>
      {content}
    </a>
  ) : (
    <span className={rowClassName} aria-disabled="true">
      {content}
    </span>
  );
}

export function ContactCTA() {
  const { headerContacts } = siteConfig;
  const telegram = headerContacts.messengers.find(
    (messenger) => messenger.label === "Telegram",
  );
  const whatsapp = headerContacts.messengers.find(
    (messenger) => messenger.label === "WhatsApp",
  );

  return (
    <section className={styles.section} aria-labelledby="contact-cta-title">
      <div className="container">
        <span className={styles.accent} aria-hidden="true" />

        <div className={styles.card}>
          <div className={styles.decorativeStrip} aria-hidden="true">
            <Image
              src="/images/directions/building-w.svg"
              alt=""
              width={64}
              height={64}
              className={styles.decorativeIcon}
            />
          </div>

          <div className={styles.mainContent}>
            <div>
              <h2 id="contact-cta-title" className={styles.title}>
                Обсудим ваш проект
              </h2>
              <p className={styles.description}>
                Свяжитесь с нами по телефону или напишите в любом удобном
                мессенджере.
              </p>
            </div>

            <span className={styles.location}>
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M12 21s7-5.1 7-12a7 7 0 1 0-14 0c0 6.9 7 12 7 12Z"
                  stroke="currentColor"
                  strokeWidth="1.8"
                />
                <circle
                  cx="12"
                  cy="9"
                  r="2.5"
                  stroke="currentColor"
                  strokeWidth="1.8"
                />
              </svg>
              {headerContacts.location}
            </span>
          </div>

          <div className={styles.contactPanel} aria-label="Способы связи">
            <ContactRow
              href={headerContacts.phoneHref}
              className={styles.phoneRow}
            >
              <span className={styles.rowLabel}>Телефон</span>
              <span className={styles.phone}>{headerContacts.phone}</span>
            </ContactRow>

            <ContactRow href={telegram?.href} showArrow>
              Написать в Telegram
            </ContactRow>

            <ContactRow href={whatsapp?.href} showArrow>
              Написать в WhatsApp
            </ContactRow>
          </div>
        </div>
      </div>
    </section>
  );
}
