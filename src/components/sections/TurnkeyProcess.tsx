import Image from "next/image";

import type { TurnkeyProcessContent } from "@/types/home";

import styles from "./TurnkeyProcess.module.css";

type TurnkeyProcessProps = {
  content: TurnkeyProcessContent;
};

function ProcessArrow() {
  return (
    <span className={styles.arrow} aria-hidden="true">
      <svg viewBox="0 0 24 16" fill="none">
        <path
          d="M2 8h18M15 3l5 5-5 5"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}

export function TurnkeyProcess({ content }: TurnkeyProcessProps) {
  return (
    <section className={styles.section} aria-labelledby="turnkey-process-title">
      <div className="container">
        <div className={styles.card}>
          <div className={styles.intro}>
            <div className={styles.illustration}>
              <Image
                src={content.illustrationSrc}
                alt=""
                width={128}
                height={128}
                aria-hidden="true"
              />
            </div>

            <div className={styles.introContent}>
              <h2 id="turnkey-process-title" className={styles.title}>
                {content.title}
              </h2>

              <p className={styles.description}>{content.description}</p>
            </div>
          </div>

          <ol className={styles.steps}>
            {content.steps.map((step, index) => (
              <li className={styles.stepItem} key={step.label}>
                <div className={styles.step}>
                  <Image
                    src={step.iconSrc}
                    alt=""
                    width={64}
                    height={64}
                    className={styles.stepIcon}
                    aria-hidden="true"
                  />

                  <span className={styles.stepLabel}>{step.label}</span>
                </div>

                {index < content.steps.length - 1 ? <ProcessArrow /> : null}
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
