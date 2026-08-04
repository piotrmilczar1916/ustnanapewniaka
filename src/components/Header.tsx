"use client";

import Link from "next/link";
import { useState } from "react";
import { ButtonLink } from "@/components/ButtonLink";
import { useAuth } from "@/lib/auth/AuthProvider";

const NAV = [
  { href: "/#jak-dziala", label: "Jak działa" },
  { href: "/#komisja-ai", label: "Komisja AI" },
  { href: "/#cennik", label: "Cennik" },
  { href: "/#faq", label: "FAQ" },
];

export function Header() {
  const [open, setOpen] = useState(false);
  const { ready, session } = useAuth();

  return (
    <header className="sticky top-0 z-40 border-b-2 border-ink bg-paper/75 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link
          href="/"
          className="font-display text-xl font-extrabold uppercase tracking-tight text-ink sm:text-2xl"
        >
          Ustna<span className="text-stamp-red">NaPewniaka</span>
          <span className="text-graphite">.pl</span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex" aria-label="Główne">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-graphite transition-colors hover:text-ink"
            >
              {item.label}
            </Link>
          ))}
          {ready && session ? (
            <Link
              href="/panel"
              className="text-sm font-medium text-ink transition-colors hover:text-stamp-red"
            >
              Mój panel
            </Link>
          ) : (
            <Link
              href="/logowanie"
              className="text-sm font-medium text-graphite transition-colors hover:text-ink"
            >
              Zaloguj
            </Link>
          )}
          <ButtonLink href="/symulacja" size="sm">
            Symulator
          </ButtonLink>
        </nav>

        <button
          type="button"
          className="inline-flex min-h-11 min-w-11 items-center justify-center border-2 border-ink bg-paper shadow-[2px_2px_0_var(--ink)] md:hidden"
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? "Zamknij menu" : "Otwórz menu"}
          onClick={() => setOpen((v) => !v)}
        >
          <span className="font-mono text-sm">{open ? "✕" : "☰"}</span>
        </button>
      </div>

      {open ? (
        <nav
          id="mobile-nav"
          className="border-t-2 border-ink bg-paper-dim px-4 py-4 md:hidden"
          aria-label="Mobilne"
        >
          <ul className="flex flex-col gap-3">
            {NAV.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="block min-h-11 py-2 font-medium text-ink"
                  onClick={() => setOpen(false)}
                >
                  {item.label}
                </Link>
              </li>
            ))}
            <li>
              {ready && session ? (
                <Link
                  href="/panel"
                  className="block min-h-11 py-2 font-medium text-ink"
                  onClick={() => setOpen(false)}
                >
                  Mój panel
                </Link>
              ) : (
                <Link
                  href="/logowanie"
                  className="block min-h-11 py-2 font-medium text-ink"
                  onClick={() => setOpen(false)}
                >
                  Zaloguj
                </Link>
              )}
            </li>
            <li>
              <ButtonLink
                href="/symulacja"
                className="w-full"
                onClick={() => setOpen(false)}
              >
                Zrób symulację
              </ButtonLink>
            </li>
          </ul>
        </nav>
      ) : null}
    </header>
  );
}
