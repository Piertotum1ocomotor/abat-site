import { Advantages } from "@/components/sections/Advantages";
import { DirectionsServices } from "@/components/sections/DirectionsServices";
import { Hero } from "@/components/sections/Hero";
import { ProjectsShowcase } from "@/components/sections/ProjectsShowcase";
import { TurnkeyProcess } from "@/components/sections/TurnkeyProcess";
import {
  advantagesContent,
  directionsServicesContent,
  heroContent,
  projectsShowcaseContent,
  turnkeyProcessContent,
} from "@/content/home";

export default function HomePage() {
  return (
    <main>
      <Hero content={heroContent} />
      <TurnkeyProcess content={turnkeyProcessContent} />
      <DirectionsServices content={directionsServicesContent} />
      <Advantages content={advantagesContent} />
      <ProjectsShowcase content={projectsShowcaseContent} />
    </main>
  );
}
