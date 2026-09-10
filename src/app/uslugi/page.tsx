import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { DirectionProjects } from "@/components/directions/DirectionProjects";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { ContactCTA } from "@/components/sections/ContactCTA";
import { ServiceHero } from "@/components/services/ServiceHero";
import { projects } from "@/content/projects";
import type { Project } from "@/types/projects";

import styles from "./ServicesPage.module.css";

export const metadata: Metadata = {
  title: "Услуги: проектирование, изготовление и монтаж",
  description:
    "Проектирование промышленных зданий, изготовление и монтаж металлоконструкций, монтаж сэндвич-панелей в Москве и Санкт-Петербурге.",
};

const services = [
  {
    number: "01",
    title: "Проектирование",
    description:
      "Разрабатываем проектные решения и документацию для зданий и металлических конструкций.",
    href: "/uslugi/proektirovanie",
    stage: "Решение",
  },
  {
    number: "02",
    title: "Изготовление металлоконструкций",
    description:
      "Изготавливаем элементы металлических каркасов по проектной документации.",
    href: "/uslugi/izgotovlenie-metallokonstrukciy",
    stage: "Конструкции",
  },
  {
    number: "03",
    title: "Монтаж металлоконструкций",
    description:
      "Собираем колонны, балки, фермы и другие элементы в несущую систему здания.",
    href: "/uslugi/montazh-metallokonstrukciy",
    stage: "Каркас",
  },
  {
    number: "04",
    title: "Монтаж сэндвич-панелей",
    description:
      "Монтируем стеновые и кровельные панели, оформляем проёмы и примыкания.",
    href: "/uslugi/montazh-sendvich-paneley",
    stage: "Контур",
  },
] as const;

const directions = [
  { label: "Ангары", href: "/stroitelstvo-angarov" },
  { label: "Склады", href: "/stroitelstvo-skladov" },
  {
    label: "Быстровозводимые здания",
    href: "/bystrovozvodimye-zdaniya",
  },
  {
    label: "Здания из металлоконструкций",
    href: "/zdaniya-iz-metallokonstrukciy",
  },
  {
    label: "Здания из сэндвич-панелей",
    href: "/zdaniya-iz-sendvich-paneley",
  },
  {
    label: "Промышленные здания и производственные цеха",
    href: "/promyshlennye-zdaniya-i-proizvodstvennye-ceha",
  },
] as const;

const featuredProjectSlugs = [
  "promyshlennoe-zdanie-2880",
  "angar-dlya-avtoservisa",
] as const;

function getProject(slug: (typeof featuredProjectSlugs)[number]): Project {
  const project = projects.find((item) => item.slug === slug);

  if (!project) {
    throw new Error(`Services project not found: ${slug}`);
  }

  return project;
}

const featuredProjects = featuredProjectSlugs.map(getProject);

export default function ServicesPage() {
  return (
    <main className={styles.page}>
      <Breadcrumbs
        items={[
          { label: "Главная", href: "/" },
          { label: "Услуги" },
        ]}
      />

      <ServiceHero
        eyebrow="Полный цикл работ"
        title="Проектирование, изготовление и монтаж"
        compactTitle
        lead="Выполняем взаимосвязанные этапы работы с промышленными зданиями и металлоконструкциями: от проектного решения до металлического каркаса и ограждающего контура."
        image={{
          src: "/images/services/hero.webp",
          alt: "Промышленное здание с открытым металлическим каркасом и смонтированными сэндвич-панелями",
        }}
        note="Москва и Московская область · Санкт-Петербург и Северо-Запад"
      />

      <section className={styles.servicesSection} aria-labelledby="services-title">
        <div className="container">
          <div className={styles.sectionHeading}>
            <span className={styles.headingAccent} aria-hidden="true" />
            <div>
              <h2 id="services-title">Основные услуги</h2>
              <p>
                Каждое направление раскрывает отдельный вид работ, его состав и
                связь с другими этапами.
              </p>
            </div>
          </div>

          <div className={styles.serviceMap}>
            {services.map((service) => (
              <Link
                className={styles.serviceLink}
                href={service.href}
                key={service.href}
              >
                <span className={styles.serviceNumber}>{service.number}</span>
                <span className={styles.serviceStage}>{service.stage}</span>
                <h3>{service.title}</h3>
                <p>{service.description}</p>
                <span className={styles.more}>
                  Подробнее <span aria-hidden="true">→</span>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.cycleSection} aria-labelledby="cycle-title">
        <div className={`container ${styles.cycleLayout}`}>
          <div className={styles.cycleMedia}>
            <Image
              src="/images/services/work-cycle.webp"
              alt="Последовательность от проектной документации и элементов металлоконструкций до каркаса и готового здания"
              fill
              sizes="(max-width: 899px) calc(100vw - 32px), 52vw"
              className={styles.cycleImage}
            />
          </div>

          <div className={styles.cycleContent}>
            <span className={styles.kicker}>Единая последовательность</span>
            <h2 id="cycle-title">Полный цикл работ</h2>
            <p>
              Этапы связаны проектной документацией и общей логикой объекта.
              Состав работ определяется задачей и согласованным проектным
              решением.
            </p>
            <ol className={styles.cycleList}>
              {services.map((service) => (
                <li key={service.number}>
                  <span>{service.number}</span>
                  <strong>{service.title}</strong>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <section className={styles.directionsSection} aria-labelledby="directions-title">
        <div className={`container ${styles.directionsLayout}`}>
          <div className={styles.directionsIntro}>
            <span className={styles.headingAccent} aria-hidden="true" />
            <h2 id="directions-title">Где применяются эти работы</h2>
            <p>
              Услуги входят в строительство объектов разного назначения. Детали
              по типам зданий собраны в отдельных направлениях.
            </p>
          </div>
          <div className={styles.directionLinks}>
            {directions.map((direction, index) => (
              <Link href={direction.href} key={direction.href}>
                <span aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
                <strong>{direction.label}</strong>
                <span aria-hidden="true">↗</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <DirectionProjects
        title="Примеры завершённых объектов"
        projects={featuredProjects}
        allProjectsHref="/proekty"
        sectionId="primery-obektov"
      />

      <ContactCTA />
    </main>
  );
}
