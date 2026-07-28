"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import type {
  HeaderNavigationItem,
  NavigationItem,
  SiteAction,
} from "@/types/site";

import styles from "./Header.module.css";

type MobileNavigationProps = {
  homeLink: NavigationItem;
  navigation: readonly HeaderNavigationItem[];
  action: SiteAction;
};

export function MobileNavigation({
  homeLink,
  navigation,
  action,
}: MobileNavigationProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [openGroupIndex, setOpenGroupIndex] = useState<number | null>(null);

  const dialogRef = useRef<HTMLDialogElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;

    if (!dialog) {
      return;
    }

    if (isOpen && !dialog.open) {
      dialog.showModal();
    }

    if (!isOpen && dialog.open) {
      dialog.close();
    }

    const previousOverflow = document.body.style.overflow;

    if (isOpen) {
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  useEffect(() => {
    const desktopMedia = window.matchMedia("(min-width: 1200px)");

    function handleDesktopChange(event: MediaQueryListEvent) {
      if (!event.matches) {
        return;
      }

      setIsOpen(false);
      setOpenGroupIndex(null);
    }

    desktopMedia.addEventListener("change", handleDesktopChange);

    return () => {
      desktopMedia.removeEventListener("change", handleDesktopChange);
    };
  }, []);

  function closeMenu() {
    setIsOpen(false);
    setOpenGroupIndex(null);
  }

  return (
    <div className={styles.mobileNavigation}>
      <button
        ref={triggerRef}
        type="button"
        className={styles.menuButton}
        aria-label="Открыть меню"
        aria-expanded={isOpen}
        aria-controls="mobile-navigation"
        onClick={() => setIsOpen(true)}
      >
        <span className={styles.menuIcon} aria-hidden="true">
          <span />
          <span />
          <span />
        </span>
      </button>

      <dialog
        ref={dialogRef}
        id="mobile-navigation"
        className={styles.dialog}
        aria-labelledby="mobile-navigation-title"
        onCancel={(event) => {
          event.preventDefault();
          closeMenu();
        }}
        onClose={() => {
          setIsOpen(false);
          setOpenGroupIndex(null);

          const isDesktop = window.matchMedia("(min-width: 1200px)").matches;

          if (!isDesktop) {
            triggerRef.current?.focus();
          }
        }}
        onClick={(event) => {
          if (event.target === event.currentTarget) {
            closeMenu();
          }
        }}
      >
        <div className={styles.mobilePanel}>
          <div className={styles.mobilePanelHeader}>
            <span id="mobile-navigation-title" className={styles.mobileTitle}>
              Меню
            </span>

            <button
              type="button"
              className={styles.closeButton}
              aria-label="Закрыть меню"
              onClick={closeMenu}
            >
              <span aria-hidden="true">×</span>
            </button>
          </div>

          <nav className={styles.mobileLinks} aria-label="Мобильная навигация">
            <Link
              href={homeLink.href}
              className={`${styles.mobileLink} ${styles.mediumMenuHidden} ${styles.compactMenuHidden}`}
              onClick={closeMenu}
            >
              {homeLink.label}
            </Link>

            {navigation.map((item, index) => {
              const menuVisibilityClassName = [
                item.showInMediumHeader ? styles.mediumMenuHidden : "",
                item.showInCompactHeader ? styles.compactMenuHidden : "",
              ]
                .filter(Boolean)
                .join(" ");

              if (item.type === "link") {
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`${styles.mobileLink} ${menuVisibilityClassName}`}
                    onClick={closeMenu}
                  >
                    {item.label}
                  </Link>
                );
              }

              const isGroupOpen = openGroupIndex === index;
              const panelId = `mobile-navigation-group-${index}`;

              return (
                <div
                  key={item.label}
                  className={`${styles.mobileGroup} ${menuVisibilityClassName}`}
                >
                  <button
                    type="button"
                    className={styles.mobileGroupButton}
                    aria-expanded={isGroupOpen}
                    aria-controls={panelId}
                    onClick={() => {
                      setOpenGroupIndex(isGroupOpen ? null : index);
                    }}
                  >
                    <span>{item.label}</span>

                    <span
                      className={`${styles.mobileChevron} ${
                        isGroupOpen ? styles.mobileChevronOpen : ""
                      }`}
                      aria-hidden="true"
                    />
                  </button>

                  <div
                    id={panelId}
                    className={styles.mobileGroupPanel}
                    hidden={!isGroupOpen}
                  >
                    {item.items.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        className={styles.mobileSubLink}
                        onClick={closeMenu}
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                </div>
              );
            })}
          </nav>

          <Link
            href={action.href}
            className={styles.mobileAction}
            onClick={closeMenu}
          >
            {action.label}
          </Link>
        </div>
      </dialog>
    </div>
  );
}
