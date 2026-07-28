import type { SiteConfig } from "@/types/site";

export const siteConfig = {
  key: "abat",
  name: "Абат",
  locale: "ru-RU",

  homeLink: {
    label: "Главная",
    href: "/",
  },

  headerNavigation: [
    {
      type: "group",
      label: "Строительство",
      showInMediumHeader: true,
      showInCompactHeader: true,
      items: [
        {
          label: "Ангары",
          href: "/stroitelstvo-angarov",
        },
        {
          label: "Склады",
          href: "/stroitelstvo-skladov",
        },
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
      ],
    },
    {
      type: "group",
      label: "Услуги",
      showInMediumHeader: true,
      showInCompactHeader: true,
      items: [
        {
          label: "Проектирование",
          href: "/uslugi/proektirovanie",
        },
        {
          label: "Изготовление металлоконструкций",
          href: "/uslugi/izgotovlenie-metallokonstrukciy",
        },
        {
          label: "Монтаж металлоконструкций",
          href: "/uslugi/montazh-metallokonstrukciy",
        },
        {
          label: "Монтаж сэндвич-панелей",
          href: "/uslugi/montazh-sendvich-paneley",
        },
      ],
    },
    {
      type: "group",
      label: "Объекты",
      showInMediumHeader: true,
      showInCompactHeader: true,
      items: [
        {
          label: "Для склада",
          href: "/obekty#dlya-sklada",
        },
        {
          label: "Для производства",
          href: "/obekty#dlya-proizvodstva",
        },
        {
          label: "Для техники",
          href: "/obekty#dlya-tehniki",
        },
        {
          label: "Для СТО",
          href: "/obekty#dlya-sto",
        },
        {
          label: "Для сельского хозяйства",
          href: "/obekty#dlya-selskogo-hozyaystva",
        },
      ],
    },
    {
      type: "link",
      label: "Проекты",
      href: "/proekty",
    },
    {
      type: "link",
      label: "Цены",
      href: "/ceny",
    },
    {
      type: "link",
      label: "О компании",
      href: "/o-kompanii",
    },
    {
      type: "link",
      label: "Контакты",
      href: "/kontakty",
      showInCompactHeader: true,
    },
  ],

  headerAction: {
    label: "Рассчитать стоимость",
    href: "/#cost-estimate",
  },

  contacts: {},
} satisfies SiteConfig;
