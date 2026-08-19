import type { Metadata } from "next";

import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { PageIntro } from "@/components/layout/PageIntro";
import { ProjectsList } from "@/components/projects/ProjectsList";
import { projects } from "@/content/projects";

import styles from "./ProjectsPage.module.css";

export const metadata: Metadata = {
  title: "Построенные объекты",
  description:
    "Построенные объекты из металлоконструкций: ангары, промышленные здания и крановые системы.",
};

const breadcrumbs = [
  { label: "Главная", href: "/" },
  { label: "Построенные объекты" },
] as const;

export default function ProjectsPage() {
  return (
    <main className={styles.page}>
      <Breadcrumbs items={breadcrumbs} />
      <PageIntro
        title="Построенные объекты"
        description="Реализованные объекты АБАТ: здания из металлоконструкций, ангары, промышленные объекты и крановые системы."
      />
      <ProjectsList projects={projects} />
    </main>
  );
}
