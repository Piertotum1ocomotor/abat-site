import { siteConfig } from "@/content/site";
import type {
  AdvantagesContent,
  DirectionsServicesContent,
  HeroContent,
  ProjectsShowcaseContent,
  TurnkeyProcessContent,
} from "@/types/home";
import type { NavigationItem } from "@/types/site";

function getNavigationItem(
  items: readonly NavigationItem[],
  label: string,
): NavigationItem {
  const item = items.find((entry) => entry.label === label);

  if (!item) {
    throw new Error(`Navigation item not found: ${label}`);
  }

  return item;
}

const angars = getNavigationItem(siteConfig.headerNavigation, "Ангары");

const warehouses = getNavigationItem(siteConfig.headerNavigation, "Склады");

const fastBuildings = getNavigationItem(
  siteConfig.headerNavigation,
  "Быстровозводимые здания",
);

const industrialBuildings = getNavigationItem(
  siteConfig.headerNavigation,
  "Промышленные здания и производственные цеха",
);

const designService = getNavigationItem(
  siteConfig.headerServices,
  "Проектирование",
);

const manufacturingService = getNavigationItem(
  siteConfig.headerServices,
  "Изготовление металлоконструкций",
);

const installationService = getNavigationItem(
  siteConfig.headerServices,
  "Монтаж металлоконструкций",
);

const panelInstallationService = getNavigationItem(
  siteConfig.headerServices,
  "Монтаж сэндвич-панелей",
);

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

export const directionsServicesContent = {
  title: "Направления строительства",

  directions: [
    {
      title: angars.label,
      description:
        "Проектирование и строительство ангаров из металлоконструкций.",
      href: angars.href,
      isPlaceholder: angars.isPlaceholder,
      imageSrc: "/images/directions/angar.jpg",
      iconSrc: "/images/directions/angar-w.svg",
      variant: "primary",
    },
    {
      title: warehouses.label,
      description: "Строительство складских зданий для хранения и логистики.",
      href: warehouses.href,
      isPlaceholder: warehouses.isPlaceholder,
      imageSrc: "/images/directions/warehouse.jpg",
      iconSrc: "/images/directions/warehouse-w.svg",
      variant: "secondary",
    },
    {
      title: industrialBuildings.label,
      description:
        "Промышленные здания и производственные цеха под задачи предприятия.",
      href: industrialBuildings.href,
      isPlaceholder: industrialBuildings.isPlaceholder,
      imageSrc: "/images/directions/building.jpg",
      iconSrc: "/images/directions/factory-w.svg",
      variant: "secondary",
    },
    {
      title: fastBuildings.label,
      description:
        "Быстровозводимые здания для коммерческих и производственных задач.",
      href: fastBuildings.href,
      isPlaceholder: fastBuildings.isPlaceholder,
      iconSrc: "/images/directions/building-w.svg",
      variant: "accent",
    },
  ],

  servicesTitle: "Услуги",

  services: [
    {
      title: designService.label,
      href: designService.href,
      iconSrc: "/images/turnkey/design.svg",
      iconMode: "image",
    },
    {
      title: manufacturingService.label,
      href: manufacturingService.href,
      iconSrc: "/images/turnkey/manufacturing.svg",
      iconMode: "image",
    },
    {
      title: installationService.label,
      href: installationService.href,
      iconSrc: "/images/turnkey/installation.svg",
      iconMode: "image",
    },
    {
      title: panelInstallationService.label,
      href: panelInstallationService.href,
      iconSrc: "/images/services/pane-w.svg",
      iconMode: "mask",
    },
  ],
} satisfies DirectionsServicesContent;

export const advantagesContent = {
  title: "Преимущества",

  numeric: [
    {
      value: "15",
      label: "лет опыта",
      description:
        "Опыт проектирования и строительства зданий из металлоконструкций.",
      imageSrc: "/images/advantages/experience.png",
    },
    {
      value: "5",
      label: "лет гарантии",
      description: "Гарантия 5 лет.",
      imageSrc: "/images/advantages/warranty.png",
    },
  ],

  details: [
    {
      title: "Полный цикл работ",
      description:
        "Проектирование, изготовление металлоконструкций, монтаж и сдача объекта.",
      iconSrc: "/images/advantages/full-cycle.svg",
    },
    {
      title: "География работ",
      description:
        "Москва и Московская область, Санкт-Петербург и Северо-Запад.",
      iconSrc: "/images/advantages/geography.svg",
    },
  ],
} satisfies AdvantagesContent;

/*
 * Временные данные для визуальной разработки. Перед публикацией или передачей
 * клиенту заменить факты об объектах на проверенные данные заказчика.
 */
export const projectsShowcaseContent = {
  title: "Построенные объекты",
  allProjectsHref: "/proekty",
  projects: [
    {
      id: "warehouse",
      number: "01",
      title: "Складской комплекс",
      location: "Санкт-Петербург",
      area: "2 400 м²",
      works: ["Проектирование", "Изготовление", "Монтаж"],
      images: [
        {
          src: "/images/projects/warehouse/01.jpg",
          alt: "Монтаж стеновых панелей складского комплекса",
        },
        {
          src: "/images/projects/warehouse/02.jpg",
          alt: "Каркас складского комплекса на строительной площадке",
        },
        {
          src: "/images/projects/warehouse/03.jpg",
          alt: "Узел металлического каркаса складского комплекса",
        },
      ],
    },
    {
      id: "hangar",
      number: "02",
      title: "Ангар для хранения",
      location: "Московская область",
      area: "1 800 м²",
      works: ["Изготовление металлоконструкций", "Монтаж"],
      images: [
        {
          src: "/images/projects/hangar/01.jpg",
          alt: "Готовый ангар для хранения на строительной площадке",
        },
        {
          src: "/images/projects/hangar/02.jpg",
          alt: "Монтаж металлоконструкций ангара для хранения",
        },
        {
          src: "/images/projects/hangar/03.jpg",
          alt: "Монтаж конструкций ангара с подъёмной техникой",
        },
      ],
    },
    {
      id: "production",
      number: "03",
      title: "Производственный корпус",
      location: "Ленинградская область",
      area: "3 200 м²",
      works: ["Проектирование", "Изготовление", "Монтаж"],
      images: [
        {
          src: "/images/projects/production/01.jpg",
          alt: "Металлический каркас производственного корпуса",
        },
        {
          src: "/images/projects/production/02.jpg",
          alt: "Фасад производственного корпуса",
        },
        {
          src: "/images/projects/production/03.jpg",
          alt: "Внутреннее пространство производственного корпуса",
        },
      ],
    },
  ],
} satisfies ProjectsShowcaseContent;
