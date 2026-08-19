import Image from "next/image";
import Link from "next/link";

import type { Project } from "@/types/projects";

import styles from "./DirectionProjects.module.css";

type DirectionProjectsProps = {
  title: string;
  projects: readonly Project[];
  allProjectsHref: string;
};

export function DirectionProjects({
  title,
  projects,
  allProjectsHref,
}: DirectionProjectsProps) {
  return (
    <section
      className={styles.section}
      id="postroennye-angary"
      aria-labelledby="direction-projects-title"
    >
      <div className="container">
        <div className={styles.heading}>
          <span className={styles.accent} aria-hidden="true" />
          <h2 id="direction-projects-title" className={styles.title}>
            {title}
          </h2>
        </div>

        <div className={styles.grid}>
          {projects.map((project) => {
            const cover = project.images[0];

            return (
              <Link
                href={`/proekty/${project.slug}`}
                className={styles.cardLink}
                aria-label={`${project.title}. Подробнее`}
                key={project.id}
              >
                <article className={styles.card}>
                  <div className={styles.media}>
                    <Image
                      src={cover.src}
                      alt={cover.alt}
                      fill
                      sizes="(max-width: 767px) calc(100vw - 32px), (max-width: 1360px) 50vw, 620px"
                      className={styles.image}
                    />
                  </div>

                  <div className={styles.content}>
                    <h3 className={styles.cardTitle}>{project.title}</h3>
                    <p className={styles.summary}>{project.summary}</p>

                    <dl
                      className={styles.details}
                      aria-label={`Характеристики объекта «${project.title}»`}
                    >
                      {project.details.slice(0, 3).map((detail) => (
                        <div className={styles.detail} key={detail.label}>
                          <dt>{detail.label}</dt>
                          <dd>{detail.value}</dd>
                        </div>
                      ))}
                    </dl>

                    <span className={styles.more} aria-hidden="true">
                      Подробнее <span>→</span>
                    </span>
                  </div>
                </article>
              </Link>
            );
          })}
        </div>

        <div className={styles.allProjectsRow}>
          <Link href={allProjectsHref} className={styles.allProjectsLink}>
            Все построенные объекты <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
