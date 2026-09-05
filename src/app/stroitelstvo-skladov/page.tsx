import type { Metadata } from "next";
import Image from "next/image";

import { DirectionHero } from "@/components/directions/DirectionHero";
import { DirectionProjects } from "@/components/directions/DirectionProjects";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { ContactCTA } from "@/components/sections/ContactCTA";
import { projects } from "@/content/projects";
import type { Project } from "@/types/projects";

import styles from "./WarehousesPage.module.css";

export const metadata: Metadata = {
  title: "Строительство складов под ключ из металлоконструкций",
  description:
    "Строительство складов под ключ из металлоконструкций и сэндвич-панелей в Москве, Московской области и Санкт-Петербурге. Проектирование, фундамент, изготовление и монтаж.",
};

const breadcrumbs = [
  { label: "Главная", href: "/" },
  { label: "Склады" },
] as const;

const facts = [
  {
    title: "15 лет опыта",
    description:
      "Опыт работ с металлоизделиями и строительными конструкциями.",
  },
  {
    title: "Проектирование",
    description: "Разделы АР, КР, КМ, КМД и КЖ.",
  },
  {
    title: "Металлокаркас",
    description: "Изготовление и монтаж металлоконструкций.",
  },
  {
    title: "Полный комплекс работ",
    description: "От проекта и фундамента до монтажа здания.",
  },
] as const;

const warehouseTasks = [
  {
    code: "A",
    title: "Хранение материалов и оборудования",
    description:
      "Складские помещения для размещения материалов, оборудования, продукции и техники.",
  },
  {
    code: "B",
    title: "Производственные задачи",
    description:
      "Склад может быть частью производственного объекта или самостоятельным зданием.",
  },
  {
    code: "C",
    title: "Погрузка и транспорт",
    description:
      "Расположение и размеры ворот определяются с учётом проекта и эксплуатации объекта.",
  },
  {
    code: "D",
    title: "Инженерное оснащение",
    description:
      "При необходимости в состав работ входят инженерные системы, окна и ворота.",
  },
] as const;

const includedItems = [
  {
    title: "Фундамент",
    description:
      "Плита, сваи или ленточный фундамент — в соответствии с проектом.",
  },
  {
    title: "Металлический каркас",
    description: "Изготовление и монтаж металлоконструкций.",
  },
  {
    title: "Сэндвич-панели",
    description: "Стены и кровля в соответствии с проектным решением.",
  },
  {
    title: "Окна и ворота",
    description: "Расположение и параметры определяются проектом.",
  },
  {
    title: "Инженерные системы",
    description: "В составе согласованного комплекса работ.",
  },
] as const;

const designSections = ["АР", "КР", "КМ", "КМД", "КЖ"] as const;

const constructionStages = [
  {
    number: "1",
    title: "Исходные данные и проектирование",
    description: "Назначение здания, размеры и конструктивные решения.",
  },
  {
    number: "2",
    title: "Основание",
    description: "Устройство предусмотренного проектом фундамента.",
  },
  {
    number: "3",
    title: "Металлический каркас",
    description: "Изготовление и монтаж металлоконструкций.",
  },
  {
    number: "4",
    title: "Контур здания",
    description:
      "Монтаж стен, кровли, ворот и окон в соответствии с проектом.",
  },
  {
    number: "5",
    title: "Оснащение и завершение работ",
    description:
      "Инженерные системы и завершение предусмотренного комплекса работ.",
  },
] as const;

const warehouseProjectSlugs = [
  "promyshlennoe-zdanie-2880",
  "angar-dlya-avtoservisa",
] as const;

function getWarehouseProject(
  slug: (typeof warehouseProjectSlugs)[number],
): Project {
  const project = projects.find((entry) => entry.slug === slug);

  if (!project) {
    throw new Error(`Warehouse direction project not found: ${slug}`);
  }

  return project;
}

const warehouseProjects = warehouseProjectSlugs.map(getWarehouseProject);

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

export default function WarehousesPage() {
  return (
    <main className={styles.page}>
      <Breadcrumbs items={breadcrumbs} />

      <DirectionHero
        eyebrow="Строительство из металлоконструкций"
        title="Строительство складов под ключ"
        lead="Проектируем и строим складские здания на металлическом каркасе. Выполняем фундамент, изготовление и монтаж металлоконструкций, монтаж сэндвич-панелей, установку окон и ворот, а также инженерные работы в составе проекта."
        image={{
          src: "/images/directions/warehouse.jpg",
          alt: "Складское здание на металлическом каркасе",
          width: 1445,
          height: 801,
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

      <section className={styles.section} aria-labelledby="warehouse-task-title">
        <div className={`container ${styles.taskLayout}`}>
          <div className={styles.taskIntro}>
            <SectionHeading id="warehouse-task-title">
              Склад начинается с задачи объекта
            </SectionHeading>
            <p>
              Конструктив и комплектация склада зависят от назначения здания,
              его размеров и условий эксплуатации. На этапе проектирования
              определяются схема металлического каркаса, фундамент,
              ограждающие конструкции, расположение ворот, окон и инженерных
              систем.
            </p>
          </div>

          <div className={styles.taskGrid}>
            {warehouseTasks.map((task) => (
              <article className={styles.taskCell} key={task.code}>
                <span className={styles.taskCode} aria-hidden="true">
                  {task.code}
                </span>
                <h3>{task.title}</h3>
                <p>{task.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.section} aria-labelledby="warehouse-build-title">
        <div className="container">
          <SectionHeading id="warehouse-build-title">
            Склады из металлоконструкций и сэндвич-панелей
          </SectionHeading>

          <div className={styles.materialsGrid}>
            <article className={`${styles.materialCard} ${styles.frameCard}`}>
              <div className={styles.materialMedia}>
                <Image
                  src="/images/projects/angar-dlya-avtoservisa/02.webp"
                  alt="Металлический каркас здания на подготовленном основании"
                  fill
                  sizes="(max-width: 899px) calc(100vw - 32px), 58vw"
                  className={styles.materialImage}
                />
              </div>
              <div className={styles.materialContent}>
                <span className={styles.materialLabel}>Несущая система</span>
                <h3>Металлический каркас</h3>
                <p>
                  Основой складского здания может служить металлический каркас,
                  конструкция которого определяется проектом и назначением
                  объекта. Выполняем изготовление и монтаж металлоконструкций,
                  включая колонны, балки, фермы и рамы.
                </p>
              </div>
            </article>

            <article className={`${styles.materialCard} ${styles.panelCard}`}>
              <div className={styles.materialMedia}>
                <Image
                  src="/images/projects/promyshlennoe-zdanie-2880/05.webp"
                  alt="Фасад промышленного здания из сэндвич-панелей"
                  fill
                  sizes="(max-width: 899px) calc(100vw - 32px), 42vw"
                  className={styles.materialImage}
                />
              </div>
              <div className={styles.materialContent}>
                <span className={styles.materialLabel}>Контур здания</span>
                <h3>Сэндвич-панели</h3>
                <p>
                  Для устройства стен и кровли могут применяться
                  сэндвич-панели. Монтаж ограждающих конструкций выполняется в
                  составе общего комплекса работ.
                </p>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section className={styles.section} aria-labelledby="prefabricated-title">
        <div className={`container ${styles.prefabricatedCard}`}>
          <div className={styles.prefabricatedContent}>
            <SectionHeading id="prefabricated-title">
              Быстровозводимые складские здания
            </SectionHeading>
            <div className={styles.prefabricatedText}>
              <p>
                Металлический каркас применяется при строительстве складских
                зданий различного назначения. Конструкции изготавливаются по
                проекту и монтируются на подготовленном фундаменте, после чего
                выполняются ограждающие конструкции и дальнейшее оснащение
                объекта.
              </p>
              <p>
                Состав здания определяется исходными данными: назначением
                склада, размерами, конструктивной схемой, воротами и
                необходимыми инженерными системами.
              </p>
            </div>
          </div>

          <div className={styles.prefabricatedMedia}>
            <Image
              src="/images/directions/angars/bystrovozvodimye.jpeg"
              alt="Монтаж каркаса быстровозводимого здания"
              fill
              sizes="(max-width: 899px) calc(100vw - 32px), 54vw"
              className={styles.prefabricatedImage}
            />
          </div>
        </div>
      </section>

      <section className={styles.section} aria-labelledby="warehouse-scope-title">
        <div className="container">
          <SectionHeading id="warehouse-scope-title">
            Что может входить в складской объект
          </SectionHeading>

          <ol className={styles.technicalList}>
            {includedItems.map((item, index) => (
              <li className={styles.technicalItem} key={item.title}>
                <span className={styles.technicalNumber} aria-hidden="true">
                  {index + 1}
                </span>
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className={styles.section} aria-labelledby="warehouse-design-title">
        <div className="container">
          <div className={styles.designCard}>
            <div className={styles.designText}>
              <SectionHeading id="warehouse-design-title">
                Проектирование складских зданий
              </SectionHeading>
              <p>
                Проектные решения разрабатываются с учётом назначения объекта,
                конструктивной схемы и исходных данных площадки.
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

      <section className={styles.section} aria-labelledby="warehouse-stages-title">
        <div className="container">
          <SectionHeading id="warehouse-stages-title">
            Этапы строительства склада
          </SectionHeading>

          <ol className={styles.stagesGrid}>
            {constructionStages.map((stage) => (
              <li className={styles.stage} key={stage.number}>
                <span className={styles.stageNumber}>{stage.number}</span>
                <h3>{stage.title}</h3>
                <p>{stage.description}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <DirectionProjects
        title="Реализованные объекты на металлокаркасе"
        projects={warehouseProjects}
        allProjectsHref="/proekty"
        sectionId="realizovannye-obekty-na-metallokarkase"
      />

      <ContactCTA />
    </main>
  );
}
