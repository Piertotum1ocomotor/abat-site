import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { DirectionProjects } from "@/components/directions/DirectionProjects";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { ContactCTA } from "@/components/sections/ContactCTA";
import { ServiceHero } from "@/components/services/ServiceHero";
import { projects } from "@/content/projects";
import type { Project } from "@/types/projects";

import styles from "./FabricationServicePage.module.css";

export const metadata: Metadata = {
  title: "Изготовление металлоконструкций на заказ",
  description:
    "Изготовление металлоконструкций для промышленных и производственных зданий в Москве и Санкт-Петербурге. Каркасы, колонны, балки, фермы и другие конструкции по проектной документации.",
};

const elements = [
  { code: "К", title: "Колонны", description: "Вертикальные элементы каркаса." },
  { code: "Б", title: "Балки", description: "Горизонтальные несущие элементы." },
  { code: "Ф", title: "Фермы", description: "Конструкции для перекрытия пролётов." },
  { code: "Р", title: "Рамы", description: "Элементы несущей схемы здания." },
  { code: "С", title: "Связи", description: "Элементы пространственной системы каркаса." },
  {
    code: "+",
    title: "Другие элементы",
    description: "Состав определяется проектной документацией.",
  },
] as const;

const process = [
  { title: "КМ / КМД", description: "Исходная документация на конструкции." },
  { title: "Подготовка", description: "Подготовка к изготовлению по документации." },
  { title: "Изготовление", description: "Формирование предусмотренных проектом элементов." },
  { title: "Контроль", description: "Проверка готовых конструкций перед передачей." },
  { title: "К монтажу", description: "Готовность элементов к следующему этапу работ." },
] as const;

const directions = [
  { label: "Здания из металлоконструкций", href: "/zdaniya-iz-metallokonstrukciy" },
  { label: "Промышленные здания", href: "/promyshlennye-zdaniya-i-proizvodstvennye-ceha" },
  { label: "Склады", href: "/stroitelstvo-skladov" },
  { label: "Ангары", href: "/stroitelstvo-angarov" },
] as const;

const featuredProjectSlugs = [
  "promyshlennoe-zdanie-2880",
  "kranovaya-estakada-5-tonn",
] as const;

function getProject(slug: (typeof featuredProjectSlugs)[number]): Project {
  const project = projects.find((item) => item.slug === slug);
  if (!project) throw new Error(`Fabrication service project not found: ${slug}`);
  return project;
}

const featuredProjects = featuredProjectSlugs.map(getProject);

export default function FabricationServicePage() {
  return (
    <main className={styles.page}>
      <Breadcrumbs
        items={[
          { label: "Главная", href: "/" },
          { label: "Услуги", href: "/uslugi" },
          { label: "Изготовление металлоконструкций" },
        ]}
      />

      <ServiceHero
        eyebrow="Работа по проектной документации"
        title="Изготовление металлоконструкций"
        lead="Изготавливаем колонны, балки, фермы, рамы, связи и другие элементы металлических каркасов. Геометрия и состав конструкций определяются проектной документацией."
        image={{
          src: "/images/services/izgotovlenie-metallokonstrukciy/hero.webp",
          alt: "Сварщик работает с элементом металлической балки",
        }}
        note="15 лет опыта работы с металлоизделиями · сварщики с удостоверениями НАКС"
      />

      <section className={styles.elementsSection} aria-labelledby="elements-title">
        <div className="container">
          <div className={styles.sectionHeading}>
            <span className={styles.accent} aria-hidden="true" />
            <div>
              <h2 id="elements-title">Что изготавливаем</h2>
              <p>Элементы работают вместе как части единой несущей системы.</p>
            </div>
          </div>
          <div className={styles.elementSystem}>
            {elements.map((element, index) => (
              <article className={styles.element} key={element.title}>
                <span className={styles.elementCode}>{element.code}</span>
                <span className={styles.elementIndex}>
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3>{element.title}</h3>
                <p>{element.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.processSection} aria-labelledby="process-title">
        <div className="container">
          <div className={styles.processHeading}>
            <span>Последовательность работ</span>
            <h2 id="process-title">От документации к готовым конструкциям</h2>
          </div>
          <ol className={styles.process}>
            {process.map((step, index) => (
              <li key={step.title}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className={styles.detailSection} aria-labelledby="detail-title">
        <div className={`container ${styles.detailLayout}`}>
          <div className={styles.detailCopy}>
            <span className={styles.accent} aria-hidden="true" />
            <h2 id="detail-title">Конструктивные узлы</h2>
            <p>
              Узлы объединяют отдельные элементы каркаса. Их исполнение следует
              проектной документации; конкретные решения зависят от конструкции
              и задачи объекта.
            </p>
            <p className={styles.imageNote}>
              Изображение показывает характерный стальной узел без привязки к
              конкретному проекту АБАТ.
            </p>
          </div>
          <div className={styles.detailMedia}>
            <Image
              src="/images/services/izgotovlenie-metallokonstrukciy/steel-connection.webp"
              alt="Соединение стальной балки с колонной на болтах и сварных элементах"
              fill
              sizes="(max-width: 899px) calc(100vw - 32px), 56vw"
              className={styles.image}
            />
          </div>
        </div>
      </section>

      <section className={styles.readySection} aria-labelledby="ready-title">
        <div className={`container ${styles.readyLayout}`}>
          <div className={styles.readyMedia}>
            <Image
              src="/images/services/izgotovlenie-metallokonstrukciy/ready-steel-elements.webp"
              alt="Готовые стальные колонны, балки и ферма на площадке хранения"
              fill
              sizes="(max-width: 899px) calc(100vw - 32px), 52vw"
              className={styles.image}
            />
          </div>
          <div className={styles.readyContent}>
            <span className={styles.kicker}>Следующий этап</span>
            <h2 id="ready-title">Конструкции готовы к монтажу</h2>
            <p>
              Готовые элементы передаются для сборки металлического каркаса на
              объекте. Изготовление и монтаж остаются отдельными видами работ,
              связанными общей документацией.
            </p>
            <Link href="/uslugi/montazh-metallokonstrukciy">
              Монтаж металлоконструкций <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </section>

      <section className={styles.applicationsSection} aria-labelledby="applications-title">
        <div className={`container ${styles.applicationsLayout}`}>
          <div>
            <span className={styles.accent} aria-hidden="true" />
            <h2 id="applications-title">Применение конструкций</h2>
            <p>
              Металлические элементы используются в зданиях и сооружениях
              разного назначения.
            </p>
          </div>
          <div className={styles.directionLinks}>
            {directions.map((direction) => (
              <Link href={direction.href} key={direction.href}>
                {direction.label} <span aria-hidden="true">↗</span>
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
