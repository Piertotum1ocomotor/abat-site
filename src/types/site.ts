export type NavigationItem = {
  label: string;
  href: string;
};

export type HeaderNavigationItem =
  | {
      type: "link";
      label: string;
      href: string;
      showInMediumHeader?: boolean;
      showInCompactHeader?: boolean;
    }
  | {
      type: "group";
      label: string;
      items: readonly NavigationItem[];
      showInMediumHeader?: boolean;
      showInCompactHeader?: boolean;
    };

export type SiteAction = {
  label: string;
  href: string;
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
  headerNavigation: readonly HeaderNavigationItem[];

  headerAction: SiteAction;
  contacts: ContactInfo;
};
