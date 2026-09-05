import type { Metadata } from "next";
import Image from "next/image";

import { DirectionHero } from "@/components/directions/DirectionHero";
import { DirectionProjects } from "@/components/directions/DirectionProjects";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { ContactCTA } from "@/components/sections/ContactCTA";
import { projects } from "@/content/projects";
import type { Project } from "@/types/projects";

import styles from "./IndustrialBuildingsPage.module.css";

export const metadata: Metadata = {
  title: "Строительство промышленных зданий и производственных цехов",
  description:
    "Строительство промышленных и производственных зданий в Москве и Санкт-Петербурге. Проектирование, фундамент, металлоконструкции, монтаж и инженерные работы.",
};

const breadcrumbs = [
  { label: "Главная", href: "/" },
  { label: "Промышленные здания и производственные цеха" },
] as const;

const facts = [
  {
    title: "15 лет опыта",
    description: "Опыт работ с металлоизделиями и строительными конструкциями.",
  },
  {
    title: "Проектирование",
    description: "АР, КР, КМ, КМД и КЖ.",
  },
  {
    title: "Металлоконструкции",
    description: "Изготовление и монтаж металлических конструкций.",
  },
  {
    title: "Геодезическое сопровождение",
    description: "В составе проектных и строительных работ.",
  },
] as const;

const productionFactors = [
  {
    title: "Назначение объекта",
    description:
      "Конструктив и состав здания определяются с учётом будущего использования объекта.",
  },
  {
    title: "Габариты и планировка",
    description:
      "Размеры, пролёты и расположение основных зон определяются проектными решениями.",
  },
  {
    title: "Оборудование и проёмы",
    description:
      "При проектировании учитываются предоставленные исходные данные по размещению оборудования, воротам и необходимым проёмам.",
  },
  {
    title: "Инженерные системы",
    description:
      "Состав инженерного оснащения определяется проектом и согласованным комплексом работ.",
  },
] as const;

const buildingTypes = [
  "Отдельные производственные здания",
  "Производственные корпуса",
  "Производственные цеха",
  "Здания в составе промышленной площадки",
] as const;

const designInputs = [
  {
    title: "Назначение здания",
    description: "Будущее использование объекта и требования к его пространству.",
  },
  {
    title: "Размеры и конструктивная схема",
    description: "Габариты, пролёты и взаимное расположение основных зон.",
  },
  {
    title: "Исходные данные площадки",
    description: "Условия участка, необходимые для разработки проектных решений.",
  },
  {
    title: "Расположение оборудования",
    description:
      "Предоставленные заказчиком исходные данные по размещению оборудования.",
  },
  {
    title: "Ворота и проёмы",
    description:
      "Технологические и эксплуатационные проёмы, предусмотренные проектом.",
  },
  {
    title: "Инженерные системы",
    description: "Состав оснащения в рамках согласованного комплекса работ.",
  },
] as const;

const buildingSystem = [
  {
    title: "Фундамент",
    description:
      "Плита, сваи или ленточное основание — в соответствии с проектом.",
  },
  {
    title: "Металлический каркас",
    description:
      "Колонны, балки, фермы, рамы и другие предусмотренные проектом конструкции.",
  },
  {
    title: "Ограждающие конструкции",
    description:
      "Стены и кровля по проектному решению, включая применение сэндвич-панелей там, где это предусмотрено.",
  },
  {
    title: "Проёмы",
    description:
      "Окна и ворота располагаются в соответствии с проектом и эксплуатационной задачей.",
  },
  {
    title: "Инженерное оснащение",
    description: "В составе согласованного комплекса работ.",
  },
] as const;

const designSections = ["АР", "КР", "КМ", "КМД", "КЖ"] as const;

const industrialStructures = [
  "Подкрановые пути",
  "Крановые эстакады",
  "Металлические площадки",
  "Лестницы",
  "Опорные конструкции",
  "Рамы и каркасы для промышленного оборудования",
] as const;

const processSteps = [
  {
    title: "Исходные данные",
    description: "Назначение объекта, размеры и требования проекта.",
  },
  {
    title: "Проектирование",
    description: "Разработка необходимых проектных решений.",
  },
  {
    title: "Фундамент",
    description: "Устройство предусмотренного проектом основания.",
  },
  {
    title: "Металлические конструкции и контур",
    description: "Изготовление и монтаж каркаса, стен и кровли.",
  },
  {
    title: "Оснащение и завершение работ",
    description:
      "Проёмы, инженерные системы и другие предусмотренные проектом работы.",
  },
] as const;

const featuredProjectSlugs = [
  "promyshlennoe-zdanie-2880",
  "kranovyy-put-silovye-mashiny",
] as const;

function getFeaturedProject(
  slug: (typeof featuredProjectSlugs)[number],
): Project {
  const project = projects.find((entry) => entry.slug === slug);

  if (!project) {
    throw new Error(`Industrial direction project not found: ${slug}`);
  }

  return project;
}

const featuredProjects = featuredProjectSlugs.map(getFeaturedProject);

function SectionHeading({ id, children }: { id: string; children: string }) {
  return (
    <div className={styles.sectionHeading}>
      <span className={styles.headingAccent} aria-hidden="true" />
      <h2 id={id} className={styles.sectionTitle}>
        {children}
      </h2>
    </div>
  );
}

export default function IndustrialBuildingsPage() {
  return (
    <main className={styles.page}>
      <Breadcrumbs items={breadcrumbs} />

      <DirectionHero
        eyebrow="Промышленное строительство"
        title="Строительство промышленных зданий и производственных цехов"
        compactTitle
        lead="Проектируем и строим промышленные и производственные здания с учётом назначения объекта, конструктивной схемы и требований проекта. Выполняем фундамент, изготовление и монтаж металлоконструкций, ограждающие конструкции и инженерные работы в составе согласованного комплекса."
        image={{
          src: "/images/projects/promyshlennoe-zdanie-2880/01.webp",
          alt: "Металлический каркас строящегося промышленного здания",
          width: 1600,
          height: 1200,
        }}
        cta={{ label: "Обсудить проект", href: "#contacts" }}
      />

      <section className={styles.factsSection} aria-label="Ключевые компетенции">
        <div className={`container ${styles.factsGrid}`}>
          {facts.map((fact, index) => (
            <article className={styles.fact} key={fact.title}>
              <span className={styles.factNumber} aria-hidden="true">
                {index + 1}
              </span>
              <strong className={styles.factTitle}>{fact.title}</strong>
              <p className={styles.factDescription}>{fact.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.section} aria-labelledby="production-task-title">
        <div className="container">
          <div className={styles.taskPanel}>
            <div className={styles.taskIntro}>
              <span className={styles.taskLabel}>Основа проектного решения</span>
              <h2 id="production-task-title">Здание под задачу производства</h2>
              <p>
                Решение промышленного или производственного здания формируется
                вокруг его назначения и требований к будущей эксплуатации.
              </p>
            </div>

            <ol className={styles.taskFactors}>
              {productionFactors.map((factor, index) => (
                <li key={factor.title}>
                  <span aria-hidden="true">{index + 1}</span>
                  <div>
                    <h3>{factor.title}</h3>
                    <p>{factor.description}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <section className={styles.section} aria-labelledby="building-types-title">
        <div className="container">
          <SectionHeading id="building-types-title">
            Производственные корпуса и цеха
          </SectionHeading>

          <div className={styles.buildingLayout}>
            <div className={styles.buildingMedia}>
              <Image
                src="/images/projects/promyshlennoe-zdanie-2880/06.webp"
                alt="Внутреннее пространство строящегося промышленного здания"
                fill
                sizes="(max-width: 899px) calc(100vw - 32px), 48vw"
                className={styles.buildingImage}
              />
            </div>

            <div className={styles.buildingContent}>
              <p>
                Металлокаркасная конструктивная схема может применяться для
                отдельных производственных зданий, корпусов и цехов, а также для
                зданий в составе более крупной промышленной площадки.
              </p>
              <p>
                Состав каждого объекта определяется проектом: от габаритов и
                несущей схемы до наружного контура, проёмов и предусмотренного
                инженерного оснащения.
              </p>

              <ul className={styles.buildingTypes}>
                {buildingTypes.map((type) => (
                  <li key={type}>{type}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.section} aria-labelledby="design-inputs-title">
        <div className="container">
          <SectionHeading id="design-inputs-title">
            Что учитывается при проектировании
          </SectionHeading>

          <ol className={styles.inputGrid}>
            {designInputs.map((input, index) => (
              <li key={input.title}>
                <span aria-hidden="true">{index + 1}</span>
                <h3>{input.title}</h3>
                <p>{input.description}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className={styles.section} aria-labelledby="structure-title">
        <div className="container">
          <SectionHeading id="structure-title">
            Конструктив промышленного здания
          </SectionHeading>

          <ol className={styles.systemGrid}>
            {buildingSystem.map((element, index) => (
              <li key={element.title}>
                <span aria-hidden="true">{index + 1}</span>
                <h3>{element.title}</h3>
                <p>{element.description}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className={styles.section} aria-labelledby="industrial-design-title">
        <div className="container">
          <SectionHeading id="industrial-design-title">
            Проектирование промышленных зданий
          </SectionHeading>

          <div className={styles.designPanel}>
            <div className={styles.designCopy}>
              <p>
                Проектные решения разрабатываются с учётом назначения объекта,
                конструктивной схемы, исходных данных площадки и требований к
                будущей эксплуатации здания.
              </p>
              <p>
                Выполняем разработку разделов АР, КР, КМ, КМД и КЖ, а также
                геодезическое сопровождение.
              </p>
            </div>

            <ul className={styles.designCodes} aria-label="Разделы проекта">
              {designSections.map((section) => (
                <li key={section}>{section}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className={styles.section} aria-labelledby="industrial-structures-title">
        <div className="container">
          <SectionHeading id="industrial-structures-title">
            Промышленные металлоконструкции
          </SectionHeading>

          <div className={styles.structuresLayout}>
            <div className={styles.structuresContent}>
              <p>
                В зависимости от задачи проекта могут применяться отдельные
                промышленные металлоконструкции. У АБАТ есть опыт работ со
                следующими видами конструкций:
              </p>

              <ul className={styles.structuresList}>
                {industrialStructures.map((structure) => (
                  <li key={structure}>{structure}</li>
                ))}
              </ul>
            </div>

            <div className={styles.structuresMedia}>
              <Image
                src="/images/projects/kranovyy-put-silovye-mashiny/02.webp"
                alt="Конструкции кранового пути в производственном помещении"
                fill
                sizes="(max-width: 899px) calc(100vw - 32px), 46vw"
                className={styles.structuresImage}
              />
            </div>
          </div>
        </div>
      </section>

      <section className={styles.section} aria-labelledby="process-title">
        <div className="container">
          <SectionHeading id="process-title">
            От исходных данных до завершения работ
          </SectionHeading>

          <ol className={styles.processFlow}>
            {processSteps.map((step, index) => (
              <li key={step.title}>
                <span className={styles.processNumber} aria-hidden="true">
                  {index + 1}
                </span>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <DirectionProjects
        title="Реализованные промышленные объекты"
        projects={featuredProjects}
        allProjectsHref="/proekty"
        sectionId="realizovannye-promyshlennye-obekty"
      />

      <ContactCTA />
    </main>
  );
}
