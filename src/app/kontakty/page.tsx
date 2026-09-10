import type { Metadata } from "next";
import Link from "next/link";

import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { siteConfig } from "@/content/site";

import styles from "./ContactsPage.module.css";

export const metadata: Metadata = {
  title: "Контакты АБАТ",
  description:
    "Контакты компании АБАТ. Проектирование, изготовление и монтаж металлоконструкций, строительство промышленных зданий в Москве и Санкт-Петербурге.",
};

const preparationItems = [
  "Тип объекта",
  "Ориентировочные размеры или площадь",
  "Регион строительства",
  "Имеющаяся проектная документация, если она есть",
] as const;

export default function ContactsPage() {
  const { contacts, headerContacts } = siteConfig;
  const telegram = headerContacts.messengers.find(
    (messenger) => messenger.label === "Telegram",
  );
  const whatsapp = headerContacts.messengers.find(
    (messenger) => messenger.label === "WhatsApp",
  );

  return (
    <main className={styles.page}>
      <Breadcrumbs
        items={[
          { label: "Главная", href: "/" },
          { label: "Контакты" },
        ]}
      />

      <section className={styles.intro}>
        <div className="container">
          <span className={styles.kicker}>Обсуждение проекта</span>
          <h1>Контакты</h1>
          <p>
            Расскажите о задаче, типе объекта и регионе строительства — обсудим
            подходящий состав проектных, производственных и монтажных работ.
          </p>
        </div>
      </section>

      <section className={styles.contactsSection} aria-labelledby="contact-details-title">
        <div className={`container ${styles.contactsLayout}`}>
          <div className={styles.contactsHeading}>
            <span className={styles.accent} aria-hidden="true" />
            <h2 id="contact-details-title">Способы связи</h2>
            <p>Используйте удобный канал для первичного обсуждения задачи.</p>
          </div>

          <dl className={styles.contactList}>
            <div className={styles.contactRow}>
              <dt>Телефон</dt>
              <dd>
                {headerContacts.phoneHref ? (
                  <a href={headerContacts.phoneHref}>{headerContacts.phone}</a>
                ) : (
                  <span>{headerContacts.phone}</span>
                )}
              </dd>
            </div>
            <div className={styles.contactRow}>
              <dt>Telegram</dt>
              <dd>
                {telegram?.href ? <a href={telegram.href}>Написать в Telegram</a> : <span />}
              </dd>
            </div>
            <div className={styles.contactRow}>
              <dt>WhatsApp</dt>
              <dd>
                {whatsapp?.href ? <a href={whatsapp.href}>Написать в WhatsApp</a> : <span />}
              </dd>
            </div>
            <div className={styles.contactRow}>
              <dt>Email</dt>
              <dd>
                {contacts.email ? (
                  <a href={`mailto:${contacts.email}`}>{contacts.email}</a>
                ) : (
                  <span />
                )}
              </dd>
            </div>
            <div className={styles.contactRow}>
              <dt>Адрес</dt>
              <dd>{contacts.address ? <span>{contacts.address}</span> : <span />}</dd>
            </div>
          </dl>
        </div>
      </section>

      <section className={styles.geographySection} aria-labelledby="contact-geography-title">
        <div className={`container ${styles.geographyLayout}`}>
          <div>
            <span className={styles.kicker}>География работ</span>
            <h2 id="contact-geography-title">Регионы присутствия</h2>
          </div>
          <div className={styles.regions}>
            <p>Москва и Московская область</p>
            <p>Санкт-Петербург и Северо-Запад</p>
          </div>
        </div>
      </section>

      <section className={styles.preparationSection} aria-labelledby="preparation-title">
        <div className="container">
          <div className={styles.sectionHeading}>
            <span className={styles.accent} aria-hidden="true" />
            <h2 id="preparation-title">Что подготовить перед обращением</h2>
            <p>
              Эти сведения помогут быстрее понять задачу, но не являются
              обязательными для первого разговора.
            </p>
          </div>
          <ul className={styles.preparationList}>
            {preparationItems.map((item, index) => (
              <li key={item}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <strong>{item}</strong>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <nav className={styles.nextLinks} aria-label="Полезные разделы">
        <div className={`container ${styles.nextLinksInner}`}>
          <Link href="/uslugi">
            <span>Услуги</span>
            <span aria-hidden="true">→</span>
          </Link>
          <Link href="/proekty">
            <span>Построенные объекты</span>
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      </nav>
    </main>
  );
}
