import type { SiteConfig } from '@/types/site'

export const siteConfig = {
  key: 'abat',
  name: 'Абат',
  locale: 'ru-RU',
  navigation: [
    {
      label: 'Главная',
      href: '/',
    },
    {
      label: 'Услуги',
      href: '/uslugi',
    },
    {
      label: 'Проекты',
      href: '/proekty',
    },
    {
      label: 'О компании',
      href: '/o-kompanii',
    },
    {
      label: 'Контакты',
      href: '/kontakty',
    },
  ],
  contacts: {},
} satisfies SiteConfig
