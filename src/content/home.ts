import type { HeroContent, TurnkeyProcessContent } from "@/types/home";

export const heroContent = {
  eyebrow: "Строительство из металлоконструкций",

  title: "Проектируем и строим здания из металлоконструкций",

  description:
    "Ангары, склады, производственные и быстровозводимые здания. Проектирование, изготовление, доставка и монтаж.",

  image: {
    src: "/images/hero/hero-building-v2.jpg",
    alt: "Промышленное здание из металлоконструкций",
    width: 1672,
    height: 941,
  },
} satisfies HeroContent;

export const turnkeyProcessContent = {
  title: "Строительство под ключ",

  description:
    "Выполняем основные этапы строительства — от проектирования и изготовления металлоконструкций до монтажа и сдачи готового объекта. За результат отвечает один подрядчик.",

  illustrationSrc: "/images/turnkey/turnkey-main.svg",

  steps: [
    {
      label: "Проектирование",
      iconSrc: "/images/turnkey/design.svg",
    },
    {
      label: "Изготовление металлоконструкций",
      iconSrc: "/images/turnkey/manufacturing.svg",
    },
    {
      label: "Монтаж",
      iconSrc: "/images/turnkey/installation.svg",
    },
    {
      label: "Сдача объекта",
      iconSrc: "/images/turnkey/handover.svg",
    },
  ],
} satisfies TurnkeyProcessContent;
