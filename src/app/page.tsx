import { Header } from "@/components/layout/Header";
import { Hero } from "@/components/sections/Hero";
import { heroContent } from "@/content/home";

export default function HomePage() {
  return (
    <>
      <Header />

      <main>
        <Hero content={heroContent} />
      </main>
    </>
  );
}
