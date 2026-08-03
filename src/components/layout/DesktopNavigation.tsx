import Link from "next/link";

import type { NavigationItem } from "@/types/site";

import styles from "./Header.module.css";

type DesktopNavigationProps = {
  items: readonly NavigationItem[];
  className?: string;
  ariaLabel?: string;
};

export function DesktopNavigation({
  items,
  className,
  ariaLabel = "Основная навигация",
}: DesktopNavigationProps) {
  const navigationClassName = className
    ? `${styles.desktopNavigation} ${className}`
    : styles.desktopNavigation;

  return (
    <nav className={navigationClassName} aria-label={ariaLabel}>
      {items.map((item) => {
        const label = <span className={styles.navLabel}>{item.label}</span>;

        if (item.isPlaceholder) {
          return (
            <span
              key={item.label}
              className={`${styles.navLink} ${styles.placeholderLink}`}
              aria-disabled="true"
            >
              {label}
            </span>
          );
        }

        return (
          <Link key={item.href} href={item.href} className={styles.navLink}>
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
