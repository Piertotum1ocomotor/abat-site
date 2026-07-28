import Link from "next/link";

import { siteConfig } from "@/content/site";

import { DesktopNavigation } from "./DesktopNavigation";
import styles from "./Header.module.css";
import { MobileNavigation } from "./MobileNavigation";

const mediumHeaderNavigation = siteConfig.headerNavigation.filter(
  (item) => item.showInMediumHeader,
);

const compactHeaderNavigation = siteConfig.headerNavigation.filter(
  (item) => item.showInCompactHeader,
);

export function Header() {
  return (
    <header className={styles.header}>
      <div className={`container ${styles.inner}`}>
        <Link href="/" className={styles.brand} aria-label="Абат — главная">
          <span className={styles.brandName}>АБАТ</span>
          <span className={styles.brandDescription}>Металлоконструкции</span>
        </Link>

        <DesktopNavigation
          items={mediumHeaderNavigation}
          className={styles.mediumNavigation}
          idPrefix="medium-navigation"
        />

        <DesktopNavigation
          items={compactHeaderNavigation}
          className={styles.compactNavigation}
          idPrefix="compact-navigation"
        />

        <DesktopNavigation
          items={siteConfig.headerNavigation}
          className={styles.fullNavigation}
          idPrefix="full-navigation"
        />

        <Link
          href={siteConfig.headerAction.href}
          className={styles.desktopAction}
        >
          {siteConfig.headerAction.label}
        </Link>

        <MobileNavigation
          homeLink={siteConfig.homeLink}
          navigation={siteConfig.headerNavigation}
          action={siteConfig.headerAction}
        />
      </div>
    </header>
  );
}
