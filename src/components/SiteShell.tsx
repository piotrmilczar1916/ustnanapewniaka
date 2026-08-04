"use client";

import { AuthProvider } from "@/lib/auth/AuthProvider";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";

export function SiteShell({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <div className="relative isolate min-h-full">
        <div className="page-ambient-bg fixed inset-0 z-0" aria-hidden>
          <div className="ambient-blob ambient-blob-gold" />
          <div className="ambient-blob ambient-blob-red" />
          <div className="ambient-blob ambient-blob-ink" />
        </div>
        <div className="relative z-10 flex min-h-full flex-col">
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
      </div>
    </AuthProvider>
  );
}
