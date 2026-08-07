import type { MediaAsset } from "@/types/site";

export type HeroContent = {
  eyebrow?: string;
  title: string;
  description: string;
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
