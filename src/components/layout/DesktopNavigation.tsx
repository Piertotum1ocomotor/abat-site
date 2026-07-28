"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import type { HeaderNavigationItem } from "@/types/site";

import styles from "./Header.module.css";

type DesktopNavigationProps = {
  items: readonly HeaderNavigationItem[];
  className?: string;
  idPrefix?: string;
};

export function DesktopNavigation({
  items,
  className,
  idPrefix = "desktop-navigation",
}: DesktopNavigationProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const navigationClassName = className
    ? `${styles.desktopNavigation} ${className}`
    : styles.desktopNavigation;

  const navigationRef = useRef<HTMLElement>(null);
  const buttonRefs = useRef(new Map<number, HTMLButtonElement>());

  useEffect(() => {
    if (openIndex === null) {
      return;
    }

    const activeIndex = openIndex;

    function handlePointerDown(event: MouseEvent) {
      if (
        navigationRef.current &&
        !navigationRef.current.contains(event.target as Node)
      ) {
        setOpenIndex(null);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key !== "Escape") {
        return;
      }

      setOpenIndex(null);
      buttonRefs.current.get(activeIndex)?.focus();
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [openIndex]);

  return (
    <nav
      ref={navigationRef}
      className={navigationClassName}
      aria-label="Основная навигация"
    >
      {items.map((item, index) => {
        if (item.type === "link") {
          return (
            <Link key={item.href} href={item.href} className={styles.navLink}>
              {item.label}
            </Link>
          );
        }

        const isOpen = openIndex === index;
        const panelId = `${idPrefix}-group-${index}`;

        return (
          <div key={item.label} className={styles.navigationGroup}>
            <button
              ref={(element) => {
                if (element) {
                  buttonRefs.current.set(index, element);
                } else {
                  buttonRefs.current.delete(index);
                }
              }}
              type="button"
              className={styles.groupButton}
              aria-expanded={isOpen}
              aria-controls={panelId}
              onClick={() => {
                setOpenIndex(isOpen ? null : index);
              }}
            >
              <span>{item.label}</span>

              <span
                className={`${styles.chevron} ${
                  isOpen ? styles.chevronOpen : ""
                }`}
                aria-hidden="true"
              />
            </button>

            {isOpen ? (
              <div
                id={panelId}
                className={styles.dropdown}
                aria-label={item.label}
              >
                {item.items.map((child) => (
                  <Link
                    key={child.href}
                    href={child.href}
                    className={styles.dropdownLink}
                    onClick={() => setOpenIndex(null)}
                  >
                    {child.label}
                  </Link>
                ))}
              </div>
            ) : null}
          </div>
        );
      })}
    </nav>
  );
}
