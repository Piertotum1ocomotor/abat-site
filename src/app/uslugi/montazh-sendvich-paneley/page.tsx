import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { DirectionProjects } from "@/components/directions/DirectionProjects";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { ContactCTA } from "@/components/sections/ContactCTA";
import { ServiceHero } from "@/components/services/ServiceHero";
import { projects } from "@/content/projects";
import type { Project } from "@/types/projects";

import styles from "./PanelInstallationServicePage.module.css";

export const metadata: Metadata = {
  title: "Монтаж сэндвич-панелей стен и кровли",
  description:
    "Монтаж стеновых и кровельных сэндвич-панелей в Москве и Санкт-Петербурге. Монтаж панелей на металлический каркас, устройство стен, кровли и проёмов.",
};

const scope = [
  { code: "01", title: "Стеновые панели", description: "Формирование наружного контура здания по подготовленному каркасу." },
  { code: "02", title: "Кровельные панели", description: "Последовательный монтаж покрытия с учётом принятой схемы кровли." },
  { code: "03", title: "Проёмы", description: "Оформление участков ворот, дверей и окон в составе ограждающих конструкций." },
  { code: "04", title: "Узлы примыканий", description: "Устройство предусмотренных проектом соединений и доборных элементов." },
] as const;

const sequence = [
  "Готовый металлический каркас",
  "Монтаж стеновых панелей",
  "Монтаж кровельных панелей",
  "Формирование проёмов",
  "Устройство примыканий",
  "Готовый контур здания",
] as const;

const applications = [
  { label: "Здания из сэндвич-панелей", href: "/zdaniya-iz-sendvich-paneley" },
  { label: "Склады", href: "/stroitelstvo-skladov" },
  { label: "Ангары", href: "/stroitelstvo-angarov" },
  { label: "Быстровозводимые здания", href: "/bystrovozvodimye-zdaniya" },
] as const;

const featuredProjectSlugs = [
  "angar-dlya-avtoservisa",
  "angar-dlya-avtoremontnyh-masterskih",
] as const;

function getProject(slug: (typeof featuredProjectSlugs)[number]): Project {
  const project = projects.find((item) => item.slug === slug);
  if (!project) throw new Error(`Panel installation project not found: ${slug}`);
  return project;
}

const featuredProjects = featuredProjectSlugs.map(getProject);

export default function PanelInstallationServicePage() {
  return (
    <main className={styles.page}>
      <Breadcrumbs
        items={[
          { label: "Главная", href: "/" },
          { label: "Услуги", href: "/uslugi" },
          { label: "Монтаж сэндвич-панелей" },
        ]}
      />

      <ServiceHero
        eyebrow="Ограждающие конструкции"
        title="Монтаж сэндвич-панелей"
        lead="Монтируем стеновые и кровельные сэндвич-панели на подготовленный металлический каркас, формируем проёмы и выполняем предусмотренные проектом примыкания."
        image={{
          src: "/images/services/montazh-sendvich-paneley/hero.webp",
          alt: "Монтаж стеновой сэндвич-панели с использованием подъёмной техники",
        }}
        note="Стены · кровля · проёмы · примыкания"
      />

      <section className={styles.scopeSection} aria-labelledby="scope-title">
        <div className="container">
          <div className={styles.sectionHeading}>
            <span className={styles.accent} aria-hidden="true" />
            <div>
              <h2 id="scope-title">Что входит в монтаж</h2>
              <p>Основные части работ по устройству ограждающего контура здания.</p>
            </div>
          </div>
          <div className={styles.scopeGrid}>
            {scope.map((item) => (
              <article key={item.title}>
                <span>{item.code}</span>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.sequenceSection} aria-labelledby="sequence-title">
        <div className="container">
          <div className={styles.sequenceHeading}>
            <span>Технологическая последовательность</span>
            <h2 id="sequence-title">От каркаса к закрытому контуру</h2>
          </div>
          <ol className={styles.sequence}>
            {sequence.map((item, index) => (
              <li key={item}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <strong>{item}</strong>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className={styles.wallSection} aria-labelledby="walls-title">
        <div className={`container ${styles.wallLayout}`}>
          <div className={styles.wallMedia}>
            <Image
              src="/images/services/montazh-sendvich-paneley/hero.webp"
              alt="Монтаж стеновой сэндвич-панели на металлический каркас здания"
              fill
              sizes="(max-width: 767px) calc(100vw - 32px), 52vw"
              className={styles.image}
            />
          </div>
          <div className={styles.wallContent}>
            <span className={styles.accent} aria-hidden="true" />
            <h2 id="walls-title">Стеновые панели</h2>
            <div className={styles.wallCopy}>
              <p>
                Панели последовательно закрепляются на несущем каркасе, образуя
                наружные стены здания. Организация монтажа учитывает геометрию
                фасадов, расположение проёмов и проектные узлы.
              </p>
              <Link href="/zdaniya-iz-sendvich-paneley">
                Здания из сэндвич-панелей <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.detailSection} aria-labelledby="roof-title">
        <div className={`container ${styles.detailLayout}`}>
          <div className={styles.detailMedia}>
            <Image
              src="/images/services/montazh-sendvich-paneley/roof-panel-installation.webp"
              alt="Монтаж кровельных сэндвич-панелей на металлическом каркасе"
              fill
              sizes="(max-width: 767px) calc(100vw - 32px), 52vw"
              className={styles.image}
            />
          </div>
          <div className={styles.detailCopy}>
            <span>Кровельный контур</span>
            <h2 id="roof-title">Кровельные панели</h2>
            <p>
              Кровельные элементы укладываются в проектной последовательности и
              закрепляются к подготовленным конструкциям покрытия.
            </p>
          </div>
        </div>
      </section>

      <section className={styles.detailSection} aria-labelledby="junctions-title">
        <div className={`container ${styles.detailLayout} ${styles.detailReversed}`}>
          <div className={styles.detailMedia}>
            <Image
              src="/images/services/montazh-sendvich-paneley/openings-and-junctions.webp"
              alt="Работа у фасадного проёма и узла примыкания ограждающих конструкций"
              fill
              sizes="(max-width: 767px) calc(100vw - 32px), 52vw"
              className={styles.image}
            />
          </div>
          <div className={styles.detailCopy}>
            <span>Завершение контура</span>
            <h2 id="junctions-title">Проёмы и примыкания</h2>
            <p>
              После монтажа основных плоскостей оформляются зоны ворот, дверей и
              окон, а также предусмотренные проектом углы, стыки и примыкания.
            </p>
          </div>
        </div>
      </section>

      <section className={styles.applicationsSection} aria-labelledby="applications-title">
        <div className="container">
          <div className={styles.sectionHeading}>
            <span className={styles.accent} aria-hidden="true" />
            <div>
              <h2 id="applications-title">Для каких зданий</h2>
              <p>Направления, где сэндвич-панели формируют стены и кровлю.</p>
            </div>
          </div>
          <div className={styles.applicationLinks}>
            {applications.map((item, index) => (
              <Link href={item.href} key={item.href}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <strong>{item.label}</strong>
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
