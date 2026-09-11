import Link from "next/link";

import { siteConfig } from "@/content/site";
import type { NavigationItem } from "@/types/site";

import styles from "./Footer.module.css";

type FooterLinkProps = {
  item: NavigationItem;
};

function FooterLink({ item }: FooterLinkProps) {
  if (item.isPlaceholder) {
    return <span aria-disabled="true">{item.label}</span>;
  }

  return <Link href={item.href}>{item.label}</Link>;
}

export function Footer() {
  const { contacts, headerContacts } = siteConfig;

  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.inner}`}>
        <div className={styles.brandColumn}>
          <Link
            href={siteConfig.homeLink.href}
            className={styles.brand}
            aria-label="АБАТ — главная"
          >
            АБАТ
          </Link>
          <div className={styles.locations}>
            {contacts.locations?.map((location) => (
              <span className={styles.location} key={location}>
                {location}
              </span>
            ))}
          </div>
        </div>

        <nav className={styles.navigation} aria-label="Навигация в подвале">
          <div className={styles.navigationGroup}>
            <span className={styles.groupTitle}>Строительство</span>
            <div className={styles.linkList}>
              {siteConfig.headerNavigation.map((item) => (
                <FooterLink item={item} key={item.label} />
              ))}
            </div>
          </div>

          <div className={styles.navigationGroup}>
            <span className={styles.groupTitle}>Услуги</span>
            <div className={styles.linkList}>
              {siteConfig.headerServices.map((item) => (
                <FooterLink item={item} key={item.label} />
              ))}
            </div>
          </div>

          <div className={styles.navigationGroup}>
            <span className={styles.groupTitle}>Компания</span>
            <div className={styles.linkList}>
              {siteConfig.headerSecondaryNavigation.map((item) => (
                <FooterLink item={item} key={item.label} />
              ))}
            </div>
          </div>
        </nav>

        <div className={styles.contacts}>
          {headerContacts.phoneHref ? (
            <a href={headerContacts.phoneHref} className={styles.phone}>
              {headerContacts.phone}
            </a>
          ) : (
            <span className={styles.phone} aria-disabled="true">
              {headerContacts.phone}
            </span>
          )}

          {contacts.email ? (
            <a href={`mailto:${contacts.email}`} className={styles.email}>
              {contacts.email}
            </a>
          ) : null}

          <div className={styles.messengers} aria-label="Мессенджеры">
            {headerContacts.messengers.map((messenger) =>
              messenger.href ? (
                <a href={messenger.href} key={messenger.label}>
                  {messenger.label}
                </a>
              ) : (
                <span aria-disabled="true" key={messenger.label}>
                  {messenger.label}
                </span>
              ),
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}
