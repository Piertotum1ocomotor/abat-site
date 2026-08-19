"use client";

import Image from "next/image";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type MouseEvent,
  type TouchEvent,
} from "react";

import type { ProjectImage } from "@/types/projects";

import styles from "./ProjectGallery.module.css";

type ProjectGalleryProps = {
  projectTitle: string;
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

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false">
      <path
        d="m5 5 14 14M19 5 5 19"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function ProjectGallery({ projectTitle, images }: ProjectGalleryProps) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const mainImageButtonRef = useRef<HTMLButtonElement>(null);
  const lightboxRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const touchStartRef = useRef<TouchPoint | null>(null);
  const touchCurrentRef = useRef<TouchPoint | null>(null);
  const suppressClickRef = useRef(false);
  const suppressClickTimerRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );

  const activeImage = images[activeImageIndex];

  const changeImage = useCallback(
    (direction: 1 | -1) => {
      setActiveImageIndex((currentIndex) => {
        return (currentIndex + direction + images.length) % images.length;
      });
    },
    [images.length],
  );

  const closeLightbox = useCallback(() => {
    setIsLightboxOpen(false);
  }, []);

  useEffect(() => {
    if (!isLightboxOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    const focusReturnTarget = mainImageButtonRef.current;

    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        closeLightbox();
      } else if (event.key === "ArrowLeft") {
        event.preventDefault();
        changeImage(-1);
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        changeImage(1);
      } else if (event.key === "Tab") {
        const controls = lightboxRef.current?.querySelectorAll<HTMLButtonElement>(
          "button:not([disabled])",
        );

        if (!controls?.length) {
          return;
        }

        const firstControl = controls[0];
        const lastControl = controls[controls.length - 1];

        if (event.shiftKey && document.activeElement === firstControl) {
          event.preventDefault();
          lastControl.focus();
        } else if (!event.shiftKey && document.activeElement === lastControl) {
          event.preventDefault();
          firstControl.focus();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
      focusReturnTarget?.focus();
    };
  }, [changeImage, closeLightbox, isLightboxOpen]);

  useEffect(() => {
    return () => {
      if (suppressClickTimerRef.current) {
        clearTimeout(suppressClickTimerRef.current);
      }
    };
  }, []);

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

    if (!start || !current) {
      return;
    }

    const deltaX = current.x - start.x;
    const deltaY = current.y - start.y;
    const isHorizontalSwipe =
      Math.abs(deltaX) >= 52 && Math.abs(deltaX) > Math.abs(deltaY);

    if (!isHorizontalSwipe) {
      return;
    }

    suppressClickRef.current = true;

    if (suppressClickTimerRef.current) {
      clearTimeout(suppressClickTimerRef.current);
    }

    suppressClickTimerRef.current = setTimeout(() => {
      suppressClickRef.current = false;
    }, 400);

    changeImage(deltaX < 0 ? 1 : -1);
  };

  const handleLightboxClickCapture = (event: MouseEvent<HTMLDivElement>) => {
    if (!suppressClickRef.current) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();
    suppressClickRef.current = false;
  };

  return (
    <section className={styles.gallery} aria-label={`Фотографии объекта «${projectTitle}»`}>
      <div className={styles.mainImageFrame}>
        <button
          ref={mainImageButtonRef}
          type="button"
          className={styles.mainImageButton}
          onClick={() => setIsLightboxOpen(true)}
          aria-label={`Открыть фото: ${activeImage.alt}`}
        >
          <Image
            key={activeImage.src}
            src={activeImage.src}
            alt={activeImage.alt}
            fill
            sizes="(max-width: 767px) calc(100vw - 32px), (max-width: 1360px) calc(100vw - 80px), 1280px"
            className={styles.mainImage}
            preload={activeImageIndex === 0}
          />
        </button>

        <button
          type="button"
          className={`${styles.coverArrow} ${styles.coverArrowPrevious}`}
          onClick={() => changeImage(-1)}
          aria-label="Предыдущее фото в галерее"
        >
          <ArrowIcon direction="left" />
        </button>

        <button
          type="button"
          className={`${styles.coverArrow} ${styles.coverArrowNext}`}
          onClick={() => changeImage(1)}
          aria-label="Следующее фото в галерее"
        >
          <ArrowIcon />
        </button>
      </div>

      <div className={styles.thumbnails} role="group" aria-label="Выбор фотографии">
        {images.map((image, imageIndex) => (
          <button
            type="button"
            className={`${styles.thumbnailButton} ${
              imageIndex === activeImageIndex ? styles.thumbnailButtonActive : ""
            }`}
            onClick={() => setActiveImageIndex(imageIndex)}
            aria-label={`Показать фото ${imageIndex + 1}: ${image.alt}`}
            aria-pressed={imageIndex === activeImageIndex}
            key={image.src}
          >
            <Image
              src={image.src}
              alt=""
              fill
              sizes="(max-width: 767px) 96px, 140px"
              className={styles.thumbnailImage}
            />
          </button>
        ))}
      </div>

      {isLightboxOpen ? (
        <div
          ref={lightboxRef}
          className={styles.lightboxBackdrop}
          role="dialog"
          aria-modal="true"
          aria-label={`Фотографии объекта «${projectTitle}»`}
          onClick={(event) => {
            if (event.target === event.currentTarget) {
              closeLightbox();
            }
          }}
        >
          <div
            className={styles.lightboxContent}
            onClick={(event) => event.stopPropagation()}
          >
            <div className={styles.lightboxHeader}>
              <span>
                {projectTitle} · {activeImageIndex + 1} / {images.length}
              </span>
              <button
                ref={closeButtonRef}
                type="button"
                className={styles.lightboxClose}
                onClick={closeLightbox}
                aria-label="Закрыть просмотр фотографий"
              >
                <CloseIcon />
              </button>
            </div>

            <div
              className={styles.lightboxImageFrame}
              onClickCapture={handleLightboxClickCapture}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              onTouchCancel={resetTouch}
            >
              <Image
                key={activeImage.src}
                src={activeImage.src}
                alt={activeImage.alt}
                fill
                sizes="94vw"
                className={styles.lightboxImage}
              />

              <button
                type="button"
                className={`${styles.lightboxArrow} ${styles.lightboxArrowPrevious}`}
                onClick={() => changeImage(-1)}
                aria-label="Предыдущее фото"
              >
                <ArrowIcon direction="left" />
              </button>

              <button
                type="button"
                className={`${styles.lightboxArrow} ${styles.lightboxArrowNext}`}
                onClick={() => changeImage(1)}
                aria-label="Следующее фото"
              >
                <ArrowIcon />
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}
