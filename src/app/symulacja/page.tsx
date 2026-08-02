import type { Metadata } from "next";
import { Suspense } from "react";
import { SimulatorFlow } from "@/components/simulator/SimulatorFlow";

export const metadata: Metadata = {
  title: "Symulacja",
  description:
    "Pełny przebieg matury ustnej: losowanie pytania, przygotowanie, wypowiedź, pytania dodatkowe i ocena CKE.",
};

export default function SymulacjaPage() {
  return (
    <div className="border-b-2 border-ink bg-paper">
      <Suspense
        fallback={
          <div className="mx-auto max-w-3xl px-4 py-16 text-center font-mono text-sm text-graphite">
            Ładowanie symulacji…
          </div>
        }
      >
        <SimulatorFlow />
      </Suspense>
    </div>
  );
}
