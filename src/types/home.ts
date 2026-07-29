import type { MediaAsset, SiteAction } from "@/types/site";

export type HeroContent = {
  eyebrow?: string;
  title: string;
  description: string;
  primaryAction: SiteAction;
  secondaryAction?: SiteAction;
  image: MediaAsset | null;
};
