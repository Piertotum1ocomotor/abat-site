import type { Metadata } from "next";
import Image from "next/image";

import { DirectionHero } from "@/components/directions/DirectionHero";
import { DirectionProjects } from "@/components/directions/DirectionProjects";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { ContactCTA } from "@/components/sections/ContactCTA";
import { projects } from "@/content/projects";
import type { Project } from "@/types/projects";

import styles from "./PrefabricatedBuildingsPage.module.css";

export const metadata: Metadata = {
  title: "Строительство быстровозводимых зданий под ключ",
  description:
    "Строительство быстровозводимых зданий из металлоконструкций и сэндвич-панелей в Москве и Санкт-Петербурге. Проектирование, изготовление и монтаж.",
};

const breadcrumbs = [
  { label: "Главная", href: "/" },
  { label: "Быстровозводимые здания" },
] as const;

const facts = [
  {
    title: "15 лет опыта",
    description: "Опыт работ с металлоизделиями.",
  },
  {
    title: "Проектирование",
    description: "АР, КР, КМ, КМД и КЖ.",
  },
  {
    title: "Металлический каркас",
    description: "Изготовление и монтаж конструкций.",
  },
  {
    title: "Геодезическое сопровождение",
    description: "В составе проектных и строительных работ.",
  },
] as const;

const buildingLayers = [
  {
    code: "A",
    title: "Основание",
    description:
      "Фундамент принимается в соответствии с проектом. В числе выполняемых вариантов — плита, сваи или ленточное основание.",
  },
  {
    code: "B",
    title: "Металлический каркас",
    description:
      "Колонны, фермы, балки, рамы и другие конструкции формируют несущую систему здания.",
  },
  {
    code: "C",
    title: "Ограждающие конструкции",
    description:
      "Стены и кровля могут выполняться с применением сэндвич-панелей.",
  },
  {
    code: "D",
    title: "Комплектация",
    description:
      "В проект могут входить окна, ворота и инженерные системы.",
  },
] as const;

const applications = [
  "Складские здания",
  "Производственные здания",
  "Ангары",
  "СТО и автомобильные боксы",
  "Модульные, временные и разборные сооружения",
] as const;

const buildingScope = [
  {
    title: "Фундамент",
    description:
      "Плита, сваи или ленточное основание — в соответствии с проектом.",
  },
  {
    title: "Металлоконструкции",
    description: "Изготовление и монтаж несущего каркаса.",
  },
  {
    title: "Ограждающие конструкции",
    description: "Монтаж стен и кровли.",
  },
  {
    title: "Окна и ворота",
    description: "В соответствии с проектным решением.",
  },
  {
    title: "Инженерные системы",
    description: "В составе согласованного комплекса работ.",
  },
] as const;

const designSections = ["АР", "КР", "КМ", "КМД", "КЖ"] as const;

const processSteps = [
  {
    number: "1",
    title: "Проектное решение",
    description:
      "Определяются назначение, конструктивная схема и состав объекта.",
  },
  {
    number: "2",
    title: "Подготовка основания",
    description: "Выполняется предусмотренный проектом фундамент.",
  },
  {
    number: "3",
    title: "Каркас здания",
    description: "Изготавливаются и монтируются металлические конструкции.",
  },
  {
    number: "4",
    title: "Завершение контура и оснащение",
    description:
      "Выполняются ограждающие конструкции и предусмотренная проектом комплектация.",
  },
] as const;

const featuredProjectSlugs = [
  "promyshlennoe-zdanie-2880",
  "angar-dlya-avtoremontnyh-masterskih",
] as const;

function getFeaturedProject(
  slug: (typeof featuredProjectSlugs)[number],
): Project {
  const project = projects.find((entry) => entry.slug === slug);

  if (!project) {
    throw new Error(`Prefabricated direction project not found: ${slug}`);
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

export default function PrefabricatedBuildingsPage() {
  return (
    <main className={styles.page}>
      <Breadcrumbs items={breadcrumbs} />

      <DirectionHero
        eyebrow="Строительство из металлоконструкций"
        title="Строительство быстровозводимых зданий под ключ"
        compactTitle
        lead="Проектируем, изготавливаем и монтируем быстровозводимые здания на металлическом каркасе. Конструктив, фундамент, ограждающие элементы и комплектация объекта определяются его назначением и проектными решениями."
        image={{
          src: "/images/directions/prefabricated/hero.jpeg",
          alt: "Металлический каркас здания на подготовленной плите",
          width: 1280,
          height: 576,
        }}
        cta={{ label: "Обсудить проект", href: "#contacts" }}
      />

      <section className={styles.factsSection} aria-label="Факты о компании">
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

      <section className={styles.section} aria-labelledby="building-system-title">
        <div className="container">
          <SectionHeading id="building-system-title">
            Как устроено быстровозводимое здание
          </SectionHeading>

          <div className={styles.systemLayout}>
            <div className={styles.systemMedia}>
              <Image
                src="/images/directions/angars/bystrovozvodimye.jpeg"
                alt="Несущая система быстровозводимого здания"
                fill
                sizes="(max-width: 899px) calc(100vw - 32px), 48vw"
                className={styles.systemImage}
              />
            </div>

            <ol className={styles.layerList}>
              {buildingLayers.map((layer) => (
                <li className={styles.layer} key={layer.code}>
                  <span className={styles.layerCode} aria-hidden="true">
                    {layer.code}
                  </span>
                  <div>
                    <h3>{layer.title}</h3>
                    <p>{layer.description}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <section className={styles.section} aria-labelledby="applications-title">
        <div className="container">
          <div className={styles.applicationsCard}>
            <div className={styles.applicationsIntro}>
              <SectionHeading id="applications-title">
                Где применяются быстровозводимые конструкции
              </SectionHeading>
              <p>
                Каркасные решения применяются для объектов разного назначения.
                Конкретная конструкция и комплектация определяются проектом;
                модульность или возможность разборки предусматриваются там,
                где это требуется исходными данными.
              </p>
            </div>

            <ul className={styles.applicationList}>
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

      <section className={styles.section} aria-labelledby="frame-envelope-title">
        <div className="container">
          <SectionHeading id="frame-envelope-title">
            Металлический каркас и ограждающие конструкции
          </SectionHeading>

          <div className={styles.envelopeLayout}>
            <div className={styles.frameMedia}>
              <Image
                src="/images/projects/promyshlennoe-zdanie-2880/01.webp"
                alt="Монтаж металлического каркаса промышленного здания"
                fill
                sizes="(max-width: 899px) calc(100vw - 32px), 58vw"
                className={styles.envelopeImage}
              />
            </div>

            <div className={styles.envelopeContent}>
              <div className={styles.envelopeText}>
                <span>01 / Несущая система</span>
                <p>
                  Металлический каркас проектируется с учётом назначения
                  здания, его размеров и исходных данных объекта. Выполняем
                  изготовление и монтаж металлоконструкций, включая колонны,
                  балки, фермы и рамы.
                </p>
              </div>

              <div className={styles.panelMedia}>
                <Image
                  src="/images/projects/angar-dlya-avtoremontnyh-masterskih/03.webp"
                  alt="Монтаж сэндвич-панелей на металлическом каркасе"
                  fill
                  sizes="(max-width: 899px) calc(100vw - 32px), 42vw"
                  className={styles.envelopeImage}
                />
              </div>

              <div className={styles.envelopeText}>
                <span>02 / Контур здания</span>
                <p>
                  Для стен и кровли могут применяться сэндвич-панели. Их
                  параметры и конструкция ограждающих элементов определяются
                  проектным решением.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.section} aria-labelledby="building-scope-title">
        <div className="container">
          <SectionHeading id="building-scope-title">
            Основание и комплектация здания
          </SectionHeading>

          <ol className={styles.scopeList}>
            {buildingScope.map((item, index) => (
              <li className={styles.scopeItem} key={item.title}>
                <span className={styles.scopeNumber} aria-hidden="true">
                  {index + 1}
                </span>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className={styles.section} aria-labelledby="prefabricated-design-title">
        <div className="container">
          <div className={styles.designLayout}>
            <div className={styles.designIntro}>
              <SectionHeading id="prefabricated-design-title">
                Проектирование быстровозводимых зданий
              </SectionHeading>
              <p>
                Проектные решения разрабатываются с учётом назначения объекта,
                конструктивной схемы, размеров здания и исходных данных
                площадки.
              </p>
              <p>
                Выполняем разработку разделов АР, КР, КМ, КМД и КЖ, а также
                геодезическое сопровождение.
              </p>
            </div>

            <ul className={styles.designSections} aria-label="Разделы проекта">
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

          <ol className={styles.processFlow}>
            {processSteps.map((step) => (
              <li className={styles.processStep} key={step.number}>
                <span className={styles.processNumber}>{step.number}</span>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <DirectionProjects
        title="Примеры объектов на металлическом каркасе"
        projects={featuredProjects}
        allProjectsHref="/proekty"
        sectionId="primery-obektov-na-metallokarkase"
      />

      <ContactCTA />
    </main>
  );
}
