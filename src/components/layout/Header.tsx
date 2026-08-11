import Link from "next/link";

import { siteConfig } from "@/content/site";

import { DesktopNavigation } from "./DesktopNavigation";
import styles from "./Header.module.css";
import { MobileNavigation } from "./MobileNavigation";

const compactNavigation = siteConfig.headerNavigation.slice(0, 4);
const mediumNavigation = siteConfig.headerNavigation.slice(0, 5);

export function Header() {
  return (
    <>
      <div className={styles.preHeader}>
        <div className={styles.utilityBar}>
          <div className={`container ${styles.utilityInner}`}>
            <span className={styles.location}>
              <svg
                width="14"
                height="14"
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

              <span>{siteConfig.headerContacts.location}</span>
            </span>

            <div className={styles.utilityContacts}>
              <div className={styles.messengerList} aria-label="Мессенджеры">
                {siteConfig.headerContacts.messengers.map((messenger) =>
                  messenger.href ? (
                    <a key={messenger.label} href={messenger.href}>
                      {messenger.label}
                    </a>
                  ) : (
                    <span key={messenger.label} aria-disabled="true">
                      {messenger.label}
                    </span>
                  ),
                )}
              </div>

              {siteConfig.headerContacts.phoneHref ? (
                <a
                  href={siteConfig.headerContacts.phoneHref}
                  className={styles.phone}
                >
                  {siteConfig.headerContacts.phone}
                </a>
              ) : (
                <span className={styles.phone} aria-disabled="true">
                  {siteConfig.headerContacts.phone}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className={styles.secondaryBar}>
          <nav
            className={`container ${styles.secondaryNavigation}`}
            aria-label="Информационная навигация"
          >
            {siteConfig.headerSecondaryNavigation.map((item) => (
              <Link key={item.href} href={item.href}>
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      <header className={styles.header}>
        <div className={`container ${styles.primaryInner}`}>
          <Link href="/" className={styles.brand} aria-label="АБАТ — главная">
            АБАТ
          </Link>

          <DesktopNavigation
            items={compactNavigation}
            className={styles.compactNavigation}
          />

          <DesktopNavigation
            items={mediumNavigation}
            className={styles.mediumNavigation}
          />

          <DesktopNavigation
            items={siteConfig.headerNavigation}
            className={styles.fullNavigation}
          />

          <MobileNavigation
            homeLink={siteConfig.homeLink}
            navigation={siteConfig.headerNavigation}
            services={siteConfig.headerServices}
            secondaryNavigation={siteConfig.headerSecondaryNavigation.filter(
              (item) => item.label !== "Услуги",
            )}
            contacts={siteConfig.headerContacts}
          />
        </div>
      </header>
    </>
  );
}
