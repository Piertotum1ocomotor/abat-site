import Image from "next/image";
import Link from "next/link";

import type { Project } from "@/types/projects";

import styles from "./ProjectsList.module.css";

type ProjectsListProps = {
  projects: readonly Project[];
};

export function ProjectsList({ projects }: ProjectsListProps) {
  return (
    <section className={styles.section} aria-label="Список построенных объектов">
      <div className={`container ${styles.list}`}>
        {projects.map((project, projectIndex) => {
          const cover = project.images[0];

          return (
            <Link
              href={`/proekty/${project.slug}`}
              className={styles.projectLink}
              aria-label={`${project.title}. Подробнее`}
              key={project.id}
            >
              <article className={styles.project}>
                <div className={styles.media}>
                  <Image
                    src={cover.src}
                    alt={cover.alt}
                    fill
                    sizes="(max-width: 767px) calc(100vw - 32px), (max-width: 1360px) 55vw, 720px"
                    className={styles.image}
                    preload={projectIndex === 0}
                  />
                </div>

                <div className={styles.content}>
                  <span className={styles.number} aria-hidden="true">
                    {project.number}
                  </span>

                  <div className={styles.projectInfo}>
                    <h2 className={styles.title}>{project.title}</h2>
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
                </div>
              </article>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
