import type { MediaAsset } from "@/types/site";
import type { Project } from "@/types/projects";

export type HeroContent = {
  eyebrow?: string;
  title: string;
  description: string;
  highlights?: readonly string[];
  image: MediaAsset | null;
};

export type TurnkeyProcessStep = {
  label: string;
  iconSrc: string;
};

export type TurnkeyProcessContent = {
  title: string;
  description: string;
  illustrationSrc: string;
  steps: readonly TurnkeyProcessStep[];
};

export type DirectionCardVariant = "primary" | "secondary" | "accent";

export type DirectionCard = {
  title: string;
  description: string;
  href: string;
  isPlaceholder?: boolean;
  imageSrc?: string;
  iconSrc: string;
  variant: DirectionCardVariant;
};

export type ServiceCard = {
  title: string;
  href: string;
  iconSrc: string;
  iconMode?: "image" | "mask";
};

export type DirectionsServicesContent = {
  title: string;
  description?: string;
  directions: readonly DirectionCard[];
  servicesTitle: string;
  services: readonly ServiceCard[];
};

export type NumericAdvantage = {
  value: string;
  label: string;
  description: string;
  imageSrc: string;
};

export type DetailAdvantage = {
  title: string;
  description: string;
  iconSrc: string;
};

export type AdvantagesContent = {
  title: string;
  numeric: readonly NumericAdvantage[];
  details: readonly DetailAdvantage[];
};

export type ProjectsShowcaseContent = {
  title: string;
  allProjectsHref: string;
  projects: readonly Project[];
};
