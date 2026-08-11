import type { SiteConfig } from "@/types/site";

export const siteConfig: SiteConfig = {
  key: "abat",
  name: "Абат",
  locale: "ru-RU",

  homeLink: {
    label: "Главная",
    href: "/",
  },

  headerNavigation: [
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
    {
      label: "Промышленные здания и производственные цеха",
      href: "/promyshlennye-zdaniya-i-proizvodstvennye-ceha",
    },
  ],

  headerServices: [
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

  headerSecondaryNavigation: [
    {
      label: "Услуги",
      href: "/#uslugi",
    },
    {
      label: "Построенные объекты",
      href: "/proekty",
    },
    {
      label: "О компании",
      href: "/o-kompanii",
    },
    {
      label: "Контакты",
      href: "/kontakty",
    },
  ],

  headerContacts: {
    location: "Санкт-Петербург",
    phone: "+7 (***) ***-**-**",
    messengers: [
      {
        label: "Telegram",
      },
      {
        label: "WhatsApp",
      },
    ],
  },

  contacts: {},
};
