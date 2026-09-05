import type { Metadata } from "next";
import Image from "next/image";

import { DirectionHero } from "@/components/directions/DirectionHero";
import { DirectionProjects } from "@/components/directions/DirectionProjects";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { ContactCTA } from "@/components/sections/ContactCTA";
import { projects } from "@/content/projects";
import type { Project } from "@/types/projects";

import styles from "./SandwichPanelBuildingsPage.module.css";

export const metadata: Metadata = {
  title: "Строительство зданий из сэндвич-панелей",
  description:
    "Строительство зданий из сэндвич-панелей в Москве и Санкт-Петербурге. Металлический каркас, монтаж стен и кровли, окна, ворота и проектирование.",
};

const breadcrumbs = [
  { label: "Главная", href: "/" },
  { label: "Здания из сэндвич-панелей" },
] as const;

const facts = [
  {
    title: "15 лет опыта",
    description: "Опыт работ с металлоизделиями и строительными конструкциями.",
  },
  {
    title: "Металлический каркас",
    description: "Изготовление и монтаж металлоконструкций.",
  },
  {
    title: "Монтаж панелей",
    description: "Стены и кровля в соответствии с проектом.",
  },
  {
    title: "Проектирование",
    description: "АР, КР, КМ, КМД и КЖ.",
  },
] as const;

const envelopeElements = [
  {
    code: "A",
    title: "Металлический каркас",
    description:
      "Основа здания, на которую монтируются предусмотренные проектом ограждающие конструкции.",
  },
  {
    code: "B",
    title: "Стеновые панели",
    description:
      "Формируют наружные стены здания в соответствии с проектным решением.",
  },
  {
    code: "C",
    title: "Кровельные панели",
    description:
      "Применяются для устройства кровельного контура там, где это предусмотрено проектом.",
  },
  {
    code: "D",
    title: "Проёмы",
    description:
      "В конструкцию здания интегрируются предусмотренные проектом окна и ворота.",
  },
  {
    code: "E",
    title: "Инженерное оснащение",
    description:
      "В составе согласованного комплекса работ выполняются необходимые инженерные системы.",
  },
] as const;

const openings = ["Проёмы", "Окна", "Ворота"] as const;

const applications = [
  "Ангары",
  "Склады",
  "Производственные здания",
  "Промышленные здания",
  "СТО и автомобильные боксы",
  "Быстровозводимые здания",
] as const;

const designSections = ["АР", "КР", "КМ", "КМД", "КЖ"] as const;

const processSteps = [
  {
    title: "Подготовка металлического каркаса",
    description:
      "Несущие конструкции изготавливаются и монтируются в соответствии с проектом.",
  },
  {
    title: "Монтаж стен",
    description:
      "Устанавливаются предусмотренные проектом стеновые ограждающие конструкции.",
  },
  {
    title: "Устройство кровли",
    description:
      "Выполняется предусмотренный проектом кровельный контур здания.",
  },
  {
    title: "Проёмы и оснащение",
    description:
      "Устанавливаются окна, ворота и другие предусмотренные проектом элементы.",
  },
] as const;

const featuredProjectSlugs = [
  "angar-dlya-avtoservisa",
  "angar-dlya-avtoremontnyh-masterskih",
] as const;

function getFeaturedProject(
  slug: (typeof featuredProjectSlugs)[number],
): Project {
  const project = projects.find((entry) => entry.slug === slug);

  if (!project) {
    throw new Error(`Sandwich-panel direction project not found: ${slug}`);
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

export default function SandwichPanelBuildingsPage() {
  return (
    <main className={styles.page}>
      <Breadcrumbs items={breadcrumbs} />

      <DirectionHero
        eyebrow="Ограждающие конструкции"
        title="Строительство зданий из сэндвич-панелей"
        compactTitle
        lead="Строим здания на металлическом каркасе с ограждающими конструкциями из сэндвич-панелей. Выполняем проектирование, монтаж каркаса, стен и кровли, установку окон и ворот в составе проекта."
        image={{
          src: "/images/directions/sandwich-panels/hero-building-with-gates.jpeg",
          alt: "Здание с фасадом из сэндвич-панелей, окнами и воротами",
          width: 1280,
          height: 577,
        }}
        cta={{ label: "Обсудить проект", href: "#contacts" }}
      />

      <section className={styles.factsSection} aria-label="Факты о направлении">
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

      <section className={styles.section} aria-labelledby="envelope-title">
        <div className="container">
          <SectionHeading id="envelope-title">
            Из чего состоит контур здания
          </SectionHeading>

          <div className={styles.envelopeSystem}>
            <div className={styles.envelopeVisual}>
              <div className={styles.envelopeMedia}>
                <Image
                  src="/images/projects/angar-dlya-avtoremontnyh-masterskih/03.webp"
                  alt="Монтаж стеновых панелей на металлический каркас"
                  fill
                  sizes="(max-width: 899px) calc(100vw - 32px), 43vw"
                  className={styles.envelopeImage}
                />
              </div>
              <p>
                Наружный контур формируется как единая система: несущий каркас,
                ограждающие конструкции, проёмы и предусмотренное проектом
                оснащение связаны между собой.
              </p>
            </div>

            <ol className={styles.envelopeSequence}>
              {envelopeElements.map((element) => (
                <li className={styles.envelopeStep} key={element.code}>
                  <span className={styles.envelopeCode} aria-hidden="true">
                    {element.code}
                  </span>
                  <div>
                    <h3>{element.title}</h3>
                    <p>{element.description}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <section className={styles.section} aria-labelledby="wall-roof-title">
        <div className="container">
          <div className={styles.wallRoofLayout}>
            <div className={styles.wallRoofCopy}>
              <SectionHeading id="wall-roof-title">
                Стеновые и кровельные конструкции
              </SectionHeading>
              <p>
                Сэндвич-панели могут применяться для устройства наружных стен и
                кровли здания. Конкретные параметры ограждающих конструкций
                определяются проектом с учётом назначения объекта.
              </p>
              <p>
                Монтаж выполняется после подготовки несущего металлического
                каркаса и предусматривает устройство необходимого контура здания,
                проёмов и примыканий в рамках проектного решения.
              </p>

              <dl className={styles.wallRoofTypes}>
                <div>
                  <dt>01</dt>
                  <dd>Наружные стены</dd>
                </div>
                <div>
                  <dt>02</dt>
                  <dd>Кровельный контур</dd>
                </div>
              </dl>
            </div>

            <div className={styles.wallRoofMedia}>
              <Image
                src="/images/projects/angar-dlya-avtoservisa/03.webp"
                alt="Стеновые конструкции и металлический каркас здания"
                fill
                sizes="(max-width: 899px) calc(100vw - 32px), 48vw"
                className={styles.wallRoofImage}
              />
            </div>
          </div>
        </div>
      </section>

      <section className={styles.section} aria-labelledby="frame-panels-title">
        <div className="container">
          <div className={styles.framePanelBand}>
            <div className={styles.framePanelCopy}>
              <SectionHeading id="frame-panels-title">
                Металлический каркас и сэндвич-панели
              </SectionHeading>
              <p>
                Металлический каркас воспринимает предусмотренные проектом
                нагрузки и формирует несущую схему здания. Ограждающие конструкции
                из сэндвич-панелей монтируются на подготовленный каркас и формируют
                стены и кровлю объекта.
              </p>
              <p>
                АБАТ выполняет изготовление и монтаж металлических конструкций, а
                также монтаж ограждающих элементов в составе общего комплекса
                работ.
              </p>
            </div>

            <div className={styles.systemRelation} aria-label="Связь систем здания">
              <div>
                <span>01</span>
                <strong>Несущая схема</strong>
              </div>
              <span className={styles.relationArrow} aria-hidden="true">
                →
              </span>
              <div>
                <span>02</span>
                <strong>Наружный контур</strong>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.section} aria-labelledby="openings-title">
        <div className="container">
          <div className={styles.openingsPanel}>
            <div className={styles.openingsCopy}>
              <SectionHeading id="openings-title">
                Проёмы, окна и ворота
              </SectionHeading>
              <p>
                Расположение и размеры проёмов определяются проектом и назначением
                здания. В состав работ могут входить установка окон, ворот и
                других предусмотренных проектом элементов наружного контура.
              </p>
            </div>

            <ul className={styles.openingsList}>
              {openings.map((opening, index) => (
                <li key={opening}>
                  <span aria-hidden="true">{index + 1}</span>
                  {opening}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className={styles.section} aria-labelledby="applications-title">
        <div className="container">
          <SectionHeading id="applications-title">
            Где применяются здания из сэндвич-панелей
          </SectionHeading>

          <p className={styles.applicationsIntro}>
            Такое решение применяется для объектов разного назначения. Состав
            каркаса и наружного контура в каждом случае определяется проектом.
          </p>

          <ul className={styles.applicationsList}>
            {applications.map((application) => (
              <li key={application}>{application}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className={styles.section} aria-labelledby="design-title">
        <div className="container">
          <div className={styles.designLayout}>
            <div className={styles.designCopy}>
              <SectionHeading id="design-title">
                Проектирование зданий из сэндвич-панелей
              </SectionHeading>
              <p>
                Проектные решения формируются с учётом назначения здания,
                конструктивной схемы металлического каркаса, расположения проёмов
                и предусмотренных ограждающих конструкций.
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
          <SectionHeading id="process-title">
            От каркаса до готового контура
          </SectionHeading>

          <ol className={styles.processFlow}>
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
        title="Реализованные объекты с сэндвич-панелями"
        projects={featuredProjects}
        allProjectsHref="/proekty"
        sectionId="realizovannye-obekty-s-sendvich-panelyami"
      />

      <ContactCTA />
    </main>
  );
}
