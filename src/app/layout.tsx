import type { Metadata } from "next";
import { Manrope } from "next/font/google";

import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";

import "./globals.css";

const manrope = Manrope({
  subsets: ["cyrillic", "latin"],
  display: "swap",
  variable: "--font-manrope",
});

export const metadata: Metadata = {
  title: {
    default: "Абат — металлоконструкции",
    template: "%s | Абат",
  },
  description:
    "Проектирование, изготовление, доставка и монтаж металлоконструкций.",
};

type RootLayoutProps = Readonly<{
  children: React.ReactNode;
}>;

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="ru" className={manrope.variable}>
      <body>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
