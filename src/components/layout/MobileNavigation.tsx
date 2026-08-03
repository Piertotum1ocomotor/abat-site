"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import type { HeaderContacts, NavigationItem } from "@/types/site";

import styles from "./Header.module.css";

type MobileNavigationProps = {
  homeLink: NavigationItem;
  navigation: readonly NavigationItem[];
  services: readonly NavigationItem[];
  secondaryNavigation: readonly NavigationItem[];
  contacts: HeaderContacts;
};

type MobileSubmenuItemProps = {
  item: NavigationItem;
  onNavigate: () => void;
};

function MobileSubmenuItem({ item, onNavigate }: MobileSubmenuItemProps) {
  if (item.isPlaceholder) {
    return (
      <span
        className={`${styles.mobileSubLink} ${styles.mobilePlaceholderLink}`}
        aria-disabled="true"
      >
        {item.label}
      </span>
    );
  }

  return (
    <Link
      href={item.href}
      className={styles.mobileSubLink}
      onClick={onNavigate}
    >
      {item.label}
    </Link>
  );
}

export function MobileNavigation({
  homeLink,
  navigation,
  services,
  secondaryNavigation,
  contacts,
}: MobileNavigationProps) {
  const [isOpen, setIsOpen] = useState(false);

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
      if (event.matches) {
        setIsOpen(false);
      }
    }

    desktopMedia.addEventListener("change", handleDesktopChange);

    return () => {
      desktopMedia.removeEventListener("change", handleDesktopChange);
    };
  }, []);

  function closeMenu() {
    setIsOpen(false);
  }

  return (
    <div className={styles.mobileNavigation}>
      <button
        ref={triggerRef}
        type="button"
        className={styles.menuButton}
        aria-label="Открыть полное меню"
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

          if (!window.matchMedia("(min-width: 1200px)").matches) {
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

          <nav className={styles.mobileMenu} aria-label="Полное меню сайта">
            <Link
              href={homeLink.href}
              className={styles.mobileHomeLink}
              onClick={closeMenu}
            >
              {homeLink.label}
            </Link>

            <section
              className={styles.mobileSection}
              aria-labelledby="mobile-construction-title"
            >
              <h2
                id="mobile-construction-title"
                className={styles.mobileSectionTitle}
              >
                Строительство
              </h2>

              <div className={styles.mobileSectionLinks}>
                {navigation.map((item) => (
                  <MobileSubmenuItem
                    key={item.label}
                    item={item}
                    onNavigate={closeMenu}
                  />
                ))}
              </div>
            </section>

            <section
              className={styles.mobileSection}
              aria-labelledby="mobile-services-title"
            >
              <h2
                id="mobile-services-title"
                className={styles.mobileSectionTitle}
              >
                Услуги
              </h2>

              <div className={styles.mobileSectionLinks}>
                {services.map((item) => (
                  <MobileSubmenuItem
                    key={item.label}
                    item={item}
                    onNavigate={closeMenu}
                  />
                ))}
              </div>
            </section>

            <div className={styles.mobileStandaloneLinks}>
              {secondaryNavigation.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={styles.mobileStandaloneLink}
                  onClick={closeMenu}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </nav>

          <div className={styles.mobileContacts}>
            <span className={styles.mobileLocation}>{contacts.location}</span>

            <div className={styles.mobileMessengers}>
              {contacts.messengers.map((messenger) =>
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

            {contacts.phoneHref ? (
              <a href={contacts.phoneHref} className={styles.mobilePhone}>
                {contacts.phone}
              </a>
            ) : (
              <span className={styles.mobilePhone} aria-disabled="true">
                {contacts.phone}
              </span>
            )}
          </div>
        </div>
      </dialog>
    </div>
  );
}
