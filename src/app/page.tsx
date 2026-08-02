import { FAQ } from "@/components/home/FAQ";
import { Hero } from "@/components/home/Hero";
import { HowItWorks } from "@/components/home/HowItWorks";
import { KomisjaAI } from "@/components/home/KomisjaAI";
import { Pricing } from "@/components/home/Pricing";

export default function HomePage() {
  return (
    <>
      <Hero />
      <HowItWorks />
      <KomisjaAI />
      <Pricing />
      <FAQ />
    </>
  );
}
