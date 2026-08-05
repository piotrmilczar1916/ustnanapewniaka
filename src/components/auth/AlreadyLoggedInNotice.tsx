"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/Button";
import { ButtonLink } from "@/components/ButtonLink";
import { useAuth } from "@/lib/auth/AuthProvider";

export function AlreadyLoggedInNotice() {
  const { session, logout } = useAuth();
  const router = useRouter();

  if (!session) return null;

  return (
    <div className="space-y-4">
      <p className="border-2 border-success/30 bg-paper p-4 text-sm leading-relaxed text-ink">
        Jesteś już zalogowany jako{" "}
        <span className="font-medium">{session.email}</span>.
      </p>
      <div className="flex flex-col gap-3 sm:flex-row">
        <ButtonLink href="/panel" className="flex-1">
          Idź do panelu
        </ButtonLink>
        <Button
          variant="secondary"
          className="flex-1"
          onClick={() => {
            void logout().then(() => router.refresh());
          }}
        >
          Wyloguj się
        </Button>
      </div>
      <p className="text-center text-sm text-graphite">
        Chcesz użyć innego konta? Najpierw się wyloguj.
      </p>
    </div>
  );
}
