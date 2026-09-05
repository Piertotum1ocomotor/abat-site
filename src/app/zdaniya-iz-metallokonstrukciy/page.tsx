import type { Metadata } from "next";
import Image from "next/image";

import { DirectionHero } from "@/components/directions/DirectionHero";
import { DirectionProjects } from "@/components/directions/DirectionProjects";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { ContactCTA } from "@/components/sections/ContactCTA";
import { projects } from "@/content/projects";
import type { Project } from "@/types/projects";

import styles from "./MetalBuildingsPage.module.css";

export const metadata: Metadata = {
  title: "Строительство зданий из металлоконструкций",
  description:
    "Строительство зданий из металлоконструкций в Москве и Санкт-Петербурге. Проектирование, изготовление и монтаж металлических каркасов и ограждающих конструкций.",
};

const breadcrumbs = [
  { label: "Главная", href: "/" },
  { label: "Здания из металлоконструкций" },
] as const;

const facts = [
  {
    title: "15 лет опыта",
    description: "Опыт работ с металлоизделиями.",
  },
  {
    title: "Сварщики с удостоверениями НАКС",
  },
  {
    title: "Проектирование",
    description: "АР, КР, КМ, КМД и КЖ.",
  },
  {
    title: "Изготовление и монтаж",
    description: "Металлических конструкций и каркасов.",
  },
] as const;

const frameElements = [
  {
    code: "A",
    title: "Колонны",
    description: "Вертикальные несущие элементы металлического каркаса.",
  },
  {
    code: "B",
    title: "Фермы",
    description:
      "Конструкции, применяемые для перекрытия пролётов в соответствии с проектной схемой.",
  },
  {
    code: "C",
    title: "Балки и ригели",
    description:
      "Горизонтальные элементы каркаса, предусмотренные проектным решением.",
  },
  {
    code: "D",
    title: "Рамы",
    description:
      "Металлические конструкции, формирующие несущую схему отдельных зданий и сооружений.",
  },
] as const;

const applications = [
  "Промышленные здания",
  "Производственные здания",
  "Склады",
  "Ангары",
  "Быстровозводимые здания",
  "СТО и автомобильные боксы",
] as const;

const industrialStructures = [
  "Подкрановые пути",
  "Эстакады",
  "Площадки",
  "Лестницы",
  "Опорные конструкции",
  "Рамы из профильных труб",
] as const;

const envelopeElements = ["Стены", "Кровля", "Окна", "Ворота"] as const;

const designSections = ["АР", "КР", "КМ", "КМД", "КЖ"] as const;

const processSteps = [
  {
    title: "Проектное решение",
    description:
      "Определяются назначение объекта, конструктивная схема и состав проектной документации.",
  },
  {
    title: "Фундамент и подготовка основания",
    description:
      "Основание подготавливается в соответствии с принятым проектным решением.",
  },
  {
    title: "Изготовление металлоконструкций",
    description:
      "Элементы каркаса изготавливаются по разработанной документации.",
  },
  {
    title: "Монтаж металлического каркаса",
    description:
      "Колонны, фермы, балки и другие элементы собираются в несущую систему здания.",
  },
  {
    title: "Ограждающие конструкции и оснащение",
    description:
      "Выполняются предусмотренные проектом стены, кровля и согласованная комплектация.",
  },
] as const;

const featuredProjectSlugs = [
  "promyshlennoe-zdanie-2880",
  "kranovaya-estakada-5-tonn",
] as const;

function getFeaturedProject(
  slug: (typeof featuredProjectSlugs)[number],
): Project {
  const project = projects.find((entry) => entry.slug === slug);

  if (!project) {
    throw new Error(`Metal buildings direction project not found: ${slug}`);
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

export default function MetalBuildingsPage() {
  return (
    <main className={styles.page}>
      <Breadcrumbs items={breadcrumbs} />

      <DirectionHero
        eyebrow="Металлические конструкции"
        title="Строительство зданий из металлоконструкций"
        compactTitle
        lead="Проектируем, изготавливаем и монтируем металлические каркасы для промышленных, производственных, складских и других зданий. Конструктив здания, фундамент и ограждающие элементы определяются проектом и назначением объекта."
        image={{
          src: "/images/projects/promyshlennoe-zdanie-2880/04.webp",
          alt: "Фермы, балки и колонны металлического каркаса здания",
          width: 1440,
          height: 1920,
        }}
        cta={{ label: "Обсудить проект", href: "#contacts" }}
      />

      <section className={styles.factsSection} aria-label="Технические факты">
        <div className={`container ${styles.factsGrid}`}>
          {facts.map((fact, index) => (
            <article className={styles.fact} key={fact.title}>
              <span className={styles.factNumber} aria-hidden="true">
                {index + 1}
              </span>
              <strong className={styles.factTitle}>{fact.title}</strong>
              {"description" in fact ? (
                <p className={styles.factDescription}>{fact.description}</p>
              ) : null}
            </article>
          ))}
        </div>
      </section>

      <section className={styles.section} aria-labelledby="metal-frame-title">
        <div className="container">
          <SectionHeading id="metal-frame-title">
            Металлический каркас здания
          </SectionHeading>

          <div className={styles.frameScheme}>
            <div className={styles.frameMedia}>
              <Image
                src="/images/projects/promyshlennoe-zdanie-2880/01.webp"
                alt="Монтаж металлического каркаса промышленного здания"
                fill
                sizes="(max-width: 1360px) calc(100vw - 32px), 1280px"
                className={styles.frameImage}
              />
              <span className={styles.mediaLabel}>Несущая система</span>
            </div>

            <ol className={styles.frameLegend}>
              {frameElements.map((element) => (
                <li className={styles.frameElement} key={element.code}>
                  <span className={styles.elementCode} aria-hidden="true">
                    {element.code}
                  </span>
                  <h3>{element.title}</h3>
                  <p>{element.description}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <section className={styles.section} aria-labelledby="applications-title">
        <div className="container">
          <div className={styles.applicationsLayout}>
            <div className={styles.applicationsIntro}>
              <SectionHeading id="applications-title">
                Какие здания строят на металлокаркасе
              </SectionHeading>
              <p>
                Металлический каркас применяется в зданиях разного назначения.
                Конструктивная схема, состав элементов и ограждающие конструкции
                подбираются для конкретного объекта.
              </p>
            </div>

            <ul className={styles.applicationGrid}>
              {applications.map((application, index) => (
                <li key={application}>
                  <span aria-hidden="true">{index + 1}</span>
                  {application}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className={styles.section} aria-labelledby="fabrication-title">
        <div className="container">
          <SectionHeading id="fabrication-title">
            Изготовление и монтаж металлоконструкций
          </SectionHeading>

          <div className={styles.fabricationLayout}>
            <div className={styles.fabricationMedia}>
              <Image
                src="/images/projects/kranovaya-estakada-5-tonn/03.webp"
                alt="Металлические конструкции крановой эстакады"
                fill
                sizes="(max-width: 899px) calc(100vw - 32px), 46vw"
                className={styles.fabricationImage}
              />
            </div>

            <div className={styles.fabricationContent}>
              <div className={styles.fabricationCopy}>
                <p>
                  Металлические конструкции изготавливаются по проектной
                  документации и монтируются на подготовленном основании. В
                  зависимости от объекта в состав каркаса входят колонны, фермы,
                  балки, рамы и другие элементы.
                </p>
                <p>
                  Компания выполняет изготовление и монтаж металлических
                  каркасов, а также отдельные промышленные металлоконструкции и
                  элементы строительных сооружений.
                </p>
              </div>

              <div className={styles.capabilityRegister}>
                <span className={styles.registerTitle}>Отдельные конструкции</span>
                <ul>
                  {industrialStructures.map((structure) => (
                    <li key={structure}>{structure}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.section} aria-labelledby="envelope-title">
        <div className="container">
          <div className={styles.envelopeLayout}>
            <div className={styles.envelopeContent}>
              <SectionHeading id="envelope-title">
                Ограждающие конструкции здания
              </SectionHeading>
              <p>
                После монтажа металлического каркаса выполняются предусмотренные
                проектом ограждающие конструкции. Для стен и кровли могут
                применяться сэндвич-панели.
              </p>

              <ul className={styles.envelopeList}>
                {envelopeElements.map((element, index) => (
                  <li key={element}>
                    <span aria-hidden="true">{index + 1}</span>
                    {element}
                  </li>
                ))}
              </ul>
            </div>

            <div className={styles.envelopeMedia}>
              <Image
                src="/images/projects/angar-dlya-avtoservisa/03.webp"
                alt="Монтаж ограждающих конструкций здания"
                fill
                sizes="(max-width: 899px) calc(100vw - 32px), 49vw"
                className={styles.envelopeImage}
              />
            </div>
          </div>
        </div>
      </section>

      <section className={styles.section} aria-labelledby="design-title">
        <div className="container">
          <div className={styles.designPanel}>
            <div className={styles.designCopy}>
              <SectionHeading id="design-title">
                Проектирование зданий из металлоконструкций
              </SectionHeading>
              <p>
                Проектные решения разрабатываются с учётом назначения здания, его
                размеров, конструктивной схемы и исходных данных площадки.
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

      <section className={styles.section} aria-labelledby="process-title">
        <div className="container">
          <SectionHeading id="process-title">От проекта до монтажа</SectionHeading>

          <ol className={styles.processList}>
            {processSteps.map((step, index) => (
              <li className={styles.processStep} key={step.title}>
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
        title="Реализованные объекты из металлоконструкций"
        projects={featuredProjects}
        allProjectsHref="/proekty"
        sectionId="realizovannye-obekty-iz-metallokonstrukciy"
      />

      <ContactCTA />
    </main>
  );
}
