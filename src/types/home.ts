import type { MediaAsset } from "@/types/site";

export type HeroContent = {
  eyebrow?: string;
  title: string;
  description: string;
  image: MediaAsset | null;
};
