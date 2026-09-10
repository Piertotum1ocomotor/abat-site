"use client";

import Image from "next/image";
import { useRef, useState, type TouchEvent } from "react";

import type { ProjectImage } from "@/types/projects";

import styles from "./AboutGallery.module.css";

type AboutGalleryProps = {
  images: readonly ProjectImage[];
};

type TouchPoint = {
  x: number;
  y: number;
};

function ArrowIcon({ direction = "right" }: { direction?: "left" | "right" }) {
  return (
    <svg
      className={direction === "left" ? styles.arrowLeft : undefined}
      viewBox="0 0 28 20"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M2 10h23M17 2l8 8-8 8"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function AboutGallery({ images }: AboutGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const touchStartRef = useRef<TouchPoint | null>(null);
  const touchCurrentRef = useRef<TouchPoint | null>(null);

  const changeImage = (direction: 1 | -1) => {
    setActiveIndex((current) => {
      return (current + direction + images.length) % images.length;
    });
  };

  const handleTouchStart = (event: TouchEvent<HTMLDivElement>) => {
    const touch = event.touches[0];
    touchStartRef.current = { x: touch.clientX, y: touch.clientY };
    touchCurrentRef.current = { x: touch.clientX, y: touch.clientY };
  };

  const handleTouchMove = (event: TouchEvent<HTMLDivElement>) => {
    const touch = event.touches[0];
    touchCurrentRef.current = { x: touch.clientX, y: touch.clientY };
  };

  const resetTouch = () => {
    touchStartRef.current = null;
    touchCurrentRef.current = null;
  };

  const handleTouchEnd = () => {
    const start = touchStartRef.current;
    const current = touchCurrentRef.current;
    resetTouch();

    if (!start || !current) return;

    const deltaX = current.x - start.x;
    const deltaY = current.y - start.y;

    if (Math.abs(deltaX) >= 52 && Math.abs(deltaX) > Math.abs(deltaY) * 1.25) {
      changeImage(deltaX < 0 ? 1 : -1);
    }
  };

  const visibleImages = [0, 1, 2].map((offset) => {
    return images[(activeIndex + offset) % images.length];
  });

  return (
    <div className={styles.gallery}>
      <button
        type="button"
        className={styles.control}
        onClick={() => changeImage(-1)}
        aria-label="Предыдущие фотографии"
      >
        <ArrowIcon direction="left" />
      </button>

      <div
        className={styles.viewport}
        aria-live="polite"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={resetTouch}
      >
        {visibleImages.map((image, index) => (
          <figure className={styles.item} key={image.src}>
            <Image
              src={image.src}
              alt={image.alt}
              fill
              sizes="(max-width: 767px) calc(100vw - 136px), (max-width: 1023px) 42vw, 28vw"
              className={styles.image}
              priority={activeIndex === 0 && index === 0}
            />
          </figure>
        ))}
      </div>

      <button
        type="button"
        className={styles.control}
        onClick={() => changeImage(1)}
        aria-label="Следующие фотографии"
      >
        <ArrowIcon />
      </button>
    </div>
  );
}
