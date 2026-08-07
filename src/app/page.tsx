import { Header } from "@/components/layout/Header";
import { Hero } from "@/components/sections/Hero";
import { TurnkeyProcess } from "@/components/sections/TurnkeyProcess";
import { heroContent, turnkeyProcessContent } from "@/content/home";

export default function HomePage() {
  return (
    <>
      <Header />

      <main>
        <Hero content={heroContent} />
        <TurnkeyProcess content={turnkeyProcessContent} />
      </main>
    </>
  );
}
