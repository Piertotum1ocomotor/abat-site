import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { DirectionProjects } from "@/components/directions/DirectionProjects";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { ContactCTA } from "@/components/sections/ContactCTA";
import { ServiceHero } from "@/components/services/ServiceHero";
import { projects } from "@/content/projects";
import type { Project } from "@/types/projects";

import styles from "./InstallationServicePage.module.css";

export const metadata: Metadata = {
  title: "Монтаж металлоконструкций и металлических каркасов",
  description:
    "Монтаж металлоконструкций и металлических каркасов зданий в Москве и Санкт-Петербурге. Монтаж колонн, балок, ферм и других элементов конструкций.",
};

const frameElements = [
  { code: "01", title: "Колонны", description: "Вертикальная основа металлического каркаса." },
  { code: "02", title: "Балки", description: "Горизонтальные элементы несущей системы." },
  { code: "03", title: "Фермы", description: "Конструкции, перекрывающие проектные пролёты." },
  { code: "04", title: "Рамы", description: "Части принятой конструктивной схемы." },
  { code: "05", title: "Связи", description: "Элементы пространственной работы каркаса." },
] as const;

const assemblySteps = [
  { title: "Подготовка", description: "Проверка готовности основания, конструкций и исходной документации." },
  { title: "Установка колонн", description: "Монтаж вертикальных элементов каркаса в проектное положение." },
  { title: "Монтаж балок и ферм", description: "Последовательная сборка горизонтальных и пролётных элементов." },
  { title: "Связи и элементы каркаса", description: "Формирование предусмотренной проектом пространственной системы." },
  { title: "Готовый каркас", description: "Подготовка несущей системы к следующим согласованным работам." },
] as const;

const directions = [
  { label: "Промышленные здания", href: "/promyshlennye-zdaniya-i-proizvodstvennye-ceha" },
  { label: "Здания из металлоконструкций", href: "/zdaniya-iz-metallokonstrukciy" },
  { label: "Склады", href: "/stroitelstvo-skladov" },
  { label: "Ангары", href: "/stroitelstvo-angarov" },
  { label: "Быстровозводимые здания", href: "/bystrovozvodimye-zdaniya" },
] as const;

const featuredProjectSlugs = [
  "promyshlennoe-zdanie-2880",
  "zdanie-stolovoy-s-ofisami",
] as const;

function getProject(slug: (typeof featuredProjectSlugs)[number]): Project {
  const project = projects.find((item) => item.slug === slug);
  if (!project) throw new Error(`Installation service project not found: ${slug}`);
  return project;
}

const featuredProjects = featuredProjectSlugs.map(getProject);

export default function InstallationServicePage() {
  return (
    <main className={styles.page}>
      <Breadcrumbs
        items={[
          { label: "Главная", href: "/" },
          { label: "Услуги", href: "/uslugi" },
          { label: "Монтаж металлоконструкций" },
        ]}
      />

      <ServiceHero
        eyebrow="Сборка несущей системы"
        title="Монтаж металлоконструкций"
        lead="Монтируем колонны, балки, фермы, рамы, связи и другие элементы металлических конструкций. Последовательность сборки определяется проектной документацией и условиями объекта."
        image={{
          src: "/images/services/montazh-metallokonstrukciy/hero.webp",
          alt: "Подъём металлической фермы краном между установленными колоннами",
        }}
        note="Металлические каркасы зданий · отдельные промышленные конструкции"
      />

      <section className={styles.systemSection} aria-labelledby="system-title">
        <div className={`container ${styles.systemLayout}`}>
          <div className={styles.systemIntro}>
            <span className={styles.accent} aria-hidden="true" />
            <h2 id="system-title">Что монтируем</h2>
            <p>
              Отдельные элементы собираются в единую конструктивную систему в
              соответствии с проектом.
            </p>
            <Link href="/uslugi/izgotovlenie-metallokonstrukciy">
              Изготовление металлоконструкций <span aria-hidden="true">→</span>
            </Link>
          </div>
          <div className={styles.frameRegister}>
            {frameElements.map((element) => (
              <article key={element.title}>
                <span>{element.code}</span>
                <h3>{element.title}</h3>
                <p>{element.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.assemblySection} aria-labelledby="assembly-title">
        <div className="container">
          <div className={styles.assemblyHeading}>
            <span>Последовательность монтажа</span>
            <h2 id="assembly-title">Сборка металлического каркаса</h2>
          </div>
          <ol className={styles.assemblyFlow}>
            {assemblySteps.map((step, index) => (
              <li key={step.title}>
                <span className={styles.stepNumber}>
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className={styles.siteSection} aria-labelledby="site-title">
        <div className="container">
          <div className={styles.siteHeading}>
            <span className={styles.accent} aria-hidden="true" />
            <h2 id="site-title">Монтаж на строительной площадке</h2>
          </div>
          <div className={styles.siteGrid}>
            <figure className={styles.columnFigure}>
              <div className={styles.siteMedia}>
                <Image
                  src="/images/services/montazh-metallokonstrukciy/steel-column-installation.webp"
                  alt="Установка стальной колонны на подготовленное бетонное основание"
                  fill
                  sizes="(max-width: 767px) calc(100vw - 32px), 48vw"
                  className={styles.image}
                />
              </div>
              <figcaption>
                <strong>Вертикальные элементы</strong>
                <span>Установка колонн формирует начальную геометрию каркаса.</span>
              </figcaption>
            </figure>
            <figure className={styles.frameFigure}>
              <div className={styles.siteMedia}>
                <Image
                  src="/images/services/montazh-metallokonstrukciy/frame-assembly.webp"
                  alt="Монтажники работают на балках собираемого металлического каркаса"
                  fill
                  sizes="(max-width: 767px) calc(100vw - 32px), 48vw"
                  className={styles.image}
                />
              </div>
              <figcaption>
                <strong>Сборка каркаса</strong>
                <span>Балки, фермы и связи объединяют элементы в несущую систему.</span>
              </figcaption>
            </figure>
          </div>
        </div>
      </section>

      <section className={styles.executionSection} aria-labelledby="execution-title">
        <div className={`container ${styles.executionLayout}`}>
          <div className={styles.executionLead}>
            <span>Профессиональное выполнение</span>
            <h2 id="execution-title">Работа с металлическими конструкциями</h2>
          </div>
          <div className={styles.executionFacts}>
            <p>
              <strong>15 лет</strong>
              <span>опыта работы с металлоизделиями и конструкциями</span>
            </p>
            <p>
              <strong>НАКС</strong>
              <span>сварщики с удостоверениями НАКС</span>
            </p>
          </div>
        </div>
      </section>

      <section className={styles.applicationsSection} aria-labelledby="applications-title">
        <div className="container">
          <div className={styles.applicationsHeading}>
            <span className={styles.accent} aria-hidden="true" />
            <div>
              <h2 id="applications-title">Где применяется монтаж</h2>
              <p>Связанные направления строительства и типы объектов.</p>
            </div>
          </div>
          <div className={styles.directionLinks}>
            {directions.map((direction, index) => (
              <Link href={direction.href} key={direction.href}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <strong>{direction.label}</strong>
                <span aria-hidden="true">↗</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <DirectionProjects
        title="Примеры реализованных объектов"
        projects={featuredProjects}
        allProjectsHref="/proekty"
        sectionId="primery-realizovannyh-obektov"
      />
      <ContactCTA />
    </main>
  );
}
