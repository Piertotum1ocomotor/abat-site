import styles from "./PageIntro.module.css";

type PageIntroProps = {
  title: string;
  description?: string;
};

export function PageIntro({ title, description }: PageIntroProps) {
  return (
    <section className={styles.intro}>
      <div className="container">
        <span className={styles.accent} aria-hidden="true" />
        <h1 className={styles.title}>{title}</h1>
        {description ? (
          <p className={styles.description}>{description}</p>
        ) : null}
      </div>
    </section>
  );
}
