"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { PytaniaJawneList } from "@/components/panel/PytaniaJawneList";
import { useAuth } from "@/lib/auth/AuthProvider";

export function PytaniaJawnePageClient() {
  const { ready, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (ready && !user) {
      router.replace("/logowanie");
    }
  }, [ready, user, router]);

  if (!ready || !user) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center font-mono text-sm text-graphite">
        Sprawdzam logowanie…
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
      <PytaniaJawneList />
    </div>
  );
}
