import type { Metadata } from "next";
import { PytaniaJawnePageClient } from "@/components/panel/PytaniaJawnePageClient";

export const metadata: Metadata = {
  title: "Pytania jawne",
  description:
    "Oficjalna lista 76 pytań jawnych CKE na maturę ustną z języka polskiego 2026–2028.",
};

export default function PytaniaJawnePage() {
  return (
    <div className="border-b border-ink/15 bg-transparent">
      <PytaniaJawnePageClient />
    </div>
  );
}
