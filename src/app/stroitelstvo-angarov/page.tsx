import type { Metadata } from "next";
import Image from "next/image";

import { DirectionHero } from "@/components/directions/DirectionHero";
import { DirectionProjects } from "@/components/directions/DirectionProjects";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { ContactCTA } from "@/components/sections/ContactCTA";
import { projects } from "@/content/projects";
import type { Project } from "@/types/projects";

import styles from "./AngarsPage.module.css";

export const metadata: Metadata = {
  title: "Строительство ангаров под ключ из металлоконструкций",
  description:
    "Строительство ангаров под ключ из металлоконструкций и сэндвич-панелей в Москве и Санкт-Петербурге. Проектирование, фундамент, изготовление и монтаж.",
};

const breadcrumbs = [
  { label: "Главная", href: "/" },
  { label: "Ангары" },
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
    title: "Полный цикл работ",
    description: "От проектирования до сдачи объекта.",
  },
  {
    title: "Гарантия 5 лет",
  },
] as const;

const hangarTypes = [
  {
    title: "Тёплые ангары",
    description:
      "Ангары на металлическом каркасе с ограждающими конструкциями из сэндвич-панелей.",
    imageSrc: "/images/projects/angar-dlya-avtoservisa/01.webp",
    imageAlt: "Тёплый ангар для автосервиса из сэндвич-панелей",
  },
  {
    title: "Складские ангары",
    description:
      "Здания для хранения материалов, оборудования, продукции и техники.",
    imageSrc: "/images/directions/warehouse.jpg",
    imageAlt: "Складское здание из металлоконструкций",
  },
  {
    title: "Ангары для СТО и автомобильные боксы",
    description:
      "Здания для ремонта и обслуживания легковой и грузовой техники.",
    imageSrc:
      "/images/projects/angar-dlya-avtoremontnyh-masterskih/01.webp",
    imageAlt: "Ангар для авторемонтных мастерских",
  },
  {
    title: "Быстровозводимые ангары",
    description:
      "Здания на металлическом каркасе для производственных, складских и других задач.",
    imageSrc: "/images/directions/angars/bystrovozvodimye.jpeg",
    imageAlt: "Монтаж металлического каркаса быстровозводимого ангара",
  },
] as const;

const workSteps = [
  { number: "1", title: "Проектирование" },
  { number: "2", title: "Геодезическое сопровождение" },
  {
    number: "3",
    title: "Фундамент",
    description:
      "Плита, сваи или ленточный фундамент — в соответствии с проектом.",
  },
  { number: "4", title: "Изготовление металлоконструкций" },
  { number: "5", title: "Монтаж металлического каркаса" },
  { number: "6", title: "Монтаж сэндвич-панелей" },
  { number: "7", title: "Окна и ворота" },
  { number: "8", title: "Инженерные системы" },
  { number: "9", title: "Сдача объекта" },
] as const;

const designSections = ["АР", "КР", "КМ", "КМД", "КЖ"] as const;

const hangarProjectSlugs = [
  "angar-dlya-avtoservisa",
  "angar-dlya-avtoremontnyh-masterskih",
] as const;

function getHangarProject(slug: (typeof hangarProjectSlugs)[number]): Project {
  const project = projects.find((entry) => entry.slug === slug);

  if (!project) {
    throw new Error(`Hangar project not found: ${slug}`);
  }

  return project;
}

const hangarProjects = hangarProjectSlugs.map(getHangarProject);

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

export default function AngarsPage() {
  return (
    <main className={styles.page}>
      <Breadcrumbs items={breadcrumbs} />

      <DirectionHero
        eyebrow="Строительство из металлоконструкций"
        title="Строительство ангаров под ключ"
        lead="Проектируем и строим ангары на металлическом каркасе для складов, производства, СТО, хранения техники и других задач. Выполняем комплекс работ от проектирования и устройства фундамента до изготовления и монтажа металлоконструкций, монтажа сэндвич-панелей и сдачи объекта."
        image={{
          src: "/images/directions/angars/hero.jpeg",
          alt: "Построенный ангар на металлическом каркасе",
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
              {"description" in fact ? (
                <p className={styles.factDescription}>{fact.description}</p>
              ) : null}
            </article>
          ))}
        </div>
      </section>

      <section
        className={styles.section}
        aria-labelledby="hangar-types-title"
      >
        <div className="container">
          <SectionHeading id="hangar-types-title">
            Какие ангары мы строим
          </SectionHeading>

          <div className={styles.typesGrid}>
            {hangarTypes.map((type) => (
              <article className={styles.typeCard} key={type.title}>
                <div className={styles.typeMedia}>
                  <Image
                    src={type.imageSrc}
                    alt={type.imageAlt}
                    fill
                    sizes="(max-width: 599px) calc(100vw - 32px), (max-width: 1199px) 50vw, 25vw"
                    className={styles.typeImage}
                  />
                </div>
                <div className={styles.typeContent}>
                  <h3 className={styles.typeTitle}>{type.title}</h3>
                  <p className={styles.typeDescription}>{type.description}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section
        className={styles.section}
        aria-labelledby="metal-hangars-title"
      >
        <div className={`container ${styles.feature}`}>
          <div className={styles.featureMedia}>
            <Image
              src="/images/projects/angar-dlya-avtoremontnyh-masterskih/02.webp"
              alt="Собранный металлический каркас ангара"
              fill
              sizes="(max-width: 767px) calc(100vw - 32px), 50vw"
              className={styles.featureImage}
            />
          </div>

          <div className={styles.featureContent}>
            <SectionHeading id="metal-hangars-title">
              Строительство ангаров из металлоконструкций
            </SectionHeading>
            <div className={styles.featureText}>
              <p>
                Основой ангара служит металлический каркас. Выполняем
                проектирование, изготовление и монтаж металлоконструкций с
                учётом назначения здания и исходных данных объекта.
              </p>
              <p>
                В состав каркаса в зависимости от проекта могут входить
                колонны, балки, фермы, рамы и другие металлические конструкции.
                До изготовления разрабатывается необходимая проектная
                документация.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section
        className={styles.section}
        aria-labelledby="panel-hangars-title"
      >
        <div className={`container ${styles.feature} ${styles.featureReverse}`}>
          <div className={styles.featureMedia}>
            <Image
              src="/images/projects/angar-dlya-avtoservisa/03.webp"
              alt="Монтаж сэндвич-панелей на металлическом каркасе ангара"
              fill
              sizes="(max-width: 767px) calc(100vw - 32px), 50vw"
              className={styles.featureImage}
            />
          </div>

          <div className={styles.featureContent}>
            <SectionHeading id="panel-hangars-title">
              Строительство ангаров из сэндвич-панелей
            </SectionHeading>
            <div className={styles.featureText}>
              <p>
                Для тёплых ангаров стены и кровля могут выполняться из
                сэндвич-панелей. Выполняем монтаж панелей в составе общего
                комплекса строительных работ.
              </p>
              <p>
                Такое решение применяется для складских зданий, СТО,
                автомобильных боксов, производственных и других объектов.
                Конструкция ограждающих элементов определяется проектом и
                назначением здания.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section
        className={styles.section}
        aria-labelledby="work-complex-title"
      >
        <div className="container">
          <SectionHeading id="work-complex-title">
            Комплекс работ по строительству ангара
          </SectionHeading>

          <ol className={styles.processGrid}>
            {workSteps.map((step) => (
              <li className={styles.processStep} key={step.number}>
                <span className={styles.processNumber}>{step.number}</span>
                <span className={styles.processTitle}>{step.title}</span>
                {"description" in step ? (
                  <p className={styles.processDescription}>
                    {step.description}
                  </p>
                ) : null}
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section
        className={styles.section}
        aria-labelledby="hangar-design-title"
      >
        <div className="container">
          <div className={styles.designCard}>
            <div className={styles.designIntro}>
              <SectionHeading id="hangar-design-title">
                Проектирование ангаров
              </SectionHeading>
              <p>
                До начала изготовления и монтажа разрабатываются проектные
                решения с учётом назначения здания, конструктивной схемы и
                исходных данных объекта.
              </p>
              <p>
                Выполняем разработку разделов АР, КР, КМ, КМД и КЖ. Также
                выполняется геодезическое сопровождение.
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

      <DirectionProjects
        title="Построенные ангары"
        projects={hangarProjects}
        allProjectsHref="/proekty"
      />

      <ContactCTA />
    </main>
  );
}
