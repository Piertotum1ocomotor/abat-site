export type NavigationItem = {
  label: string;
  href: string;
  isPlaceholder?: boolean;
};

export type HeaderNavigationItem = NavigationItem;

export type SiteAction = {
  label: string;
  href: string;
};

export type HeaderMessenger = {
  label: string;
  href?: string;
};

export type HeaderContacts = {
  location: string;
  phone: string;
  phoneHref?: string;
  messengers: readonly HeaderMessenger[];
};

export type ContactInfo = {
  phone?: string;
  email?: string;
  address?: string;
  workHours?: string;
};

export type SeoContent = {
  title: string;
  description: string;
  noIndex?: boolean;
};

export type MediaAsset = {
  src: string;
  alt: string;
  width: number;
  height: number;
};

export type SiteConfig = {
  key: string;
  name: string;
  locale: "ru-RU";

  homeLink: NavigationItem;

  headerNavigation: readonly NavigationItem[];
  headerServices: readonly NavigationItem[];
  headerSecondaryNavigation: readonly NavigationItem[];
  headerContacts: HeaderContacts;

  contacts: ContactInfo;
};
