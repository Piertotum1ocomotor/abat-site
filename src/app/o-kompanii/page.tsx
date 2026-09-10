import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { AboutGallery } from "@/components/company/AboutGallery";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { ContactCTA } from "@/components/sections/ContactCTA";
import { projects } from "@/content/projects";
import type { Project, ProjectImage } from "@/types/projects";

import styles from "./AboutPage.module.css";

export const metadata: Metadata = {
  title: "О компании АБАТ — строительство промышленных зданий",
  description:
    "АБАТ — проектирование, изготовление и монтаж металлоконструкций, строительство промышленных и быстровозводимых зданий в Москве и Санкт-Петербурге.",
};

const facts = [
  { value: "15 лет", label: "опыта работы с металлоконструкциями" },
  { value: "5 лет", label: "гарантия" },
  { value: "НАКС", label: "сварщики с удостоверениями" },
  { value: "АР / КР / КМ / КМД / КЖ", label: "разделы проектирования" },
] as const;

const competencies = [
  { title: "Проектирование", href: "/uslugi/proektirovanie" },
  {
    title: "Изготовление металлоконструкций",
    href: "/uslugi/izgotovlenie-metallokonstrukciy",
  },
  {
    title: "Монтаж металлоконструкций",
    href: "/uslugi/montazh-metallokonstrukciy",
  },
  {
    title: "Монтаж сэндвич-панелей",
    href: "/uslugi/montazh-sendvich-paneley",
  },
] as const;

const gallerySelections = [
  ["promyshlennoe-zdanie-2880", 1],
  ["angar-dlya-avtoservisa", 0],
  ["zdanie-stolovoy-s-ofisami", 0],
  ["promyshlennoe-zdanie-2880", 3],
  ["kranovaya-estakada-5-tonn", 0],
  ["angar-dlya-avtoservisa", 3],
  ["zdanie-stolovoy-s-ofisami", 2],
  ["angar-dlya-avtoremontnyh-masterskih", 3],
] as const;

function getProject(slug: string): Project {
  const project = projects.find((item) => item.slug === slug);
  if (!project) throw new Error(`About page project not found: ${slug}`);
  return project;
}

function getGalleryImage(slug: string, imageIndex: number): ProjectImage {
  const image = getProject(slug).images[imageIndex];
  if (!image) throw new Error(`About gallery image not found: ${slug} #${imageIndex}`);
  return image;
}

const heroImage = getProject("promyshlennoe-zdanie-2880").images[0];
const galleryImages = gallerySelections.map(([slug, index]) => {
  return getGalleryImage(slug, index);
});

export default function AboutPage() {
  return (
    <main className={styles.page}>
      <Breadcrumbs
        items={[
          { label: "Главная", href: "/" },
          { label: "О компании" },
        ]}
      />

      <section className={styles.hero}>
        <div className={`container ${styles.heroLayout}`}>
          <div className={styles.heroContent}>
            <span className={styles.kicker}>Промышленное строительство</span>
            <h1>О компании АБАТ</h1>
            <p>
              Проектируем промышленные здания, работаем с металлическими
              конструкциями и выполняем монтажные работы в Москве,
              Московской области, Санкт-Петербурге и на Северо-Западе.
            </p>
          </div>
          <div className={styles.heroMedia}>
            <Image
              src={heroImage.src}
              alt={heroImage.alt}
              fill
              sizes="(max-width: 767px) calc(100vw - 32px), 52vw"
              className={styles.image}
              priority
            />
          </div>
        </div>
      </section>

      <section className={styles.introSection} aria-labelledby="company-focus-title">
        <div className={`container ${styles.introLayout}`}>
          <div>
            <span className={styles.accent} aria-hidden="true" />
            <h2 id="company-focus-title">Практический фокус</h2>
          </div>
          <div className={styles.introCopy}>
            <p>
              АБАТ объединяет проектирование, изготовление и монтаж
              металлоконструкций с работами по устройству ограждающего контура
              из сэндвич-панелей.
            </p>
            <p>
              Компетенции применяются при строительстве промышленных и
              производственных объектов, складов, ангаров и быстровозводимых
              зданий. Состав работ определяется задачей и проектной документацией.
            </p>
          </div>
        </div>
      </section>

      <section className={styles.factsSection} aria-label="Ключевые факты">
        <div className={`container ${styles.factsGrid}`}>
          {facts.map((fact) => (
            <div className={styles.fact} key={fact.value}>
              <strong>{fact.value}</strong>
              <span>{fact.label}</span>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.competenciesSection} aria-labelledby="competencies-title">
        <div className="container">
          <div className={styles.sectionHeading}>
            <span className={styles.accent} aria-hidden="true" />
            <h2 id="competencies-title">Основные компетенции</h2>
            <p>Ключевые направления работ собраны в разделе услуг.</p>
          </div>
          <div className={styles.competencyGrid}>
            {competencies.map((item, index) => (
              <Link href={item.href} key={item.href}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <strong>{item.title}</strong>
                <span aria-hidden="true">↗</span>
              </Link>
            ))}
          </div>
          <Link className={styles.textLink} href="/uslugi">
            Все услуги <span aria-hidden="true">→</span>
          </Link>
        </div>
      </section>

      <section className={styles.geographySection} aria-labelledby="geography-title">
        <div className={`container ${styles.geographyLayout}`}>
          <div>
            <span className={styles.kicker}>География работ</span>
            <h2 id="geography-title">Работаем в двух регионах</h2>
          </div>
          <div className={styles.regions}>
            <p>Москва и Московская область</p>
            <p>Санкт-Петербург и Северо-Запад</p>
          </div>
        </div>
      </section>

      <section className={styles.projectsTransition}>
        <div className={`container ${styles.projectsLayout}`}>
          <div>
            <span className={styles.accent} aria-hidden="true" />
            <h2>Реализованные объекты</h2>
            <p>
              В портфолио представлены промышленные здания, ангары,
              металлоконструкции и работы в условиях действующего производства.
            </p>
          </div>
          <Link href="/proekty">
            Смотреть проекты <span aria-hidden="true">→</span>
          </Link>
        </div>
      </section>

      <section className={styles.gallerySection} aria-labelledby="gallery-title">
        <div className="container">
          <div className={styles.sectionHeading}>
            <span className={styles.accent} aria-hidden="true" />
            <h2 id="gallery-title">Строительство в деталях</h2>
          </div>
          <AboutGallery images={galleryImages} />
        </div>
      </section>

      <ContactCTA />
    </main>
  );
}
