import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { PageIntro } from "@/components/layout/PageIntro";
import { ProjectGallery } from "@/components/projects/ProjectGallery";
import { projects } from "@/content/projects";

import styles from "./ProjectPage.module.css";

export const dynamicParams = false;

type ProjectPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

function getProject(slug: string) {
  const project = projects.find((entry) => entry.slug === slug);

  if (!project) {
    notFound();
  }

  return project;
}

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({
  params,
}: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);

  return {
    title: project.title,
    description: project.summary,
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = getProject(slug);
  const breadcrumbs = [
    { label: "Главная", href: "/" },
    { label: "Построенные объекты", href: "/proekty" },
    { label: project.title },
  ] as const;

  return (
    <main className={styles.page}>
      <Breadcrumbs items={breadcrumbs} />
      <PageIntro title={project.title} description={project.summary} />

      <div className={`container ${styles.content}`}>
        <ProjectGallery
          key={project.id}
          projectTitle={project.title}
          images={project.images}
        />

        <section
          className={styles.description}
          aria-labelledby="project-description-title"
        >
          <h2 id="project-description-title" className={styles.sectionTitle}>
            Описание проекта
          </h2>
          <p>{project.description}</p>
        </section>

        <section
          className={styles.characteristics}
          aria-labelledby="project-characteristics-title"
        >
          <h2 id="project-characteristics-title" className={styles.sectionTitle}>
            Характеристики объекта
          </h2>

          <dl className={styles.details}>
            {project.details.map((detail) => (
              <div className={styles.detail} key={detail.label}>
                <dt>{detail.label}</dt>
                <dd>{detail.value}</dd>
              </div>
            ))}
          </dl>
        </section>
      </div>
    </main>
  );
}
