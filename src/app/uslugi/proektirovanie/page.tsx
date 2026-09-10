import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { DirectionProjects } from "@/components/directions/DirectionProjects";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { ContactCTA } from "@/components/sections/ContactCTA";
import { ServiceHero } from "@/components/services/ServiceHero";
import { projects } from "@/content/projects";
import type { Project } from "@/types/projects";

import styles from "./DesignServicePage.module.css";

export const metadata: Metadata = {
  title: "Проектирование промышленных зданий и металлоконструкций",
  description:
    "Проектирование промышленных и производственных зданий, складов, ангаров и металлоконструкций в Москве и Санкт-Петербурге. Разработка АР, КР, КМ, КМД и КЖ.",
};

const designObjects = [
  {
    title: "Промышленные здания",
    href: "/promyshlennye-zdaniya-i-proizvodstvennye-ceha",
  },
  {
    title: "Производственные здания",
    href: "/promyshlennye-zdaniya-i-proizvodstvennye-ceha",
  },
  { title: "Склады", href: "/stroitelstvo-skladov" },
  { title: "Ангары", href: "/stroitelstvo-angarov" },
  {
    title: "Быстровозводимые здания",
    href: "/bystrovozvodimye-zdaniya",
  },
  {
    title: "Металлические каркасы",
    href: "/zdaniya-iz-metallokonstrukciy",
  },
] as const;

const disciplines = [
  {
    code: "АР",
    title: "Архитектурные решения",
    description: "Планировочная и архитектурная организация объекта.",
  },
  {
    code: "КР",
    title: "Конструктивные решения",
    description: "Общие конструктивные решения здания и его элементов.",
  },
  {
    code: "КМ",
    title: "Металлические конструкции",
    description: "Решения по несущим металлическим конструкциям.",
  },
  {
    code: "КМД",
    title: "Деталировочные чертежи",
    description: "Документация для изготовления металлических конструкций.",
  },
  {
    code: "КЖ",
    title: "Железобетонные конструкции",
    description: "Решения по железобетонным элементам объекта.",
  },
] as const;

const workflow = [
  {
    title: "Задача и исходные данные",
    description: "Уточняем назначение объекта, размеры и исходные требования.",
  },
  {
    title: "Разработка решений",
    description: "Формируем взаимосвязанные архитектурные и конструктивные решения.",
  },
  {
    title: "Документация",
    description: "Разрабатываем согласованный состав проектной и рабочей документации.",
  },
  {
    title: "Уточнения",
    description: "Вносим необходимые уточнения по исходным данным и принятым решениям.",
  },
  {
    title: "Передача",
    description: "Передаём подготовленный комплект документации для следующих этапов.",
  },
] as const;

const featuredProjectSlugs = [
  "promyshlennoe-zdanie-2880",
  "kranovaya-estakada-5-tonn",
] as const;

function getProject(slug: (typeof featuredProjectSlugs)[number]): Project {
  const project = projects.find((item) => item.slug === slug);
  if (!project) throw new Error(`Design service project not found: ${slug}`);
  return project;
}

const featuredProjects = featuredProjectSlugs.map(getProject);

export default function DesignServicePage() {
  return (
    <main className={styles.page}>
      <Breadcrumbs
        items={[
          { label: "Главная", href: "/" },
          { label: "Услуги", href: "/uslugi" },
          { label: "Проектирование" },
        ]}
      />

      <ServiceHero
        eyebrow="Инженерные решения"
        title="Проектирование промышленных зданий и металлоконструкций"
        compactTitle
        lead="Разрабатываем проектные решения для промышленных, производственных, складских и других зданий. Состав документации определяется задачей и исходными данными объекта."
        image={{
          src: "/images/services/proektirovanie/hero.webp",
          alt: "Специалист с проектными чертежами на площадке строящегося металлического каркаса",
        }}
        note="Разделы АР, КР, КМ, КМД и КЖ · геодезическое сопровождение"
      />

      <section className={styles.scopeSection} aria-labelledby="scope-title">
        <div className={`container ${styles.scopeLayout}`}>
          <div className={styles.scopeIntro}>
            <span className={styles.accent} aria-hidden="true" />
            <h2 id="scope-title">Что проектируем</h2>
            <p>
              Проектирование связывает назначение объекта, конструктивную схему
              и требования к последующим работам.
            </p>
          </div>
          <div className={styles.objectRegister}>
            {designObjects.map((item, index) => (
              <Link href={item.href} key={`${item.title}-${index}`}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <strong>{item.title}</strong>
                <span aria-hidden="true">→</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.disciplinesSection} aria-labelledby="disciplines-title">
        <div className="container">
          <div className={styles.darkHeading}>
            <span>Состав документации</span>
            <h2 id="disciplines-title">Разделы проектирования</h2>
          </div>
          <div className={styles.disciplineGrid}>
            {disciplines.map((discipline) => (
              <article key={discipline.code}>
                <span className={styles.disciplineCode}>{discipline.code}</span>
                <h3>{discipline.title}</h3>
                <p>{discipline.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.documentationSection} aria-labelledby="documentation-title">
        <div className={`container ${styles.documentationLayout}`}>
          <div className={styles.documentationMedia}>
            <Image
              src="/images/services/proektirovanie/engineering-documentation.webp"
              alt="Специалисты рассматривают чертежи металлического каркаса за рабочим столом"
              fill
              sizes="(max-width: 899px) calc(100vw - 32px), 58vw"
              className={styles.image}
            />
          </div>
          <div className={styles.documentationCopy}>
            <span className={styles.kicker}>Рабочая основа</span>
            <h2 id="documentation-title">Документация для следующих этапов</h2>
            <p>
              Проектные решения становятся основой для изготовления и монтажа.
              В документации согласуются геометрия, состав конструкций и их
              взаимосвязь в составе объекта.
            </p>
            <Link href="/uslugi/izgotovlenie-metallokonstrukciy">
              Перейти к изготовлению <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </section>

      <section className={styles.geodesySection} aria-labelledby="geodesy-title">
        <div className={`container ${styles.geodesyLayout}`}>
          <div className={styles.geodesyCopy}>
            <span className={styles.accent} aria-hidden="true" />
            <h2 id="geodesy-title">Геодезическое сопровождение</h2>
            <p>
              Геодезические работы применяются там, где они необходимы для
              подготовки исходных данных и сопровождения проектных и
              строительных решений.
            </p>
          </div>
          <div className={styles.geodesyMedia}>
            <Image
              src="/images/services/proektirovanie/geodetic-survey.webp"
              alt="Геодезист выполняет измерения рядом со строящимся металлическим каркасом"
              fill
              sizes="(max-width: 899px) calc(100vw - 32px), 54vw"
              className={styles.image}
            />
          </div>
        </div>
      </section>

      <section className={styles.workflowSection} aria-labelledby="workflow-title">
        <div className="container">
          <div className={styles.workflowHeading}>
            <span className={styles.accent} aria-hidden="true" />
            <h2 id="workflow-title">Как мы работаем</h2>
          </div>
          <ol className={styles.workflow}>
            {workflow.map((step, index) => (
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
