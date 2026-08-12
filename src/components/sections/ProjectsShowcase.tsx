"use client";

import Image from "next/image";
import Link from "next/link";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type TouchEvent,
} from "react";

import type { ProjectsShowcaseContent } from "@/types/home";

import styles from "./ProjectsShowcase.module.css";

type ProjectsShowcaseProps = {
  content: ProjectsShowcaseContent;
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

export function ProjectsShowcase({ content }: ProjectsShowcaseProps) {
  const [activeProjectIndex, setActiveProjectIndex] = useState(0);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const touchStartRef = useRef<TouchPoint | null>(null);
  const touchCurrentRef = useRef<TouchPoint | null>(null);
  const suppressClickRef = useRef(false);
  const suppressClickTimerRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );
  const mainImageButtonRef = useRef<HTMLButtonElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const focusReturnRef = useRef<HTMLElement | null>(null);

  const activeProject = content.projects[activeProjectIndex];
  const activeImage = activeProject.images[activeImageIndex];

  const changeProject = useCallback(
    (direction: 1 | -1) => {
      setActiveProjectIndex((currentIndex) => {
        const projectCount = content.projects.length;
        return (currentIndex + direction + projectCount) % projectCount;
      });
      setActiveImageIndex(0);
      setIsLightboxOpen(false);
    },
    [content.projects.length],
  );

  const changeLightboxImage = useCallback(
    (direction: 1 | -1) => {
      setActiveImageIndex((currentIndex) => {
        const imageCount = activeProject.images.length;
        return (currentIndex + direction + imageCount) % imageCount;
      });
    },
    [activeProject.images.length],
  );

  const openLightbox = () => {
    if (suppressClickRef.current) {
      suppressClickRef.current = false;
      return;
    }

    focusReturnRef.current = mainImageButtonRef.current;
    setIsLightboxOpen(true);
  };

  const closeLightbox = useCallback(() => {
    setIsLightboxOpen(false);
  }, []);

  useEffect(() => {
    if (!isLightboxOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeLightbox();
      } else if (event.key === "ArrowLeft") {
        changeLightboxImage(-1);
      } else if (event.key === "ArrowRight") {
        changeLightboxImage(1);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
      focusReturnRef.current?.focus();
    };
  }, [changeLightboxImage, closeLightbox, isLightboxOpen]);

  useEffect(() => {
    return () => {
      if (suppressClickTimerRef.current) {
        clearTimeout(suppressClickTimerRef.current);
      }
    };
  }, []);

  const handleTouchStart = (event: TouchEvent<HTMLButtonElement>) => {
    const touch = event.touches[0];

    touchStartRef.current = { x: touch.clientX, y: touch.clientY };
    touchCurrentRef.current = { x: touch.clientX, y: touch.clientY };
  };

  const handleTouchMove = (event: TouchEvent<HTMLButtonElement>) => {
    const touch = event.touches[0];

    touchCurrentRef.current = { x: touch.clientX, y: touch.clientY };
  };

  const handleTouchEnd = () => {
    const start = touchStartRef.current;
    const current = touchCurrentRef.current;

    touchStartRef.current = null;
    touchCurrentRef.current = null;

    if (!start || !current) {
      return;
    }

    const deltaX = current.x - start.x;
    const deltaY = current.y - start.y;
    const isHorizontalSwipe =
      Math.abs(deltaX) >= 52 && Math.abs(deltaX) > Math.abs(deltaY) * 1.25;

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

    changeProject(deltaX < 0 ? 1 : -1);
  };

  return (
    <section className={styles.section} aria-labelledby="projects-showcase-title">
      <div className="container">
        <div className={styles.heading}>
          <span className={styles.headingAccent} aria-hidden="true" />
          <h2 id="projects-showcase-title" className={styles.title}>
            {content.title}
          </h2>
        </div>

        <article className={styles.showcase} data-project-id={activeProject.id}>
          <div className={styles.infoPanel}>
            <div className={styles.numberRow}>
              <span className={styles.projectNumber}>{activeProject.number}</span>
              <span className={styles.progress}>
                {activeProject.number} /{" "}
                {String(content.projects.length).padStart(2, "0")}
              </span>
            </div>

            <div className={styles.projectDetails}>
              <h3 className={styles.projectTitle}>{activeProject.title}</h3>

              <div className={styles.meta}>
                <span>{activeProject.location}</span>
                <strong>{activeProject.area}</strong>
              </div>

              <ul className={styles.works} aria-label="Выполненные работы">
                {activeProject.works.map((work) => (
                  <li key={work}>{work}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className={styles.mediaPanel}>
            <button
              ref={mainImageButtonRef}
              type="button"
              className={styles.mainImageButton}
              onClick={openLightbox}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              onTouchCancel={() => {
                touchStartRef.current = null;
                touchCurrentRef.current = null;
              }}
              aria-label={`Открыть фото объекта «${activeProject.title}»`}
            >
              <Image
                key={activeImage.src}
                src={activeImage.src}
                alt={activeImage.alt}
                fill
                sizes="(max-width: 767px) calc(100vw - 32px), (max-width: 1199px) 60vw, 68vw"
                className={styles.mainImage}
                preload={activeProjectIndex === 0 && activeImageIndex === 0}
              />
            </button>

            <button
              type="button"
              className={styles.nextProjectButton}
              onClick={() => changeProject(1)}
              aria-label="Следующий объект"
            >
              <ArrowIcon />
            </button>

            <div
              className={styles.thumbnails}
              role="group"
              aria-label="Фотографии объекта"
            >
              {activeProject.images.map((image, imageIndex) => (
                <button
                  type="button"
                  className={`${styles.thumbnailButton} ${
                    imageIndex === activeImageIndex
                      ? styles.thumbnailButtonActive
                      : ""
                  }`}
                  onClick={() => setActiveImageIndex(imageIndex)}
                  aria-label={`Показать фото ${imageIndex + 1} объекта «${activeProject.title}»`}
                  aria-pressed={imageIndex === activeImageIndex}
                  key={image.src}
                >
                  <Image
                    src={image.src}
                    alt=""
                    fill
                    sizes="96px"
                    className={styles.thumbnailImage}
                  />
                </button>
              ))}
            </div>
          </div>
        </article>

        <div className={styles.allProjectsRow}>
          <Link href={content.allProjectsHref} className={styles.allProjectsLink}>
            <span>Все построенные объекты</span>
            <ArrowIcon />
          </Link>
        </div>
      </div>

      {isLightboxOpen ? (
        <div
          className={styles.lightboxBackdrop}
          role="dialog"
          aria-modal="true"
          aria-label={`Фотографии объекта «${activeProject.title}»`}
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
                {activeProject.title} · {activeImageIndex + 1} /{" "}
                {activeProject.images.length}
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

            <div className={styles.lightboxImageFrame}>
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
                onClick={() => changeLightboxImage(-1)}
                aria-label="Предыдущее фото"
              >
                <ArrowIcon direction="left" />
              </button>

              <button
                type="button"
                className={`${styles.lightboxArrow} ${styles.lightboxArrowNext}`}
                onClick={() => changeLightboxImage(1)}
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
