import type { Metadata } from "next";
import { LoginForm } from "@/components/auth/LoginForm";

export const metadata: Metadata = {
  title: "Logowanie",
  description: "Zaloguj się do panelu UstnaNaPewniaka.pl",
};

export default function LogowaniePage() {
  return (
    <div className="border-b-2 border-ink bg-paper">
      <div className="mx-auto max-w-md px-4 py-12 sm:px-6 sm:py-16">
        <p className="font-mono text-xs uppercase tracking-[0.18em] text-graphite">
          Konto
        </p>
        <h1 className="mt-1 font-display text-3xl font-extrabold uppercase tracking-tight text-ink">
          Zaloguj się
        </h1>
        <p className="mt-2 text-sm text-graphite">
          Po zalogowaniu odblokujesz Mój panel z planem, postępami i wynikami.
        </p>
        <div className="mt-8 border-2 border-ink bg-paper-dim p-5 shadow-[4px_4px_0_var(--ink)] sm:p-6">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
