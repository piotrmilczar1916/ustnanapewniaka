import type { Metadata } from "next";
import { RegisterForm } from "@/components/auth/RegisterForm";

export const metadata: Metadata = {
  title: "Rejestracja",
  description: "Załóż konto w UstnaNaPewniaka.pl",
};

export default function RejestracjaPage() {
  return (
    <div className="border-b-2 border-ink bg-paper">
      <div className="mx-auto max-w-md px-4 py-12 sm:px-6 sm:py-16">
        <p className="font-mono text-xs uppercase tracking-[0.18em] text-graphite">
          Konto
        </p>
        <h1 className="mt-1 font-display text-3xl font-extrabold uppercase tracking-tight text-ink">
          Załóż konto
        </h1>
        <p className="mt-2 text-sm text-graphite">
          Darmowe konto zapisuje Twoje wyniki i odblokowuje Mój panel.
        </p>
        <div className="mt-8 border-2 border-ink bg-paper-dim p-5 shadow-[4px_4px_0_var(--ink)] sm:p-6">
          <RegisterForm />
        </div>
      </div>
    </div>
  );
}
