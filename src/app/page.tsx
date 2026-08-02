import { FAQ } from "@/components/home/FAQ";
import { Features } from "@/components/home/Features";
import { Hero } from "@/components/home/Hero";
import { HowItWorks } from "@/components/home/HowItWorks";
import { KomisjaAI } from "@/components/home/KomisjaAI";
import { Opinie } from "@/components/home/Opinie";
import { Pricing } from "@/components/home/Pricing";

export default function HomePage() {
  return (
    <>
      <Hero />
      <HowItWorks />
      <KomisjaAI />
      <Features />
      <Opinie />
      <Pricing />
      <FAQ />
    </>
  );
}
